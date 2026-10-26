// Jobsheet Functional Validator - Virtual Lab IPL
// Simulates hardware-in-the-loop (HIL) checks by testing various switch configurations

import { evaluateCircuit } from './circuitEvaluator.js';

export function validateJobsheet(jobsheetId, canvasState) {
  const { components, wires } = canvasState;
  
  if (components.length === 0) {
    return { success: false, message: "Kanvas kosong! Silakan tempatkan komponen dan sambungkan kabel." };
  }

  // Backup component states to restore them after testing
  const stateBackup = components.map(c => ({ id: c.id, state: JSON.stringify(c.state || {}) }));

  function restoreBackup() {
    components.forEach(comp => {
      const backup = stateBackup.find(b => b.id === comp.id);
      if (backup) {
        comp.state = JSON.parse(backup.state);
      }
    });
  }

  // Helper to force turn on all MCBs so we can test switches
  function turnOnMCBs() {
    let mcbFound = false;
    components.forEach(c => {
      if (c.type === 'MCB_1P' || c.type === 'MCB_3P') {
        c.state = c.state || {};
        c.state.on = true;
        c.state.tripped = false;
        mcbFound = true;
      }
    });
    return mcbFound;
  }

  try {
    switch (jobsheetId) {
      case 'js1': {
        // Goal: 1 MCB, 1 Switch, 1 Lamp. Switch controls Lamp.
        const lamps = components.filter(c => c.type === 'Lamp');
        const switches = components.filter(c => c.type === 'SwitchSingle');
        
        if (lamps.length < 1) return { success: false, message: "Belum ada Lampu di kanvas." };
        if (switches.length < 1) return { success: false, message: "Belum ada Saklar Tunggal." };
        
        turnOnMCBs();
        
        // Test State 1: Switch OFF
        switches[0].state = { on: false };
        let res = evaluateCircuit({ components, wires });
        if (res.shortCircuit) return { success: false, message: "Terjadi hubung singkat (korsleting) saat sirkuit dirakit!" };
        const lampOffCorrect = !res.components.find(c => c.id === lamps[0].id).state.on;

        // Test State 2: Switch ON
        switches[0].state = { on: true };
        res = evaluateCircuit({ components, wires });
        if (res.shortCircuit) return { success: false, message: "Terjadi hubung singkat saat saklar dinyalakan!" };
        const lampOnCorrect = res.components.find(c => c.id === lamps[0].id).state.on;

        restoreBackup();

        if (lampOffCorrect && lampOnCorrect) {
          return { success: true, message: "LULUS! Saklar tunggal berhasil mengendalikan lampu secara benar dan aman." };
        } else if (!lampOnCorrect) {
          return { success: false, message: "Lampu belum menyala saat saklar di-ON-kan. Periksa jalur kabel fasa dan netral Anda." };
        } else {
          return { success: false, message: "Lampu terus-menerus menyala tanpa melewati kontrol saklar." };
        }
      }

      case 'js2': {
        // Goal: 2 Lamps, 2 Switches. SW1 controls Lamp1, SW2 controls Lamp2.
        const lamps = components.filter(c => c.type === 'Lamp');
        const switches = components.filter(c => c.type === 'SwitchSingle');
        
        if (lamps.length < 2) return { success: false, message: "Butuh minimal 2 Lampu." };
        if (switches.length < 2) return { success: false, message: "Butuh minimal 2 Saklar Tunggal." };

        turnOnMCBs();

        // Let's test combinations:
        // SW1=OFF, SW2=OFF
        switches[0].state = { on: false };
        switches[1].state = { on: false };
        let r00 = evaluateCircuit({ components, wires });
        if (r00.shortCircuit) return { success: false, message: "Korsleting terdeteksi pada rangkaian." };
        const l1_00 = r00.components.find(c => c.id === lamps[0].id).state.on;
        const l2_00 = r00.components.find(c => c.id === lamps[1].id).state.on;

        // SW1=ON, SW2=OFF
        switches[0].state = { on: true };
        switches[1].state = { on: false };
        let r10 = evaluateCircuit({ components, wires });
        const l1_10 = r10.components.find(c => c.id === lamps[0].id).state.on;
        const l2_10 = r10.components.find(c => c.id === lamps[1].id).state.on;

        // SW1=OFF, SW2=ON
        switches[0].state = { on: false };
        switches[1].state = { on: true };
        let r01 = evaluateCircuit({ components, wires });
        const l1_01 = r01.components.find(c => c.id === lamps[0].id).state.on;
        const l2_01 = r01.components.find(c => c.id === lamps[1].id).state.on;

        restoreBackup();

        if (l1_00 || l2_00) {
          return { success: false, message: "Salah satu lampu sudah menyala padahal semua saklar OFF." };
        }

        // Check cross control
        if (l1_10 && !l2_10 && !l1_01 && l2_01) {
          return { success: true, message: "LULUS! Kedua lampu dapat dikendalikan secara terpisah/independen." };
        } else if (l1_10 && l2_10) {
          return { success: false, message: "Kedua lampu menyala bersamaan. Satu saklar mengontrol kedua lampu." };
        } else {
          return { success: false, message: "Kabel kontrol terbalik atau belum terhubung dengan benar." };
        }
      }

      case 'js3': {
        // Goal: 1 SwitchDouble, 2 Lamps. Left controls L1, Right controls L2.
        const lamps = components.filter(c => c.type === 'Lamp');
        const switches = components.filter(c => c.type === 'SwitchDouble');
        
        if (lamps.length < 2) return { success: false, message: "Butuh minimal 2 Lampu." };
        if (switches.length < 1) return { success: false, message: "Butuh Saklar Seri." };

        turnOnMCBs();

        // Test SW_Left=ON, SW_Right=OFF
        switches[0].state = { on1: true, on2: false };
        let r10 = evaluateCircuit({ components, wires });
        const l1_10 = r10.components.find(c => c.id === lamps[0].id).state.on;
        const l2_10 = r10.components.find(c => c.id === lamps[1].id).state.on;

        // Test SW_Left=OFF, SW_Right=ON
        switches[0].state = { on1: false, on2: true };
        let r01 = evaluateCircuit({ components, wires });
        const l1_01 = r01.components.find(c => c.id === lamps[0].id).state.on;
        const l2_01 = r01.components.find(c => c.id === lamps[1].id).state.on;

        restoreBackup();

        if (l1_10 && !l2_10 && !l1_01 && l2_01) {
          return { success: true, message: "LULUS! Saklar seri berhasil membagi kontrol ke kedua lampu secara mandiri." };
        } else {
          return { success: false, message: "Pengujian saklar seri gagal. Pastikan out1 terhubung ke Lampu 1, dan out2 terhubung ke Lampu 2." };
        }
      }

      case 'js4': {
        // Goal: 1 Socket, 1 MCB. Socket is active & Ground is connected.
        const sockets = components.filter(c => c.type === 'Socket');
        if (sockets.length < 1) return { success: false, message: "Butuh Stop Kontak." };

        turnOnMCBs();
        
        const res = evaluateCircuit({ components, wires });
        const hasPower = res.components.find(c => c.id === sockets[0].id).state.on;
        const hasArdeError = res.alerts.some(a => a.id === `grounding_${sockets[0].id}`);
        const hasArdePolarError = res.alerts.some(a => a.id === `socket_polar_${sockets[0].id}`);

        restoreBackup();

        if (!hasPower) {
          return { success: false, message: "Stop Kontak belum bertegangan. Hubungkan fasa dan netralnya." };
        }
        if (hasArdePolarError) {
          return { success: false, message: "Salah menyambung kabel Grounding ke lubang Fasa/Netral." };
        }
        if (hasArdeError) {
          return { success: false, message: "Hampir Benar! Namun kabel Ground/Arde (kuning-hijau) belum dipasang ke terminal arde stop kontak." };
        }

        return { success: true, message: "LULUS! Stop Kontak bertegangan 220V dan terproteksi Arde pengaman sesuai standar PUIL." };
      }

      case 'js5': {
        // Goal: 2 SwitchWay3 (hotel), 1 Lamp. Changing either switch toggles the lamp (XOR).
        const lamps = components.filter(c => c.type === 'Lamp');
        const switches = components.filter(c => c.type === 'SwitchWay3');

        if (lamps.length < 1) return { success: false, message: "Butuh minimal 1 Lampu." };
        if (switches.length < 2) return { success: false, message: "Butuh minimal 2 Saklar Tukar." };

        turnOnMCBs();

        // State 00: Both OFF
        switches[0].state = { on: false };
        switches[1].state = { on: false };
        let r00 = evaluateCircuit({ components, wires });
        const s00 = r00.components.find(c => c.id === lamps[0].id).state.on;

        // State 10: SW1=ON, SW2=OFF
        switches[0].state = { on: true };
        switches[1].state = { on: false };
        let r10 = evaluateCircuit({ components, wires });
        const s10 = r10.components.find(c => c.id === lamps[0].id).state.on;

        // State 01: SW1=OFF, SW2=ON
        switches[0].state = { on: false };
        switches[1].state = { on: true };
        let r01 = evaluateCircuit({ components, wires });
        const s01 = r01.components.find(c => c.id === lamps[0].id).state.on;

        // State 11: SW1=ON, SW2=ON
        switches[0].state = { on: true };
        switches[1].state = { on: true };
        let r11 = evaluateCircuit({ components, wires });
        const s11 = r11.components.find(c => c.id === lamps[0].id).state.on;

        restoreBackup();

        // XOR Check: s10 must differ from s00, s01 must differ from s00, s11 must be equal to s00
        const isXOR = (s10 !== s00) && (s01 !== s00) && (s11 === s00);
        const canTurnOn = s00 || s10 || s01 || s11;

        if (canTurnOn && isXOR) {
          return { success: true, message: "LULUS! Rangkaian Saklar Tukar (Hotel) bekerja sempurna. Lampu dapat dikendalikan dari dua lokasi berbeda." };
        } else {
          return { success: false, message: "Rangkaian saklar hotel salah. Hubungkan L1 ke L1 dan L2 ke L2 antara kedua saklar tukar." };
        }
      }

      case 'js6': {
        // Goal: 2 SwitchWay3, 1 SwitchCross (silang), 1 Lamp. XOR control (8 states sweep).
        const lamps = components.filter(c => c.type === 'Lamp');
        const s3 = components.filter(c => c.type === 'SwitchWay3');
        const s4 = components.filter(c => c.type === 'SwitchCross');

        if (lamps.length < 1) return { success: false, message: "Butuh 1 Lampu." };
        if (s3.length < 2) return { success: false, message: "Butuh 2 Saklar Tukar (S3)." };
        if (s4.length < 1) return { success: false, message: "Butuh 1 Saklar Silang (S4)." };

        turnOnMCBs();

        // Sweep all 8 states
        const states = [];
        for (let a = 0; a <= 1; a++) {
          for (let b = 0; b <= 1; b++) {
            for (let c = 0; c <= 1; c++) {
              s3[0].state = { on: a === 1 };
              s4[0].state = { on: b === 1 };
              s3[1].state = { on: c === 1 };
              const r = evaluateCircuit({ components, wires });
              states.push(r.components.find(comp => comp.id === lamps[0].id).state.on);
            }
          }
        }
        restoreBackup();

        // Check if toggling any single input ALWAYS flips the output
        // Indices in states:
        // 0: 000, 1: 001, 2: 010, 3: 011, 4: 100, 5: 101, 6: 110, 7: 111
        // Change SW3 (bit 0): 000 -> 001 (idx 0 vs 1), 010 -> 011 (2 vs 3), etc.
        const sw3_1 = (states[0] !== states[1]) && (states[2] !== states[3]) && (states[4] !== states[5]) && (states[6] !== states[7]);
        // Change SW4 (bit 1): 000 -> 010 (idx 0 vs 2), 001 -> 011 (1 vs 3), etc.
        const sw4_1 = (states[0] !== states[2]) && (states[1] !== states[3]) && (states[4] !== states[6]) && (states[5] !== states[7]);
        // Change SW3_2 (bit 2): 000 -> 100 (idx 0 vs 4), 001 -> 101 (1 vs 5), etc.
        const sw3_2 = (states[0] !== states[4]) && (states[1] !== states[5]) && (states[2] !== states[6]) && (states[3] !== states[7]);

        const hasOutput = states.some(s => s === true);

        if (hasOutput && sw3_1 && sw4_1 && sw3_2) {
          return { success: true, message: "LULUS! Saklar silang bekerja sempurna. Lampu dapat dikendalikan dari ke-3 saklar." };
        } else {
          return { success: false, message: "Rangkaian saklar silang belum bekerja. Pastikan kabel jumper silang terpasang dengan benar." };
        }
      }

      case 'js7': {
        // Goal: Lamp+Switch + StopKontak in parallel under 1 MCB.
        const lamps = components.filter(c => c.type === 'Lamp');
        const switches = components.filter(c => c.type === 'SwitchSingle');
        const sockets = components.filter(c => c.type === 'Socket');

        if (lamps.length < 1 || switches.length < 1 || sockets.length < 1) {
          return { success: false, message: "Pastikan Lampu, Saklar Tunggal, dan Stop Kontak sudah ditempatkan." };
        }

        turnOnMCBs();

        // Switch OFF
        switches[0].state = { on: false };
        let rOff = evaluateCircuit({ components, wires });
        const lampOff = !rOff.components.find(c => c.id === lamps[0].id).state.on;
        const sockOn_OffState = rOff.components.find(c => c.id === sockets[0].id).state.on;

        // Switch ON
        switches[0].state = { on: true };
        let rOn = evaluateCircuit({ components, wires });
        const lampOn = rOn.components.find(c => c.id === lamps[0].id).state.on;
        const sockOn_OnState = rOn.components.find(c => c.id === sockets[0].id).state.on;
        
        // Ground check
        const ardeOk = !rOn.alerts.some(a => a.id === `grounding_${sockets[0].id}`);

        restoreBackup();

        if (!sockOn_OffState || !sockOn_OnState) {
          return { success: false, message: "Stop Kontak padam saat saklar lampu dimatikan. Ingat, stop kontak harus bertegangan konstan paralel!" };
        }
        if (!lampOn) {
          return { success: false, message: "Lampu belum menyala saat saklar dinyalakan." };
        }
        if (!lampOff) {
          return { success: false, message: "Lampu menyala terus-menerus tanpa terputus saklar." };
        }
        if (!ardeOk) {
          return { success: false, message: "Hampir benar! Namun stop kontak belum dipasang kabel Arde (Ground)." };
        }

        return { success: true, message: "LULUS! Kombinasi sirkuit lampu dan stop kontak bekerja dengan aman sesuai standar." };
      }

      case 'js8': {
        // Goal: 3-Phase balancing. Main MCB 3P feeding 3 MCB 1P, feeding 3 lamps respectively.
        const source3P = components.find(c => c.type === 'Source_3P');
        const mcb3P = components.find(c => c.type === 'MCB_3P');
        const mcb1P = components.filter(c => c.type === 'MCB_1P');
        const lamps = components.filter(c => c.type === 'Lamp');

        if (!source3P) return { success: false, message: "Butuh Sumber Listrik 3-Fasa." };
        if (!mcb3P) return { success: false, message: "Butuh MCB 3-Fasa sebagai pengaman utama." };
        if (mcb1P.length < 3) return { success: false, message: "Butuh minimal 3 buah MCB 1-Fasa (untuk pembagian grup R, S, T)." };
        if (lamps.length < 3) return { success: false, message: "Butuh minimal 3 Lampu sebagai representasi beban tiap fasa." };

        // Turn all MCBs ON
        mcb3P.state = { on: true };
        mcb1P.forEach(m => m.state = { on: true });

        const res = evaluateCircuit({ components, wires });
        if (res.shortCircuit) return { success: false, message: "Rangkaian mengalami korsleting!" };

        // Use potentials from evaluateCircuit (accurate BFS-based, accounts for MCB states).
        // pinToRoot maps each pin ID to its DSU root; potentials maps root → { R, S, T, N, PE }.
        // This replaces the broken `new UnionFind()` which was never imported in this file.
        const { pinToRoot, potentials } = res;

        function getPhaseSourceConnected(lampId) {
          const lampLRoot = pinToRoot && pinToRoot[`${lampId}_L`];
          if (!lampLRoot || !potentials) return null;
          const pot = potentials[lampLRoot];
          if (!pot) return null;
          // Return which phase potential is present on this lamp's L terminal
          if (pot.R) return 'R';
          if (pot.S) return 'S';
          if (pot.T) return 'T';
          return null;
        }

        const phases = lamps.map(l => getPhaseSourceConnected(l.id));
        const connectedPhasesCount = new Set(phases.filter(p => p !== null)).size;

        restoreBackup();

        if (connectedPhasesCount < 3) {
          return { success: false, message: "Beban belum seimbang! Pastikan setiap lampu mendapat suplai dari fasa yang berbeda (R, S, dan T masing-masing 1 lampu)." };
        }

        return { success: true, message: "LULUS! Pembagian sirkuit panel PHB 3-fasa terbagi rata (balanced) dan aman." };
      }


      default:
        return { success: false, message: "ID Jobsheet tidak dikenal." };
    }
  } catch (err) {
    restoreBackup();
    return { success: false, message: "Kesalahan internal evaluasi: " + err.message };
  }
}
