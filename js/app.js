(function () {
  "use strict";

  const categories = {
    "reading-history": "Reading & History",
    "home-comfort": "Home & Comfort",
    "garden-outdoors": "Garden & Outdoors",
    "everyday-finds": "Everyday Useful Finds"
  };
  const featuredRoot = document.getElementById("featured-products");
  const allRoot = document.getElementById("all-products");
  const count = document.getElementById("results-count");

  function make(tag, className, value) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (value !== undefined) el.textContent = value;
    return el;
  }

  function hasRealAmazonUrl(value) {
    if (typeof value !== "string" || /^AMAZON_LINK_\d+$/.test(value.trim())) return false;
    try {
      const parsed = new URL(value);
      return parsed.protocol === "https:" && (/^(?:[a-z0-9-]+\.)*amazon\.(?:com(?:\.[a-z]{2})?|co\.[a-z]{2}|[a-z]{2,3})$/.test(parsed.hostname) || parsed.hostname === "amzn.to");
    } catch (_) {
      return false;
    }
  }

  // Analytics hook: connect an analytics provider here later. Returning immediately keeps outbound navigation unblocked.
  function trackAffiliateClick(eventData) {
    void eventData;
  }

  function productCard(product, prominent) {
    const article = make("article", prominent ? "product-card product-card-featured" : "product-card");
    article.dataset.productId = String(product.id);
    const figure = make("div", "product-figure");
    const img = document.createElement("img");
    img.src = product.image || "images/placeholder-product.webp";
    img.alt = product.imageAlt || product.name;
    img.width = 720;
    img.height = 720;
    img.loading = prominent ? "eager" : "lazy";
    img.decoding = "async";
    img.addEventListener("error", function () {
      if (img.src.endsWith("placeholder-product.webp")) return;
      img.src = "images/placeholder-product.webp";
      img.alt = "Editorial placeholder image for a recommended item";
    }, { once: true });
    figure.append(img);
    const badge = make("span", "product-badge", product.badge || "Our Pick");
    figure.append(badge);

    const body = make("div", "product-body");
    body.append(make("p", "product-category", categories[product.category] || "Everyday Finds"));
    body.append(make("h3", "product-title", product.name || "Recommended Find"));
    body.append(make("p", "product-description", product.description || "A considered find for everyday life."));
    const reason = make("div", "why-picked");
    reason.append(make("p", "why-label", "Why we picked it"));
    reason.append(make("p", "why-copy", product.whyWePickedIt || "Selected with The Last Storyteller community in mind."));
    body.append(reason);

    const action = make("a", "button button-dark product-action");
    action.append(document.createTextNode("View on Amazon "));
    const arrow = make("span", "button-arrow", "→");
    arrow.setAttribute("aria-hidden", "true");
    action.append(arrow);
    const available = hasRealAmazonUrl(product.amazonUrl);
    if (available) {
      action.href = product.amazonUrl;
      action.target = "_blank";
      action.rel = "nofollow sponsored noopener";
      action.addEventListener("click", function () {
        trackAffiliateClick({ productId: product.id, productName: product.name, destination: product.amazonUrl });
      });
    } else {
      action.href = "#";
      action.setAttribute("aria-disabled", "true");
      action.classList.add("is-placeholder");
      action.setAttribute("aria-describedby", "link-status-" + product.id);
      action.addEventListener("click", function (event) {
        event.preventDefault();
        const status = article.querySelector(".link-status");
        status.hidden = false;
      });
    }
    body.append(action);
    const status = make("p", "link-status", "Product link coming soon.");
    status.id = "link-status-" + product.id;
    status.setAttribute("role", "status");
    status.hidden = true;
    body.append(status);
    body.append(make("p", "price-note", "Price and availability may change on Amazon."));
    article.append(figure, body);
    return article;
  }

  function renderFeatured() {
    const picks = products.filter(function (product) { return product.featured; });
    featuredRoot.replaceChildren();
    picks.forEach(function (product) { featuredRoot.append(productCard(product, true)); });
  }

  function renderAll(filter) {
    const visible = filter === "all" ? products : products.filter(function (product) { return product.category === filter; });
    allRoot.replaceChildren();
    visible.forEach(function (product) { allRoot.append(productCard(product, false)); });
    count.textContent = filter === "all" ? "Showing all " + visible.length + " picks" : "Showing " + visible.length + " " + (categories[filter] || "") + " picks";
    document.querySelectorAll(".filter-button").forEach(function (button) {
      const active = button.dataset.filter === filter;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  document.querySelectorAll(".filter-button").forEach(function (button) {
    button.addEventListener("click", function () { renderAll(button.dataset.filter); });
  });
  document.querySelectorAll("[data-nav-filter]").forEach(function (link) {
    link.addEventListener("click", function () {
      renderAll(link.dataset.navFilter);
      closeMenu();
    });
  });

  const menuButton = document.querySelector(".menu-toggle");
  const siteNav = document.getElementById("site-nav");
  function closeMenu() {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    siteNav.classList.remove("is-open");
  }
  menuButton.addEventListener("click", function () {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    siteNav.classList.toggle("is-open", open);
  });
  document.addEventListener("keydown", function (event) { if (event.key === "Escape") closeMenu(); });
  document.getElementById("current-year").textContent = String(new Date().getFullYear());

  const schema = document.createElement("script");
  schema.type = "application/ld+json";
  schema.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "The Last Storyteller Picks",
    "itemListElement": products.map(function (product, index) {
      return { "@type": "ListItem", "position": index + 1, "name": product.name };
    })
  });
  document.head.append(schema);

  renderFeatured();
  renderAll("all");
}());
