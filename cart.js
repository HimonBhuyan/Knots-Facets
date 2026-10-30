/* ==========================================================================
   KNOTS & FACETS — INTERACTIVE CART, CURRENCY, QUICK-VIEW & CATALOG ENGINE
   ========================================================================== */

(function () {
  'use strict';

  // Master Catalog of Artisanal Products
  const CATALOG = [
    {
      id: 'kf-earrings-01',
      title: 'Celestial Prismatic Drop Earrings',
      category: 'jewellery',
      categoryLabel: 'Glass & Crystal Jewellery',
      priceUSD: 48,
      image: 'images/earrings_crystal.jpg',
      badge: 'Bestseller',
      material: '14k Gold-Filled & Faceted Glass',
      description: 'Hand-faceted clear crystal drops suspended from delicate 14k gold-filled spiral wire. Catches soft sunlight to cast subtle rainbow refractions on your skin.',
      inStock: true,
      tags: ['earrings', 'crystal', 'gold', 'light']
    },
    {
      id: 'kf-bag-01',
      title: 'The Atelier Cotton Crochet Tote',
      category: 'crochet',
      categoryLabel: 'Crochet Accessories',
      priceUSD: 85,
      image: 'images/crochet_bag.jpg',
      badge: 'Artisan Special',
      material: 'Organic Combed Cotton & Bridle Leather',
      description: 'Slow-stitched textured bobble pattern crafted from 100% unbleached natural cotton. Sturdy vegetable-tanned leather straps fastened with solid brass studs.',
      inStock: true,
      tags: ['bag', 'tote', 'cotton', 'slow-fashion']
    },
    {
      id: 'kf-necklace-01',
      title: 'Solstice Faceted Crystal Pendant',
      category: 'jewellery',
      categoryLabel: 'Glass & Crystal Jewellery',
      priceUSD: 54,
      image: 'images/necklace_pendant.jpg',
      badge: 'Limited Run',
      material: 'Faceted Glass Crystal & 18k Vermeil Chain',
      description: 'A geometric kite-cut glass crystal pendant that refracts natural light into luminous rainbow halos. Paired with a delicate 18-inch diamond-cut chain.',
      inStock: true,
      tags: ['necklace', 'pendant', 'crystal', 'rainbow']
    },
    {
      id: 'kf-crochet-set-01',
      title: 'Heritage Crochet Scrunchie & Bookmark Set',
      category: 'crochet',
      categoryLabel: 'Crochet Accessories',
      priceUSD: 36,
      image: 'images/crochet_accessories.jpg',
      badge: 'Gift Favorite',
      material: 'Fine Mercerised Cotton Yarn',
      description: 'Includes two ruffled botanical hair scrunchies and an intricate filigree lace bookmark finished with dual tassels and wooden bead detail.',
      inStock: true,
      tags: ['scrunchie', 'bookmark', 'accessories', 'gifting']
    },
    {
      id: 'kf-hero-set',
      title: 'Dawn Sunlight Glass Bead Collar',
      category: 'jewellery',
      categoryLabel: 'Glass & Crystal Jewellery',
      priceUSD: 72,
      image: 'images/card-jewellery.jpg',
      badge: 'One-of-a-Kind',
      material: 'Blown Glass Beads & Freshwater Pearls',
      description: 'Translucent amber, smoky rose and opalescent glass beads woven with freshwater seed pearls on supple non-tarnish cord.',
      inStock: true,
      tags: ['necklace', 'collar', 'amber', 'pearls']
    },
    {
      id: 'kf-crochet-hair-02',
      title: 'Botanical Linen Lace Hair Ribbon',
      category: 'crochet',
      categoryLabel: 'Crochet Accessories',
      priceUSD: 28,
      image: 'images/card-crochet.jpg',
      badge: 'Handmade',
      material: 'Natural Flax Linen & Silk Thread',
      description: 'Delicately knotted hair wrap featuring miniature scalloped leaf edging. Designed for effortless braiding and everyday hair styling.',
      inStock: true,
      tags: ['hair', 'ribbon', 'lace', 'linen']
    },
    {
      id: 'kf-gift-box',
      title: 'The Atelier Curated Keepsake Box',
      category: 'gifting',
      categoryLabel: 'Bespoke Sets',
      priceUSD: 95,
      image: 'images/packaging_gifting.jpg',
      badge: 'Signature Gift',
      material: 'Jewellery, Crochet & Wax-Sealed Note',
      description: 'A bespoke unboxing experience: raw amethyst pendant, handmade leaf bookmark, botanical lavender sprig, and personalized wax-sealed greeting card.',
      inStock: true,
      tags: ['gift', 'box', 'keepsake', 'custom']
    },
    {
      id: 'kf-collection-jewel',
      title: 'Prismatic Rain Glass Drop Suite',
      category: 'jewellery',
      categoryLabel: 'Glass & Crystal Jewellery',
      priceUSD: 68,
      image: 'images/collection-jewellery.jpg',
      badge: 'Curated Suite',
      material: 'Hand-blown Venetian Glass & 925 Silver',
      description: 'A curated trio of earrings, ring, and layered glass droplet chains designed to catch moving light and reflections from every angle.',
      inStock: true,
      tags: ['suite', 'set', 'silver', 'glass']
    },
    {
      id: 'kf-collection-crochet',
      title: 'The Rituals Handwoven Coaster & Mat Set',
      category: 'crochet',
      categoryLabel: 'Crochet Accessories',
      priceUSD: 42,
      image: 'images/collection-crochet.jpg',
      badge: 'Home & Dining',
      material: 'Chunky Twisted Hemp & Organic Cotton',
      description: 'Set of 4 heat-resistant tableware coasters with matching centre table mat. Earthy spiral ribbed stitches that insulate and soften tabletop sound.',
      inStock: true,
      tags: ['tableware', 'coasters', 'home', 'cotton']
    }
  ];

  // Currency Exchange Rates & Symbols
  const CURRENCIES = {
    USD: { symbol: '$', rate: 1.0, decimals: 0 },
    EUR: { symbol: '€', rate: 0.92, decimals: 0 },
    GBP: { symbol: '£', rate: 0.79, decimals: 0 },
    INR: { symbol: '₹', rate: 86.5, decimals: 0 }
  };

  // State Management
  let cart = [];
  try {
    const saved = localStorage.getItem('kf_cart');
    if (saved) cart = JSON.parse(saved);
  } catch (e) {
    cart = [];
  }

  let activeCurrency = 'USD';
  try {
    const savedCur = localStorage.getItem('kf_currency');
    if (savedCur && CURRENCIES[savedCur]) activeCurrency = savedCur;
  } catch (e) {
    activeCurrency = 'USD';
  }

  function saveCart() {
    try {
      localStorage.setItem('kf_cart', JSON.stringify(cart));
    } catch (e) {}
    updateCartUI();
  }

  function formatPrice(usdPrice) {
    const conf = CURRENCIES[activeCurrency] || CURRENCIES.USD;
    const converted = Math.round(usdPrice * conf.rate);
    return `${conf.symbol}${converted.toLocaleString()}`;
  }

  // Toast Notification
  function showToast(message, icon = '✨') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span style="font-size:1.1rem">${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-out');
      setTimeout(() => toast.remove(), 350);
    }, 3200);
  }

  // Cart operations
  function addToCart(productId, qty = 1) {
    const product = CATALOG.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        priceUSD: product.priceUSD,
        image: product.image,
        categoryLabel: product.categoryLabel,
        qty: qty
      });
    }

    saveCart();
    const badge = document.getElementById('navCartCount');
    if (badge) {
      badge.classList.remove('bump');
      void badge.offsetWidth;
      badge.classList.add('bump');
    }
    showToast(`"${product.title}" added to your bag`, '🛍️');
    openCart();
  }

  function updateQty(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== productId);
    }
    saveCart();
  }

  function removeFromCart(productId) {
    const item = cart.find(i => i.id === productId);
    cart = cart.filter(i => i.id !== productId);
    saveCart();
    if (item) showToast(`Removed "${item.title}" from bag`, '🌿');
  }

  function clearCart() {
    cart = [];
    saveCart();
  }

  // DOM Elements for Cart Drawer
  function injectCartDrawerHTML() {
    if (document.getElementById('cartDrawer')) return;

    const drawerHTML = `
      <div class="cart-drawer-overlay" id="cartOverlay"></div>
      <aside class="cart-drawer" id="cartDrawer" aria-label="Shopping Bag">
        <div class="cart-header">
          <h2>Your Bag (<span id="cartCountHeader">0</span>)</h2>
          <button class="cart-close-btn" id="cartCloseBtn" aria-label="Close Bag">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="cart-free-shipping">
          <div id="freeShippingText">Add <strong>$50</strong> more for Complimentary Gifting Box!</div>
          <div class="cart-free-shipping-bar"><div class="cart-free-shipping-progress" id="shippingProgress" style="width: 0%"></div></div>
        </div>
        <div class="cart-items" id="cartItemsContainer">
          <!-- Injected via JS -->
        </div>
        <div class="cart-footer">
          <div class="cart-subtotal-row">
            <span>Subtotal</span>
            <strong id="cartSubtotal">$0</strong>
          </div>
          <p class="cart-note-text">🌿 Every item is packed with recycled tissue & sealed with handwritten wax stamp.</p>
          <button class="cart-checkout-btn" id="checkoutBtn">Proceed to Checkout</button>
        </div>
      </aside>

      <!-- Quick View Modal Container -->
      <div class="modal-overlay" id="quickViewOverlay">
        <div class="modal-content" id="quickViewContent">
          <!-- Injected dynamically -->
        </div>
      </div>

      <!-- Checkout Simulation Modal -->
      <div class="modal-overlay" id="checkoutOverlay">
        <div class="modal-content" style="max-width: 540px; padding: 36px 32px;">
          <button class="modal-close-btn" id="checkoutCloseBtn" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
          <div style="text-align:center; margin-bottom: 24px;">
            <span style="font-size: 2.2rem;">✨</span>
            <h3 style="font-family: var(--serif); font-size: 2rem; margin: 10px 0 6px;">Atelier Checkout</h3>
            <p style="color: var(--ink-soft); font-size: 0.9rem; margin:0;">Complete your handcrafted order with personalized studio care.</p>
          </div>
          <form id="checkoutForm" onsubmit="event.preventDefault(); window.KF.completeOrder();">
            <div style="display:flex; flex-direction:column; gap: 14px; margin-bottom: 20px;">
              <div>
                <label style="display:block; font-size:0.78rem; text-transform:uppercase; letter-spacing:0.06em; color:var(--accent); font-weight:600; margin-bottom:4px;">Recipient Name</label>
                <input type="text" required placeholder="Elena Rostova" style="width:100%; padding:10px 14px; border-radius:10px; border:1px solid var(--line); background:var(--bg); font-size:0.9rem;">
              </div>
              <div>
                <label style="display:block; font-size:0.78rem; text-transform:uppercase; letter-spacing:0.06em; color:var(--accent); font-weight:600; margin-bottom:4px;">Email Address</label>
                <input type="email" required placeholder="elena@example.com" style="width:100%; padding:10px 14px; border-radius:10px; border:1px solid var(--line); background:var(--bg); font-size:0.9rem;">
              </div>
              <div>
                <label style="display:block; font-size:0.78rem; text-transform:uppercase; letter-spacing:0.06em; color:var(--accent); font-weight:600; margin-bottom:4px;">Shipping Address & City</label>
                <input type="text" required placeholder="14 Highfield Lane, London" style="width:100%; padding:10px 14px; border-radius:10px; border:1px solid var(--line); background:var(--bg); font-size:0.9rem;">
              </div>
              <div>
                <label style="display:block; font-size:0.78rem; text-transform:uppercase; letter-spacing:0.06em; color:var(--accent); font-weight:600; margin-bottom:4px;">Gift Message or Custom Note (Optional)</label>
                <textarea rows="2" placeholder="Please include a handwritten gift note saying..." style="width:100%; padding:10px 14px; border-radius:10px; border:1px solid var(--line); background:var(--bg); font-size:0.9rem; font-family:var(--sans);"></textarea>
              </div>
            </div>
            <div style="background:var(--surface-alt); padding:16px; border-radius:14px; margin-bottom:20px; font-size:0.9rem;">
              <div style="display:flex; justify-content:space-between; margin-bottom:6px;"><span>Total Due:</span><strong id="checkoutTotalAmount" style="font-family:var(--serif); font-size:1.2rem;">$0</strong></div>
              <div style="color:var(--ink-soft); font-size:0.8rem;">📦 Includes Complimentary Tracked Packaging & Wax-Sealed Authenticity Note</div>
            </div>
            <button type="submit" class="btn-dark" style="width:100%; padding:14px; border-radius:var(--radius-pill); font-size:0.9rem;">Confirm & Reserve Pieces</button>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', drawerHTML);

    // Event listeners
    document.getElementById('cartCloseBtn').addEventListener('click', closeCart);
    document.getElementById('cartOverlay').addEventListener('click', closeCart);
    document.getElementById('quickViewOverlay').addEventListener('click', (e) => {
      if (e.target.id === 'quickViewOverlay') closeQuickView();
    });
    document.getElementById('checkoutOverlay').addEventListener('click', (e) => {
      if (e.target.id === 'checkoutOverlay') closeCheckout();
    });
    document.getElementById('checkoutCloseBtn').addEventListener('click', closeCheckout);
    document.getElementById('checkoutBtn').addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('Your bag is currently empty. Explore our pieces first!', '🛍️');
        return;
      }
      closeCart();
      openCheckout();
    });
  }

  function openCart() {
    const overlay = document.getElementById('cartOverlay');
    const drawer = document.getElementById('cartDrawer');
    if (overlay && drawer) {
      overlay.classList.add('active');
      drawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCart() {
    const overlay = document.getElementById('cartOverlay');
    const drawer = document.getElementById('cartDrawer');
    if (overlay && drawer) {
      overlay.classList.remove('active');
      drawer.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function openCheckout() {
    const overlay = document.getElementById('checkoutOverlay');
    if (overlay) {
      const subtotalUSD = cart.reduce((sum, item) => sum + (item.priceUSD * item.qty), 0);
      document.getElementById('checkoutTotalAmount').textContent = formatPrice(subtotalUSD);
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCheckout() {
    const overlay = document.getElementById('checkoutOverlay');
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function completeOrder() {
    closeCheckout();
    clearCart();
    showToast('✨ Thank you! Your bespoke order has been reserved with our atelier.', '💌');
  }

  function openQuickView(productId) {
    const product = CATALOG.find(p => p.id === productId);
    if (!product) return;

    const modalContent = document.getElementById('quickViewContent');
    const overlay = document.getElementById('quickViewOverlay');

    modalContent.innerHTML = `
      <button class="modal-close-btn" onclick="window.KF.closeQuickView()" aria-label="Close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));">
        <div style="background:var(--surface-alt); min-height:360px;">
          <img src="${product.image}" alt="${product.title}" style="width:100%; height:100%; object-fit:cover; display:block;">
        </div>
        <div style="padding: clamp(24px, 4vw, 42px); display:flex; flex-direction:column; justify-content:center;">
          <span style="font-size:0.75rem; letter-spacing:0.12em; text-transform:uppercase; color:var(--accent); font-weight:600; margin-bottom:8px;">${product.categoryLabel}</span>
          <h2 style="font-family:var(--serif); font-size:2.2rem; font-weight:400; line-height:1.2; margin:0 0 12px; color:var(--ink);">${product.title}</h2>
          <div style="font-family:var(--serif); font-size:1.6rem; color:var(--ink); margin-bottom:18px; font-weight:600;">${formatPrice(product.priceUSD)}</div>
          <p style="color:var(--ink-soft); line-height:1.7; font-size:0.95rem; margin-bottom:20px;">${product.description}</p>
          
          <div style="background:var(--surface-alt); padding:16px; border-radius:14px; margin-bottom:24px; font-size:0.85rem;">
            <div style="margin-bottom:6px;"><strong>Materials:</strong> ${product.material}</div>
            <div><strong>Authenticity:</strong> 100% slow handcrafted in studio; zero mass manufacturing.</div>
          </div>

          <div style="display:flex; gap:12px; align-items:center;">
            <button class="btn-dark" style="flex:1; padding:14px;" onclick="window.KF.addToCart('${product.id}'); window.KF.closeQuickView();">Add to Bag • ${formatPrice(product.priceUSD)}</button>
          </div>
        </div>
      </div>
    `;

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeQuickView() {
    const overlay = document.getElementById('quickViewOverlay');
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Render & Update UI
  function updateCartUI() {
    const badge = document.getElementById('navCartCount');
    const headerCount = document.getElementById('cartCountHeader');
    const container = document.getElementById('cartItemsContainer');
    const subtotalEl = document.getElementById('cartSubtotal');
    const freeText = document.getElementById('freeShippingText');
    const progressEl = document.getElementById('shippingProgress');

    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotalUSD = cart.reduce((sum, item) => sum + (item.priceUSD * item.qty), 0);

    if (badge) badge.textContent = totalQty;
    if (headerCount) headerCount.textContent = totalQty;

    if (subtotalEl) {
      subtotalEl.textContent = formatPrice(subtotalUSD);
    }

    // Free Gift Box Threshold ($80 USD)
    const thresholdUSD = 80;
    if (freeText && progressEl) {
      if (subtotalUSD >= thresholdUSD) {
        freeText.innerHTML = '🎉 <strong>Complimentary Keepsake Gift Box Unlocked!</strong>';
        progressEl.style.width = '100%';
      } else {
        const remaining = thresholdUSD - subtotalUSD;
        freeText.innerHTML = `Add <strong>${formatPrice(remaining)}</strong> more for a Complimentary Keepsake Gift Box!`;
        progressEl.style.width = `${Math.min(100, Math.round((subtotalUSD / thresholdUSD) * 100))}%`;
      }
    }

    if (!container) return;

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="cart-empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <h3 style="font-family: var(--serif); font-size: 1.4rem; font-weight: 400; margin: 0 0 8px;">Your bag is empty</h3>
          <p style="font-size: 0.9rem; margin: 0 0 20px;">Explore our glass facets and slow crochet pieces to find something unique.</p>
          <a href="shop.html" class="btn-secondary" onclick="window.KF.closeCart()">Browse Collection</a>
        </div>
      `;
      return;
    }

    container.innerHTML = cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img class="cart-item-img" src="${item.image}" alt="${item.title}">
        <div class="cart-item-details">
          <h4>${item.title}</h4>
          <div class="cart-item-price">${formatPrice(item.priceUSD)}</div>
          <div class="cart-qty-ctrl">
            <button onclick="window.KF.updateQty('${item.id}', -1)" aria-label="Decrease quantity">−</button>
            <span>${item.qty}</span>
            <button onclick="window.KF.updateQty('${item.id}', 1)" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="window.KF.removeFromCart('${item.id}')" title="Remove item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
        </button>
      </div>
    `).join('');
  }

  // Set Currency & Refresh all formatted prices on page
  function setCurrency(cur) {
    if (!CURRENCIES[cur]) return;
    activeCurrency = cur;
    try {
      localStorage.setItem('kf_currency', cur);
    } catch (e) {}

    // Update select dropdowns
    document.querySelectorAll('.currency-select').forEach(el => {
      el.value = cur;
    });

    // Update price elements
    document.querySelectorAll('[data-usd]').forEach(el => {
      const usd = parseFloat(el.getAttribute('data-usd'));
      if (!isNaN(usd)) {
        el.textContent = formatPrice(usd);
      }
    });

    updateCartUI();
    showToast(`Currency changed to ${cur}`, '💱');
  }

  // Render Product Card Component
  function renderProductCard(p) {
    return `
      <article class="product-card" data-category="${p.category}" data-tags="${p.tags.join(' ')}" data-price="${p.priceUSD}">
        <div class="product-image-wrap">
          <span class="product-badge ${p.badge === 'Bestseller' ? 'special' : ''}">${p.badge}</span>
          <img src="${p.image}" alt="${p.title}" loading="lazy">
          <div class="product-quick-actions">
            <button class="btn-quick-view" onclick="window.KF.openQuickView('${p.id}')">Quick View</button>
            <button class="btn-quick-add" onclick="window.KF.addToCart('${p.id}')">Add to Bag</button>
          </div>
        </div>
        <div class="product-body">
          <div class="product-category">${p.categoryLabel}</div>
          <h3 class="product-title">${p.title}</h3>
          <p class="product-desc">${p.description}</p>
          <div class="product-footer">
            <span class="product-price" data-usd="${p.priceUSD}">${formatPrice(p.priceUSD)}</span>
            <span class="product-material-pill">${p.material.split('&')[0]}</span>
          </div>
        </div>
      </article>
    `;
  }

  // Init
  function init() {
    injectCartDrawerHTML();
    updateCartUI();

    // Bind nav cart button
    const cartTrigger = document.getElementById('navCartBtn');
    if (cartTrigger) {
      cartTrigger.addEventListener('click', openCart);
    }

    // Currency selector listener
    document.querySelectorAll('.currency-select').forEach(el => {
      el.value = activeCurrency;
      el.addEventListener('change', (e) => setCurrency(e.target.value));
    });

    // Set prices for existing static elements
    document.querySelectorAll('[data-usd]').forEach(el => {
      const usd = parseFloat(el.getAttribute('data-usd'));
      if (!isNaN(usd)) el.textContent = formatPrice(usd);
    });

    // Handle scroll shadow for nav
    const nav = document.querySelector('.site-nav');
    if (nav) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 20) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
      }, { passive: true });
    }

    // Mobile menu toggle
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.contains('open');
        mobileMenu.classList.toggle('open', !isOpen);
        menuBtn.setAttribute('aria-expanded', String(!isOpen));
      });
      mobileMenu.addEventListener('click', (e) => {
        if (e.target.closest('a')) {
          mobileMenu.classList.remove('open');
          menuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  // Expose global API
  window.KF = {
    CATALOG,
    addToCart,
    removeFromCart,
    updateQty,
    openCart,
    closeCart,
    openQuickView,
    closeQuickView,
    openCheckout,
    closeCheckout,
    completeOrder,
    setCurrency,
    formatPrice,
    showToast,
    renderProductCard
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
