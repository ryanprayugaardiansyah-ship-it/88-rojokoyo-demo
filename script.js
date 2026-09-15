const loginForm = document.querySelector('#loginForm');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const togglePassword = document.querySelector('.toggle-password');
const toast = document.querySelector('#toast');
const toastMessage = document.querySelector('#toastMessage');

function setError(input, message) {
  document.querySelector(`#${input.id}Error`).textContent = message;
  input.classList.toggle('is-invalid', Boolean(message));
}

function showToast(message) {
  if (!toast || !toastMessage) return;
  toastMessage.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(window.toastTimer);
  window.toastTimer = window.setTimeout(() => toast.classList.remove('show'), 3500);
}

if (togglePassword) togglePassword.addEventListener('click', () => {
  const isVisible = passwordInput.type === 'text';
  passwordInput.type = isVisible ? 'password' : 'text';
  togglePassword.classList.toggle('is-visible', !isVisible);
  togglePassword.setAttribute('aria-label', isVisible ? 'Tampilkan kata sandi' : 'Sembunyikan kata sandi');
  togglePassword.setAttribute('aria-pressed', String(!isVisible));
});

 [emailInput, passwordInput].filter(Boolean).forEach((input) => {
  input.addEventListener('input', () => setError(input, ''));
});

document.querySelector('#forgotPassword')?.addEventListener('click', (event) => {
  event.preventDefault();
  showToast('Silakan hubungi administrator untuk mereset kata sandi.');
});

document.querySelector('#fillDemo')?.addEventListener('click', () => {
  emailInput.value = 'admin@88rojokoyo.com';
  passwordInput.value = 'Admin88!';
  setError(emailInput, '');
  setError(passwordInput, '');
  passwordInput.focus();
});

loginForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  let isValid = true;

  if (!emailInput.value.trim()) {
    setError(emailInput, 'Email atau username wajib diisi.');
    isValid = false;
  }

  if (!passwordInput.value) {
    setError(passwordInput, 'Kata sandi wajib diisi.');
    isValid = false;
  }

  if (!isValid) return;

  const isDemoAccount = emailInput.value.trim().toLowerCase() === 'admin@88rojokoyo.com' && passwordInput.value === 'Admin88!';
  if (!isDemoAccount) {
    setError(passwordInput, 'Gunakan akun demo yang tersedia di bawah form.');
    return;
  }

  window.location.href = 'dashboard.html';
});

const sidebar = document.querySelector('#sidebar');
const sidebarOverlay = document.querySelector('#sidebarOverlay');
const sidebarToggle = document.querySelector('#sidebarToggle');

function closeSidebar() {
  sidebar?.classList.remove('is-open');
  sidebarOverlay?.classList.remove('is-visible');
}

sidebarToggle?.addEventListener('click', () => {
  sidebar?.classList.toggle('is-open');
  sidebarOverlay?.classList.toggle('is-visible');
});

sidebarOverlay?.addEventListener('click', closeSidebar);

const productCatalog = {
  banner: { name: 'Banner Flexi', price: 150000 },
  undangan: { name: 'Undangan Custom', price: 2500 },
  stiker: { name: 'Stiker Vinyl', price: 8000 },
  sablon: { name: 'Sablon Kaos', price: 35000 },
  kartu: { name: 'Kartu Nama', price: 50000 },
  fotokopi: { name: 'Fotokopi Warna', price: 1500 },
};

const posElements = {
  items: document.querySelector('#cartItems'),
  count: document.querySelector('#cartCount'),
  subtotal: document.querySelector('#subtotal'),
  discount: document.querySelector('#discount'),
  discountLabel: document.querySelector('#discountLabel'),
  total: document.querySelector('#total'),
  note: document.querySelector('#discountNote'),
};

