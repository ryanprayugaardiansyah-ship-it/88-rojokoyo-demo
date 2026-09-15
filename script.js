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
  const cart = [
    { id: 'banner', quantity: 1 },
    { id: 'undangan', quantity: 50 },
  ];
  let customerType = 'member';
  let paymentMethod = 'Tunai';
  const formatCurrency = (value) => `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;

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
      return `<article class="cart-item"><div><span class="cart-item__name">${product.name}</span><span class="cart-item__price">${formatCurrency(product.price)} × ${item.quantity}</span></div><b class="cart-item__total">${formatCurrency(product.price * item.quantity)}</b><div class="quantity-control"><button type="button" data-action="decrease" data-id="${item.id}" aria-label="Kurangi jumlah">−</button><span>${item.quantity}</span><button type="button" data-action="increase" data-id="${item.id}" aria-label="Tambah jumlah">+</button><button class="remove-item" type="button" data-action="remove" data-id="${item.id}" aria-label="Hapus produk">×</button></div></article>`;
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
    return { totalItems, discount, total };
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
    if (button.dataset.action === 'increase') cart[itemIndex].quantity += 1;
    if (button.dataset.action === 'decrease') {
      cart[itemIndex].quantity -= 1;
      if (cart[itemIndex].quantity < 1) cart.splice(itemIndex, 1);
    }
    if (button.dataset.action === 'remove') cart.splice(itemIndex, 1);
    renderCart();
  });

  document.querySelector('#customerSelector')?.addEventListener('click', (event) => {
    const option = event.target.closest('[data-customer]');
    if (!option) return;
    customerType = option.dataset.customer;
    document.querySelectorAll('[data-customer]').forEach((button) => button.classList.toggle('is-selected', button === option));
    renderCart();
  });

  document.querySelector('#paymentOptions')?.addEventListener('click', (event) => {
    const option = event.target.closest('[data-payment]');
    if (!option) return;
    paymentMethod = option.dataset.payment;
    document.querySelectorAll('[data-payment]').forEach((button) => button.classList.toggle('is-selected', button === option));
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
    document.querySelector('#receiptCustomer').textContent = customerType === 'member' ? 'Nabila A. (Member)' : 'Pelanggan Umum';
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
