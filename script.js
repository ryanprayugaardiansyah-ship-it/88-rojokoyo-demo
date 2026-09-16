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

const memberDiscountRules = [
  { code: 'member', name: 'Diskon Member', defaultPercent: 10 },
  { code: 'bulk_50', name: 'Diskon Pembelian 50+', defaultPercent: 15 },
];

function normalizeMemberDiscounts(discounts = []) {
  return discounts.map((discount) => {
    if (discount.code) return { code: discount.code, percent: Number(discount.percent) || 0 };
    const isBulkDiscount = /50|item|jumlah|kuantitas/i.test(discount.name || '');
    return { code: isBulkDiscount ? 'bulk_50' : 'member', percent: Number(discount.percent) || 0 };
  }).filter((discount, index, values) => memberDiscountRules.some((rule) => rule.code === discount.code) && values.findIndex((item) => item.code === discount.code) === index);
}

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
  try {
    const storedMembers = (JSON.parse(localStorage.getItem('rojokoyo-customers')) || []).map(({ isDeleted, ...customer }) => customer);
    storedMembers.filter((customer) => customer.type === 'member').forEach((customer) => {
      const index = members.findIndex((member) => member.number === customer.code || member.name.toLowerCase() === customer.name.toLowerCase());
      const member = { name: customer.name, number: customer.code, discounts: customer.discounts || [] };
      if (index >= 0) members[index] = member;
      else members.push(member);
    });
  } catch {
    // Data demo tetap dapat digunakan bila penyimpanan browser tidak tersedia.
  }
  const cart = [
    { id: 'banner', quantity: 1 },
    { id: 'undangan', quantity: 50 },
  ];
  let customerType = 'member';
  let paymentMethod = 'Tunai';
  let selectedMember = members[0];
  let latestTransaction = null;
  const regularCustomerFields = document.querySelector('#regularCustomerFields');
  const regularCustomerName = document.querySelector('#regularCustomerName');
  const regularCustomerNote = document.querySelector('#regularCustomerNote');
  const formatCurrency = (value) => `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;

  function initials(name) {
    return name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  }

  function getMemberDiscount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const configuredDiscounts = normalizeMemberDiscounts(selectedMember.discounts?.length ? selectedMember.discounts : memberDiscountRules.map((rule) => ({ code: rule.code, percent: rule.defaultPercent })));
    const standardDiscount = configuredDiscounts.find((discount) => discount.code === 'member');
    const bulkDiscount = configuredDiscounts.find((discount) => discount.code === 'bulk_50');
    const activeDiscount = totalItems >= 50 && bulkDiscount ? bulkDiscount : standardDiscount;
    const rule = memberDiscountRules.find((item) => item.code === activeDiscount?.code);

    return activeDiscount && rule
      ? { rate: activeDiscount.percent / 100, label: rule.name, note: `${rule.name} ${activeDiscount.percent}% aktif untuk transaksi ini.` }
      : { rate: 0, label: 'Tidak ada', note: '' };
  }

  function getDiscountRate() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (customerType === 'member') return getMemberDiscount().rate;
    return totalItems >= 50 ? 0.05 : 0;
  }

  function renderCart() {
    const subtotal = cart.reduce((sum, item) => sum + productCatalog[item.id].price * item.quantity, 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const memberDiscount = customerType === 'member' ? getMemberDiscount() : null;
    const discountRate = memberDiscount ? memberDiscount.rate : getDiscountRate();
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
    const label = customerType === 'member' ? `${memberDiscount.label} ${discountRate * 100}%` : discountRate ? 'Diskon 50+ 5%' : 'Tidak ada';
    posElements.discountLabel.textContent = label;
    posElements.note.classList.toggle('is-visible', discountRate > 0);
    posElements.note.querySelector('span').textContent = customerType === 'member'
      ? memberDiscount.note
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
    latestTransaction = {
      customerType,
      customerName: customerType === 'member' ? selectedMember.name : regularCustomerName.value.trim(),
      total: summary.total,
      items: cart.map((item) => ({ name: productCatalog[item.id].name, quantity: item.quantity })),
    };
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
    if (latestTransaction?.customerType === 'regular') {
      const storageKey = 'rojokoyo-customers';
      let storedCustomers = [];
      try { storedCustomers = JSON.parse(localStorage.getItem(storageKey)) || []; } catch { storedCustomers = []; }
      const existing = storedCustomers.find((customer) => customer.type === 'regular' && customer.name.toLowerCase() === latestTransaction.customerName.toLowerCase());
      const historyItem = { product: latestTransaction.items.map((item) => `${item.name} (${item.quantity})`).join(', '), date: 'Hari ini', value: formatCurrency(latestTransaction.total) };
      if (existing) {
        existing.transactions += 1;
        existing.spentValue = (existing.spentValue || 0) + latestTransaction.total;
        existing.spent = formatCurrency(existing.spentValue);
        existing.last = 'Hari ini';
        existing.history = [historyItem, ...(existing.history || [])];
      } else {
        storedCustomers.unshift({ code: `CUS-${String(Date.now()).slice(-4)}`, name: latestTransaction.customerName, type: 'regular', transactions: 1, spentValue: latestTransaction.total, spent: formatCurrency(latestTransaction.total), last: 'Hari ini', history: [historyItem] });
      }
      localStorage.setItem(storageKey, JSON.stringify(storedCustomers));
    }
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
    { id: 'TRX-2026-0916-021', time: 'Hari ini, 08.40', date: 'Hari ini', customer: 'Siti Rahma', phone: '082198765432', member: true, product: 'Stiker Vinyl', quantity: '100 lembar', due: 'Hari ini, 15.00', payment: 'Lunas', paymentDetail: 'Lunas · Rp 800.000', status: 'siap', specs: [['Ukuran', 'A4'], ['Bahan', 'Vinyl putih'], ['Finishing', 'Cutting kiss cut'], ['Desain', 'Siap cetak']], note: 'Pesanan siap diambil oleh pelanggan.', timeline: [['Pesanan masuk', '16 Sep 2026, 08.40'], ['Dicetak', '16 Sep 2026, 09.10'], ['Pesanan siap diambil', '16 Sep 2026, 11.20']] },
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
    document.querySelector('#modalPhone').textContent = order.member ? 'Member' : 'Pelanggan umum';
    document.querySelector('#modalInitials').textContent = productionInitials(order.customer);
    document.querySelector('#modalWhatsapp').href = `https://wa.me/${order.phone}`;
    document.querySelector('#modalProduct').textContent = order.product;
    document.querySelector('#modalQuantity').textContent = order.quantity;
    document.querySelector('#modalDueDate').textContent = order.due;
    document.querySelector('#modalStatus').textContent = statusLabels[order.status];
    document.querySelector('#modalSpecs').innerHTML = order.specs.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('');
    document.querySelector('#modalNote').textContent = order.note;
    const timelineSteps = ['Pesanan Masuk', 'Diproses', 'Siap Diambil', 'Selesai'];
    const currentStep = { diproses: 1, siap: 2, selesai: 3 }[order.status];
    document.querySelector('#modalTimeline').innerHTML = timelineSteps.slice(0, currentStep + 1).map((title, index) => {
      const timestamp = order.timeline[Math.min(index, order.timeline.length - 1)]?.[1] || order.time;
      return `<li><strong>${title}</strong><span>${timestamp}</span></li>`;
    }).join('');
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

