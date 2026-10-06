// app-daftar.js
document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("form-daftar");
  const btn = document.getElementById("btn-daftar");
  const hasilArea = document.getElementById("hasil-area");

  if (!form) return;

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
      // LOGIKA HASH ASLI KAMU TETAP DIPERTAHANKAN 100%
      const bytes = window.CombiSaltHash.strToBytes(password);
      const nilaiHash = window.CombiSaltHash.hashCombiSalt(bytes, HASH_BITS);
      const hashHex = window.CombiSaltHash.formatHash(nilaiHash, HASH_BITS);

      // GANTI: Simpan ke Supabase (bukan localStorage/JSON lokal)
      await daftarUser(username, hashHex);

      setSessionUser(username);
      window.location.href = "index.html";
    } catch (err) {
      hasilArea.innerHTML = `<div class="status gagal">${err.message}</div>`;
      btn.disabled = false;
      btn.textContent = "Daftar";
    }
  });
});