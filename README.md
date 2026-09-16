# Punto Café Lite

Sales-ready interactive demo for a productized food-business ordering system.

## Pages

- `index.html`: customer and admin demo.
- `guide.html`: quick guide and suggested demo walkthrough.
- `quote.html`: client-facing scope, pricing, terms, and exclusions.

## Product boundary

Punto Café Lite is white-label and includes configurable business identity,
logo space, colors, typography, address, hours, and WhatsApp. The client-facing
site does not display Punto Café Lite branding. It also includes an expandable catalog with a simple available/sold-out switch, cart, scheduled pickup/delivery,
online card payment through Stripe Checkout, optional transfer/cash selection,
order management, product availability, and
WhatsApp-assisted customer messages. The public site includes standard business
content, a contact form, links to every social profile supplied by the client,
and basic technical/local SEO. Launch imports the client's complete catalog from
one organized Excel/CSV or equivalent file with matching images. Lite deliberately
excludes POS, cash drawer, suppliers, automated WhatsApp Business API messaging,
Uber Direct, and payment processors other than the standard Stripe Checkout
integration.

Numeric inventory and ingredient tracking are intentionally excluded from Lite.
The public demo simulates all data and never collects card details. The
production starter in `functions/` provides server-priced Stripe Checkout and
signed webhook verification. A client implementation still requires Firebase
deployment, authentication, catalog data, security configuration, and the
client's own Stripe account.
