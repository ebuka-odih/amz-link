# The Last Storyteller Picks

A lightweight static affiliate recommendation site built with HTML, CSS and vanilla JavaScript. It does not process payments, use a database, create accounts, or load third-party scripts. Product content is maintained in `js/products.js`.

## Project files

```text
index.html                 Main landing page
privacy.html               Privacy information
404.html                   Custom not-found page
css/styles.css             Responsive styles and design tokens
js/products.js             All ten editable recommendations
js/app.js                  Product rendering, filters, menu and link handling
images/hero-banner.webp    Locally hosted hero still life
images/og-image.webp       Social preview image
images/products/           Local category placeholder images
favicon.svg                Site icon
robots.txt                 Crawler rules and sitemap location
sitemap.xml                Public page sitemap
.htaccess                  Conservative Apache settings
```

## Uploading to cPanel

1. Open cPanel, then open **File Manager**.
2. Navigate to `public_html` for the main domain, or create and open `public_html/picks/` for a URL such as `example.com/picks/`.
3. Upload the project files (or a ZIP containing the files and folders), then extract the ZIP if needed.
4. Confirm `index.html` is directly inside the chosen web root. For a subfolder install, it should be at `public_html/picks/index.html`, not one directory deeper.
5. Visit the domain or subfolder URL. If using a subfolder, open `.htaccess` and change `ErrorDocument 404 /404.html` to the matching path, such as `/picks/404.html`.

The paths in HTML and JavaScript are relative, so the same files work at the domain root or inside a subfolder.

### A domain whose document root is beside `public_html`

Some cPanel domains use a separate document-root directory at the same account level as `public_html`. In cPanel's **Domains** page, check the exact document-root path assigned to the domain. The site files must be in that directory with `index.html` directly inside it. If the Git repository is already checked out there, run `git pull` from that repository directory when you want to update the site. The `.htaccess` also blocks web requests to the checkout's `.git` metadata.

## Replacing products and affiliate URLs

Open `js/products.js`. Each object contains the product name, category, description, reason for selection, image path, image alt text, badge, affiliate URL and featured status. Edit those values; the page builds both the featured area and product grid from this single data file.

Replace `AMAZON_LINK_01` through `AMAZON_LINK_10` with Amazon Associates-generated HTTPS links. For each item:

1. Find the product on Amazon and generate a link using Amazon's available Associates tools.
2. Copy the generated link.
3. Paste it into that product's `amazonUrl` field.
4. Upload the updated `js/products.js` and test the link.

Products whose Amazon link is still a placeholder show a blank image canvas until a real link is added. Once linked, the product's configured image appears.

Do not recreate tracking parameters manually. Until a placeholder is replaced, the button remains on the page and displays “Product link coming soon” when clicked; it will not navigate to a broken address.

## Replacing product images

Place an optimized image in `images/products/`, for example `images/products/reading-light.webp`, then update that product's `image` and `imageAlt` values in `js/products.js`. WebP is recommended; JPG and PNG also work. Aim for roughly 200–300 KB or less when practical.

The shipped photos are editorial placeholders and do not depict confirmed products. Replace them when the final products are selected. Do not scrape Amazon product imagery. Use product images or feeds provided through Amazon's approved tools and follow their usage rules.

## Domain and YouTube channel

Search the project for `YOURDOMAIN.com` and replace it with the canonical domain (without a trailing slash in the hostname). Update the canonical URL, Open Graph URLs, JSON-LD, `robots.txt`, and `sitemap.xml` entries.

Search for `YOUTUBE_CHANNEL_URL` in `index.html` and replace both occurrences with the actual channel URL. The links open in a new tab.

## Disclosure and product data

The affiliate disclosure appears near the beginning of the landing page and in the footer. The footer includes: “As an Amazon Associate I earn from qualifying purchases.” Product prices, ratings, shipping, stock and Prime information are intentionally not shown.

## Optional analytics

No analytics provider is installed. The HTML contains an `ANALYTICS SCRIPT GOES HERE` marker in the document head. `js/app.js` has a non-blocking `trackAffiliateClick` stub for connecting an analytics provider later. Add analytics only after choosing a provider and reviewing its privacy requirements.

## Local preview

Open `index.html` directly in a browser for a quick static preview. For realistic local paths, run a basic static server from this folder, for example `python3 -m http.server 8000`, and visit `http://localhost:8000/`.
