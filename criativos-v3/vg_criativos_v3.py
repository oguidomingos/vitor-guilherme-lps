"""Pecas v3 (21/10/2026): fundo CLARO, foto/render oficial grande, preco grande, sem semestrais.
ELEVA = TABELA(RUA)_2026_10 (Terral), unidade B-1906 (menor da tabela). Valores arredondados PARA CIMA (nunca abaixo do real).
VERSAT = valores pedidos pelo Vitor no audio de 21/10: sinal R$ 87.770 / parcelas a partir de R$ 3.050 (divergem da tabela set/2026: ver RELATORIO)."""
import sys, os, math
from PIL import Image
from playwright.sync_api import sync_playwright
OUT='/root/work/vg3-out'; PH='/root/work/vg-photos'; os.makedirs(OUT,exist_ok=True)
def brl(v): return f"{int(v):,}".replace(',','.')
BG='#F7F3EC'; INK='#1D1A16'; ACCENT='#C2461B'  # PALETA UNICA: fundo #F7F3EC | valor #C2461B | apoio #1D1A16 (todas as pecas e videos)
import numpy as np
T_L,T_S=0.50,0.30   # luminancia e saturacao medias alvo (mesmo tratamento em todas as fotos)
def stats(im):
    a=np.asarray(im).astype(float)/255; mx=a.max(2); mn=a.min(2)
    return float((0.2126*a[...,0]+0.7152*a[...,1]+0.0722*a[...,2]).mean()), float(((mx-mn)/(mx+1e-6)).mean()), a.reshape(-1,3).mean(0)
def grade(im):
    a=np.asarray(im).astype(float)/255
    L,S,m=stats(im)
    g=m.mean()/m; g=1+0.7*(g-1)               # neutraliza dominante quente/fria (70%)
    a=np.clip(a*g,0,1)
    L=float((0.2126*a[...,0]+0.7152*a[...,1]+0.0722*a[...,2]).mean())
    gam=float(np.clip(np.log(T_L)/np.log(max(L,.05)),0.75,1.3)); a=a**gam
    lum=(0.2126*a[...,0]+0.7152*a[...,1]+0.0722*a[...,2])[...,None]
    mx=a.max(2);mn=a.min(2); S=float(((mx-mn)/(mx+1e-6)).mean())
    k=float(np.clip(T_S/max(S,.02),0.7,1.35)); a=np.clip(lum+(a-lum)*k,0,1)
    return Image.fromarray((a*255).astype('uint8'))
def prep(src,name,crop_bottom=0.0):
    im=Image.open(src).convert('RGB')
    if crop_bottom: im=im.crop((0,0,im.width,int(im.height*(1-crop_bottom))))
    b=stats(im); im=grade(im); a=stats(im); print('grade',name,'L %.2f->%.2f S %.2f->%.2f rgb'%(b[0],a[0],b[1],a[1]),np.round(b[2],2),'->',np.round(a[2],2))
    p=f'/root/work/vg3/_p_{name}.jpg'; im.save(p,quality=95); return p
