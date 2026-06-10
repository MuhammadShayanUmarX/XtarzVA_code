import re
from typing import Any, Dict, List, Optional
from urllib.parse import urlparse

from ..models.schemas import ProductCandidate, CompetitorProfile, SourcingOption

MAX_ROWS = 8


def _parse_price_from_text(text: str) -> Optional[str]:
    if not text:
        return None
    match = re.search(r"\$[\d,.]+(?:\s*-\s*\$[\d,.]+)?", text)
    if match:
        return match.group()
    match = re.search(r"USD\s*[\d,.]+", text, re.I)
    if match:
        return match.group()
    return None


def _domain_name(url: str) -> str:
    if not url:
        return "Unknown"
    try:
        host = urlparse(url).netloc.replace("www.", "")
        return host.split(".")[0].title() if host else "Unknown"
    except Exception:
        return "Unknown"


def _detect_platform(url: str, default: str = "Web") -> str:
    url_lower = (url or "").lower()
    if "amazon." in url_lower:
        return "Amazon"
    if "tiktok" in url_lower:
        return "TikTok Shop"
    if "reddit.com" in url_lower:
        return "Reddit"
    if "shopify" in url_lower or ".myshopify.com" in url_lower:
        return "Shopify"
    if "alibaba.com" in url_lower:
        return "Alibaba"
    if "aliexpress.com" in url_lower:
        return "AliExpress"
    if "cjdropshipping.com" in url_lower:
        return "CJ Dropshipping"
    return default


def normalize_product_candidates(
    web: List[Dict[str, Any]],
    amazon: List[Dict[str, Any]],
    tiktok: List[Dict[str, Any]],
    reddit: List[Dict[str, Any]],
    urls: Optional[List[Dict[str, Any]]] = None,
) -> List[ProductCandidate]:
    candidates: List[ProductCandidate] = []
    seen: set[str] = set()

    def _add(name: str, platform: str, url: str, price=None, demand=None, category=None, snippet=None):
        key = f"{name}|{url}".lower()
        if not name or key in seen:
            return
        seen.add(key)
        candidates.append(ProductCandidate(
            product_name=name[:200],
            platform=platform,
            source_url=url or "",
            price=str(price) if price else _parse_price_from_text(snippet or ""),
            demand_signal=str(demand) if demand else None,
            category=str(category)[:100] if category else None,
            snippet=(snippet or "")[:300] or None,
        ))

    for item in web[:MAX_ROWS]:
        title = item.get("title") or item.get("content", "")[:80]
        _add(title, "Web", item.get("url", ""), snippet=item.get("content", ""))

    for item in amazon[:MAX_ROWS]:
        title = item.get("title") or item.get("content", "")[:80]
        content = item.get("content", "")
        _add(
            title,
            "Amazon",
            item.get("url", ""),
            price=_parse_price_from_text(content),
            snippet=content,
        )

    for item in tiktok[:MAX_ROWS]:
        title = item.get("title", "")
        sales = item.get("total_sales") or item.get("reviews_count")
        demand = f"{sales} sales" if item.get("total_sales") else (f"{sales} reviews" if sales else None)
        price = item.get("avg_price") or item.get("min_price")
        _add(
            title,
            "TikTok Shop",
            item.get("url", ""),
            price=f"${price}" if price and not str(price).startswith("$") else price,
            demand=demand,
            category=item.get("category"),
        )

    for item in reddit[:MAX_ROWS]:
        title = item.get("title") or item.get("content", "")[:80]
        _add(title, "Reddit", item.get("url", ""), snippet=item.get("content", ""))

    for item in (urls or [])[:MAX_ROWS]:
        url = item.get("url", "")
        content = item.get("content", "")
        _add(_domain_name(url) + " listing", _detect_platform(url), url, snippet=content)

    return candidates[:MAX_ROWS * 2]


def normalize_competitors(
    amazon: List[Dict[str, Any]],
    tiktok: List[Dict[str, Any]],
    web_search: List[Dict[str, Any]],
    audits: List[Dict[str, Any]],
) -> List[CompetitorProfile]:
    profiles: List[CompetitorProfile] = []
    seen: set[str] = set()

    def _add(name: str, url: str, platform: str, price=None, notes=None, is_shopify=False):
        key = (url or name).lower()
        if not name or key in seen:
            return
        seen.add(key)
        profiles.append(CompetitorProfile(
            store_name=name[:200],
            store_url=url or "",
            platform=platform,
            price=str(price) if price else _parse_price_from_text(notes or ""),
            is_shopify=is_shopify or platform == "Shopify",
            notes=(notes or "")[:300] or None,
        ))

    for item in amazon[:MAX_ROWS]:
        title = item.get("title") or _domain_name(item.get("url", ""))
        content = item.get("content", "")
        _add(title, item.get("url", ""), "Amazon", notes=content)

    for item in tiktok[:MAX_ROWS]:
        title = item.get("title", "")
        price = item.get("price") or item.get("avg_price")
        _add(title, item.get("url", ""), "TikTok Shop", price=price)

    for item in web_search[:MAX_ROWS]:
        url = item.get("url", "")
        title = item.get("title") or _domain_name(url)
        platform = _detect_platform(url, "Shopify")
        is_shopify = "shopify" in url.lower() or platform == "Shopify"
        _add(title, url, platform, notes=item.get("content", ""), is_shopify=is_shopify)

    for audit in audits[:MAX_ROWS]:
        url = audit.get("url", "")
        summary = audit.get("summary", "")
        platform = _detect_platform(url, "Other")
        _add(_domain_name(url), url, platform, notes=summary, is_shopify="shopify" in url.lower())

    return profiles[:MAX_ROWS * 2]


