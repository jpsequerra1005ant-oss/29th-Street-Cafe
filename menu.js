document.addEventListener('DOMContentLoaded', () => {
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
    
    const flavorSelect = document.getElementById('modalFlavorSelect');
    const sizeSelect = document.getElementById('modalSizeSelect');
    const tempGroup = document.getElementById('modalTempGroup');
    const tempSelect = document.getElementById('modalTempSelect');
    const addonCheckboxes = document.querySelectorAll('#modalAddonsGroup input[type="checkbox"]');

    let currentItemTitle = "";
    let currentBasePrice = 0;
    let currentUpsizePrice = 0;

    // Real-time price updater for Size, (+₱10) Flavors, and Add-ons
    function updateModalPrice() {
        const size = sizeSelect.value;
        const flavor = flavorSelect.value;
        let displayPrice = size === "Large" ? currentUpsizePrice : currentBasePrice;
        
        // Add flavor price bump if any
        if (flavor && flavor.includes('(+₱10)')) {
            displayPrice += 10;
        }

        // Add checked add-ons to total price
        addonCheckboxes.forEach(cb => {
            if(cb.checked) {
                displayPrice += parseInt(cb.getAttribute('data-price'));
            }
        });

        document.getElementById('modalPrice').textContent = `₱${displayPrice}.00`;
    }

    if(modal) {
        sizeSelect.addEventListener('change', updateModalPrice);
        flavorSelect.addEventListener('change', updateModalPrice);
        addonCheckboxes.forEach(cb => cb.addEventListener('change', updateModalPrice));

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
                document.getElementById('modalImage').src = imgSrc;

                // Show/Hide Temperature Selector only for Latte and Americano
                if (currentItemTitle.includes("Latte") || currentItemTitle.includes("Americano")) {
                    tempGroup.style.display = "flex";
                } else {
                    tempGroup.style.display = "none";
                }

                // Reset Selects and Checkboxes
                flavorSelect.innerHTML = ''; 
                sizeSelect.value = "Regular";
                tempSelect.value = "Iced";
                addonCheckboxes.forEach(cb => cb.checked = false);
                
                // Populate flavors
                if(menuFlavors[currentItemTitle]) {
                    menuFlavors[currentItemTitle].forEach(flavor => {
                        const option = document.createElement('option');
                        option.value = flavor; option.textContent = flavor;
                        flavorSelect.appendChild(option);
                    });
                }
                
                updateModalPrice();
                modal.classList.add('show');
            });
        });

        addToCartBtn.addEventListener('click', () => {
            const selectedFlavor = flavorSelect.value;
            const selectedSize = sizeSelect.value;
            
            // Only save temperature if the dropdown was visible
            const selectedTemp = (tempGroup.style.display !== "none") ? tempSelect.value : null;

            // Collect selected add-ons
            let addOnsList = [];
            addonCheckboxes.forEach(cb => {
                if(cb.checked) addOnsList.push(cb.value);
            });

            // Calculate exact price to push to cart
            let finalPrice = selectedSize === "Large" ? currentUpsizePrice : currentBasePrice;
            if(selectedFlavor && selectedFlavor.includes('(+₱10)')) finalPrice += 10;
            addonCheckboxes.forEach(cb => {
                if(cb.checked) finalPrice += parseInt(cb.getAttribute('data-price'));
            });

            const cartItem = { 
                title: currentItemTitle, 
                flavor: selectedFlavor, 
                size: selectedSize, 
                temperature: selectedTemp,
                addOns: addOnsList,
                price: finalPrice, 
                quantity: 1 
            };

            let cart = JSON.parse(localStorage.getItem('cafeCart')) || [];
            
            // Check if exact same item (including all addons and temp) exists to stack quantities
            const existingItemIndex = cart.findIndex(item => {
                const sameAddons = JSON.stringify(item.addOns) === JSON.stringify(cartItem.addOns);
                return item.title === cartItem.title && 
                       item.flavor === cartItem.flavor && 
                       item.size === cartItem.size && 
                       item.temperature === cartItem.temperature &&
                       sameAddons;
            });

            if(existingItemIndex > -1) {
                cart[existingItemIndex].quantity += 1;
            } else {
                cart.push(cartItem);
            }

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