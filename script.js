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
  const regularCustomerFields = document.querySelector('#regularCustomerFields');
  const regularCustomerName = document.querySelector('#regularCustomerName');
  const regularCustomerNote = document.querySelector('#regularCustomerNote');
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
    return { totalItems, subtotal, discount, total };
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
    regularCustomerFields.classList.toggle('is-open', customerType === 'regular');
    if (customerType === 'member') {
      renderMemberResults();
      document.querySelector('#memberSearch').focus();
    } else {
      regularCustomerName.focus();
    }
    renderCart();
  });

  regularCustomerName?.addEventListener('input', () => {
    regularCustomerName.classList.remove('is-invalid');
    document.querySelector('#regularNameError').textContent = '';
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
    if (customerType === 'regular' && !regularCustomerName.value.trim()) {
      regularCustomerName.classList.add('is-invalid');
      document.querySelector('#regularNameError').textContent = 'Nama pelanggan wajib diisi.';
      regularCustomerName.focus();
      return;
    }
    const summary = renderCart();
    document.querySelector('#receiptOrderItems').innerHTML = cart.map((item) => {
      const product = productCatalog[item.id];
      return `<div class="receipt-order-item"><div><strong>${product.name}</strong><small>${item.quantity} × ${formatCurrency(product.price)}</small></div><b>${formatCurrency(product.price * item.quantity)}</b></div>`;
    }).join('');
    document.querySelector('#receiptCustomer').textContent = customerType === 'member' ? `${selectedMember.name} (Member)` : regularCustomerName.value.trim();
    const note = regularCustomerNote.value.trim();
    document.querySelector('#receiptCustomerNoteRow').hidden = !note;
    document.querySelector('#receiptCustomerNote').textContent = note;
    document.querySelector('#receiptItems').textContent = `${summary.totalItems} item`;
    document.querySelector('#receiptPayment').textContent = paymentMethod;
    document.querySelector('#receiptSubtotal').textContent = formatCurrency(summary.subtotal);
    document.querySelector('#receiptDiscount').textContent = `- ${formatCurrency(summary.discount)}`;
    document.querySelector('#receiptTotal').textContent = formatCurrency(summary.total);
    const isCashPayment = paymentMethod === 'Tunai';
    const paid = Number(document.querySelector('#cashPaid')?.value) || 0;
    const difference = paid - summary.total;
    document.querySelector('#receiptCashPaidRow').hidden = !isCashPayment;
    document.querySelector('#receiptChangeRow').hidden = !isCashPayment;
    document.querySelector('#receiptCashSummary').hidden = !isCashPayment;
    if (isCashPayment) {
      document.querySelector('#receiptCashPaid').textContent = formatCurrency(paid);
      document.querySelector('#receiptChangeRow span').textContent = difference < 0 ? 'Kekurangan pembayaran' : 'Kembalian';
      document.querySelector('#receiptChange').textContent = difference < 0 ? `- ${formatCurrency(Math.abs(difference))}` : formatCurrency(difference);
    }
    document.querySelector('#receiptModal').classList.add('is-open');
  });

  document.querySelector('#closeReceipt')?.addEventListener('click', () => document.querySelector('#receiptModal').classList.remove('is-open'));
  document.querySelector('#printReceipt')?.addEventListener('click', () => window.print());
  document.querySelector('#processTransaction')?.addEventListener('click', () => document.querySelector('#processConfirmModal').classList.add('is-open'));
  document.querySelector('#cancelProcess')?.addEventListener('click', () => document.querySelector('#processConfirmModal').classList.remove('is-open'));
  document.querySelector('#confirmProcess')?.addEventListener('click', () => {
    document.querySelector('#processConfirmModal').classList.remove('is-open');
    document.querySelector('#receiptModal').classList.remove('is-open');
    document.querySelector('#processSuccessModal').classList.add('is-open');
  });
  document.querySelector('#closeProcessSuccess')?.addEventListener('click', () => document.querySelector('#processSuccessModal').classList.remove('is-open'));
  renderCart();
}

const productionTable = document.querySelector('#productionTable');