const customerTable = document.querySelector('#customerTable');

if (customerTable) {
  const customers = [
    { code: 'MBR-0001', name: 'Nabila Aulia', type: 'member', address: 'Jl. Diponegoro No. 88, Sleman, Yogyakarta', phone: '0812 3456 7890', email: 'nabila.aulia@email.com', discounts: [{ code: 'member', percent: 10 }, { code: 'bulk_50', percent: 15 }], transactions: 12, spent: 'Rp 2.850.000', last: 'Hari ini', history: [['Banner Flexi 3 × 2 m', 'Hari ini', 'Rp 255.000'], ['Undangan Custom', '12 Sep 2026', 'Rp 750.000']] },
    { code: 'MBR-0002', name: 'Budi Santoso', type: 'member', address: 'Jl. Kaliurang Km 7,8, Sleman, Yogyakarta', phone: '0812 7654 3210', email: 'budi.santoso@email.com', discounts: [{ code: 'member', percent: 10 }, { code: 'bulk_50', percent: 15 }], transactions: 9, spent: 'Rp 1.970.000', last: 'Hari ini', history: [['Undangan Pernikahan', 'Hari ini', 'Rp 1.250.000'], ['Kartu Nama', '02 Sep 2026', 'Rp 150.000']] },
    { code: 'CUS-0003', name: 'Dimas Pratama', type: 'regular', transactions: 5, spent: 'Rp 1.480.000', last: 'Hari ini', history: [['Sablon Kaos', 'Hari ini', 'Rp 1.225.000'], ['Stiker Vinyl', '21 Agu 2026', 'Rp 160.000']] },
    { code: 'MBR-0004', name: 'Siti Rahma', type: 'member', address: 'Jl. Magelang No. 102, Yogyakarta', phone: '0821 9876 5432', email: 'siti.rahma@email.com', discounts: [{ code: 'member', percent: 10 }, { code: 'bulk_50', percent: 15 }], transactions: 8, spent: 'Rp 1.640.000', last: 'Hari ini', history: [['Stiker Vinyl', 'Hari ini', 'Rp 800.000'], ['Banner Flexi', '01 Sep 2026', 'Rp 450.000']] },
    { code: 'CUS-0005', name: 'Andi Kurniawan', type: 'regular', transactions: 4, spent: 'Rp 790.000', last: 'Kemarin', history: [['Kartu Nama', 'Kemarin', 'Rp 250.000'], ['Fotokopi Warna', '23 Agu 2026', 'Rp 75.000']] },
    { code: 'MBR-0006', name: 'Maya Putri', type: 'member', address: 'Jl. Godean No. 45, Sleman, Yogyakarta', phone: '0878 1234 5678', email: 'maya.putri@email.com', discounts: [{ code: 'member', percent: 10 }, { code: 'bulk_50', percent: 15 }], transactions: 11, spent: 'Rp 3.120.000', last: 'Kemarin', history: [['Spanduk Kain', 'Kemarin', 'Rp 950.000'], ['Label Produk', '04 Sep 2026', 'Rp 600.000']] },
    { code: 'CUS-0007', name: 'Fajar Nugroho', type: 'regular', transactions: 3, spent: 'Rp 385.000', last: '15 Sep 2026', history: [['Fotokopi Warna', '15 Sep 2026', 'Rp 75.000'], ['Banner Flexi', '10 Agu 2026', 'Rp 310.000']] },
    { code: 'MBR-0008', name: 'Dewi Lestari', type: 'member', address: 'Jl. Solo Km 9, Kalasan, Sleman', phone: '0813 6789 0123', email: 'dewi.lestari@email.com', discounts: [{ code: 'member', percent: 10 }, { code: 'bulk_50', percent: 15 }], transactions: 7, spent: 'Rp 1.890.000', last: '15 Sep 2026', history: [['Label Produk', '15 Sep 2026', 'Rp 450.000'], ['Brosur A5', '30 Agu 2026', 'Rp 500.000']] },
    { code: 'CUS-0009', name: 'Rizky Maulana', type: 'regular', transactions: 6, spent: 'Rp 2.100.000', last: '14 Sep 2026', history: [['Roll Banner', '14 Sep 2026', 'Rp 1.300.000'], ['Stiker Vinyl', '21 Agu 2026', 'Rp 240.000']] },
    { code: 'MBR-0010', name: 'Rina Wulandari', type: 'member', address: 'Jl. Wates No. 17, Yogyakarta', phone: '0896 1234 5670', email: 'rina.wulandari@email.com', discounts: [{ code: 'member', percent: 10 }, { code: 'bulk_50', percent: 15 }], transactions: 10, spent: 'Rp 2.450.000', last: '14 Sep 2026', history: [['Brosur A5', '14 Sep 2026', 'Rp 600.000'], ['Banner Flexi', '05 Sep 2026', 'Rp 780.000']] },
  ];
  const customerStorageKey = 'rojokoyo-customers';
  let savedCustomers = [];
  try {
    savedCustomers = JSON.parse(localStorage.getItem(customerStorageKey)) || [];
    const hadDeletedMembers = savedCustomers.some((customer) => customer.isDeleted);
    savedCustomers = savedCustomers.map(({ isDeleted, ...customer }) => customer);
    if (hadDeletedMembers) localStorage.setItem(customerStorageKey, JSON.stringify(savedCustomers));
  } catch { savedCustomers = []; }
  savedCustomers.forEach((savedCustomer) => {
    const index = customers.findIndex((customer) => customer.code === savedCustomer.code);
    if (index >= 0) {
      customers[index] = savedCustomer;
    } else {
      customers.push(savedCustomer);
    }
  });
  let customerFilter = 'all';
  let selectedCustomer = null;
  let editingMember = null;
  const initials = (name) => name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  const typeLabel = (type) => type === 'member' ? 'Member' : 'Pelanggan Umum';

  function renderCustomers() {
    const term = document.querySelector('#customerSearch').value.toLowerCase().trim();
    const visible = customers.filter((customer) => (customerFilter === 'all' || customer.type === customerFilter) && customer.name.toLowerCase().includes(term));
    customerTable.innerHTML = visible.map((customer) => `<tr><td><span class="customer-table-profile"><span class="customer-table-avatar">${initials(customer.name)}</span><span><strong>${customer.name}</strong><span>${customer.code}</span></span></span></td><td><span class="customer-type customer-type--${customer.type}">${typeLabel(customer.type)}</span></td><td>${customer.transactions} transaksi</td><td><strong>${customer.spent}</strong></td><td>${customer.last}</td><td><button class="customer-detail-button" type="button" data-customer-code="${customer.code}">Detail</button></td></tr>`).join('');
    document.querySelector('#emptyCustomers').hidden = visible.length !== 0;
  }

  function renderCustomerCounts() {
    document.querySelector('#customerCountAll').textContent = customers.length;
    document.querySelector('#customerCountMember').textContent = customers.filter((customer) => customer.type === 'member').length;
  }

  function openCustomerDetail(customer) {
    selectedCustomer = customer;
    document.querySelector('#detailCustomerCode').textContent = customer.code;
    document.querySelector('#customerDetailTitle').textContent = customer.type === 'member' ? 'Detail Member' : 'Detail Pelanggan';
    document.querySelector('#detailCustomerName').textContent = customer.name;
    document.querySelector('#detailCustomerInitial').textContent = initials(customer.name);
    document.querySelector('#detailCustomerType').textContent = customer.type === 'member' ? 'Member 88 Rojokoyo' : 'Pelanggan Umum';
    const badge = document.querySelector('#detailCustomerBadge');
    badge.textContent = typeLabel(customer.type); badge.className = `customer-profile__badge customer-type customer-type--${customer.type}`;
    document.querySelector('#detailCustomerTransactions').textContent = `${customer.transactions} transaksi`;
    document.querySelector('#detailCustomerSpent').textContent = customer.spent;
    document.querySelector('#detailCustomerLast').textContent = customer.last;
    const personalInfo = document.querySelector('#memberPersonalInfo');
    personalInfo.hidden = customer.type !== 'member';
    document.querySelector('#memberDetailActions').hidden = customer.type !== 'member';
    if (customer.type === 'member') {
      document.querySelector('#detailMemberAddress').textContent = customer.address || 'Belum diisi';
      document.querySelector('#detailMemberPhone').textContent = customer.phone || 'Belum diisi';
      document.querySelector('#detailMemberEmail').textContent = customer.email || 'Belum diisi';
    }
    const benefits = document.querySelector('#memberBenefits');
    benefits.hidden = customer.type !== 'member';
    if (customer.type === 'member') {
      const discounts = normalizeMemberDiscounts(customer.discounts?.length ? customer.discounts : memberDiscountRules.map((rule) => ({ code: rule.code, percent: rule.defaultPercent })));
      benefits.innerHTML = `<h3>Benefit Member</h3>${discounts.map((discount) => `<div><span>${memberDiscountRules.find((rule) => rule.code === discount.code).name}</span><b>${discount.percent}%</b></div>`).join('')}`;
    }
    document.querySelector('#customerHistory').innerHTML = customer.history.map((entry) => {
      const [product, date, value] = Array.isArray(entry) ? entry : [entry.product, entry.date, entry.value];
      return `<article class="customer-history__item"><div><strong>${product}</strong><span>${date}</span></div><b>${value}</b></article>`;
    }).join('');
    document.querySelector('#customerDetailModal').classList.add('is-open');
  }

  function setCustomerFilter(filter) {
    customerFilter = filter;
    document.querySelectorAll('[data-customer-filter]').forEach((button) => button.classList.toggle('is-active', button.dataset.customerFilter === filter));
    renderCustomers();
  }

  document.querySelectorAll('[data-customer-filter]').forEach((button) => button.addEventListener('click', () => setCustomerFilter(button.dataset.customerFilter)));
  document.querySelector('#customerSearch').addEventListener('input', renderCustomers);
  customerTable.addEventListener('click', (event) => { const button = event.target.closest('[data-customer-code]'); if (button) openCustomerDetail(customers.find((customer) => customer.code === button.dataset.customerCode)); });
  document.querySelector('#closeCustomerDetail').addEventListener('click', () => document.querySelector('#customerDetailModal').classList.remove('is-open'));
  const addMemberButton = document.querySelector('#addCustomer');
  const defaultDiscounts = memberDiscountRules.map((rule) => ({ code: rule.code, percent: rule.defaultPercent }));
  const memberForm = document.querySelector('#addCustomerForm');
  function setMemberDiscountFields(discounts = []) {
    const configuredDiscounts = normalizeMemberDiscounts(discounts);
    memberDiscountRules.forEach((rule) => {
      const setting = configuredDiscounts.find((discount) => discount.code === rule.code);
      const checkbox = document.querySelector(`[data-discount-code="${rule.code}"]`);
      const percentInput = document.querySelector(`[data-discount-percent="${rule.code}"]`);
      checkbox.checked = Boolean(setting);
      percentInput.value = setting?.percent ?? rule.defaultPercent;
      percentInput.disabled = !checkbox.checked;
      percentInput.required = checkbox.checked;
      checkbox.closest('.member-discount-option').classList.toggle('is-active', checkbox.checked);
    });
  }
  function openMemberForm(member = null) {
    editingMember = member;
    memberForm.reset();
    document.querySelector('#memberFormEyebrow').textContent = member ? 'EDIT MEMBER' : 'MEMBER BARU';
    document.querySelector('#addCustomerTitle').textContent = member ? 'Edit Member' : 'Tambah Member';
    document.querySelector('#saveMemberButton').textContent = member ? 'Simpan Perubahan' : 'Simpan Member';
    if (member) {
      document.querySelector('#newCustomerName').value = member.name;
      document.querySelector('#newMemberAddress').value = member.address || '';
      document.querySelector('#newMemberPhone').value = member.phone || '';
      document.querySelector('#newMemberEmail').value = member.email || '';
    }
    setMemberDiscountFields(member ? (member.discounts?.length ? member.discounts : defaultDiscounts) : defaultDiscounts);
    document.querySelector('#customerDetailModal').classList.remove('is-open');
    document.querySelector('#addCustomerModal').classList.add('is-open');
  }
  addMemberButton.addEventListener('click', () => openMemberForm());
  document.querySelector('#closeAddCustomer').addEventListener('click', () => document.querySelector('#addCustomerModal').classList.remove('is-open'));
  document.querySelector('#editMember').addEventListener('click', () => { if (selectedCustomer?.type === 'member') openMemberForm(selectedCustomer); });
  document.querySelector('#deleteMember').addEventListener('click', () => {
    if (selectedCustomer?.type !== 'member') return;
    document.querySelector('#deleteMemberName').textContent = selectedCustomer.name;
    document.querySelector('#deleteMemberConfirmModal').classList.add('is-open');
  });
  document.querySelector('#cancelDeleteMember').addEventListener('click', () => document.querySelector('#deleteMemberConfirmModal').classList.remove('is-open'));
  document.querySelector('#confirmDeleteMember').addEventListener('click', () => {
    if (selectedCustomer?.type !== 'member') return;
    const deletedMemberName = selectedCustomer.name;
    const index = customers.findIndex((customer) => customer.code === selectedCustomer.code);
    if (index >= 0) customers.splice(index, 1);
    document.querySelector('#deletedMemberSuccessName').textContent = deletedMemberName;
    document.querySelector('#deleteMemberConfirmModal').classList.remove('is-open');
    document.querySelector('#customerDetailModal').classList.remove('is-open');
    document.querySelector('#deleteMemberSuccessModal').classList.add('is-open');
    renderCustomerCounts(); renderCustomers();
  });
  document.querySelector('#closeDeleteMemberSuccess').addEventListener('click', () => document.querySelector('#deleteMemberSuccessModal').classList.remove('is-open'));
  document.querySelectorAll('.member-discount-checkbox').forEach((checkbox) => checkbox.addEventListener('change', () => {
    const percentInput = document.querySelector(`[data-discount-percent="${checkbox.dataset.discountCode}"]`);
    percentInput.disabled = !checkbox.checked;
    percentInput.required = checkbox.checked;
    checkbox.closest('.member-discount-option').classList.toggle('is-active', checkbox.checked);
  }));
  memberForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.querySelector('#newCustomerName').value.trim();
    if (!name) return;
    const discounts = memberDiscountRules.map((rule) => {
      const checkbox = document.querySelector(`[data-discount-code="${rule.code}"]`);
      const percent = Number(document.querySelector(`[data-discount-percent="${rule.code}"]`).value);
      return checkbox.checked && percent > 0 ? { code: rule.code, percent } : null;
    }).filter(Boolean);
    const memberData = { name, type: 'member', address: document.querySelector('#newMemberAddress').value.trim(), phone: document.querySelector('#newMemberPhone').value.trim(), email: document.querySelector('#newMemberEmail').value.trim(), discounts };
    const member = editingMember ? Object.assign(editingMember, memberData) : { code: `MBR-${String(Date.now()).slice(-4)}`, ...memberData, transactions: 0, spent: 'Rp 0', last: 'Belum ada', history: [] };
    if (!editingMember) customers.unshift(member);
    const savedIndex = savedCustomers.findIndex((customer) => customer.code === member.code);
    if (savedIndex >= 0) savedCustomers[savedIndex] = member;
    else savedCustomers.push(member);
    localStorage.setItem(customerStorageKey, JSON.stringify(savedCustomers));
    document.querySelector('#addCustomerModal').classList.remove('is-open');
    renderCustomerCounts(); setCustomerFilter('all');
    if (editingMember) openCustomerDetail(member);
    editingMember = null;
  });
  ['#customerDetailModal', '#addCustomerModal', '#deleteMemberConfirmModal', '#deleteMemberSuccessModal'].forEach((selector) => document.querySelector(selector).addEventListener('click', (event) => { if (event.target.id === event.currentTarget.id) event.currentTarget.classList.remove('is-open'); }));
  renderCustomerCounts(); renderCustomers();
}

