from PIL import Image, ImageDraw, ImageFont
import os

WIDTH = 1280
HEIGHT = 800

# Base image with deep obsidian/navy gradient
img = Image.new("RGBA", (WIDTH, HEIGHT), (6, 11, 20, 255))
draw = ImageDraw.Draw(img)

# Deep gradient background
for y in range(HEIGHT):
    factor = y / HEIGHT
    r = int(6 + (12 - 6) * factor)
    g = int(11 + (22 - 11) * factor)
    b = int(20 + (38 - 20) * factor)
    draw.line([(0, y), (WIDTH, y)], fill=(r, g, b, 255))

# Subtle grid pattern (40px)
for x in range(0, WIDTH, 40):
    draw.line([(x, 0), (x, HEIGHT)], fill=(20, 36, 56, 120), width=1)
for y in range(0, HEIGHT, 40):
    draw.line([(0, y), (WIDTH, y)], fill=(20, 36, 56, 120), width=1)

# Fonts
try:
    font_title = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 26)
    font_subtitle = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 15)
    font_mono_bold = ImageFont.truetype("C:/Windows/Fonts/consolab.ttf", 14)
    font_mono = ImageFont.truetype("C:/Windows/Fonts/consola.ttf", 12)
    font_small = ImageFont.truetype("C:/Windows/Fonts/consola.ttf", 10)
except Exception:
    font_title = font_subtitle = font_mono_bold = font_mono = font_small = ImageFont.load_default()

# Central Card
card_w, card_h = 720, 310
card_x = (WIDTH - card_w) // 2
card_y = (HEIGHT - card_h) // 2 - 25

# Draw card background (frosted glass)
card_overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
c_draw = ImageDraw.Draw(card_overlay)
c_draw.rounded_rectangle(
    [card_x, card_y, card_x + card_w, card_y + card_h],
    radius=16,
    fill=(10, 18, 32, 240),
    outline=(0, 210, 255, 140),
    width=1
)
img = Image.alpha_composite(img, card_overlay)
draw = ImageDraw.Draw(img)

# Card inner divider line
draw.line([(card_x + 25, card_y + 75), (card_x + card_w - 25, card_y + 75)], fill=(0, 210, 255, 40), width=1)

# Terminal icon symbol `>_`
draw.rounded_rectangle([card_x + 30, card_y + 20, card_x + 75, card_y + 58], radius=8, fill=(0, 210, 255, 30), outline=(0, 210, 255, 140), width=1)
draw.text((card_x + 40, card_y + 27), ">_", fill=(0, 240, 255, 255), font=font_mono_bold)

# Card Title & Subtitle
draw.text((card_x + 92, card_y + 20), "DEBIAN GNU / LINUX 12 (BOOKWORM)", fill=(240, 246, 255, 255), font=font_title)
draw.text((card_x + 94, card_y + 51), "OS Linux Virtual Computer Sandbox · X11 Openbox Desktop", fill=(148, 163, 184, 255), font=font_subtitle)

# Badges inside Card
badges = [
    ("SYSTEM ARCH", "x86_64 Linux 6.x Container"),
    ("DESKTOP WM", "Openbox 3.6 + tint2 Panel"),
    ("STREAMING", "HTML5 noVNC / websockify (:6080)"),
    ("AUTOMATION", "Chromium CDP Remote Debug (:9222)"),
    ("WORKSPACE", "/workspace (Isolated Persistent)"),
    ("SANDBOX USER", "jarvis (UID 1000) · Non-Root")
]

col_w = 315
start_bx = card_x + 30
start_by = card_y + 95

for i, (label, val) in enumerate(badges):
    col = i % 2
    row = i // 2
    bx = start_bx + col * (col_w + 30)
    by = start_by + row * 62
    
    # Pill box
    draw.rounded_rectangle([bx, by, bx + col_w, by + 50], radius=8, fill=(16, 26, 44, 220), outline=(56, 189, 248, 60), width=1)
    # Accent indicator dot
    draw.ellipse([bx + 14, by + 16, bx + 20, by + 22], fill=(0, 240, 255, 240))
    # Label
    draw.text((bx + 28, by + 10), label, fill=(56, 189, 248, 255), font=font_small)
    # Value
    draw.text((bx + 28, by + 26), val, fill=(226, 232, 240, 255), font=font_mono)

# Top Bar Watermark
draw.text((30, 22), "OS LINUX VIRTUAL COMPUTER", fill=(0, 240, 255, 220), font=font_mono_bold)
draw.text((290, 23), "// LINUX ENVIRONMENT READY", fill=(16, 185, 129, 220), font=font_mono)

# Top-Right System Metrics
draw.text((WIDTH - 360, 23), "DISPLAY: :1 (1280x800) | NO-VNC: 6080", fill=(148, 163, 184, 180), font=font_mono)

# Bottom Instructions Watermark (above the 30px tint2 panel)
draw.text(
    (WIDTH // 2 - 270, HEIGHT - 52),
    "Right-click desktop for Application Menu  ·  xterm Terminal & Chromium ready",
    fill=(115, 135, 165, 220),
    font=font_mono
)

# Convert to RGB and save
final_img = img.convert("RGB")
os.makedirs("docker/desktop", exist_ok=True)
final_img.save("docker/desktop/os_linux_wallpaper.png", "PNG", quality=95)
print(f"Clean docker/desktop/os_linux_wallpaper.png generated ({final_img.size})")
