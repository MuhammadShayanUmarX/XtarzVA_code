import base64
import io
import json
import re
import zipfile
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from ..models.schemas import CommerceCreationOutput, EngineStage, MetaAdsSpyOutput, ProductVariant

TEMPLATE_DIR = Path(__file__).resolve().parent.parent.parent / "theme_templates" / "xtarz-minimal"


def _slugify(text: str) -> str:
    slug = re.sub(r"[^\w\s-]", "", text.lower())
    return re.sub(r"[-\s]+", "-", slug).strip("-") or "store"


def _variant_price(commerce: CommerceCreationOutput) -> str:
    variants: List[Any] = commerce.variants or []
    if not variants:
        return "29.99"
    v = variants[0]
    if isinstance(v, ProductVariant):
        return v.price
    if isinstance(v, dict):
        return v.get("price", "29.99")
    return getattr(v, "price", "29.99")


def _build_settings_data(commerce: CommerceCreationOutput) -> Dict[str, Any]:
    if commerce.settings_data and commerce.settings_data.get("current"):
        return commerce.settings_data
    colors = commerce.theme_colors or {}
    return {
        "current": {
            "color_primary": colors.get("primary", "#0f0f0f"),
            "color_accent": colors.get("accent", "#c9a962"),
            "color_background": colors.get("background", "#faf9f7"),
            "color_surface": colors.get("surface", "#ffffff"),
            "color_text_muted": colors.get("text_muted", "#6b6b6b"),
            "color_accent_soft": colors.get("accent_soft", "#e8dfd0"),
        }
    }


def _inject_css_colors(css: str, colors: Dict[str, str]) -> str:
    if not colors:
        return css
    replacements = {
        "--color-primary": colors.get("primary"),
        "--color-accent": colors.get("accent"),
        "--color-background": colors.get("background"),
        "--color-surface": colors.get("surface"),
        "--color-text-muted": colors.get("text_muted"),
        "--color-accent-soft": colors.get("accent_soft"),
    }
    for var, value in replacements.items():
        if value:
            css = re.sub(
                rf"({re.escape(var)}:\s*)[^;]+;",
                rf"\1{value};",
                css,
            )
    return css


def _build_index_template(commerce: CommerceCreationOutput) -> Dict[str, Any]:
    if commerce.homepage_sections and commerce.homepage_sections.get("sections"):
        return commerce.homepage_sections

    price = _variant_price(commerce)
    compare = ""
    variants = commerce.variants or []
    if variants:
        v = variants[0]
        cp = v.compare_at_price if hasattr(v, "compare_at_price") else (v.get("compare_at_price") if isinstance(v, dict) else None)
        if cp:
            compare = f"${cp}"

    hero_asset = commerce.hero_image_assets[0] if commerce.hero_image_assets else "hero-1.jpg"
    product_asset = commerce.product_image_assets[0] if commerce.product_image_assets else "product-1.jpg"
    trust_points = commerce.trust_points or [
        "Free shipping on all orders",
        "30-day satisfaction guarantee",
        "Premium quality, built to last",
    ]

    return {
        "sections": {
            "header": {
                "type": "header",
                "settings": {"logo_text": commerce.theme_name},
            },
            "hero": {
                "type": "hero-banner",
                "settings": {
                    "headline": commerce.hero_headline or "Crafted for everyday excellence",
                    "subheadline": commerce.hero_subheadline or "Thoughtfully designed for you.",
                    "button_label": commerce.hero_button_label or "Shop the collection",
                    "hero_image_asset": hero_asset,
                },
            },
            "trust": {
                "type": "trust-bar",
                "settings": {
                    "heading": commerce.trust_heading or "Why customers choose us",
                    "point_1": trust_points[0] if len(trust_points) > 0 else "",
                    "point_2": trust_points[1] if len(trust_points) > 1 else "",
                    "point_3": trust_points[2] if len(trust_points) > 2 else "",
                },
            },
            "featured": {
                "type": "featured-product",
                "settings": {
                    "title": commerce.collection_title or commerce.theme_name,
                    "description": (commerce.about_snippet or "")[:400],
                    "price": f"${price}",
                    "compare_at_price": compare,
                    "product_image_asset": product_asset,
                },
            },
            "testimonial": {
                "type": "testimonial",
                "settings": {
                    "quote": commerce.testimonial_quote or "Absolutely love the quality. Exceeded my expectations.",
                    "author": commerce.testimonial_author or "Verified customer",
                },
            },
            "about": {
                "type": "rich-text",
                "settings": {
                    "heading": "Our story",
                    "body": (
                        f"<p>{commerce.about_snippet}</p>"
                        if commerce.about_snippet
                        else "<p>We believe in products that earn a permanent place in your life.</p>"
                    ),
                },
            },
            "footer": {
                "type": "footer",
                "settings": {
                    "copyright_text": f"© 2026 {commerce.theme_name}. All rights reserved.",
                },
            },
        },
        "order": ["header", "hero", "trust", "featured", "testimonial", "about", "footer"],
    }


