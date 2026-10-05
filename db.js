// db.js - lapisan penyimpanan user.
// Sumber data "resmi" adalah file DB/database.json (di-commit ke repo).
// Saat halaman dibuka, data itu dimuat (seed) ke localStorage sebagai
// working storage selama sesi berjalan. Tombol Export di database.html
// dipakai untuk mengunduh ulang DB/database.json yang sudah diperbarui,
// supaya bisa ditimpa manual ke folder DB/ lalu di-commit ke GitHub.

const KUNCI_PENYIMPANAN = "combisalt_db";
const PATH_SEED = "DB/database.json";

function bacaSemua() {
  const raw = localStorage.getItem(KUNCI_PENYIMPANAN);
  return raw ? JSON.parse(raw) : [];
}

function simpanSemua(data) {
  localStorage.setItem(KUNCI_PENYIMPANAN, JSON.stringify(data));
}

/** Panggil sekali di awal tiap halaman: gabungkan seed DB/database.json
 * (kalau ada & belum pernah dimuat) ke localStorage. Aman dipanggil
 * berkali-kali (tidak menduplikasi). */
export async function muatSeed() {
  try {
    const res = await fetch(PATH_SEED, { cache: "no-store" });
    if (!res.ok) return;
    const seed = await res.json();
    if (!Array.isArray(seed)) return;
    const data = bacaSemua();
    let berubah = false;
    for (const u of seed) {
      if (u && u.username && !data.some((x) => x.username === u.username)) {
        data.push(u);
        berubah = true;
      }
    }
    if (berubah) simpanSemua(data);
  } catch {
    // Kalau dibuka langsung dari file:// (bukan lewat server), fetch bisa
    // gagal - tidak masalah, aplikasi tetap jalan pakai localStorage saja.
  }
}

/** Daftarkan user baru. Melempar Error kalau username sudah dipakai. */
export async function daftarkanUser(username, hashHex) {
  const data = bacaSemua();
  if (data.some((u) => u.username === username)) {
    throw new Error("Username sudah dipakai. Coba username lain.");
  }
  data.push({
    username,
    hashHex,
    waktuDaftar: new Date().toISOString(),
  });
  simpanSemua(data);
}

/** Ambil data satu user. null kalau tidak ada. */
export async function ambilUser(username) {
  const data = bacaSemua();
  return data.find((u) => u.username === username) || null;
}

/** Ambil seluruh user tersimpan (untuk halaman database). */
export async function ambilSemuaUser() {
  return bacaSemua();
}

/** Unduh seluruh data sebagai file database.json. */
export function exportKeFile() {
  const data = bacaSemua();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "database.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Hapus seluruh data di browser ini. */
export function hapusSemua() {
  localStorage.removeItem(KUNCI_PENYIMPANAN);
}
