# Punto Café Lite — Project State

- Last updated: 2026-09-16
- Lifecycle state: active
- Workflow status: sales package ready
- Product: reusable online-ordering package for small food businesses

## Current scope

The product is white-label: each deployment uses the client's name, logo,
colors, typography, photography, address, hours, and WhatsApp, while Punto Café Lite remains Eureka's
internal product name. The demo presents two roles: customer and administration. The customer can browse
an expandable catalog, build a cart, select pickup or delivery, schedule at least
one day ahead, choose transfer or cash, receive an order number, and open a
prewritten WhatsApp message. Administration can review orders, advance statuses,
open status-specific WhatsApp messages, add products, and control availability
with a simple Available/Sold-out switch. Numeric inventory and ingredient
tracking are intentionally excluded unless a client requests them separately.

The sales package also contains a quick guide and a scope/pricing page.

## Commercial baseline

- Implementation: $6,900 MXN once.
- Service: $590 MXN/month from publication.
- Alternative: $1,490 MXN/month with a 12-month minimum and no setup payment.
- Launch includes configuration, up to 10 initial products, one revision round,
  deployment, and a quick guide.

## Explicit exclusions

Card processing, Uber Direct, automated WhatsApp Business API messages, point of
sale, cash closing, suppliers, and purchasing are not part of the base package.
They require separate scope and pricing.

## Validation

- HTML parses with unique IDs and valid local asset paths.
- Inline JavaScript passes syntax compilation.
- `tests/static-check.py` asserts the required ordering and commercial markers.
- Public customer QA passed: catalog, cart, delivery selection, next-day date,
  transfer selection, order creation, transfer instructions, and tracking.
- Public admin QA passed: order visibility, payment-status transition, product
  availability, product creation, business identity, color, and typography.
- Public guide and quote pages load correctly from GitHub Pages.

## Next

Review the proposed price internally, then send the prepared client outreach.
Before client configuration, confirm transfer, cash, or both; pickup/delivery
rules; bank details; the WhatsApp destination number; and final brand assets.
