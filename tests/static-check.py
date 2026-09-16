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
    assert "Powered by Eureka Websites" in page.read_text(encoding="utf-8"), f"{page.name}: missing Eureka Websites footer credit"

index = (ROOT / "index.html").read_text(encoding="utf-8")
for required in (
    "Transferencia",
    "Efectivo",
    "Tarjeta en línea",
    "data-confirm-order",
    "data-simulate-card-payment",
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
for required in ("$8,900 MXN", "$990 MXN", "$2,190 MXN", "Stripe Checkout", "Uber Direct", "WhatsApp Business API", "no incluye API ni envíos automáticos", "Formulario de contacto", "redes sociales", "SEO técnico básico", "catálogo completo", "Punto Café Standard", "Se cotizan por separado"):
    assert required in quote, f"quote.html: missing commercial marker {required!r}"

guide = (ROOT / "guide.html").read_text(encoding="utf-8")
assert ".proof-copy span" in guide, "guide.html: proof descriptions must not restyle proof icons"
assert ".proof-item span{" not in guide, "guide.html: broad selector would break proof icon centering"

sales_css = (ROOT / "sales.css").read_text(encoding="utf-8")
assert ".eureka-credit{position:fixed" not in sales_css, "sales.css: Eureka credit must remain in the footer"
assert (ROOT / "assets" / "mignon-social-card.jpg").exists(), "missing branded social preview"
assert (ROOT / "assets" / "punto-cafe-mark.png").exists(), "missing text-free Punto Café mark"

print("Static checks passed for Punto Café Lite.")
