
let cart = JSON.parse(localStorage.getItem("cart")) || [];


// ADD TO CART
let buttons = document.querySelectorAll(".product-card button");

buttons.forEach(function(button) {
    button.addEventListener("click", function() {
        let product = button.parentElement;

        let name = product.querySelector("h2").innerText;
        let priceText = product.querySelector("p").innerText;
        let image = product.querySelector("img").src;

        let item = {
            name: name,
            price: Number(priceText.replace(/\D/g, "")),
            image: image,
            quantity: 1
        };

        cart.push(item);

        localStorage.setItem("cart", JSON.stringify(cart));

        alert("Product added to cart!");
    });
});


// DISPLAY CART
let cartItems = document.getElementById("cart-items");
let cartTotal = document.getElementById("cart-total");

function displayCart() {
    if (!cartItems) return;

    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(function(item, index) {
        total += item.price * item.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" width="100">
                <h2>${item.name}</h2>
                <p>Price: ₹${item.price}</p>

                <p>
                    Quantity:
                    <button onclick="changeQuantity(${index}, -1)">-</button>
                    ${item.quantity}
                    <button onclick="changeQuantity(${index}, 1)">+</button>
                </p>

                <button onclick="removeItem(${index})">Remove</button>
            </div>
        `;
    });

    if (cartTotal) {
        cartTotal.innerText = total;
    }
}


// CHANGE QUANTITY
function changeQuantity(index, change) {
    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}


// REMOVE ITEM
function removeItem(index) {
    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

displayCart();


// SEARCH PRODUCTS
let searchInput = document.getElementById("searchInput");

if (searchInput) {
    searchInput.addEventListener("input", function() {
        let searchText = searchInput.value.toLowerCase();

        let products = document.querySelectorAll(".product-card");

        products.forEach(function(product) {
            let productName = product.querySelector("h2").innerText.toLowerCase();

            product.style.display = productName.includes(searchText)
                ? "block"
                : "none";
        });
    });
}


// CHECKOUT ORDER SUMMARY
let orderSummary = document.getElementById("order-summary");
let orderTotal = document.getElementById("order-total");

if (orderSummary && orderTotal) {
    let savedCart = JSON.parse(localStorage.getItem("cart")) || [];

    let total = 0;

    savedCart.forEach(function(item) {
        total += item.price * item.quantity;

        orderSummary.innerHTML += `
            <div>
                <h3>${item.name}</h3>
                <p>Price: ₹${item.price}</p>
                <p>Quantity: ${item.quantity}</p>
            </div>
        `;
    });

    orderTotal.innerText = total;

    let cartDataInput = document.getElementById("cart_data");
    let totalInput = document.getElementById("total");

    if (cartDataInput && totalInput) {
        cartDataInput.value = JSON.stringify(savedCart);
        totalInput.value = total;
    }
}


// PLACE ORDER AND SEND DATA TO DJANGO
let checkoutForm = document.getElementById("checkoutForm");

if (checkoutForm) {
    checkoutForm.addEventListener("submit", function(event) {
        event.preventDefault();

        let savedCart = JSON.parse(localStorage.getItem("cart")) || [];

        if (savedCart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        let cartDataInput = document.getElementById("cart_data");
        let totalInput = document.getElementById("total");

        cartDataInput.value = JSON.stringify(savedCart);

        let total = savedCart.reduce(function(sum, item) {
            return sum + (item.price * item.quantity);
        }, 0);

        totalInput.value = total;

        checkoutForm.submit();
    });
}
