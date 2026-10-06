// app-database.js
document.addEventListener("DOMContentLoaded", async () => {
  const tabelBody = document.getElementById("tabel-database");
  const btnExport = document.getElementById("btn-export");

  if (!tabelBody) return;

  tabelBody.innerHTML = `<tr><td colspan="2" style="text-align:center;">Memuat data dari server...</td></tr>`;

  try {
    // Ambil data dari Supabase
    const dataUsers = await ambilSemuaData();

    tabelBody.innerHTML = ""; // Kosongkan loading

    if (dataUsers.length === 0) {
      tabelBody.innerHTML = `<tr><td colspan="2" style="text-align:center;">Belum ada data user.</td></tr>`;
    } else {
      dataUsers.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${user.username}</td>
          <td style="font-family: monospace; font-size: 0.85em; word-break: break-all;">${user.hashHex}</td>
        `;
        tabelBody.appendChild(row);
      });
    }

    // Logika Export ke JSON (Tetap dipertahankan untuk kebutuhan laporan)
    if (btnExport) {
      btnExport.addEventListener("click", () => {
        if (dataUsers.length === 0) {
          alert("Tidak ada data untuk di-export!");
          return;
        }
        
        // Format agar mirip dengan struktur DB/database.json asli
        const dataExport = dataUsers.map(u => ({
          username: u.username,
          hash: u.hashHex 
        }));

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataExport, null, 2));
        const downloadAnchorNode = document.createElement("a");
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "database.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        alert("Data berhasil di-export ke database.json!");
      });
    }
  } catch (err) {
    tabelBody.innerHTML = `<tr><td colspan="2" style="text-align:center; color:red;">Gagal memuat data: ${err.message}</td></tr>`;
  }
});