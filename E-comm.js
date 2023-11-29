const productsEl = document.querySelector("main .products");
const cartEl = document.getElementById("cart");
const cartBtn = document.getElementById("cartBtn");
const checkoutBtn = document.getElementById("checkoutBtn");
const websiteHead = document.getElementById("website");

async function fetchProducts() {
  try {
    const response = await fetch(`https://dummyjson.com/products`);
    if (!response.ok) {
      throw new Error("Not able to fetch the product");
    }
    const data = await response.json();
    const productDeatils = data.products;
    for (let item of productDeatils) {
      createProduct(item);
    }
  } catch (err) {
    console.log(err);
  }
}

function createProduct(data) {
  // console.log(data);
  const product = document.createElement("div");
  const img_container = document.createElement("div");
  const prevBtn = document.createElement("button");
  const nextBtn = document.createElement("button");
  const proImage = document.createElement("img");
  const profooter = document.createElement("div");
  const proName = document.createElement("h3");
  const proPrice = document.createElement("p");
  const addtoCartBtn = document.createElement("button");

  prevBtn.textContent = "<<";
  nextBtn.textContent = ">>";
  proImage.src = data.images[0];
  img_container.appendChild(prevBtn);
  img_container.appendChild(proImage);
  img_container.appendChild(nextBtn);
  img_container.classList.add("img_con");

  proName.textContent = data.brand;
  proPrice.textContent = `Price: $${data.price}`;
  addtoCartBtn.textContent = "Add to Cart";
  profooter.classList.add("card_footer");
  profooter.appendChild(proName);
  profooter.appendChild(proPrice);
  profooter.appendChild(addtoCartBtn);

  product.classList.add("product");
  product.appendChild(img_container);
  product.appendChild(profooter);
  productsEl.appendChild(product);

  addtoCartBtn.addEventListener("click", () => {
    additemToCart(data);
  });
}

function additemToCart(item) {
  let itemID = item.title.replace(/\s/g, "");
  const temp = document.getElementById(itemID);
  if (temp === null) {
    const cartItem = `<div id='${itemID}' class="cart_item">
      <span>${item.title}</span>
      <span id='price'>Price: ${item.price}</span>
      <span id="quantity">Quantity: 1</span>
      <button type="button">-</button>
    </div>`;
    cartEl.insertAdjacentHTML("afterbegin", cartItem);

    const btnEl = document.querySelector(`#${itemID} button`);
    const thisItem = document.getElementById(itemID);
    btnEl.addEventListener("click", () => {
      decreaseQuantity(itemID, thisItem);
    });
  } else {
    increaseQuantity(itemID);
  }
}

function increaseQuantity(itemID) {
  let quant = getQuantity(itemID);
  const ItemQuantityEl = document.querySelector(`#${itemID} #quantity`);
  ItemQuantityEl.textContent = `Quantity: ${quant + 1}`;
}

function decreaseQuantity(itemID, item) {
  let quant = getQuantity(itemID);
  if (quant - 1 === 0) {
    item.remove();
    return;
  }
  const ItemQuantityEl = document.querySelector(`#${itemID} #quantity`);
  ItemQuantityEl.textContent = `Quantity: ${quant - 1}`;
}

function totalPrice() {
  const arr = document.getElementsByClassName("cart_item");
  let totPrice = 0;
  const keys = Object.keys(arr);
  for (let i = 0; i < keys.length; i++) {
    const quantity = getQuantity(arr[`${keys[i]}`].id);
    const price = getPrice(arr[`${keys[i]}`].id);
    totPrice = totPrice + quantity * price;
  }
  return totPrice;
}

function getQuantity(itemID) {
  const ItemQuantityEl = document.querySelector(`#${itemID} #quantity`);
  const textEl = ItemQuantityEl.textContent;
  const index = textEl.indexOf(":");
  const sliced = textEl.slice(index + 1);
  return Number(sliced);
}

function getPrice(itemID) {
  const ItemPriceEl = document.querySelector(`#${itemID} #price`);
  const textEl = ItemPriceEl.textContent;
  const index = textEl.indexOf(":");
  const sliced = textEl.slice(index + 1);
  return Number(sliced);
}

function isCartEmpty() {
  if (cartEl.querySelector("div") === null) return true;
}

document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();

  checkoutBtn.addEventListener("click", () => {
    if (isCartEmpty()) {
      alert("Cart is Empty !!");
      return;
    }
    const totprice = totalPrice();
    console.log(totprice);
    alert(
      `Congratulations, Your order has been placed !! Total Order Price: $${totprice}`
    );
  });

  cartBtn.addEventListener("click", () => {
    if (isCartEmpty()) {
      alert("Cart is Empty !!");
      return;
    }
    if (cartEl.innerHTML.trim() === "") return;
    productsEl.innerHTML = "";
    cartEl.style.display = "block";
  });

  websiteHead.addEventListener("click", () => {
    cartEl.innerHTML = "";
    cartEl.style.display = "none";
    fetchProducts();
  });
});
