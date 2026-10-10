# La Mesa: native Shopify storefront extension

This is an **extension for an existing Shopify Online Store 2.0 theme**, not an uploadable complete theme and not a deployed shop. It contains a collection, product detail and cart rendered from Shopify's current server data. No catalog JSON, stock copy, checkout proxy, Storefront token, new app or paid dependency is introduced.

## Integration (requires the separate publication approval)

1. Download a copy of the existing Shopify theme and test against an unpublished copy. Copy only the new prefixed files in `assets`, `sections`, `snippets` and `templates`. Keep the host layout, global header/footer, fonts, policy links, consent and app integrations. Review conflicts before copying. Configure the host theme typography to the existing La Mesa brand; CSS uses the brand cream, blue and yellow and inherits fonts.
2. **Merge only the `mesa_shop` object** from each `locale-fragments/*.json` into its matching existing theme locale. Never replace a locale file. For the default language merge into the matching `*.default.json`; keep the host's other translation keys. ES, EN, CA and PT UI translations are supplied. Enable the corresponding storefront languages separately; product/filter translations must also be configured if multilingual content is wanted.
3. Assign `product.mesa` to the Mesana-managed products and `collection.mesa` to the desired collections. For `/collections/all`, configure the actual default collection template to render `mesa-collection` after examining the existing template. For the canonical `/cart`, integrate `mesa-cart` into the existing cart template, replacing its previous cart content sections while retaining required host/app sections. `cart.mesa` is an alternate preview only: native add/update/remove/checkout redirects use the canonical cart URL. Merely uploading alternate templates is insufficient. Do not rely on `?view=mesa` for a production browsing flow.
4. Define `mesana_catalog.details` as a product JSON metafield, and `mesana_catalog.colors` as `list.single_line_text_field`, with storefront-readable access. Backend synchronization writes descriptive fields to `details` and the filter values to `colors`; `productType` is the category. Enable native storefront filters for product type, `mesana_catalog.colors` and availability in the existing Shopify filter configuration. Choose OR behavior for color values. The section renders only actual native list/boolean filters; price-range filters are intentionally not part of this release. Do not configure a price-range filter for this template.
5. Preview and test the canonical catalog → product → basket → checkout journey in each enabled locale and on mobile before publishing. Shopify payments, market coverage, shipping/pickup, policies, live product photos, product/channel publication and the Mesana online-order synchronization remain separate prerequisites; this code does not configure them.

## Behavior and data contract

`product.metafields.mesana_catalog.details.value` is an object with `category`, `colors` (array), `description`, `materials`, `dimensions`, and `care`. These are optional plain text and are escaped before rendering. An explicitly cleared managed description stays empty; the native Shopify description is a fallback only when the Mesana details metafield is absent. Descriptive colors are never variants. The template shows actual Shopify variants where present. Variant selection deliberately submits a GET to reload the selected server price and availability before adding; this works without JavaScript and avoids displaying stale prices. Mesana currently creates one variant per product. This extension is intended for that catalog, not selling-plan/subscription products or products with more than Liquid's exposed variant limit.

Collection pagination is native (24 items). Changing filters submits a GET, resetting the page while keeping the chosen sort. Native links and the localization form retain Shopify's language routing. Filters use Shopify labels/counts and disable zero-result unchecked values. Missing photos display an honest placeholder, not another product's image. No delivery price or tax inclusion is invented.

Add, quantity update, remove, and checkout use native Shopify forms/URLs. The cart displays server-calculated discounted line totals and cart totals; the update button refreshes the subtotal before checkout. Final stock/quantity validation and failure responses belong to Shopify; template `form.errors` is displayed when Shopify provides it, and a rejected POST may be rendered by Shopify's native error page. No claim of optimistic stock reservation or live JavaScript repricing is made.

## Verification

Run `node --test shopify-theme/tests/theme-contract.test.mjs` from the website root. These dependency-free checks validate packaging, translation completeness, escaping, native commerce and filtering contracts. **They do not render Liquid or verify Shopify runtime behavior.** A Shopify Liquid renderer/Theme Check is not installed locally; no new tools were installed. Rendering, host-theme compatibility (including cart interception), real stock-race errors, keyboard/mobile layout and checkout still require the unpublished Shopify theme preview.

Official implementation references checked 10 October 2026:

- [Alternate templates](https://shopify.dev/docs/storefronts/themes/architecture/templates/alternate-templates)
- [Storefront filtering](https://shopify.dev/docs/storefronts/themes/navigation-search/filtering/storefront-filtering/support-storefront-filtering)
- [Liquid filter object](https://shopify.dev/docs/api/liquid/objects/filter)
- [Native form types](https://shopify.dev/docs/api/liquid/tags/form)
- [Variant object and quantity rules](https://shopify.dev/docs/api/liquid/objects/variant)
- [Native cart template](https://shopify.dev/docs/storefronts/themes/architecture/templates/cart)
