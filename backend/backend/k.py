import cloudscraper
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import requests
from bs4 import BeautifulSoup
import urllib.parse
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import diskcache as dc
import hashlib
import json

cache = dc.Cache("./smartprix_cache")  # Folder to store cache files



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:9001"],  # Adjust this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.5",
    "Referer": "https://www.google.com/",
    "DNT": "1",
    "Upgrade-Insecure-Requests": "1",
}

scraper = cloudscraper.create_scraper()


def scrape_smartprix(query):
    url = f'https://www.smartprix.com/products/?q={urllib.parse.quote(query)}'
    response = scraper.get(url, headers=headers)

    if response.status_code != 200:
        return {"error": f"Failed to retrieve page: {response.status_code}"}

    soup = BeautifulSoup(response.text, 'html.parser')

    products = soup.select('div.sm-product.has-tag.has-features.has-actions')
    print(products)
    results = []

    for product in products[:10]:  # Limit to 10 products
        try:
            name_tag = product.select_one('a.name.clamp-2 h2')
            price_tag = product.select_one('span.price')
            img_tag = product.select_one('img.sm-img')

            name = name_tag.text.strip() if name_tag else "N/A"
            price = price_tag.text.strip() if price_tag else "N/A"
            img = img_tag['src'] if img_tag else "N/A"
            link = name_tag['href'] if name_tag else "N/A"

            results.append({
                'name': name,
                'price': price,
                'img': img,
                'link': link
            })
        except Exception as e:
            print(f"Error while scraping a product: {str(e)}")
            continue

    return results

def scrape_smartprix_product(url):
    # scraper = cloudscraper.create_scraper()
    url = f"https://www.smartprix.com/{url}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0",
        "Referer": "https://www.google.com/",
    }
    
    response = scraper.get(url, headers=headers)
    if response.status_code != 200:
        return {"error": "Failed to fetch page"}
    
    soup = BeautifulSoup(response.text, "html.parser")
    
    product_name = soup.select_one(".pg-prd-head h1")
    price = soup.select_one(".liner strong")
    
    features = [li.get_text(strip=True) for li in soup.select("ul.sm-feat li")]
    
    listings = []
    for store in soup.select("ul.sm-store-strip li"):
        name = store.select_one("a div.name span")
        url_to_store = store.select_one("a")
        img_url = store.select_one("a div.name img")
        store_price = store.select_one("a span.price")
        listings.append({
            "name": name.get_text(strip=True) if name else "N/A",
            "url": url_to_store['href'],
            "image": img_url["src"].strip() if img_url else "N/A",
            "price": store_price.get_text(strip=True) if store_price else "N/A"
        })
    
    detailed_listings = []
    for detail in soup.select("div.sm-box-item.sm-pc-item"):
        store_url = detail.select_one("a.logo")["href"]
        store_image = detail.select_one("a.logo img")
        store_price = detail.select_one("div.price")
        shipping_texts = [div.get_text(strip=True) for div in detail.select("div.shipping div")]
        detailed_listings.append({
            "store_url": store_url,
            "store_image": store_image["src"].strip() if store_image else "N/A",
            "price": store_price.get_text(strip=True) if store_price else "N/A",
            "shipping": shipping_texts
        })
    
    specifications = {}

    # Locate the specifications container
    specs_container = soup.select_one("div.sm-quick-specs")

    if specs_container:
        headings = specs_container.select("div.heading")
        groups = specs_container.select("ul.group")

        for i in range(min(len(headings), len(groups))):  # Ensuring proper pairing
            heading = headings[i].get_text(strip=True) or "Unknown"
            specs = [li.select_one("span").get_text(strip=True) for li in groups[i].select("li") if li.select_one("span")]

            specifications[heading] = specs
    carousel_images = [img["src"].strip() for img in soup.select("div.sm-swiper img.sm-img") if img.get("src")]
    
    return {
        "id": product_name.get_text(strip=True) if product_name else "N/A",
        "name": product_name.get_text(strip=True) if product_name else "N/A",
        "price": price.get_text(strip=True) if price else "N/A",
        "features": features,
        "listings": listings,
        "detailed_listings": detailed_listings,
        "specifications": specifications,
        "carousel_images": carousel_images
    }




