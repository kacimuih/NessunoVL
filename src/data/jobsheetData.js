// Data Jobsheet Latihan Terstruktur Virtual Lab IPL
// SMK Kelas XI TITL

export const jobsheetData = [
  {
    "id": "js1",
    "title": "Jobsheet 1: Rangkaian 1 Lampu Kontrol 1 Saklar Tunggal",
    "competency": "Siswa dapat merancang dan menguji rangkaian penerangan listrik 1-fasa menggunakan 1 sakelar tunggal untuk mengontrol 1 titik lampu pijar/LED sesuai standar PUIL.",
    "toolsAndMaterials": [
      "Sumber Listrik 1-Fasa (L, N, PE)",
      "MCB 1-Fasa (sebagai pengaman utama)",
      "Saklar Tunggal",
      "Lampu",
      "Kabel Penghantar (Fasa: Merah/Kuning/Hitam, Netral: Biru)"
    ],
    "instructions": [
      "Tempatkan komponen Sumber 1-Fasa, MCB 1-Fasa, Saklar Tunggal, dan Lampu di kanvas.",
      "Hubungkan terminal fasa Sumber (L) ke terminal masukan (in) MCB 1-Fasa.",
      "Hubungkan terminal keluaran (out) MCB 1-Fasa ke terminal masukan (in) Saklar Tunggal.",
      "Hubungkan terminal keluaran (out) Saklar Tunggal ke terminal fasa Lampu (L - titik tengah).",
      "Hubungkan terminal Netral Lampu (N) ke Netral Sumber (N).",
      "Aktifkan tombol 'Simulasikan', naikkan tuas MCB (ON), klik Saklar Tunggal, dan amati apakah lampu menyala tanpa ada peringatan kesalahan."
    ],
    "workingDrawing": {
      "width": 560,
      "height": 240,
      "components": [
        {
          "id": "src",
          "type": "Source_1P",
          "x": 30,
          "y": 50
        },
        {
          "id": "mcb",
          "type": "MCB_1P",
          "x": 170,
          "y": 70
        },
        {
          "id": "sw",
          "type": "SwitchSingle",
          "x": 300,
          "y": 80
        },
        {
          "id": "lamp",
          "type": "Lamp",
          "x": 440,
          "y": 80
        }
      ],
      "wires": [
        {
          "from": "src.L",
          "to": "mcb.in",
          "color": "phase",
          "step": 2,
          "via": [
            [
              130,
              105
            ],
            [
              130,
              45
            ],
            [
              200,
              45
            ]
          ]
        },
        {
          "from": "mcb.out",
          "to": "sw.in",
          "color": "phase",
          "step": 3,
          "via": [
            [
              200,
              195
            ],
            [
              265,
              195
            ],
            [
              265,
              55
            ],
            [
              330,
              55
            ]
          ]
        },
        {
          "from": "sw.out",
          "to": "lamp.L",
          "color": "phase",
          "step": 4,
          "via": [
            [
              330,
              185
            ],
            [
              465,
              185
            ]
          ]
        },
        {
          "from": "lamp.N",
          "to": "src.N",
          "color": "neutral",
          "step": 5,
          "via": [
            [
              495,
              30
            ],
            [
              145,
              30
            ],
            [
              145,
              135
            ]
          ]
        }
      ],
      "junctions": []
    }
  },
  {
    "id": "js2",
    "title": "Jobsheet 2: Rangkaian 2 Lampu dengan 2 Saklar Tunggal Terpisah",
    "competency": "Siswa dapat merakit rangkaian penerangan 1-fasa dengan dua saklar tunggal yang masing-masing mengontrol lampu secara terpisah (independen).",
    "toolsAndMaterials": [
      "Sumber Listrik 1-Fasa (L, N, PE)",
      "MCB 1-Fasa",
      "2 Saklar Tunggal",
      "2 Lampu",
      "Kabel Penghantar (Fasa: Merah/Kuning/Hitam, Netral: Biru)"
    ],
    "instructions": [
      "Tempatkan Sumber 1-Fasa, MCB 1-Fasa, 2 Saklar Tunggal, dan 2 Lampu.",
      "Hubungkan fasa Sumber (L) ke masukan MCB.",
      "Hubungkan keluaran MCB menuju masukan saklar 1, kemudian cabang (jumper/sambungkan) juga ke masukan saklar 2.",
      "Hubungkan keluaran saklar 1 ke fasa Lampu 1, dan keluaran saklar 2 ke fasa Lampu 2.",
      "Hubungkan netral kedua Lampu ke netral Sumber (bisa digabung/percabangan kabel).",
      "Simulasikan: pastikan Saklar 1 hanya mengontrol Lampu 1, dan Saklar 2 hanya mengontrol Lampu 2."
    ],
    "workingDrawing": {
      "width": 580,
      "height": 310,
      "components": [
        {
          "id": "src",
          "type": "Source_1P",
          "x": 30,
          "y": 80
        },
        {
          "id": "mcb",
          "type": "MCB_1P",
          "x": 170,
          "y": 100
        },
        {
          "id": "sw1",
          "type": "SwitchSingle",
          "label": "Saklar 1",
          "x": 310,
          "y": 40
        },
        {
          "id": "sw2",
          "type": "SwitchSingle",
          "label": "Saklar 2",
          "x": 310,
          "y": 170
        },
        {
          "id": "lamp1",
          "type": "Lamp",
          "label": "Lampu 1",
          "x": 450,
          "y": 40
        },
        {
          "id": "lamp2",
          "type": "Lamp",
          "label": "Lampu 2",
          "x": 450,
          "y": 170
        }
      ],
      "wires": [
        {
          "from": "src.L",
          "to": "mcb.in",
          "color": "phase",
          "step": 2,
          "via": [
            [
              130,
              135
            ],
            [
              130,
              75
            ],
            [
              200,
              75
            ]
          ]
        },
        {
          "from": "mcb.out",
          "to": "sw1.in",
          "color": "phase",
          "step": 3,
          "via": [
            [
              200,
              220
            ],
            [
              260,
              220
            ],
            [
              260,
              25
            ],
            [
              340,
              25
            ]
          ]
        },
        {
          "from": "mcb.out",
          "to": "sw2.in",
          "color": "phase",
          "step": 3,
          "via": [
            [
              200,
              220
            ],
            [
              260,
              220
            ],
            [
              260,
              155
            ],
            [
              340,
              155
            ]
          ]
        },
        {
          "from": "sw1.out",
          "to": "lamp1.L",
          "color": "phase",
          "step": 4,
          "via": [
            [
              340,
              135
            ],
            [
              415,
              135
            ],
            [
              415,
              80
            ],
            [
              475,
              80
            ]
          ]
        },
        {
          "from": "sw2.out",
          "to": "lamp2.L",
          "color": "phase",
          "step": 4,
          "via": [
            [
              340,
              265
            ],
            [
              415,
              265
            ],
            [
              415,
              210
            ],
            [
              475,
              210
            ]
          ]
        },
        {
          "from": "lamp1.N",
          "to": "src.N",
          "color": "neutral",
          "step": 5,
          "via": [
            [
              505,
              80
            ],
            [
              545,
              80
            ],
            [
              545,
              290
            ],
            [
              145,
              290
            ],
            [
              145,
              165
            ]
          ]
        },
        {
          "from": "lamp2.N",
          "to": "src.N",
          "color": "neutral",
          "step": 5,
          "via": [
            [
              505,
              210
            ],
            [
              545,
              210
            ],
            [
              545,
              290
            ],
            [
              145,
              290
            ],
            [
              145,
              165
            ]
          ]
        }
      ],
      "junctions": [
        [
          260,
          220
        ],
        [
          545,
          210
        ]
      ]
    }
  },
  {
    "id": "js3",
    "title": "Jobsheet 3: Rangkaian Saklar Seri / Deret",
    "competency": "Siswa mampu menginstalasi saklar seri (dua tombol dalam satu kotak) untuk mengontrol dua titik lampu secara mandiri dari satu lokasi.",
    "toolsAndMaterials": [
      "Sumber Listrik 1-Fasa (L, N, PE)",
      "MCB 1-Fasa",
      "1 Saklar Seri",
      "2 Lampu",
      "Kabel Penghantar (Fasa: Merah/Kuning/Hitam, Netral: Biru)"
    ],
    "instructions": [
      "Tempatkan Sumber 1-Fasa, MCB 1-Fasa, Saklar Seri, dan 2 Lampu.",
      "Hubungkan keluaran MCB ke terminal masukan fasa (in) Saklar Seri.",
      "Hubungkan terminal keluaran 1 (out1) Saklar Seri ke Lampu 1.",
      "Hubungkan terminal keluaran 2 (out2) Saklar Seri ke Lampu 2.",
      "Hubungkan netral kedua lampu menuju netral Sumber.",
      "Jalankan simulasi: tekan tombol kiri saklar seri untuk menyalakan lampu 1, tombol kanan untuk lampu 2."
    ],
    "workingDrawing": {
      "width": 580,
      "height": 310,
      "components": [
        {
          "id": "src",
          "type": "Source_1P",
          "x": 30,
          "y": 80
        },
        {
          "id": "mcb",
          "type": "MCB_1P",
          "x": 160,
          "y": 100
        },
        {
          "id": "sw",
          "type": "SwitchDouble",
          "label": "Saklar Seri",
          "x": 290,
          "y": 100
        },
        {
          "id": "lamp1",
          "type": "Lamp",
          "label": "Lampu 1",
          "x": 450,
          "y": 40
        },
        {
          "id": "lamp2",
          "type": "Lamp",
          "label": "Lampu 2",
          "x": 450,
          "y": 170
        }
      ],
      "wires": [
        {
          "from": "src.L",
          "to": "mcb.in",
          "color": "phase",
          "step": 2,
          "via": [
            [
              125,
              135
            ],
            [
              125,
              75
            ],
            [
              190,
              75
            ]
          ]
        },
        {
          "from": "mcb.out",
          "to": "sw.in",
          "color": "phase",
          "step": 2,
          "via": [
            [
              190,
              220
            ],
            [
              330,
              220
            ],
            [
              330,
              170
            ]
          ]
        },
        {
          "from": "sw.out1",
          "to": "lamp1.L",
          "color": "phase",
          "step": 3,
          "via": [
            [
              315,
              75
            ],
            [
              410,
              75
            ],
            [
              410,
              80
            ],
            [
              475,
              80
            ]
          ]
        },
        {
          "from": "sw.out2",
          "to": "lamp2.L",
          "color": "phase",
          "step": 4,
          "via": [
            [
              345,
              85
            ],
            [
              390,
              85
            ],
            [
              390,
              210
            ],
            [
              475,
              210
            ]
          ]
        },
        {
          "from": "lamp1.N",
          "to": "src.N",
          "color": "neutral",
          "step": 5,
          "via": [
            [
              505,
              80
            ],
            [
              545,
              80
            ],
            [
              545,
              290
            ],
            [
              140,
              290
            ],
            [
              140,
              165
            ]
          ]
        },
        {
          "from": "lamp2.N",
          "to": "src.N",
          "color": "neutral",
          "step": 5,
          "via": [
            [
              505,
              210
            ],
            [
              545,
              210
            ],
            [
              545,
              290
            ],
            [
              140,
              290
            ],
            [
              140,
              165
            ]
          ]
        }
      ],
      "junctions": [
        [
          545,
          210
        ]
      ]
    }
  },
  {
    "id": "js4",
    "title": "Jobsheet 4: Rangkaian Stop Kontak Terpisah",
    "competency": "Siswa mampu memasang stop kontak 1-fasa lengkap dengan grounding/arde pengaman secara terpisah dari sirkuit penerangan.",
    "toolsAndMaterials": [
      "Sumber Listrik 1-Fasa (L, N, PE)",
      "MCB 1-Fasa",
      "Stop Kontak 1-Fasa",
      "Kabel Penghantar (Fasa: Merah/Kuning/Hitam, Netral: Biru, Ground: Kuning-Hijau)"
    ],
    "instructions": [
      "Tempatkan Sumber 1-Fasa, MCB 1-Fasa, dan Stop Kontak.",
      "Hubungkan fasa keluaran MCB ke terminal Fasa Stop Kontak (L).",
      "Hubungkan Netral Sumber (N) ke terminal Netral Stop Kontak (N).",
      "Hubungkan Ground Sumber (PE) ke terminal Ground Stop Kontak (PE).",
      "Simulasikan: stop kontak harus terus bertegangan 220V dan arde terhubung dengan benar untuk menjamin keselamatan K3."
    ],
    "workingDrawing": {
      "width": 500,
      "height": 240,
      "components": [
        {
          "id": "src",
          "type": "Source_1P",
          "x": 30,
          "y": 50
        },
        {
          "id": "mcb",
          "type": "MCB_1P",
          "x": 180,
          "y": 65
        },
        {
          "id": "sock",
          "type": "Socket",
          "label": "Stop Kontak",
          "x": 340,
          "y": 75
        }
      ],
      "wires": [
        {
          "from": "src.L",
          "to": "mcb.in",
          "color": "phase",
          "step": 2,
          "via": [
            [
              135,
              105
            ],
            [
              135,
              45
            ],
            [
              210,
              45
            ]
          ]
        },
        {
          "from": "mcb.out",
          "to": "sock.L",
          "color": "phase",
          "step": 2,
          "via": [
            [
              210,
              185
            ],
            [
              290,
              185
            ],
            [
              290,
              115
            ],
            [
              365,
              115
            ]
          ]
        },
        {
          "from": "src.N",
          "to": "sock.N",
          "color": "neutral",
          "step": 3,
          "via": [
            [
              145,
              135
            ],
            [
              145,
              205
            ],
            [
              395,
              205
            ]
          ]
        },
        {
          "from": "src.PE",
          "to": "sock.PE",
          "color": "earth",
          "step": 4,
          "via": [
            [
              160,
              165
            ],
            [
              160,
              225
            ],
            [
              380,
              225
            ]
          ]
        }
      ],
      "junctions": []
    }
  },
  {
    "id": "js5",
    "title": "Jobsheet 5: Rangkaian Saklar Tukar / Hotel",
    "competency": "Siswa mampu menginstalasi rangkaian saklar tukar (hotel) untuk mengontrol satu titik lampu dari dua lokasi berbeda, mensimulasikan instalasi tangga atau koridor panjang.",
    "toolsAndMaterials": [
      "Sumber Listrik 1-Fasa (L, N, PE)",
      "MCB 1-Fasa",
      "2 Saklar Tukar (S3)",
      "1 Lampu",
      "Kabel Penghantar (Fasa: Merah/Kuning/Hitam, Netral: Biru)"
    ],
    "instructions": [
      "Tempatkan Sumber 1-Fasa, MCB 1-Fasa, 2 Saklar Tukar, dan 1 Lampu.",
      "Hubungkan fasa keluaran MCB ke terminal induk/common (com) Saklar Tukar 1.",
      "Hubungkan terminal cabang L1 Saklar Tukar 1 ke terminal L1 Saklar Tukar 2.",
      "Hubungkan terminal cabang L2 Saklar Tukar 1 ke terminal L2 Saklar Tukar 2.",
      "Hubungkan terminal induk/common (com) Saklar Tukar 2 ke terminal Fasa Lampu.",
      "Hubungkan Netral Lampu ke Netral Sumber.",
      "Simulasikan: pastikan lampu dapat dinyalakan/dipadamkan baik dari Saklar 1 maupun Saklar 2 secara bergantian."
    ],
    "workingDrawing": {
      "width": 700,
      "height": 260,
      "components": [
        {
          "id": "src",
          "type": "Source_1P",
          "x": 30,
          "y": 60
        },
        {
          "id": "mcb",
          "type": "MCB_1P",
          "x": 160,
          "y": 75
        },
        {
          "id": "sw1",
          "type": "SwitchWay3",
          "label": "Saklar Tukar 1",
          "x": 280,
          "y": 85
        },
        {
          "id": "sw2",
          "type": "SwitchWay3",
          "label": "Saklar Tukar 2",
          "x": 430,
          "y": 85
        },
        {
          "id": "lamp",
          "type": "Lamp",
          "x": 570,
          "y": 85
        }
      ],
      "wires": [
        {
          "from": "src.L",
          "to": "mcb.in",
          "color": "phase",
          "step": 2,
          "via": [
            [
              125,
              115
            ],
            [
              125,
              50
            ],
            [
              190,
              50
            ]
          ]
        },
        {
          "from": "mcb.out",
          "to": "sw1.com",
          "color": "phase",
          "step": 2,
          "via": [
            [
              190,
              195
            ],
            [
              315,
              195
            ],
            [
              315,
              155
            ]
          ]
        },
        {
          "from": "sw1.L1",
          "to": "sw2.L1",
          "color": "phase",
          "step": 3,
          "via": [
            [
              300,
              60
            ],
            [
              450,
              60
            ]
          ]
        },
        {
          "from": "sw1.L2",
          "to": "sw2.L2",
          "color": "phase",
          "step": 4,
          "via": [
            [
              330,
              40
            ],
            [
              480,
              40
            ]
          ]
        },
        {
          "from": "sw2.com",
          "to": "lamp.L",
          "color": "phase",
          "step": 5,
          "via": [
            [
              465,
              195
            ],
            [
              540,
              195
            ],
            [
              540,
              125
            ],
            [
              595,
              125
            ]
          ]
        },
        {
          "from": "lamp.N",
          "to": "src.N",
          "color": "neutral",
          "step": 6,
          "via": [
            [
              625,
              235
            ],
            [
              140,
              235
            ],
            [
              140,
              145
            ]
          ]
        }
      ],
      "junctions": []
    }
  },
  {
    "id": "js6",
    "title": "Jobsheet 6: Rangkaian Saklar Silang",
    "competency": "Siswa mampu merakit rangkaian saklar silang yang dikombinasikan dengan dua saklar tukar untuk mengontrol satu lampu dari 3 lokasi berbeda.",
    "toolsAndMaterials": [
      "Sumber Listrik 1-Fasa (L, N, PE)",
      "MCB 1-Fasa",
      "2 Saklar Tukar",
      "1 Saklar Silang",
      "1 Lampu",
      "Kabel Penghantar (Fasa: Merah/Kuning/Hitam, Netral: Biru)"
    ],
    "instructions": [
      "Tempatkan Sumber 1-Fasa, MCB 1-Fasa, Saklar Tukar 1, Saklar Silang, Saklar Tukar 2, dan Lampu.",
      "Hubungkan keluaran MCB ke common Saklar Tukar 1.",
      "Hubungkan terminal L1/L2 Saklar Tukar 1 ke terminal input (in1/in2) Saklar Silang.",
      "Hubungkan terminal output (out1/out2) Saklar Silang ke terminal L1/L2 Saklar Tukar 2.",
      "Hubungkan common Saklar Tukar 2 ke fasa Lampu. Sambungkan netral lampu ke sumber.",
      "Simulasikan dan uji: saklar mana pun dari ke-3 lokasi harus bisa mengubah status lampu (ON <-> OFF)."
    ],
    "workingDrawing": {
      "width": 780,
      "height": 290,
      "components": [
        {
          "id": "src",
          "type": "Source_1P",
          "x": 30,
          "y": 70
        },
        {
          "id": "mcb",
          "type": "MCB_1P",
          "x": 150,
          "y": 85
        },
        {
          "id": "sw1",
          "type": "SwitchWay3",
          "label": "Saklar Tukar 1",
          "x": 260,
          "y": 95
        },
        {
          "id": "swCross",
          "type": "SwitchCross",
          "label": "Saklar Silang",
          "x": 390,
          "y": 95
        },
        {
          "id": "sw2",
          "type": "SwitchWay3",
          "label": "Saklar Tukar 2",
          "x": 525,
          "y": 95
        },
        {
          "id": "lamp",
          "type": "Lamp",
          "x": 655,
          "y": 95
        }
      ],
      "wires": [
        {
          "from": "src.L",
          "to": "mcb.in",
          "color": "phase",
          "step": 2,
          "via": [
            [
              120,
              125
            ],
            [
              120,
              60
            ],
            [
              180,
              60
            ]
          ]
        },
        {
          "from": "mcb.out",
          "to": "sw1.com",
          "color": "phase",
          "step": 2,
          "via": [
            [
              180,
              205
            ],
            [
              295,
              205
            ],
            [
              295,
              165
            ]
          ]
        },
        {
          "from": "sw1.L1",
          "to": "swCross.in1",
          "color": "phase",
          "step": 3,
          "via": [
            [
              280,
              75
            ],
            [
              415,
              75
            ]
          ]
        },
        {
          "from": "sw1.L2",
          "to": "swCross.in2",
          "color": "phase",
          "step": 3,
          "via": [
            [
              310,
              55
            ],
            [
              445,
              55
            ]
          ]
        },
        {
          "from": "swCross.out1",
          "to": "sw2.L1",
          "color": "phase",
          "step": 4,
          "via": [
            [
              415,
              195
            ],
            [
              490,
              195
            ],
            [
              490,
              75
            ],
            [
              545,
              75
            ]
          ]
        },
        {
          "from": "swCross.out2",
          "to": "sw2.L2",
          "color": "phase",
          "step": 4,
          "via": [
            [
              445,
              215
            ],
            [
              505,
              215
            ],
            [
              505,
              55
            ],
            [
              575,
              55
            ]
          ]
        },
        {
          "from": "sw2.com",
          "to": "lamp.L",
          "color": "phase",
          "step": 5,
          "via": [
            [
              560,
              205
            ],
            [
              620,
              205
            ],
            [
              620,
              135
            ],
            [
              680,
              135
            ]
          ]
        },
        {
          "from": "lamp.N",
          "to": "src.N",
          "color": "neutral",
          "step": 5,
          "via": [
            [
              710,
              265
            ],
            [
              135,
              265
            ],
            [
              135,
              155
            ]
          ]
        }
      ],
      "junctions": []
    }
  },
  {
    "id": "js7",
    "title": "Jobsheet 7: Kombinasi Rangkaian Penerangan & Stop Kontak",
    "competency": "Siswa dapat memasang rangkaian gabungan (kombinasi 1 lampu + 1 saklar tunggal dan 1 stop kontak) dalam 1 grup sirkuit MCB.",
    "toolsAndMaterials": [
      "Sumber Listrik 1-Fasa (L, N, PE)",
      "MCB 1-Fasa",
      "Saklar Tunggal",
      "Lampu",
      "Stop Kontak 1-Fasa",
      "Kabel Penghantar (Fasa, Netral, Ground)"
    ],
    "instructions": [
      "Tempatkan semua komponen: Sumber, MCB, Saklar, Lampu, dan Stop Kontak.",
      "Hubungkan keluaran MCB untuk mensuplai Saklar Tunggal dan Fasa Stop Kontak (lakukan percabangan kabel fasa setelah MCB).",
      "Hubungkan keluaran saklar tunggal ke fasa Lampu.",
      "Hubungkan Netral Lampu dan Netral Stop Kontak ke Netral Sumber.",
      "Hubungkan Ground Stop Kontak ke Ground Sumber.",
      "Uji simulasi: Stop kontak harus bertegangan konstan 220V, sementara Lampu dikontrol secara independen oleh Saklar Tunggal."
    ],
    "workingDrawing": {
      "width": 580,
      "height": 310,
      "components": [
        {
          "id": "src",
          "type": "Source_1P",
          "x": 30,
          "y": 75
        },
        {
          "id": "mcb",
          "type": "MCB_1P",
          "x": 160,
          "y": 90
        },
        {
          "id": "sw",
          "type": "SwitchSingle",
          "label": "Saklar Tunggal",
          "x": 300,
          "y": 40
        },
        {
          "id": "lamp",
          "type": "Lamp",
          "label": "Lampu",
          "x": 450,
          "y": 40
        },
        {
          "id": "sock",
          "type": "Socket",
          "label": "Stop Kontak",
          "x": 300,
          "y": 170
        }
      ],
      "wires": [
        {
          "from": "src.L",
          "to": "mcb.in",
          "color": "phase",
          "step": 2,
          "via": [
            [
              125,
              130
            ],
            [
              125,
              65
            ],
            [
              190,
              65
            ]
          ]
        },
        {
          "from": "mcb.out",
          "to": "sw.in",
          "color": "phase",
          "step": 2,
          "via": [
            [
              190,
              210
            ],
            [
              250,
              210
            ],
            [
              250,
              25
            ],
            [
              330,
              25
            ]
          ]
        },
        {
          "from": "mcb.out",
          "to": "sock.L",
          "color": "phase",
          "step": 2,
          "via": [
            [
              190,
              210
            ],
            [
              250,
              210
            ],
            [
              325,
              210
            ]
          ]
        },
        {
          "from": "sw.out",
          "to": "lamp.L",
          "color": "phase",
          "step": 3,
          "via": [
            [
              330,
              135
            ],
            [
              410,
              135
            ],
            [
              410,
              80
            ],
            [
              475,
              80
            ]
          ]
        },
        {
          "from": "lamp.N",
          "to": "src.N",
          "color": "neutral",
          "step": 4,
          "via": [
            [
              505,
              80
            ],
            [
              545,
              80
            ],
            [
              545,
              290
            ],
            [
              140,
              290
            ],
            [
              140,
              160
            ]
          ]
        },
        {
          "from": "sock.N",
          "to": "src.N",
          "color": "neutral",
          "step": 4,
          "via": [
            [
              355,
              210
            ],
            [
              545,
              210
            ],
            [
              545,
              290
            ],
            [
              140,
              290
            ],
            [
              140,
              160
            ]
          ]
        },
        {
          "from": "sock.PE",
          "to": "src.PE",
          "color": "earth",
          "step": 5,
          "via": [
            [
              340,
              255
            ],
            [
              150,
              255
            ],
            [
              150,
              190
            ]
          ]
        }
      ],
      "junctions": [
        [
          250,
          210
        ],
        [
          545,
          210
        ]
      ]
    }
  },
  {
    "id": "js8",
    "title": "Jobsheet 8: Instalasi Penerangan 3-Fasa (Gedung Bertingkat)",
    "competency": "Siswa mampu merakit panel hubung bagi (PHB) 3-fasa untuk membagi beban penerangan 1-fasa ke fasa R, S, T secara seimbang (balancing beban), dilengkapi MCB 3-fasa utama dan 3 MCB 1-fasa grup sirkuit.",
    "toolsAndMaterials": [
      "Sumber Listrik 3-Fasa (R, S, T, N, PE)",
      "MCB 3-Fasa (Pengaman Utama Panel)",
      "3 MCB 1-Fasa (Pengaman Grup sirkuit Fasa R, S, T)",
      "3 Lampu (sebagai beban representasi Grup 1, 2, 3)",
      "Kabel Penghantar (Fasa R: Merah, Fasa S: Kuning, Fasa T: Hitam, Netral: Biru, Ground: Kuning-Hijau)"
    ],
    "instructions": [
      "Tempatkan Sumber 3-Fasa, MCB 3-Fasa, dan 3 MCB 1-Fasa.",
      "Hubungkan fasa R, S, T Sumber masing-masing ke masukan atas MCB 3-Fasa (in_R, in_S, in_T).",
      "Hubungkan keluaran bawah MCB 3-Fasa: out_R ke masukan MCB 1-Fasa ke-1, out_S ke masukan MCB 1-Fasa ke-2, dan out_T ke masukan MCB 1-Fasa ke-3.",
      "Hubungkan keluaran masing-masing MCB 1-Fasa ke fasa Lampu 1, Lampu 2, dan Lampu 3. (Grup R -> Lampu 1, Grup S -> Lampu 2, Grup T -> Lampu 3).",
      "Hubungkan semua terminal Netral Lampu ke Netral Sumber.",
      "Jalankan simulasi: pastikan ketiga grup bekerja. Periksa indikator beban seimbang (setiap fasa memikul beban masing-masing 1 lampu)."
    ],
    "workingDrawing": {
      "width": 630,
      "height": 430,
      "components": [
        {
          "id": "src",
          "type": "Source_3P",
          "x": 30,
          "y": 70
        },
        {
          "id": "mcb3",
          "type": "MCB_3P",
          "label": "MCB 3P Utama",
          "x": 170,
          "y": 95
        },
        {
          "id": "mcb1_1",
          "type": "MCB_1P",
          "label": "Grup 1 (R)",
          "x": 320,
          "y": 35
        },
        {
          "id": "mcb1_2",
          "type": "MCB_1P",
          "label": "Grup 2 (S)",
          "x": 320,
          "y": 155
        },
        {
          "id": "mcb1_3",
          "type": "MCB_1P",
          "label": "Grup 3 (T)",
          "x": 320,
          "y": 275
        },
        {
          "id": "lamp1",
          "type": "Lamp",
          "label": "Lampu 1 (R)",
          "x": 470,
          "y": 45
        },
        {
          "id": "lamp2",
          "type": "Lamp",
          "label": "Lampu 2 (S)",
          "x": 470,
          "y": 165
        },
        {
          "id": "lamp3",
          "type": "Lamp",
          "label": "Lampu 3 (T)",
          "x": 470,
          "y": 285
        }
      ],
      "wires": [
        {
          "from": "src.R",
          "to": "mcb3.in_R",
          "color": "R",
          "step": 2,
          "via": [
            [
              130,
              125
            ],
            [
              130,
              75
            ],
            [
              190,
              75
            ]
          ]
        },
        {
          "from": "src.S",
          "to": "mcb3.in_S",
          "color": "S",
          "step": 2,
          "via": [
            [
              145,
              155
            ],
            [
              145,
              85
            ],
            [
              210,
              85
            ]
          ]
        },
        {
          "from": "src.T",
          "to": "mcb3.in_T",
          "color": "T",
          "step": 2,
          "via": [
            [
              160,
              185
            ],
            [
              160,
              95
            ],
            [
              230,
              95
            ]
          ]
        },
        {
          "from": "mcb3.out_R",
          "to": "mcb1_1.in",
          "color": "R",
          "step": 3,
          "via": [
            [
              190,
              210
            ],
            [
              270,
              210
            ],
            [
              270,
              20
            ],
            [
              350,
              20
            ]
          ]
        },
        {
          "from": "mcb3.out_S",
          "to": "mcb1_2.in",
          "color": "S",
          "step": 3,
          "via": [
            [
              210,
              225
            ],
            [
              285,
              225
            ],
            [
              285,
              145
            ],
            [
              350,
              145
            ]
          ]
        },
        {
          "from": "mcb3.out_T",
          "to": "mcb1_3.in",
          "color": "T",
          "step": 3,
          "via": [
            [
              230,
              240
            ],
            [
              300,
              240
            ],
            [
              300,
              265
            ],
            [
              350,
              265
            ]
          ]
        },
        {
          "from": "mcb1_1.out",
          "to": "lamp1.L",
          "color": "R",
          "step": 4,
          "via": [
            [
              350,
              135
            ],
            [
              420,
              135
            ],
            [
              420,
              85
            ],
            [
              495,
              85
            ]
          ]
        },
        {
          "from": "mcb1_2.out",
          "to": "lamp2.L",
          "color": "S",
          "step": 4,
          "via": [
            [
              350,
              255
            ],
            [
              420,
              255
            ],
            [
              420,
              205
            ],
            [
              495,
              205
            ]
          ]
        },
        {
          "from": "mcb1_3.out",
          "to": "lamp3.L",
          "color": "T",
          "step": 4,
          "via": [
            [
              350,
              375
            ],
            [
              420,
              375
            ],
            [
              420,
              325
            ],
            [
              495,
              325
            ]
          ]
        },
        {
          "from": "lamp1.N",
          "to": "src.N",
          "color": "neutral",
          "step": 5,
          "via": [
            [
              525,
              85
            ],
            [
              580,
              85
            ],
            [
              580,
              410
            ],
            [
              120,
              410
            ],
            [
              120,
              215
            ]
          ]
        },
        {
          "from": "lamp2.N",
          "to": "src.N",
          "color": "neutral",
          "step": 5,
          "via": [
            [
              525,
              205
            ],
            [
              580,
              205
            ],
            [
              580,
              410
            ],
            [
              120,
              410
            ],
            [
              120,
              215
            ]
          ]
        },
        {
          "from": "lamp3.N",
          "to": "src.N",
          "color": "neutral",
          "step": 5,
          "via": [
            [
              525,
              325
            ],
            [
              580,
              325
            ],
            [
              580,
              410
            ],
            [
              120,
              410
            ],
            [
              120,
              215
            ]
          ]
        }
      ],
      "junctions": [
        [
          580,
          205
        ],
        [
          580,
          325
        ]
      ]
    }
  }
];
