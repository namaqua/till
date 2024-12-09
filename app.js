document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("productList");
  const nextBtn = document.getElementById("nextBtn");
  const orderSummaryList = document.getElementById("orderSummaryList");
  const clearBtn = document.getElementById("clearBtn");
  const totalPriceElement = document.getElementById("totalPrice");
  const moneyPaidInput = document.getElementById("moneyPaid");
  const changeElement = document.getElementById("change");

  let products = [];
  let quantities = {};

  function getContrastColor(hexColor) {
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  }

  fetch("products.json")
    .then((response) => response.json())
    .then((data) => {
      products = data;
      products.forEach((product, index) => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.style.backgroundColor = product.color;
        productCard.style.color = getContrastColor(product.color);

        productCard.innerHTML = `
          <label>${product.name} (€${product.price})</label>
          <input type="range" id="productQty${index}" value="0" min="0" max="10">
          <span id="qtyDisplay${index}">0</span>
        `;
        productList.appendChild(productCard);

        document.getElementById(`productQty${index}`).addEventListener("input", (e) => {
          document.getElementById(`qtyDisplay${index}`).textContent = e.target.value;
        });

        quantities[product.name] = 0;
      });
    });

  nextBtn.addEventListener("click", () => {
    orderSummaryList.innerHTML = ""; // Clear previous order summary
    clearBtn.disabled = true; // Disable "Zurücksetzen" button initially
    let totalPrice = 0;

    products.forEach((product, index) => {
      const qty = parseInt(document.getElementById(`productQty${index}`).value, 10) || 0;
      if (qty > 0) {
        quantities[product.name] = qty;
        totalPrice += qty * product.price;

        const listItem = document.createElement("li");
        listItem.innerHTML = `
          <input type="checkbox" id="checkbox${index}" class="order-checkbox">
          <label for="checkbox${index}">${qty} x ${product.name}</label>
        `;
        orderSummaryList.appendChild(listItem);
      }
    });

    totalPriceElement.textContent = totalPrice.toFixed(2);

    // Reattach listeners for checkboxes
    document.querySelectorAll(".order-checkbox").forEach((checkbox) => {
      checkbox.addEventListener("change", checkAllCheckboxes);
    });

    document.getElementById("screen1").classList.remove("visible");
    document.getElementById("screen2").classList.add("visible");
  });

  function checkAllCheckboxes() {
    const checkboxes = document.querySelectorAll(".order-checkbox");
    const allChecked = Array.from(checkboxes).every((checkbox) => checkbox.checked);
    clearBtn.disabled = !allChecked;
  }

  clearBtn.addEventListener("click", () => {
    // Reset everything to initial state
    quantities = {};
    products.forEach((_, index) => {
      const qtyInput = document.getElementById(`productQty${index}`);
      qtyInput.value = 0;
      document.getElementById(`qtyDisplay${index}`).textContent = "0";
    });

    totalPriceElement.textContent = "0.00";
    moneyPaidInput.value = "";
    changeElement.textContent = "0.00";
    orderSummaryList.innerHTML = ""; // Clear the order summary
    clearBtn.disabled = true; // Disable the "Zurücksetzen" button

    document.getElementById("screen2").classList.remove("visible");
    document.getElementById("screen1").classList.add("visible");
  });

  document.getElementById("calculateBtn").addEventListener("click", () => {
    const moneyPaid = parseFloat(moneyPaidInput.value) || 0;
    const totalPrice = parseFloat(totalPriceElement.textContent);
    const change = moneyPaid - totalPrice;

    changeElement.textContent = change >= 0 ? change.toFixed(2) : "0.00";
  });
});
