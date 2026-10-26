// Trouble Shoot Functional Validator - Virtual Lab IPL
// Memverifikasi apakah gangguan kelistrikan pada skenario telah berhasil diperbaiki

import { evaluateCircuit, detectAllErrors } from './circuitEvaluator.js';

export function validateTroubleshoot(scenarioId, canvasState) {
  const { components, wires } = canvasState;

  if (!components || components.length === 0) {
    return { success: false, message: "Kanvas kosong! Silakan periksa rangkaian." };
  }

  // 1. Proactive error checking - tidak boleh ada fatal error / korsleting / kabel menggantung
  const blockingErrors = detectAllErrors(canvasState);
  if (blockingErrors && blockingErrors.length > 0) {
    return {
      success: false,
      message: "Masih ada kesalahan pada rangkaian (seperti hubungan singkat/korsleting, kabel terbuka, atau sambungan yang belum tepat). Periksa kembali jalur instalasi Anda!"
    };
  }

  // Backup component states to restore after testing
  const stateBackup = components.map(c => ({ id: c.id, state: JSON.stringify(c.state || {}) }));
  function restoreBackup() {
    components.forEach(comp => {
      const backup = stateBackup.find(b => b.id === comp.id);
      if (backup) {
        comp.state = JSON.parse(backup.state);
      }
    });
  }

  // Helper to ensure all MCBs are closed during functional testing
  function turnOnMCBs() {
    components.forEach(c => {
      if (c.type === 'MCB_1P' || c.type === 'MCB_3P') {
        c.state = c.state || {};
        c.state.on = true;
        c.state.tripped = false;
      }
    });
  }

  try {
    switch (scenarioId) {
      case 'ts_01': {
        // Goal: Lampu Kamar Tidak Menyala (Kabel lepas dari Saklar Tunggal ke Lampu)
        const lamps = components.filter(c => c.type === 'Lamp');
        const switches = components.filter(c => c.type === 'SwitchSingle');

        if (lamps.length < 1) return { success: false, message: "Lampu tidak ditemukan di kanvas." };
        if (switches.length < 1) return { success: false, message: "Saklar Tunggal tidak ditemukan di kanvas." };

        turnOnMCBs();

        // Test 1: Switch OFF
        switches[0].state = { on: false };
        let res0 = evaluateCircuit({ components, wires });
        if (res0.shortCircuit) return { success: false, message: "Korsleting terdeteksi pada rangkaian!" };
        const lampOff = !res0.components.find(c => c.id === lamps[0].id).state.on;

        // Test 2: Switch ON
        switches[0].state = { on: true };
        let res1 = evaluateCircuit({ components, wires });
        if (res1.shortCircuit) return { success: false, message: "Korsleting terdeteksi saat saklar dinyalakan!" };
        const lampOn = !!res1.components.find(c => c.id === lamps[0].id).state.on;

        restoreBackup();

        if (lampOn && lampOff) {
          return {
            success: true,
            message: "LULUS! Sambungan kabel ke pin L Lampu telah berhasil diperbaiki. Lampu kamar kini menyala normal saat saklar dinyalakan!"
          };
        } else if (!lampOn) {
          return {
            success: false,
            message: "Lampu belum menyala saat saklar di-ON-kan. Pastikan kabel dari output saklar benar-benar terhubung ke pin L Lampu."
          };
        } else {
          return {
            success: false,
            message: "Lampu terus menyala tanpa melewati saklar."
          };
        }
      }

      case 'ts_02': {
        // Goal: Saklar Tangga Tidak Konsisten
        // Fault: Kabel Lampu tersambung ke L1 Saklar B, bukan ke com Saklar B.
        // Akibatnya lampu hanya dikendalikan Saklar A, Saklar B tidak berpengaruh sama sekali.
        // Fix valid: kabel ke com Saklar B → perilaku standar saklar hotel (3-way):
        //   SW_A=ON, SW_B=ON   → Lampu NYALA (com_A→L1_A→L1_B→com_B→Lamp)
        //   SW_A=OFF, SW_B=OFF → Lampu NYALA (com_A→L2_A→L2_B→com_B→Lamp)
        //   SW_A=ON, SW_B=OFF  → Lampu MATI
        //   SW_A=OFF, SW_B=ON  → Lampu MATI
        const lamps = components.filter(c => c.type === 'Lamp');
        const switches = components.filter(c => c.type === 'SwitchWay3');

        if (lamps.length < 1) return { success: false, message: "Lampu tangga tidak ditemukan di kanvas." };
        if (switches.length < 2) return { success: false, message: "Dibutuhkan minimal 2 Saklar Tukar." };

        turnOnMCBs();

        // Test standard 4 combinations:
        // Standard hotel switch (travelers L1-L1, L2-L2, lamp on com_B):
        // SW_A=ON  (com→L1), SW_B=ON  (com→L1) → com_A→L1_A→L1_B→com_B→Lamp → NYALA
        // SW_A=OFF (com→L2), SW_B=OFF (com→L2) → com_A→L2_A→L2_B→com_B→Lamp → NYALA
        // SW_A=ON  (com→L1), SW_B=OFF (com→L2) → L1_B not on com_B path → MATI
        // SW_A=OFF (com→L2), SW_B=ON  (com→L1) → L2_B not on com_B path → MATI

        // 1. Both ON (com→L1)
        switches[0].state = { on: true };
        switches[1].state = { on: true };
        let r11 = evaluateCircuit({ components, wires });
        const s11 = !!r11.components.find(c => c.id === lamps[0].id).state.on;

        // 2. Both OFF (com→L2)
        switches[0].state = { on: false };
        switches[1].state = { on: false };
        let r00 = evaluateCircuit({ components, wires });
        const s00 = !!r00.components.find(c => c.id === lamps[0].id).state.on;

        // 3. SW_A ON, SW_B OFF
        switches[0].state = { on: true };
        switches[1].state = { on: false };
        let r10 = evaluateCircuit({ components, wires });
        const s10 = !!r10.components.find(c => c.id === lamps[0].id).state.on;

        // 4. SW_A OFF, SW_B ON
        switches[0].state = { on: false };
        switches[1].state = { on: true };
        let r01 = evaluateCircuit({ components, wires });
        const s01 = !!r01.components.find(c => c.id === lamps[0].id).state.on;

        restoreBackup();

        if (s11 && s00 && !s10 && !s01) {
          return {
            success: true,
            message: "LULUS! Kabel menuju Lampu telah terpasang dengan benar pada terminal 'com' Saklar B. Kini kedua saklar tangga bekerja konsisten — masing-masing dapat menyalakan dan mematikan lampu secara independen dari kedua lantai!"
          };
        } else if (s11 && s10 && !s00 && !s01) {
          return {
            success: false,
            message: "Lampu masih hanya mengikuti posisi Saklar A dan tidak terpengaruh oleh Saklar B. Kemungkinan kabel menuju Lampu masih tersambung ke terminal L1 Saklar B, bukan ke terminal 'com'-nya."
          };
        } else if (!s11 && !s10 && s00 && s01) {
          return {
            success: false,
            message: "Lampu hanya menyala saat Saklar A OFF. Periksa kembali sambungan kabel -- kemungkinan terbalik atau tersambung ke L2 Saklar B."
          };
        } else {
          return {
            success: false,
            message: "Pola penyalaan saklar tangga belum sesuai standar. Pastikan kabel menuju Lampu terhubung ke terminal 'com' Saklar B, bukan L1 atau L2."
          };
        }
      }

      case 'ts_03': {
        // Goal: MCB Selalu Trip (Kabel korsleting jumper pada Lampu 2)
        const lamps = components.filter(c => c.type === 'Lamp');
        const switches = components.filter(c => c.type === 'SwitchSingle');

        if (lamps.length < 2) return { success: false, message: "Dibutuhkan minimal 2 Lampu di kanvas." };
        if (switches.length < 1) return { success: false, message: "Saklar Tunggal tidak ditemukan." };

        turnOnMCBs();

        // Test 1: Switch ON
        switches[0].state = { on: true };
        let r1 = evaluateCircuit({ components, wires });
        if (r1.shortCircuit) {
          return {
            success: false,
            message: "MCB masih trip! Jalur korsleting (hubung singkat) masih ada pada rangkaian."
          };
        }

        const l1_on = !!r1.components.find(c => c.id === lamps[0].id).state.on;
        const l2_on = !!r1.components.find(c => c.id === lamps[1].id).state.on;

        // Test 2: Switch OFF
        switches[0].state = { on: false };
        let r0 = evaluateCircuit({ components, wires });
        const l1_off = !r0.components.find(c => c.id === lamps[0].id).state.on;
        const l2_off = !r0.components.find(c => c.id === lamps[1].id).state.on;

        restoreBackup();

        if (l1_on && l2_on && l1_off && l2_off) {
          return {
            success: true,
            message: "LULUS! Kabel jumper penyebab korsleting telah dihilangkan. Kedua lampu ruang tamu kini menyala paralel dengan aman tanpa memicu trip pada MCB!"
          };
        } else if (!l2_on) {
          return {
            success: false,
            message: "Korsleting teratasi namun Lampu 2 belum menyala. Pastikan jalur Fasa dan Netral ke Lampu 2 tetap tersambung normal."
          };
        } else {
          return {
            success: false,
            message: "Kedua lampu belum dapat dikontrol saklar secara normal."
          };
        }
      }

      case 'ts_04': {
        // Goal: Lampu Teras Masih Menyetrum Saat Saklar Dimatikan (Jobsheet 1)
        // Fault: Saklar dipasang pada kabel Netral, pin L Lampu langsung ke Fasa.
        const lamps = components.filter(c => c.type === 'Lamp');
        const switches = components.filter(c => c.type === 'SwitchSingle');

        if (lamps.length < 1) return { success: false, message: "Lampu tidak ditemukan di kanvas." };
        if (switches.length < 1) return { success: false, message: "Saklar Tunggal tidak ditemukan di kanvas." };

        turnOnMCBs();

        // Test 1: Switch ON -> Lampu harus menyala
        switches[0].state = { on: true };
        let r1 = evaluateCircuit({ components, wires });
        if (r1.shortCircuit) {
          restoreBackup();
          return { success: false, message: "Korsleting terdeteksi saat saklar dinyalakan!" };
        }
        const lampOn = !!r1.components.find(c => c.id === lamps[0].id)?.state?.on;

        // Test 2: Switch OFF -> Lampu harus mati DAN fitting (pin L dan N) TIDAK boleh bertegangan fasa
        switches[0].state = { on: false };
        let r0 = evaluateCircuit({ components, wires });
        const lampOff = !r0.components.find(c => c.id === lamps[0].id)?.state?.on;

        const rootL = r0.pinToRoot[`${lamps[0].id}_L`];
        const rootN = r0.pinToRoot[`${lamps[0].id}_N`];
        const potL = rootL !== undefined ? r0.potentials[rootL] : null;
        const potN = rootN !== undefined ? r0.potentials[rootN] : null;
        const hasPhaseL = !!(potL && (potL.R || potL.S || potL.T));
        const hasPhaseN = !!(potN && (potN.R || potN.S || potN.T));

        restoreBackup();

        if (!lampOn) {
          return {
            success: false,
            message: "Lampu belum menyala saat saklar dinyalakan. Pastikan kabel dari Sumber dan Saklar tersambung lengkap ke Lampu."
          };
        }

        if (!lampOff) {
          return {
            success: false,
            message: "Lampu terus menyala tanpa melewati saklar."
          };
        }

        if (hasPhaseL || hasPhaseN) {
          return {
            success: false,
            message: "Saklar harus memutus kabel Fasa, bukan Netral. Saat saklar OFF, fitting lampu tidak boleh berpotensial fasa!"
          };
        }

        return {
          success: true,
          message: "LULUS! Saklar kini berada di jalur Fasa. Saat saklar dimatikan, tidak ada tegangan fasa yang tersisa pada fitting lampu sehingga aman saat mengganti bohlam!"
        };
      }

      case 'ts_05': {
        // Goal: Mesin Cuci Terasa Menyengat (Stop Kontak Tanpa Arde - Jobsheet 4)
        // Fault: Terminal PE stop kontak tidak tersambung ke PE Sumber.
        const sockets = components.filter(c => c.type === 'Socket');
        const sources = components.filter(c => c.type === 'Source_1P' || c.type === 'Source_3P');

        if (sockets.length < 1) return { success: false, message: "Stop Kontak tidak ditemukan di kanvas." };
        if (sources.length < 1) return { success: false, message: "Sumber listrik tidak ditemukan di kanvas." };

        turnOnMCBs();

        let res = evaluateCircuit({ components, wires });
        restoreBackup();

        if (res.shortCircuit) {
          return { success: false, message: "Korsleting terdeteksi pada rangkaian!" };
        }

        const socketOn = !!res.components.find(c => c.id === sockets[0].id)?.state?.on;
        if (!socketOn) {
          return {
            success: false,
            message: "Stop kontak belum aktif. Pastikan kabel Fasa (L) dan Netral (N) terhubung dengan benar dari Sumber/MCB."
          };
        }

        const hasGroundWarning = (res.alerts || []).some(a => a.id.startsWith('grounding_'));
        const rootSrcPE = res.pinToRoot[`${sources[0].id}_PE`];
        const rootSockPE = res.pinToRoot[`${sockets[0].id}_PE`];
        const peConnected = rootSrcPE !== undefined && rootSockPE !== undefined && rootSockPE === rootSrcPE;

        if (hasGroundWarning || !peConnected) {
          return {
            success: false,
            message: "Stop kontak belum memiliki pengaman arde (PE) yang tersambung ke Sumber."
          };
        }

        return {
          success: true,
          message: "LULUS! Kabel arde (PE) telah terpasang dengan benar ke terminal arde Stop Kontak. Arus bocor kini dialirkan aman ke tanah sehingga bodi mesin cuci tidak lagi menyengat!"
        };
      }

      case 'ts_06': {
        // Goal: Saklar Kedua Tidak Berfungsi (Saklar Seri - Jobsheet 3)
        // Fault: Kedua lampu terhubung ke out1 Saklar Seri, out2 kosong.
        const lamps = components.filter(c => c.type === 'Lamp');
        const switches = components.filter(c => c.type === 'SwitchDouble');

        if (lamps.length < 2) return { success: false, message: "Dibutuhkan minimal 2 Lampu di kanvas." };
        if (switches.length < 1) return { success: false, message: "Saklar Seri (SwitchDouble) tidak ditemukan di kanvas." };

        turnOnMCBs();

        const sw = switches[0];
        const lampA = lamps[0];
        const lampB = lamps[1];

        // 1. (on1: true, on2: false)
        sw.state = { on1: true, on2: false };
        let r10 = evaluateCircuit({ components, wires });
        const a10 = !!r10.components.find(c => c.id === lampA.id)?.state?.on;
        const b10 = !!r10.components.find(c => c.id === lampB.id)?.state?.on;

        // 2. (on1: false, on2: true)
        sw.state = { on1: false, on2: true };
        let r01 = evaluateCircuit({ components, wires });
        const a01 = !!r01.components.find(c => c.id === lampA.id)?.state?.on;
        const b01 = !!r01.components.find(c => c.id === lampB.id)?.state?.on;

        // 3. (on1: true, on2: true)
        sw.state = { on1: true, on2: true };
        let r11 = evaluateCircuit({ components, wires });
        const a11 = !!r11.components.find(c => c.id === lampA.id)?.state?.on;
        const b11 = !!r11.components.find(c => c.id === lampB.id)?.state?.on;

        // 4. (on1: false, on2: false)
        sw.state = { on1: false, on2: false };
        let r00 = evaluateCircuit({ components, wires });
        const a00 = !!r00.components.find(c => c.id === lampA.id)?.state?.on;
        const b00 = !!r00.components.find(c => c.id === lampB.id)?.state?.on;

        restoreBackup();

        if (r10.shortCircuit || r01.shortCircuit || r11.shortCircuit) {
          return { success: false, message: "Korsleting terdeteksi saat saklar dinyalakan!" };
        }

        // Jika kedua lampu menyala bersamaan di tuas yang sama:
        if ((a10 && b10 && !a01 && !b01) || (!a10 && !b10 && a01 && b01)) {
          return {
            success: false,
            message: "Kedua lampu masih mengikuti tuas saklar yang sama. Pindahkan salah satu kabel fasa lampu ke terminal keluaran saklar yang lain (out2)."
          };
        }

        // Independen: Satu lampu mengikuti tuas 1 dan lampu lainnya mengikuti tuas 2
        const pattern1 = (a10 && !b10 && !a01 && b01 && a11 && b11 && !a00 && !b00);
        const pattern2 = (!a10 && b10 && a01 && !b01 && a11 && b11 && !a00 && !b00);

        if (pattern1 || pattern2) {
          return {
            success: true,
            message: "LULUS! Lampu A dan Lampu B kini terhubung masing-masing ke terminal out1 dan out2. Kedua lampu dapat dinyalakan dan dimatikan secara independen!"
          };
        } else {
          return {
            success: false,
            message: "Pola penyalaan Saklar Seri belum benar. Pastikan kedua lampu menyala saat kedua tuas ON, padam saat kedua tuas OFF, dan masing-masing tuas mengendalikan satu lampu secara terpisah."
          };
        }
      }

      case 'ts_07': {
        // Goal: Lampu Lorong Tiga Titik Tidak Konsisten (Saklar Silang - Jobsheet 6)
        // Fault: Kabel traveler dari out2 Saklar Silang ke L2 Saklar Tukar B tidak ada.
        const lamps = components.filter(c => c.type === 'Lamp');
        const way3Switches = components.filter(c => c.type === 'SwitchWay3');
        const crossSwitches = components.filter(c => c.type === 'SwitchCross');

        if (lamps.length < 1) return { success: false, message: "Lampu lorong tidak ditemukan di kanvas." };
        if (way3Switches.length < 2) return { success: false, message: "Dibutuhkan minimal 2 Saklar Tukar di kanvas." };
        if (crossSwitches.length < 1) return { success: false, message: "Saklar Silang (SwitchCross) tidak ditemukan di kanvas." };

        turnOnMCBs();

        const swA = way3Switches[0];
        const swCross = crossSwitches[0];
        const swB = way3Switches[1];
        const lamp = lamps[0];

        // Uji seluruh 8 kombinasi (swA, swCross, swB)
        const lampStates = [];
        let hasShort = false;

        for (let i = 0; i < 8; i++) {
          swA.state = { on: Boolean(i & 1) };
          swCross.state = { on: Boolean(i & 2) };
          swB.state = { on: Boolean(i & 4) };

          let res = evaluateCircuit({ components, wires });
          if (res.shortCircuit) hasShort = true;
          lampStates.push(!!res.components.find(c => c.id === lamp.id)?.state?.on);
        }

        restoreBackup();

        if (hasShort) {
          return { success: false, message: "Korsleting terdeteksi pada salah satu kombinasi saklar!" };
        }

        // Sifat rangkaian multi-way (3 titik):
        // Membalik status salah satu saklar (1 bit) HARUS SELALU membalik status nyala lampu!
        let consistentInversion = true;
        for (let i = 0; i < 8; i++) {
          if (lampStates[i] === lampStates[i ^ 1]) consistentInversion = false;
          if (lampStates[i] === lampStates[i ^ 2]) consistentInversion = false;
          if (lampStates[i] === lampStates[i ^ 4]) consistentInversion = false;
        }

        const onCount = lampStates.filter(s => s).length;
        const offCount = lampStates.filter(s => !s).length;

        if (consistentInversion && onCount === 4 && offCount === 4) {
          return {
            success: true,
            message: "LULUS! Seluruh jalur traveler Saklar Silang telah terhubung sempurna. Lampu lorong kini dapat dinyalakan dan dimatikan secara konsisten dari ketiga titik saklar!"
          };
        } else {
          return {
            success: false,
            message: "Pola penyalaan belum konsisten: ada posisi saklar yang tidak mengubah status lampu. Pastikan kedua terminal output Saklar Silang tersambung ke terminal L1 dan L2 Saklar Tukar kedua."
          };
        }
      }

      case 'ts_08': {
        // Goal: Kabel Netral Panas, Beban Tidak Seimbang (3 Fasa - Jobsheet 8)
        // Fault: Distribusi beban fasa R: 4 lampu, S: 2 lampu, T: 0 lampu.
        const lamps = components.filter(c => c.type === 'Lamp');
        const sources = components.filter(c => c.type === 'Source_3P');

        if (sources.length < 1) return { success: false, message: "Sumber 3-Fasa tidak ditemukan di kanvas." };
        if (lamps.length < 6) return { success: false, message: "Dibutuhkan 6 Lampu di kanvas." };

        turnOnMCBs();

        let res = evaluateCircuit({ components, wires });
        restoreBackup();

        if (res.shortCircuit) {
          return { success: false, message: "Korsleting terdeteksi pada rangkaian!" };
        }

        // 1. Pastikan seluruh 6 lampu menyala
        const onLamps = lamps.filter(l => res.components.find(c => c.id === l.id)?.state?.on);
        if (onLamps.length < 6) {
          return {
            success: false,
            message: `Baru ${onLamps.length} dari 6 lampu yang menyala. Pastikan semua lampu tersambung ke Fasa dan Netral.`
          };
        }

        // 2. Hitung jumlah lampu pada setiap fasa (R, S, T)
        let countR = 0, countS = 0, countT = 0;
        lamps.forEach(lamp => {
          const rootL = res.pinToRoot[`${lamp.id}_L`];
          const pot = rootL !== undefined ? res.potentials[rootL] : null;
          if (pot) {
            if (pot.R) countR++;
            else if (pot.S) countS++;
            else if (pot.T) countT++;
          }
        });

        const loads = [countR, countS, countT];
        const maxLoad = Math.max(...loads);
        const minLoad = Math.min(...loads);
        const diff = maxLoad - minLoad;

        const hasBalancingWarning = (res.alerts || []).some(a => a.id === 'balancing_warning');

        if (hasBalancingWarning || diff > 1) {
          return {
            success: false,
            message: `Beban 3-fasa belum seimbang (R: ${countR}, S: ${countS}, T: ${countT}). Seimbangkan pembagian beban antar fasa agar selisih beban maksimal 1 lampu.`
          };
        }

        return {
          success: true,
          message: `LULUS! Beban penerangan kini terbagi seimbang merata pada ketiga fasa (R: ${countR}, S: ${countS}, T: ${countT} lampu). Arus netral aman dan transformator bekerja optimal!`
        };
      }

      default:
        return { success: false, message: "Skenario tidak dikenal." };
    }
  } catch (err) {
    console.error("Troubleshoot validation error:", err);
    return { success: false, message: "Terjadi kesalahan saat memvalidasi rangkaian." };
  }
}
