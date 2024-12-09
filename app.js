document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("productList");
  const nextBtn = document.getElementById("nextBtn");
  const orderSummaryList = document.getElementById("orderSummaryList");
  const totalPriceElement = document.getElementById("totalPrice");
  const moneyPaidInput = document.getElementById("moneyPaid");
  const changeElement = document.getElementById("change");
  const calculateBtn = document.getElementById("calculateBtn");
  const clearBtn = document.getElementById("clearBtn");

  let products = [];
  let quantities = {};

  // Helper function to calculate contrast text color
  function getContrastColor(hexColor) {
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  }

  // Fetch products from JSON file
  fetch("products.json")
    .then((response) => response.json())
    .then((data) => {
      products = data;

      // Render products dynamically
      products.forEach((product, index) => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";

        productCard.style.backgroundColor = product.color;
        productCard.style.color = getContrastColor(product.color);

        productCard.innerHTML = `
          <label>${product.name} (€${product.price}):</label>
          <input 
            type="range" 
            id="productQty${index}" 
            min="0" 
            max="10" 
            value="0" 
            oninput="updateSliderValue(${index})"
          />
          <span id="qtyDisplay${index}">0</span>
        `;
        productList.appendChild(productCard);

        // Initialize quantities
        quantities[product.name] = 0;
      });
    });

  // Update slider value dynamically
  window.updateSliderValue = (index) => {
    const slider = document.getElementById(`productQty${index}`);
    const display = document.getElementById(`qtyDisplay${index}`);
    display.textContent = slider.value;
  };

  nextBtn.addEventListener("click", () => {
    let totalPrice = 0;
    orderSummaryList.innerHTML = ""; // Clear the summary list

    // Calculate total price and populate the order summary
    products.forEach((product, index) => {
      const qty = parseInt(document.getElementById(`productQty${index}`).value, 10) || 0;
      if (qty > 0) {
        quantities[product.name] = qty;
        totalPrice += qty * product.price;

        // Add to order summary
        const listItem = document.createElement("li");
        listItem.textContent = `${qty} x ${product.name}`;
        orderSummaryList.appendChild(listItem);
      } else {
        quantities[product.name] = 0;
      }
    });

    totalPriceElement.textContent = totalPrice.toFixed(2);

    document.getElementById("screen1").classList.remove("visible");
    document.getElementById("screen2").classList.add("visible");
  });

  calculateBtn.addEventListener("click", () => {
    const moneyPaidValue = moneyPaidInput.value.trim();

    // Validate decimal input
    if (!/^\d+(\.\d{1,2})?$/.test(moneyPaidValue)) {
      alert("Bitte geben Sie einen gültigen Betrag ein (z. B. 1.50).");
      return;
    }

    const moneyPaid = parseFloat(moneyPaidValue) || 0;
    const totalPrice = parseFloat(totalPriceElement.textContent);
    const change = moneyPaid - totalPrice;

    changeElement.textContent = change >= 0 ? change.toFixed(2) : "0.00";
  });

  clearBtn.addEventListener("click", () => {
    quantities = {};
    products.forEach((_, index) => {
      document.getElementById(`productQty${index}`).value = 0;
      document.getElementById(`qtyDisplay${index}`).textContent = 0;
    });

    totalPriceElement.textContent = "0.00";
    moneyPaidInput.value = "0.00";
    changeElement.textContent = "0.00";
    orderSummaryList.innerHTML = ""; // Clear the order summary

    document.getElementById("screen2").classList.remove("visible");
    document.getElementById("screen1").classList.add("visible");
  });
});
