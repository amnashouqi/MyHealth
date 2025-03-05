let cart = [];

document.addEventListener('DOMContentLoaded',()=>{
    //Loading the cart from session storage
    const savedCart = sessionStorage.getItem('cart');
    if (savedCart){
        cart = JSON.parse(savedCart);
    } else {
        cart = [];
    }
    updateCartUI();
})


function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.classList.toggle('show');
}

function addToCart(buttonElement) {
    const productId = buttonElement.getAttribute('data-product-id');
    const productElement = buttonElement.closest('.product');
    if (!productElement) {
        console.error('Product element not found');
        return; // Exit the function if productElement is not found
    }
    
    const name = productElement.querySelector('h2')?.innerText || 'Unknown Product';
    const priceText = productElement.querySelector('.price')?.innerText || '$0';
    const price = parseFloat(priceText.replace('$', '')) || 0; // Fallback to 0 if parsing fails
    const imgSrc = productElement.querySelector('.image')?.src; // Provide a default image src as a fallback
    const quantity = 1;


    if (!productId) {
        console.error('Product ID is missing');
        return; // Exit if no product ID is found
    }

    const existingProductIndex = cart.findIndex(item => item.id === productId);
    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push({ id: productId, name, price, img: imgSrc, quantity: 1 });
    }

    updateCartUI();
}


function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function updateQuantity(productId, newQuantity) {
    const productIndex = cart.findIndex(item => item.id === productId);
    if (productIndex !== -1) {
        cart[productIndex].quantity = newQuantity;
        if (newQuantity <= 0) {
            removeFromCart(productId);
        }
    }
    updateCartUI();
}

function clearCart() {
    cart = [];
    updateCartUI();
}

function checkout() {
    document.getElementById('checkoutModal').style.display = 'block'; // Show the modal
}




function updateCartUI() {

    sessionStorage.setItem('cart',JSON.stringify(cart));
    const cartItemsEl = document.getElementById('cartItems');
    cartItemsEl.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
        const itemEl = document.createElement('div');
        itemEl.classList.add('cart-item');
        itemEl.innerHTML = `
            <img src="${item.img}" class="cart-item-img">
            <div class="cart-item-details">
                <p>${item.name}</p>
                <p>$${item.price}</p>
                <div class="cart-item-quantity">
                    <button onclick="updateQuantity('${item.id}', ${item.quantity-1})">-</button>
                    <input type="number" value="${item.quantity}" min="0" class="quantity-input" disabled>
                    <button onclick="updateQuantity('${item.id}', ${item.quantity+1})">+</button>
                </div>
                <p>Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <span class="remove-item" onclick="removeFromCart('${item.id}')">&times;</span>
        `;
        cartItemsEl.appendChild(itemEl);
    });
    document.getElementById('totalPrice').innerText = total.toFixed(2);
}




// Initialization
document.querySelectorAll('.btn.fill').forEach(button => {
    button.setAttribute('onclick', 'addToCart(this)');
});



// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("checkout");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
  toggleCart();
  updateInvoiceDetails();
  document.body.classList.add("no-scroll");
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  document.body.classList.remove("no-scroll");
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    document.body.classList.remove("no-scroll");
  }
}

function updateInvoiceDetails() {
    const invoiceDetails = document.getElementById('invoice');
    let content = `<div class="title"><h2>Invoice Details</h2></div>`;

    // Build the invoice table
    content += `<table><tr><th>Item</th><th>Quantity</th><th>Unit Price</th><th class="subtotal">Subtotal</th></tr>`;

    let total = 0;
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        content += `<tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>$${item.price.toFixed(2)}</td>
                        <td class="subtotal">$${subtotal.toFixed(2)}</td>
                    </tr>`;
    });
    // Close the table and add the total
    content += `<tr class="total-row">
                    <td colspan="3" style="text-align:right;"><strong>Total:</strong></td>
                    <td class="subtotal">$${total.toFixed(2)}</td>
                </tr>`;
    content += `</table>`;
    content += `<button id="claimDiscount" class="btn outline" onclick="claimDiscount()">Claim Discount</button>`;
    content += `<div id="finalTotal"></div>`

    invoiceDetails.innerHTML = content;
}



function claimDiscount() {
    // Retrieve the quiz score and convert it to a discount rate
    const score = parseInt(localStorage.getItem('quizScore'), 10) || 0;
    if (score<0){
        return;
    }
    const DISCOUNT_RATE = score / 100; // Convert score to a percentage (e.g., 3 becomes 0.03)

    const invoiceDetails = document.getElementById('invoice');
    let finalTotalEl = document.getElementById('finalTotal');
    let total = 0;
    
    // Assuming cart is globally available
    cart.forEach(item => {
        total += item.price * item.quantity;
    });

    let discountAmount = total * DISCOUNT_RATE;
    let finalTotal = total - discountAmount;


    // Update the displayed total with discount
    finalTotalEl.textContent = `Final Total after ${score}% Discount: $${finalTotal.toFixed(2)}`;

    // Optionally, disable the discount button after use
    document.getElementById('claimDiscount').disabled = true; // Ensure you have an ID for your discount button
}

document.getElementById('placeOrder').addEventListener('click', function() {
    const name = document.getElementById('fname').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();

    if (!name || !email || !address) {
        alert("Please fill in all required fields: Name, Email, and Address");
        event.preventDefault();
        return;
    }

    // Determine if a discount was applied by checking if the discount button is disabled
    const discountApplied = document.getElementById('claimDiscount').disabled;
    showOrderSummary(name, discountApplied);
});


function showOrderSummary(customerName, discountApplied=false){
    let summary = `Dear ${customerName}, you have ordered `;
    let totalCost = 0;
    const score = parseInt(localStorage.getItem('quizScore'), 10) || 0;
    const DISCOUNT_RATE = score / 100; // Convert score to a percentage (e.g., 3 becomes 0.03)


    cart.forEach((item,index)=> {
        const subtotal = item.price*item.quantity;
        totalCost += subtotal;
        summary += `${item.quantity} ${item.name} at a cost of $${(item.price*item.quantity).toFixed(2)}`;
        if (index === cart.length-2){
            summary += " and ";
        }
        else if (index<cart.length-1){
            summary +=", ";
        }
    });
    if (discountApplied){
        let discountAmount = totalCost*DISCOUNT_RATE;
        totalCost -= discountAmount; //Apply discount
        summary += `. A discount has been applied. Your total bill is $${totalCost.toFixed(2)}`;

    }
    else {
        summary +=`. Your total bill is $${totalCost.toFixed(2)}.`;
    }
    alert(summary);
    clearCart();

}

