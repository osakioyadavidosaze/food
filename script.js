let cart = [];
let cartTotal = 0;

// Smooth scrolling with animation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = this.getAttribute('href');
        if (target !== '#') {
            document.querySelector(target).scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Interactive preview update
function updatePreview(input) {
    const product = input.dataset.product;
    const price = parseInt(input.dataset.price);
    const quantity = parseInt(input.value);
    const finalPrice = quantity >= 5 ? (price - 300) : price;
    const total = quantity * finalPrice;
    
    const card = input.closest('.product-card');
    const totalElement = card.querySelector('.item-total');
    totalElement.textContent = `Subtotal: ₦${total.toLocaleString()}`;
    
    // Add visual feedback
    totalElement.style.color = quantity >= 5 ? '#28a745' : '#8B4513';
    if (quantity >= 5) {
        totalElement.innerHTML += ' <small>(Bulk discount applied!)</small>';
    }
}

// Shopping cart functions with animations
function addToCart(product, price) {
    const qtyInput = document.querySelector(`input[data-product="${product}"]`);
    const quantity = parseInt(qtyInput.value);
    
    // Apply bulk discount
    const finalPrice = quantity >= 5 ? (price - 300) : price;
    
    const existingItem = cart.find(item => item.product === product);
    if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.total = existingItem.quantity * finalPrice;
    } else {
        cart.push({ product, price: finalPrice, quantity, total: quantity * finalPrice });
    }
    
    // Visual feedback
    const button = event.target;
    button.textContent = 'Added! ✓';
    button.style.background = '#28a745';
    setTimeout(() => {
        button.textContent = 'Add to Cart';
        button.style.background = '#28a745';
    }, 1000);
    
    updateCartDisplay();
    qtyInput.value = 1;
    updatePreview(qtyInput);
}

function updateCartDisplay() {
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = itemCount;
    cartTotal = cart.reduce((sum, item) => sum + item.total, 0);
    
    // Animate cart count
    const cartCountEl = document.getElementById('cart-count');
    cartCountEl.style.transform = 'scale(1.5)';
    cartCountEl.style.color = '#ff4444';
    setTimeout(() => {
        cartCountEl.style.transform = 'scale(1)';
        cartCountEl.style.color = 'white';
    }, 300);
    
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span>${item.product} x${item.quantity}kg</span>
            <span>₦${item.total.toLocaleString()}</span>
            <button onclick="removeFromCart('${item.product}')" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 3px;">Remove</button>
        </div>
    `).join('');
    
    document.getElementById('cart-total').textContent = `Total: ₦${cartTotal.toLocaleString()}`;
}

function removeFromCart(product) {
    cart = cart.filter(item => item.product !== product);
    updateCartDisplay();
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    toggleCart();
    document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
}

// WhatsApp integration with Nigerian formatting
function openWhatsApp() {
    const message = cart.length > 0 
        ? `Hi Synergy Food! I want to order:\n${cart.map(item => `${item.product} x${item.quantity}kg - ₦${item.total.toLocaleString()}`).join('\n')}\n\nTotal: ₦${cartTotal.toLocaleString()}\n\nPlease confirm availability and delivery time.`
        : 'Hi Synergy Food! I want to place an order. Please send me your current prices and availability.';
    
    const whatsappUrl = `https://wa.me/2348123456789?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Interactive price calculator
document.getElementById('calc-product').addEventListener('change', calculatePrice);
document.getElementById('calc-qty').addEventListener('input', calculatePrice);

function calculatePrice() {
    const price = parseInt(document.getElementById('calc-product').value);
    const qty = parseInt(document.getElementById('calc-qty').value) || 1;
    const finalPrice = qty >= 5 ? (price - 300) : price;
    const total = qty * finalPrice;
    
    document.getElementById('calc-result').innerHTML = `
        <div style="font-size: 1.5rem; color: #8B4513;">Total: ₦${total.toLocaleString()}</div>
        ${qty >= 5 ? '<div style="color: #28a745; font-weight: bold;">🎉 Bulk discount applied! You saved ₦' + (300 * qty).toLocaleString() + '</div>' : ''}
        <div style="font-size: 0.9rem; color: #666; margin-top: 10px;">Price per kg: ₦${finalPrice.toLocaleString()}</div>
    `;
    
    // Animate result
    const resultEl = document.getElementById('calc-result');
    resultEl.style.transform = 'scale(1.05)';
    setTimeout(() => {
        resultEl.style.transform = 'scale(1)';
    }, 200);
}

// Order form handling
document.getElementById('order-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = this.querySelector('input[placeholder="Your Name"]').value;
    const phone = this.querySelector('input[placeholder="Phone Number"]').value;
    const address = this.querySelector('input[placeholder="Address"]').value;
    const zone = document.getElementById('delivery-zone').value;
    const payment = document.getElementById('payment-method').value;
    
    const orderSummary = cart.length > 0 
        ? cart.map(item => `${item.product} x${item.quantity}kg`).join(', ')
        : 'Custom order';
    
    // Create order confirmation with Nigerian styling
    const orderNumber = 'SYN' + Date.now().toString().slice(-6);
    
    alert(`🎉 Order Confirmed!\n\nOrder #: ${orderNumber}\nName: ${name}\nItems: ${orderSummary}\nDelivery: ${zone}\nPayment: ${payment}\nTotal: ₦${cartTotal.toLocaleString()}\n\n📞 We'll call you at ${phone} within 30 minutes to confirm delivery time.\n\n🚚 Expected delivery: 2-4 hours\n\nThank you for choosing Synergy Food! 🍠`);
    
    cart = [];
    updateCartDisplay();
    this.reset();
});

// Initialize with animations
calculatePrice();

// Add loading animation on page load
window.addEventListener('load', () => {
    document.querySelectorAll('.product-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Initialize preview for all products
document.querySelectorAll('.qty-input').forEach(input => {
    updatePreview(input);
});