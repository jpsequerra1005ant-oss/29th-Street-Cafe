// --- Scroll to Top Logic ---
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    scrollToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// --- Inquiry Form Logic ---
const inquiryForm = document.getElementById('inquiryForm');
const successNotice = document.getElementById('inquirySuccess');

if (inquiryForm) {
    inquiryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const firstName = document.getElementById('inqFirstName').value;

        successNotice.style.display = 'block';
        successNotice.innerHTML = `Thank you, ${firstName}! Your inquiry has been sent to 29th Street Cafe. We will get back to you shortly.`;
        
        inquiryForm.reset();

        setTimeout(() => {
            successNotice.style.display = 'none';
        }, 5000);
    });
}