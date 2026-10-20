#!/usr/bin/env python3
"""Gera versat/index.html e eleva-25/index.html a partir de src/*.html.

No fonte, imagem otimizada é escrita assim:
    <img data-v3="dec-sala" alt="..." sizes="(min-width:900px) 50vw, 100vw">
e o build troca por src/srcset/width/height, lendo as dimensões dos arquivos em <emp>/img/v3/.
{{WA}} vira o ícone do WhatsApp. Uso: python3 scripts/build_lps.py
"""
import os, re, struct

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WA = ('<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-1.7-.9-2.9-1.6-4-3.5-.3-.5.3-.5.8-1.6.1-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5 1.9.8 2.6.9 3.5.8.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.4z"/>'
      '<path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-2.9.8.8-2.8-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg>')


def webp_size(path):
    with open(path, "rb") as f:
        d = f.read(40)
    if d[12:16] == b"VP8 ":
        w, h = struct.unpack("<HH", d[26:30]); return w & 0x3FFF, h & 0x3FFF
    if d[12:16] == b"VP8L":
        b = d[21:25]; v = int.from_bytes(b, "little"); return (v & 0x3FFF) + 1, ((v >> 14) & 0x3FFF) + 1
    if d[12:16] == b"VP8X":
        return int.from_bytes(d[24:27], "little") + 1, int.from_bytes(d[27:30], "little") + 1
    raise ValueError(path)


def build(src, emp):
    html = open(os.path.join(ROOT, "src", src), encoding="utf-8").read().replace("{{WA}}", WA)
    imgdir = os.path.join(ROOT, emp, "img", "v3")

    def rep(m):
        name, rest = m.group(1), m.group(2)
        sm, lg = f"{name}-sm.webp", f"{name}-lg.webp"
        w1, _ = webp_size(os.path.join(imgdir, sm))
        parts = [f'src="img/v3/{sm}"']
        if os.path.exists(os.path.join(imgdir, lg)):
            w2, h2 = webp_size(os.path.join(imgdir, lg))
            parts.append(f'srcset="img/v3/{sm} {w1}w, img/v3/{lg} {w2}w"')
            parts += [f'width="{w2}"', f'height="{h2}"']
        else:
            w2, h2 = webp_size(os.path.join(imgdir, sm))
            parts += [f'width="{w2}"', f'height="{h2}"']
        if 'loading=' not in rest:
            parts.append('loading="lazy"')
        parts.append('decoding="async"')
        return "<img " + " ".join(parts) + rest + ">"

    html = re.sub(r'<img data-v3="([\w-]+)"([^>]*)>', rep, html)
    left = re.findall(r"data-v3=|\{\{", html)
    assert not left, f"marcadores não resolvidos em {src}"
    out = os.path.join(ROOT, emp, "index.html")
    open(out, "w", encoding="utf-8").write(html)
    print("ok", out, len(html), "bytes")


if __name__ == "__main__":
    build("versat.html", "versat")
    build("eleva-25.html", "eleva-25")
