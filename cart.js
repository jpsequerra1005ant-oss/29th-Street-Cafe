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

            // Updated HTML using an <input> tag instead of a <span>
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
                        <input type="text" inputmode="numeric" class="qty-input" data-index="${index}" value="${item.quantity}" maxlength="2">
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
        const qtyInputs = document.querySelectorAll('.qty-input');

        // Minus Button Logic
        minusBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                } else {
                    cart.splice(index, 1);
                }
                saveCart();
            });
        });

        // Plus Button Logic (Capped at 50)
        plusBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                if (cart[index].quantity < 50) {
                    cart[index].quantity += 1;
                    saveCart();
                }
            });
        });

        // Manual Input Logic (Numbers only, Max 50)
        qtyInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                // Strip out any character that isn't a number
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                
                // Immediately force it to 50 if they type something higher
                if (e.target.value !== '') {
                    let val = parseInt(e.target.value);
                    if (val > 50) {
                        e.target.value = 50;
                    }
                }
            });

            // Save the cart when they click away or press enter
            input.addEventListener('change', (e) => {
                const index = e.target.getAttribute('data-index');
                let val = parseInt(e.target.value);
                
                // If they clear the box or type 0, default back to 1
                if (isNaN(val) || val < 1) {
                    val = 1;
                }
                
                cart[index].quantity = val;
                saveCart();
            });
        });
    }
    
    renderCart();
});