import subprocess
import time
import shutil

# 1. Minimize chromium windows
script = """
for wid in $(xdotool search --class chromium 2>/dev/null); do
    xdotool windowminimize $wid 2>/dev/null || true
done
"""
subprocess.run(["docker", "exec", "-e", "DISPLAY=:1", "os-virtual-desktop", "rm", "-f", "/tmp/scrot_wallpaper.png"])
subprocess.run(["docker", "exec", "-e", "DISPLAY=:1", "os-virtual-desktop", "feh", "--bg-fill", "/usr/share/backgrounds/os_wallpaper.png"])
subprocess.run(["docker", "exec", "-e", "DISPLAY=:1", "os-virtual-desktop", "bash", "-c", script])
time.sleep(1)

# 2. Take scrot
subprocess.run(["docker", "exec", "-e", "DISPLAY=:1", "os-virtual-desktop", "scrot", "-z", "/tmp/scrot_wallpaper.png"])
subprocess.run(["docker", "cp", "os-virtual-desktop:/tmp/scrot_wallpaper.png", "docker/desktop/scrot_wallpaper.png"])

# 3. Re-maximize chromium
unminimize_script = """
for wid in $(xdotool search --class chromium 2>/dev/null); do
    xdotool windowactivate $wid 2>/dev/null || true
    xdotool windowraise $wid 2>/dev/null || true
done
"""
subprocess.run(["docker", "exec", "-e", "DISPLAY=:1", "os-virtual-desktop", "bash", "-c", unminimize_script])
print("Done capturing wallpaper test.")