E_SINAL=math.ceil(56783.67); E_MENS=math.ceil(7097.96)   # B-1906, TABELA(RUA)_2026_10
PROD={
 'ELEVA':dict(accent=ACCENT,tag='ELEVA 25 · ÁGUAS CLARAS',sub='RUA 25 SUL · A PASSOS DO METRÔ',
   l1='SINAL',v1=brl(E_SINAL),l2='6 MENSAIS DE',v2=brl(E_MENS),pre='A PARTIR DE',
   legal='Exemplo: unidade B-1906 (48,55 m²), Tabela Rua 2026_10 da incorporadora Terral. Valores a partir de, sujeitos a reajuste (INCC), análise de crédito e disponibilidade. Imagens ilustrativas.',
   photos={'A':(prep(f'{PH}/e25/decorado-d0.jpg','e_a'),'center 55%'),
           'B':(prep(f'{PH}/e25/T_25S_FACHADA_VISTA_BOULEVARD_EF_web.jpg','e_b',0.145),'center top'),
           'C':(prep(f'{PH}/e25/T_25S_PISCINA_EF_web.jpg','e_c',0.12),'center')}),
 'VERSAT':dict(accent=ACCENT,tag='VERSAT HOME RESORT · ÁGUAS CLARAS',sub='3 QUARTOS · LAZER DE RESORT',
   l1='SINAL DE',v1='87.770',l2='PARCELAS A PARTIR DE',v2='3.050',pre='',
   legal='Valores a partir de, sujeitos a alteração, análise de crédito e disponibilidade. Imagens ilustrativas.',
   photos={'A':(prep(f'{PH}/versat/SALA-INTEGRADA.webp','v_a'),'center'),
           'B':(prep(f'{PH}/versat/COPA_IMG_FACHADAPRIN02_R05-copiar.webp','v_b'),'center top'),
           'C':(prep(f'{PH}/versat/SUITE-COM-VARANDA.webp','v_c'),'center')}),
}
FMT={'4x5':dict(W=1080,H=1350,ph=790,top=40,bot=40),'9x16':dict(W=1080,H=1920,ph=1080,top=250,bot=340)}
NAMES={'A':'A-decorado','B':'B-empreendimento','C':'C-lazer-quarto'}
def html(p,ang,f):
    P=PROD[p]; F=FMT[f]; img,pos=P['photos'][ang]; W,H=F['W'],F['H']; ac=P['accent']
    pre=f'<div class="pre">{P["pre"]}</div>' if P['pre'] else ''
    price=f"""{pre}<div class="r"><div class="l">{P['l1']}</div><div class="v"><i>R$</i>{P['v1']}</div></div>
<div class="r p"><div class="l">{P['l2']}</div><div class="v"><i>R$</i>{P['v2']}</div></div>"""
    sign='<div class="sign"><b>VITOR GUILHERME</b> · Corretor de imóveis · <b>CRECI 29425-DF</b></div>'
    cta=''
    css=f"""*{{margin:0;padding:0;box-sizing:border-box}}html,body{{width:{W}px;height:{H}px;background:{BG};overflow:hidden}}
body{{font-family:'Inter',sans-serif;color:{INK};position:relative;font-variant-numeric:lining-nums}}
.photo{{position:absolute;left:0;top:0;width:{W}px;height:{F['ph'] if ang!='B' else H}px;background:url(file://{img}) {pos}/cover no-repeat}}
.tag{{position:absolute;left:56px;top:{F['top']+ (0 if f=='4x5' else 0)}px;background:{BG};color:{INK};font-weight:700;font-size:23px;letter-spacing:.14em;padding:14px 24px;border-radius:999px}}
.tag b{{color:{ac}}}
.panel{{position:absolute;left:0;right:0;top:{F['ph']}px;bottom:0;background:{BG};padding:30px 56px 0}}
.card{{position:absolute;left:44px;right:44px;bottom:{F['bot']}px;background:rgba(247,243,236,.96);border-radius:34px;padding:34px 44px 26px;box-shadow:0 18px 60px rgba(0,0,0,.22)}}
.pre{{font-weight:700;font-size:21px;letter-spacing:.2em;color:{ac};margin-bottom:6px}}
.r{{display:flex;justify-content:space-between;align-items:baseline;padding:8px 0;border-bottom:2px solid rgba(29,26,22,.12)}}
.r.p{{border-bottom:none;padding-top:16px;flex-direction:column;align-items:flex-start}}
.r.p .l{{font-size:23px;margin-bottom:0}}
.r.p .v{{color:{ac}}}
.l{{font-weight:700;font-size:25px;letter-spacing:.12em}}
.v{{font-family:'Playfair Display',serif;font-weight:800;font-size:{92 if f=='4x5' else 100}px;line-height:1.02;color:{ac}}}
.r.p .v{{font-size:{196 if f=='4x5' else 216}px;line-height:.95;margin-top:-6px}}
.v i{{font-style:normal;font-size:.42em;font-weight:600;color:{ac};margin-right:.16em}}
.sign{{margin-top:26px;font-weight:500;font-size:20px;letter-spacing:.04em;text-align:center}}.sign b{{font-weight:800}}
.legal{{margin-top:8px;font-size:13.5px;line-height:1.35;opacity:.6;text-align:center}}"""
    inner=f'{price}{cta}{sign}<div class="legal">{P["legal"]}</div>'
    body=(f'<div class="card">{inner}</div>' if ang=='B' else f'<div class="panel">{inner}</div>')
    return f"<!doctype html><meta charset=utf-8><style>{css}</style><body><div class=photo></div><div class=tag><b>■</b> {P['tag']}</div>{body}</body>"
def main(only=None):
    jobs=[(p,a,f) for p in PROD for a in 'ABC' for f in FMT]
    if only: jobs=[j for j in jobs if only in '-'.join(j)]
    with sync_playwright() as pw:
        b=pw.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox','--allow-file-access-from-files'])
        for p,a,f in jobs:
            F=FMT[f]; pg=b.new_page(viewport={'width':F['W'],'height':F['H']})
            hp=f'/root/work/vg3/_h_{p}_{a}_{f}.html'; open(hp,'w').write(html(p,a,f))
            pg.goto('file://'+hp); pg.wait_for_timeout(400); pg.evaluate('document.fonts.ready')
            d=f'{OUT}/{p}/{NAMES[a]}'; os.makedirs(d,exist_ok=True)
            fn=f'{d}/{p}_{NAMES[a]}_{f}.png'; pg.screenshot(path=fn); print(fn); pg.close()
        b.close()
if __name__=='__main__': main(sys.argv[1] if len(sys.argv)>1 else None)
