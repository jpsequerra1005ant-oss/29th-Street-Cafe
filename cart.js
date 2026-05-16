// --- NEW BADGE UPDATER FUNCTION ---
function updateCartBadges() {
    const badges = document.querySelectorAll('.cart-badge');
    if (badges.length === 0) return;

    let cart = JSON.parse(localStorage.getItem('cafeCart')) || [];
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    badges.forEach(badge => {
        if (totalItems > 0) {
            badge.textContent = totalItems;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Run badge check on page load
    updateCartBadges();

    // HAMBURGER MENU LOGIC
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => { mainNav.classList.toggle('active'); });
        const navLinks = mainNav.querySelectorAll('.nav-link');
        navLinks.forEach(link => { link.addEventListener('click', () => { mainNav.classList.remove('active'); }); });
    }

    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartSubtotalEl = document.getElementById('cartSubtotal');
    const cartTotalEl = document.getElementById('cartTotal');

    let cart = JSON.parse(localStorage.getItem('cafeCart')) || [];

    function formatCurrency(amount) { return `₱${amount.toFixed(2)}`; }

    function saveCart() {
        localStorage.setItem('cafeCart', JSON.stringify(cart));
        renderCart();
        
        // Trigger badge update here
        updateCartBadges();
    }

    function renderCart() {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is currently empty. Head to the menu to add some drinks!</div>';
            cartSubtotalEl.textContent = '₱0.00';
            cartTotalEl.textContent = '₱0.00';
            return;
        }

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            // Format the size and temp to go under the flavor
            let sizeTempLine = `${item.size}`;
            if (item.temperature) sizeTempLine += ` | ${item.temperature}`;
            
            let addonsHTML = "";
            if (item.addOns && item.addOns.length > 0) {
                addonsHTML = `<p style="font-size: 0.75rem; color: var(--chai-spice); margin-top:-2px;">+ ${item.addOns.join(', ')}</p>`;
            }

            const cartItemHTML = `
                <div class="cart-item-card">
                    <div class="cart-item-details">
                        <span style="font-size: 0.7rem; color: var(--mocha-brown); text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 2px;">${item.title}</span>
                        <h4>${item.flavor}</h4>
                        <p>${sizeTempLine}</p>
                        ${addonsHTML}
                        <span class="cart-item-price">${formatCurrency(item.price)}</span>
                    </div>
                    <div class="cart-item-qty">
                        <button class="qty-btn minus" data-index="${index}">-</button>
                        <span class="qty-count">${item.quantity}</span>
                        <button class="qty-btn plus" data-index="${index}">+</button>
                    </div>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
        });

        cartSubtotalEl.textContent = formatCurrency(total);
        cartTotalEl.textContent = formatCurrency(total);
        attachQtyListeners();
    }

    function attachQtyListeners() {
        const minusBtns = document.querySelectorAll('.qty-btn.minus');
        const plusBtns = document.querySelectorAll('.qty-btn.plus');

        minusBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                if (cart[index].quantity > 1) cart[index].quantity -= 1;
                else cart.splice(index, 1);
                saveCart();
            });
        });

        plusBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                cart[index].quantity += 1;
                saveCart();
            });
        });
    }
    renderCart();
});