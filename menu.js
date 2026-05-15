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

    const menuFlavors = {
        "Strawberry Black Tea": ['Tea based strawberry juice'],
        "Latte Series": ['Caramel Macchiato', 'Hazelnut Brew', 'Vanilla Blanca', 'Salted Caramel', 'Chocolate', 'Pure Matcha', 'Strawberry Matcha', 'Caramel Matcha'],
        "Americano Series": ['Original', 'Caramel Macchiato', 'Hazelnut Brew', 'Vanilla Blanca', 'White Cappuccino', 'Salted Caramel'],
        "Frappe Series": ['Chocolate', 'Java Chip', 'Cookies & Cream', 'Cheesecake', 'Vanilla Coffee', 'Mango Cheesecake', 'Purple Taro', 'Strawberry (+₱10)', 'Green Matcha (+₱10)', 'Dark Chocolate (+₱10)'],
        "Milktea Series": ['Original', 'Wintermelon', 'Okinawa', 'Hokkaido', 'Cookies & Cream', 'Chocolate', 'Purple Taro', 'Brown Sugar', 'Mango Cheesecake', 'Strawberry', 'Green Matcha', 'Dark Chocolate'],
        "Fruit & Soda Series": ['Kiwi', 'Blueberry', 'Green Apple', 'Lychee', 'Passion Fruit', 'Strawberry', 'Mango']
    };

    const modal = document.getElementById('menuModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const productCards = document.querySelectorAll('.product-card');
    const addToCartBtn = document.getElementById('addToCartBtn');
    const cartToast = document.getElementById('cartToast');

    let currentItemTitle = "";
    let currentBasePrice = 0;
    let currentUpsizePrice = 0;

    if(modal) {
        productCards.forEach(card => {
            card.addEventListener('click', () => {
                currentItemTitle = card.querySelector('.product-name').textContent;
                const category = card.querySelector('.product-category').textContent;
                const priceText = card.querySelector('.product-price').textContent;
                const imgSrc = card.querySelector('.product-image').src;

                const prices = priceText.replace('₱', '').split('/');
                currentBasePrice = parseInt(prices[0]);
                currentUpsizePrice = parseInt(prices[1]) || currentBasePrice;

                document.getElementById('modalTitle').textContent = currentItemTitle;
                document.getElementById('modalCategory').textContent = category;
                document.getElementById('modalPrice').textContent = `₱${currentBasePrice}.00`;
                document.getElementById('modalImage').src = imgSrc;

                const flavorSelect = document.getElementById('modalFlavorSelect');
                flavorSelect.innerHTML = ''; 
                
                if(menuFlavors[currentItemTitle]) {
                    menuFlavors[currentItemTitle].forEach(flavor => {
                        const option = document.createElement('option');
                        option.value = flavor; option.textContent = flavor;
                        flavorSelect.appendChild(option);
                    });
                }
                document.getElementById('modalSizeSelect').value = "Regular";
                modal.classList.add('show');
            });
        });

        document.getElementById('modalSizeSelect').addEventListener('change', (e) => {
            const size = e.target.value;
            const displayPrice = size === "Large" ? currentUpsizePrice : currentBasePrice;
            document.getElementById('modalPrice').textContent = `₱${displayPrice}.00`;
        });

        addToCartBtn.addEventListener('click', () => {
            const selectedFlavor = document.getElementById('modalFlavorSelect').value;
            const selectedSize = document.getElementById('modalSizeSelect').value;
            let finalPrice = selectedSize === "Large" ? currentUpsizePrice : currentBasePrice;
            
            if(selectedFlavor.includes('(+₱10)')) finalPrice += 10;

            const cartItem = { title: currentItemTitle, flavor: selectedFlavor, size: selectedSize, price: finalPrice, quantity: 1 };
            let cart = JSON.parse(localStorage.getItem('cafeCart')) || [];
            
            const existingItemIndex = cart.findIndex(item => item.title === cartItem.title && item.flavor === cartItem.flavor && item.size === cartItem.size);
            if(existingItemIndex > -1) cart[existingItemIndex].quantity += 1;
            else cart.push(cartItem);

            localStorage.setItem('cafeCart', JSON.stringify(cart));
            modal.classList.remove('show');
            showToast(`Added ${cartItem.title} to your cart!`);
        });

        function showToast(message) {
            cartToast.textContent = message;
            cartToast.classList.add('show');
            setTimeout(() => { cartToast.classList.remove('show'); }, 3000);
        }

        closeModalBtn.addEventListener('click', () => modal.classList.remove('show'));
        window.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('show'); });
    }
});