if (posElements.items) {
  const members = [
    { name: 'Nabila Aulia', number: 'MBR-0001' },
    { name: 'Budi Santoso', number: 'MBR-0002' },
    { name: 'Rina Wulandari', number: 'MBR-0003' },
    { name: 'Dimas Pratama', number: 'MBR-0004' },
    { name: 'Siti Rahma', number: 'MBR-0005' },
    { name: 'Andi Kurniawan', number: 'MBR-0006' },
    { name: 'Maya Putri', number: 'MBR-0007' },
    { name: 'Fajar Nugroho', number: 'MBR-0008' },
    { name: 'Dewi Lestari', number: 'MBR-0009' },
    { name: 'Rizky Maulana', number: 'MBR-0010' },
  ];
  const cart = [
    { id: 'banner', quantity: 1 },
    { id: 'undangan', quantity: 50 },
  ];
  let customerType = 'member';
  let paymentMethod = 'Tunai';
  let selectedMember = members[0];
  const formatCurrency = (value) => `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;

  function initials(name) {
    return name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  }

  function getDiscountRate() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (customerType === 'member') return totalItems >= 50 ? 0.15 : 0.1;
    return totalItems >= 50 ? 0.05 : 0;
  }

  function renderCart() {
    const subtotal = cart.reduce((sum, item) => sum + productCatalog[item.id].price * item.quantity, 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const discountRate = getDiscountRate();
    const discount = Math.round(subtotal * discountRate);
    const total = subtotal - discount;
    posElements.count.textContent = cart.length;
    posElements.items.innerHTML = cart.length ? cart.map((item) => {
      const product = productCatalog[item.id];
      return `<article class="cart-item"><div><span class="cart-item__name">${product.name}</span><span class="cart-item__price">${formatCurrency(product.price)} / item</span></div><b class="cart-item__total">${formatCurrency(product.price * item.quantity)}</b><div class="quantity-control"><label for="qty-${item.id}">Qty</label><input class="quantity-input" id="qty-${item.id}" type="number" min="1" step="1" value="${item.quantity}" data-quantity-id="${item.id}" inputmode="numeric" aria-label="Jumlah ${product.name}" /><button class="remove-item" type="button" data-action="remove" data-id="${item.id}" aria-label="Hapus produk">×</button></div></article>`;
    }).join('') : '<div class="empty-cart">Belum ada produk dalam transaksi.</div>';
    posElements.subtotal.textContent = formatCurrency(subtotal);
    posElements.discount.textContent = discount ? `- ${formatCurrency(discount)}` : '- Rp 0';
    posElements.total.textContent = formatCurrency(total);
    const label = customerType === 'member' ? `Member ${discountRate * 100}%` : discountRate ? 'Diskon 50+ 5%' : 'Tidak ada';
    posElements.discountLabel.textContent = label;
    posElements.note.classList.toggle('is-visible', discountRate > 0);
    posElements.note.querySelector('span').textContent = customerType === 'member'
      ? totalItems >= 50 ? 'Diskon member 15% aktif untuk pesanan 50+ item.' : 'Diskon member 10% aktif untuk transaksi ini.'
      : 'Diskon pembelian jumlah 50+ item aktif sebesar 5%.';
    document.querySelector('#checkoutButton').disabled = !cart.length;
    updateCashPayment(total);
    return { totalItems, discount, total };
  }

  function updateCashPayment(total) {
    const paidInput = document.querySelector('#cashPaid');
    if (!paidInput) return;
    const paid = Number(paidInput.value) || 0;
    const difference = paid - total;
    const row = document.querySelector('#changeRow');
    row.classList.toggle('is-short', difference < 0);
    row.querySelector('span').textContent = difference < 0 ? 'Kekurangan pembayaran' : 'Kembalian';
    document.querySelector('#changeAmount').textContent = difference < 0 ? `- ${formatCurrency(Math.abs(difference))}` : formatCurrency(difference);
  }

  function renderMemberResults(term = '') {
    const results = members.filter((member) => `${member.name} ${member.number}`.toLowerCase().includes(term.toLowerCase())).slice(0, 5);
    document.querySelector('#memberResults').innerHTML = results.length ? results.map((member) => `<button class="member-result" type="button" data-member="${member.number}"><span class="member-result__avatar">${initials(member.name)}</span><span><strong>${member.name}</strong><span>${member.number}</span></span></button>`).join('') : '<p class="member-empty">Member tidak ditemukan.</p>';
  }

  document.querySelector('#productGrid')?.addEventListener('click', (event) => {
    const card = event.target.closest('.product-card');
    if (!card) return;
    const existing = cart.find((item) => item.id === card.dataset.id);
    if (existing) existing.quantity += 1;
    else cart.push({ id: card.dataset.id, quantity: 1 });
    renderCart();
  });

  posElements.items.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const itemIndex = cart.findIndex((item) => item.id === button.dataset.id);
    if (itemIndex < 0) return;
    if (button.dataset.action === 'remove') cart.splice(itemIndex, 1);
    renderCart();
  });

  posElements.items.addEventListener('change', (event) => {
    const input = event.target.closest('[data-quantity-id]');
    if (!input) return;
    const item = cart.find((cartItem) => cartItem.id === input.dataset.quantityId);
    if (!item) return;
    item.quantity = Math.max(1, Math.floor(Number(input.value) || 1));
    renderCart();
  });

  document.querySelector('#customerSelector')?.addEventListener('click', (event) => {
    const option = event.target.closest('[data-customer]');
    if (!option) return;
    customerType = option.dataset.customer;
    document.querySelectorAll('[data-customer]').forEach((button) => button.classList.toggle('is-selected', button === option));
    const picker = document.querySelector('#memberPicker');
    picker.classList.toggle('is-open', customerType === 'member');
    if (customerType === 'member') {
      renderMemberResults();
      document.querySelector('#memberSearch').focus();
    }
    renderCart();
  });

  document.querySelector('#memberSearch')?.addEventListener('input', (event) => renderMemberResults(event.target.value));

  document.querySelector('#memberResults')?.addEventListener('click', (event) => {
    const choice = event.target.closest('[data-member]');
    if (!choice) return;
    selectedMember = members.find((member) => member.number === choice.dataset.member);
    document.querySelector('#selectedMemberName').textContent = selectedMember.name;
    document.querySelector('#selectedMemberInitial').textContent = initials(selectedMember.name);
    document.querySelector('#memberPicker').classList.remove('is-open');
    document.querySelector('#memberSearch').value = '';
  });

  document.querySelector('#paymentOptions')?.addEventListener('click', (event) => {
    const option = event.target.closest('[data-payment]');
    if (!option) return;
    paymentMethod = option.dataset.payment;
    document.querySelectorAll('[data-payment]').forEach((button) => button.classList.toggle('is-selected', button === option));
    document.querySelector('#cashPayment').classList.toggle('is-visible', paymentMethod === 'Tunai');
  });

  document.querySelector('#cashPaid')?.addEventListener('input', () => {
    const subtotal = cart.reduce((sum, item) => sum + productCatalog[item.id].price * item.quantity, 0);
    updateCashPayment(subtotal - Math.round(subtotal * getDiscountRate()));
  });

  document.querySelector('#productSearch')?.addEventListener('input', (event) => {
    const term = event.target.value.toLowerCase();
    document.querySelectorAll('.product-card').forEach((card) => card.classList.toggle('is-hidden', !card.textContent.toLowerCase().includes(term)));
  });

  document.querySelector('#categoryFilters')?.addEventListener('click', (event) => {
    const filter = event.target.closest('[data-category]');
    if (!filter) return;
    document.querySelectorAll('#categoryFilters button').forEach((button) => button.classList.toggle('is-active', button === filter));
    document.querySelectorAll('.product-card').forEach((card) => card.classList.toggle('is-hidden', filter.dataset.category !== 'all' && card.dataset.category !== filter.dataset.category));
    document.querySelector('#productSearch').value = '';
  });

  document.querySelector('#checkoutButton')?.addEventListener('click', () => {
    const summary = renderCart();
    document.querySelector('#receiptCustomer').textContent = customerType === 'member' ? `${selectedMember.name} (Member)` : 'Pelanggan Umum';
    document.querySelector('#receiptItems').textContent = `${summary.totalItems} item`;
    document.querySelector('#receiptPayment').textContent = paymentMethod;
    document.querySelector('#receiptDiscount').textContent = `- ${formatCurrency(summary.discount)}`;
    document.querySelector('#receiptTotal').textContent = formatCurrency(summary.total);
    document.querySelector('#receiptModal').classList.add('is-open');
  });

  document.querySelector('#closeReceipt')?.addEventListener('click', () => document.querySelector('#receiptModal').classList.remove('is-open'));
  document.querySelector('#printReceipt')?.addEventListener('click', () => window.print());
  renderCart();
}
