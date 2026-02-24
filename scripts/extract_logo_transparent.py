#!/usr/bin/env python3
"""
Extrait le logo Rebellion Luxury : fond noir -> transparent, recadrage serré.
Usage: pip install Pillow && python scripts/extract_logo_transparent.py
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INPUT = os.path.join(ROOT, "public", "rebellion-luxury-logo.png")
OUTPUT = os.path.join(ROOT, "public", "rebellion-luxury-logo-transparent.png")
BLACK_THRESHOLD = 45  # R,G,B en dessous = fond noir -> transparent

def main():
    img = Image.open(INPUT).convert("RGBA")
    w, h = img.size
    data = img.load()

    for y in range(h):
        for x in range(w):
            r, g, b, a = data[x, y]
            if r <= BLACK_THRESHOLD and g <= BLACK_THRESHOLD and b <= BLACK_THRESHOLD:
                data[x, y] = (r, g, b, 0)

    # Bounding box des pixels non transparents
    min_x, min_y = w, h
    max_x, max_y = 0, 0
    for y in range(h):
        for x in range(w):
            if data[x, y][3] > 0:
                min_x = min(min_x, x)
                max_x = max(max_x, x)
                min_y = min(min_y, y)
                max_y = max(max_y, y)

    crop = img.crop((min_x, min_y, max_x + 1, max_y + 1))
    crop.save(OUTPUT)
    print("Logo extrait avec fond transparent:", OUTPUT)
    print("Remplacez public/rebellion-luxury-logo.png par ce fichier si besoin.")

if __name__ == "__main__":
    main()
