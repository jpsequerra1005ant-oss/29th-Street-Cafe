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
        "Latte Series": ['Caramel Macchiato', 'Hazelnut Brew', 'Vanilla Blanca', 'White Cappuccino', 'Salted Caramel', 'Chocolate', 'Pure Matcha', 'Strawberry Matcha', 'Caramel Matcha'],
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
    
    // UI Elements
    const flavorGroup = document.getElementById('modalFlavorGroup'); // Added this to control visibility
    const flavorSelect = document.getElementById('modalFlavorSelect');
    const sizeSelect = document.getElementById('modalSizeSelect');
    const tempGroup = document.getElementById('modalTempGroup');
    const tempSelect = document.getElementById('modalTempSelect');
    const addonCheckboxes = document.querySelectorAll('#modalAddonsGroup input[type="checkbox"]');
    const sodaAddonContainer = document.getElementById('sodaAddonContainer');
    const modalSodaAddon = document.getElementById('modalSodaAddon');

    let currentItemTitle = "";
    let currentBasePrice = 0;
    let currentUpsizePrice = 0;

    function updateModalPrice() {
        const size = sizeSelect.value;
        const flavor = flavorSelect.value;
        let displayPrice = size === "Large" ? currentUpsizePrice : currentBasePrice;
        
        if (flavor && flavor.includes('(+₱10)')) displayPrice += 10;
        addonCheckboxes.forEach(cb => { if(cb.checked) displayPrice += parseInt(cb.getAttribute('data-price')); });
        
        if (modalSodaAddon && modalSodaAddon.checked) {
            displayPrice += parseInt(modalSodaAddon.getAttribute('data-price'));
        }

        document.getElementById('modalPrice').textContent = `₱${displayPrice}.00`;
    }

    if(modal) {
        sizeSelect.addEventListener('change', updateModalPrice);
        flavorSelect.addEventListener('change', updateModalPrice);
        addonCheckboxes.forEach(cb => cb.addEventListener('change', updateModalPrice));
        
        if (modalSodaAddon) {
            modalSodaAddon.addEventListener('change', updateModalPrice);
        }

        productCards.forEach(card => {
            card.addEventListener('click', () => {
                currentItemTitle = card.querySelector('.product-name').textContent;
                const category = card.querySelector('.product-category').textContent;
                const priceText = card.querySelector('.product-price').textContent;
                const imgSrc = card.querySelector('.product-image').src;

                // FIXED: Using regex to find the numbers inside the new "Regular: ₱49 | Large: ₱59" format
                const parsedPrices = priceText.match(/\d+/g);
                currentBasePrice = parseInt(parsedPrices[0]);
                currentUpsizePrice = parsedPrices.length > 1 ? parseInt(parsedPrices[1]) : currentBasePrice;

                document.getElementById('modalTitle').textContent = currentItemTitle;
                document.getElementById('modalCategory').textContent = category;
                document.getElementById('modalImage').src = imgSrc;

                // --- NEW: Hide Flavor Dropdown for Signature Drink ---
                if (category.includes("Signature") || currentItemTitle.includes("Strawberry Black Tea")) {
                    if (flavorGroup) flavorGroup.style.display = "none";
                } else {
                    if (flavorGroup) flavorGroup.style.display = "block"; 
                }

                if (currentItemTitle.includes("Latte") || currentItemTitle.includes("Americano")) {
                    tempGroup.style.display = "flex";
                } else {
                    tempGroup.style.display = "none";
                }

                if (currentItemTitle.includes("Fruit & Soda")) {
                    sodaAddonContainer.style.display = "flex";
                } else {
                    sodaAddonContainer.style.display = "none";
                    if(modalSodaAddon) modalSodaAddon.checked = false;
                }

                flavorSelect.innerHTML = ''; 
                sizeSelect.value = "Regular";
                tempSelect.value = "Iced";
                addonCheckboxes.forEach(cb => cb.checked = false);
                
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
            // Only grab the flavor if the flavor group isn't hidden
            const isSignature = flavorGroup && flavorGroup.style.display === "none";
            const selectedFlavor = isSignature ? "Signature/Default" : flavorSelect.value;
            const selectedSize = sizeSelect.value;
            const selectedTemp = (tempGroup.style.display !== "none") ? tempSelect.value : null;

            let addOnsList = [];
            addonCheckboxes.forEach(cb => { if(cb.checked) addOnsList.push(cb.value); });
            
            if (modalSodaAddon && modalSodaAddon.checked) {
                addOnsList.push(modalSodaAddon.value);
            }

            let finalPrice = selectedSize === "Large" ? currentUpsizePrice : currentBasePrice;
            if(selectedFlavor && selectedFlavor.includes('(+₱10)')) finalPrice += 10;
            addonCheckboxes.forEach(cb => { if(cb.checked) finalPrice += parseInt(cb.getAttribute('data-price')); });
            
            if (modalSodaAddon && modalSodaAddon.checked) {
                finalPrice += parseInt(modalSodaAddon.getAttribute('data-price'));
            }

            const cartItem = { 
                title: currentItemTitle, flavor: selectedFlavor, size: selectedSize, 
                temperature: selectedTemp, addOns: addOnsList, price: finalPrice, quantity: 1 
            };

            let cart = JSON.parse(localStorage.getItem('cafeCart')) || [];
            
            const existingItemIndex = cart.findIndex(item => {
                const sameAddons = JSON.stringify(item.addOns) === JSON.stringify(cartItem.addOns);
                return item.title === cartItem.title && item.flavor === cartItem.flavor && 
                       item.size === cartItem.size && item.temperature === cartItem.temperature && sameAddons;
            });

            if(existingItemIndex > -1) { cart[existingItemIndex].quantity += 1; } 
            else { cart.push(cartItem); }

            localStorage.setItem('cafeCart', JSON.stringify(cart));
            
            // --- NEW: Trigger badge update here ---
            updateCartBadges();

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