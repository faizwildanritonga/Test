// db.js - lapisan penyimpanan user (Supabase, database pusat online).
// Hanya file ini yang diubah dari versi localStorage: nama fungsi & bentuk
// data yang dikembalikan sama persis, jadi file app-*.js tidak perlu diubah.
//
// ISI DUA NILAI DI BAWAH dari Supabase:
//   Project Settings -> API -> Project URL  &  anon / publishable key
// (anon key memang aman dipublikasikan selama RLS aktif.)

const SUPABASE_URL = "https://jfttoslzeptwyvfqtsxy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdHRvc2x6ZXB0d3l2ZnF0c3h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyMTk5OTEsImV4cCI6MjEwNjc5NTk5MX0.NZGy7YyHCLLIAf0Nygyxuh8eaBl-SFrwzKc6mAbmJSw";
const TABEL = "username";

const ENDPOINT = `${SUPABASE_URL}/rest/v1/${TABEL}`;
const HEADER_DASAR = {
  apikey: SUPABASE_ANON_KEY,
  "Content-Type": "application/json",
};

function cekKonfigurasi() {
  if (SUPABASE_URL.includes("GANTI-") || SUPABASE_ANON_KEY.includes("GANTI-")) {
    throw new Error("Supabase belum dikonfigurasi. Isi SUPABASE_URL dan SUPABASE_ANON_KEY di db.js.");
  }
}

async function panggil(url, opsi = {}) {
  cekKonfigurasi();
  let res;
  try {
    res = await fetch(url, { ...opsi, headers: { ...HEADER_DASAR, ...(opsi.headers || {}) } });
  } catch {
    throw new Error("Tidak bisa terhubung ke database. Periksa koneksi internet.");
  }
  return res;
}

/** Dulu: memuat seed ke localStorage. Sekarang data sudah di Supabase,
 * jadi tidak ada yang perlu dimuat. Dipertahankan agar import lama tetap jalan. */
export async function muatSeed() {}

/** Daftarkan user baru. Melempar Error kalau username sudah dipakai. */
export async function daftarkanUser(username, hashHex) {
  const res = await panggil(ENDPOINT, {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ username, hashHex }),
  });
  if (res.ok) return;

  let err = null;
  try { err = await res.json(); } catch {}
  if (res.status === 409 || (err && err.code === "23505")) {
    throw new Error("Username sudah dipakai. Coba username lain.");
  }
  throw new Error("Gagal mendaftar: " + ((err && err.message) || `HTTP ${res.status}`));
}

/** Ambil data satu user. null kalau tidak ada. */
export async function ambilUser(username) {
  const url = `${ENDPOINT}?username=eq.${encodeURIComponent(username)}&select=username,hashHex,created_at&limit=1`;
  const res = await panggil(url);
  if (!res.ok) throw new Error(`Gagal mengambil data user (HTTP ${res.status}).`);
  const rows = await res.json();
  return rows.length ? rows[0] : null;
}

/** Ambil seluruh user tersimpan (untuk halaman database). */
export async function ambilSemuaUser() {
  const res = await panggil(`${ENDPOINT}?select=username,hashHex,created_at&order=username.asc`);
  if (!res.ok) throw new Error(`Gagal mengambil data database (HTTP ${res.status}).`);
  return await res.json();
}

/** Unduh seluruh data (dari Supabase) sebagai file database.json. */
export async function exportKeFile() {
  const data = await ambilSemuaUser();
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

/** Tidak lagi menghapus apa pun: data ada di server (tidak ada policy delete). */
export function hapusSemua() {}
