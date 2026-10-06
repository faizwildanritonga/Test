import { HASH_BITS } from "./config.js";
import { muatSeed, daftarkanUser } from "./db.js";
import { setSessionUser, getSessionUser } from "./auth.js";

if (getSessionUser()) {
  window.location.href = "index.html";
}

await muatSeed();

const form = document.getElementById("form-daftar");
const btn = document.getElementById("btn-daftar");
const hasilArea = document.getElementById("hasil-area");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (!username || !password) {
    hasilArea.innerHTML = `<div class="status gagal">Username dan password wajib diisi.</div>`;
    return;
  }

  btn.disabled = true;
  btn.textContent = "Mendaftarkan...";
  hasilArea.innerHTML = "";

  try {
    const bytes = window.CombiSaltHash.strToBytes(password);
    const nilaiHash = window.CombiSaltHash.hashCombiSalt(bytes, HASH_BITS);
    const hashHex = window.CombiSaltHash.formatHash(nilaiHash, HASH_BITS);

    await daftarkanUser(username, hashHex);

    setSessionUser(username);
    window.location.href = "index.html";
  } catch (err) {
    hasilArea.innerHTML = `<div class="status gagal">${err.message}</div>`;
    btn.disabled = false;
    btn.textContent = "Daftar";
  }
});
