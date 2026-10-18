"""Generate 5 curated aesthetic landscape wallpapers for OS.
Resolution: 1280x800 (native virtual desktop resolution).
Wallpapers:
1. cinematic-mountain: Twilight night, distant peaks, sapphire atmospheric glow
2. aurora-borealis: Ethereal emerald & cyan curtains over midnight fjords
3. abstract-gradient: Apple-inspired dynamic mesh gradient with deep sapphire and violet
4. minimalist-desert: Sculptural dark dunes with delicate crest highlights
5. warm-sunset: Rich amber, rosewater, and mauve twilight sinking into navy horizons
"""
import math
import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

WIDTH = 1280
HEIGHT = 800

def create_mountain_wallpaper() -> Image.Image:
    img = Image.new("RGB", (WIDTH, HEIGHT), (10, 14, 26))
    draw = ImageDraw.Draw(img)
    
    # Sky gradient: deep indigo to twilight navy
    for y in range(int(HEIGHT * 0.7)):
        t = y / (HEIGHT * 0.7)
        r = int(7 + (22 - 7) * t)
        g = int(10 + (32 - 10) * t)
        b = int(24 + (58 - 24) * t)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))
        
    # Stars
    import random
    rng = random.Random(42)
    for _ in range(140):
        sx = rng.randint(0, WIDTH - 1)
        sy = rng.randint(0, int(HEIGHT * 0.55))
        brightness = rng.randint(140, 255)
        size = rng.choice([1, 1, 1, 2])
        if size == 1:
            draw.point((sx, sy), fill=(brightness, brightness, min(255, brightness + 20)))
        else:
            draw.rectangle([sx, sy, sx + 1, sy + 1], fill=(brightness, brightness, min(255, brightness + 20)))
            
    # Distant peaks (soft haze)
    distant_peaks = []
    for x in range(0, WIDTH + 20, 20):
        # compound sine waves for natural ridges
        elevation = (
            math.sin(x * 0.005) * 80 +
            math.sin(x * 0.012 + 1.2) * 50 +
            math.cos(x * 0.024) * 25
        )
        distant_peaks.append((x, int(HEIGHT * 0.48 - elevation)))
    distant_peaks.append((WIDTH, HEIGHT))
    distant_peaks.append((0, HEIGHT))
    draw.polygon(distant_peaks, fill=(24, 38, 66))

    # Mid-range mountains (sharper, darker)
    mid_peaks = []
    for x in range(0, WIDTH + 15, 15):
        elevation = (
            math.sin(x * 0.007 + 0.8) * 110 +
            math.sin(x * 0.018 + 2.5) * 60 +
            math.cos(x * 0.035) * 35
        )
        mid_peaks.append((x, int(HEIGHT * 0.58 - elevation)))
    mid_peaks.append((WIDTH, HEIGHT))
    mid_peaks.append((0, HEIGHT))
    draw.polygon(mid_peaks, fill=(16, 26, 46))
    
    # Fore-peaks (steep, deep navy)
    fore_peaks = []
    for x in range(0, WIDTH + 10, 10):
        elevation = (
            math.sin(x * 0.009 + 2.1) * 130 +
            math.sin(x * 0.022 + 0.4) * 75 +
            math.cos(x * 0.045) * 30
        )
        fore_peaks.append((x, int(HEIGHT * 0.72 - elevation)))
    fore_peaks.append((WIDTH, HEIGHT))
    fore_peaks.append((0, HEIGHT))
    draw.polygon(fore_peaks, fill=(10, 17, 30))
    
    # Valley mist overlay
    mist = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    mdraw = ImageDraw.Draw(mist)
    for y in range(int(HEIGHT * 0.65), HEIGHT):
        t = (y - HEIGHT * 0.65) / (HEIGHT * 0.35)
        alpha = int(45 * (1 - abs(t - 0.4) * 2))
        mdraw.line([(0, y), (WIDTH, y)], fill=(80, 140, 210, max(0, alpha)))
    
    img = Image.alpha_composite(img.convert("RGBA"), mist).convert("RGB")
    return img

