#!/usr/bin/env python3
"""Relatório de cliques em WhatsApp e leads das LPs (Versat, Eleva 25) para mostrar ao Vitor.

Lê os arquivos gravados pelo vg-lead-logger (clicks.jsonl e leads.jsonl), ignora registros de teste
e gera, na pasta de saída: resumo.md, cliques.csv, leads.csv.

Uso (na VPS):
  python3 scripts/relatorio_vitor.py                      # tudo
  python3 scripts/relatorio_vitor.py --desde 2026-10-20   # a partir de uma data (UTC)
  python3 scripts/relatorio_vitor.py --emp versat         # só um empreendimento (versat | eleva-25)
"""
import argparse, csv, json, os, collections

DIR = "/root/projects/vitor-guilherme/lead-logger"

def lerjsonl(path):
    rows = []
    if not os.path.exists(path):
        return rows
    for ln in open(path, encoding="utf-8"):
        ln = ln.strip()
        if not ln:
            continue
        try:
            rows.append(json.loads(ln))
        except ValueError:
            pass
    return rows

def emp_of(r):
    e = str(r.get("emp") or "").lower()
    if "eleva" in e: return "eleva-25"
    if "versat" in e: return "versat"
    p = str(r.get("pagina") or "").lower()
    if "/eleva-25" in p: return "eleva-25"
    if "/versat" in p: return "versat"
    return e or "outro"

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", default=DIR)
    ap.add_argument("--saida", default="relatorio-vitor")
    ap.add_argument("--desde", default="")
    ap.add_argument("--emp", default="")
    a = ap.parse_args()

    ok = lambda r: not r.get("is_test") and str(r.get("ts", "")) >= a.desde and (not a.emp or emp_of(r) == a.emp)
    ev = [r for r in lerjsonl(os.path.join(a.dir, "clicks.jsonl")) if ok(r)]
    # leads antigos (formulário no modal) e novos (captura na página) ficam no mesmo arquivo
    leads = [r for r in lerjsonl(os.path.join(a.dir, "leads.jsonl")) if ok(r) and (r.get("telefone") or r.get("phone"))]
    views = [r for r in ev if r.get("tipo") == "pageview"]
    clicks = [r for r in ev if r.get("tipo") == "wa_click"]
    os.makedirs(a.saida, exist_ok=True)

    with open(os.path.join(a.saida, "cliques.csv"), "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f)
        w.writerow(["data_hora_utc", "empreendimento", "secao", "botao", "utm_source", "utm_medium", "utm_campaign", "utm_content", "sessao"])
        for r in sorted(clicks, key=lambda r: r["ts"]):
            w.writerow([r["ts"], emp_of(r), r.get("section", ""), r.get("botao", ""), r.get("utm_source", ""), r.get("utm_medium", ""),
                        r.get("utm_campaign", ""), r.get("utm_content", ""), r.get("session_id", "")])
    with open(os.path.join(a.saida, "leads.csv"), "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f)
        w.writerow(["data_hora_utc", "empreendimento", "nome", "whatsapp", "interesse", "secao", "utm_source", "utm_medium", "utm_campaign", "utm_content"])
        for r in sorted(leads, key=lambda r: r["ts"]):
            w.writerow([r["ts"], emp_of(r), r.get("nome", ""), r.get("telefone") or r.get("phone", ""), r.get("interesse", ""),
                        r.get("section") or r.get("botao", ""), r.get("utm_source", ""), r.get("utm_medium", ""), r.get("utm_campaign", ""), r.get("utm_content", "")])

    L = []
    sess = lambda rs: len({r.get("session_id") for r in rs if r.get("session_id")})
    L.append("# Relatório de cliques e leads (LPs do Vitor Guilherme)\n")
    L.append(f"Período: {a.desde or 'desde o início'} em diante (horário UTC). Registros de teste excluídos.\n")
    L.append("| Empreendimento | Visitas (sessões) | Cliques no WhatsApp | Sessões que clicaram | Leads (formulário) |\n|---|---|---|---|---|")
    for e in sorted({emp_of(r) for r in ev + leads}):
        v = [r for r in views if emp_of(r) == e]; c = [r for r in clicks if emp_of(r) == e]; l = [r for r in leads if emp_of(r) == e]
        L.append(f"| {e} | {sess(v)} | {len(c)} | {sess(c)} | {len(l)} |")
    L.append("\n## Cliques por seção da página\n\n| Seção | Cliques |\n|---|---|")
    for k, n in collections.Counter(r.get("section", "?") for r in clicks).most_common():
        L.append(f"| {k} | {n} |")
    L.append("\n## Cliques por campanha / anúncio (UTM)\n\n| Source | Medium | Campaign | Content | Cliques |\n|---|---|---|---|---|")
    for (s, m, c, ct), n in collections.Counter((r.get("utm_source", ""), r.get("utm_medium", ""), r.get("utm_campaign", ""), r.get("utm_content", "")) for r in clicks).most_common():
        L.append(f"| {s or '(direto)'} | {m} | {c} | {ct} | {n} |")
    L.append("\n## Leads (nome, WhatsApp e interesse)\n\n| Data (UTC) | Emp. | Nome | WhatsApp | Interesse |\n|---|---|---|---|---|")
    for r in sorted(leads, key=lambda r: r["ts"]):
        L.append(f"| {r['ts'][:16]} | {emp_of(r)} | {r.get('nome','')} | {r.get('telefone') or r.get('phone','')} | {r.get('interesse','')} |")
    open(os.path.join(a.saida, "resumo.md"), "w", encoding="utf-8").write("\n".join(L) + "\n")
    print(f"ok: {len(views)} visitas, {len(clicks)} cliques, {len(leads)} leads -> {a.saida}/")

if __name__ == "__main__":
    main()