const catalogTable = document.querySelector('#catalogTable');

if (catalogTable) {
  const catalogItems = [
    { id: 'PRD-001', name: 'Banner Flexi', description: 'Cetak banner untuk promosi dan acara.', category: 'Banner & Spanduk', type: 'product', price: 150000, unit: 'm²', active: true },
    { id: 'PRD-002', name: 'Undangan Custom', description: 'Cetak undangan dengan pilihan bahan premium.', category: 'Undangan', type: 'product', price: 2500, unit: 'lembar', active: true },
    { id: 'PRD-003', name: 'Stiker Vinyl', description: 'Stiker vinyl tahan air dengan cutting rapi.', category: 'Stiker', type: 'product', price: 8000, unit: 'lembar', active: true },
    { id: 'PRD-004', name: 'Sablon Kaos', description: 'Sablon kaos custom untuk komunitas dan usaha.', category: 'Sablon', type: 'product', price: 35000, unit: 'pcs', active: true },
    { id: 'PRD-005', name: 'Kartu Nama', description: 'Cetak kartu nama art carton 260 gsm.', category: 'Kartu Nama', type: 'product', price: 50000, unit: 'box', active: true },
    { id: 'PRD-006', name: 'Fotokopi Warna', description: 'Cetak dokumen warna kualitas tajam.', category: 'Cetak Dokumen', type: 'product', price: 1500, unit: 'lembar', active: true },
    { id: 'SRV-001', name: 'Jasa Desain', description: 'Pembuatan desain siap cetak.', category: 'Layanan Desain', type: 'service', price: 50000, unit: 'desain', active: true },
    { id: 'SRV-002', name: 'Laminasi Doff', description: 'Finishing laminasi doff untuk hasil elegan.', category: 'Finishing', type: 'service', price: 5000, unit: 'lembar', active: false },
  ];
  let catalogFilter = 'all';
  let catalogCategory = 'all';
  let editingCatalogItem = null;
  let catalogItemPendingDelete = null;
  const currency = (value) => `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;
  const catalogTypeLabel = (type) => type === 'service' ? 'Layanan' : 'Produk';

  function renderCatalogCounts() {
    document.querySelector('#catalogAllCount').textContent = catalogItems.length;
    document.querySelector('#catalogProductCount').textContent = catalogItems.filter((item) => item.type === 'product').length;
    document.querySelector('#catalogServiceCount').textContent = catalogItems.filter((item) => item.type === 'service').length;
    document.querySelector('#catalogActiveCount').textContent = catalogItems.filter((item) => item.active).length;
  }

  function renderCatalog() {
    const term = document.querySelector('#catalogSearch').value.toLowerCase().trim();
    const visibleItems = catalogItems.filter((item) => {
      const matchesFilter = catalogFilter === 'all' || (catalogFilter === 'active' ? item.active : catalogFilter === 'inactive' ? !item.active : item.type === catalogFilter);
      const matchesCategory = catalogCategory === 'all' || item.category === catalogCategory;
      const matchesSearch = `${item.name} ${item.category} ${item.description}`.toLowerCase().includes(term);
      return matchesFilter && matchesCategory && matchesSearch;
    });
    catalogTable.innerHTML = visibleItems.map((item) => `<tr><td><span class="catalog-name"><strong>${item.name}</strong><span>${item.description || 'Tanpa deskripsi'}</span></span></td><td>${item.category}</td><td><span class="catalog-type catalog-type--${item.type}">${catalogTypeLabel(item.type)}</span></td><td><strong>${currency(item.price)}</strong></td><td>${item.unit}</td><td><span class="catalog-status catalog-status--${item.active ? 'active' : 'inactive'}">${item.active ? 'Aktif' : 'Nonaktif'}</span></td><td><span class="catalog-actions"><button class="catalog-action" data-catalog-action="edit" data-catalog-id="${item.id}" type="button">Edit</button><button class="catalog-action catalog-action--delete" data-catalog-action="delete" data-catalog-id="${item.id}" type="button">Hapus</button></span></td></tr>`).join('');
    document.querySelector('#emptyCatalog').hidden = visibleItems.length !== 0;
  }

  function setCatalogFilter(filter) {
    catalogFilter = filter;
    document.querySelectorAll('[data-catalog-filter]').forEach((button) => button.classList.toggle('is-active', button.dataset.catalogFilter === filter));
    renderCatalog();
  }

  function openProductModal(item = null) {
    editingCatalogItem = item;
    const form = document.querySelector('#productForm');
    form.reset();
    document.querySelector('#productFormEyebrow').textContent = item ? 'EDIT KATALOG' : 'KATALOG BARU';
    document.querySelector('#productModalTitle').textContent = item ? 'Edit Produk' : 'Tambah Produk';
    document.querySelector('#saveProductButton').textContent = item ? 'Simpan Perubahan' : 'Simpan Produk';
    if (item) {
      document.querySelector('#productName').value = item.name;
      document.querySelector('#productCategory').value = item.category;
      document.querySelector('#productType').value = item.type;
      document.querySelector('#productPrice').value = item.price;
      document.querySelector('#productUnit').value = item.unit;
      document.querySelector('#productDescription').value = item.description;
      document.querySelector('#productActive').checked = item.active;
    }
    document.querySelector('#productModal').classList.add('is-open');
  }

  document.querySelectorAll('[data-catalog-filter]').forEach((button) => button.addEventListener('click', () => setCatalogFilter(button.dataset.catalogFilter)));
  document.querySelector('#catalogCategories').addEventListener('click', (event) => {
    const button = event.target.closest('[data-catalog-category]');
    if (!button) return;
    catalogCategory = button.dataset.catalogCategory;
    document.querySelectorAll('[data-catalog-category]').forEach((item) => item.classList.toggle('is-active', item === button));
    renderCatalog();
  });
  document.querySelector('#catalogSearch').addEventListener('input', renderCatalog);
  catalogTable.addEventListener('click', (event) => {
    const button = event.target.closest('[data-catalog-id]');
    if (!button) return;
    const item = catalogItems.find((catalogItem) => catalogItem.id === button.dataset.catalogId);
    if (!item) return;
    if (button.dataset.catalogAction === 'delete') {
      catalogItemPendingDelete = item;
      document.querySelector('#deleteCatalogName').textContent = item.name;
      document.querySelector('#deleteCatalogConfirmModal').classList.add('is-open');
      return;
    }
    openProductModal(item);
  });
  document.querySelector('#addProduct').addEventListener('click', () => openProductModal());
  document.querySelector('#closeProductModal').addEventListener('click', () => document.querySelector('#productModal').classList.remove('is-open'));
  document.querySelector('#productModal').addEventListener('click', (event) => { if (event.target.id === 'productModal') event.currentTarget.classList.remove('is-open'); });
  document.querySelector('#cancelDeleteCatalog').addEventListener('click', () => document.querySelector('#deleteCatalogConfirmModal').classList.remove('is-open'));
  document.querySelector('#confirmDeleteCatalog').addEventListener('click', () => {
    if (!catalogItemPendingDelete) return;
    const deletedCatalogName = catalogItemPendingDelete.name;
    catalogItems.splice(catalogItems.indexOf(catalogItemPendingDelete), 1);
    catalogItemPendingDelete = null;
    document.querySelector('#deletedCatalogSuccessName').textContent = deletedCatalogName;
    document.querySelector('#deleteCatalogConfirmModal').classList.remove('is-open');
    document.querySelector('#deleteCatalogSuccessModal').classList.add('is-open');
    renderCatalogCounts(); renderCatalog();
  });
  document.querySelector('#closeDeleteCatalogSuccess').addEventListener('click', () => document.querySelector('#deleteCatalogSuccessModal').classList.remove('is-open'));
  ['#deleteCatalogConfirmModal', '#deleteCatalogSuccessModal'].forEach((selector) => document.querySelector(selector).addEventListener('click', (event) => { if (event.target.id === event.currentTarget.id) event.currentTarget.classList.remove('is-open'); }));
  document.querySelector('#productForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = { name: document.querySelector('#productName').value.trim(), category: document.querySelector('#productCategory').value, type: document.querySelector('#productType').value, price: Number(document.querySelector('#productPrice').value), unit: document.querySelector('#productUnit').value, description: document.querySelector('#productDescription').value.trim(), active: document.querySelector('#productActive').checked };
    if (!formData.name || Number.isNaN(formData.price)) return;
    if (editingCatalogItem) Object.assign(editingCatalogItem, formData);
    else catalogItems.unshift({ id: `KAT-${String(Date.now()).slice(-4)}`, ...formData });
    document.querySelector('#productModal').classList.remove('is-open');
    renderCatalogCounts(); setCatalogFilter('all');
    editingCatalogItem = null;
  });
  renderCatalogCounts(); renderCatalog();
}
