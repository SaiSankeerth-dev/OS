"""SSRF Protection and Safe URL Validation for OS.

Enforces Section 3 of the Engineering Roadmap (1C - Secure web research URLs against SSRF).
Validates schemes, resolves hostnames, and blocks loopback, RFC 1918 private subnets,
link-local addresses, and cloud provider instance metadata endpoints (AWS, GCP, Azure, etc.).
Includes a redirect-validating HTTP handler to prevent SSRF via open redirects.
"""
from __future__ import annotations

import ipaddress
import logging
import socket
import urllib.error
import urllib.parse
import urllib.request
from typing import List, Optional, Tuple

log = logging.getLogger("os.security.ssrf")

ALLOWED_SCHEMES = {"http", "https"}

# Specific cloud provider metadata and link-local targets
BLOCKED_HOSTNAMES = {
    "localhost",
    "metadata",
    "metadata.google.internal",
    "instance-data",
    "169.254.169.254",
    "169.254.170.2",
    "fd00:ec2::254",
}

BLOCKED_IP_NETWORKS = [
    ipaddress.ip_network("127.0.0.0/8"),       # Loopback
    ipaddress.ip_network("10.0.0.0/8"),        # RFC 1918 Private
    ipaddress.ip_network("172.16.0.0/12"),     # RFC 1918 Private
    ipaddress.ip_network("192.168.0.0/16"),    # RFC 1918 Private
    ipaddress.ip_network("169.254.0.0/16"),    # Link-local / Cloud metadata
    ipaddress.ip_network("100.64.0.0/10"),     # Carrier-grade NAT
    ipaddress.ip_network("192.0.0.0/24"),      # IETF Protocol Assignments
    ipaddress.ip_network("192.0.2.0/24"),      # TEST-NET-1
    ipaddress.ip_network("198.51.100.0/24"),   # TEST-NET-2
    ipaddress.ip_network("203.0.113.0/24"),    # TEST-NET-3
    ipaddress.ip_network("224.0.0.0/4"),       # Multicast
    ipaddress.ip_network("240.0.0.0/4"),       # Reserved
    ipaddress.ip_network("0.0.0.0/8"),         # Current network (broadcast)
    # IPv6
    ipaddress.ip_network("::1/128"),           # Loopback
    ipaddress.ip_network("::/128"),            # Unspecified
    ipaddress.ip_network("fc00::/7"),          # Unique local address (private)
    ipaddress.ip_network("fe80::/10"),         # Link-local
    ipaddress.ip_network("ff00::/8"),          # Multicast
    ipaddress.ip_network("2001:db8::/32"),     # Documentation
]


def is_ip_blocked(ip_addr: ipaddress.IPv4Address | ipaddress.IPv6Address) -> Tuple[bool, str]:
    """Check if an IP address belongs to blocked/private/internal ranges."""
    if ip_addr.is_loopback:
        return True, f"Loopback address '{ip_addr}' is blocked."
    if ip_addr.is_private:
        return True, f"Private address '{ip_addr}' is blocked."
    if ip_addr.is_link_local:
        return True, f"Link-local address '{ip_addr}' is blocked."
    if ip_addr.is_multicast:
        return True, f"Multicast address '{ip_addr}' is blocked."
    if ip_addr.is_reserved:
        return True, f"Reserved address '{ip_addr}' is blocked."
    if ip_addr.is_unspecified:
        return True, f"Unspecified address '{ip_addr}' is blocked."

    for net in BLOCKED_IP_NETWORKS:
        if ip_addr in net:
            return True, f"Address '{ip_addr}' falls within blocked network {net}."

    return False, ""