if (productionTable) {
  const productionOrders = [
    { id: 'TRX-2026-0916-024', time: 'Hari ini, 10.30', date: 'Hari ini', customer: 'Nabila Aulia', phone: '081234567890', member: true, product: 'Banner Flexi', quantity: '1 pcs · 3 × 2 m', due: 'Hari ini, 16.00', payment: 'DP', paymentDetail: 'DP · Rp 150.000', status: 'produksi', specs: [['Ukuran', '3 × 2 m'], ['Bahan', 'Flexi China 280 gsm'], ['Finishing', 'Mata ayam'], ['Desain', 'Sudah disetujui']], note: 'Mohon warna dibuat cerah. Akan diambil sore hari.', timeline: [['Pesanan masuk', '16 Sep 2026, 10.30'], ['Desain disetujui pelanggan', '16 Sep 2026, 10.45'], ['Mulai proses produksi', '16 Sep 2026, 11.00']] },
    { id: 'TRX-2026-0916-023', time: 'Hari ini, 09.45', date: 'Hari ini', customer: 'Budi Santoso', phone: '081276543210', member: true, product: 'Undangan Pernikahan', quantity: '200 lembar', due: '18 Sep 2026, 12.00', payment: 'DP', paymentDetail: 'DP · Rp 250.000', status: 'persetujuan', specs: [['Ukuran', '12 × 18 cm'], ['Bahan', 'Jasmine 220 gsm'], ['Finishing', 'Laminasi doff'], ['Desain', 'Menunggu persetujuan']], note: 'Tolong kirim preview final lewat WhatsApp sebelum produksi.', timeline: [['Pesanan masuk', '16 Sep 2026, 09.45'], ['Desain sedang dikerjakan', '16 Sep 2026, 10.10']] },
    { id: 'TRX-2026-0916-022', time: 'Hari ini, 09.20', date: 'Hari ini', customer: 'Dimas Pratama', phone: '085712345678', member: false, product: 'Sablon Kaos', quantity: '35 pcs', due: '17 Sep 2026, 17.00', payment: 'Lunas', paymentDetail: 'Lunas · Rp 1.225.000', status: 'produksi', specs: [['Ukuran', 'S - XL'], ['Bahan', 'Cotton combed 24s'], ['Warna kaos', 'Hitam'], ['Teknik', 'Sablon plastisol']], note: 'Ukuran kaos sudah dikirim melalui WhatsApp.', timeline: [['Pesanan masuk', '16 Sep 2026, 09.20'], ['File produksi diterima', '16 Sep 2026, 09.35'], ['Mulai sablon', '16 Sep 2026, 10.20']] },
    { id: 'TRX-2026-0916-021', time: 'Hari ini, 08.40', date: 'Hari ini', customer: 'Siti Rahma', phone: '082198765432', member: true, product: 'Stiker Vinyl', quantity: '100 lembar', due: 'Hari ini, 15.00', payment: 'Lunas', paymentDetail: 'Lunas · Rp 800.000', status: 'siap', specs: [['Ukuran', 'A4'], ['Bahan', 'Vinyl putih'], ['Finishing', 'Cutting kiss cut'], ['Desain', 'Siap cetak']], note: 'Pesanan akan diambil oleh kurir pelanggan.', timeline: [['Pesanan masuk', '16 Sep 2026, 08.40'], ['Dicetak', '16 Sep 2026, 09.10'], ['Pesanan siap diambil', '16 Sep 2026, 11.20']] },
    { id: 'TRX-2026-0915-020', time: 'Kemarin, 16.15', date: 'Kemarin', customer: 'Andi Kurniawan', phone: '081390123456', member: false, product: 'Kartu Nama', quantity: '5 box', due: 'Hari ini, 14.00', payment: 'Belum Lunas', paymentDetail: 'Belum lunas · Rp 250.000', status: 'desain', specs: [['Ukuran', '9 × 5.5 cm'], ['Bahan', 'Art carton 260 gsm'], ['Finishing', 'Laminasi doff'], ['Desain', 'Menunggu file']], note: 'Pelanggan akan mengirim logo melalui WhatsApp.', timeline: [['Pesanan masuk', '15 Sep 2026, 16.15'], ['Menunggu file desain pelanggan', '15 Sep 2026, 16.20']] },
    { id: 'TRX-2026-0915-019', time: 'Kemarin, 15.35', date: 'Kemarin', customer: 'Maya Putri', phone: '087812345678', member: true, product: 'Spanduk Kain', quantity: '1 pcs · 4 × 1 m', due: 'Hari ini, 13.00', payment: 'DP', paymentDetail: 'DP · Rp 100.000', status: 'siap', specs: [['Ukuran', '4 × 1 m'], ['Bahan', 'TC 3m'], ['Finishing', 'Jahit keliling'], ['Desain', 'Sudah disetujui']], note: 'Mohon dilipat rapi karena akan dibawa keluar kota.', timeline: [['Pesanan masuk', '15 Sep 2026, 15.35'], ['Proses jahit selesai', '16 Sep 2026, 10.00'], ['Pesanan siap diambil', '16 Sep 2026, 11.10']] },
    { id: 'TRX-2026-0915-018', time: 'Kemarin, 14.50', date: 'Kemarin', customer: 'Fajar Nugroho', phone: '081551234567', member: false, product: 'Fotokopi Warna', quantity: '50 lembar', due: 'Hari ini, 11.30', payment: 'Lunas', paymentDetail: 'Lunas · Rp 75.000', status: 'selesai', specs: [['Ukuran', 'A4'], ['Bahan', 'HVS 80 gsm'], ['Warna', 'Full color'], ['Finishing', 'Tanpa finishing']], note: 'Pesanan telah diambil oleh pelanggan.', timeline: [['Pesanan masuk', '15 Sep 2026, 14.50'], ['Dicetak', '15 Sep 2026, 15.05'], ['Pesanan selesai', '15 Sep 2026, 15.15']] },
    { id: 'TRX-2026-0915-017', time: 'Kemarin, 13.20', date: 'Kemarin', customer: 'Dewi Lestari', phone: '081367890123', member: true, product: 'Label Produk', quantity: '300 pcs', due: '17 Sep 2026, 14.00', payment: 'Lunas', paymentDetail: 'Lunas · Rp 450.000', status: 'persetujuan', specs: [['Ukuran', '6 × 8 cm'], ['Bahan', 'Stiker chromo'], ['Finishing', 'Potong persegi'], ['Desain', 'Revisi 1']], note: 'Pelanggan meminta ukuran tulisan nama produk diperbesar.', timeline: [['Pesanan masuk', '15 Sep 2026, 13.20'], ['Desain dikirim ke pelanggan', '15 Sep 2026, 14.00']] },
    { id: 'TRX-2026-0915-016', time: 'Kemarin, 10.10', date: 'Kemarin', customer: 'Rizky Maulana', phone: '085612345678', member: false, product: 'Roll Banner', quantity: '2 unit', due: '17 Sep 2026, 16.00', payment: 'DP', paymentDetail: 'DP · Rp 300.000', status: 'produksi', specs: [['Ukuran', '60 × 160 cm'], ['Bahan', 'Albatros'], ['Rangka', 'Roll banner standar'], ['Desain', 'Siap cetak']], note: 'Pastikan rangka dan tas dibawa bersama hasil cetak.', timeline: [['Pesanan masuk', '15 Sep 2026, 10.10'], ['Desain disetujui', '15 Sep 2026, 10.45'], ['Cetak sedang berjalan', '16 Sep 2026, 09.00']] },
    { id: 'TRX-2026-0914-015', time: '14 Sep, 15.40', date: 'Kemarin', customer: 'Rina Wulandari', phone: '089612345670', member: true, product: 'Brosur A5', quantity: '500 lembar', due: '17 Sep 2026, 10.00', payment: 'Lunas', paymentDetail: 'Lunas · Rp 600.000', status: 'desain', specs: [['Ukuran', 'A5'], ['Bahan', 'Art paper 150 gsm'], ['Finishing', 'Potong rapi'], ['Desain', 'Dalam pengerjaan']], note: 'Gunakan warna sesuai panduan merek yang dikirim pelanggan.', timeline: [['Pesanan masuk', '14 Sep 2026, 15.40'], ['Brief desain diterima', '14 Sep 2026, 16.00']] },
  ];
  productionOrders.forEach((order) => {
    if (['desain', 'persetujuan', 'produksi'].includes(order.status)) order.status = 'diproses';
  });
  const statusLabels = { diproses: 'Diproses', siap: 'Siap Diambil', selesai: 'Selesai' };
  let productionStatusFilter = 'all';
  let selectedProductionOrder = null;
  const productionInitials = (name) => name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();

  function renderProductionCounts() {
    document.querySelector('#countAll').textContent = productionOrders.length;
    document.querySelector('#countProcessed').textContent = productionOrders.filter((order) => order.status === 'diproses').length;
    document.querySelector('#countReady').textContent = productionOrders.filter((order) => order.status === 'siap').length;
    document.querySelector('#countComplete').textContent = productionOrders.filter((order) => order.status === 'selesai').length;
  }

  function renderProductionOrders() {
    const term = document.querySelector('#orderSearch').value.toLowerCase().trim();
    const date = document.querySelector('#dateFilter').value;
    const visibleOrders = productionOrders.filter((order) => (productionStatusFilter === 'all' || order.status === productionStatusFilter) && (date === 'all' || order.date === date) && `${order.id} ${order.customer}`.toLowerCase().includes(term));
    productionTable.innerHTML = visibleOrders.map((order) => `<tr><td><span class="order-id">#${order.id}</span><span class="order-time">${order.time}</span></td><td><span class="customer-cell"><span class="customer-cell__avatar">${productionInitials(order.customer)}</span><span><strong>${order.customer}</strong><span>${order.member ? 'Member' : 'Pelanggan umum'}</span></span></span></td><td><span class="order-product">${order.product}</span><span class="order-quantity">${order.quantity}</span></td><td>${order.due}</td><td><span class="production-badge production-badge--${order.status}">${statusLabels[order.status]}</span></td><td><button class="view-order" type="button" data-order-id="${order.id}">Detail</button></td></tr>`).join('');
    document.querySelector('#emptyOrders').hidden = visibleOrders.length !== 0;
  }

  function openProductionDetail(order) {
    selectedProductionOrder = order;
    document.querySelector('#modalOrderId').textContent = `#${order.id}`;
    document.querySelector('#modalCustomer').textContent = order.customer;
    document.querySelector('#modalPhone').textContent = `${order.phone} · ${order.member ? 'Member' : 'Pelanggan umum'}`;
    document.querySelector('#modalInitials').textContent = productionInitials(order.customer);
    document.querySelector('#modalWhatsapp').href = `https://wa.me/${order.phone}`;
    document.querySelector('#modalProduct').textContent = order.product;
    document.querySelector('#modalQuantity').textContent = order.quantity;
    document.querySelector('#modalDueDate').textContent = order.due;
    document.querySelector('#modalStatus').textContent = statusLabels[order.status];
    document.querySelector('#modalSpecs').innerHTML = order.specs.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('');
    document.querySelector('#modalNote').textContent = order.note;
    document.querySelector('#modalTimeline').innerHTML = order.timeline.map(([title, date]) => `<li><strong>${title}</strong><span>${date}</span></li>`).join('');
    document.querySelector('#modalStatusSelect').value = order.status;
    document.querySelector('#productionModal').classList.add('is-open');
  }

  document.querySelectorAll('[data-status-filter]').forEach((button) => button.addEventListener('click', () => {
    productionStatusFilter = button.dataset.statusFilter;
    document.querySelectorAll('[data-status-filter]').forEach((item) => item.classList.toggle('is-active', item === button));
    renderProductionOrders();
  }));
  ['#orderSearch', '#dateFilter'].forEach((selector) => document.querySelector(selector).addEventListener(selector === '#orderSearch' ? 'input' : 'change', renderProductionOrders));
  productionTable.addEventListener('click', (event) => { const button = event.target.closest('[data-order-id]'); if (button) openProductionDetail(productionOrders.find((order) => order.id === button.dataset.orderId)); });
  document.querySelector('#closeProductionModal').addEventListener('click', () => document.querySelector('#productionModal').classList.remove('is-open'));
  document.querySelector('#productionModal').addEventListener('click', (event) => { if (event.target.id === 'productionModal') event.currentTarget.classList.remove('is-open'); });
  document.querySelector('#saveStatusButton').addEventListener('click', () => {
    const newStatus = document.querySelector('#modalStatusSelect').value;
    if (!selectedProductionOrder || newStatus === selectedProductionOrder.status) return;
    selectedProductionOrder.status = newStatus;
    selectedProductionOrder.timeline.push([statusLabels[newStatus], 'Diperbarui hari ini, 11.30']);
    renderProductionCounts(); renderProductionOrders(); openProductionDetail(selectedProductionOrder);
  });
  renderProductionCounts(); renderProductionOrders();
}
