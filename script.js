const resultEl = document.getElementById('result');
const lengthEl = document.getElementById('length');
const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const generateEl = document.getElementById('generate');
const clipboardEl = document.getElementById('clipboard');
const toggleVisibilityEl = document.getElementById('toggle-visibility');
const strengthEl = document.getElementById('strength-value');
const errorMessage = document.getElementById('error-message');

const randomFunc = {
  lower: () => String.fromCharCode(Math.random() * 26 + 97),
  upper: () => String.fromCharCode(Math.random() * 26 + 65),
  number: () => String.fromCharCode(Math.random() * 10 + 48),
  symbol: () => "!@#$%^&*(){}[]=<>/,.".charAt(Math.floor(Math.random() * 20)),
};

clipboardEl.addEventListener('click', () => {
  const password = resultEl.innerText;
  if (!password) return;
  navigator.clipboard.writeText(password);
  clipboardEl.innerHTML = '<i class="fas fa-check"></i>';
  setTimeout(() => clipboardEl.innerHTML = '<i class="fas fa-copy"></i>', 1500);
});

toggleVisibilityEl.addEventListener('click', () => {
  const visible = resultEl.dataset.visible === "true";
  resultEl.innerText = visible ? '*'.repeat(resultEl.innerText.length) : resultEl.dataset.password || '';
  resultEl.dataset.visible = !visible;
  toggleVisibilityEl.innerHTML = visible ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
});

generateEl.addEventListener('click', () => {
  const length = +lengthEl.value;
  const hasLower = lowercaseEl.checked;
  const hasUpper = uppercaseEl.checked;
  const hasNumber = numbersEl.checked;
  const hasSymbol = symbolsEl.checked;

  errorMessage.innerText = '';

  if (!(hasLower || hasUpper || hasNumber || hasSymbol)) {
    errorMessage.innerText = '⚠️ Select at least one character type.';
    return;
  }

  const password = generatePassword(hasLower, hasUpper, hasNumber, hasSymbol, length);
  resultEl.innerText = password;
  resultEl.dataset.password = password;
  resultEl.dataset.visible = true;
  toggleVisibilityEl.innerHTML = '<i class="fas fa-eye-slash"></i>';
  updateStrength(password);
});

function generatePassword(lower, upper, number, symbol, length) {
  let generatedPassword = '';
  const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(t => Object.values(t)[0]);

  for (let i = 0; i < length; i += typesArr.length) {
    typesArr.forEach(type => {
      const func = randomFunc[Object.keys(type)[0]];
      generatedPassword += func();
    });
  }
  return generatedPassword.slice(0, length);
}

function updateStrength(password) {
  const length = password.length;
  let score = 0;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  if (length >= 12) score++;

  const strengthLevels = ['Weak', 'Moderate', 'Strong', 'Very Strong', 'Excellent'];
  strengthEl.innerText = strengthLevels[score - 1] || 'Weak';
}
