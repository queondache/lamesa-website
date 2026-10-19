# La Mesa: native Shopify storefront extension

This is an **extension for an existing Shopify Online Store 2.0 theme**, not an uploadable complete theme and not a deployed shop. It contains a collection, product detail and cart rendered from Shopify's current server data. No catalog JSON, stock copy, checkout proxy, Storefront token, new app or paid dependency is introduced.

## Integration (requires the separate publication approval)

1. Download a copy of the existing Shopify theme and test against an unpublished copy. Copy only the new prefixed files in `assets`, `sections`, `snippets` and `templates`. Keep the host layout, global header/footer, fonts, policy links, consent and app integrations. Review conflicts before copying. Configure the host theme typography to the existing La Mesa brand; CSS uses the brand cream, blue and yellow and inherits fonts.
2. **Merge only the `mesa_shop` object** from each `locale-fragments/*.json` into its matching existing theme locale. Never replace a locale file. For the default language merge into the matching `*.default.json`; keep the host's other translation keys. ES, EN, CA, PT and IT UI translations are supplied. IT is required by the store’s currently active Italian locale, observed during private preview. Enable the corresponding storefront languages separately; product/filter translations must also be configured if multilingual content is wanted.
3. Assign `product.mesa` to the Mesana-managed products and `collection.mesa` to the desired collections. For `/collections/all`, configure the actual default collection template to render `mesa-collection` after examining the existing template. For the canonical `/cart`, integrate `mesa-cart` into the existing cart template, replacing its previous cart content sections while retaining required host/app sections. `cart.mesa` is an alternate preview only: native add/update/remove/checkout redirects use the canonical cart URL. Merely uploading alternate templates is insufficient. Do not rely on `?view=mesa` for a production browsing flow.
4. Create the merchant-owned **product** metafield definitions below in Shopify Settings → Custom data → Products, with storefront-readable access. Staff edit them on each Shopify product page. Enable native storefront filters for product type, `custom.colors` and availability in the existing Shopify filter configuration. Choose OR behavior for color values. The section renders only actual native list/boolean filters; price-range filters are intentionally not part of this release. Do not configure a price-range filter for this template.

   | Display name | Namespace/key | Shopify type | Staff input |
   | --- | --- | --- | --- |
   | Colores | `custom.colors` | `list.single_line_text_field` | One descriptive color per list entry, e.g. Azul, Blanco |
   | Materiales | `custom.materials` | `single_line_text_field` | Plain text, e.g. Cerámica esmaltada |
   | Dimensiones | `custom.dimensions` | `single_line_text_field` | Plain text including units, e.g. 8 × 10 cm |
   | Cuidados | `custom.care` | `multi_line_text_field` | Plain-text care instructions; line breaks retained |

5. Preview and test the canonical catalog → product → basket → checkout journey in each enabled locale and on mobile before publishing. Shopify payments, market coverage, shipping/pickup, policies, live product photos, product/channel publication and the Mesana online-order synchronization remain separate prerequisites; this code does not configure them.

## Behavior and data contract

**Ownership:** Mesana supplies product type/category, name, photo and quantity. Shopify owns the product description, colors, materials, dimensions, care instructions and search-engine text. A Mesana update must never overwrite those editorial fields. Category is Shopify `productType`, exposed to Liquid as `product.type`; this is the merchant product type, not Shopify's standard taxonomy category.

The product description comes exclusively from Shopify's native rich-text editor (`product.description`). It renders merchant-authored HTML with paragraphs, lists, links and emphasis intact, inside a responsive container. This is trusted store-admin content, not customer input. A blank Shopify description remains blank. The four optional `custom` metafields above are escaped plain text; empty values hide their corresponding rows. No earlier app-owned editorial data is read or used as a fallback, and this extension performs no writes or content migration.

Descriptive colors are never variants. The template shows actual Shopify variants where present. Variant selection deliberately submits a GET to reload the selected server price and availability before adding; this works without JavaScript and avoids displaying stale prices. Mesana currently creates one variant per product. This extension is intended for that catalog, not selling-plan/subscription products or products with more than Liquid's exposed variant limit.

Collection pagination is native (24 items). Changing filters submits a GET, resetting the page while keeping the chosen sort. Native links and the localization form retain Shopify's language routing. Filters use Shopify labels/counts and disable zero-result unchecked values. Missing photos display an honest placeholder, not another product's image. No delivery price or tax inclusion is invented.

Add, quantity update, remove, and checkout use native Shopify forms/URLs. The cart displays server-calculated discounted line totals and cart totals; the update button refreshes the subtotal before checkout. Final stock/quantity validation and failure responses belong to Shopify; template `form.errors` is displayed when Shopify provides it, and a rejected POST may be rendered by Shopify's native error page. No claim of optimistic stock reservation or live JavaScript repricing is made.

## Verification

Run `node --test shopify-theme/tests/theme-contract.test.mjs` from the website root. These dependency-free checks validate packaging, translation completeness, escaping, native commerce and filtering contracts. **They do not render Liquid or verify Shopify runtime behavior.** A Shopify Liquid renderer/Theme Check is not installed locally; no new tools were installed. Rendering, host-theme compatibility (including cart interception), real stock-race errors, keyboard/mobile layout and checkout still require the unpublished Shopify theme preview.

Runtime acceptance for editorial ownership:

1. In a test Shopify product, enter a description with paragraphs, a list and a link; add all four custom fields. Verify formatting, accents and escaped literal `<` characters in plain-text characteristics on desktop and at 390 px.
2. Update that product's category/name/photo/quantity through Mesana. Confirm Shopify description and all four characteristics remain unchanged, and category displays the updated product type.
3. Clear the Shopify description and one custom field. Confirm the description/row disappears without resurrecting older content. Products without photos must keep their placeholder.
4. Select a custom color and product type in the collection filters; verify actual matching products and zero-result behavior. Changing quantity and adding to cart must still use native Shopify forms.

Official implementation references checked 10 October 2026:

- [Liquid product fields](https://shopify.dev/docs/api/liquid/objects/product)
- [Liquid metafield values](https://shopify.dev/docs/api/liquid/objects/metafield)
- [Metafield data types](https://shopify.dev/docs/apps/build/metafields/list-of-data-types)

- [Alternate templates](https://shopify.dev/docs/storefronts/themes/architecture/templates/alternate-templates)
- [Storefront filtering](https://shopify.dev/docs/storefronts/themes/navigation-search/filtering/storefront-filtering/support-storefront-filtering)
- [Liquid filter object](https://shopify.dev/docs/api/liquid/objects/filter)
- [Native form types](https://shopify.dev/docs/api/liquid/tags/form)
- [Variant object and quantity rules](https://shopify.dev/docs/api/liquid/objects/variant)
- [Native cart template](https://shopify.dev/docs/storefronts/themes/architecture/templates/cart)
