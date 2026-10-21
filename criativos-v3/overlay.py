import sys
sys.path.insert(0,'/root/projects/vitor-guilherme/criativos-entrada')
from playwright.sync_api import sync_playwright
import vg_criativos_v3 as V
for p in ('ELEVA','VERSAT'):
    h=V.html(p,'A','9x16')
    # janela do video transparente: remove foto e fundo acima do painel
    h=h.replace("<div class=photo></div>","").replace(f"html,body{{width:1080px;height:1920px;background:{V.BG}",f"html,body{{width:1080px;height:1920px;background:transparent")
    h=h.replace("</style>",".panel{border-top:none}</style>")
    open(f'ov_{p}.html','w').write(h)
with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox','--allow-file-access-from-files'])
    for p in ('ELEVA','VERSAT'):
        pg=b.new_page(viewport={'width':1080,'height':1920}); pg.goto(f'file:///root/work/vg3/ov_{p}.html'); pg.wait_for_timeout(400)
        pg.screenshot(path=f'ov_{p}.png',omit_background=True); pg.close()
    b.close()
