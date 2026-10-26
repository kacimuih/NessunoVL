// Data Skenario Trouble Shoot - Virtual Lab IPL
// Berisi kasus-kasus investigasi kerusakan/gangguan instalasi listrik nyata di lapangan

export const TROUBLESHOOT_SCENARIOS = [
  {
    id: "ts_01",
    title: "Lampu Kamar Tidak Menyala",
    customerReport: "\"Pak, ini lampu kamar tidur saya kok gak nyala ya? Padahal saklarnya udah saya nyalain. MCB juga gak trip kok, coba deh dicek.\"",
    initialComponents: [
      { id: 'ts1_src', type: 'Source_1P', x: 60, y: 200, rotation: 0, state: {} },
      { id: 'ts1_mcb', type: 'MCB_1P', x: 240, y: 200, rotation: 0, state: { on: true } },
      { id: 'ts1_sw', type: 'SwitchSingle', x: 420, y: 200, rotation: 0, state: { on: true } },
      { id: 'ts1_lamp', type: 'Lamp', x: 600, y: 200, rotation: 0, state: {} }
    ],
    initialWires: [
      {
        id: 'wire_ts1_src_mcb',
        color: 'red',
        from: { type: 'pin', componentId: 'ts1_src', pinName: 'L', x: 125, y: 255 },
        to: { type: 'pin', componentId: 'ts1_mcb', pinName: 'in', x: 270, y: 210 },
        path: [
          { id: 'wp_ts1_sm1', x: 125, y: 255 },
          { id: 'wp_ts1_sm2', x: 190, y: 255 },
          { id: 'wp_ts1_sm3', x: 190, y: 210 },
          { id: 'wp_ts1_sm4', x: 270, y: 210 }
        ]
      },
      {
        id: 'wire_ts1_mcb_sw',
        color: 'red',
        from: { type: 'pin', componentId: 'ts1_mcb', pinName: 'out', x: 270, y: 290 },
        to: { type: 'pin', componentId: 'ts1_sw', pinName: 'in', x: 450, y: 210 },
        path: [
          { id: 'wp_ts1_ms1', x: 270, y: 290 },
          { id: 'wp_ts1_ms2', x: 350, y: 290 },
          { id: 'wp_ts1_ms3', x: 350, y: 210 },
          { id: 'wp_ts1_ms4', x: 450, y: 210 }
        ]
      },
      // KESALAHAN: Ujung kabel menuju Lampu sengaja dibuat tidak snap ke pin L (berhenti di dekatnya sebagai titik lepas)
      {
        id: 'wire_ts1_sw_lamp',
        color: 'red',
        from: { type: 'pin', componentId: 'ts1_sw', pinName: 'out', x: 450, y: 270 },
        to: { type: 'point', x: 616, y: 240 },
        path: [
          { id: 'wp_ts1_sl1', x: 450, y: 270 },
          { id: 'wp_ts1_sl2', x: 530, y: 270 },
          { id: 'wp_ts1_sl3', x: 530, y: 240 },
          { id: 'wp_ts1_sl4', x: 616, y: 240 }
        ]
      },
      {
        id: 'wire_ts1_lamp_src_n',
        color: 'blue',
        from: { type: 'pin', componentId: 'ts1_lamp', pinName: 'N', x: 655, y: 240 },
        to: { type: 'pin', componentId: 'ts1_src', pinName: 'N', x: 125, y: 285 },
        path: [
          { id: 'wp_ts1_ln1', x: 655, y: 240 },
          { id: 'wp_ts1_ln2', x: 655, y: 350 },
          { id: 'wp_ts1_ln3', x: 125, y: 350 },
          { id: 'wp_ts1_ln4', x: 125, y: 285 }
        ]
      }
    ],
    hints: [
      "Coba tekan tombol Cek Kesalahan atau Simulasikan dulu -- apakah ada peringatan yang muncul di kanvas?",
      "Perhatikan kabel yang menghubungkan Saklar Tunggal ke Lampu -- telusuri dari ujung ke ujung, apakah benar-benar sudah tersambung di kedua sisinya?",
      "Coba klik ujung kabel yang berada paling dekat dengan pin 'L' pada Lampu -- kemungkinan ujung itu menggantung (floating), tidak benar-benar snap ke pin."
    ],
    solution: "Kabel dari Saklar Tunggal menuju Lampu ternyata tidak benar-benar tersambung ke pin L Lampu (hanya terlihat dekat secara visual, padahal terputus). Solusinya: hapus kabel yang menggantung tersebut, lalu gambar ulang kabel baru dari pin 'out' Saklar Tunggal ke pin 'L' Lampu sampai muncul indikator snap (bulatan pin berubah warna saat tersambung dengan benar).",
    faultHighlightIds: ["ts1_sw", "ts1_lamp"]
  },
  {
    id: "ts_02",
    title: "Saklar Tangga Tidak Konsisten",
    customerReport: "\"Ini saklar tangga yang baru dipasang aneh deh. Kadang nyala kadang enggak, gak konsisten kalau saya coba matikan dari saklar yang di lantai atas.\"",
    initialComponents: [
      { id: 'ts2_src', type: 'Source_1P', x: 60, y: 220, rotation: 0, state: {} },
      { id: 'ts2_mcb', type: 'MCB_1P', x: 220, y: 220, rotation: 0, state: { on: true } },
      { id: 'ts2_swA', type: 'SwitchWay3', x: 380, y: 140, rotation: 0, state: { on: false } },
      { id: 'ts2_swB', type: 'SwitchWay3', x: 380, y: 300, rotation: 0, state: { on: false } },
      { id: 'ts2_lamp', type: 'Lamp', x: 560, y: 220, rotation: 0, state: {} }
    ],
    initialWires: [
      {
        id: 'wire_ts2_src_mcb',
        color: 'red',
        from: { type: 'pin', componentId: 'ts2_src', pinName: 'L', x: 125, y: 275 },
        to: { type: 'pin', componentId: 'ts2_mcb', pinName: 'in', x: 250, y: 230 },
        path: [
          { id: 'wp_ts2_sm1', x: 125, y: 275 },
          { id: 'wp_ts2_sm2', x: 185, y: 275 },
          { id: 'wp_ts2_sm3', x: 185, y: 230 },
          { id: 'wp_ts2_sm4', x: 250, y: 230 }
        ]
      },
      {
        id: 'wire_ts2_mcb_swA',
        color: 'red',
        from: { type: 'pin', componentId: 'ts2_mcb', pinName: 'out', x: 250, y: 310 },
        to: { type: 'pin', componentId: 'ts2_swA', pinName: 'com', x: 415, y: 210 },
        path: [
          { id: 'wp_ts2_ms1', x: 250, y: 310 },
          { id: 'wp_ts2_ms2', x: 310, y: 310 },
          { id: 'wp_ts2_ms3', x: 310, y: 210 },
          { id: 'wp_ts2_ms4', x: 415, y: 210 }
        ]
      },
      // Traveler LURUS/BENAR: L1 Saklar A ke L1 Saklar B
      {
        id: 'wire_ts2_traveler1',
        color: 'red',
        from: { type: 'pin', componentId: 'ts2_swA', pinName: 'L1', x: 400, y: 150 },
        to: { type: 'pin', componentId: 'ts2_swB', pinName: 'L1', x: 400, y: 310 },
        path: [
          { id: 'wp_ts2_t1_1', x: 400, y: 150 },
          { id: 'wp_ts2_t1_2', x: 350, y: 150 },
          { id: 'wp_ts2_t1_3', x: 350, y: 310 },
          { id: 'wp_ts2_t1_4', x: 400, y: 310 }
        ]
      },
      // Traveler LURUS/BENAR: L2 Saklar A ke L2 Saklar B
      {
        id: 'wire_ts2_traveler2',
        color: 'red',
        from: { type: 'pin', componentId: 'ts2_swA', pinName: 'L2', x: 430, y: 150 },
        to: { type: 'pin', componentId: 'ts2_swB', pinName: 'L2', x: 430, y: 310 },
        path: [
          { id: 'wp_ts2_t2_1', x: 430, y: 150 },
          { id: 'wp_ts2_t2_2', x: 460, y: 150 },
          { id: 'wp_ts2_t2_3', x: 460, y: 310 },
          { id: 'wp_ts2_t2_4', x: 430, y: 310 }
        ]
      },
      // KESALAHAN: Kabel dari Lampu tersambung ke terminal L1 Saklar B,
      // SEHARUSNYA ke terminal 'com' Saklar B. Terminal 'com' Saklar B dibiarkan kosong.
      {
        id: 'wire_ts2_swB_lamp',
        color: 'red',
        from: { type: 'pin', componentId: 'ts2_swB', pinName: 'L1', x: 400, y: 310 },
        to: { type: 'pin', componentId: 'ts2_lamp', pinName: 'L', x: 585, y: 260 },
        path: [
          { id: 'wp_ts2_bl1', x: 400, y: 310 },
          { id: 'wp_ts2_bl2', x: 500, y: 310 },
          { id: 'wp_ts2_bl3', x: 500, y: 260 },
          { id: 'wp_ts2_bl4', x: 585, y: 260 }
        ]
      },
      {
        id: 'wire_ts2_lamp_src_n',
        color: 'blue',
        from: { type: 'pin', componentId: 'ts2_lamp', pinName: 'N', x: 615, y: 260 },
        to: { type: 'pin', componentId: 'ts2_src', pinName: 'N', x: 125, y: 305 },
        path: [
          { id: 'wp_ts2_ln1', x: 615, y: 260 },
          { id: 'wp_ts2_ln2', x: 615, y: 440 },
          { id: 'wp_ts2_ln3', x: 125, y: 440 },
          { id: 'wp_ts2_ln4', x: 125, y: 305 }
        ]
      }
    ],
    hints: [
      "Coba nyalakan MCB dan toggle kedua saklar secara bergantian sambil disimulasikan -- catat pola ON/OFF lampu di tiap kombinasi.",
      "Perhatikan: apakah Saklar B (yang jauh dari sumber) benar-benar memengaruhi nyala/matinya lampu, atau lampu cuma mengikuti Saklar A saja?",
      "Periksa kabel yang menuju ke Lampu -- pastikan kabel itu benar-benar tersambung ke terminal 'com' Saklar B, BUKAN ke terminal L1 atau L2-nya."
    ],
    solution: "Kabel menuju Lampu ternyata salah tersambung ke terminal L1 Saklar B, padahal seharusnya ke terminal 'com' Saklar B. Akibatnya, Lampu hanya mengikuti posisi Saklar A dan sama sekali tidak terpengaruh oleh Saklar B. Solusinya: pindahkan kabel tersebut supaya benar-benar tersambung ke terminal 'com' Saklar B.",
    faultHighlightIds: ["ts2_swB", "ts2_lamp"]
  },
  {
    id: "ts_03",
    title: "MCB Selalu Trip Saat Dinyalakan",
    customerReport: "\"Pak, ini kok pas dinyalain MCB-nya langsung jeglek (trip) ya? Padahal cuma mau nyalain 2 lampu di ruang tamu.\"",
    initialComponents: [
      { id: 'ts3_src', type: 'Source_1P', x: 60, y: 220, rotation: 0, state: {} },
      { id: 'ts3_mcb', type: 'MCB_1P', x: 220, y: 220, rotation: 0, state: { on: true } },
      { id: 'ts3_sw', type: 'SwitchSingle', x: 380, y: 220, rotation: 0, state: { on: true } },
      { id: 'ts3_lamp1', type: 'Lamp', x: 560, y: 140, rotation: 0, state: {} },
      { id: 'ts3_lamp2', type: 'Lamp', x: 560, y: 300, rotation: 0, state: {} }
    ],
    initialWires: [
      {
        id: 'wire_ts3_src_mcb',
        color: 'red',
        from: { type: 'pin', componentId: 'ts3_src', pinName: 'L', x: 125, y: 275 },
        to: { type: 'pin', componentId: 'ts3_mcb', pinName: 'in', x: 250, y: 230 },
        path: [
          { id: 'wp_ts3_sm1', x: 125, y: 275 },
          { id: 'wp_ts3_sm2', x: 185, y: 275 },
          { id: 'wp_ts3_sm3', x: 185, y: 230 },
          { id: 'wp_ts3_sm4', x: 250, y: 230 }
        ]
      },
      {
        id: 'wire_ts3_mcb_sw',
        color: 'red',
        from: { type: 'pin', componentId: 'ts3_mcb', pinName: 'out', x: 250, y: 310 },
        to: { type: 'pin', componentId: 'ts3_sw', pinName: 'in', x: 410, y: 230 },
        path: [
          { id: 'wp_ts3_ms1', x: 250, y: 310 },
          { id: 'wp_ts3_ms2', x: 330, y: 310 },
          { id: 'wp_ts3_ms3', x: 330, y: 230 },
          { id: 'wp_ts3_ms4', x: 410, y: 230 }
        ]
      },
      {
        id: 'wire_ts3_sw_branch',
        color: 'red',
        from: { type: 'pin', componentId: 'ts3_sw', pinName: 'out', x: 410, y: 290 },
        to: { type: 'pin', componentId: 'ts3_lamp1', pinName: 'L', x: 585, y: 180 },
        path: [
          { id: 'wp_ts3_sb1', x: 410, y: 290 },
          { id: 'wp_ts3_sb2', x: 480, y: 290 },
          { id: 'wp_ts3_branch_fasa', x: 480, y: 180 },
          { id: 'wp_ts3_sb3', x: 585, y: 180 }
        ]
      },
      {
        id: 'wire_ts3_branch_lamp2',
        color: 'red',
        from: { type: 'wire', wireId: 'wire_ts3_sw_branch', waypointId: 'wp_ts3_branch_fasa', x: 480, y: 180 },
        to: { type: 'pin', componentId: 'ts3_lamp2', pinName: 'L', x: 585, y: 340 },
        path: [
          { id: 'wp_ts3_b2_1', x: 480, y: 180 },
          { id: 'wp_ts3_b2_2', x: 480, y: 340 },
          { id: 'wp_ts3_b2_3', x: 585, y: 340 }
        ]
      },
      {
        id: 'wire_ts3_netral_main',
        color: 'blue',
        from: { type: 'pin', componentId: 'ts3_lamp1', pinName: 'N', x: 615, y: 180 },
        to: { type: 'pin', componentId: 'ts3_src', pinName: 'N', x: 125, y: 305 },
        path: [
          { id: 'wp_ts3_nm1', x: 615, y: 180 },
          { id: 'wp_ts3_branch_netral', x: 660, y: 180 },
          { id: 'wp_ts3_nm2', x: 660, y: 400 },
          { id: 'wp_ts3_nm3', x: 125, y: 400 },
          { id: 'wp_ts3_nm4', x: 125, y: 305 }
        ]
      },
      {
        id: 'wire_ts3_lamp2_netral',
        color: 'blue',
        from: { type: 'pin', componentId: 'ts3_lamp2', pinName: 'N', x: 615, y: 340 },
        to: { type: 'wire', wireId: 'wire_ts3_netral_main', waypointId: 'wp_ts3_branch_netral', x: 660, y: 180 },
        path: [
          { id: 'wp_ts3_l2n1', x: 615, y: 340 },
          { id: 'wp_ts3_l2n2', x: 660, y: 340 },
          { id: 'wp_ts3_l2n3', x: 660, y: 180 }
        ]
      },
      // KESALAHAN: Kabel korsleting langsung menyambungkan pin L dan pin N pada Lampu 2
      {
        id: 'wire_ts3_short',
        color: 'red',
        from: { type: 'pin', componentId: 'ts3_lamp2', pinName: 'L', x: 585, y: 340 },
        to: { type: 'pin', componentId: 'ts3_lamp2', pinName: 'N', x: 615, y: 340 },
        path: [
          { id: 'wp_ts3_sc1', x: 585, y: 340 },
          { id: 'wp_ts3_sc2', x: 585, y: 375 },
          { id: 'wp_ts3_sc3', x: 615, y: 375 },
          { id: 'wp_ts3_sc4', x: 615, y: 340 }
        ]
      }
    ],
    hints: [
      "Coba tekan Simulasikan -- MCB akan terlihat trip (posisi tuas berubah) disertai bunyi khas korsleting. Ini pertanda ada jalur Fasa yang langsung terhubung ke Netral tanpa melewati beban di suatu tempat pada rangkaian.",
      "Telusuri satu per satu kabel dari titik percabangan menuju Lampu 1 dan Lampu 2 -- periksa apakah ada kabel tambahan yang mencurigakan di sekitar salah satu lampu, yang tidak seharusnya ada.",
      "Periksa area sekitar Lampu 2 -- kemungkinan ada 1 kabel pendek ekstra yang menyambungkan langsung antara pin L dan pin N pada lampu itu, tanpa melalui saklar/beban dengan benar."
    ],
    solution: "Terdapat kabel ekstra yang secara langsung menyambungkan pin L dan pin N pada Lampu 2, menciptakan jalur pintas Fasa-Netral tanpa melewati beban (korsleting murni). Solusinya: hapus kabel ekstra tersebut, sehingga Lampu 2 hanya tersambung normal lewat jalur Fasa (dari percabangan Saklar) dan Netral (dari percabangan Sumber) seperti Lampu 1.",
    faultHighlightIds: ["ts3_lamp2"]
  },
  {
    id: "ts_04",
    title: "Lampu Teras Masih Menyetrum Saat Saklar Dimatikan",
    customerReport: "\"Pak, kemarin pas saya mau ganti bohlam lampu teras yang mati, tangan saya kesetrum pas pegang fitting-nya padahal saklarnya udah dimatikan. Tolong diperiksa instalasinya, bahaya banget.\"",
    initialComponents: [
      { id: 'ts4_src', type: 'Source_1P', x: 60, y: 200, rotation: 0, state: {} },
      { id: 'ts4_mcb', type: 'MCB_1P', x: 240, y: 200, rotation: 0, state: { on: true } },
      { id: 'ts4_sw', type: 'SwitchSingle', x: 420, y: 200, rotation: 0, state: { on: true } },
      { id: 'ts4_lamp', type: 'Lamp', x: 600, y: 200, rotation: 0, state: {} }
    ],
    initialWires: [
      {
        id: 'wire_ts4_src_mcb',
        color: 'red',
        from: { type: 'pin', componentId: 'ts4_src', pinName: 'L', x: 125, y: 255 },
        to: { type: 'pin', componentId: 'ts4_mcb', pinName: 'in', x: 270, y: 210 },
        path: [
          { id: 'wp_ts4_sm1', x: 125, y: 255 },
          { id: 'wp_ts4_sm2', x: 185, y: 255 },
          { id: 'wp_ts4_sm3', x: 185, y: 210 },
          { id: 'wp_ts4_sm4', x: 270, y: 210 }
        ]
      },
      // KESALAHAN: Jalur fasa dari MCB out langsung menyambung ke pin L Lampu (melewati saklar)
      {
        id: 'wire_ts4_mcb_lamp',
        color: 'red',
        from: { type: 'pin', componentId: 'ts4_mcb', pinName: 'out', x: 270, y: 290 },
        to: { type: 'pin', componentId: 'ts4_lamp', pinName: 'L', x: 625, y: 240 },
        path: [
          { id: 'wp_ts4_ml1', x: 270, y: 290 },
          { id: 'wp_ts4_ml2', x: 340, y: 290 },
          { id: 'wp_ts4_ml3', x: 340, y: 140 },
          { id: 'wp_ts4_ml4', x: 625, y: 140 },
          { id: 'wp_ts4_ml5', x: 625, y: 240 }
        ]
      },
      // KESALAHAN: Saklar terpasang pada kabel Netral (dari pin N Lampu masuk ke Saklar)
      {
        id: 'wire_ts4_lamp_sw',
        color: 'blue',
        from: { type: 'pin', componentId: 'ts4_lamp', pinName: 'N', x: 655, y: 240 },
        to: { type: 'pin', componentId: 'ts4_sw', pinName: 'in', x: 450, y: 210 },
        path: [
          { id: 'wp_ts4_ls1', x: 655, y: 240 },
          { id: 'wp_ts4_ls2', x: 655, y: 165 },
          { id: 'wp_ts4_ls3', x: 450, y: 165 },
          { id: 'wp_ts4_ls4', x: 450, y: 210 }
        ]
      },
      // KESALAHAN: Saklar out menuju Netral Sumber
      {
        id: 'wire_ts4_sw_src_n',
        color: 'blue',
        from: { type: 'pin', componentId: 'ts4_sw', pinName: 'out', x: 450, y: 270 },
        to: { type: 'pin', componentId: 'ts4_src', pinName: 'N', x: 125, y: 285 },
        path: [
          { id: 'wp_ts4_sn1', x: 450, y: 270 },
          { id: 'wp_ts4_sn2', x: 450, y: 340 },
          { id: 'wp_ts4_sn3', x: 125, y: 340 },
          { id: 'wp_ts4_sn4', x: 125, y: 285 }
        ]
      }
    ],
    hints: [
      "Coba simulasikan rangkaian dan amati status lampu saat saklar ON dan OFF. Lampu memang bisa menyala dan mati, tetapi perhatikan jalur kabel mana yang diputus oleh saklar.",
      "Menurut standar PUIL, saklar penerangan WAJIB memutus kawat Fasa (bertegangan), bukan kawat Netral. Telusuri kabel dari MCB: apakah keluaran MCB menuju ke saklar terlebih dahulu atau langsung ke lampu?",
      "Pindahkan Saklar Tunggal agar berada di antara keluaran MCB (Fasa) dan pin L Lampu. Sambungkan pin N Lampu langsung ke kabel Netral (biru) dari Sumber."
    ],
    solution: "Saklar terpasang pada jalur kabel Netral, bukan jalur Fasa. Meskipun lampu tetap bisa dimatikan lewat saklar, fasa 220V tetap mengalir ke fitting lampu sehingga sangat berbahaya dan menyengat saat disentuh. Solusinya: pindahkan saklar ke jalur kabel Fasa (keluaran MCB masuk ke Saklar, lalu keluaran Saklar menuju pin L Lampu) dan sambungkan pin N Lampu langsung ke Netral Sumber.",
    faultHighlightIds: ["ts4_sw", "ts4_lamp"]
  },
  {
    id: "ts_05",
    title: "Mesin Cuci Terasa Menyengat (Stop Kontak Tanpa Arde)",
    customerReport: "\"Pak, tiap kali nyentuh bodi logam mesin cuci yang dicolok ke stop kontak itu, tangan rasanya kesemutan kesengat listrik. Padahal mesin cucinya baru beli.\"",
    initialComponents: [
      { id: 'ts5_src', type: 'Source_1P', x: 80, y: 200, rotation: 0, state: {} },
      { id: 'ts5_mcb', type: 'MCB_1P', x: 300, y: 200, rotation: 0, state: { on: true } },
      { id: 'ts5_socket', type: 'Socket', x: 520, y: 200, rotation: 0, state: {} }
    ],
    initialWires: [
      {
        id: 'wire_ts5_src_mcb',
        color: 'red',
        from: { type: 'pin', componentId: 'ts5_src', pinName: 'L', x: 145, y: 255 },
        to: { type: 'pin', componentId: 'ts5_mcb', pinName: 'in', x: 330, y: 210 },
        path: [
          { id: 'wp_ts5_sm1', x: 145, y: 255 },
          { id: 'wp_ts5_sm2', x: 230, y: 255 },
          { id: 'wp_ts5_sm3', x: 230, y: 210 },
          { id: 'wp_ts5_sm4', x: 330, y: 210 }
        ]
      },
      {
        id: 'wire_ts5_mcb_sock',
        color: 'red',
        from: { type: 'pin', componentId: 'ts5_mcb', pinName: 'out', x: 330, y: 290 },
        to: { type: 'pin', componentId: 'ts5_socket', pinName: 'L', x: 545, y: 240 },
        path: [
          { id: 'wp_ts5_ms1', x: 330, y: 290 },
          { id: 'wp_ts5_ms2', x: 430, y: 290 },
          { id: 'wp_ts5_ms3', x: 430, y: 240 },
          { id: 'wp_ts5_ms4', x: 545, y: 240 }
        ]
      },
      {
        id: 'wire_ts5_sock_src_n',
        color: 'blue',
        from: { type: 'pin', componentId: 'ts5_socket', pinName: 'N', x: 575, y: 240 },
        to: { type: 'pin', componentId: 'ts5_src', pinName: 'N', x: 145, y: 285 },
        path: [
          { id: 'wp_ts5_sn1', x: 575, y: 240 },
          { id: 'wp_ts5_sn2', x: 575, y: 340 },
          { id: 'wp_ts5_sn3', x: 145, y: 340 },
          { id: 'wp_ts5_sn4', x: 145, y: 285 }
        ]
      }
      // KESALAHAN: Kabel arde (PE) dari Sumber ke terminal PE Stop Kontak sengaja tidak dipasang
    ],
    hints: [
      "Coba aktifkan mode Simulasikan lalu perhatikan apakah muncul kartu peringatan kuning terkait keselamatan pada rangkaian.",
      "Peralatan listrik berdaya besar atau berbody logam (seperti mesin cuci) memerlukan saluran pembuangan arus bocor (Grounding/Arde) agar bodi logam tidak bertegangan.",
      "Tarik kabel pengaman arde (PE, warna hijau) dari terminal PE Sumber Listrik menuju terminal PE di bagian tengah Stop Kontak."
    ],
    solution: "Stop kontak belum dipasangi kabel pentanahan (Ground/Arde/PE). Akibatnya, arus bocor induksi pada bodi logam mesin cuci tidak dapat dibuang ke tanah dan menyengat pengguna saat disentuh. Solusinya: pasang kabel PE (warna hijau) dari terminal PE Sumber ke terminal arde (PE) pada Stop Kontak.",
    faultHighlightIds: ["ts5_socket"]
  },
  {
    id: "ts_06",
    title: "Saklar Kedua Tidak Berfungsi (Saklar Seri)",
    customerReport: "\"Pak, saklar ganda di ruang tamu aneh deh. Saklar yang sebelah kanan nggak ngaruh sama sekali, dua lampu malah nyala dan mati barengan pas saklar kiri diceklek.\"",
    initialComponents: [
      { id: 'ts6_src', type: 'Source_1P', x: 60, y: 220, rotation: 0, state: {} },
      { id: 'ts6_mcb', type: 'MCB_1P', x: 220, y: 220, rotation: 0, state: { on: true } },
      { id: 'ts6_sw', type: 'SwitchDouble', x: 380, y: 220, rotation: 0, state: { on1: true, on2: true } },
      { id: 'ts6_lampA', type: 'Lamp', x: 580, y: 140, rotation: 0, state: {} },
      { id: 'ts6_lampB', type: 'Lamp', x: 580, y: 300, rotation: 0, state: {} }
    ],
    initialWires: [
      {
        id: 'wire_ts6_src_mcb',
        color: 'red',
        from: { type: 'pin', componentId: 'ts6_src', pinName: 'L', x: 125, y: 275 },
        to: { type: 'pin', componentId: 'ts6_mcb', pinName: 'in', x: 250, y: 230 },
        path: [
          { id: 'wp_ts6_sm1', x: 125, y: 275 },
          { id: 'wp_ts6_sm2', x: 185, y: 275 },
          { id: 'wp_ts6_sm3', x: 185, y: 230 },
          { id: 'wp_ts6_sm4', x: 250, y: 230 }
        ]
      },
      {
        id: 'wire_ts6_mcb_sw',
        color: 'red',
        from: { type: 'pin', componentId: 'ts6_mcb', pinName: 'out', x: 250, y: 310 },
        to: { type: 'pin', componentId: 'ts6_sw', pinName: 'in', x: 420, y: 290 },
        path: [
          { id: 'wp_ts6_ms1', x: 250, y: 310 },
          { id: 'wp_ts6_ms2', x: 330, y: 310 },
          { id: 'wp_ts6_ms3', x: 330, y: 290 },
          { id: 'wp_ts6_ms4', x: 420, y: 290 }
        ]
      },
      // KESALAHAN: Kedua lampu disambung ke out1 Saklar Seri lewat percabangan, out2 dibiarkan kosong
      {
        id: 'wire_ts6_sw_lampA',
        color: 'red',
        from: { type: 'pin', componentId: 'ts6_sw', pinName: 'out1', x: 405, y: 230 },
        to: { type: 'pin', componentId: 'ts6_lampA', pinName: 'L', x: 605, y: 180 },
        path: [
          { id: 'wp_ts6_sa1', x: 405, y: 230 },
          { id: 'wp_ts6_sa2', x: 405, y: 180 },
          { id: 'wp_ts6_branch_fasa', x: 500, y: 180 },
          { id: 'wp_ts6_sa3', x: 605, y: 180 }
        ]
      },
      {
        id: 'wire_ts6_branch_lampB',
        color: 'red',
        from: { type: 'wire', wireId: 'wire_ts6_sw_lampA', waypointId: 'wp_ts6_branch_fasa', x: 500, y: 180 },
        to: { type: 'pin', componentId: 'ts6_lampB', pinName: 'L', x: 605, y: 340 },
        path: [
          { id: 'wp_ts6_sb1', x: 500, y: 180 },
          { id: 'wp_ts6_sb2', x: 500, y: 340 },
          { id: 'wp_ts6_sb3', x: 605, y: 340 }
        ]
      },
      {
        id: 'wire_ts6_netral_main',
        color: 'blue',
        from: { type: 'pin', componentId: 'ts6_lampA', pinName: 'N', x: 635, y: 180 },
        to: { type: 'pin', componentId: 'ts6_src', pinName: 'N', x: 125, y: 305 },
        path: [
          { id: 'wp_ts6_nm1', x: 635, y: 180 },
          { id: 'wp_ts6_branch_netral', x: 670, y: 180 },
          { id: 'wp_ts6_nm2', x: 670, y: 420 },
          { id: 'wp_ts6_nm3', x: 125, y: 420 },
          { id: 'wp_ts6_nm4', x: 125, y: 305 }
        ]
      },
      {
        id: 'wire_ts6_lampB_netral',
        color: 'blue',
        from: { type: 'pin', componentId: 'ts6_lampB', pinName: 'N', x: 635, y: 340 },
        to: { type: 'wire', wireId: 'wire_ts6_netral_main', waypointId: 'wp_ts6_branch_netral', x: 670, y: 180 },
        path: [
          { id: 'wp_ts6_ln1', x: 635, y: 340 },
          { id: 'wp_ts6_ln2', x: 670, y: 340 },
          { id: 'wp_ts6_ln3', x: 670, y: 180 }
        ]
      }
    ],
    hints: [
      "Coba tekan Simulasikan, lalu klik kedua tuas Saklar Seri secara bergantian. Perhatikan tuas mana yang berpengaruh terhadap nyala lampu.",
      "Saklar seri memiliki 2 terminal keluaran: 'out1' untuk beban 1 dan 'out2' untuk beban 2. Periksa kabel yang keluar dari Saklar Seri ke kedua lampu.",
      "Pindahkan kabel Fasa Lampu B agar tersambung ke terminal 'out2' Saklar Seri, bukan digabung atau dicabang dari jalur 'out1'."
    ],
    solution: "Kedua lampu ternyata dihubungkan ke terminal keluaran yang sama (out1) pada Saklar Seri, sedangkan terminal out2 kosong. Akibatnya kedua lampu menyala dan mati secara bersamaan hanya lewat tuas pertama. Solusinya: pindahkan kabel Fasa Lampu B ke terminal 'out2' Saklar Seri, sehingga masing-masing lampu dapat dinyalakan dan dimatikan secara mandiri oleh tuasnya sendiri.",
    faultHighlightIds: ["ts6_sw", "ts6_lampB"]
  },
  {
    id: "ts_07",
    title: "Lampu Lorong Tiga Titik Tidak Konsisten (Saklar Silang)",
    customerReport: "\"Pak, lampu lorong panjang kami bisa dinyalain dari tiga saklar. Tapi aneh, kadang pas saklar tengah atau ujung diubah, lampu malah nggak mau nyala sama sekali dari saklar lainnya. Polanya nggak konsisten.\"",
    initialComponents: [
      { id: 'ts7_src', type: 'Source_1P', x: 40, y: 200, rotation: 0, state: {} },
      { id: 'ts7_mcb', type: 'MCB_1P', x: 170, y: 200, rotation: 0, state: { on: true } },
      { id: 'ts7_swA', type: 'SwitchWay3', x: 300, y: 200, rotation: 0, state: { on: false } },
      { id: 'ts7_swCross', type: 'SwitchCross', x: 460, y: 200, rotation: 0, state: { on: false } },
      { id: 'ts7_swB', type: 'SwitchWay3', x: 620, y: 200, rotation: 0, state: { on: false } },
      { id: 'ts7_lamp', type: 'Lamp', x: 770, y: 200, rotation: 0, state: {} }
    ],
    initialWires: [
      {
        id: 'wire_ts7_src_mcb',
        color: 'red',
        from: { type: 'pin', componentId: 'ts7_src', pinName: 'L', x: 105, y: 255 },
        to: { type: 'pin', componentId: 'ts7_mcb', pinName: 'in', x: 200, y: 210 },
        path: [
          { id: 'wp_ts7_sm1', x: 105, y: 255 },
          { id: 'wp_ts7_sm2', x: 150, y: 255 },
          { id: 'wp_ts7_sm3', x: 150, y: 210 },
          { id: 'wp_ts7_sm4', x: 200, y: 210 }
        ]
      },
      {
        id: 'wire_ts7_mcb_swA',
        color: 'red',
        from: { type: 'pin', componentId: 'ts7_mcb', pinName: 'out', x: 200, y: 290 },
        to: { type: 'pin', componentId: 'ts7_swA', pinName: 'com', x: 335, y: 270 },
        path: [
          { id: 'wp_ts7_ms1', x: 200, y: 290 },
          { id: 'wp_ts7_ms2', x: 250, y: 290 },
          { id: 'wp_ts7_ms3', x: 250, y: 270 },
          { id: 'wp_ts7_ms4', x: 335, y: 270 }
        ]
      },
      {
        id: 'wire_ts7_swA_cross1',
        color: 'red',
        from: { type: 'pin', componentId: 'ts7_swA', pinName: 'L1', x: 320, y: 210 },
        to: { type: 'pin', componentId: 'ts7_swCross', pinName: 'in1', x: 485, y: 210 },
        path: [
          { id: 'wp_ts7_ac1_1', x: 320, y: 210 },
          { id: 'wp_ts7_ac1_2', x: 320, y: 160 },
          { id: 'wp_ts7_ac1_3', x: 485, y: 160 },
          { id: 'wp_ts7_ac1_4', x: 485, y: 210 }
        ]
      },
      {
        id: 'wire_ts7_swA_cross2',
        color: 'red',
        from: { type: 'pin', componentId: 'ts7_swA', pinName: 'L2', x: 350, y: 210 },
        to: { type: 'pin', componentId: 'ts7_swCross', pinName: 'in2', x: 515, y: 210 },
        path: [
          { id: 'wp_ts7_ac2_1', x: 350, y: 210 },
          { id: 'wp_ts7_ac2_2', x: 350, y: 180 },
          { id: 'wp_ts7_ac2_3', x: 515, y: 180 },
          { id: 'wp_ts7_ac2_4', x: 515, y: 210 }
        ]
      },
      {
        id: 'wire_ts7_cross_swB1',
        color: 'red',
        from: { type: 'pin', componentId: 'ts7_swCross', pinName: 'out1', x: 485, y: 270 },
        to: { type: 'pin', componentId: 'ts7_swB', pinName: 'L1', x: 640, y: 210 },
        path: [
          { id: 'wp_ts7_cb1_1', x: 485, y: 270 },
          { id: 'wp_ts7_cb1_2', x: 485, y: 320 },
          { id: 'wp_ts7_cb1_3', x: 590, y: 320 },
          { id: 'wp_ts7_cb1_4', x: 590, y: 170 },
          { id: 'wp_ts7_cb1_5', x: 640, y: 170 },
          { id: 'wp_ts7_cb1_6', x: 640, y: 210 }
        ]
      },
      // KESALAHAN: Kabel traveler dari Saklar Silang out2 ke Saklar Tukar B L2 sengaja ditiadakan
      {
        id: 'wire_ts7_swB_lamp',
        color: 'red',
        from: { type: 'pin', componentId: 'ts7_swB', pinName: 'com', x: 655, y: 270 },
        to: { type: 'pin', componentId: 'ts7_lamp', pinName: 'L', x: 795, y: 240 },
        path: [
          { id: 'wp_ts7_bl1', x: 655, y: 270 },
          { id: 'wp_ts7_bl2', x: 730, y: 270 },
          { id: 'wp_ts7_bl3', x: 730, y: 240 },
          { id: 'wp_ts7_bl4', x: 795, y: 240 }
        ]
      },
      {
        id: 'wire_ts7_lamp_src_n',
        color: 'blue',
        from: { type: 'pin', componentId: 'ts7_lamp', pinName: 'N', x: 825, y: 240 },
        to: { type: 'pin', componentId: 'ts7_src', pinName: 'N', x: 105, y: 285 },
        path: [
          { id: 'wp_ts7_ln1', x: 825, y: 240 },
          { id: 'wp_ts7_ln2', x: 825, y: 370 },
          { id: 'wp_ts7_ln3', x: 105, y: 370 },
          { id: 'wp_ts7_ln4', x: 105, y: 285 }
        ]
      }
    ],
    hints: [
      "Simulasikan rangkaian dan uji seluruh kombinasi ketiga saklar (2 Saklar Tukar dan 1 Saklar Silang). Catat posisi di mana lampu gagal menyala.",
      "Rangkaian kendali dari 3 tempat membutuhkan 2 jalur traveler dari Saklar Tukar 1 ke Saklar Silang, dan 2 jalur traveler dari Saklar Silang ke Saklar Tukar 2.",
      "Periksa terminal keluaran Saklar Silang: terminal 'out1' dan 'out2' harus masing-masing terhubung ke terminal L1 dan L2 Saklar Tukar 2. Salah satu kabel traveler ini belum terpasang."
    ],
    solution: "Kabel penghubung traveler dari terminal 'out2' Saklar Silang ke terminal 'L2' Saklar Tukar 2 belum terpasang. Akibatnya aliran arus terputus pada kombinasi posisi saklar tertentu. Solusinya: pasang kabel baru yang menghubungkan terminal 'out2' Saklar Silang ke terminal 'L2' Saklar Tukar 2.",
    faultHighlightIds: ["ts7_swCross", "ts7_swB"]
  },
  {
    id: "ts_08",
    title: "Kabel Netral Panas, Beban Tidak Seimbang (3 Fasa)",
    customerReport: "\"Semua lampu gedung nyala, tapi kabel netral di panel terasa panas dan trafo berdengung.\"",
    initialComponents: [
      { id: 'ts8_src', type: 'Source_3P', x: 50, y: 140, rotation: 0, state: {} },
      { id: 'ts8_mcb', type: 'MCB_3P', x: 200, y: 180, rotation: 0, state: { on: true } },
      // Kolom 1 (3 Lampu)
      { id: 'ts8_lamp1', type: 'Lamp', x: 420, y: 80, rotation: 0, state: {} },
      { id: 'ts8_lamp2', type: 'Lamp', x: 420, y: 200, rotation: 0, state: {} },
      { id: 'ts8_lamp3', type: 'Lamp', x: 420, y: 320, rotation: 0, state: {} },
      // Kolom 2 (3 Lampu)
      { id: 'ts8_lamp4', type: 'Lamp', x: 620, y: 80, rotation: 0, state: {} },
      { id: 'ts8_lamp5', type: 'Lamp', x: 620, y: 200, rotation: 0, state: {} },
      { id: 'ts8_lamp6', type: 'Lamp', x: 620, y: 320, rotation: 0, state: {} }
    ],
    initialWires: [
      // Jalur Sumber 3P ke MCB 3P
      {
        id: 'wire_ts8_src_mcb_R',
        color: 'red',
        from: { type: 'pin', componentId: 'ts8_src', pinName: 'R', x: 115, y: 195 },
        to: { type: 'pin', componentId: 'ts8_mcb', pinName: 'in_R', x: 220, y: 190 },
        path: [
          { id: 'wp_ts8_smr1', x: 115, y: 195 },
          { id: 'wp_ts8_smr2', x: 160, y: 195 },
          { id: 'wp_ts8_smr3', x: 160, y: 190 },
          { id: 'wp_ts8_smr4', x: 220, y: 190 }
        ]
      },
      {
        id: 'wire_ts8_src_mcb_S',
        color: 'yellow',
        from: { type: 'pin', componentId: 'ts8_src', pinName: 'S', x: 115, y: 225 },
        to: { type: 'pin', componentId: 'ts8_mcb', pinName: 'in_S', x: 240, y: 190 },
        path: [
          { id: 'wp_ts8_sms1', x: 115, y: 225 },
          { id: 'wp_ts8_sms2', x: 175, y: 225 },
          { id: 'wp_ts8_sms3', x: 175, y: 190 },
          { id: 'wp_ts8_sms4', x: 240, y: 190 }
        ]
      },
      {
        id: 'wire_ts8_src_mcb_T',
        color: 'black',
        from: { type: 'pin', componentId: 'ts8_src', pinName: 'T', x: 115, y: 255 },
        to: { type: 'pin', componentId: 'ts8_mcb', pinName: 'in_T', x: 260, y: 190 },
        path: [
          { id: 'wp_ts8_smt1', x: 115, y: 255 },
          { id: 'wp_ts8_smt2', x: 190, y: 255 },
          { id: 'wp_ts8_smt3', x: 190, y: 190 },
          { id: 'wp_ts8_smt4', x: 260, y: 190 }
        ]
      },

      // KESALAHAN: Fasa R menanggung 4 Lampu (Lamp 1, 2, 3, 4)
      {
        id: 'wire_ts8_r_trunk',
        color: 'red',
        from: { type: 'pin', componentId: 'ts8_mcb', pinName: 'out_R', x: 220, y: 270 },
        to: { type: 'pin', componentId: 'ts8_lamp1', pinName: 'L', x: 445, y: 120 },
        path: [
          { id: 'wp_ts8_r1', x: 220, y: 270 },
          { id: 'wp_ts8_r2', x: 220, y: 300 },
          { id: 'wp_ts8_r3', x: 340, y: 300 },
          { id: 'wp_ts8_r_br3', x: 340, y: 360 },
          { id: 'wp_ts8_r_br2', x: 340, y: 240 },
          { id: 'wp_ts8_r_br1', x: 340, y: 120 },
          { id: 'wp_ts8_r_lamp1', x: 445, y: 120 }
        ]
      },
      {
        id: 'wire_ts8_r_lamp2',
        color: 'red',
        from: { type: 'wire', wireId: 'wire_ts8_r_trunk', waypointId: 'wp_ts8_r_br2', x: 340, y: 240 },
        to: { type: 'pin', componentId: 'ts8_lamp2', pinName: 'L', x: 445, y: 240 },
        path: [
          { id: 'wp_ts8_rl2_1', x: 340, y: 240 },
          { id: 'wp_ts8_rl2_2', x: 445, y: 240 }
        ]
      },
      {
        id: 'wire_ts8_r_lamp3',
        color: 'red',
        from: { type: 'wire', wireId: 'wire_ts8_r_trunk', waypointId: 'wp_ts8_r_br3', x: 340, y: 360 },
        to: { type: 'pin', componentId: 'ts8_lamp3', pinName: 'L', x: 445, y: 360 },
        path: [
          { id: 'wp_ts8_rl3_1', x: 340, y: 360 },
          { id: 'wp_ts8_rl3_2', x: 445, y: 360 }
        ]
      },
      {
        id: 'wire_ts8_r_lamp4',
        color: 'red',
        from: { type: 'wire', wireId: 'wire_ts8_r_trunk', waypointId: 'wp_ts8_r_br1', x: 340, y: 120 },
        to: { type: 'pin', componentId: 'ts8_lamp4', pinName: 'L', x: 645, y: 120 },
        path: [
          { id: 'wp_ts8_rl4_1', x: 340, y: 120 },
          { id: 'wp_ts8_rl4_2', x: 340, y: 50 },
          { id: 'wp_ts8_rl4_3', x: 645, y: 50 },
          { id: 'wp_ts8_rl4_4', x: 645, y: 120 }
        ]
      },

      // KESALAHAN: Fasa S menanggung 2 Lampu (Lamp 5, 6)
      {
        id: 'wire_ts8_s_trunk',
        color: 'yellow',
        from: { type: 'pin', componentId: 'ts8_mcb', pinName: 'out_S', x: 240, y: 270 },
        to: { type: 'pin', componentId: 'ts8_lamp5', pinName: 'L', x: 645, y: 240 },
        path: [
          { id: 'wp_ts8_s1', x: 240, y: 270 },
          { id: 'wp_ts8_s2', x: 240, y: 330 },
          { id: 'wp_ts8_s3', x: 540, y: 330 },
          { id: 'wp_ts8_s_br6', x: 540, y: 360 },
          { id: 'wp_ts8_s_br5', x: 540, y: 240 },
          { id: 'wp_ts8_s_lamp5', x: 645, y: 240 }
        ]
      },
      {
        id: 'wire_ts8_s_lamp6',
        color: 'yellow',
        from: { type: 'wire', wireId: 'wire_ts8_s_trunk', waypointId: 'wp_ts8_s_br6', x: 540, y: 360 },
        to: { type: 'pin', componentId: 'ts8_lamp6', pinName: 'L', x: 645, y: 360 },
        path: [
          { id: 'wp_ts8_sl6_1', x: 540, y: 360 },
          { id: 'wp_ts8_sl6_2', x: 645, y: 360 }
        ]
      },

      // KESALAHAN: Fasa T out_T kosong (0 lampu)!

      // Kabel Netral Bersama ke seluruh 6 lampu
      {
        id: 'wire_ts8_netral_trunk',
        color: 'blue',
        from: { type: 'pin', componentId: 'ts8_lamp4', pinName: 'N', x: 675, y: 120 },
        to: { type: 'pin', componentId: 'ts8_src', pinName: 'N', x: 115, y: 285 },
        path: [
          { id: 'wp_ts8_n_lamp4', x: 675, y: 120 },
          { id: 'wp_ts8_n_br4', x: 710, y: 120 },
          { id: 'wp_ts8_n_br5', x: 710, y: 240 },
          { id: 'wp_ts8_n_br6', x: 710, y: 360 },
          { id: 'wp_ts8_n_bot', x: 710, y: 430 },
          { id: 'wp_ts8_n_br_col1', x: 510, y: 430 },
          { id: 'wp_ts8_n_left', x: 115, y: 430 },
          { id: 'wp_ts8_n_src', x: 115, y: 285 }
        ]
      },
      {
        id: 'wire_ts8_n_lamp5',
        color: 'blue',
        from: { type: 'pin', componentId: 'ts8_lamp5', pinName: 'N', x: 675, y: 240 },
        to: { type: 'wire', wireId: 'wire_ts8_netral_trunk', waypointId: 'wp_ts8_n_br5', x: 710, y: 240 },
        path: [
          { id: 'wp_ts8_nl5_1', x: 675, y: 240 },
          { id: 'wp_ts8_nl5_2', x: 710, y: 240 }
        ]
      },
      {
        id: 'wire_ts8_n_lamp6',
        color: 'blue',
        from: { type: 'pin', componentId: 'ts8_lamp6', pinName: 'N', x: 675, y: 360 },
        to: { type: 'wire', wireId: 'wire_ts8_netral_trunk', waypointId: 'wp_ts8_n_br6', x: 710, y: 360 },
        path: [
          { id: 'wp_ts8_nl6_1', x: 675, y: 360 },
          { id: 'wp_ts8_nl6_2', x: 710, y: 360 }
        ]
      },
      {
        id: 'wire_ts8_n_col1_trunk',
        color: 'blue',
        from: { type: 'pin', componentId: 'ts8_lamp1', pinName: 'N', x: 475, y: 120 },
        to: { type: 'wire', wireId: 'wire_ts8_netral_trunk', waypointId: 'wp_ts8_n_br_col1', x: 510, y: 430 },
        path: [
          { id: 'wp_ts8_nc1_lamp1', x: 475, y: 120 },
          { id: 'wp_ts8_nc1_br1', x: 510, y: 120 },
          { id: 'wp_ts8_nc1_br2', x: 510, y: 240 },
          { id: 'wp_ts8_nc1_br3', x: 510, y: 360 },
          { id: 'wp_ts8_nc1_bot', x: 510, y: 430 }
        ]
      },
      {
        id: 'wire_ts8_n_lamp2',
        color: 'blue',
        from: { type: 'pin', componentId: 'ts8_lamp2', pinName: 'N', x: 475, y: 240 },
        to: { type: 'wire', wireId: 'wire_ts8_n_col1_trunk', waypointId: 'wp_ts8_nc1_br2', x: 510, y: 240 },
        path: [
          { id: 'wp_ts8_nl2_1', x: 475, y: 240 },
          { id: 'wp_ts8_nl2_2', x: 510, y: 240 }
        ]
      },
      {
        id: 'wire_ts8_n_lamp3',
        color: 'blue',
        from: { type: 'pin', componentId: 'ts8_lamp3', pinName: 'N', x: 475, y: 360 },
        to: { type: 'wire', wireId: 'wire_ts8_n_col1_trunk', waypointId: 'wp_ts8_nc1_br3', x: 510, y: 360 },
        path: [
          { id: 'wp_ts8_nl3_1', x: 475, y: 360 },
          { id: 'wp_ts8_nl3_2', x: 510, y: 360 }
        ]
      }
    ],
    hints: [
      "Simulasikan rangkaian dan periksa kartu peringatan kuning di kanvas. Meskipun semua lampu menyala, ada peringatan serius terkait beban fasa.",
      "Pada sistem 3-fasa, total beban harus dibagi seimbang ke fasa R, S, dan T. Hitung berapa lampu yang tersambung ke masing-masing fasa saat ini.",
      "Fasa R menanggung 4 lampu, Fasa S menanggung 2 lampu, sedangkan Fasa T kosong (0 lampu). Pindahkan 2 lampu dari Fasa R ke Fasa T (kabel hitam) sehingga masing-masing fasa menanggung tepat 2 lampu (2-2-2)."
    ],
    solution: "Pembagian beban pada instalasi 3-fasa sangat tidak seimbang: Fasa R menanggung 4 lampu, Fasa S menanggung 2 lampu, sedangkan Fasa T sama sekali tidak diberi beban (0 lampu). Ketidakseimbangan ekstrem ini menimbulkan arus netral yang besar dan membuat kabel netral panas. Solusinya: pindahkan 2 lampu dari Fasa R ke terminal Fasa T (out_T MCB 3P / kabel hitam), sehingga beban terbagi rata 2-2-2 di setiap fasa.",
    faultHighlightIds: ["ts8_lamp3", "ts8_lamp4"]
  }
];
