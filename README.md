# Portal Kelas - Versi Combi-Salt (Web Utama)

Web login sederhana yang password-nya di-hash pakai **Combi-Salt**
(rank kombinatorik) sebelum disimpan. Ini versi "aman" - nanti akan
ada versi pembanding tanpa Combi-Salt untuk uji collision.

## Struktur

```
web_combinatorik/
├── index.html        halaman utama (terproteksi) - "Halo, {username}"
├── login.html          form masuk
├── daftar.html          form daftar
├── database.html         lihat isi DB/database.json + tombol export
├── DB/
│   └── database.json      "database" - username + hash saja, TANPA password
├── style.css
├── config.js               HASH_BITS = 8 (JANGAN diubah, harus sama dgn versi pembanding)
├── hash.js                   logika Combi-Salt (jangan diedit)
├── db.js                      baca/tulis data (localStorage + seed dari DB/database.json)
├── auth.js                     sesi login (sessionStorage)
├── app-login.js, app-daftar.js, app-home.js, app-database.js
```

## Cara Coba di Komputer Sendiri

```
cd web_combinatorik
python -m http.server 8000
```
Buka `http://localhost:8000/daftar.html`.

## Alur Pakai

1. Buka **daftar.html**, bikin akun -> otomatis langsung masuk ke
   homepage ("Halo, username!").
2. Klik **Keluar** untuk logout, coba **login.html** lagi.
3. Buka **database.html** untuk lihat isi `DB/database.json` (cuma
   username + hash hex, tidak ada password).
4. Kalau mau data yang terkumpul (misal semua teman sekelas daftar di
   laptop kamu) jadi file permanen: klik **Export ke database.json**
   di halaman database, lalu timpa file `DB/database.json` di folder
   project dengan file hasil download itu.

## Deploy ke GitHub Pages

1. Upload seluruh isi folder ini ke repository GitHub.
2. Settings -> Pages -> Source: branch `main`, folder `/ (root)`.
3. Tunggu sebentar, link-nya muncul di halaman yang sama.

## Catatan

- `config.js` (HASH_BITS = 8) harus **sama persis** dengan versi
  pembanding (tanpa combinatorik) supaya perbandingannya adil.
- `hash.js` di sini sama persis dengan versi desktop Python yang sudah
  divalidasi sebelumnya (hasil hash-nya identik).
