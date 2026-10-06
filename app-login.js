// app-login.js
document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("form-login");
  const btn = document.getElementById("btn-login");
  const hasilArea = document.getElementById("hasil-area");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    btn.disabled = true;
    btn.textContent = "Memeriksa...";
    hasilArea.innerHTML = "";

    try {
      // GANTI: Ambil user dari Supabase (bukan localStorage/JSON lokal)
      const user = await ambilUser(username);
      
      // LOGIKA HASH ASLI KAMU TETAP DIPERTAHANKAN 100%
      const bytes = window.CombiSaltHash.strToBytes(password);
      const hashHex = window.CombiSaltHash.formatHash(
        window.CombiSaltHash.hashCombiSalt(bytes, HASH_BITS),
        HASH_BITS
      );

      if (user && user.hashHex === hashHex) {
        setSessionUser(username);
        window.location.href = "index.html";
        return;
      }

      hasilArea.innerHTML = `<div class="status gagal">Username atau password salah.</div>`;
    } catch (err) {
      hasilArea.innerHTML = `<div class="status gagal">${err.message}</div>`;
    } finally {
      btn.disabled = false;
      btn.textContent = "Masuk";
    }
  });
});