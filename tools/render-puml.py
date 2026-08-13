#!/usr/bin/env python3
"""Renderiza os diagramas PlantUML de docs/diagrams/*.puml para public/diagrams/*.svg.

Cada fonte gera DUAS variantes — `<nome>-light.svg` e `<nome>-dark.svg` — porque o
portfolio tem alternancia de tema e um SVG de tema unico fica ilegivel na metade dos
casos. Os arquivos .puml contem apenas a estrutura do diagrama; a paleta e injetada
aqui, entao a mesma fonte serve aos dois temas.

Os SVGs sao versionados e servidos como assets estaticos, de modo que o portfolio nao
depende de nenhum servico externo em runtime. A renderizacao usa o servidor publico do
PlantUML (Kroki como fallback), evitando exigir Java + Graphviz na maquina de build.

Uso:
    python tools/render-puml.py            # renderiza todos os diagramas
    python tools/render-puml.py lifeplus   # renderiza apenas os que casam com o filtro
"""

from __future__ import annotations

import base64
import sys
import urllib.error
import urllib.request
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / "docs" / "diagrams"
OUT_DIR = ROOT / "public" / "diagrams"

# PlantUML usa um alfabeto base64 proprio.
STD_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
PUML_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_"
TRANSLATION = str.maketrans(STD_ALPHABET, PUML_ALPHABET)

SERVERS = (
    "https://www.plantuml.com/plantuml/svg/",
    "https://kroki.io/plantuml/svg/",
)

# Paletas alinhadas com src/styles/_themes.scss.
THEMES = {
    "light": {
        "text": "#0f172a",
        "muted": "#475569",
        "line": "#94a3b8",
        "surface": "#ffffff",
        "surfaceAlt": "#f1f5f9",
        "accent": "#6366f1",
        "accentSoft": "#eef2ff",
    },
    "dark": {
        "text": "#f1f5f9",
        "muted": "#cbd5e1",
        "line": "#64748b",
        "surface": "#1e293b",
        "surfaceAlt": "#334155",
        "accent": "#818cf8",
        "accentSoft": "#312e81",
    },
}

PREAMBLE = """skinparam backgroundColor transparent
skinparam shadowing false
skinparam defaultFontName Helvetica
skinparam defaultFontSize 13
skinparam defaultFontColor {text}
skinparam ArrowColor {line}
skinparam ArrowFontColor {muted}
skinparam TitleFontColor {text}
skinparam NoteBackgroundColor {surfaceAlt}
skinparam NoteBorderColor {line}
skinparam NoteFontColor {text}
skinparam RectangleBackgroundColor {surface}
skinparam RectangleBorderColor {line}
skinparam RectangleFontColor {text}
skinparam ComponentBackgroundColor {surface}
skinparam ComponentBorderColor {accent}
skinparam ComponentFontColor {text}
skinparam DatabaseBackgroundColor {surfaceAlt}
skinparam DatabaseBorderColor {line}
skinparam DatabaseFontColor {text}
skinparam QueueBackgroundColor {surfaceAlt}
skinparam QueueBorderColor {line}
skinparam QueueFontColor {text}
skinparam CloudBackgroundColor {surfaceAlt}
skinparam CloudBorderColor {line}
skinparam CloudFontColor {text}
skinparam ActorBackgroundColor {surface}
skinparam ActorBorderColor {accent}
skinparam ActorFontColor {text}
skinparam ParticipantBackgroundColor {surface}
skinparam ParticipantBorderColor {accent}
skinparam ParticipantFontColor {text}
skinparam SequenceLifeLineBorderColor {line}
skinparam SequenceBoxBackgroundColor {accentSoft}
skinparam SequenceBoxBorderColor {line}
skinparam SequenceBoxFontColor {text}
skinparam SequenceGroupBackgroundColor {accentSoft}
skinparam SequenceGroupBorderColor {line}
skinparam SequenceGroupFontColor {text}
skinparam SequenceDividerBackgroundColor {surfaceAlt}
skinparam SequenceDividerFontColor {text}
skinparam PackageBackgroundColor transparent
skinparam PackageBorderColor {line}
skinparam PackageFontColor {muted}
skinparam NodeBackgroundColor {surface}
skinparam NodeBorderColor {line}
skinparam NodeFontColor {text}
skinparam ClassBackgroundColor {surface}
skinparam ClassBorderColor {accent}
skinparam ClassFontColor {text}
skinparam ClassAttributeFontColor {muted}
"""


def apply_theme(source: str, theme: str) -> str:
    """Injeta a paleta logo apos a diretiva @start* do diagrama."""
    palette = PREAMBLE.format(**THEMES[theme])
    lines = source.splitlines()
    for index, line in enumerate(lines):
        if line.strip().startswith("@start"):
            return "\n".join(lines[: index + 1] + [palette] + lines[index + 1 :])
    raise ValueError("diagrama sem diretiva @start")


def encode(source: str) -> str:
    """Aplica deflate raw + base64 no alfabeto do PlantUML."""
    compressor = zlib.compressobj(9, zlib.DEFLATED, -15)
    compressed = compressor.compress(source.encode("utf-8")) + compressor.flush()
    return base64.b64encode(compressed).decode("ascii").translate(TRANSLATION).rstrip("=")


def render(source: str) -> bytes:
    encoded = encode(source)
    last_error: Exception | None = None
    for server in SERVERS:
        request = urllib.request.Request(
            server + encoded, headers={"User-Agent": "Mozilla/5.0 (portfolio-diagram-renderer)"}
        )
        try:
            with urllib.request.urlopen(request, timeout=45) as response:
                payload = response.read()
            if payload.lstrip().startswith(b"<svg"):
                if b"syntax error" in payload.lower() or b"Syntax Error" in payload:
                    raise RuntimeError("PlantUML reportou erro de sintaxe no diagrama")
                return payload
            last_error = RuntimeError(f"{server} devolveu conteudo que nao e SVG")
        except (urllib.error.URLError, OSError) as error:  # noqa: PERF203
            last_error = error
    raise RuntimeError(f"nao foi possivel renderizar: {last_error}")


def main() -> int:
    name_filter = sys.argv[1] if len(sys.argv) > 1 else ""
    if not SRC_DIR.exists():
        print(f"diretorio de origem nao encontrado: {SRC_DIR}")
        return 1

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    sources = sorted(p for p in SRC_DIR.glob("*.puml") if name_filter in p.stem)
    if not sources:
        print("nenhum diagrama encontrado para renderizar")
        return 1

    rendered = 0
    failures = 0
    for source_path in sources:
        raw = source_path.read_text(encoding="utf-8")
        for theme in THEMES:
            target = OUT_DIR / f"{source_path.stem}-{theme}.svg"
            try:
                svg = render(apply_theme(raw, theme))
            except (RuntimeError, ValueError) as error:
                print(f"FALHA  {target.name}: {error}")
                failures += 1
                continue
            target.write_bytes(svg)
            rendered += 1
            print(f"OK     {target.name} ({len(svg):,} bytes)")

    total = len(sources) * len(THEMES)
    print(f"\n{rendered}/{total} arquivos renderizados em {OUT_DIR}")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
