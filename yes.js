function getCharSets() {
  const sets = [];
  if (document.getElementById("uppercase").checked) sets.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  if (document.getElementById("lowercase").checked) sets.push("abcdefghijklmnopqrstuvwxyz");
  if (document.getElementById("numbers").checked) sets.push("0123456789");
  if (document.getElementById("symbols").checked) sets.push("!@#$%^&*()_+[]{}|;:,.<>?");
  return sets;
}

function getSecureChar(charSet) {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return charSet[array[0] % charSet.length];
}

function generatePassword() {
  const length = parseInt(document.getElementById("length").value);
  const sets = getCharSets();
  const avoidAmbiguous = document.getElementById("noAmbiguous").checked;

  if (sets.length === 0) {
    showToast("Select at least one character type!");
    return;
  }

  let allChars = sets.join('');
  if (avoidAmbiguous) {
    allChars = allChars.replace(/[O0l1]/g, '');
  }

  let password = [];

  // Ensure one char from each selected set
  sets.forEach(set => {
    password.push(getSecureChar(set));
  });

  for (let i = password.length; i < length; i++) {
    password.push(getSecureChar(allChars));
  }

  // Secure shuffle
  for (let i = password.length - 1; i > 0; i--) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    const j = array[0] % (i + 1);
    [password[i], password[j]] = [password[j], password[i]];
  }

  const finalPassword = password.join('');
  document.getElementById("output").value = finalPassword;
  updateStrength(finalPassword, allChars.length);
  updateHistory(finalPassword);
  showToast("Yeh password kisi brute-force ke baap ko bhi na mile! 🔐");
}

function copyPassword() {
  const output = document.getElementById("output");
  output.select();
  document.execCommand("copy");
  showToast("Password copied to clipboard!");
}

function toggleVisibility() {
  const output = document.getElementById("output");
  output.type = output.type === "text" ? "password" : "text";
}

function updateStrength(password, poolSize) {
  const entropy = Math.round(password.length * Math.log2(poolSize));
  const bar = document.getElementById("strengthBar");
  bar.style.width = `${Math.min(entropy, 100)}%`;
  bar.style.background = entropy < 40 ? "red" : entropy < 70 ? "orange" : "green";
}

function updateHistory(password) {
  const history = document.getElementById("history");
  const item = document.createElement("li");
  item.textContent = password;
 
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}