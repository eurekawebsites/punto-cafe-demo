from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PAGES = [ROOT / "index.html", ROOT / "guide.html", ROOT / "quote.html"]


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.local_assets = []

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if values.get("id"):
            self.ids.append(values["id"])
        if tag in {"a", "img", "link", "script"}:
            url = values.get("href") or values.get("src")
            if url and not url.startswith(("#", "http:", "https:", "mailto:", "tel:")):
                self.local_assets.append(url.split("#", 1)[0].split("?", 1)[0])


for page in PAGES:
    parser = PageParser()
    parser.feed(page.read_text(encoding="utf-8"))
    duplicates = {item for item in parser.ids if parser.ids.count(item) > 1}
    assert not duplicates, f"{page.name}: duplicate IDs: {sorted(duplicates)}"
    for asset in parser.local_assets:
        assert (page.parent / asset).resolve().exists(), f"{page.name}: missing local asset {asset}"

index = (ROOT / "index.html").read_text(encoding="utf-8")
for required in (
    "Transferencia",
    "Efectivo",
    "data-confirm-order",
    "data-whatsapp-order",
    "Pendiente de pago",
    "Agregar producto",
    "Mi negocio",
    "businessAddress",
    "businessPrimary",
    "businessTypography",
    "businessSocialLinks",
    "Formulario de contacto",
    "Instagram · Facebook · TikTok",
):
    assert required in index, f"index.html: missing required flow marker {required!r}"

quote = (ROOT / "quote.html").read_text(encoding="utf-8")
for required in ("$6,900 MXN", "$590 MXN", "$1,490 MXN", "Uber Direct", "WhatsApp Business API", "Formulario de contacto", "Redes sociales", "SEO técnico local"):
    assert required in quote, f"quote.html: missing commercial marker {required!r}"

print("Static checks passed for Punto Café Lite.")
