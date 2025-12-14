// Array of available products with their details (id, name, price, image path)
const products = [
    { id: 1, name: "The White Album", price: 13.99, img: "img/1book.jpg" },
    { id: 2, name: "Song of Solomon", price: 14.50, img: "img/2book.jpg" },
    { id: 3, name: "The Alchemist", price: 16.00, img: "img/3book.jpg" },
    { id: 4, name: "Slaughterhouse-Five", price: 10.75, img: "img/4book.jpg" },
    { id: 5, name: "Harry Potter and the Cursed Child", price: 13.25, img: "img/5book.jpg" },
    { id: 6, name: "Pride and Prejudice", price: 11.99, img: "img/6book.jpg" },
    { id: 7, name: "The Great Gatsby", price: 10.99, img: "img/7book.jpg" },
    { id: 8, name: "The Catcher in the Rye", price: 15.00, img: "img/8book.jpg" },
    { id: 9, name: "Fahrenheit 451", price: 12.50, img: "img/9book.jpg" },
    { id: 10, name: "Psycho", price: 12.75, img: "img/10book.jpg" },
    { id: 11, name: "The color purple", price: 14.85, img: "img/11book.jpg" },
    { id: 12, name: "The Unbearable Lightness of Being", price: 10.65, img: "img/12book.jpg" }
];

// List of European countries for form validation
const europeanCountries = [
    "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland", "United Kingdom"
];

// Gets the product list container and introduces the product cards
const productList = document.getElementById("product-list");
products.forEach(book => {
    const card = `
        <div class="col-md-4 mb-4">
            <div class="card h-100">
                <img src="${book.img}" class="card-img-top" alt="${book.name}">
                <div class="card-body">
                    <h5 class="card-title">${book.name}</h5>
                    <p class="card-text">$${book.price.toFixed(2)}</p>
                    <button class="btn btn-primary add-to-cart" data-id="${book.id}">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
    productList.innerHTML += card;
});

// Cart functionality variables
let cart = []; // Array to hold items added to cart
const cartSection = document.getElementById("cart-section");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

// Creates notification div for add-to-cart messages
const notification = document.createElement('div');
notification.id = 'cart-notification';
document.body.appendChild(notification);

// Event listener for add-to-cart and remove-from-cart buttons
document.addEventListener("click", (e) => {
    // Handles adding item to cart
    if (e.target.classList.contains("add-to-cart")) {
        const productId = parseInt(e.target.getAttribute("data-id"));
        const product = products.find(p => p.id === productId);
        cart.push(product);
        notification.textContent = `${product.name} has been added to your cart!`;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
        updateCart();
    // Handles removing item from cart
    } else if (e.target.classList.contains("remove-from-cart")) {
        const index = parseInt(e.target.getAttribute("data-index"));
        cart.splice(index, 1);
        updateCart();
    }
});

// Function to update and display the cart contents
function updateCart() {
    // Shows cart section
    cartSection.classList.remove("d-none");
    cartItems.innerHTML = "";
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        // Creates list item for each cart item with remove button
        const listItem = `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span>${item.name} - $${item.price.toFixed(2)}</span>
                <button class="btn btn-danger btn-sm remove-from-cart" data-index="${index}">Remove</button>
            </li>
        `;
        cartItems.innerHTML += listItem;
    });
    cartTotal.textContent = total.toFixed(2);
    // Hides cart if empty
    if (cart.length === 0) {
        cartSection.classList.add("d-none");
    }
}

// Checkout button and section elements
const checkoutBtn = document.getElementById("checkout-btn");
const checkoutSection = document.getElementById("checkout-section");

// Event listener for checkout button to show form
checkoutBtn.addEventListener("click", () => {
    // Hides cart, shows checkout form
    cartSection.classList.add("d-none");
    checkoutSection.classList.remove("d-none");
});

// Form and confirmation elements
const checkoutForm = document.getElementById("checkout-form");
const confirmationSection = document.getElementById("confirmation-section");
const confirmationDetails = document.getElementById("confirmation-details");

// Event listener for form submission
checkoutForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevents default form submission
    // Retrieves and trims form input values
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const country = document.getElementById("country").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const cardNumber = document.getElementById("cardNumber").value.trim();

    // Validates required fields
    if (!firstName || !lastName || !country) {
        alert("Please fill in all required fields.");
        return;
    }

    // Validates European country selection
    if (!europeanCountries.includes(country)) {
        alert("Please select a valid country from Europe.");
        return;
    }

    // Validates email format
    if (!email.includes("@") || !email.includes(".")) {
        alert("Please enter a valid email address.");
        return;
    }

    // Validates phone is numeric
    if (!/^[0-9]+$/.test(phone)) {
        alert("Phone number can contain numbers only.");
        return;
    }

    // Validates card number length
    if (!/^\d{15,19}$/.test(cardNumber)) {
        alert("Please enter a valid card number (15-19 digits).");
        return;
    }

    // Calculates order total, discount, tax, and final total
    let total = 0;
    cart.forEach(item => total += item.price);
    let discount = 0;
    if (cart.length >= 3) {
        discount = total * 0.15;
        total = total - discount;
    }
    const tax = total * 0.10; // Apply 10% tax
    const finalTotal = total + tax;
    // Hides form, shows confirmation
    checkoutSection.classList.add("d-none");
    confirmationSection.classList.remove("d-none");
    confirmationDetails.innerHTML = `
        <h4>Thank you for your donation!</h4>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Country you want to donate in:</strong> ${country}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Items purchased:</strong></p>
        <ul>
            ${cart.map(item => `<li>${item.name} - $${item.price.toFixed(2)}</li>`).join("")}
        </ul>
        <p><strong>Discount:</strong> $${discount.toFixed(2)}</p>
        <p><strong>Tax (10%):</strong> $${tax.toFixed(2)}</p>
        <h4><strong>Final Total:</strong> $${finalTotal.toFixed(2)}</h4>
    `;
});