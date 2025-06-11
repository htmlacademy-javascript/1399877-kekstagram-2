function isPalindrome(str) {
  const normalized = str + ''
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/\s/g, '');
  return normalized === normalized.split('').reverse().join('');
}

console.log(isPalindrome());

function extractDigits(value) {
  const digits = value.toString().match(/\d/g);
  return digits ? parseInt(digits.join(''), 10) : NaN;
}

console.log(extractDigits('1 кефир, 0.5 батона'));
