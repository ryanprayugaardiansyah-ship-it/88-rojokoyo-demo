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
