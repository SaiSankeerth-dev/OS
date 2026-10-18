"""Create reproducible before/after and image-difference audit artifacts."""

from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageEnhance


ROOT = Path('artifacts/ui-audit')
BEFORE = ROOT / 'baseline'
AFTER = ROOT / 'after'
OUTPUT = ROOT / 'comparisons'
OUTPUT.mkdir(parents=True, exist_ok=True)


def label(image: Image.Image, text: str) -> Image.Image:
    canvas = Image.new('RGB', (image.width, image.height + 32), '#111827')
    canvas.paste(image.convert('RGB'), (0, 32))
    draw = ImageDraw.Draw(canvas)
    draw.text((12, 9), text, fill='#f8fafc')
    return canvas


for before_path in sorted(BEFORE.glob('*.png')):
    after_path = AFTER / before_path.name
    if not after_path.exists():
        continue
    before = Image.open(before_path).convert('RGB')
    after = Image.open(after_path).convert('RGB')
    if before.size != after.size:
        after = after.resize(before.size)

    side_by_side = Image.new('RGB', (before.width * 2, before.height + 32), '#111827')
    side_by_side.paste(label(before, 'BEFORE'), (0, 0))
    side_by_side.paste(label(after, 'AFTER'), (before.width, 0))
    side_by_side.save(OUTPUT / f'{before_path.stem}-before-after.png')

    difference = ImageChops.difference(before, after)
    difference = ImageEnhance.Contrast(difference).enhance(2.25)
    difference.save(OUTPUT / f'{before_path.stem}-difference.png')
