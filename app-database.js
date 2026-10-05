import { muatSeed, ambilSemuaUser, exportKeFile } from "./db.js";

const tabelArea = document.getElementById("tabel-area");
const btnRefresh = document.getElementById("btn-refresh");
const btnExport = document.getElementById("btn-export");

async function muat() {
  await muatSeed();
  const users = await ambilSemuaUser();
  users.sort((a, b) => a.username.localeCompare(b.username));

  if (users.length === 0) {
    tabelArea.innerHTML = `<div class="ledger"><p>Belum ada akun terdaftar.</p></div>`;
    return;
  }

  let baris = "";
  for (const u of users) {
    baris += `<tr><td>${u.username}</td><td class="hex">${u.hashHex}</td></tr>`;
  }
  tabelArea.innerHTML = `
    <div class="ledger">
      <table class="data">
        <tr><th>Username</th><th>Hash (hex)</th></tr>
        ${baris}
      </table>
    </div>
  `;
}

btnRefresh.addEventListener("click", muat);
btnExport.addEventListener("click", () => exportKeFile());

muat();