def create_aurora_wallpaper() -> Image.Image:
    img = Image.new("RGB", (WIDTH, HEIGHT), (5, 8, 16))
    draw = ImageDraw.Draw(img)
    
    # Night sky
    for y in range(HEIGHT):
        t = y / HEIGHT
        r = int(4 + 8 * t)
        g = int(7 + 14 * t)
        b = int(14 + 28 * t)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))
        
    # Aurora light layers
    aurora_canvas = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    adraw = ImageDraw.Draw(aurora_canvas)
    
    # Ribbon 1: Cyan-emerald wave
    for x in range(WIDTH):
        wave1 = math.sin(x * 0.006) * 70 + math.sin(x * 0.015) * 40
        y_center = int(HEIGHT * 0.32 + wave1)
        for dy in range(-60, 60):
            dist = abs(dy) / 60.0
            alpha = int(70 * (1 - dist ** 1.5))
            adraw.point((x, y_center + dy), fill=(20, 230, 160, max(0, alpha)))
            
    # Ribbon 2: Electric violet-cyan upper fringe
    for x in range(WIDTH):
        wave2 = math.cos(x * 0.005 + 1.2) * 85 + math.sin(x * 0.011) * 35
        y_center = int(HEIGHT * 0.22 + wave2)
        for dy in range(-70, 70):
            dist = abs(dy) / 70.0
            alpha = int(55 * (1 - dist ** 2))
            adraw.point((x, y_center + dy), fill=(90, 160, 255, max(0, alpha)))

    aurora_blur = aurora_canvas.filter(ImageFilter.GaussianBlur(radius=18))
    img = Image.alpha_composite(img.convert("RGBA"), aurora_blur).convert("RGB")
    draw = ImageDraw.Draw(img)
    
    # Fjord water line & reflections
    water_level = int(HEIGHT * 0.72)
    draw.rectangle([0, water_level, WIDTH, HEIGHT], fill=(8, 14, 24))
    for y in range(water_level, HEIGHT):
        t = (y - water_level) / (HEIGHT - water_level)
        r = int(8 + (15 - 8) * t)
        g = int(14 + (28 - 14) * t)
        b = int(24 + (45 - 24) * t)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))
        
    # Mountain silhouettes bordering the fjord
    left_ridge = [(0, water_level - 180), (320, water_level - 30), (500, water_level), (0, water_level)]
    right_ridge = [(WIDTH, water_level - 210), (WIDTH - 380, water_level - 40), (WIDTH - 550, water_level), (WIDTH, water_level)]
    draw.polygon(left_ridge, fill=(5, 9, 16))
    draw.polygon(right_ridge, fill=(5, 9, 16))
    return img

def create_gradient_wallpaper() -> Image.Image:
    # Modern Apple/macOS mesh gradient
    img = Image.new("RGBA", (WIDTH, HEIGHT), (14, 18, 30, 255))
    draw = ImageDraw.Draw(img)
    
    # Dark ambient backdrop
    for y in range(HEIGHT):
        t = y / HEIGHT
        r = int(11 + 10 * t)
        g = int(15 + 14 * t)
        b = int(28 + 22 * t)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b, 255))
        
    # Large soft radial gradient blooms
    blooms = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    bdraw = ImageDraw.Draw(blooms)
    
    # Sapphire bloom (top right)
    cx1, cy1, r1 = int(WIDTH * 0.78), int(HEIGHT * 0.25), 450
    for r in range(r1, 0, -8):
        alpha = int(45 * (1 - r / r1))
        bdraw.ellipse([cx1 - r, cy1 - r, cx1 + r, cy1 + r], fill=(30, 110, 230, alpha))
        
    # Electric violet bloom (bottom left)
    cx2, cy2, r2 = int(WIDTH * 0.22), int(HEIGHT * 0.75), 480
    for r in range(r2, 0, -8):
        alpha = int(40 * (1 - r / r2))
        bdraw.ellipse([cx2 - r, cy2 - r, cx2 + r, cy2 + r], fill=(130, 60, 220, alpha))

    # Cyan accent bloom (center)
    cx3, cy3, r3 = int(WIDTH * 0.52), int(HEIGHT * 0.45), 340
    for r in range(r3, 0, -8):
        alpha = int(32 * (1 - r / r3))
        bdraw.ellipse([cx3 - r, cy3 - r, cx3 + r, cy3 + r], fill=(20, 180, 210, alpha))

    blooms_blurred = blooms.filter(ImageFilter.GaussianBlur(radius=36))
    img = Image.alpha_composite(img, blooms_blurred).convert("RGB")
    return img

