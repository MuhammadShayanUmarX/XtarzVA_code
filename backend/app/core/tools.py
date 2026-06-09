import os
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
        self.http_client = httpx.AsyncClient(timeout=30.0)
        self.cj_access_token = None

    async def search_web(self, query: str, max_results: int = 5) -> List[Dict[str, Any]]:
        """Perform a web search using Tavily."""
        if not self.tavily_client:
            logger.warning("Tavily API key not set. Skipping web search.")
            return []
        
        try:
            # Tavily's python client is synchronous, so we run it in a thread or just call it if it's fast
            # For simplicity in this agentic flow, we'll call it directly
            response = self.tavily_client.search(query=query, search_depth="advanced", max_results=max_results)
            return response.get("results", [])
        except Exception as e:
            logger.error(f"Tavily search failed: {str(e)}")
            return []

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
            run = self.apify_client.actor("pratikdani/tiktok-shop-search-scraper").call(run_input=run_input)
            results = list(self.apify_client.dataset(run["defaultDatasetId"]).iterate_items())
            return results
        except Exception as e:
            logger.error(f"Apify TikTok Shop search failed: {str(e)}")
            return []

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
            run = self.apify_client.actor("devcake/tiktok-shop-data-scraper").call(run_input=run_input)
            results = list(self.apify_client.dataset(run["defaultDatasetId"]).iterate_items())
            return results
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
            run = self.apify_client.actor("trudax/reddit-scraper").call(run_input=run_input)
            results = list(self.apify_client.dataset(run["defaultDatasetId"]).iterate_items())
            return results
        except Exception as e:
            logger.error(f"Apify deep Reddit search failed: {str(e)}")
            return []

    async def scrape_amazon_products(self, query: str, max_items: int = 5) -> List[Dict[str, Any]]:
        """Scrape Amazon for competitor products and pricing using Tavily web search (free & reliable)."""
        try:
            # Use Tavily site-specific search as a reliable free method
            search_query = f"site:amazon.com {query}"
            results = await self.search_web(search_query, max_results=max_items)
            return results
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
            
            return result if result else {}
        except Exception as e:
            logger.error(f"Firecrawl audit failed for {url}: {str(e)}")
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

    async def search_unsplash_photos(self, query: str, max_items: int = 3) -> List[str]:
        """Search for high-resolution royalty-free photos on Unsplash."""
        access_key = settings.ACCESS_TOKEN
        if not access_key:
            logger.warning("Unsplash Access Token not configured. Skipping Unsplash search.")
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
