/*
 * hash.js - Inti logika hashing untuk Combi-Salt Password Demo
 * ==============================================================
 * Port langsung dari program Python "Combi-Salt File Integrity Checker"
 * pada mini riset Matematika Diskrit. Tiga skema yang sama persis:
 *
 *   Skema A - hash sederhana biasa (jumlah byte mod k)           [BASELINE LEMAH]
 *   Skema B - hash sederhana + Combi-Salt (rank kombinatorik)    [USULAN KITA]
 *   Skema C - SHA-256 bawaan browser, dipotong ke k slot         [BASELINE KUAT]
 *
 * Memakai BigInt bawaan JavaScript supaya bisa menghitung nilai kombinasi
 * C(n,r) secara presisi penuh (sama seperti math.comb di Python).
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.CombiSaltHash = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // Byte per blok. Lihat README bagian "Catatan Performa" untuk alasan
  // angka ini (sama seperti versi Python: mencegah ledakan kombinatorik
  // pada input yang panjang, meski untuk password biasanya cuma 1 blok).
  const UKURAN_CHUNK = 64;

  /** Hitung C(n, r) secara presisi penuh memakai BigInt. */
  function combBigInt(n, r) {
    if (r < 0 || r > n) return 0n;
    r = Math.min(r, n - r);
    let hasil = 1n;
    for (let i = 0; i < r; i++) {
      hasil = (hasil * BigInt(n - i)) / BigInt(i + 1);
    }
    return hasil;
  }

  /** Posisi (1-indexed, relatif terhadap blok) byte yang nilainya ganjil. */
  function posisiGanjil(bytes) {
    const posisi = [];
    for (let i = 0; i < bytes.length; i++) {
      if (bytes[i] % 2 === 1) posisi.push(i + 1);
    }
    return posisi;
  }

  /** Rank Combinatorial Number System: R = C(c1,1) + C(c2,2) + ... + C(ck,k) */
  function rankKombinatorik(posisi) {
    if (posisi.length === 0) return 0n;
    let total = 0n;
    for (let idx = 0; idx < posisi.length; idx++) {
      total += combBigInt(posisi[idx], idx + 1);
    }
    return total;
  }

  /** Terapkan Combi-Salt: proses per blok 64 byte, tempel salt ke data asli. */
  function combiSalt(bytes) {
    let totalSalt = 0n;
    for (let start = 0; start < bytes.length; start += UKURAN_CHUNK) {
      const blok = bytes.slice(start, start + UKURAN_CHUNK);
      const posisi = posisiGanjil(blok);
      const rankBlok = rankKombinatorik(posisi);
      const nomorBlok = BigInt(Math.floor(start / UKURAN_CHUNK) + 1);
      totalSalt += rankBlok * nomorBlok;
    }
    const ekor = new TextEncoder().encode("|" + totalSalt.toString());
    const hasil = new Uint8Array(bytes.length + ekor.length);
    hasil.set(bytes, 0);
    hasil.set(ekor, bytes.length);
    return hasil;
  }

  /** Skema A - jumlah semua byte, dimodulo 2^bits. */
  function hashSederhana(bytes, bits) {
    const k = Math.pow(2, bits);
    let jumlah = 0;
    for (let i = 0; i < bytes.length; i++) jumlah += bytes[i];
    return jumlah % k;
  }

  /** Skema B - hash sederhana, tapi data di-Combi-Salt dahulu. */
  function hashCombiSalt(bytes, bits) {
    return hashSederhana(combiSalt(bytes), bits);
  }

  function bytesToBigIntBE(bytes) {
    let hasil = 0n;
    for (let i = 0; i < bytes.length; i++) {
      hasil = (hasil << 8n) | BigInt(bytes[i]);
    }
    return hasil;
  }

  /** Skema C - SHA-256 asli (Web Crypto API bawaan browser), dipotong ke k slot. */
  async function hashSha256Dipotong(bytes, bits) {
    const digestBuffer = await crypto.subtle.digest("SHA-256", bytes);
    const digestBytes = new Uint8Array(digestBuffer);
    const asBigInt = bytesToBigIntBE(digestBytes);
    const k = 1n << BigInt(bits);
    return Number(asBigInt % k);
  }

  /** Ubah nilai hash jadi string heksadesimal, lebar menyesuaikan jumlah bit. */
  function formatHash(nilai, bits) {
    const digitHex = Math.max(2, Math.ceil(bits / 4));
    const n = typeof nilai === "bigint" ? nilai : BigInt(nilai);
    return n.toString(16).padStart(digitHex, "0");
  }

  function strToBytes(str) {
    return new TextEncoder().encode(str);
  }

  /** Hitung ketiga skema sekaligus untuk satu string (misal: password). */
  async function hitungSemuaHash(teks, bits) {
    const bytes = strToBytes(teks);
    const a = hashSederhana(bytes, bits);
    const b = hashCombiSalt(bytes, bits);
    const c = await hashSha256Dipotong(bytes, bits);
    return {
      a, b, c,
      aHex: formatHash(a, bits),
      bHex: formatHash(b, bits),
      cHex: formatHash(c, bits),
    };
  }

  return {
    UKURAN_CHUNK,
    combBigInt,
    posisiGanjil,
    rankKombinatorik,
    combiSalt,
    hashSederhana,
    hashCombiSalt,
    hashSha256Dipotong,
    formatHash,
    strToBytes,
    hitungSemuaHash,
  };
});
