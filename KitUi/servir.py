"""Servidor local do Kit UI com a API de estilos (equivalente a servir.js).

Uso: python servir.py
Use a variável de ambiente NO_OPEN=1 para não abrir o navegador.
"""

import json
import os
import re
import sys
import threading
import unicodedata
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
ESTILOS = ROOT / "tabs_n_buttons" / "estilos"
PADROES_DIR = ESTILOS / "padroes"
IMPORTADOS_DIR = ESTILOS / "importados"
MAX_BODY = 2 * 1024 * 1024
PORT = int(os.environ.get("PORT", "8080"))

for directory in (PADROES_DIR, IMPORTADOS_DIR):
    directory.mkdir(parents=True, exist_ok=True)


def slug(value):
    text = unicodedata.normalize("NFD", str(value or ""))
    text = "".join(c for c in text if unicodedata.category(c) != "Mn")
    text = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")[:42]
    return text or "estilo"


def clean_text(value, limit):
    return re.sub(r"\s+", " ", str(value or "").replace("<", "").replace(">", "")).strip()[:limit]


def sanitize_style(data):
    if not isinstance(data, dict):
        return None
    source = data.get("tokens")
    tokens = {}
    if isinstance(source, dict):
        for key, value in source.items():
            if not re.fullmatch(r"--k-[a-z0-9-]+", str(key), re.I):
                continue
            if not isinstance(value, (str, int, float)):
                continue
            text = str(value).strip()
            if text and len(text) <= 400:
                tokens[str(key)] = text
    if not tokens:
        return None
    meta = data.get("meta") if isinstance(data.get("meta"), dict) else {}
    swatch = data.get("swatch")
    swatch = [clean_text(c, 60) for c in swatch[:3]] if isinstance(swatch, list) else []
    radius = data.get("radius") if data.get("radius") in ("sharp", "soft", "round", "pill") else "soft"
    density = data.get("density") if data.get("density") in ("compact", "regular", "comfortable") else "regular"
    elements = meta.get("elements")
    return {
        "id": slug(data.get("id") or data.get("name")),
        "name": clean_text(data.get("name") or data.get("title") or "Estilo importado", 48) or "Estilo importado",
        "family": clean_text(data.get("family"), 40) or "Importado",
        "note": clean_text(data.get("note"), 160),
        "swatch": [c for c in swatch if c],
        "font": clean_text(data.get("font"), 80) if isinstance(data.get("font"), str) else None,
        "radius": radius,
        "density": density,
        "tokens": tokens,
        "meta": {
            "source": clean_text(meta.get("source"), 400),
            "importedAt": clean_text(meta.get("importedAt"), 40) or str(__import__("datetime").datetime.now().isoformat()),
            "elements": elements if isinstance(elements, (int, float)) else None,
        },
    }


def read_styles(directory, suffix):
    result = []
    if not directory.is_dir():
        return result
    for file in sorted(directory.glob("*" + suffix)):
        try:
            style = sanitize_style(json.loads(file.read_text(encoding="utf-8")))
            if style:
                result.append(style)
        except Exception as exc:
            print("Estilo ignorado (%s): %s" % (file.name, exc))
    return result


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def send_json(self, status, value):
        body = json.dumps(value, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def read_json(self):
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            raise ValueError("Content-Length inválido")
        if length <= 0 or length > MAX_BODY:
            raise ValueError("Corpo da requisição inválido ou muito grande")
        return json.loads(self.rfile.read(length).decode("utf-8"))

    def do_GET(self):
        if self.path == "/api/estilos":
            return self.send_json(200, {
                "padroes": read_styles(PADROES_DIR, "_padrao.json"),
                "importados": read_styles(IMPORTADOS_DIR, "_import.json"),
            })
        return super().do_GET()

    def do_POST(self):
        if self.path == "/api/estilos/importados":
            try:
                style = sanitize_style(self.read_json())
                if not style:
                    return self.send_json(400, {"ok": False, "error": "Nenhum token --k-* válido encontrado."})
                file = IMPORTADOS_DIR / (slug(style["id"]) + "_import.json")
                file.write_text(json.dumps(style, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
                return self.send_json(200, {"ok": True, "file": file.name, "style": style})
            except Exception as exc:
                return self.send_json(400, {"ok": False, "error": str(exc)})

        if self.path == "/api/estilos/importados/remover":
            try:
                data = self.read_json()
            except Exception as exc:
                return self.send_json(400, {"ok": False, "error": str(exc)})
            file = IMPORTADOS_DIR / (slug(data.get("id") if isinstance(data, dict) else None) + "_import.json")
            if not file.is_file():
                return self.send_json(404, {"ok": False, "error": "Arquivo do estilo não encontrado."})
            try:
                file.unlink()
                return self.send_json(200, {"ok": True, "file": file.name})
            except Exception as exc:
                return self.send_json(500, {"ok": False, "error": str(exc)})

        return self.send_json(404, {"ok": False, "error": "Rota não encontrada."})

    def log_message(self, fmt, *args):
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    print("Kit UI disponível em http://localhost:%d/" % PORT)
    if not os.environ.get("NO_OPEN"):
        threading.Timer(0.5, lambda: webbrowser.open("http://localhost:%d/" % PORT)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