def normalize_sourcing_options(
    cj: List[Dict[str, Any]],
    alibaba: List[Dict[str, Any]],
    aliexpress: List[Dict[str, Any]],
) -> List[SourcingOption]:
    options: List[SourcingOption] = []
    seen: set[str] = set()

    def _add(
        name: str,
        platform: str,
        url: str,
        price=None,
        moq=None,
        country=None,
        shipping=None,
        rating=None,
    ):
        key = f"{name}|{url}".lower()
        if not name or key in seen:
            return
        seen.add(key)
        price_val = None
        if price is not None:
            try:
                if isinstance(price, (int, float)):
                    price_val = float(price)
                else:
                    clean = str(price).replace("$", "").split("-")[0].split("--")[0].strip()
                    price_val = float(clean) if clean else None
            except (ValueError, TypeError):
                price_val = None

        options.append(SourcingOption(
            supplier_name=name[:200],
            platform=platform,
            product_url=url or "",
            price_per_unit=price_val,
            moq=int(moq) if moq is not None else None,
            country=country,
            shipping_time=shipping,
            supplier_rating=float(rating) if rating is not None else None,
        ))

    for item in cj[:MAX_ROWS]:
        _add(
            item.get("title") or item.get("supplier_name") or "CJ Supplier",
            "CJ Dropshipping",
            item.get("url", ""),
            price=item.get("price"),
            moq=item.get("moq", 1),
            country=item.get("country") or "China",
            shipping=item.get("shipping"),
            rating=item.get("rating"),
        )

    for item in alibaba[:MAX_ROWS]:
        _add(
            item.get("title") or item.get("supplier_name") or "Alibaba Supplier",
            "Alibaba",
            item.get("url", ""),
            price=item.get("price"),
            moq=item.get("moq"),
            country=item.get("country") or "China",
            rating=item.get("rating"),
        )

    for item in aliexpress[:MAX_ROWS]:
        _add(
            item.get("title") or "AliExpress Supplier",
            "AliExpress",
            item.get("url", ""),
            price=item.get("price"),
            moq=item.get("moq", 1),
            country=item.get("country") or "China",
            shipping=item.get("shipping"),
            rating=item.get("rating"),
        )

    return options[:MAX_ROWS * 2]


def mark_recommended_product(candidates: List[ProductCandidate], product_name: str) -> List[Dict[str, Any]]:
    name_lower = product_name.lower()
    rows = [c.model_dump() for c in candidates]
    matched = False
    for row in rows:
        if name_lower in row["product_name"].lower() or row["product_name"].lower() in name_lower:
            row["is_recommended"] = True
            matched = True
    if not matched and rows:
        rows[0]["is_recommended"] = True
    return rows


def mark_recommended_sourcing(options: List[SourcingOption], best_name: str, best_url: str = "") -> List[Dict[str, Any]]:
    name_lower = best_name.lower()
    url_lower = (best_url or "").lower()
    rows = [o.model_dump() for o in options]
    matched = False
    for row in rows:
        if (
            name_lower in row["supplier_name"].lower()
            or row["supplier_name"].lower() in name_lower
            or (url_lower and url_lower in row["product_url"].lower())
        ):
            row["is_recommended"] = True
            matched = True
    if not matched and rows:
        rows[0]["is_recommended"] = True
    return rows


def merge_competitor_profiles(
    scraped: List[CompetitorProfile],
    llm_profiles: List[CompetitorProfile],
) -> List[Dict[str, Any]]:
    """Prefer scraped URLs/prices; enrich with LLM positioning/threat."""
    if not llm_profiles:
        return [p.model_dump() for p in scraped]

    merged: List[Dict[str, Any]] = []
    used_llm: set[int] = set()

    for scraped_row in scraped:
        row = scraped_row.model_dump()
        for i, llm_row in enumerate(llm_profiles):
            if i in used_llm:
                continue
            llm = llm_row.model_dump()
            if (
                llm["store_name"].lower() in row["store_name"].lower()
                or row["store_name"].lower() in llm["store_name"].lower()
                or (llm["store_url"] and llm["store_url"] == row["store_url"])
            ):
                row["positioning"] = llm.get("positioning") or row.get("positioning")
                row["threat_level"] = llm.get("threat_level") or row.get("threat_level")
                row["price_range"] = llm.get("price_range") or row.get("price_range")
                row["notes"] = llm.get("notes") or row.get("notes")
                used_llm.add(i)
                break
        merged.append(row)

    for i, llm_row in enumerate(llm_profiles):
        if i not in used_llm:
            merged.append(llm_row.model_dump())

    return merged[:MAX_ROWS * 2]