def validate_url_safe(url: str) -> Tuple[bool, str, List[str]]:
    """Validate a URL against SSRF and return (is_safe, reason, resolved_ips).

    Checks:
    1. Valid HTTP/HTTPS scheme.
    2. No credentials embedded in the URL (user:pass@host).
    3. Hostname is not in explicit blocked names list.
    4. DNS resolution does not map to any private, loopback, or metadata IP.
    """
    clean_url = (url or "").strip()
    if not clean_url:
        return False, "URL cannot be empty.", []

    try:
        parsed = urllib.parse.urlsplit(clean_url)
    except Exception as e:
        return False, f"Malformed URL: {e}", []

    scheme = parsed.scheme.lower()
    if scheme not in ALLOWED_SCHEMES:
        return False, f"Scheme '{scheme}' is not allowed. Only HTTP and HTTPS are permitted.", []

    if parsed.username or parsed.password:
        return False, "Embedded credentials in URLs are prohibited.", []

    hostname = (parsed.hostname or "").lower().strip()
    if not hostname:
        return False, "URL hostname is missing.", []

    if hostname in BLOCKED_HOSTNAMES:
        return False, f"Hostname '{hostname}' is an internal or metadata endpoint.", []

    if hostname.endswith(".localhost") or hostname.endswith(".local") or hostname.endswith(".internal"):
        return False, f"Internal domain name '{hostname}' is blocked.", []

    # Check if hostname is already a raw IP literal
    try:
        raw_ip = ipaddress.ip_address(hostname)
        blocked, reason = is_ip_blocked(raw_ip)
        if blocked:
            return False, reason, [str(raw_ip)]
        return True, "Safe IP", [str(raw_ip)]
    except ValueError:
        pass  # Hostname is a domain name, proceed to DNS resolution

    # DNS Resolution
    port = parsed.port or (443 if scheme == "https" else 80)
    resolved_ips: List[str] = []
    try:
        addr_infos = socket.getaddrinfo(hostname, port, proto=socket.IPPROTO_TCP)
        for ai in addr_infos:
            ip_str = ai[4][0]
            if ip_str not in resolved_ips:
                resolved_ips.append(ip_str)
    except socket.gaierror as e:
        return False, f"DNS resolution failed for '{hostname}': {e}", []
    except Exception as e:
        return False, f"Host resolution error for '{hostname}': {e}", []

    if not resolved_ips:
        return False, f"DNS resolution returned 0 IP addresses for '{hostname}'.", []

    for ip_str in resolved_ips:
        try:
            ip_obj = ipaddress.ip_address(ip_str)
            blocked, reason = is_ip_blocked(ip_obj)
            if blocked:
                log.warning("SSRF block: %s resolved to %s (%s)", hostname, ip_str, reason)
                return False, f"SSRF blocked: Hostname '{hostname}' resolves to restricted IP {ip_str} ({reason}).", resolved_ips
        except ValueError:
            return False, f"Invalid resolved IP '{ip_str}'.", resolved_ips

    return True, "Safe URL", resolved_ips


class SafeRedirectHandler(urllib.request.HTTPRedirectHandler):
    """HTTP redirect handler that validates destination URLs against SSRF before following."""

    def __init__(self, max_redirects: int = 5):
        super().__init__()
        self.max_redirects = max_redirects
        self.redirect_count = 0

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        self.redirect_count += 1
        if self.redirect_count > self.max_redirects:
            raise urllib.error.HTTPError(
                req.full_url, code, f"Exceeded maximum redirect limit ({self.max_redirects})", headers, fp
            )

        # Validate the new URL
        is_safe, reason, _ = validate_url_safe(newurl)
        if not is_safe:
            log.warning("SSRF redirect blocked: %s -> %s (%s)", req.full_url, newurl, reason)
            raise urllib.error.HTTPError(
                req.full_url, 403, f"SSRF Protection blocked redirect to: {reason}", headers, fp
            )

        return super().redirect_request(req, fp, code, msg, headers, newurl)


def build_safe_opener(timeout: float = 15.0) -> urllib.request.OpenerDirector:
    """Builds a urllib opener director with SSRF-safe redirect validation."""
    return urllib.request.build_opener(SafeRedirectHandler())
