import asyncio
import logging
import urllib.parse
import httpx
from typing import List, Dict, Any, Optional
from apify_client import ApifyClient
from tavily import TavilyClient
from firecrawl import FirecrawlApp
from ..config import settings

logger = logging.getLogger(__name__)

class ResearchTools:
    def __init__(self):
        self.apify_client = ApifyClient(settings.APIFY_API_KEY) if settings.APIFY_API_KEY else None
        self.tavily_client = TavilyClient(api_key=settings.TAVILY_API_KEY) if settings.TAVILY_API_KEY else None
        self.firecrawl_app = FirecrawlApp(api_key=settings.FIRECRAWL_API_KEY) if settings.FIRECRAWL_API_KEY else None
        self.http_client = httpx.AsyncClient(timeout=60.0)
        self.cj_access_token = None

        integrations = {
            "groq": bool(settings.GROQ_API_KEY),
            "tavily": bool(self.tavily_client),
            "apify": bool(self.apify_client),
            "firecrawl": bool(self.firecrawl_app),
            "serpapi": bool(settings.SERP_API_KEY or settings.SERPER_API_KEY),
            "serper": bool(settings.SERPER_API_KEY or settings.SERP_API_KEY),
            "geekflare": bool(settings.GEEKFLARE_API_KEY),
            "cj_dropshipping": bool(settings.CJ_DROPSHIPPING_API),
            "unsplash": bool(settings.ACCESS_TOKEN or settings.APPLICATION_AI),
            "shopify": bool(settings.SHOPIFY_API_KEY and settings.SHOPIFY_API_SECRET),
        }
        logger.info(f"Research integrations: {integrations}")

    @staticmethod
    def _extract_markdown(scrape_result: Any) -> str:
        if not scrape_result:
            return ""
        if isinstance(scrape_result, dict):
            if scrape_result.get("markdown"):
                return str(scrape_result["markdown"])
            data = scrape_result.get("data")
            if isinstance(data, dict) and data.get("markdown"):
                return str(data["markdown"])
            if scrape_result.get("content"):
                return str(scrape_result["content"])[:2000]
        return str(scrape_result)[:2000]

    def _unsplash_access_key(self) -> str:
        return settings.ACCESS_TOKEN or settings.APPLICATION_AI or ""

    async def _run_apify_actor(self, actor_id: str, run_input: dict) -> List[Dict[str, Any]]:
        """Run blocking Apify SDK calls in a thread pool."""
        if not self.apify_client:
            return []

        def _execute() -> List[Dict[str, Any]]:
            run = self.apify_client.actor(actor_id).call(run_input=run_input)
            return list(self.apify_client.dataset(run["defaultDatasetId"]).iterate_items())

        return await asyncio.to_thread(_execute)

    async def _search_serper(self, query: str, max_results: int, api_key: str) -> List[Dict[str, Any]]:
        """Google search via Serper.dev (serper.dev — different from serpapi.com)."""
        try:
            response = await self.http_client.post(
                "https://google.serper.dev/search",
                headers={"X-API-KEY": api_key, "Content-Type": "application/json"},
                json={"q": query, "num": max_results},
            )
            if response.status_code != 200:
                logger.error(f"Serper search failed ({response.status_code}): {response.text[:200]}")
                return []

            organic = response.json().get("organic", [])
            return [
                {
                    "title": item.get("title", ""),
                    "url": item.get("link", ""),
                    "content": item.get("snippet", ""),
                }
                for item in organic[:max_results]
            ]
        except Exception as e:
            logger.error(f"Serper search failed: {e}")
            return []

    async def search_serp(
        self,
        query: str,
        max_results: int = 5,
        engine: str = "google",
    ) -> List[Dict[str, Any]]:
        """Google search via Serper.dev or SerpAPI (serpapi.com)."""
        if settings.SERPER_API_KEY:
            return await self._search_serper(query, max_results, settings.SERPER_API_KEY)

        if not settings.SERP_API_KEY:
            logger.warning("No SerpAPI/Serper key set. Skipping Google search fallback.")
            return []

        try:
            params = {
                "engine": engine,
                "q": query,
                "api_key": settings.SERP_API_KEY,
                "num": max_results,
            }
            response = await self.http_client.get(
                "https://serpapi.com/search.json",
                params=params,
            )
            if response.status_code == 401:
                logger.warning(
                    "SERP_API_KEY rejected by serpapi.com — trying Serper.dev instead "
                    "(your key may be from serper.dev, not serpapi.com)."
                )
                return await self._search_serper(query, max_results, settings.SERP_API_KEY)

            if response.status_code != 200:
                logger.error(f"SerpAPI search failed ({response.status_code}): {response.text[:200]}")
                return []

            data = response.json()
            organic = data.get("organic_results", [])
            return [
                {
                    "title": item.get("title", ""),
                    "url": item.get("link", ""),
                    "content": item.get("snippet", ""),
                }
                for item in organic[:max_results]
            ]
        except Exception as e:
            logger.error(f"SerpAPI search failed: {e}")
            return []

    async def run_geekflare_lighthouse(self, url: str) -> Dict[str, Any]:
        """SEO / performance audit via Geekflare Lighthouse API."""
        if not settings.GEEKFLARE_API_KEY:
            logger.warning("Geekflare API key not set. Skipping Lighthouse audit.")
            return {}

        try:
            response = await self.http_client.post(
                "https://api.geekflare.com/lighthouse",
                headers={
                    "x-api-key": settings.GEEKFLARE_API_KEY,
                    "Content-Type": "application/json",
                },
                json={
                    "url": url,
                    "device": "desktop",
                    "parameters": ["--only-categories=seo,performance"],
                },
                timeout=90.0,
            )
            if response.status_code == 200:
                return response.json()
            logger.error(f"Geekflare Lighthouse failed ({response.status_code}): {response.text[:200]}")
        except Exception as e:
            logger.error(f"Geekflare Lighthouse error for {url}: {e}")
        return {}

    async def search_web(self, query: str, max_results: int = 5) -> List[Dict[str, Any]]:
        """Perform a web search using Tavily, falling back to SerpAPI."""
        if self.tavily_client:
            try:
                response = await asyncio.to_thread(
                    self.tavily_client.search,
                    query=query,
                    search_depth="advanced",
                    max_results=max_results,
                )
                results = response.get("results", [])
                if results:
                    return results
            except Exception as e:
                logger.error(f"Tavily search failed: {str(e)}")
        else:
            logger.warning("Tavily API key not set. Skipping Tavily web search.")

        return await self.search_serp(query, max_results=max_results)

    async def search_tiktok_shop(self, query: str, max_items: int = 10) -> List[Dict[str, Any]]:
        """Search for products directly on TikTok Shop."""
        if not self.apify_client:
            logger.warning("Apify API key not set. Skipping TikTok Shop search.")
            return []

        try:
            run_input = {
                "keyword": query,
                "limit": max_items,
                "region": "US",
                "country_code": "US",  # Added required field
                "sortType": "BEST_SELLERS"
            }
            raw = await self._run_apify_actor("pratikdani/tiktok-shop-search-scraper", run_input)
            return self._normalize_tiktok_items(raw, max_items)
        except Exception as e:
            logger.error(f"Apify TikTok Shop search failed: {str(e)}")
            return []

    @staticmethod
    def _normalize_tiktok_items(raw: List[Dict[str, Any]], max_items: int) -> List[Dict[str, Any]]:
        """Flatten Apify TikTok Shop actor payloads into uniform product dicts."""
        products: List[Dict[str, Any]] = []
        for item in raw:
            if not isinstance(item, dict):
                continue
            nested = item.get("data")
            rows = nested if isinstance(nested, list) else [item]
            for row in rows:
                if not isinstance(row, dict):
                    continue
                title = row.get("title") or row.get("highlight") or row.get("product_name") or ""
                if not title:
                    continue
                products.append({
                    "title": title[:200],
                    "avg_price": row.get("avg_price") or row.get("min_price") or "",
                    "total_sales": row.get("total_sales") or row.get("lives_sales") or "",
                    "reviews_count": row.get("reviews_count") or row.get("influencers_count") or "",
                    "category": row.get("category") or row.get("categories") or "",
                    "url": row.get("product_url") or row.get("url") or "",
                })
                if len(products) >= max_items:
                    return products
        return products

    async def get_tiktok_shop_details(self, query: str) -> List[Dict[str, Any]]:
        """Get deep product data and reviews from TikTok Shop."""
        if not self.apify_client:
            logger.warning("Apify API key not set. Skipping TikTok Shop details.")
            return []

        try:
            run_input = {
                "searchKeywords": [query],
                "includeReviews": True
            }
            return await self._run_apify_actor("devcake/tiktok-shop-data-scraper", run_input)
        except Exception as e:
            logger.error(f"Apify TikTok Shop details failed: {str(e)}")
            return []

    async def deep_reddit_search(self, query: str, max_items: int = 10) -> List[Dict[str, Any]]:
        """Perform deep research on Reddit for pain points and discussions."""
        if not self.apify_client:
            logger.warning("Apify API key not set. Skipping deep Reddit search.")
            return []

        try:
            # Fallback to Tavily site-specific search if Apify actor fails/expires
            search_query = f"site:reddit.com {query}"
            results = await self.search_web(search_query, max_results=max_items)
            if results:
                return results
                
            # Original Apify logic as fallback
            run_input = {
                "searches": [query],
                "searchPosts": True,
                "searchComments": True,
                "sort": "top",
                "time": "month",
                "maxItems": max_items,
                "includeNSFW": False,
                "proxy": { "useApifyProxy": True }
            }
            return await self._run_apify_actor("trudax/reddit-scraper", run_input)
        except Exception as e:
            logger.error(f"Apify deep Reddit search failed: {str(e)}")
            return []

    async def scrape_amazon_products(self, query: str, max_items: int = 5) -> List[Dict[str, Any]]:
        """Find Amazon listings via SerpAPI, falling back to Tavily site search."""
        try:
            serp_results = await self.search_serp(
                f"site:amazon.com {query}",
                max_results=max_items,
            )
            if serp_results:
                return serp_results

            search_query = f"site:amazon.com {query}"
            return await self.search_web(search_query, max_results=max_items)
        except Exception as e:
            logger.error(f"Amazon product search failed: {str(e)}")
            return []

    async def audit_website(self, url: str) -> Dict[str, Any]:
        """Crawl and audit a competitor website using Firecrawl."""
        if not self.firecrawl_app:
            logger.warning("Firecrawl API key not set. Skipping website audit.")
            return {}

        try:
            # Try multiple calling conventions for different Firecrawl SDK versions
            result = None
            if hasattr(self.firecrawl_app, "scrape_url"):
                try:
                    # v1+ SDK: scrape_url(url, formats=['markdown'])
                    result = self.firecrawl_app.scrape_url(url, formats=['markdown'])
                except TypeError:
                    try:
                        # Older SDK: scrape_url(url, params={...})
                        result = self.firecrawl_app.scrape_url(url, params={'formats': ['markdown']})
                    except TypeError:
                        # Fallback: just pass the URL
                        result = self.firecrawl_app.scrape_url(url)
            elif hasattr(self.firecrawl_app, "scrape"):
                try:
                    result = self.firecrawl_app.scrape(url, formats=['markdown'])
                except TypeError:
                    result = self.firecrawl_app.scrape(url)
            
            markdown = self._extract_markdown(result)
            if markdown:
                return {"markdown": markdown, "url": url, "source": "firecrawl"}

            geekflare = await self.run_geekflare_lighthouse(url)
            if geekflare:
                return {"markdown": str(geekflare)[:2000], "url": url, "source": "geekflare", "lighthouse": geekflare}

            return result if result else {}
        except Exception as e:
            logger.error(f"Firecrawl audit failed for {url}: {str(e)}")
            geekflare = await self.run_geekflare_lighthouse(url)
            if geekflare:
                return {"markdown": str(geekflare)[:2000], "url": url, "source": "geekflare", "lighthouse": geekflare}
            return {}

    async def search_alibaba(self, query: str, max_items: int = 3) -> List[Dict[str, Any]]:
        """Search for wholesale suppliers on Alibaba for FREE (Tavily + Firecrawl)."""
        try:
            # 1. Use Tavily to find direct product URLs on Alibaba
            search_query = f"site:alibaba.com {query} wholesale"
            results = await self.search_web(search_query, max_results=max_items)
            
            sourcing_data = []
            for res in results:
                url = res.get("url")
                if "alibaba.com/product-detail" in url:
                    # 2. Use Firecrawl to scrape the details for free
                    details = await self.audit_website(url)
                    sourcing_data.append({"url": url, "details": details})
            
            return sourcing_data
        except Exception as e:
            logger.error(f"Free Alibaba sourcing failed: {str(e)}")
            return []

    async def search_aliexpress(self, query: str, max_items: int = 3) -> List[Dict[str, Any]]:
        """Search for dropshipping suppliers on AliExpress for FREE (Tavily + Firecrawl)."""
        try:
            # 1. Use Tavily to find direct product URLs on AliExpress
            search_query = f"site:aliexpress.com {query} dropshipping"
            results = await self.search_web(search_query, max_results=max_items)
            
            sourcing_data = []
            for res in results:
                url = res.get("url")
                if "aliexpress.com/item" in url:
                    # 2. Use Firecrawl to scrape the details for free
                    details = await self.audit_website(url)
                    sourcing_data.append({"url": url, "details": details})
            
            return sourcing_data
        except Exception as e:
            logger.error(f"Free AliExpress sourcing failed: {str(e)}")
            return []

    def generate_image_url(self, prompt: str, width: int = 1024, height: int = 1024) -> str:
        """Generate a Pollinations AI image URL."""
        encoded_prompt = urllib.parse.quote(prompt)
        return f"https://image.pollinations.ai/prompt/{encoded_prompt}?width={width}&height={height}&nologo=true"

    async def search_meta_ads(self, query: str, max_results: int = 5) -> List[Dict[str, Any]]:
        """Research active Meta / Facebook ads for a niche via SerpAPI + Tavily."""
        results: List[Dict[str, Any]] = []

        serp_ads = await self.search_serp(
            f"facebook ad library {query}",
            max_results=max_results,
        )
        results.extend(serp_ads)

        if self.tavily_client:
            try:
                tavily = await asyncio.to_thread(
                    self.tavily_client.search,
                    query=f"Meta Facebook ad creatives competitors {query}",
                    search_depth="advanced",
                    max_results=max_results,
                )
                for item in tavily.get("results", []):
                    results.append({
                        "title": item.get("title", ""),
                        "url": item.get("url", ""),
                        "content": item.get("content", ""),
                    })
            except Exception as e:
                logger.error(f"Tavily Meta ads search failed: {e}")

        return results[:max_results]

    async def search_unsplash_photos(self, query: str, max_items: int = 3) -> List[str]:
        """Search for high-resolution royalty-free photos on Unsplash."""
        access_key = self._unsplash_access_key()
        if not access_key:
            logger.warning("Unsplash access key not configured (ACCESS_TOKEN or APPLICATION_AI). Skipping.")
            return []
            
        try:
            url = "https://api.unsplash.com/search/photos"
            headers = {
                "Authorization": f"Client-ID {access_key}"
            }
            params = {
                "query": query,
                "per_page": max_items,
                "orientation": "squarish"
            }
            response = await self.http_client.get(url, headers=headers, params=params)
            if response.status_code == 200:
                data = response.json()
                results = data.get("results", [])
                urls = [
                    item.get("urls", {}).get("regular")
                    for item in results
                    if item.get("urls", {}).get("regular")
                ]
                return urls
            else:
                logger.error(f"Unsplash search failed with status {response.status_code}: {response.text}")
        except Exception as e:
            logger.error(f"Error during Unsplash photo search: {str(e)}")
        return []

    async def scrape_url_grounding(self, url: str) -> Dict[str, Any]:
        """Grounding analysis using Firecrawl."""
        return await self.audit_website(url)

    async def _get_cj_token(self) -> Optional[str]:
        if self.cj_access_token:
            return self.cj_access_token
        
        raw_key = settings.CJ_DROPSHIPPING_API
        if not raw_key:
            return None
            
        # Strip off 'cjdropshipping:' prefix if saved by the user
        api_key = raw_key
        if api_key.startswith("cjdropshipping:"):
            api_key = api_key[len("cjdropshipping:"):]
            
        try:
            url = "https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken"
            response = await self.http_client.post(url, json={"apiKey": api_key})
            if response.status_code == 200:
                res_data = response.json()
                if res_data.get("result") and "data" in res_data:
                    self.cj_access_token = res_data["data"].get("accessToken")
                    return self.cj_access_token
            logger.error(f"Failed to get CJ Dropshipping token: {response.text}")
        except Exception as e:
            logger.error(f"Error authenticating with CJ Dropshipping: {str(e)}")
        return None

    async def search_cjdropshipping(self, query: str, max_items: int = 5) -> List[Dict[str, Any]]:
        """Search for dropshipping products on CJ Dropshipping via their official API."""
        token = await self._get_cj_token()
        if not token:
            logger.warning("CJ Dropshipping API Key not configured or authentication failed. Skipping CJ search.")
            return []
            
        try:
            url = "https://developers.cjdropshipping.com/api2.0/v1/product/listV2"
            headers = {
                "CJ-Access-Token": token,
                "Content-Type": "application/json"
            }
            params = {
                "keyWord": query,
                "page": 1,
                "size": max_items
            }
            response = await self.http_client.get(url, headers=headers, params=params)
            if response.status_code == 200:
                res_data = response.json()
                if res_data.get("result") and "data" in res_data:
                    data_obj = res_data["data"]
                    content = data_obj.get("content", [])
                    cj_products = []
                    if content and isinstance(content, list) and len(content) > 0:
                        cj_products = content[0].get("productList", [])
                        
                    formatted = []
                    for p in cj_products:
                        price_val = 0.0
                        raw_price = p.get("sellPrice", "")
                        if raw_price:
                            if isinstance(raw_price, (int, float)):
                                price_val = float(raw_price)
                            elif isinstance(raw_price, str):
                                # Handle range formats like "3.85 -- 5.90" or "4.58-5.16"
                                clean_price = raw_price.split("--")[0].split("-")[0].strip()
                                try:
                                    price_val = float(clean_price)
                                except ValueError:
                                    pass
                        
                        pid = p.get("id", p.get("pid", ""))
                        formatted.append({
                            "supplier_name": "CJ Dropshipping Warehouse",
                            "platform": "CJ Dropshipping",
                            "title": p.get("nameEn", p.get("productNameEn", p.get("productName", ""))),
                            "price": price_val,
                            "moq": 1,
                            "rating": 4.8,
                            "orders": 100,
                            "shipping": "CJ Packet (7-12 days)",
                            "url": f"https://cjdropshipping.com/product-detail.html?id={pid}" if pid else "https://cjdropshipping.com",
                            "image": p.get("bigImage", p.get("productImage", ""))
                        })
                    return formatted
            logger.error(f"CJ Dropshipping product list failed: {response.text}")
        except Exception as e:
            logger.error(f"Error fetching products from CJ Dropshipping: {str(e)}")
        return []

research_tools = ResearchTools()
