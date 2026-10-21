#!/usr/bin/env python3
"""v3 (21/10/2026): sobe as 12 pecas claras, cria 6 creatives + 6 ads, TUDO PAUSED, na campanha [VG] Entrada facilitada (120254976916970536).
Nada e ativado. Pre-requisitos que travaram em 21/10: app 1718123646144188 em modo Desenvolvimento (subcode 1885183) e
certificacao de nao discriminacao do admin da empresa (subcode 2859024)."""
import json, os, sys, subprocess, urllib.parse, urllib.request
ENV=dict(l.strip().split('=',1) for l in open('/root/.config/meta_ads.env') if '=' in l and not l.startswith('#'))
TOKEN=ENV['META_ACCESS_TOKEN'].strip('"\'')
ACT='act_1876712769957014'; PAGE='613686298492927'; IG='17841480565618452'
ADSET={'ELEVA':'120254976918330536','VERSAT':'120254976919460536'}
LP={'ELEVA':'https://vitorguilhermeimoveis.com.br/eleva-25/','VERSAT':'https://vitorguilhermeimoveis.com.br/versat/'}
OUT='/root/work/vg3-out'; NAMES={'A':'A-decorado','B':'B-empreendimento','C':'C-lazer-quarto'}
LEGAL=' Valores a partir de, sujeitos a alteração, análise de crédito e disponibilidade. Imagens ilustrativas. CRECI 29425-DF.'
COPY={
 'ELEVA':dict(msg='ELEVA 25, Rua 25 Sul, a passos do metrô em Águas Claras. Sinal a partir de R$ 56.784 + 6 mensais a partir de R$ 7.098 (exemplo: unidade B-1906, 48,55 m², Tabela Rua 2026_10). Fale com o corretor Vitor Guilherme.'+LEGAL,head='Sinal R$ 56.784 + 6 mensais de R$ 7.098',desc='ELEVA 25 · Águas Claras'),
 'VERSAT':dict(msg='VERSAT Home Resort, Águas Claras. Sinal de R$ 87.770 e parcelas a partir de R$ 3.050. Fale com o corretor Vitor Guilherme.'+LEGAL,head='Sinal R$ 87.770 · parcelas a partir de R$ 3.050',desc='VERSAT Home Resort · Águas Claras')}
def call(path,data=None,files=None):
    url=f'https://graph.facebook.com/v23.0/{path}'
    if files:
        cmd=['curl','-s','-X','POST',url,'-F','access_token='+TOKEN]+sum([['-F',f'{k}=@{v}'] for k,v in files.items()],[])
        return json.loads(subprocess.run(cmd,capture_output=True,text=True).stdout)
    d=urllib.parse.urlencode(dict(data,access_token=TOKEN)).encode()
    try: return json.load(urllib.request.urlopen(urllib.request.Request(url,d)))
    except urllib.error.HTTPError as e: return json.load(e)
def h(prod,ang,fmt):
    fn=f'{OUT}/{prod}/{NAMES[ang]}/{prod}_{NAMES[ang]}_{fmt}.png'
    r=call(f'{ACT}/adimages',files={'filename':fn}); print(fn,str(r)[:160])
    return list(r['images'].values())[0]['hash']
for p,c in COPY.items():
  for a in 'ABC':
    h45=h(p,a,'4x5'); h916=h(p,a,'9x16')
    spec={'name':f'[VG v3] {p} {NAMES[a]}','object_story_spec':json.dumps({'page_id':PAGE,'instagram_user_id':IG}),
     'url_tags':f'utm_source=facebook&utm_medium=paid&utm_campaign=entrada_out26_v3&utm_content={p.lower()}_{a}',
     'asset_feed_spec':json.dumps({'images':[{'hash':h45,'adlabels':[{'name':'feed'}]},{'hash':h916,'adlabels':[{'name':'story'}]}],
        'bodies':[{'text':c['msg']}],'titles':[{'text':c['head']}],'descriptions':[{'text':c['desc']}],
        'link_urls':[{'website_url':LP[p]}],'call_to_action_types':['CONTACT_US'],'ad_formats':['SINGLE_IMAGE'],
        'asset_customization_rules':[
          {'customization_spec':{'publisher_platforms':['facebook','instagram'],'facebook_positions':['feed'],'instagram_positions':['stream']},'image_label':{'name':'feed'}},
          {'customization_spec':{'publisher_platforms':['facebook','instagram'],'facebook_positions':['story'],'instagram_positions':['story','reels']},'image_label':{'name':'story'}}]})}
    r=call(f'{ACT}/adcreatives',spec); print(p,a,'creative',r)
    if 'id' in r: print(p,a,'ad',call(f'{ACT}/ads',{'name':f'[VG v3] {p} {NAMES[a]}','adset_id':ADSET[p],'creative':json.dumps({'creative_id':r['id']}),'status':'PAUSED'}))
