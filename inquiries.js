document.addEventListener('DOMContentLoaded', () => {
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