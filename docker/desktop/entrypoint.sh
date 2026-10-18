#!/usr/bin/env bash
set -e

DISPLAY_NUM=1
RESOLUTION=${RESOLUTION:-"1280x800x24"}
export DISPLAY=:${DISPLAY_NUM}

echo "=== Booting OS Virtual Desktop Container ==="
echo "Display: ${DISPLAY} | Resolution: ${RESOLUTION}"

# 1. Clean existing X locks
rm -f /tmp/.X${DISPLAY_NUM}-lock /tmp/.X11-unix/X${DISPLAY_NUM} 2>/dev/null || true

# 2. Start Xvfb (Virtual Frame Buffer) with DPMS and screen-saver permanently disabled (-s 0 -dpms)
echo "Starting Xvfb on display ${DISPLAY}..."
Xvfb :${DISPLAY_NUM} -screen 0 ${RESOLUTION} -ac +extension GLX +render -noreset -s 0 -dpms &
XVFB_PID=$!

# 3. Active polling for Xvfb readiness
echo "Waiting for Xvfb display ${DISPLAY} to become ready..."
for i in $(seq 1 30); do
    if xdpyinfo -display :${DISPLAY_NUM} >/dev/null 2>&1; then
        echo "Xvfb display :${DISPLAY_NUM} is ready."
        break
    fi
    sleep 0.1
done

# 4. Set OS Linux desktop wallpaper and disable screen saver blanking
echo "Configuring Linux desktop wallpaper and power management..."
if [ -f /usr/share/backgrounds/os_wallpaper.png ]; then
    feh --bg-fill /usr/share/backgrounds/os_wallpaper.png 2>/dev/null || xsetroot -solid "#0b1528"
elif [ -f /usr/share/backgrounds/os_linux_wallpaper.png ]; then
    feh --bg-fill /usr/share/backgrounds/os_linux_wallpaper.png 2>/dev/null || xsetroot -solid "#0b1528"
else
    xsetroot -solid "#0b1528"
fi
xset s off -dpms s noblank 2>/dev/null || true

# Initialize /workspace permissions for non-root agent execution
mkdir -p /workspace
chmod 777 /workspace 2>/dev/null || true

# 5. Start minimal Window Manager (Openbox)
echo "Starting Openbox window manager..."
mkdir -p /root/.config/openbox
[ -f /root/.config/openbox/rc.xml ] || cp /etc/xdg/openbox/rc.xml /root/.config/openbox/rc.xml 2>/dev/null || true
[ -f /root/.config/openbox/menu.xml ] || cp /etc/xdg/openbox/menu.xml /root/.config/openbox/menu.xml 2>/dev/null || true
openbox-session &
OPENBOX_PID=$!
sleep 0.5

# 6. Start tint2 desktop panel
echo "Starting tint2 desktop panel..."
mkdir -p /root/.config/tint2
[ -f /root/.config/tint2/tint2rc ] || cp /etc/xdg/tint2/tint2rc /root/.config/tint2/tint2rc 2>/dev/null || true
tint2 &
TINT2_PID=$!

# 7. Start VNC Server (x11vnc) with xrandr resize support
echo "Starting x11vnc on port 5900..."
x11vnc -display :${DISPLAY_NUM} -forever -shared -nopw -rfbport 5900 -xrandr resize -bg -o /var/log/x11vnc.log

# 8. Start WebSocket bridge (websockify / noVNC HTML5 stream) on port 6080
echo "Starting websockify on port 6080..."
websockify --web /usr/share/novnc 6080 localhost:5900 &
WEBSOCKIFY_PID=$!

# 9. Clean stale Chromium locks and crash flags
echo "Cleaning stale Chromium locks and preferences..."
rm -f /root/.config/chromium/Singleton* 2>/dev/null || true
if [ -f /root/.config/chromium/Default/Preferences ]; then
    sed -i 's/"exit_type":"Crashed"/"exit_type":"Normal"/g' /root/.config/chromium/Default/Preferences 2>/dev/null || true
    sed -i 's/"exited_cleanly":false/"exited_cleanly":true/g' /root/.config/chromium/Default/Preferences 2>/dev/null || true
fi

# 10. Start Chromium maximized on loopback port 9223
echo "Starting Chromium on 127.0.0.1:9223..."
chromium \
    --no-sandbox \
    --disable-dev-shm-usage \
    --disable-gpu \
    --no-first-run \
    --no-default-browser-check \
    --disable-session-crashed-bubble \
    --hide-crash-restore-bubble \
    --disable-features=Translate,OptimizationHints \
    --remote-debugging-port=9223 \
    --remote-allow-origins=* \
    --window-size=1280,770 \
    --window-position=0,0 \
    --start-maximized \
    --user-data-dir=/root/.config/chromium \
    "https://google.com" &
CHROMIUM_PID=$!

# 11. Background window placement & focus helper
(
    for attempt in $(seq 1 20); do
        sleep 0.5
        for WID in $(xdotool search --class "chromium" 2>/dev/null); do
            NAME=$(xdotool getwindowname "$WID" 2>/dev/null || true)
            if [ -n "$NAME" ] && [ "$NAME" != "chromium" ] && [ "$NAME" != "Chromium clipboard" ]; then
                echo "Ensuring Chromium window $WID is positioned and raised..."
                xdotool windowmove "$WID" 0 0 2>/dev/null || true
                xdotool windowsize "$WID" 1280 770 2>/dev/null || true
                xdotool windowactivate "$WID" 2>/dev/null || true
                xdotool windowraise "$WID" 2>/dev/null || true
                break 2
            fi
        done
    done
) &

# 12. Start transparent CDP bridge on 0.0.0.0:9222 -> 127.0.0.1:9223
echo "Starting CDP bridge on 0.0.0.0:9222 -> 127.0.0.1:9223..."
python3 /cdp_bridge.py &
BRIDGE_PID=$!

echo "=== OS Virtual Desktop Ready ==="
echo "HTML5 Stream: http://localhost:6080/vnc.html"
echo "Chromium CDP: http://localhost:9222/json/version"

# Keep container running and handle termination
trap "kill -TERM $CHROMIUM_PID $WEBSOCKIFY_PID $XVFB_PID $BRIDGE_PID $OPENBOX_PID $TINT2_PID 2>/dev/null || true" SIGTERM SIGINT
wait $CHROMIUM_PID $WEBSOCKIFY_PID
