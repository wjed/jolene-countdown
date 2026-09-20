# -*- coding: utf-8 -*-
"""Make the two smaller copies of every photograph that the page actually uses.

The originals in images/ are the keepsakes and stay untouched. The page never
loads them: the gallery grid shows images/thumbs/, and the photograph on the
front page and the full view behind a tap show images/web/. Before this, one
rotation of the photograph on the front page pulled half a megabyte, every
seven seconds, and scrolling the gallery pulled all forty megabytes.

Run it after adding or renaming photographs:

    python tools/photos.py

It rewrites nothing in index.html. It does print the gallery list, so if you
added photographs you can paste that into QA.photos.
"""
import io
import os
import sys

from PIL import Image, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
SRC = os.path.join(REPO, 'images')

# long edge, quality. The gallery cells are about 330 real pixels across on a
# phone; the front-page photograph is about 750 there and 660 on a laptop, and
# the full view is whatever the screen is. One size covers both of those: the
# front page shows a new photograph every seven seconds, so its weight is the
# page's largest running cost.
SIZES = {'thumbs': (480, 72), 'web': (1000, 78)}
SKIP = set(SIZES)


def photos():
    for name in sorted(os.listdir(SRC)):
        if name.startswith('.') or os.path.isdir(os.path.join(SRC, name)):
            continue
        if os.path.splitext(name)[1].lower() in ('.jpg', '.jpeg', '.png'):
            yield name


def build(force=False):
    made, kept, total = 0, 0, {}
    for folder, (edge, quality) in SIZES.items():
        out_dir = os.path.join(SRC, folder)
        if not os.path.isdir(out_dir):
            os.makedirs(out_dir)
        total[folder] = 0
        for name in photos():
            src = os.path.join(SRC, name)
            out = os.path.join(out_dir, os.path.splitext(name)[0] + '.jpg')
            fresh = (not force and os.path.exists(out)
                     and os.path.getmtime(out) >= os.path.getmtime(src))
            if not fresh:
                with Image.open(src) as im:
                    im = ImageOps.exif_transpose(im).convert('RGB')
                    im.thumbnail((edge, edge), Image.LANCZOS)
                    im.save(out, 'JPEG', quality=quality, optimize=True, progressive=True)
                made += 1
            else:
                kept += 1
            total[folder] += os.path.getsize(out)
    return made, kept, total


def main():
    force = '--force' in sys.argv
    names = list(photos())
    if not names:
        print('no photographs in images/')
        return 1
    before = sum(os.path.getsize(os.path.join(SRC, n)) for n in names)
    made, kept, total = build(force)
    print('%d photographs: %d rebuilt, %d already current' % (len(names), made, kept))
    print('originals  %6.1f MB' % (before / 1048576.0))
    for folder in SIZES:
        print('%-10s %6.1f MB   (%s)' % (folder, total[folder] / 1048576.0,
                                         'gallery grid' if folder == 'thumbs' else 'front page and full view'))
    odd = [n for n in names if not n.lower().endswith('.jpg')]
    if odd:
        print('\nnot .jpg, so the derived names will not match: ' + ', '.join(odd))
    listing = '\n\n'.join('![Will and Jolene](images/%s)' % n for n in names)
    path = os.path.join(HERE, 'photos-list.txt')
    io.open(path, 'w', encoding='utf-8', newline='\n').write(listing + '\n')
    print('\nthe gallery list is in tools/photos-list.txt if QA.photos needs updating')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
