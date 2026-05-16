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

    const inquiryForm = document.getElementById('inquiryForm');
    const successNotice = document.getElementById('inquirySuccess');
    const fNameInput = document.getElementById('inqFirstName');
    const lNameInput = document.getElementById('inqLastName');
    const phoneInput = document.getElementById('inqPhone');

    if (inquiryForm) {
        const filterNameInput = (e) => { e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, ''); };
        fNameInput.addEventListener('input', filterNameInput);
        lNameInput.addEventListener('input', filterNameInput);

        phoneInput.addEventListener('input', (e) => { e.target.value = e.target.value.replace(/[^0-9]/g, ''); });

        inquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const firstName = fNameInput.value.trim();
            successNotice.style.display = 'block';
            successNotice.innerHTML = `Thank you, ${firstName}! Your inquiry has been sent to 29th Street Cafe. We will get back to you shortly at the provided email.`;
            inquiryForm.reset();
            setTimeout(() => { successNotice.style.display = 'none'; }, 6000);
        });
    }
});