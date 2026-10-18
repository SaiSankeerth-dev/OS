import urllib.request
import hashlib
import re
import time
import sys

def check_asset(url):
    print(f"\n[GET] {url}")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    t0 = time.time()
    with urllib.request.urlopen(req, timeout=15) as resp:
        headers = dict(resp.getheaders())
        status = resp.status
        content_len_header = headers.get('content-length')
        content_type = headers.get('content-type')
        
        chunks = []
        total_bytes = 0
        while True:
            chunk = resp.read(65536)
            if not chunk:
                break
            chunks.append(chunk)
            total_bytes += len(chunk)
            # print progress
            sys.stdout.write(f"\r  Read {total_bytes} bytes (chunks: {len(chunks)})...")
            sys.stdout.flush()
        print()
        
        elapsed = time.time() - t0
        body = b''.join(chunks)
        sha = hashlib.sha256(body).hexdigest()
        print(f"  Status: {status}")
        print(f"  Content-Type: {content_type}")
        print(f"  Header Content-Length: {content_len_header}")
        print(f"  Actual Bytes Read: {len(body)}")
        print(f"  SHA-256: {sha}")
        print(f"  Transfer Time: {elapsed:.3f}s")
        if content_len_header:
            expected = int(content_len_header)
            if len(body) != expected:
                print(f"  [ERROR] Incomplete transfer! Expected {expected}, got {len(body)} (diff: {expected - len(body)})")
            else:
                print(f"  [OK] Transfer complete and byte-exact.")
        return body

def main():
    root_url = "http://127.0.0.1:3000/"
    html_bytes = check_asset(root_url)
    html = html_bytes.decode('utf-8', errors='ignore')
    
    # Find all script and link tags
    assets = re.findall(r'(?:src|href)=["\'](/assets/[^"\']+)["\']', html)
    print(f"\nDiscovered {len(assets)} assets in HTML:")
    for a in assets:
        print(f" - {a}")
        
    for a in assets:
        check_asset("http://127.0.0.1:3000" + a)

if __name__ == '__main__':
    main()
