// db.js
const SUPABASE_URL = 'https://jfttoslzeptwyvfqtsxy.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdHRvc2x6ZXB0d3l2ZnF0c3h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyMTk5OTEsImV4cCI6MjEwNjc5NTk5MX0.NZGy7YyHCLLIAf0Nygyxuh8eaBl-SFrwzKc6mAbmJSw';

// Inisialisasi Supabase Client
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 1. DAFTAR: Simpan user baru ke tabel 'username'
async function daftarUser(username, hashHex) {
    const { data, error } = await db
        .from('username') // Nama tabel di Supabase
        .insert([{ username: username, hashHex: hashHex }]); // Nama kolom di Supabase

    if (error) {
        if (error.code === '23505') { // Error jika username sudah ada (Unique Violation)
            throw new Error("Username sudah dipakai orang lain!");
        }
        console.error("Error DB:", error);
        throw new Error("Gagal koneksi ke database.");
    }
    return true;
}

// 2. LOGIN: Cari user berdasarkan username
async function ambilUser(username) {
    const { data, error } = await db
        .from('username')
        .select('username, hashHex')
        .eq('username', username)
        .single(); // Ambil hanya 1 data

    if (error || !data) return null; // Jika tidak ditemukan
    return data;
}

// 3. DATABASE: Ambil semua data untuk ditampilkan di halaman database.html
async function ambilSemuaData() {
    const { data, error } = await db
        .from('username')
        .select('username, hashHex');

    if (error) {
        console.error("Error ambil data:", error);
        return [];
    }
    return data || [];
}