def _build_product_import(
    engine_data: Dict[str, Any],
    commerce: CommerceCreationOutput,
    meta: Optional[MetaAdsSpyOutput],
) -> Dict[str, Any]:
    product = engine_data.get("selected_product") or engine_data.get(EngineStage.PRODUCT_INTELLIGENCE.value) or {}
    sourcing = engine_data.get(EngineStage.PRODUCT_SOURCING.value) or {}
    best = sourcing.get("best_option", {}) if isinstance(sourcing, dict) else {}

    title = (meta.product_title if meta else "") or product.get("product_name", "Product")
    body_html = (meta.product_creative_description_html if meta else "") or (meta.product_creative_description if meta else "")
    if not body_html and meta:
        body_html = f"<p>{meta.product_creative_description}</p>"
    tags = meta.tags if meta else []
    seo_title = meta.seo_meta_title if meta else title
    seo_desc = meta.seo_meta_description if meta else ""

    variants: List[Any] = commerce.variants or [{"title": "Default", "price": "29.99"}]
    variant_list = []
    for v in variants:
        if isinstance(v, ProductVariant):
            vd = v.model_dump()
        elif isinstance(v, dict):
            vd = v
        else:
            vd = {"title": "Default", "price": "29.99"}
        variant_list.append({
            "title": vd.get("title", "Default"),
            "price": str(vd.get("price", best.get("price_per_unit", "29.99"))),
            "compare_at_price": vd.get("compare_at_price"),
            "sku": vd.get("sku", ""),
        })

    return {
        "product": {
            "title": title,
            "body_html": body_html,
            "vendor": commerce.theme_name,
            "product_type": commerce.collection_title or "General",
            "tags": ", ".join(tags) if tags else "",
            "status": "draft",
            "handle": commerce.product_handle or _slugify(title),
            "variants": variant_list,
            "metafields_global_title_tag": seo_title[:70],
            "metafields_global_description_tag": seo_desc[:160],
        }
    }


def _readme_text(product_name: str) -> str:
    return f"""XtarzVA Store Builder — {product_name}
============================================

This ZIP contains a complete Shopify OS 2.0 theme ready to upload.

HOW TO UPLOAD THEME
-------------------
1. Shopify Admin → Online Store → Themes
2. Click "Add theme" → "Upload zip file"
3. Select this ZIP (theme files are at the root: config/, layout/, sections/, etc.)
4. Click "Publish" when ready

PRODUCT IMPORT
--------------
After uploading the theme, import the product separately:
- Open extras/product-import.json
- Create product in Shopify Admin using the title, description, tags, and variants

Generated by XtarzVA — https://xtarzva.site
"""


def _normalize_legacy_commerce(raw: Dict[str, Any]) -> Dict[str, Any]:
    """Map pre-refactor commerce_creation payloads to the theme-focused schema."""
    if raw.get("theme_name"):
        return raw
    title = raw.get("product_title") or (raw.get("seo_titles") or ["Store"])[0]
    return {
        "theme_name": title,
        "theme_slug": _slugify(title),
        "hero_headline": raw.get("homepage_hero_headline") or title,
        "hero_subheadline": raw.get("homepage_hero_subheadline") or raw.get("product_description", "")[:160],
        "about_snippet": raw.get("about_page_snippet") or raw.get("product_description", ""),
        "collection_title": raw.get("collection_title") or f"{title} Collection",
        "theme_colors": (raw.get("store_theme_json") or {}).get("colors")
        or {"primary": "#1a1a2e", "accent": "#e94560", "background": "#ffffff"},
        "hero_image_urls": raw.get("generated_image_urls") or [],
        "product_image_urls": [],
        "variants": raw.get("variants") or [],
    }


async def build_theme_zip(
    engine_data: Dict[str, Any],
    run_id: str,
) -> Tuple[bytes, str]:
    """Build a Shopify-uploadable theme ZIP from commerce_creation output."""
    raw = engine_data.get(EngineStage.COMMERCE_CREATION.value)
    if not raw:
        raise ValueError("No store builder output found for this run")

    commerce = CommerceCreationOutput.model_validate(_normalize_legacy_commerce(raw))
    meta_raw = engine_data.get(EngineStage.META_ADS_SPY.value) or {}
    meta = MetaAdsSpyOutput.model_validate(meta_raw) if meta_raw else None

    product = engine_data.get("selected_product") or engine_data.get(EngineStage.PRODUCT_INTELLIGENCE.value) or {}
    product_name = product.get("product_name", "store") if isinstance(product, dict) else "store"
    slug = commerce.theme_slug or _slugify(product_name)

    if not TEMPLATE_DIR.exists():
        raise ValueError(f"Theme template not found at {TEMPLATE_DIR}")

    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        for file_path in TEMPLATE_DIR.rglob("*"):
            if not file_path.is_file():
                continue
            rel = file_path.relative_to(TEMPLATE_DIR)
            arcname = str(rel).replace("\\", "/")
            content = file_path.read_bytes()

            if rel.as_posix() == "config/settings_data.json":
                content = json.dumps(_build_settings_data(commerce), indent=2).encode("utf-8")
            elif rel.as_posix() == "templates/index.json":
                content = json.dumps(_build_index_template(commerce), indent=2).encode("utf-8")
            elif rel.as_posix() == "assets/theme.css":
                content = _inject_css_colors(content.decode("utf-8"), commerce.theme_colors).encode("utf-8")

            zf.writestr(arcname, content)

        for filename, b64 in (commerce.theme_image_payloads or {}).items():
            try:
                zf.writestr(f"assets/{filename}", base64.b64decode(b64))
            except Exception:
                pass

        zf.writestr("extras/README.txt", _readme_text(product_name))
        zf.writestr(
            "extras/product-import.json",
            json.dumps(_build_product_import(engine_data, commerce, meta), indent=2),
        )

    return buf.getvalue(), f"{slug}-theme-{run_id[:8]}.zip"
