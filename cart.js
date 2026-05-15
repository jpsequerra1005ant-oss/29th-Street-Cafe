document.addEventListener('DOMContentLoaded', () => {
    // Scroll to Top Logic
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) scrollToTopBtn.classList.add('show');
            else scrollToTopBtn.classList.remove('show');
        });
        scrollToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartSubtotalEl = document.getElementById('cartSubtotal');
    const cartTotalEl = document.getElementById('cartTotal');

    let cart = JSON.parse(localStorage.getItem('cafeCart')) || [];

    function formatCurrency(amount) {
        return `₱${amount.toFixed(2)}`;
    }

    function saveCart() {
        localStorage.setItem('cafeCart', JSON.stringify(cart));
        renderCart();
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

            const cartItemHTML = `
                <div class="cart-item-card">
                    <div class="cart-item-details">
                        <h4>${item.title}</h4>
                        <p>${item.flavor} (${item.size})</p>
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