def get_amazon_images(product_url):
    response = scraper.get(product_url, headers=headers)
    
    if response.status_code != 200:
        return []

    soup = BeautifulSoup(response.text, 'html.parser')
    image_containers = soup.find_all('div', class_='a-section aok-relative s-image-fixed-height')

    img_urls = []
    for container in image_containers:
        img_tag = container.find('img', class_='s-image')
        if img_tag and 'src' in img_tag.attrs:
            img_urls.append(img_tag['src'])

    return img_urls


def init_driver():
    # Initialize the Firefox WebDriver (make sure you have the necessary Firefox drivers installed)
    from selenium.webdriver.firefox.options import Options
    options = Options()
    options.add_argument("--headless")  # Headless mode
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    driver = webdriver.Firefox(options=options)
    return driver

def cache_key(query, isCompare):
    key_raw = f"{query.lower()}|compare={isCompare}"
    return hashlib.md5(key_raw.encode()).hexdigest()  # Unique cache key

def scrape_search_cached(query, isCompare=False):
    key = cache_key(query, isCompare)

    if key in cache:
        print("Cache hit")
        return cache[key]

    print("Cache miss - scraping now")
    data = scrape_search(query, isCompare)
    cache.set(key, data, expire=3600)  # Cache for 1 hour
    return data



def scrape_search(query, isCompare=False):
    # Smartprix scraper

    driver = init_driver()
    encoded_url = urllib.parse.quote(query)
    driver.get(f'https://www.smartprix.com/products/?q={encoded_url}')

    try:
        # Initialize WebDriverWait
        wait = WebDriverWait(driver, 10)  # 10 seconds timeout
        # Wait until the elements are present
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'div.sm-product.has-tag.has-features.has-actions')))

        # Find products
        products = driver.find_elements(By.CSS_SELECTOR, 'div.sm-product.has-tag.has-features.has-actions')
        results = []
        print(f"Number of products found: {len(products)}")  # Check if products are found
        
        limit_product = 40
        if isCompare:
            limit_product = 20
            

        for product in products[:limit_product]:  
            try:
                name = product.find_element(By.CSS_SELECTOR, 'a.name.clamp-2').text
                price = product.find_element(By.CSS_SELECTOR, 'span.price').text
                img = product.find_element(By.CSS_SELECTOR, 'img.sm-img').get_attribute('src')
                link = product.find_element(By.CSS_SELECTOR, 'a.name.clamp-2').get_attribute('href')
                results.append({
                    'id': name,
                    'name': name,
                    'price': price,
                    'img': img,
                    'link': link
                })
            except Exception as e:
                print(f"Error while scraping a product: {str(e)}")
                continue  # Skip the product in case of error

        return results
    except Exception as e:
        print(f"Failed to retrieve details from Smartprix: {str(e)}")
        return []



@app.get("/scrape/{query}")
async def get_products(query: str):
    products = scrape_smartprix(query)
    return products


@app.get("/details/{link:path}")
async def get_details(link: str):
    products = scrape_smartprix_product(link)
    search_query = link.split('/')[-1]
    url = f"https://www.amazon.in/s?k={search_query.replace(' ', '+')}"
    image_urls = get_amazon_images(url)

    products["image_urls"] = image_urls
    return JSONResponse(content=products)


@app.get("/search/{query}")
def search(query: str, isCompare: bool = False):
    return scrape_search_cached(query, isCompare)

# @app.get("/search/{query}")
# async def get_search_products(query: str):
#     products = scrape_search(query)
#     return products


@app.get("/img/{query}")
async def get_image(query: str):
    q = query.replace(" ", "+")
    url = f'https://www.amazon.in/s?k={q}'
    img_urls = get_amazon_images(url)
    return JSONResponse(content=img_urls)
