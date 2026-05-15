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

    const form = document.getElementById('foodOrderForm');

    if (form) {
        const orderTypeRadios = document.querySelectorAll('input[name="orderType"]');
        const addressSection = document.getElementById('addressSection');
        const streetInput = document.getElementById('streetInput');
        const citySelect = document.getElementById('citySelect');
        const brgySelect = document.getElementById('brgySelect');
        const zipCodeInput = document.getElementById('zipCode');

        const mealsContainer = document.getElementById('mealsContainer');
        const addMealBtn = document.getElementById('addMealBtn');
        const amountDueEl = document.getElementById('amountDue');
        const summaryBox = document.getElementById('summaryBox');

        const firstNameInput = document.querySelector('input[name="firstName"]');
        const lastNameInput = document.querySelector('input[name="lastName"]');

        firstNameInput.addEventListener('input', function(e) { this.value = this.value.replace(/[^a-zA-Z\s]/g, ''); });
        lastNameInput.addEventListener('input', function(e) { this.value = this.value.replace(/[^a-zA-Z\s]/g, ''); });

        const locations = {
          "Antipolo": { zip: "1870", barangays: ["Bagong Nayon", "Beverly Hills", "Calawis", "Cupang", "Dalig", "Dela Paz", "Inarawan", "Mambugan", "Mayamot", "Muntindilaw", "San Isidro", "San Jose", "San Juan", "San Luis", "San Roque", "Santa Cruz"] },
          "Cainta": { zip: "1900", barangays: ["San Andres", "San Isidro", "San Juan", "San Roque", "Santa Rosa", "Santo Domingo", "Santo Niño"] },
          "Marikina": { zip: "1800", barangays: ["Barangka", "Calumpang", "Concepcion Uno", "Concepcion Dos", "Fortune", "Industrial Valley", "Jesus Dela Peña", "Malanday", "Marikina Heights", "Nangka", "Parang", "San Roque", "Santa Elena", "Santo Niño", "Tañong", "Tumana"] },
          "Pasig": { zip: "1600", barangays: ["Bagong Ilog", "Bambang", "Buting", "Caniogan", "Dela Paz", "Kalawaan", "Kapasigan", "Kapitolyo", "Manggahan", "Maybunga", "Oranbo", "Ortigas Center", "Palatiw", "Pinagbuhatan", "Pineda", "Rosario", "San Antonio", "San Joaquin", "San Miguel", "San Nicolas", "Santa Cruz", "Santa Lucia", "Santa Rosa", "Santo Tomas", "Santolan", "Sumilang", "Ugong"] }
        };

        const menuData = {
          signature: { label: 'Signature - Strawberry Black Tea', basePrice: 59, upsizePrice: 69, flavors: ['Tea based strawberry juice'] },
          latte: { label: 'Latte Series', basePrice: 49, upsizePrice: 59, flavors: ['Caramel Macchiato', 'Hazelnut Brew', 'Vanilla Blanca', 'Salted Caramel', 'Chocolate', 'Pure Matcha', 'Strawberry Matcha', 'Caramel Matcha'] },
          americano: { label: 'Americano Series', basePrice: 49, upsizePrice: 59, flavors: ['Original', 'Caramel Macchiato', 'Hazelnut Brew', 'Vanilla Blanca', 'White Cappuccino', 'Salted Caramel'] },
          frappe: { label: 'Frappe Series', basePrice: 69, upsizePrice: 79, flavors: ['Chocolate', 'Java Chip', 'Cookies & Cream', 'Cheesecake', 'Vanilla Coffee', 'Mango Cheesecake', 'Purple Taro', 'Strawberry (+₱10)', 'Green Matcha (+₱10)', 'Dark Chocolate (+₱10)'] },
          milktea: { label: 'Milktea Series', basePrice: 49, upsizePrice: 59, flavors: ['Original', 'Wintermelon', 'Okinawa', 'Hokkaido', 'Cookies & Cream', 'Chocolate', 'Purple Taro', 'Brown Sugar', 'Mango Cheesecake', 'Strawberry', 'Green Matcha', 'Dark Chocolate'] },
          fruitSoda: { label: 'Fruit & Soda Series', basePrice: 49, upsizePrice: 59, flavors: ['Kiwi', 'Blueberry', 'Green Apple', 'Lychee', 'Passion Fruit', 'Strawberry', 'Mango'] }
        };

        function formatCurrency(value) { return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 2, }).format(value); }

        function toggleAddressVisibility() {
          const isDelivery = document.querySelector('input[name="orderType"]:checked').value === 'Delivery';
          if (isDelivery) {
            addressSection.style.display = 'block';
            streetInput.required = true; citySelect.required = true;
            if (citySelect.value) brgySelect.required = true;
          } else {
            addressSection.style.display = 'none';
            streetInput.required = false; citySelect.required = false; brgySelect.required = false;
          }
        }
        orderTypeRadios.forEach(radio => radio.addEventListener('change', toggleAddressVisibility));

        citySelect.addEventListener('change', (e) => {
          const city = e.target.value; const data = locations[city];
          if (data) {
            brgySelect.innerHTML = `<option value="" disabled selected>Select Barangay</option>` + data.barangays.map(b => `<option value="${b}">${b}</option>`).join('');
            brgySelect.disabled = false; zipCodeInput.value = data.zip;
            if (document.querySelector('input[name="orderType"]:checked').value === 'Delivery') brgySelect.required = true;
          }
        });

        function createMealCard() {
          const seriesOptions = `<option value="" disabled selected>Select Category</option>` + Object.entries(menuData).map(([key, item]) => `<option value="${key}">${item.label}</option>`).join('');
          const flavorOptions = `<option value="" disabled selected>Select Flavor</option>`;

          const cardHTML = `
            <div class="order-card">
              <div class="order-head">
                <span class="item-title">Item</span><button type="button" class="remove-btn">Remove</button>
              </div>
              <div class="meal-grid">
                <div class="field"><label>Menu Category</label><select class="input select series-select" required>${seriesOptions}</select></div>
                <div class="field"><label>Flavor / Variant</label><select class="input select flavor-select" required>${flavorOptions}</select></div>
                <div class="field"><label>Size</label><select class="input select size-select"><option value="base">Regular</option><option value="upsize">Large</option></select></div>
                <div class="addon-wrap" style="display: none;"><label class="radio-item"><input type="checkbox" class="soda-addon" /> Make it a Soda (+₱10)</label></div>
              </div>
            </div>`;
          mealsContainer.insertAdjacentHTML('beforeend', cardHTML);
          bindEventsAndCalculate();
        }

        function renumberItems() {
          const cards = mealsContainer.querySelectorAll('.order-card');
          cards.forEach((card, index) => {
            card.querySelector('.item-title').textContent = `Drink Item ${index + 1}`;
            card.querySelector('.remove-btn').disabled = cards.length === 1;
          });
        }

        function bindEventsAndCalculate() {
          renumberItems(); let totalDue = 0;
          mealsContainer.querySelectorAll('.order-card').forEach(card => {
            const seriesSelect = card.querySelector('.series-select');
            const flavorSelect = card.querySelector('.flavor-select');
            const sizeSelect = card.querySelector('.size-select');
            const addonWrap = card.querySelector('.addon-wrap');
            const sodaCheckbox = card.querySelector('.soda-addon');
            const removeBtn = card.querySelector('.remove-btn');

            let cardPrice = 0; const seriesKey = seriesSelect.value;
            if (seriesKey) {
              if (seriesKey === 'fruitSoda') addonWrap.style.display = 'block';
              else { addonWrap.style.display = 'none'; sodaCheckbox.checked = false; }
              const itemData = menuData[seriesKey];
              cardPrice = sizeSelect.value === 'upsize' ? itemData.upsizePrice : itemData.basePrice;
              if (flavorSelect.value && flavorSelect.value.includes('+₱10')) cardPrice += 10;
            } else { addonWrap.style.display = 'none'; sodaCheckbox.checked = false; }
            if (sodaCheckbox.checked) cardPrice += 10;
            
            totalDue += cardPrice;

            removeBtn.onclick = () => { if (!removeBtn.disabled) { card.remove(); bindEventsAndCalculate(); } };
            seriesSelect.onchange = () => {
              if (seriesSelect.value) flavorSelect.innerHTML = `<option value="" disabled selected>Select Flavor</option>` + menuData[seriesSelect.value].flavors.map(flavor => `<option value="${flavor}">${flavor}</option>`).join('');
              bindEventsAndCalculate(); 
            };
            flavorSelect.onchange = bindEventsAndCalculate; sizeSelect.onchange = bindEventsAndCalculate; sodaCheckbox.onchange = bindEventsAndCalculate;
          });
          amountDueEl.textContent = formatCurrency(totalDue);
        }

        addMealBtn.addEventListener('click', createMealCard);

        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const orderType = document.querySelector('input[name="orderType"]:checked').value;
          const paymentType = document.querySelector('input[name="paymentType"]:checked').value;
          let addressText = orderType === 'Delivery' ? `${streetInput.value}, Brgy. ${brgySelect.value}, ${citySelect.value} (${zipCodeInput.value})` : 'N/A (Pick-Up)';

          let summaryHTML = `
            <h3 style="margin-bottom:12px; font-size:16px; color: var(--espresso-brown);">Order Summary</h3>
            <div style="font-size: 14px; margin-bottom: 16px; line-height: 1.6;">
              <strong>Customer:</strong> ${form.firstName.value} ${form.lastName.value} <br>
              <strong>Phone:</strong> +63 ${form.phone.value} <br><strong>Email:</strong> ${form.email.value} <br>
              <strong>Type:</strong> ${orderType} <br><strong>Address:</strong> ${addressText} <br>
              <strong>Payment Method:</strong> ${paymentType}
            </div><ul style="margin-left: 20px; font-size: 14px; margin-bottom: 16px;">`;

          mealsContainer.querySelectorAll('.order-card').forEach(card => {
             const seriesSelect = card.querySelector('.series-select'); const flavorSelect = card.querySelector('.flavor-select');
             const seriesName = seriesSelect.value ? seriesSelect.options[seriesSelect.selectedIndex].text : 'Unselected Category';
             let itemDesc = `${seriesName} (${card.querySelector('.size-select').options[card.querySelector('.size-select').selectedIndex].text}) - ${flavorSelect.value || 'Unselected Flavor'}`;
             if (card.querySelector('.soda-addon').checked) itemDesc += ` <strong>[+ Soda]</strong>`;
             summaryHTML += `<li style="margin-bottom: 6px;">${itemDesc}</li>`;
          });

          summaryHTML += `</ul><div style="border-top: 1px dashed var(--cappuccino-beige); padding-top: 12px; font-size: 16px; color: var(--espresso-brown);">
              <strong>Total Amount Due: ${amountDueEl.textContent}</strong></div>`;
          
          summaryBox.style.display = 'block'; summaryBox.innerHTML = summaryHTML; summaryBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });

        toggleAddressVisibility(); createMealCard();
    }
});