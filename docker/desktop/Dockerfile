# OS Virtual Computer Desktop Container
# Combines lightweight X11 desktop, noVNC/Selkies HTML5 streaming, and Chromium with CDP remote debugging.
FROM debian:bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive \
    LANG=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    DISPLAY=:1

# Install X11, Openbox, tint2, xterm, x11vnc, novnc, websockify, chromium, and utilities
RUN apt-get update && apt-get install -y --no-install-recommends \
    xvfb \
    openbox \
    tint2 \
    xterm \
    x11-xserver-utils \
    x11-utils \
    feh \
    x11vnc \
    novnc \
    websockify \
    xdotool \
    scrot \
    chromium \
    ca-certificates \
    curl \
    procps \
    net-tools \
    git \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Link novnc files if not in default location and ensure python symlink
RUN if [ ! -d "/usr/share/novnc" ] && [ -d "/usr/share/novnc-core" ]; then \
        ln -s /usr/share/novnc-core /usr/share/novnc; \
    fi && \
    if [ ! -f "/usr/bin/python" ] && [ -f "/usr/bin/python3" ]; then \
        ln -s /usr/bin/python3 /usr/bin/python; \
    fi

# Create non-root sandbox user `jarvis` (UID 1000) with isolated /workspace
RUN useradd -m -u 1000 -s /bin/bash jarvis && \
    mkdir -p /workspace /usr/share/backgrounds \
             /etc/xdg/openbox /root/.config/openbox /home/jarvis/.config/openbox \
             /etc/xdg/tint2 /root/.config/tint2 /home/jarvis/.config/tint2 && \
    chown -R jarvis:jarvis /workspace /home/jarvis && \
    chmod 777 /workspace

# Configure Openbox and tint2 desktop environment
COPY openbox/rc.xml /etc/xdg/openbox/rc.xml
COPY openbox/rc.xml /root/.config/openbox/rc.xml
COPY openbox/rc.xml /home/jarvis/.config/openbox/rc.xml
COPY openbox/menu.xml /etc/xdg/openbox/menu.xml
COPY openbox/menu.xml /root/.config/openbox/menu.xml
COPY openbox/menu.xml /home/jarvis/.config/menu.xml
COPY tint2/tint2rc /etc/xdg/tint2/tint2rc
COPY tint2/tint2rc /root/.config/tint2/tint2rc
COPY os_wallpaper.png /usr/share/backgrounds/os_wallpaper.png
COPY os_linux_wallpaper.png /usr/share/backgrounds/os_linux_wallpaper.png
RUN chown -R jarvis:jarvis /home/jarvis

WORKDIR /workspace

# Copy scripts and set permissions
COPY entrypoint.sh /entrypoint.sh
COPY cdp_bridge.py /cdp_bridge.py
RUN chmod +x /entrypoint.sh /cdp_bridge.py

# Ports:
# 6080: noVNC HTML5 stream viewer
# 9222: Chromium remote debugging (CDP) for Playwright
# 5900: Raw VNC
EXPOSE 6080 9222 5900

HEALTHCHECK --interval=5s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://127.0.0.1:6080/vnc.html && curl -f http://127.0.0.1:9222/json/version || exit 1

ENTRYPOINT ["/entrypoint.sh"]
