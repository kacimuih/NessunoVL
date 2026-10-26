// Data Jobsheet Latihan Terstruktur Virtual Lab IPL
// SMK Kelas XI TITL

export const jobsheetData = [
  {
    id: "js1",
    title: "Jobsheet 1: Rangkaian 1 Lampu Kontrol 1 Saklar Tunggal",
    competency: "Siswa dapat merancang dan menguji rangkaian penerangan listrik 1-fasa menggunakan 1 sakelar tunggal untuk mengontrol 1 titik lampu pijar/LED sesuai standar PUIL.",
    toolsAndMaterials: [
      "Sumber Listrik 1-Fasa (L, N, PE)",
      "MCB 1-Fasa (sebagai pengaman utama)",
      "Saklar Tunggal",
      "Lampu",
      "Kabel Penghantar (Fasa: Merah/Kuning/Hitam, Netral: Biru)"
    ],
    instructions: [
      "Tempatkan komponen Sumber 1-Fasa, MCB 1-Fasa, Saklar Tunggal, dan Lampu di kanvas.",
      "Hubungkan terminal fasa Sumber (L) ke terminal masukan (in) MCB 1-Fasa.",
      "Hubungkan terminal keluaran (out) MCB 1-Fasa ke terminal masukan (in) Saklar Tunggal.",
      "Hubungkan terminal keluaran (out) Saklar Tunggal ke terminal fasa Lampu (L - titik tengah).",
      "Hubungkan terminal Netral Lampu (N) ke Netral Sumber (N).",
      "Aktifkan tombol 'Simulasikan', naikkan tuas MCB (ON), klik Saklar Tunggal, dan amati apakah lampu menyala tanpa ada peringatan kesalahan."
    ]
  },
  {
    id: "js2",
    title: "Jobsheet 2: Rangkaian 2 Lampu dengan 2 Saklar Tunggal Terpisah",
    competency: "Siswa dapat merakit rangkaian penerangan 1-fasa dengan dua saklar tunggal yang masing-masing mengontrol lampu secara terpisah (independen).",
    toolsAndMaterials: [
      "Sumber Listrik 1-Fasa (L, N, PE)",
      "MCB 1-Fasa",
      "2 Saklar Tunggal",
      "2 Lampu",
      "Kabel Penghantar (Fasa: Merah/Kuning/Hitam, Netral: Biru)"
    ],
    instructions: [
      "Tempatkan Sumber 1-Fasa, MCB 1-Fasa, 2 Saklar Tunggal, dan 2 Lampu.",
      "Hubungkan fasa Sumber (L) ke masukan MCB.",
      "Hubungkan keluaran MCB menuju masukan saklar 1, kemudian cabang (jumper/sambungkan) juga ke masukan saklar 2.",
      "Hubungkan keluaran saklar 1 ke fasa Lampu 1, dan keluaran saklar 2 ke fasa Lampu 2.",
      "Hubungkan netral kedua Lampu ke netral Sumber (bisa digabung/percabangan kabel).",
      "Simulasikan: pastikan Saklar 1 hanya mengontrol Lampu 1, dan Saklar 2 hanya mengontrol Lampu 2."
    ]
  },
  {
    id: "js3",
    title: "Jobsheet 3: Rangkaian Saklar Seri / Deret",
    competency: "Siswa mampu menginstalasi saklar seri (dua tombol dalam satu kotak) untuk mengontrol dua titik lampu secara mandiri dari satu lokasi.",
    toolsAndMaterials: [
      "Sumber Listrik 1-Fasa (L, N, PE)",
      "MCB 1-Fasa",
      "1 Saklar Seri",
      "2 Lampu",
      "Kabel Penghantar (Fasa: Merah/Kuning/Hitam, Netral: Biru)"
    ],
    instructions: [
      "Tempatkan Sumber 1-Fasa, MCB 1-Fasa, Saklar Seri, dan 2 Lampu.",
      "Hubungkan keluaran MCB ke terminal masukan fasa (in) Saklar Seri.",
      "Hubungkan terminal keluaran 1 (out1) Saklar Seri ke Lampu 1.",
      "Hubungkan terminal keluaran 2 (out2) Saklar Seri ke Lampu 2.",
      "Hubungkan netral kedua lampu menuju netral Sumber.",
      "Jalankan simulasi: tekan tombol kiri saklar seri untuk menyalakan lampu 1, tombol kanan untuk lampu 2."
    ]
  },
  {
    id: "js4",
    title: "Jobsheet 4: Rangkaian Stop Kontak Terpisah",
    competency: "Siswa mampu memasang stop kontak 1-fasa lengkap dengan grounding/arde pengaman secara terpisah dari sirkuit penerangan.",
    toolsAndMaterials: [
      "Sumber Listrik 1-Fasa (L, N, PE)",
      "MCB 1-Fasa",
      "Stop Kontak 1-Fasa",
      "Kabel Penghantar (Fasa: Merah/Kuning/Hitam, Netral: Biru, Ground: Kuning-Hijau)"
    ],
    instructions: [
      "Tempatkan Sumber 1-Fasa, MCB 1-Fasa, dan Stop Kontak.",
      "Hubungkan fasa keluaran MCB ke terminal Fasa Stop Kontak (L).",
      "Hubungkan Netral Sumber (N) ke terminal Netral Stop Kontak (N).",
      "Hubungkan Ground Sumber (PE) ke terminal Ground Stop Kontak (PE).",
      "Simulasikan: stop kontak harus terus bertegangan 220V dan arde terhubung dengan benar untuk menjamin keselamatan K3."
    ]
  },
  {
    id: "js5",
    title: "Jobsheet 5: Rangkaian Saklar Tukar / Hotel",
    competency: "Siswa mampu menginstalasi rangkaian saklar tukar (hotel) untuk mengontrol satu titik lampu dari dua lokasi berbeda, mensimulasikan instalasi tangga atau koridor panjang.",
    toolsAndMaterials: [
      "Sumber Listrik 1-Fasa (L, N, PE)",
      "MCB 1-Fasa",
      "2 Saklar Tukar (S3)",
      "1 Lampu",
      "Kabel Penghantar (Fasa: Merah/Kuning/Hitam, Netral: Biru)"
    ],
    instructions: [
      "Tempatkan Sumber 1-Fasa, MCB 1-Fasa, 2 Saklar Tukar, dan 1 Lampu.",
      "Hubungkan fasa keluaran MCB ke terminal induk/common (com) Saklar Tukar 1.",
      "Hubungkan terminal cabang L1 Saklar Tukar 1 ke terminal L1 Saklar Tukar 2.",
      "Hubungkan terminal cabang L2 Saklar Tukar 1 ke terminal L2 Saklar Tukar 2.",
      "Hubungkan terminal induk/common (com) Saklar Tukar 2 ke terminal Fasa Lampu.",
      "Hubungkan Netral Lampu ke Netral Sumber.",
      "Simulasikan: pastikan lampu dapat dinyalakan/dipadamkan baik dari Saklar 1 maupun Saklar 2 secara bergantian."
    ]
  },
  {
    id: "js6",
    title: "Jobsheet 6: Rangkaian Saklar Silang",
    competency: "Siswa mampu merakit rangkaian saklar silang yang dikombinasikan dengan dua saklar tukar untuk mengontrol satu lampu dari 3 lokasi berbeda.",
    toolsAndMaterials: [
      "Sumber Listrik 1-Fasa (L, N, PE)",
      "MCB 1-Fasa",
      "2 Saklar Tukar",
      "1 Saklar Silang",
      "1 Lampu",
      "Kabel Penghantar (Fasa: Merah/Kuning/Hitam, Netral: Biru)"
    ],
    instructions: [
      "Tempatkan Sumber 1-Fasa, MCB 1-Fasa, Saklar Tukar 1, Saklar Silang, Saklar Tukar 2, dan Lampu.",
      "Hubungkan keluaran MCB ke common Saklar Tukar 1.",
      "Hubungkan terminal L1/L2 Saklar Tukar 1 ke terminal input (in1/in2) Saklar Silang.",
      "Hubungkan terminal output (out1/out2) Saklar Silang ke terminal L1/L2 Saklar Tukar 2.",
      "Hubungkan common Saklar Tukar 2 ke fasa Lampu. Sambungkan netral lampu ke sumber.",
      "Simulasikan dan uji: saklar mana pun dari ke-3 lokasi harus bisa mengubah status lampu (ON <-> OFF)."
    ]
  },
  {
    id: "js7",
    title: "Jobsheet 7: Kombinasi Rangkaian Penerangan & Stop Kontak",
    competency: "Siswa dapat memasang rangkaian gabungan (kombinasi 1 lampu + 1 saklar tunggal dan 1 stop kontak) dalam 1 grup sirkuit MCB.",
    toolsAndMaterials: [
      "Sumber Listrik 1-Fasa (L, N, PE)",
      "MCB 1-Fasa",
      "Saklar Tunggal",
      "Lampu",
      "Stop Kontak 1-Fasa",
      "Kabel Penghantar (Fasa, Netral, Ground)"
    ],
    instructions: [
      "Tempatkan semua komponen: Sumber, MCB, Saklar, Lampu, dan Stop Kontak.",
      "Hubungkan keluaran MCB untuk mensuplai Saklar Tunggal dan Fasa Stop Kontak (lakukan percabangan kabel fasa setelah MCB).",
      "Hubungkan keluaran saklar tunggal ke fasa Lampu.",
      "Hubungkan Netral Lampu dan Netral Stop Kontak ke Netral Sumber.",
      "Hubungkan Ground Stop Kontak ke Ground Sumber.",
      "Uji simulasi: Stop kontak harus bertegangan konstan 220V, sementara Lampu dikontrol secara independen oleh Saklar Tunggal."
    ]
  },
  {
    id: "js8",
    title: "Jobsheet 8: Instalasi Penerangan 3-Fasa (Gedung Bertingkat)",
    competency: "Siswa mampu merakit panel hubung bagi (PHB) 3-fasa untuk membagi beban penerangan 1-fasa ke fasa R, S, T secara seimbang (balancing beban), dilengkapi MCB 3-fasa utama dan 3 MCB 1-fasa grup sirkuit.",
    toolsAndMaterials: [
      "Sumber Listrik 3-Fasa (R, S, T, N, PE)",
      "MCB 3-Fasa (Pengaman Utama Panel)",
      "3 MCB 1-Fasa (Pengaman Grup sirkuit Fasa R, S, T)",
      "3 Lampu (sebagai beban representasi Grup 1, 2, 3)",
      "Kabel Penghantar (Fasa R: Merah, Fasa S: Kuning, Fasa T: Hitam, Netral: Biru, Ground: Kuning-Hijau)"
    ],
    instructions: [
      "Tempatkan Sumber 3-Fasa, MCB 3-Fasa, dan 3 MCB 1-Fasa.",
      "Hubungkan fasa R, S, T Sumber masing-masing ke masukan atas MCB 3-Fasa (in_R, in_S, in_T).",
      "Hubungkan keluaran bawah MCB 3-Fasa: out_R ke masukan MCB 1-Fasa ke-1, out_S ke masukan MCB 1-Fasa ke-2, dan out_T ke masukan MCB 1-Fasa ke-3.",
      "Hubungkan keluaran masing-masing MCB 1-Fasa ke fasa Lampu 1, Lampu 2, dan Lampu 3. (Grup R -> Lampu 1, Grup S -> Lampu 2, Grup T -> Lampu 3).",
      "Hubungkan semua terminal Netral Lampu ke Netral Sumber.",
      "Jalankan simulasi: pastikan ketiga grup bekerja. Periksa indikator beban seimbang (setiap fasa memikul beban masing-masing 1 lampu)."
    ]
  }
];
