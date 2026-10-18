import math
import os
from PIL import Image, ImageDraw, ImageFilter

TARGET_WIDTH = 1280
TARGET_HEIGHT = 800
SCALE = 2  # 2x supersampling for ultra-smooth antialiased curves
WIDTH = TARGET_WIDTH * SCALE
HEIGHT = TARGET_HEIGHT * SCALE

def create_abstract_wallpaper(output_path: str):
    # Base canvas: Deep midnight obsidian graphite to rich indigo gradient
    base = Image.new("RGBA", (WIDTH, HEIGHT), (12, 17, 28, 255))
    draw = ImageDraw.Draw(base)

    for y in range(HEIGHT):
        t = y / (HEIGHT - 1)
        r = int(10 + (24 - 10) * t)
        g = int(14 + (32 - 14) * t)
        b = int(24 + (54 - 24) * t)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b, 255))

    # Soft ambient illumination from upper-right
    light_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    light_draw = ImageDraw.Draw(light_layer)
    lx, ly = int(WIDTH * 0.72), int(HEIGHT * 0.32)
    
    # Large soft diffused radial light
    for rad in range(int(500 * SCALE), 0, -int(12 * SCALE)):
        intensity = 1.0 - (rad / (500.0 * SCALE))
        alpha = int(26 * (intensity ** 1.9))
        r = int(22 + 35 * intensity)
        g = int(65 + 85 * intensity)
        b = int(140 + 105 * intensity)
        light_draw.ellipse([lx - rad, ly - rad, lx + rad, ly + rad], fill=(r, g, b, alpha))

    base = Image.alpha_composite(base, light_layer)

    # Parametric flowing wave ribbon generator with supersampled smoothness
    def draw_ribbon(color_top, color_bot, y_offset, amplitude, freq, phase, edge_highlight=True):
        y_off = y_offset * SCALE
        amp = amplitude * SCALE
        
        points = [(0, HEIGHT)]
        curve_pts = []
        step = 2  # Fine curve stepping
        for x in range(0, WIDTH + step, step):
            norm_x = x / WIDTH
            y = y_off + (
                math.sin(norm_x * math.pi * freq + phase) * amp +
                math.sin(norm_x * math.pi * (freq * 2.1) + phase * 1.4) * (amp * 0.35) +
                math.cos(norm_x * math.pi * 0.75) * (amp * 0.22)
            )
            curve_pts.append((x, y))
            points.append((x, y))
        points.append((WIDTH, HEIGHT))
        
        # Mask for polygon
        ribbon_poly = Image.new("L", (WIDTH, HEIGHT), 0)
        rp_draw = ImageDraw.Draw(ribbon_poly)
        rp_draw.polygon(points, fill=255)
        
        # Gradient layer
        grad_fill = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
        gf_draw = ImageDraw.Draw(grad_fill)
        for y in range(HEIGHT):
            factor = max(0.0, min(1.0, (y - y_off + amp) / (HEIGHT - y_off + amp + 1)))
            r = int(color_top[0] + (color_bot[0] - color_top[0]) * factor)
            g = int(color_top[1] + (color_bot[1] - color_top[1]) * factor)
            b = int(color_top[2] + (color_bot[2] - color_top[2]) * factor)
            a = int(color_top[3] + (color_bot[3] - color_top[3]) * factor)
            gf_draw.line([(0, y), (WIDTH, y)], fill=(r, g, b, a))

        layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
        layer.paste(grad_fill, (0, 0), ribbon_poly)

        # Highlight edge stroke along top of ribbon
        if edge_highlight:
            edge_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
            e_draw = ImageDraw.Draw(edge_layer)
            edge_color = (
                min(255, color_top[0] + 160),
                min(255, color_top[1] + 180),
                min(255, color_top[2] + 200),
                min(255, color_top[3] + 40)
            )
            for i in range(len(curve_pts) - 1):
                e_draw.line([curve_pts[i], curve_pts[i + 1]], fill=edge_color, width=int(1.5 * SCALE))
            layer = Image.alpha_composite(layer, edge_layer)

        return layer

    # Layer 1: Deep subtle wave (graphite/indigo)
    wave1 = draw_ribbon(
        color_top=(24, 38, 64, 170),
        color_bot=(12, 18, 34, 240),
        y_offset=410,
        amplitude=115,
        freq=1.2,
        phase=0.4
    )
    base = Image.alpha_composite(base, wave1)

    # Layer 2: Deep sapphire/teal flowing ribbon
    wave2 = draw_ribbon(
        color_top=(14, 70, 110, 200),
        color_bot=(8, 28, 52, 245),
        y_offset=505,
        amplitude=92,
        freq=1.45,
        phase=2.1
    )
    base = Image.alpha_composite(base, wave2)

    # Layer 3: Luminous teal/cyan fluid ribbon
    wave3 = draw_ribbon(
        color_top=(0, 138, 178, 220),
        color_bot=(10, 44, 76, 250),
        y_offset=585,
        amplitude=78,
        freq=1.75,
        phase=4.1
    )
    base = Image.alpha_composite(base, wave3)

    # Layer 4: Deep obsidian grounding base ribbon
    wave4 = draw_ribbon(
        color_top=(16, 28, 46, 235),
        color_bot=(6, 10, 18, 255),
        y_offset=665,
        amplitude=48,
        freq=1.5,
        phase=1.0
    )
    base = Image.alpha_composite(base, wave4)

    # Ambient subtle vignette around edges
    vignette = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    vdraw = ImageDraw.Draw(vignette)
    vig_depth = int(60 * SCALE)
    for i in range(vig_depth):
        alpha = int(40 * (1.0 - i / float(vig_depth)))
        vdraw.rectangle([i, i, WIDTH - 1 - i, HEIGHT - 1 - i], outline=(0, 0, 0, alpha))
    base = Image.alpha_composite(base, vignette)

    # Downsample using high-quality Lanczos filter to 1280x800
    resampled = base.resize((TARGET_WIDTH, TARGET_HEIGHT), resample=Image.Resampling.LANCZOS)

    # Save final RGB wallpaper
    final_img = resampled.convert("RGB")
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    final_img.save(output_path, "PNG", quality=95)
    print(f"Generated supersampled abstract wallpaper: {output_path} ({final_img.size})")

if __name__ == "__main__":
    create_abstract_wallpaper("docker/desktop/os_wallpaper.png")
