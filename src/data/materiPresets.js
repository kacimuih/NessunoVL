// Data Rangkaian Contoh Interaktif untuk Materi Virtual Lab IPL
// Format data kompatibel langsung dengan state.canvas.components dan state.canvas.wires

export const MATERI_PRESETS = {
  SwitchSingle: {
    label: "Contoh: Saklar Tunggal Mengontrol 1 Lampu",
    components: [
      { id: 'src_1p', type: 'Source_1P', x: 80, y: 180, rotation: 0, state: {} },
      { id: 'preset_mcb', type: 'MCB_1P', x: 240, y: 200, rotation: 0, state: { on: true } },
      { id: 'preset_sw', type: 'SwitchSingle', x: 380, y: 210, rotation: 0, state: { on: false } },
      { id: 'preset_lamp', type: 'Lamp', x: 520, y: 210, rotation: 0, state: {} }
    ],
    wires: [
      {
        id: 'wire_src_mcb',
        color: 'red',
        from: { type: 'pin', componentId: 'src_1p', pinName: 'L', x: 145, y: 235 },
        to: { type: 'pin', componentId: 'preset_mcb', pinName: 'in', x: 270, y: 210 },
        path: [
          { id: 'wp_sm1', x: 145, y: 235 },
          { id: 'wp_sm2', x: 210, y: 235 },
          { id: 'wp_sm3', x: 210, y: 210 },
          { id: 'wp_sm4', x: 270, y: 210 }
        ]
      },
      {
        id: 'wire_mcb_sw',
        color: 'red',
        from: { type: 'pin', componentId: 'preset_mcb', pinName: 'out', x: 270, y: 290 },
        to: { type: 'pin', componentId: 'preset_sw', pinName: 'in', x: 410, y: 220 },
        path: [
          { id: 'wp_ms1', x: 270, y: 290 },
          { id: 'wp_ms2', x: 330, y: 290 },
          { id: 'wp_ms3', x: 330, y: 220 },
          { id: 'wp_ms4', x: 410, y: 220 }
        ]
      },
      {
        id: 'wire_sw_lamp',
        color: 'red',
        from: { type: 'pin', componentId: 'preset_sw', pinName: 'out', x: 410, y: 280 },
        to: { type: 'pin', componentId: 'preset_lamp', pinName: 'L', x: 545, y: 250 },
        path: [
          { id: 'wp_sl1', x: 410, y: 280 },
          { id: 'wp_sl2', x: 480, y: 280 },
          { id: 'wp_sl3', x: 480, y: 250 },
          { id: 'wp_sl4', x: 545, y: 250 }
        ]
      },
      {
        id: 'wire_lamp_src_n',
        color: 'blue',
        from: { type: 'pin', componentId: 'preset_lamp', pinName: 'N', x: 575, y: 250 },
        to: { type: 'pin', componentId: 'src_1p', pinName: 'N', x: 145, y: 265 },
        path: [
          { id: 'wp_ln1', x: 575, y: 250 },
          { id: 'wp_ln2', x: 575, y: 350 },
          { id: 'wp_ln3', x: 180, y: 350 },
          { id: 'wp_ln4', x: 180, y: 265 },
          { id: 'wp_ln5', x: 145, y: 265 }
        ]
      }
    ]
  },

  SwitchDouble: {
    label: "Contoh: Saklar Seri (Deret) Mengontrol 2 Lampu",
    components: [
      { id: 'src_1p', type: 'Source_1P', x: 80, y: 180, rotation: 0, state: {} },
      { id: 'preset_mcb', type: 'MCB_1P', x: 220, y: 200, rotation: 0, state: { on: true } },
      { id: 'preset_sw', type: 'SwitchDouble', x: 350, y: 200, rotation: 0, state: { on1: false, on2: false } },
      { id: 'preset_lamp1', type: 'Lamp', x: 520, y: 130, rotation: 0, state: {} },
      { id: 'preset_lamp2', type: 'Lamp', x: 520, y: 280, rotation: 0, state: {} }
    ],
    wires: [
      {
        id: 'wire_src_mcb',
        color: 'red',
        from: { type: 'pin', componentId: 'src_1p', pinName: 'L', x: 145, y: 235 },
        to: { type: 'pin', componentId: 'preset_mcb', pinName: 'in', x: 250, y: 210 },
        path: [
          { id: 'wp_sm1', x: 145, y: 235 },
          { id: 'wp_sm2', x: 200, y: 235 },
          { id: 'wp_sm3', x: 200, y: 210 },
          { id: 'wp_sm4', x: 250, y: 210 }
        ]
      },
      {
        id: 'wire_mcb_sw',
        color: 'red',
        from: { type: 'pin', componentId: 'preset_mcb', pinName: 'out', x: 250, y: 290 },
        to: { type: 'pin', componentId: 'preset_sw', pinName: 'in', x: 390, y: 270 },
        path: [
          { id: 'wp_ms1', x: 250, y: 290 },
          { id: 'wp_ms2', x: 320, y: 290 },
          { id: 'wp_ms3', x: 320, y: 270 },
          { id: 'wp_ms4', x: 390, y: 270 }
        ]
      },
      {
        id: 'wire_sw_lamp1',
        color: 'red',
        from: { type: 'pin', componentId: 'preset_sw', pinName: 'out1', x: 375, y: 210 },
        to: { type: 'pin', componentId: 'preset_lamp1', pinName: 'L', x: 545, y: 170 },
        path: [
          { id: 'wp_sl1_1', x: 375, y: 210 },
          { id: 'wp_sl1_2', x: 375, y: 170 },
          { id: 'wp_sl1_3', x: 545, y: 170 }
        ]
      },
      {
        id: 'wire_sw_lamp2',
        color: 'red',
        from: { type: 'pin', componentId: 'preset_sw', pinName: 'out2', x: 405, y: 210 },
        to: { type: 'pin', componentId: 'preset_lamp2', pinName: 'L', x: 545, y: 320 },
        path: [
          { id: 'wp_sl2_1', x: 405, y: 210 },
          { id: 'wp_sl2_2', x: 460, y: 210 },
          { id: 'wp_sl2_3', x: 460, y: 320 },
          { id: 'wp_sl2_4', x: 545, y: 320 }
        ]
      },
      {
        id: 'wire_lamp1_n',
        color: 'blue',
        from: { type: 'pin', componentId: 'preset_lamp1', pinName: 'N', x: 575, y: 170 },
        to: { type: 'pin', componentId: 'src_1p', pinName: 'N', x: 145, y: 265 },
        path: [
          { id: 'wp_ln1_1', x: 575, y: 170 },
          { id: 'wp_ln1_2', x: 620, y: 170 },
          { id: 'wp_ln1_3', x: 620, y: 400 },
          { id: 'wp_ln1_4', x: 170, y: 400 },
          { id: 'wp_ln1_5', x: 170, y: 265 },
          { id: 'wp_ln1_6', x: 145, y: 265 }
        ]
      },
      {
        id: 'wire_lamp2_n',
        color: 'blue',
        from: { type: 'pin', componentId: 'preset_lamp2', pinName: 'N', x: 575, y: 320 },
        to: { type: 'pin', componentId: 'src_1p', pinName: 'N', x: 145, y: 265 },
        path: [
          { id: 'wp_ln2_1', x: 575, y: 320 },
          { id: 'wp_ln2_2', x: 600, y: 320 },
          { id: 'wp_ln2_3', x: 600, y: 380 },
          { id: 'wp_ln2_4', x: 190, y: 380 },
          { id: 'wp_ln2_5', x: 190, y: 265 },
          { id: 'wp_ln2_6', x: 145, y: 265 }
        ]
      }
    ]
  },

  SwitchWay3: {
    label: "Contoh: Saklar Tukar (Hotel) 2 Titik Kontrol",
    components: [
      { id: 'src_1p', type: 'Source_1P', x: 60, y: 180, rotation: 0, state: {} },
      { id: 'preset_mcb', type: 'MCB_1P', x: 190, y: 200, rotation: 0, state: { on: true } },
      { id: 'preset_sw1', type: 'SwitchWay3', x: 310, y: 200, rotation: 0, state: { on: true } },
      { id: 'preset_sw2', type: 'SwitchWay3', x: 450, y: 200, rotation: 0, state: { on: true } },
      { id: 'preset_lamp', type: 'Lamp', x: 590, y: 200, rotation: 0, state: {} }
    ],
    wires: [
      {
        id: 'wire_src_mcb',
        color: 'red',
        from: { type: 'pin', componentId: 'src_1p', pinName: 'L', x: 125, y: 235 },
        to: { type: 'pin', componentId: 'preset_mcb', pinName: 'in', x: 220, y: 210 },
        path: [
          { id: 'wp_sm1', x: 125, y: 235 },
          { id: 'wp_sm2', x: 170, y: 235 },
          { id: 'wp_sm3', x: 170, y: 210 },
          { id: 'wp_sm4', x: 220, y: 210 }
        ]
      },
      {
        id: 'wire_mcb_sw1',
        color: 'red',
        from: { type: 'pin', componentId: 'preset_mcb', pinName: 'out', x: 220, y: 290 },
        to: { type: 'pin', componentId: 'preset_sw1', pinName: 'com', x: 345, y: 270 },
        path: [
          { id: 'wp_ms1', x: 220, y: 290 },
          { id: 'wp_ms2', x: 345, y: 290 },
          { id: 'wp_ms3', x: 345, y: 270 }
        ]
      },
      {
        id: 'wire_sw1_sw2_L1',
        color: 'red',
        from: { type: 'pin', componentId: 'preset_sw1', pinName: 'L1', x: 330, y: 210 },
        to: { type: 'pin', componentId: 'preset_sw2', pinName: 'L1', x: 470, y: 210 },
        path: [
          { id: 'wp_ss1_1', x: 330, y: 210 },
          { id: 'wp_ss1_2', x: 470, y: 210 }
        ]
      },
      {
        id: 'wire_sw1_sw2_L2',
        color: 'red',
        from: { type: 'pin', componentId: 'preset_sw1', pinName: 'L2', x: 360, y: 210 },
        to: { type: 'pin', componentId: 'preset_sw2', pinName: 'L2', x: 500, y: 210 },
        path: [
          { id: 'wp_ss2_1', x: 360, y: 210 },
          { id: 'wp_ss2_2', x: 360, y: 170 },
          { id: 'wp_ss2_3', x: 500, y: 170 },
          { id: 'wp_ss2_4', x: 500, y: 210 }
        ]
      },
      {
        id: 'wire_sw2_lamp',
        color: 'red',
        from: { type: 'pin', componentId: 'preset_sw2', pinName: 'com', x: 485, y: 270 },
        to: { type: 'pin', componentId: 'preset_lamp', pinName: 'L', x: 615, y: 240 },
        path: [
          { id: 'wp_sl1', x: 485, y: 270 },
          { id: 'wp_sl2', x: 550, y: 270 },
          { id: 'wp_sl3', x: 550, y: 240 },
          { id: 'wp_sl4', x: 615, y: 240 }
        ]
      },
      {
        id: 'wire_lamp_src_n',
        color: 'blue',
        from: { type: 'pin', componentId: 'preset_lamp', pinName: 'N', x: 645, y: 240 },
        to: { type: 'pin', componentId: 'src_1p', pinName: 'N', x: 125, y: 265 },
        path: [
          { id: 'wp_ln1', x: 645, y: 240 },
          { id: 'wp_ln2', x: 645, y: 360 },
          { id: 'wp_ln3', x: 150, y: 360 },
          { id: 'wp_ln4', x: 150, y: 265 },
          { id: 'wp_ln5', x: 125, y: 265 }
        ]
      }
    ]
  },

  SwitchCross: {
    label: "Contoh: Saklar Silang (3 Lokasi Saklar Mengontrol 1 Lampu)",
    components: [
      { id: 'src_1p', type: 'Source_1P', x: 50, y: 180, rotation: 0, state: {} },
      { id: 'preset_mcb', type: 'MCB_1P', x: 170, y: 200, rotation: 0, state: { on: true } },
      { id: 'preset_sw1', type: 'SwitchWay3', x: 280, y: 200, rotation: 0, state: { on: true } },
      { id: 'preset_cross', type: 'SwitchCross', x: 410, y: 200, rotation: 0, state: { on: false } },
      { id: 'preset_sw2', type: 'SwitchWay3', x: 550, y: 200, rotation: 0, state: { on: true } },
      { id: 'preset_lamp', type: 'Lamp', x: 680, y: 200, rotation: 0, state: {} }
    ],
    wires: [
      {
        id: 'wire_src_mcb',
        color: 'red',
        from: { type: 'pin', componentId: 'src_1p', pinName: 'L', x: 115, y: 235 },
        to: { type: 'pin', componentId: 'preset_mcb', pinName: 'in', x: 200, y: 210 },
        path: [
          { id: 'wp_sm1', x: 115, y: 235 },
          { id: 'wp_sm2', x: 155, y: 235 },
          { id: 'wp_sm3', x: 155, y: 210 },
          { id: 'wp_sm4', x: 200, y: 210 }
        ]
      },
      {
        id: 'wire_mcb_sw1',
        color: 'red',
        from: { type: 'pin', componentId: 'preset_mcb', pinName: 'out', x: 200, y: 290 },
        to: { type: 'pin', componentId: 'preset_sw1', pinName: 'com', x: 315, y: 270 },
        path: [
          { id: 'wp_ms1', x: 200, y: 290 },
          { id: 'wp_ms2', x: 315, y: 290 },
          { id: 'wp_ms3', x: 315, y: 270 }
        ]
      },
      {
        id: 'wire_sw1_cr_in1',
        color: 'red',
        from: { type: 'pin', componentId: 'preset_sw1', pinName: 'L1', x: 300, y: 210 },
        to: { type: 'pin', componentId: 'preset_cross', pinName: 'in1', x: 435, y: 210 },
        path: [
          { id: 'wp_sc1', x: 300, y: 210 },
          { id: 'wp_sc2', x: 435, y: 210 }
        ]
      },
      {
        id: 'wire_sw1_cr_in2',
        color: 'red',
        from: { type: 'pin', componentId: 'preset_sw1', pinName: 'L2', x: 330, y: 210 },
        to: { type: 'pin', componentId: 'preset_cross', pinName: 'in2', x: 465, y: 210 },
        path: [
          { id: 'wp_sc7', x: 330, y: 210 },
          { id: 'wp_sc8', x: 330, y: 175 },
          { id: 'wp_sc9', x: 465, y: 175 },
          { id: 'wp_sc10', x: 465, y: 210 }
        ]
      },
      {
        id: 'wire_cr_out1_sw2',
        color: 'red',
        from: { type: 'pin', componentId: 'preset_cross', pinName: 'out1', x: 435, y: 270 },
        to: { type: 'pin', componentId: 'preset_sw2', pinName: 'L1', x: 570, y: 210 },
        path: [
          { id: 'wp_cs1', x: 435, y: 270 },
          { id: 'wp_cs2', x: 510, y: 270 },
          { id: 'wp_cs3', x: 510, y: 210 },
          { id: 'wp_cs4', x: 570, y: 210 }
        ]
      },
      {
        id: 'wire_cr_out2_sw2',
        color: 'red',
        from: { type: 'pin', componentId: 'preset_cross', pinName: 'out2', x: 465, y: 270 },
        to: { type: 'pin', componentId: 'preset_sw2', pinName: 'L2', x: 600, y: 210 },
        path: [
          { id: 'wp_cs5', x: 465, y: 270 },
          { id: 'wp_cs6', x: 465, y: 300 },
          { id: 'wp_cs7', x: 620, y: 300 },
          { id: 'wp_cs8', x: 620, y: 210 },
          { id: 'wp_cs9', x: 600, y: 210 }
        ]
      },
      {
        id: 'wire_sw2_lamp',
        color: 'red',
        from: { type: 'pin', componentId: 'preset_sw2', pinName: 'com', x: 585, y: 270 },
        to: { type: 'pin', componentId: 'preset_lamp', pinName: 'L', x: 705, y: 240 },
        path: [
          { id: 'wp_sl1', x: 585, y: 270 },
          { id: 'wp_sl2', x: 650, y: 270 },
          { id: 'wp_sl3', x: 650, y: 240 },
          { id: 'wp_sl4', x: 705, y: 240 }
        ]
      },
      {
        id: 'wire_lamp_src_n',
        color: 'blue',
        from: { type: 'pin', componentId: 'preset_lamp', pinName: 'N', x: 735, y: 240 },
        to: { type: 'pin', componentId: 'src_1p', pinName: 'N', x: 115, y: 265 },
        path: [
          { id: 'wp_ln1', x: 735, y: 240 },
          { id: 'wp_ln2', x: 735, y: 370 },
          { id: 'wp_ln3', x: 140, y: 370 },
          { id: 'wp_ln4', x: 140, y: 265 },
          { id: 'wp_ln5', x: 115, y: 265 }
        ]
      }
    ]
  },

  MCB_1P: {
    label: "Contoh: Prinsip Kerja Pengaman MCB 1-Fasa",
    components: [
      { id: 'src_1p', type: 'Source_1P', x: 80, y: 180, rotation: 0, state: {} },
      { id: 'preset_mcb', type: 'MCB_1P', x: 240, y: 200, rotation: 0, state: { on: true } },
      { id: 'preset_sw', type: 'SwitchSingle', x: 380, y: 210, rotation: 0, state: { on: true } },
      { id: 'preset_lamp', type: 'Lamp', x: 520, y: 210, rotation: 0, state: {} }
    ],
    wires: [
      {
        id: 'wire_src_mcb',
        color: 'red',
        from: { type: 'pin', componentId: 'src_1p', pinName: 'L', x: 145, y: 235 },
        to: { type: 'pin', componentId: 'preset_mcb', pinName: 'in', x: 270, y: 210 },
        path: [
          { id: 'wp_sm1', x: 145, y: 235 },
          { id: 'wp_sm2', x: 210, y: 235 },
          { id: 'wp_sm3', x: 210, y: 210 },
          { id: 'wp_sm4', x: 270, y: 210 }
        ]
      },
      {
        id: 'wire_mcb_sw',
        color: 'red',
        from: { type: 'pin', componentId: 'preset_mcb', pinName: 'out', x: 270, y: 290 },
        to: { type: 'pin', componentId: 'preset_sw', pinName: 'in', x: 410, y: 220 },
        path: [
          { id: 'wp_ms1', x: 270, y: 290 },
          { id: 'wp_ms2', x: 330, y: 290 },
          { id: 'wp_ms3', x: 330, y: 220 },
          { id: 'wp_ms4', x: 410, y: 220 }
        ]
      },
      {
        id: 'wire_sw_lamp',
        color: 'red',
        from: { type: 'pin', componentId: 'preset_sw', pinName: 'out', x: 410, y: 280 },
        to: { type: 'pin', componentId: 'preset_lamp', pinName: 'L', x: 545, y: 250 },
        path: [
          { id: 'wp_sl1', x: 410, y: 280 },
          { id: 'wp_sl2', x: 480, y: 280 },
          { id: 'wp_sl3', x: 480, y: 250 },
          { id: 'wp_sl4', x: 545, y: 250 }
        ]
      },
      {
        id: 'wire_lamp_src_n',
        color: 'blue',
        from: { type: 'pin', componentId: 'preset_lamp', pinName: 'N', x: 575, y: 250 },
        to: { type: 'pin', componentId: 'src_1p', pinName: 'N', x: 145, y: 265 },
        path: [
          { id: 'wp_ln1', x: 575, y: 250 },
          { id: 'wp_ln2', x: 575, y: 350 },
          { id: 'wp_ln3', x: 180, y: 350 },
          { id: 'wp_ln4', x: 180, y: 265 },
          { id: 'wp_ln5', x: 145, y: 265 }
        ]
      }
    ]
  },

  Fuse: {
    label: "Contoh: Pengaman Lebur (Sekring) 1-Fasa",
    components: [
      { id: 'src_1p', type: 'Source_1P', x: 80, y: 180, rotation: 0, state: {} },
      { id: 'preset_fuse', type: 'Fuse', x: 240, y: 210, rotation: 0, state: {} },
      { id: 'preset_sw', type: 'SwitchSingle', x: 380, y: 210, rotation: 0, state: { on: true } },
      { id: 'preset_lamp', type: 'Lamp', x: 520, y: 210, rotation: 0, state: {} }
    ],
    wires: [
      {
        id: 'wire_src_fuse',
        color: 'red',
        from: { type: 'pin', componentId: 'src_1p', pinName: 'L', x: 145, y: 235 },
        to: { type: 'pin', componentId: 'preset_fuse', pinName: 'in', x: 265, y: 220 },
        path: [
          { id: 'wp_sf1', x: 145, y: 235 },
          { id: 'wp_sf2', x: 205, y: 235 },
          { id: 'wp_sf3', x: 205, y: 220 },
          { id: 'wp_sf4', x: 265, y: 220 }
        ]
      },
      {
        id: 'wire_fuse_sw',
        color: 'red',
        from: { type: 'pin', componentId: 'preset_fuse', pinName: 'out', x: 265, y: 280 },
        to: { type: 'pin', componentId: 'preset_sw', pinName: 'in', x: 410, y: 220 },
        path: [
          { id: 'wp_fs1', x: 265, y: 280 },
          { id: 'wp_fs2', x: 335, y: 280 },
          { id: 'wp_fs3', x: 335, y: 220 },
          { id: 'wp_fs4', x: 410, y: 220 }
        ]
      },
      {
        id: 'wire_sw_lamp',
        color: 'red',
        from: { type: 'pin', componentId: 'preset_sw', pinName: 'out', x: 410, y: 280 },
        to: { type: 'pin', componentId: 'preset_lamp', pinName: 'L', x: 545, y: 250 },
        path: [
          { id: 'wp_sl1', x: 410, y: 280 },
          { id: 'wp_sl2', x: 480, y: 280 },
          { id: 'wp_sl3', x: 480, y: 250 },
          { id: 'wp_sl4', x: 545, y: 250 }
        ]
      },
      {
        id: 'wire_lamp_src_n',
        color: 'blue',
        from: { type: 'pin', componentId: 'preset_lamp', pinName: 'N', x: 575, y: 250 },
        to: { type: 'pin', componentId: 'src_1p', pinName: 'N', x: 145, y: 265 },
        path: [
          { id: 'wp_ln1', x: 575, y: 250 },
          { id: 'wp_ln2', x: 575, y: 350 },
          { id: 'wp_ln3', x: 180, y: 350 },
          { id: 'wp_ln4', x: 180, y: 265 },
          { id: 'wp_ln5', x: 145, y: 265 }
        ]
      }
    ]
  },

  Socket: {
    label: "Contoh: Rangkaian Stop Kontak 1-Fasa (L, N, PE)",
    components: [
      { id: 'src_1p', type: 'Source_1P', x: 100, y: 180, rotation: 0, state: {} },
      { id: 'preset_mcb', type: 'MCB_1P', x: 270, y: 200, rotation: 0, state: { on: true } },
      { id: 'preset_sock', type: 'Socket', x: 440, y: 200, rotation: 0, state: {} }
    ],
    wires: [
      {
        id: 'wire_src_mcb',
        color: 'red',
        from: { type: 'pin', componentId: 'src_1p', pinName: 'L', x: 165, y: 235 },
        to: { type: 'pin', componentId: 'preset_mcb', pinName: 'in', x: 300, y: 210 },
        path: [
          { id: 'wp_sm1', x: 165, y: 235 },
          { id: 'wp_sm2', x: 230, y: 235 },
          { id: 'wp_sm3', x: 230, y: 210 },
          { id: 'wp_sm4', x: 300, y: 210 }
        ]
      },
      {
        id: 'wire_mcb_sock',
        color: 'red',
        from: { type: 'pin', componentId: 'preset_mcb', pinName: 'out', x: 300, y: 290 },
        to: { type: 'pin', componentId: 'preset_sock', pinName: 'L', x: 465, y: 240 },
        path: [
          { id: 'wp_ms1', x: 300, y: 290 },
          { id: 'wp_ms2', x: 380, y: 290 },
          { id: 'wp_ms3', x: 380, y: 240 },
          { id: 'wp_ms4', x: 465, y: 240 }
        ]
      },
      {
        id: 'wire_sock_src_n',
        color: 'blue',
        from: { type: 'pin', componentId: 'preset_sock', pinName: 'N', x: 495, y: 240 },
        to: { type: 'pin', componentId: 'src_1p', pinName: 'N', x: 165, y: 265 },
        path: [
          { id: 'wp_sn1', x: 495, y: 240 },
          { id: 'wp_sn2', x: 550, y: 240 },
          { id: 'wp_sn3', x: 550, y: 330 },
          { id: 'wp_sn4', x: 210, y: 330 },
          { id: 'wp_sn5', x: 210, y: 265 },
          { id: 'wp_sn6', x: 165, y: 265 }
        ]
      },
      {
        id: 'wire_sock_src_pe',
        color: 'green',
        from: { type: 'pin', componentId: 'preset_sock', pinName: 'PE', x: 480, y: 265 },
        to: { type: 'pin', componentId: 'src_1p', pinName: 'PE', x: 165, y: 295 },
        path: [
          { id: 'wp_spe1', x: 480, y: 265 },
          { id: 'wp_spe2', x: 520, y: 265 },
          { id: 'wp_spe3', x: 520, y: 360 },
          { id: 'wp_spe4', x: 230, y: 360 },
          { id: 'wp_spe5', x: 230, y: 295 },
          { id: 'wp_spe6', x: 165, y: 295 }
        ]
      }
    ]
  },

  Lamp: {
    label: "Contoh: Instalasi Fitting Lampu & Pengendali Saklar",
    components: [
      { id: 'src_1p', type: 'Source_1P', x: 80, y: 180, rotation: 0, state: {} },
      { id: 'preset_mcb', type: 'MCB_1P', x: 240, y: 200, rotation: 0, state: { on: true } },
      { id: 'preset_sw', type: 'SwitchSingle', x: 380, y: 210, rotation: 0, state: { on: true } },
      { id: 'preset_lamp', type: 'Lamp', x: 520, y: 210, rotation: 0, state: {} }
    ],
    wires: [
      {
        id: 'wire_src_mcb',
        color: 'red',
        from: { type: 'pin', componentId: 'src_1p', pinName: 'L', x: 145, y: 235 },
        to: { type: 'pin', componentId: 'preset_mcb', pinName: 'in', x: 270, y: 210 },
        path: [
          { id: 'wp_sm1', x: 145, y: 235 },
          { id: 'wp_sm2', x: 210, y: 235 },
          { id: 'wp_sm3', x: 210, y: 210 },
          { id: 'wp_sm4', x: 270, y: 210 }
        ]
      },
      {
        id: 'wire_mcb_sw',
        color: 'red',
        from: { type: 'pin', componentId: 'preset_mcb', pinName: 'out', x: 270, y: 290 },
        to: { type: 'pin', componentId: 'preset_sw', pinName: 'in', x: 410, y: 220 },
        path: [
          { id: 'wp_ms1', x: 270, y: 290 },
          { id: 'wp_ms2', x: 330, y: 290 },
          { id: 'wp_ms3', x: 330, y: 220 },
          { id: 'wp_ms4', x: 410, y: 220 }
        ]
      },
      {
        id: 'wire_sw_lamp',
        color: 'red',
        from: { type: 'pin', componentId: 'preset_sw', pinName: 'out', x: 410, y: 280 },
        to: { type: 'pin', componentId: 'preset_lamp', pinName: 'L', x: 545, y: 250 },
        path: [
          { id: 'wp_sl1', x: 410, y: 280 },
          { id: 'wp_sl2', x: 480, y: 280 },
          { id: 'wp_sl3', x: 480, y: 250 },
          { id: 'wp_sl4', x: 545, y: 250 }
        ]
      },
      {
        id: 'wire_lamp_src_n',
        color: 'blue',
        from: { type: 'pin', componentId: 'preset_lamp', pinName: 'N', x: 575, y: 250 },
        to: { type: 'pin', componentId: 'src_1p', pinName: 'N', x: 145, y: 265 },
        path: [
          { id: 'wp_ln1', x: 575, y: 250 },
          { id: 'wp_ln2', x: 575, y: 350 },
          { id: 'wp_ln3', x: 180, y: 350 },
          { id: 'wp_ln4', x: 180, y: 265 },
          { id: 'wp_ln5', x: 145, y: 265 }
        ]
      }
    ]
  },

  LampTL: {
    label: "Contoh: Lampu TL Dikontrol Saklar Tunggal",
    components: [
      { id: 'preset_src_tl', type: 'Source_1P', x: 60, y: 200, rotation: 0, state: {} },
      { id: 'preset_mcb_tl', type: 'MCB_1P', x: 240, y: 200, rotation: 0, state: { on: true } },
      { id: 'preset_sw_tl', type: 'SwitchSingle', x: 420, y: 200, rotation: 0, state: { on: true } },
      { id: 'preset_lamp_tl', type: 'LampTL', x: 580, y: 190, rotation: 0, state: {} }
    ],
    wires: [
      {
        id: 'wire_src_mcb_tl',
        color: 'red',
        from: { type: 'pin', componentId: 'preset_src_tl', pinName: 'L', x: 125, y: 255 },
        to: { type: 'pin', componentId: 'preset_mcb_tl', pinName: 'in', x: 270, y: 210 },
        path: [
          { id: 'wp_tls1', x: 125, y: 255 },
          { id: 'wp_tls2', x: 190, y: 255 },
          { id: 'wp_tls3', x: 190, y: 210 },
          { id: 'wp_tls4', x: 270, y: 210 }
        ]
      },
      {
        id: 'wire_mcb_sw_tl',
        color: 'red',
        from: { type: 'pin', componentId: 'preset_mcb_tl', pinName: 'out', x: 270, y: 290 },
        to: { type: 'pin', componentId: 'preset_sw_tl', pinName: 'in', x: 450, y: 210 },
        path: [
          { id: 'wp_tlm1', x: 270, y: 290 },
          { id: 'wp_tlm2', x: 350, y: 290 },
          { id: 'wp_tlm3', x: 350, y: 210 },
          { id: 'wp_tlm4', x: 450, y: 210 }
        ]
      },
      {
        id: 'wire_sw_lamp_tl',
        color: 'red',
        from: { type: 'pin', componentId: 'preset_sw_tl', pinName: 'out', x: 450, y: 270 },
        to: { type: 'pin', componentId: 'preset_lamp_tl', pinName: 'L', x: 590, y: 215 },
        path: [
          { id: 'wp_tlw1', x: 450, y: 270 },
          { id: 'wp_tlw2', x: 520, y: 270 },
          { id: 'wp_tlw3', x: 520, y: 215 },
          { id: 'wp_tlw4', x: 590, y: 215 }
        ]
      },
      {
        id: 'wire_lamp_src_n_tl',
        color: 'blue',
        from: { type: 'pin', componentId: 'preset_lamp_tl', pinName: 'N', x: 690, y: 215 },
        to: { type: 'pin', componentId: 'preset_src_tl', pinName: 'N', x: 125, y: 285 },
        path: [
          { id: 'wp_tln1', x: 690, y: 215 },
          { id: 'wp_tln2', x: 720, y: 215 },
          { id: 'wp_tln3', x: 720, y: 350 },
          { id: 'wp_tln4', x: 160, y: 350 },
          { id: 'wp_tln5', x: 160, y: 285 },
          { id: 'wp_tln6', x: 125, y: 285 }
        ]
      }
    ]
  },
  JunctionBox: {
    label: "Contoh: Percabangan Kotak Sambung (T-Dos)",
    components: [
      { id: 'src_1p', type: 'Source_1P', x: 80, y: 180, rotation: 0, state: {} },
      { id: 'preset_mcb', type: 'MCB_1P', x: 230, y: 190, rotation: 0, state: { on: true } },
      { id: 'preset_jbox', type: 'JunctionBox', x: 380, y: 220, rotation: 0, state: {} },
      { id: 'preset_sw', type: 'SwitchSingle', x: 500, y: 210, rotation: 0, state: { on: false } },
      { id: 'preset_lamp', type: 'Lamp', x: 640, y: 210, rotation: 0, state: {} }
    ],
    wires: [
      {
        id: 'wire_src_mcb',
        color: 'red',
        from: { type: 'pin', componentId: 'src_1p', pinName: 'L', x: 145, y: 235 },
        to: { type: 'pin', componentId: 'preset_mcb', pinName: 'in', x: 260, y: 200 },
        path: [
          { id: 'wp_jb1', x: 145, y: 235 },
          { id: 'wp_jb2', x: 200, y: 235 },
          { id: 'wp_jb3', x: 200, y: 200 },
          { id: 'wp_jb4', x: 260, y: 200 }
        ]
      },
      {
        id: 'wire_mcb_jbox',
        color: 'red',
        from: { type: 'pin', componentId: 'preset_mcb', pinName: 'out', x: 260, y: 280 },
        to: { type: 'pin', componentId: 'preset_jbox', pinName: 'left', x: 388, y: 250 },
        path: [
          { id: 'wp_jb5', x: 260, y: 280 },
          { id: 'wp_jb6', x: 320, y: 280 },
          { id: 'wp_jb7', x: 320, y: 250 },
          { id: 'wp_jb8', x: 388, y: 250 }
        ]
      },
      {
        id: 'wire_jbox_sw',
        color: 'red',
        from: { type: 'pin', componentId: 'preset_jbox', pinName: 'right', x: 432, y: 250 },
        to: { type: 'pin', componentId: 'preset_sw', pinName: 'in', x: 530, y: 220 },
        path: [
          { id: 'wp_jb9', x: 432, y: 250 },
          { id: 'wp_jb10', x: 470, y: 250 },
          { id: 'wp_jb11', x: 470, y: 220 },
          { id: 'wp_jb12', x: 530, y: 220 }
        ]
      },
      {
        id: 'wire_sw_lamp',
        color: 'red',
        from: { type: 'pin', componentId: 'preset_sw', pinName: 'out', x: 530, y: 280 },
        to: { type: 'pin', componentId: 'preset_lamp', pinName: 'L', x: 665, y: 250 },
        path: [
          { id: 'wp_jb13', x: 530, y: 280 },
          { id: 'wp_jb14', x: 600, y: 280 },
          { id: 'wp_jb15', x: 600, y: 250 },
          { id: 'wp_jb16', x: 665, y: 250 }
        ]
      },
      {
        id: 'wire_lamp_src_n',
        color: 'blue',
        from: { type: 'pin', componentId: 'preset_lamp', pinName: 'N', x: 695, y: 250 },
        to: { type: 'pin', componentId: 'src_1p', pinName: 'N', x: 145, y: 265 },
        path: [
          { id: 'wp_jb17', x: 695, y: 250 },
          { id: 'wp_jb18', x: 695, y: 350 },
          { id: 'wp_jb19', x: 180, y: 350 },
          { id: 'wp_jb20', x: 180, y: 265 },
          { id: 'wp_jb21', x: 145, y: 265 }
        ]
      }
    ]
  },
  KabelNYM: {
    label: "Contoh: Sirkuit Kabel NYM (Fasa, Netral, Arde)",
    components: [
      { id: 'src_1p', type: 'Source_1P', x: 80, y: 180, rotation: 0, state: {} },
      { id: 'preset_mcb', type: 'MCB_1P', x: 240, y: 190, rotation: 0, state: { on: true } },
      { id: 'preset_sock', type: 'Socket', x: 440, y: 200, rotation: 0, state: {} }
    ],
    wires: [
      {
        id: 'wire_src_mcb',
        color: 'red',
        from: { type: 'pin', componentId: 'src_1p', pinName: 'L', x: 145, y: 235 },
        to: { type: 'pin', componentId: 'preset_mcb', pinName: 'in', x: 270, y: 200 },
        path: [
          { id: 'wp_nym1', x: 145, y: 235 },
          { id: 'wp_nym2', x: 210, y: 235 },
          { id: 'wp_nym3', x: 210, y: 200 },
          { id: 'wp_nym4', x: 270, y: 200 }
        ]
      },
      {
        id: 'wire_mcb_sock',
        color: 'red',
        from: { type: 'pin', componentId: 'preset_mcb', pinName: 'out', x: 270, y: 280 },
        to: { type: 'pin', componentId: 'preset_sock', pinName: 'L', x: 465, y: 240 },
        path: [
          { id: 'wp_nym5', x: 270, y: 280 },
          { id: 'wp_nym6', x: 360, y: 280 },
          { id: 'wp_nym7', x: 360, y: 240 },
          { id: 'wp_nym8', x: 465, y: 240 }
        ]
      },
      {
        id: 'wire_src_sock_n',
        color: 'blue',
        from: { type: 'pin', componentId: 'preset_sock', pinName: 'N', x: 495, y: 240 },
        to: { type: 'pin', componentId: 'src_1p', pinName: 'N', x: 145, y: 265 },
        path: [
          { id: 'wp_nym9', x: 495, y: 240 },
          { id: 'wp_nym10', x: 530, y: 240 },
          { id: 'wp_nym11', x: 530, y: 340 },
          { id: 'wp_nym12', x: 190, y: 340 },
          { id: 'wp_nym13', x: 190, y: 265 },
          { id: 'wp_nym14', x: 145, y: 265 }
        ]
      },
      {
        id: 'wire_src_sock_pe',
        color: 'green',
        from: { type: 'pin', componentId: 'preset_sock', pinName: 'PE', x: 480, y: 265 },
        to: { type: 'pin', componentId: 'src_1p', pinName: 'PE', x: 145, y: 295 },
        path: [
          { id: 'wp_nym15', x: 480, y: 265 },
          { id: 'wp_nym16', x: 480, y: 365 },
          { id: 'wp_nym17', x: 165, y: 365 },
          { id: 'wp_nym18', x: 165, y: 295 },
          { id: 'wp_nym19', x: 145, y: 295 }
        ]
      }
    ]
  },
  MCB_3P: {
    label: "Contoh: MCB 3-Fasa sebagai Pengaman",
    components: [
      { id: 'preset_src3p', type: 'Source_3P', x: 60, y: 220, rotation: 0, state: {} },
      { id: 'preset_mcb3p', type: 'MCB_3P', x: 260, y: 220, rotation: 0, state: { on: true } },
      { id: 'preset_lampR', type: 'Lamp', x: 500, y: 120, rotation: 0, state: {} },
      { id: 'preset_lampS', type: 'Lamp', x: 500, y: 220, rotation: 0, state: {} },
      { id: 'preset_lampT', type: 'Lamp', x: 500, y: 320, rotation: 0, state: {} }
    ],
    wires: [
      {
        id: 'wire_src_mcb_r',
        color: 'red',
        from: { type: 'pin', componentId: 'preset_src3p', pinName: 'R', x: 125, y: 275 },
        to: { type: 'pin', componentId: 'preset_mcb3p', pinName: 'in_R', x: 280, y: 230 },
        path: [
          { id: 'wp_m3r1', x: 125, y: 275 },
          { id: 'wp_m3r2', x: 190, y: 275 },
          { id: 'wp_m3r3', x: 190, y: 200 },
          { id: 'wp_m3r4', x: 280, y: 200 },
          { id: 'wp_m3r5', x: 280, y: 230 }
        ]
      },
      {
        id: 'wire_src_mcb_s',
        color: 'yellow',
        from: { type: 'pin', componentId: 'preset_src3p', pinName: 'S', x: 125, y: 305 },
        to: { type: 'pin', componentId: 'preset_mcb3p', pinName: 'in_S', x: 300, y: 230 },
        path: [
          { id: 'wp_m3s1', x: 125, y: 305 },
          { id: 'wp_m3s2', x: 210, y: 305 },
          { id: 'wp_m3s3', x: 210, y: 190 },
          { id: 'wp_m3s4', x: 300, y: 190 },
          { id: 'wp_m3s5', x: 300, y: 230 }
        ]
      },
      {
        id: 'wire_src_mcb_t',
        color: 'black',
        from: { type: 'pin', componentId: 'preset_src3p', pinName: 'T', x: 125, y: 335 },
        to: { type: 'pin', componentId: 'preset_mcb3p', pinName: 'in_T', x: 320, y: 230 },
        path: [
          { id: 'wp_m3t1', x: 125, y: 335 },
          { id: 'wp_m3t2', x: 230, y: 335 },
          { id: 'wp_m3t3', x: 230, y: 180 },
          { id: 'wp_m3t4', x: 320, y: 180 },
          { id: 'wp_m3t5', x: 320, y: 230 }
        ]
      },
      {
        id: 'wire_mcb_lamp_r',
        color: 'red',
        from: { type: 'pin', componentId: 'preset_mcb3p', pinName: 'out_R', x: 280, y: 310 },
        to: { type: 'pin', componentId: 'preset_lampR', pinName: 'L', x: 525, y: 160 },
        path: [
          { id: 'wp_m3lr1', x: 280, y: 310 },
          { id: 'wp_m3lr2', x: 280, y: 350 },
          { id: 'wp_m3lr3', x: 390, y: 350 },
          { id: 'wp_m3lr4', x: 390, y: 160 },
          { id: 'wp_m3lr5', x: 525, y: 160 }
        ]
      },
      {
        id: 'wire_mcb_lamp_s',
        color: 'yellow',
        from: { type: 'pin', componentId: 'preset_mcb3p', pinName: 'out_S', x: 300, y: 310 },
        to: { type: 'pin', componentId: 'preset_lampS', pinName: 'L', x: 525, y: 260 },
        path: [
          { id: 'wp_m3ls1', x: 300, y: 310 },
          { id: 'wp_m3ls2', x: 300, y: 340 },
          { id: 'wp_m3ls3', x: 410, y: 340 },
          { id: 'wp_m3ls4', x: 410, y: 260 },
          { id: 'wp_m3ls5', x: 525, y: 260 }
        ]
      },
      {
        id: 'wire_mcb_lamp_t',
        color: 'black',
        from: { type: 'pin', componentId: 'preset_mcb3p', pinName: 'out_T', x: 320, y: 310 },
        to: { type: 'pin', componentId: 'preset_lampT', pinName: 'L', x: 525, y: 360 },
        path: [
          { id: 'wp_m3lt1', x: 320, y: 310 },
          { id: 'wp_m3lt2', x: 320, y: 330 },
          { id: 'wp_m3lt3', x: 430, y: 330 },
          { id: 'wp_m3lt4', x: 430, y: 360 },
          { id: 'wp_m3lt5', x: 525, y: 360 }
        ]
      },
      {
        id: 'wire_lamp_r_n',
        color: 'blue',
        from: { type: 'pin', componentId: 'preset_lampR', pinName: 'N', x: 555, y: 160 },
        to: { type: 'pin', componentId: 'preset_src3p', pinName: 'N', x: 125, y: 365 },
        path: [
          { id: 'wp_m3nr1', x: 555, y: 160 },
          { id: 'wp_m3nr2', x: 620, y: 160 },
          { id: 'wp_m3nr3', x: 620, y: 440 },
          { id: 'wp_m3nr4', x: 160, y: 440 },
          { id: 'wp_m3nr5', x: 160, y: 365 },
          { id: 'wp_m3nr6', x: 125, y: 365 }
        ]
      },
      {
        id: 'wire_lamp_s_n',
        color: 'blue',
        from: { type: 'pin', componentId: 'preset_lampS', pinName: 'N', x: 555, y: 260 },
        to: { type: 'pin', componentId: 'preset_lampR', pinName: 'N', x: 555, y: 160 },
        path: [
          { id: 'wp_m3ns1', x: 555, y: 260 },
          { id: 'wp_m3ns2', x: 580, y: 260 },
          { id: 'wp_m3ns3', x: 580, y: 160 },
          { id: 'wp_m3ns4', x: 555, y: 160 }
        ]
      },
      {
        id: 'wire_lamp_t_n',
        color: 'blue',
        from: { type: 'pin', componentId: 'preset_lampT', pinName: 'N', x: 555, y: 360 },
        to: { type: 'pin', componentId: 'preset_lampS', pinName: 'N', x: 555, y: 260 },
        path: [
          { id: 'wp_m3nt1', x: 555, y: 360 },
          { id: 'wp_m3nt2', x: 580, y: 360 },
          { id: 'wp_m3nt3', x: 580, y: 260 },
          { id: 'wp_m3nt4', x: 555, y: 260 }
        ]
      }
    ]
  },
  PanelPHB: {
    label: "Contoh: PHB Membagi 3 Grup Sirkit",
    components: [
      { id: 'preset_src3p_b', type: 'Source_3P', x: 60, y: 260, rotation: 0, state: {} },
      { id: 'preset_phb', type: 'PanelPHB', x: 280, y: 200, rotation: 0, state: { mainOn: true, group1On: true, group2On: true, group3On: true } },
      { id: 'preset_lamp_g1', type: 'Lamp', x: 600, y: 100, rotation: 0, state: {} },
      { id: 'preset_lamp_g2', type: 'Lamp', x: 600, y: 220, rotation: 0, state: {} },
      { id: 'preset_lamp_g3', type: 'Lamp', x: 600, y: 340, rotation: 0, state: {} }
    ],
    wires: [
      {
        id: 'wire_phb_r',
        color: 'red',
        from: { type: 'pin', componentId: 'preset_src3p_b', pinName: 'R', x: 125, y: 315 },
        to: { type: 'pin', componentId: 'preset_phb', pinName: 'in_R', x: 300, y: 205 },
        path: [
          { id: 'wp_phbr1', x: 125, y: 315 },
          { id: 'wp_phbr2', x: 200, y: 315 },
          { id: 'wp_phbr3', x: 200, y: 170 },
          { id: 'wp_phbr4', x: 300, y: 170 },
          { id: 'wp_phbr5', x: 300, y: 205 }
        ]
      },
      {
        id: 'wire_phb_s',
        color: 'yellow',
        from: { type: 'pin', componentId: 'preset_src3p_b', pinName: 'S', x: 125, y: 345 },
        to: { type: 'pin', componentId: 'preset_phb', pinName: 'in_S', x: 325, y: 205 },
        path: [
          { id: 'wp_phbs1', x: 125, y: 345 },
          { id: 'wp_phbs2', x: 215, y: 345 },
          { id: 'wp_phbs3', x: 215, y: 160 },
          { id: 'wp_phbs4', x: 325, y: 160 },
          { id: 'wp_phbs5', x: 325, y: 205 }
        ]
      },
      {
        id: 'wire_phb_t',
        color: 'black',
        from: { type: 'pin', componentId: 'preset_src3p_b', pinName: 'T', x: 125, y: 375 },
        to: { type: 'pin', componentId: 'preset_phb', pinName: 'in_T', x: 350, y: 205 },
        path: [
          { id: 'wp_phbt1', x: 125, y: 375 },
          { id: 'wp_phbt2', x: 230, y: 375 },
          { id: 'wp_phbt3', x: 230, y: 150 },
          { id: 'wp_phbt4', x: 350, y: 150 },
          { id: 'wp_phbt5', x: 350, y: 205 }
        ]
      },
      {
        id: 'wire_phb_n',
        color: 'blue',
        from: { type: 'pin', componentId: 'preset_src3p_b', pinName: 'N', x: 125, y: 405 },
        to: { type: 'pin', componentId: 'preset_phb', pinName: 'in_N', x: 375, y: 205 },
        path: [
          { id: 'wp_phbn1', x: 125, y: 405 },
          { id: 'wp_phbn2', x: 245, y: 405 },
          { id: 'wp_phbn3', x: 245, y: 140 },
          { id: 'wp_phbn4', x: 375, y: 140 },
          { id: 'wp_phbn5', x: 375, y: 205 }
        ]
      },
      {
        id: 'wire_phb_pe',
        color: 'green',
        from: { type: 'pin', componentId: 'preset_src3p_b', pinName: 'PE', x: 125, y: 435 },
        to: { type: 'pin', componentId: 'preset_phb', pinName: 'in_PE', x: 400, y: 205 },
        path: [
          { id: 'wp_phbpe1', x: 125, y: 435 },
          { id: 'wp_phbpe2', x: 260, y: 435 },
          { id: 'wp_phbpe3', x: 260, y: 130 },
          { id: 'wp_phbpe4', x: 400, y: 130 },
          { id: 'wp_phbpe5', x: 400, y: 205 }
        ]
      },
      {
        id: 'wire_phb_g1',
        color: 'red',
        from: { type: 'pin', componentId: 'preset_phb', pinName: 'out1_L', x: 305, y: 355 },
        to: { type: 'pin', componentId: 'preset_lamp_g1', pinName: 'L', x: 625, y: 140 },
        path: [
          { id: 'wp_phbg1_1', x: 305, y: 355 },
          { id: 'wp_phbg1_2', x: 305, y: 400 },
          { id: 'wp_phbg1_3', x: 480, y: 400 },
          { id: 'wp_phbg1_4', x: 480, y: 140 },
          { id: 'wp_phbg1_5', x: 625, y: 140 }
        ]
      },
      {
        id: 'wire_phb_g2',
        color: 'yellow',
        from: { type: 'pin', componentId: 'preset_phb', pinName: 'out2_L', x: 350, y: 355 },
        to: { type: 'pin', componentId: 'preset_lamp_g2', pinName: 'L', x: 625, y: 260 },
        path: [
          { id: 'wp_phbg2_1', x: 350, y: 355 },
          { id: 'wp_phbg2_2', x: 350, y: 390 },
          { id: 'wp_phbg2_3', x: 500, y: 390 },
          { id: 'wp_phbg2_4', x: 500, y: 260 },
          { id: 'wp_phbg2_5', x: 625, y: 260 }
        ]
      },
      {
        id: 'wire_phb_g3',
        color: 'black',
        from: { type: 'pin', componentId: 'preset_phb', pinName: 'out3_L', x: 395, y: 355 },
        to: { type: 'pin', componentId: 'preset_lamp_g3', pinName: 'L', x: 625, y: 380 },
        path: [
          { id: 'wp_phbg3_1', x: 395, y: 355 },
          { id: 'wp_phbg3_2', x: 395, y: 380 },
          { id: 'wp_phbg3_3', x: 625, y: 380 }
        ]
      },
      {
        id: 'wire_phb_lamp_n1',
        color: 'blue',
        from: { type: 'pin', componentId: 'preset_phb', pinName: 'out_N', x: 420, y: 300 },
        to: { type: 'pin', componentId: 'preset_lamp_g1', pinName: 'N', x: 655, y: 140 },
        path: [
          { id: 'wp_phbon1', x: 420, y: 300 },
          { id: 'wp_phbon2', x: 540, y: 300 },
          { id: 'wp_phbon3', x: 540, y: 110 },
          { id: 'wp_phbon4', x: 655, y: 110 },
          { id: 'wp_phbon5', x: 655, y: 140 }
        ]
      },
      {
        id: 'wire_phb_lamp_n2',
        color: 'blue',
        from: { type: 'pin', componentId: 'preset_lamp_g2', pinName: 'N', x: 655, y: 260 },
        to: { type: 'pin', componentId: 'preset_lamp_g1', pinName: 'N', x: 655, y: 140 },
        path: [
          { id: 'wp_phbon6', x: 655, y: 260 },
          { id: 'wp_phbon7', x: 680, y: 260 },
          { id: 'wp_phbon8', x: 680, y: 140 },
          { id: 'wp_phbon9', x: 655, y: 140 }
        ]
      },
      {
        id: 'wire_phb_lamp_n3',
        color: 'blue',
        from: { type: 'pin', componentId: 'preset_lamp_g3', pinName: 'N', x: 655, y: 380 },
        to: { type: 'pin', componentId: 'preset_lamp_g2', pinName: 'N', x: 655, y: 260 },
        path: [
          { id: 'wp_phbon10', x: 655, y: 380 },
          { id: 'wp_phbon11', x: 680, y: 380 },
          { id: 'wp_phbon12', x: 680, y: 260 },
          { id: 'wp_phbon13', x: 655, y: 260 }
        ]
      }
    ]
  }
};