def create_desert_wallpaper() -> Image.Image:
    img = Image.new("RGB", (WIDTH, HEIGHT), (12, 14, 22))
    draw = ImageDraw.Draw(img)
    
    # Twilight sky
    for y in range(int(HEIGHT * 0.6)):
        t = y / (HEIGHT * 0.6)
        r = int(8 + (24 - 8) * t)
        g = int(10 + (26 - 10) * t)
        b = int(18 + (38 - 18) * t)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))
        
    # Distant dune 1
    dune1 = []
    for x in range(0, WIDTH + 10, 10):
        y = int(HEIGHT * 0.52 + math.sin(x * 0.004) * 45 + math.cos(x * 0.009) * 20)
        dune1.append((x, y))
    dune1.append((WIDTH, HEIGHT))
    dune1.append((0, HEIGHT))
    draw.polygon(dune1, fill=(28, 26, 38))
    
    # Mid dune 2 with sweeping crest
    dune2 = []
    for x in range(0, WIDTH + 10, 10):
        y = int(HEIGHT * 0.64 + math.cos(x * 0.005 + 1.0) * 65 + math.sin(x * 0.012) * 25)
        dune2.append((x, y))
    dune2.append((WIDTH, HEIGHT))
    dune2.append((0, HEIGHT))
    draw.polygon(dune2, fill=(20, 18, 28))
    
    # Foreground dune 3 (deep obsidian-slate)
    dune3 = []
    for x in range(0, WIDTH + 10, 10):
        y = int(HEIGHT * 0.76 + math.sin(x * 0.006 + 2.5) * 80 + math.cos(x * 0.015) * 30)
        dune3.append((x, y))
    dune3.append((WIDTH, HEIGHT))
    dune3.append((0, HEIGHT))
    draw.polygon(dune3, fill=(14, 13, 20))
    
    # Delicate crest highlight on dune 2
    for x in range(15, WIDTH - 15, 2):
        y = int(HEIGHT * 0.64 + math.cos(x * 0.005 + 1.0) * 65 + math.sin(x * 0.012) * 25)
        draw.point((x, y), fill=(80, 75, 105))

    return img

def create_sunset_wallpaper() -> Image.Image:
    img = Image.new("RGB", (WIDTH, HEIGHT), (16, 12, 28))
    draw = ImageDraw.Draw(img)
    
    # Rich dusk twilight gradient: deep purple-navy -> rosewater -> amber horizon
    h_horizon = int(HEIGHT * 0.66)
    for y in range(h_horizon):
        t = y / h_horizon
        if t < 0.5:
            # Navy to rich mauve
            st = t / 0.5
            r = int(14 + (85 - 14) * st)
            g = int(16 + (35 - 16) * st)
            b = int(38 + (75 - 38) * st)
        elif t < 0.8:
            # Mauve to warm rosewater
            st = (t - 0.5) / 0.3
            r = int(85 + (185 - 85) * st)
            g = int(35 + (85 - 35) * st)
            b = int(75 + (95 - 75) * st)
        else:
            # Rosewater to warm glowing amber
            st = (t - 0.8) / 0.2
            r = int(185 + (235 - 185) * st)
            g = int(85 + (145 - 85) * st)
            b = int(95 + (75 - 95) * st)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))
        
    # Distant hills silhouetted against glowing sunset
    hills = []
    for x in range(0, WIDTH + 10, 10):
        elev = math.sin(x * 0.006) * 55 + math.cos(x * 0.014 + 1.5) * 30
        hills.append((x, int(h_horizon - elev)))
    hills.append((WIDTH, HEIGHT))
    hills.append((0, HEIGHT))
    draw.polygon(hills, fill=(28, 18, 36))
    
    # Foreground plain (near black)
    fore = []
    for x in range(0, WIDTH + 10, 10):
        elev = math.sin(x * 0.009 + 2.0) * 40
        fore.append((x, int(h_horizon + 60 - elev)))
    fore.append((WIDTH, HEIGHT))
    fore.append((0, HEIGHT))
    draw.polygon(fore, fill=(14, 10, 20))
    
    return img

def main():
    generators = {
        "cinematic-mountain": create_mountain_wallpaper,
        "aurora-borealis": create_aurora_wallpaper,
        "abstract-gradient": create_gradient_wallpaper,
        "minimalist-desert": create_desert_wallpaper,
        "warm-sunset": create_sunset_wallpaper,
    }
    
    out_dirs = [
        Path("web/static/wallpapers"),
        Path("frontend/public/wallpapers"),
    ]
    for d in out_dirs:
        d.mkdir(parents=True, exist_ok=True)
        
    for name, gen_fn in generators.items():
        print(f"Generating wallpaper '{name}'...")
        w_img = gen_fn()
        for d in out_dirs:
            target_path = d / f"{name}.png"
            w_img.save(target_path, "PNG", optimize=True)
            print(f"  Saved -> {target_path} ({target_path.stat().st_size} bytes)")

    print("\nAll 5 curated wallpapers generated successfully!")

if __name__ == '__main__':
    main()
