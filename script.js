/* =========================================================
   CLOTH & CRAFT FASHION
   Main JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     ELEMENTS
  ========================= */

  const searchInput = document.querySelector("#searchInput");
  const productCards = document.querySelectorAll(".product-card");

  /* =========================
     SEARCH
  ========================= */

  if (searchInput) {
    searchInput.addEventListener("input", function () {

      const searchText = this.value.toLowerCase().trim();

      productCards.forEach(card => {

        const name =
          card.querySelector(".product-name")?.textContent.toLowerCase() || "";

        const category =
          card.querySelector(".product-category")?.textContent.toLowerCase() || "";

        if (
          searchText === "" ||
          name.includes(searchText) ||
          category.includes(searchText)
        ) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }

      });

    });
  }


  /* =========================
     FAVORITE
  ========================= */

  const favoriteButtons = document.querySelectorAll(
    ".favorite, .favorite-btn, [data-favorite]"
  );

  favoriteButtons.forEach(button => {

    button.addEventListener("click", event => {

      event.preventDefault();
      event.stopPropagation();

      button.classList.toggle("active");

      if (button.classList.contains("active")) {
        button.textContent = "♥️";
        button.style.color = "#e91e63";
      } else {
        button.textContent = "♡";
        button.style.color = "";
      }

    });

  });


  /* =========================
     ORDER NOW
  ========================= */

  const orderButtons = document.querySelectorAll(
    ".order-now, .order-btn, [data-order]"
  );

  orderButtons.forEach(button => {

    button.addEventListener("click", event => {

      event.preventDefault();

      const card = button.closest(".product-card");

      if (!card) return;

      const productName =
        card.querySelector(".product-name")?.textContent.trim() ||
        "Product";

      const price =
        card.querySelector(".product-price")?.textContent.trim() ||
        "";

      openProductDetails(productName, price);

    });

  });


  /* =========================
     PRODUCT CARD CLICK
  ========================= */

  productCards.forEach(card => {

    card.addEventListener("click", event => {

      if (
        event.target.closest(".favorite") ||
        event.target.closest(".favorite-btn") ||
        event.target.closest("[data-favorite]") ||
        event.target.closest(".order-now") ||
        event.target.closest(".order-btn") ||
        event.target.closest("[data-order]")
      ) {
        return;
      }

      const productName =
        card.querySelector(".product-name")?.textContent.trim() ||
        "Product";

      const price =
        card.querySelector(".product-price")?.textContent.trim() ||
        "";

      openProductDetails(productName, price);

    });

  });


  /* =========================
     CATEGORY CLICK
  ========================= */

  const categoryCards = document.querySelectorAll(
    ".category-card, .category-item, [data-category]"
  );

  categoryCards.forEach(category => {

    category.addEventListener("click", event => {

      event.preventDefault();

      const categoryName =
        category.querySelector("h3, h4, span, p")?.textContent.trim() ||
        category.dataset.category ||
        "Category";

      showMessage(
        categoryName + " selected"
      );

    });

  });


  /* =========================
     VIEW ALL BUTTONS
  ========================= */

  const viewAllButtons = document.querySelectorAll(
    ".view-all, .view-all-btn, [data-view-all]"
  );

  viewAllButtons.forEach(button => {

    button.addEventListener("click", event => {

      event.preventDefault();

      const productsSection =
        button.closest("section") ||
        document.querySelector(".products-section");

      if (productsSection) {
        productsSection.scrollIntoView({
          behavior: "smooth"
        });
      }

    });

  });


  /* =========================
     BOTTOM NAVIGATION
  ========================= */

  const bottomNavButtons = document.querySelectorAll(
    ".bottom-nav a, .bottom-navigation a, .mobile-bottom-nav a"
  );

  bottomNavButtons.forEach(link => {

    link.addEventListener("click", event => {

      const href = link.getAttribute("href");

      if (!href || href === "#") {
        event.preventDefault();
      }

    });

  });


  /* =========================
     SMOOTH INTERNAL LINKS
  ========================= */

  document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (target) {

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }

    });

  });


  /* =========================
     CART
  ========================= */

  let cart = JSON.parse(
    localStorage.getItem("ccf_cart") || "[]"
  );

  function saveCart() {

    localStorage.setItem(
      "ccf_cart",
      JSON.stringify(cart)
    );

    updateCartCount();

  }


  function updateCartCount() {

    const count =
      cart.reduce(
        (total, item) => total + Number(item.quantity || 1),
        0
      );

    document.querySelectorAll(
      ".cart-count, [data-cart-count]"
    ).forEach(element => {
      element.textContent = count;
    });

  }


  window.addToCart = function(product) {

    const existing = cart.find(
      item => item.name === product.name
    );

    if (existing) {

      existing.quantity =
        Number(existing.quantity || 1) + 1;

    } else {

      cart.push({
        name: product.name,
        price: product.price,
        quantity: 1
      });

    }

    saveCart();

    showMessage("Added to cart");

  };


  window.getCart = function() {
    return cart;
  };


  /* =========================
     PRODUCT DETAILS
  ========================= */

  function openProductDetails(name, price) {

    const existingModal =
      document.querySelector("#productModal");

    if (existingModal) {
      existingModal.remove();
    }

    const modal = document.createElement("div");

    modal.id = "productModal";

    modal.innerHTML = `
      <div class="ccf-modal-overlay">

        <div class="ccf-product-modal">

          <button class="ccf-close" id="closeProductModal">
            ×
          </button>

          <div class="ccf-product-image">
            <div class="ccf-image-placeholder">
              Product Image
            </div>
          </div>

          <div class="ccf-product-info">

            <small>Cloth & Craft Fashion</small>

            <h2>${escapeHTML(name)}</h2>

            <div class="ccf-rating">
              ★★★★★
            </div>

            <h3>${escapeHTML(price)}</h3>

            <p>
              Product details, size, color and delivery
              information will appear here.
            </p>

            <label>Size</label>

            <select id="productSize">
              <option value="">Select Size</option>
              <option>S</option>
              <option>M</option>
              <option>L</option>
              <option>XL</option>
              <option>XXL</option>
            </select>

            <label>Color</label>

            <select id="productColor">
              <option value="">Select Color</option>
              <option>Black</option>
              <option>White</option>
              <option>Blue</option>
              <option>Red</option>
              <option>Green</option>
            </select>

            <label>Quantity</label>

            <input
              id="productQuantity"
              type="number"
              value="1"
              min="1"
            >

            <div class="ccf-product-actions">

              <button id="modalAddCart">
                Add to Cart
              </button>

              <button id="modalOrder">
                Order Now
              </button>

            </div>

          </div>

        </div>

      </div>
    `;

    document.body.appendChild(modal);

    document
      .querySelector("#closeProductModal")
      .addEventListener("click", () => {
        modal.remove();
      });


    document
      .querySelector("#modalAddCart")
      .addEventListener("click", () => {

        const size =
          document.querySelector("#productSize").value;

        const color =
          document.querySelector("#productColor").value;

        const quantity =
          Number(
            document.querySelector("#productQuantity").value
          ) || 1;

        addToCart({
          name,
          price,
          size,
          color,
          quantity
        });

      });


    document
      .querySelector("#modalOrder")
      .addEventListener("click", () => {

        modal.remove();

        openCheckout({
          name,
          price
        });

      });

  }


  /* =========================
     CHECKOUT
  ========================= */

  function openCheckout(product) {

    const oldCheckout =
      document.querySelector("#checkoutModal");

    if (oldCheckout) {
      oldCheckout.remove();
    }

    const modal = document.createElement("div");

    modal.id = "checkoutModal";

    modal.innerHTML = `
      <div class="ccf-modal-overlay">

        <div class="ccf-checkout-modal">

          <button
            class="ccf-close"
            id="closeCheckout"
          >
            ×
          </button>

          <h2>Checkout</h2>

          <p>
            ${escapeHTML(product.name)}
          </p>

          <strong>
            ${escapeHTML(product.price)}
          </strong>

          <form id="checkoutForm">

            <input
              type="text"
              id="customerName"
              placeholder="Full Name"
              required
            >

            <input
              type="tel"
              id="customerPhone"
              placeholder="Phone Number"
              required
            >

            <select id="division" required>
              <option value="">Select Division</option>
              <option>Dhaka</option>
              <option>Chattogram</option>
              <option>Rajshahi</option>
              <option>Khulna</option>
              <option>Barishal</option>
              <option>Sylhet</option>
              <option>Rangpur</option>
              <option>Mymensingh</option>
            </select>

            <input
              type="text"
              placeholder="District"
              required
            >

            <input
              type="text"
              placeholder="Upazila / Thana"
              required
            >

            <input
              type="text"
              placeholder="Area"
              required
            >

            <textarea
              placeholder="Full Address"
              required
            ></textarea>

            <select required>
              <option value="">
                Payment Method
              </option>
              <option value="cod">
                Cash on Delivery
              </option>
              <option value="prepaid">
                Prepaid
              </option>
            </select>

            <button type="submit">
              Place Order
            </button>

          </form>

        </div>

      </div>
    `;

    document.body.appendChild(modal);


    document
      .querySelector("#closeCheckout")
      .addEventListener("click", () => {
        modal.remove();
      });


    document
      .querySelector("#checkoutForm")
      .addEventListener("submit", event => {

        event.preventDefault();

        showMessage(
          "Order information received"
        );

        modal.remove();

      });

  }


  /* =========================
     ACCOUNT
  ========================= */

  document
    .querySelectorAll(
      ".account-btn, [data-account], a[href='#account']"
    )
    .forEach(button => {

      button.addEventListener("click", event => {

        event.preventDefault();

        showAccountModal();

      });

    });


  function showAccountModal() {

    const old =
      document.querySelector("#accountModal");

    if (old) old.remove();

    const modal =
      document.createElement("div");

    modal.id = "accountModal";

    modal.innerHTML = `
      <div class="ccf-modal-overlay">

        <div class="ccf-account-modal">

          <button
            class="ccf-close"
            id="closeAccount"
          >
            ×
          </button>

          <h2>My Account</h2>

          <input
            type="tel"
            placeholder="Phone Number"
          >

          <input
            type="password"
            placeholder="Password"
          >

          <button>
            Login
          </button>

          <p>
            New customer?
            <a href="#" id="createAccount">
              Create Account
            </a>
          </p>

        </div>

      </div>
    `;

    document.body.appendChild(modal);

    document
      .querySelector("#closeAccount")
      .addEventListener("click", () => {
        modal.remove();
      });

  }


  /* =========================
     RESELLER
  ========================= */

  document
    .querySelectorAll(
      ".reseller-btn, [data-reseller], a[href='#reseller']"
    )
    .forEach(button => {

      button.addEventListener("click", event => {

        event.preventDefault();

        showResellerModal();

      });

    });


  function showResellerModal() {

    const old =
      document.querySelector("#resellerModal");

    if (old) old.remove();

    const modal =
      document.createElement("div");

    modal.id = "resellerModal";

    modal.innerHTML = `
      <div class="ccf-modal-overlay">

        <div class="ccf-reseller-modal">

          <button
            class="ccf-close"
            id="closeReseller"
          >
            ×
          </button>

          <h2>Become a Reseller</h2>

          <p>
            Start selling with Cloth & Craft Fashion.
          </p>

          <input
            type="text"
            placeholder="Full Name"
          >

          <input
            type="tel"
            placeholder="Phone Number"
          >

          <input
            type="password"
            placeholder="Password"
          >

          <button>
            Register
          </button>

        </div>

      </div>
    `;

    document.body.appendChild(modal);

    document
      .querySelector("#closeReseller")
      .addEventListener("click", () => {
        modal.remove();
      });

  }


  /* =========================
     MESSAGE
  ========================= */

  function showMessage(message) {

    const old =
      document.querySelector(".ccf-message");

    if (old) old.remove();

    const box =
      document.createElement("div");

    box.className = "ccf-message";

    box.textContent = message;

    document.body.appendChild(box);

    setTimeout(() => {
      box.remove();
    }, 2200);

  }


  /* =========================
     ESCAPE HTML
  ========================= */

  function escapeHTML(value) {

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  }


  /* =========================
     INITIALIZE
  ========================= */

  updateCartCount();

});
