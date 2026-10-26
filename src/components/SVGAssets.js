// SVG Assets and Terminal Definitions for Virtual Lab IPL
// Consists of drawings for PUIL standard electrical symbols and actual components

import { getRealisticAssetPath } from '../data/realisticAssets.js';

export const COMPONENT_TYPES = {

  Source_1P: {
    name: "Sumber 1-Fasa",
    width: 80,
    height: 140,
    pins: [
      { name: "L", label: "L (Fasa)", x: 65, y: 55, color: "#ef4444" },
      { name: "N", label: "N (Netral)", x: 65, y: 85, color: "#3b82f6" },
      { name: "PE", label: "PE (Arde)", x: 65, y: 115, color: "#22c55e" }
    ]
  },
  Source_3P: {
    name: "Sumber 3-Fasa",
    width: 80,
    height: 220,
    pins: [
      { name: "R", label: "R (Fasa R)", x: 65, y: 55, color: "#ef4444" },
      { name: "S", label: "S (Fasa S)", x: 65, y: 85, color: "#facc15" },
      { name: "T", label: "T (Fasa T)", x: 65, y: 115, color: "#1e293b" },
      { name: "N", label: "N (Netral)", x: 65, y: 145, color: "#3b82f6" },
      { name: "PE", label: "PE (Arde)", x: 65, y: 175, color: "#22c55e" }
    ]
  },
  MCB_1P: {
    name: "MCB 1-Fasa",
    width: 60,
    height: 100,
    pins: [
      { name: "in", label: "Input (Atas)", x: 30, y: 10, color: "#ef4444" },
      { name: "out", label: "Output (Bawah)", x: 30, y: 90, color: "#ef4444" }
    ]
  },
  MCB_3P: {
    name: "MCB 3-Fasa",
    width: 80,
    height: 100,
    pins: [
      { name: "in_R", label: "In R", x: 20, y: 10, color: "#ef4444" },
      { name: "in_S", label: "In S", x: 40, y: 10, color: "#facc15" },
      { name: "in_T", label: "In T", x: 60, y: 10, color: "#1e293b" },
      { name: "out_R", label: "Out R", x: 20, y: 90, color: "#ef4444" },
      { name: "out_S", label: "Out S", x: 40, y: 90, color: "#facc15" },
      { name: "out_T", label: "Out T", x: 60, y: 90, color: "#1e293b" }
    ]
  },
  PanelPHB: {
    name: "PHB 3-Fasa",
    width: 140,
    height: 160,
    pins: [
      // Input dari Sumber 3-Fasa
      { name: "in_R",  label: "In R",  x: 20,  y: 5,  color: "#ef4444" },
      { name: "in_S",  label: "In S",  x: 45,  y: 5,  color: "#facc15" },
      { name: "in_T",  label: "In T",  x: 70,  y: 5,  color: "#1e293b" },
      { name: "in_N",  label: "In N",  x: 95,  y: 5,  color: "#3b82f6" },
      { name: "in_PE", label: "In PE", x: 120, y: 5,  color: "#22c55e" },
      // Output per grup (masing-masing sudah difilter lewat MCB grupnya)
      { name: "out1_L", label: "Grup 1 (R)", x: 25,  y: 155, color: "#ef4444" },
      { name: "out2_L", label: "Grup 2 (S)", x: 70,  y: 155, color: "#facc15" },
      { name: "out3_L", label: "Grup 3 (T)", x: 115, y: 155, color: "#1e293b" },
      // Netral & Ground dibagikan bersama (bus bar, tidak melewati pemutus)
      { name: "out_N",  label: "Out N",  x: 140, y: 100, color: "#3b82f6" },
      { name: "out_PE", label: "Out PE", x: 140, y: 130, color: "#22c55e" }
    ]
  },
  Fuse: {
    name: "Sekring (Fuse)",
    width: 50,
    height: 80,
    pins: [
      { name: "in", label: "In", x: 25, y: 10, color: "#ef4444" },
      { name: "out", label: "Out", x: 25, y: 70, color: "#ef4444" }
    ]
  },
  SwitchSingle: {
    name: "Saklar Tunggal",
    width: 60,
    height: 80,
    pins: [
      { name: "in", label: "Fasa In", x: 30, y: 10, color: "#ef4444" },
      { name: "out", label: "Fasa Out", x: 30, y: 70, color: "#ef4444" }
    ]
  },
  SwitchDouble: {
    name: "Saklar Seri",
    width: 80,
    height: 80,
    pins: [
      { name: "in", label: "Fasa In", x: 40, y: 70, color: "#ef4444" },
      { name: "out1", label: "Beban 1", x: 25, y: 10, color: "#ef4444" },
      { name: "out2", label: "Beban 2", x: 55, y: 10, color: "#ef4444" }
    ]
  },

  SwitchWay3: {
    name: "Saklar Tukar",
    width: 70,
    height: 80,
    pins: [
      { name: "com", label: "Common", x: 35, y: 70, color: "#ef4444" },
      { name: "L1", label: "Terminal L1", x: 20, y: 10, color: "#ef4444" },
      { name: "L2", label: "Terminal L2", x: 50, y: 10, color: "#ef4444" }
    ]
  },
  SwitchCross: {
    name: "Saklar Silang",
    width: 80,
    height: 80,
    pins: [
      { name: "in1", label: "In 1", x: 25, y: 10, color: "#ef4444" },
      { name: "in2", label: "In 2", x: 55, y: 10, color: "#ef4444" },
      { name: "out1", label: "Out 1", x: 25, y: 70, color: "#ef4444" },
      { name: "out2", label: "Out 2", x: 55, y: 70, color: "#ef4444" }
    ]
  },
  Socket: {
    name: "Stop Kontak",
    width: 80,
    height: 80,
    pins: [
      { name: "L", label: "Fasa (L)", x: 25, y: 40, color: "#ef4444" },
      { name: "N", label: "Netral (N)", x: 55, y: 40, color: "#3b82f6" },
      { name: "PE", label: "Ground (PE)", x: 40, y: 65, color: "#22c55e" }
    ]
  },
  Lamp: {
    name: "Lampu",
    width: 80,
    height: 80,
    pins: [
      { name: "L", label: "Terminal L", x: 25, y: 40, color: "#ef4444" },
      { name: "N", label: "Terminal N", x: 55, y: 40, color: "#3b82f6" }
    ]
  },
  LampTL: {
    name: "Lampu TL (Neon)",
    width: 120,
    height: 50,
    pins: [
      { name: "L", label: "Terminal L", x: 10, y: 25, color: "#ef4444" },
      { name: "N", label: "Terminal N", x: 110, y: 25, color: "#3b82f6" }
    ]
  },
  JunctionBox: {
    name: "Kotak Sambung",
    width: 60,
    height: 60,
    pins: [
      { name: "top", label: "Atas", x: 30, y: 8, color: "#64748b" },
      { name: "bottom", label: "Bawah", x: 30, y: 52, color: "#64748b" },
      { name: "left", label: "Kiri", x: 8, y: 30, color: "#64748b" },
      { name: "right", label: "Kanan", x: 52, y: 30, color: "#64748b" }
    ]
  },
  TerminalBlock: {
    name: "Terminal Block",
    width: 100,
    height: 50,
    pins: [
      { name: "t1", label: "Atas 1", x: 20, y: 10, color: "#64748b" },
      { name: "t2", label: "Atas 2", x: 40, y: 10, color: "#64748b" },
      { name: "t3", label: "Atas 3", x: 60, y: 10, color: "#64748b" },
      { name: "t4", label: "Atas 4", x: 80, y: 10, color: "#64748b" },
      { name: "b1", label: "Bawah 1", x: 20, y: 40, color: "#64748b" },
      { name: "b2", label: "Bawah 2", x: 40, y: 40, color: "#64748b" },
      { name: "b3", label: "Bawah 3", x: 60, y: 40, color: "#64748b" },
      { name: "b4", label: "Bawah 4", x: 80, y: 40, color: "#64748b" }
    ]
  }
};

// Generates inline SVG markup for visual rendering inside <g> on canvas
export function getComponentSVG(type, compState = {}) {
  const isON = compState.on === true;
  const isTripped = compState.tripped === true;
  
  switch(type) {
    case 'Source_1P':
      return `
        <!-- Border Outer -->
        <rect width="80" height="140" rx="8" fill="#1e293b" stroke="#475569" stroke-width="2"/>
        <rect x="5" y="5" width="70" height="35" rx="4" fill="#0f172a"/>
        <text x="40" y="27" fill="#f59e0b" font-weight="800" font-size="12" text-anchor="middle">220V AC</text>
        
        <!-- Terminals labels -->
        <text x="50" y="58" fill="#f8fafc" font-size="9" font-weight="600" text-anchor="end">L (Fasa)</text>
        <text x="50" y="88" fill="#3b82f6" font-size="9" font-weight="600" text-anchor="end">N (Netral)</text>
        <text x="50" y="118" fill="#22c55e" font-size="9" font-weight="600" text-anchor="end">PE (Arde)</text>
      `;
      
    case 'Source_3P':
      return `
        <rect width="80" height="220" rx="8" fill="#1e293b" stroke="#475569" stroke-width="2"/>
        <rect x="5" y="5" width="70" height="35" rx="4" fill="#0f172a"/>
        <text x="40" y="27" fill="#ef4444" font-weight="800" font-size="10" text-anchor="middle">380V / 220V</text>
        
        <text x="50" y="58" fill="#ef4444" font-size="9" font-weight="600" text-anchor="end">Fasa R</text>
        <text x="50" y="88" fill="#facc15" font-size="9" font-weight="600" text-anchor="end">Fasa S</text>
        <text x="50" y="118" fill="#f8fafc" font-size="9" font-weight="600" text-anchor="end">Fasa T</text>
        <text x="50" y="148" fill="#3b82f6" font-size="9" font-weight="600" text-anchor="end">Netral N</text>
        <text x="50" y="178" fill="#22c55e" font-size="9" font-weight="600" text-anchor="end">Arde PE</text>
      `;
      
    case 'MCB_1P':
      return `
        <rect width="60" height="100" rx="6" fill="#334155" stroke="#475569" stroke-width="2"/>
        <rect x="10" y="20" width="40" height="60" rx="3" fill="#1e293b"/>
        
        <!-- Toggle Switch Lever -->
        <g transform="translate(30, 50)">
          ${isON ? 
            `<rect x="-8" y="-25" width="16" height="25" fill="#ef4444" rx="2"/>
             <text x="0" y="-10" fill="#fff" font-size="9" font-weight="bold" text-anchor="middle">I</text>` : 
            `<rect x="-8" y="0" width="16" height="25" fill="#0f172a" rx="2" stroke="#475569"/>
             <text x="0" y="15" fill="#64748b" font-size="9" font-weight="bold" text-anchor="middle">O</text>`
          }
        </g>
        
        <!-- PUIL label -->
        <text x="30" y="98" fill="#cbd5e1" font-size="6.5" font-weight="bold" text-anchor="middle" pointer-events="none">MCB 1P</text>
        ${isTripped ? `<text x="30" y="15" fill="#ef4444" font-size="8" font-weight="bold" text-anchor="middle">TRIP</text>` : ''}
      `;
      
    case 'MCB_3P':
      return `
        <rect width="80" height="100" rx="6" fill="#334155" stroke="#475569" stroke-width="2"/>
        <rect x="10" y="20" width="60" height="60" rx="3" fill="#1e293b"/>
        
        <!-- Toggle Switch Lever (Linked 3-pole) -->
        <g transform="translate(40, 50)">
          ${isON ? 
            `<rect x="-24" y="-25" width="48" height="25" fill="#ef4444" rx="2"/>
             <line x1="-24" y1="-12" x2="24" y2="-12" stroke="#000" stroke-width="2"/>
             <text x="0" y="-8" fill="#fff" font-size="9" font-weight="bold" text-anchor="middle">ON</text>` : 
            `<rect x="-24" y="0" width="48" height="25" fill="#0f172a" rx="2" stroke="#475569"/>
             <line x1="-24" y1="12" x2="24" y2="12" stroke="#475569" stroke-width="2"/>
             <text x="0" y="16" fill="#64748b" font-size="9" font-weight="bold" text-anchor="middle">OFF</text>`
          }
        </g>
        <text x="40" y="98" fill="#cbd5e1" font-size="6.5" font-weight="bold" text-anchor="middle" pointer-events="none">MCB 3-FASA</text>
      `;
      
    case 'PanelPHB': {
      const isMainTripped = compState.mainTripped === true;
      const isMainON = compState.mainOn === true && !isMainTripped;

      const isG1Tripped = compState.group1Tripped === true;
      const isG1ON = compState.group1On === true && !isG1Tripped;

      const isG2Tripped = compState.group2Tripped === true;
      const isG2ON = compState.group2On === true && !isG2Tripped;

      const isG3Tripped = compState.group3Tripped === true;
      const isG3ON = compState.group3On === true && !isG3Tripped;

      return `
        <!-- Panel Outer Box -->
        <rect width="140" height="160" rx="8" fill="#1e293b" stroke="#475569" stroke-width="2"/>
        
        <!-- Header Banner -->
        <rect x="6" y="8" width="128" height="14" rx="3" fill="#0f172a"/>
        <text x="70" y="18" fill="#94a3b8" font-size="7.5" font-weight="bold" text-anchor="middle" letter-spacing="0.5">PANEL HUBUNG BAGI 3-FASA</text>
        
        <!-- Main Breaker Section (Top 40%) -->
        <rect x="12" y="26" width="116" height="42" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
        <text x="70" y="36" fill="#cbd5e1" font-size="7" font-weight="bold" text-anchor="middle">PENGAMAN UTAMA (MAIN 3P)</text>
        
        <!-- Main Lever -->
        <g transform="translate(70, 52)">
          ${isMainTripped ? `
            <rect x="-35" y="-10" width="70" height="20" rx="3" fill="#ef4444" stroke="#b91c1c" stroke-width="1"/>
            <text x="0" y="4" fill="#ffffff" font-size="8.5" font-weight="900" text-anchor="middle" letter-spacing="1">TRIP</text>
          ` : isMainON ? `
            <rect x="-35" y="-12" width="70" height="20" rx="3" fill="#ef4444"/>
            <line x1="-35" y1="-2" x2="35" y2="-2" stroke="#000" stroke-width="1.5"/>
            <text x="0" y="2" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">MAIN ON</text>
          ` : `
            <rect x="-35" y="-8" width="70" height="20" rx="3" fill="#334155" stroke="#475569"/>
            <line x1="-35" y1="2" x2="35" y2="2" stroke="#475569" stroke-width="1.5"/>
            <text x="0" y="6" fill="#94a3b8" font-size="8.5" font-weight="bold" text-anchor="middle">MAIN OFF</text>
          `}
        </g>

        <!-- Divider Line -->
        <line x1="8" y1="73" x2="132" y2="73" stroke="#334155" stroke-dasharray="2,2"/>

        <!-- 3 Branch Group MCBs (Bottom Area) -->
        <!-- Group 1 (R) -->
        <rect x="10" y="78" width="37" height="66" rx="3" fill="#0f172a" stroke="#ef4444" stroke-width="1.2"/>
        <text x="28.5" y="88" fill="#ef4444" font-size="6.5" font-weight="bold" text-anchor="middle">GRUP 1 (R)</text>
        <g transform="translate(28.5, 108)">
          ${isG1Tripped ? `
            <rect x="-13" y="-10" width="26" height="18" rx="2" fill="#ef4444"/>
            <text x="0" y="3" fill="#ffffff" font-size="7" font-weight="bold" text-anchor="middle">TRIP</text>
          ` : isG1ON ? `
            <rect x="-13" y="-11" width="26" height="18" rx="2" fill="#ef4444"/>
            <text x="0" y="2" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">I</text>
          ` : `
            <rect x="-13" y="-7" width="26" height="18" rx="2" fill="#334155" stroke="#475569"/>
            <text x="0" y="6" fill="#94a3b8" font-size="7.5" font-weight="bold" text-anchor="middle">O</text>
          `}
        </g>
        <text x="28.5" y="137" fill="#64748b" font-size="6" font-weight="bold" text-anchor="middle">MCB 1P</text>

        <!-- Group 2 (S) -->
        <rect x="51.5" y="78" width="37" height="66" rx="3" fill="#0f172a" stroke="#facc15" stroke-width="1.2"/>
        <text x="70" y="88" fill="#facc15" font-size="6.5" font-weight="bold" text-anchor="middle">GRUP 2 (S)</text>
        <g transform="translate(70, 108)">
          ${isG2Tripped ? `
            <rect x="-13" y="-10" width="26" height="18" rx="2" fill="#ef4444"/>
            <text x="0" y="3" fill="#ffffff" font-size="7" font-weight="bold" text-anchor="middle">TRIP</text>
          ` : isG2ON ? `
            <rect x="-13" y="-11" width="26" height="18" rx="2" fill="#facc15"/>
            <text x="0" y="2" fill="#000000" font-size="7.5" font-weight="bold" text-anchor="middle">I</text>
          ` : `
            <rect x="-13" y="-7" width="26" height="18" rx="2" fill="#334155" stroke="#475569"/>
            <text x="0" y="6" fill="#94a3b8" font-size="7.5" font-weight="bold" text-anchor="middle">O</text>
          `}
        </g>
        <text x="70" y="137" fill="#64748b" font-size="6" font-weight="bold" text-anchor="middle">MCB 1P</text>

        <!-- Group 3 (T) -->
        <rect x="93" y="78" width="37" height="66" rx="3" fill="#0f172a" stroke="#64748b" stroke-width="1.2"/>
        <text x="111.5" y="88" fill="#cbd5e1" font-size="6.5" font-weight="bold" text-anchor="middle">GRUP 3 (T)</text>
        <g transform="translate(111.5, 108)">
          ${isG3Tripped ? `
            <rect x="-13" y="-10" width="26" height="18" rx="2" fill="#ef4444"/>
            <text x="0" y="3" fill="#ffffff" font-size="7" font-weight="bold" text-anchor="middle">TRIP</text>
          ` : isG3ON ? `
            <rect x="-13" y="-11" width="26" height="18" rx="2" fill="#cbd5e1"/>
            <text x="0" y="2" fill="#000000" font-size="7.5" font-weight="bold" text-anchor="middle">I</text>
          ` : `
            <rect x="-13" y="-7" width="26" height="18" rx="2" fill="#334155" stroke="#475569"/>
            <text x="0" y="6" fill="#94a3b8" font-size="7.5" font-weight="bold" text-anchor="middle">O</text>
          `}
        </g>
        <text x="111.5" y="137" fill="#64748b" font-size="6" font-weight="bold" text-anchor="middle">MCB 1P</text>

        <!-- Busbar Indicators (Side Pins N and PE) -->
        <rect x="131" y="93" width="7" height="14" rx="1.5" fill="#1e3a8a" stroke="#3b82f6"/>
        <text x="134.5" y="103" fill="#93c5fd" font-size="5" font-weight="bold" text-anchor="middle">N</text>
        
        <rect x="131" y="123" width="7" height="14" rx="1.5" fill="#14532d" stroke="#22c55e"/>
        <text x="134.5" y="133" fill="#86efac" font-size="5" font-weight="bold" text-anchor="middle">PE</text>
      `;
    }
      
    case 'Fuse':
      if (compState.blown) {
        return `
          <rect width="50" height="80" rx="4" fill="#fef2f2" stroke="#ef4444" stroke-width="2"/>
          <rect x="10" y="15" width="30" height="50" rx="15" fill="#fee2e2" stroke="#f87171"/>
          <!-- Broken fuse element wire -->
          <line x1="25" y1="20" x2="25" y2="34" stroke="#ef4444" stroke-width="1.5"/>
          <line x1="25" y1="46" x2="25" y2="60" stroke="#ef4444" stroke-width="1.5"/>
          <!-- Break spark/burn dot -->
          <circle cx="25" cy="40" r="2.5" fill="#ef4444"/>
          <!-- Metallic caps -->
          <rect x="18" y="15" width="14" height="8" fill="#94a3b8"/>
          <rect x="18" y="57" width="14" height="8" fill="#94a3b8"/>
          <!-- PUTUS Badge -->
          <rect x="6" y="47" width="38" height="13" rx="3" fill="#dc2626"/>
          <text x="25" y="57" fill="#ffffff" font-size="7.5" font-weight="900" text-anchor="middle" letter-spacing="0.5">PUTUS</text>
          <text x="25" y="76" fill="#dc2626" font-size="7" font-weight="bold" text-anchor="middle">SEKRING</text>
        `;
      }
      return `
        <rect width="50" height="80" rx="4" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2"/>
        <rect x="10" y="15" width="30" height="50" rx="15" fill="#e2e8f0" stroke="#94a3b8"/>
        <!-- Fuse element wire -->
        <line x1="25" y1="20" x2="25" y2="60" stroke="#64748b" stroke-width="1.5" stroke-dasharray="2,2"/>
        <!-- Metallic caps -->
        <rect x="18" y="15" width="14" height="8" fill="#94a3b8"/>
        <rect x="18" y="57" width="14" height="8" fill="#94a3b8"/>
        <text x="25" y="76" fill="#475569" font-size="7" font-weight="bold" text-anchor="middle">SEKRING</text>
      `;
      
    case 'SwitchSingle':
      return `
        <rect width="60" height="80" rx="30" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="2"/>
        <circle cx="30" cy="40" r="22" fill="#f8fafc" stroke="#94a3b8"/>
        
        <!-- Toggle Button -->
        <g transform="translate(30, 40)">
          ${isON ? 
            `<rect x="-8" y="-15" width="16" height="30" rx="4" fill="#cbd5e1"/>
             <circle cx="0" cy="-5" r="4" fill="#ef4444"/>` : 
            `<rect x="-8" y="-15" width="16" height="30" rx="4" fill="#cbd5e1"/>
             <circle cx="0" cy="5" r="4" fill="#64748b"/>`
          }
        </g>
        <text x="30" y="78.5" fill="#475569" font-size="5.5" font-weight="bold" text-anchor="middle" pointer-events="none">SAKLAR TUNGGAL</text>
      `;
      
    case 'SwitchDouble':
      return `
        <rect width="80" height="80" rx="10" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="2"/>
        <rect x="10" y="15" width="60" height="50" rx="4" fill="#f8fafc" stroke="#94a3b8"/>
        
        <!-- Pin labels: out1=top-left, out2=top-right, in=bottom-center -->
        <text x="13" y="12" fill="#64748b" font-size="5.5" text-anchor="middle">out1</text>
        <text x="67" y="12" fill="#64748b" font-size="5.5" text-anchor="middle">out2</text>
        <text x="40" y="78" fill="#64748b" font-size="5.5" text-anchor="middle">in</text>
        
        <!-- Toggle Left -->
        <g transform="translate(28, 38)">
          <rect x="-8" y="-14" width="16" height="28" rx="2" fill="#e2e8f0"/>
          ${(compState.on1) ? 
            `<circle cx="0" cy="-5" r="3" fill="#ef4444"/>` : 
            `<circle cx="0" cy="5" r="3" fill="#64748b"/>`
          }
        </g>
        
        <!-- Toggle Right -->
        <g transform="translate(52, 38)">
          <rect x="-8" y="-14" width="16" height="28" rx="2" fill="#e2e8f0"/>
          ${(compState.on2) ? 
            `<circle cx="0" cy="-5" r="3" fill="#ef4444"/>` : 
            `<circle cx="0" cy="5" r="3" fill="#64748b"/>`
          }
        </g>
        <text x="40" y="60" fill="#475569" font-size="7" font-weight="bold" text-anchor="middle">SAKLAR SERI</text>
      `;

      
    case 'SwitchWay3':
      return `
        <rect width="70" height="80" rx="35" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="2"/>
        <circle cx="35" cy="40" r="24" fill="#f8fafc" stroke="#94a3b8"/>
        
        <!-- Pin labels: L1=left-top, L2=right-top, com=bottom -->
        <text x="12" y="12" fill="#64748b" font-size="6" text-anchor="middle">L1</text>
        <text x="58" y="12" fill="#64748b" font-size="6" text-anchor="middle">L2</text>
        <text x="35" y="78" fill="#64748b" font-size="6" text-anchor="middle">com</text>

        <!-- Lever representation: ON -> sambung ke L1 (kiri-atas), OFF -> sambung ke L2 (kanan-atas) -->
        <g transform="translate(35, 40)">
          ${isON ? 
            `<!-- ON: lever points LEFT-UP toward L1 -->
             <line x1="0" y1="0" x2="-12" y2="-14" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
             <circle cx="-12" cy="-14" r="4" fill="#ef4444"/>` : 
            `<!-- OFF: lever points RIGHT-UP toward L2 -->
             <line x1="0" y1="0" x2="12" y2="-14" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
             <circle cx="12" cy="-14" r="4" fill="#64748b"/>`
          }
          <circle cx="0" cy="0" r="5" fill="#334155"/>
        </g>
        <text x="35" y="78.5" fill="#475569" font-size="5.5" font-weight="bold" text-anchor="middle" pointer-events="none">SAKLAR TUKAR</text>
      `;
      
    case 'SwitchCross':
      return `
        <rect width="80" height="80" rx="8" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="2"/>
        <circle cx="40" cy="40" r="24" fill="#f8fafc" stroke="#94a3b8"/>
        
        <!-- Pin labels -->
        <text x="22" y="12" fill="#64748b" font-size="5.5" text-anchor="middle">in1</text>
        <text x="58" y="12" fill="#64748b" font-size="5.5" text-anchor="middle">in2</text>
        <text x="22" y="77" fill="#64748b" font-size="5.5" text-anchor="middle">out1</text>
        <text x="58" y="77" fill="#64748b" font-size="5.5" text-anchor="middle">out2</text>

        <!-- Cross indicators:
             ON  (rotate=0)  → garis membentuk X = menyilang (in1→out2, in2→out1)
             OFF (rotate=45) → garis membentuk + = lurus     (in1→out1, in2→out2) -->
        <g transform="translate(40, 40) rotate(${isON ? '0' : '45'})">
          <line x1="-13" y1="-13" x2="13" y2="13" stroke="${isON ? '#ef4444' : '#475569'}" stroke-width="2.5"/>
          <line x1="13" y1="-13" x2="-13" y2="13" stroke="${isON ? '#ef4444' : '#475569'}" stroke-width="2.5"/>
          <circle cx="0" cy="0" r="6" fill="${isON ? '#ef4444' : '#f59e0b'}"/>
        </g>
        <text x="40" y="75" fill="#475569" font-size="7" font-weight="bold" text-anchor="middle">SAKLAR SILANG</text>
      `;
      
    case 'Socket':
      return `
        <rect width="80" height="80" rx="40" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
        <circle cx="40" cy="40" r="28" fill="#f1f5f9" stroke="#cbd5e1"/>
        
        <!-- Two plug holes -->
        <circle cx="28" cy="40" r="6" fill="#334155"/>
        <circle cx="52" cy="40" r="6" fill="#334155"/>
        
        <!-- Ground contacts -->
        <path d="M 37 15 L 43 15 M 40 15 L 40 18" stroke="#22c55e" stroke-width="1.5"/>
        <path d="M 37 65 L 43 65 M 40 65 L 40 62" stroke="#22c55e" stroke-width="1.5"/>
        
        <text x="40" y="78.5" fill="#64748b" font-size="5.5" font-weight="bold" text-anchor="middle" pointer-events="none">STOP KONTAK</text>
      `;
      
    case 'Lamp':
      return `
        <!-- Fitting base -->
        <rect width="80" height="80" rx="8" fill="#1e293b" stroke="#334155" stroke-width="2"/>
        <circle cx="40" cy="40" r="28" fill="#0f172a" stroke="#334155" stroke-width="2"/>
        
        <!-- Bulbs underlay GLOW if on -->
        ${isON ? 
          `<circle cx="40" cy="40" r="24" fill="#fef08a" filter="drop-shadow(0 0 12px #fef08a)"/>
           <circle cx="40" cy="40" r="20" fill="#fde047"/>` : 
          `<circle cx="40" cy="40" r="24" fill="#334155"/>`
        }
        
        <!-- Bulb filament -->
        <path d="M 32 45 C 32 30, 48 30, 48 45" fill="none" stroke="${isON ? '#000' : '#94a3b8'}" stroke-width="2"/>
        <line x1="32" y1="45" x2="35" y2="52" stroke="${isON ? '#000' : '#94a3b8'}" stroke-width="1.5"/>
        <line x1="48" y1="45" x2="45" y2="52" stroke="${isON ? '#000' : '#94a3b8'}" stroke-width="1.5"/>
        
        <text x="40" y="74" fill="#94a3b8" font-size="7" font-weight="bold" text-anchor="middle">LAMPU BEBAN</text>
      `;

    case 'LampTL':
      return `
        <rect width="120" height="50" rx="6" fill="#1e293b" stroke="#334155" stroke-width="2"/>
        <text x="14" y="11" fill="#ef4444" font-size="6" font-weight="bold" text-anchor="middle">L</text>
        <text x="106" y="11" fill="#3b82f6" font-size="6" font-weight="bold" text-anchor="middle">N</text>
        <rect x="8" y="15" width="12" height="20" rx="2" fill="#475569"/>
        <rect x="100" y="15" width="12" height="20" rx="2" fill="#475569"/>
        ${isON ? `
          <rect x="18" y="16" width="84" height="18" rx="9" fill="#f8fafc" filter="drop-shadow(0 0 10px #f0f9ff)"/>
        ` : `
          <rect x="18" y="16" width="84" height="18" rx="9" fill="#334155"/>
        `}
        <text x="60" y="46" fill="#94a3b8" font-size="6.5" font-weight="bold" text-anchor="middle">LAMPU TL</text>
      `;
      
    case 'JunctionBox':
      return `
        <circle cx="30" cy="30" r="25" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
        <circle cx="30" cy="30" r="16" fill="#e2e8f0" stroke="#94a3b8"/>
        
        <!-- Cross screw detail -->
        <line x1="25" y1="30" x2="35" y2="30" stroke="#475569" stroke-width="2"/>
        <line x1="30" y1="25" x2="30" y2="35" stroke="#475569" stroke-width="2"/>
        
        <text x="30" y="52" fill="#64748b" font-size="6" font-weight="bold" text-anchor="middle">T-DOS</text>
      `;
      
    case 'TerminalBlock':
      return `
        <rect width="100" height="50" rx="4" fill="#334155" stroke="#475569" stroke-width="2"/>
        <rect x="5" y="5" width="90" height="40" rx="2" fill="#1e293b"/>
        
        <!-- Screws and barriers -->
        ${[15, 35, 55, 75].map(offset => `
          <line x1="${offset + 10}" y1="5" x2="${offset + 10}" y2="45" stroke="#475569" stroke-width="1"/>
          <circle cx="${offset}" cy="15" r="3" fill="#94a3b8"/>
          <line x1="${offset-2}" y1="15" x2="${offset+2}" y2="15" stroke="#1e293b" stroke-width="1"/>
          
          <circle cx="${offset}" cy="35" r="3" fill="#94a3b8"/>
          <line x1="${offset-2}" y1="35" x2="${offset+2}" y2="35" stroke="#1e293b" stroke-width="1"/>
        `).join('')}
      `;
      
    default:
      return `<rect width="50" height="50" fill="magenta"/>`;
  }
}

// Generates SVG markup for Realistic Photo View Mode
export function getComponentRealisticSVG(type, compState = {}, uniqueId = 'default') {
  const typeInfo = COMPONENT_TYPES[type];
  const schematicSVG = getComponentSVG(type, compState);

  if (!typeInfo) return schematicSVG;

  const imagePath = getRealisticAssetPath(type, compState);
  if (!imagePath) return schematicSVG;

  const isTripped = compState.tripped === true;
  const isBlown = compState.blown === true;
  const { width, height } = typeInfo;
  const fallbackId = `schematic-fallback-${uniqueId}`;

  return `
    <!-- Schematic Base Fallback (HIDDEN by default, only shown if image fails to load) -->
    <g class="schematic-base-fallback" id="${fallbackId}" style="display:none;">
      ${schematicSVG}
    </g>

    <!-- Realistic Component Photo Overlay -->
    <image href="${imagePath}" 
           width="${width}" 
           height="${height}" 
           preserveAspectRatio="xMidYMid meet" 
           loading="lazy"
           onerror="this.style.display='none'; const fb=document.getElementById('${fallbackId}'); if(fb) fb.style.display='block';"/>

    <!-- Special Status Overlay: TRIP indicator for MCBs -->
    ${isTripped ? `
      <g class="mcb-trip-overlay">
        <rect width="${width}" height="${height}" rx="6" fill="rgba(239, 68, 68, 0.35)" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="4,2"/>
        <rect x="${width / 2 - 22}" y="4" width="44" height="16" rx="3" fill="#ef4444"/>
        <text x="${width / 2}" y="15" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">TRIP</text>
      </g>
    ` : ''}

    <!-- Special Status Overlay: PUTUS indicator for Fuse -->
    ${isBlown ? `
      <g class="fuse-blown-overlay">
        <rect width="${width}" height="${height}" rx="6" fill="rgba(239, 68, 68, 0.35)" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="4,2"/>
        <rect x="${width / 2 - 24}" y="${height / 2 - 9}" width="48" height="18" rx="3" fill="#dc2626"/>
        <text x="${width / 2}" y="${height / 2 + 3}" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle" letter-spacing="0.5">PUTUS</text>
      </g>
    ` : ''}

    <!-- Special Status Overlay: Panel PHB Status Indicators (Main + 3 Groups) -->
    ${type === 'PanelPHB' ? `
      <g class="phb-status-overlay">
        <!-- Main Breaker status (top) -->
        ${!compState.labelsHidden ? `
        <g transform="translate(42, 22)">
          <rect width="56" height="18" rx="3" fill="${compState.mainTripped ? '#ef4444' : compState.mainOn ? '#10b981' : '#334155'}" stroke="#ffffff" stroke-width="1"/>
          <text x="28" y="12.5" fill="#ffffff" font-size="7.5" font-weight="bold" text-anchor="middle">MAIN: ${compState.mainTripped ? 'TRIP' : compState.mainOn ? 'ON' : 'OFF'}</text>
        </g>
        ` : ''}
        <!-- Group 1 (R) -->
        ${!compState.labelsHidden ? `
        <g transform="translate(10, 118)">
          <rect width="36" height="16" rx="3" fill="${compState.group1Tripped ? '#ef4444' : compState.group1On ? '#10b981' : '#334155'}" stroke="#ef4444" stroke-width="1"/>
          <text x="18" y="11" fill="#ffffff" font-size="6.5" font-weight="bold" text-anchor="middle">R: ${compState.group1Tripped ? 'TRIP' : compState.group1On ? 'ON' : 'OFF'}</text>
        </g>
        ` : ''}
        <!-- Group 2 (S) -->
        ${!compState.labelsHidden ? `
        <g transform="translate(52, 118)">
          <rect width="36" height="16" rx="3" fill="${compState.group2Tripped ? '#ef4444' : compState.group2On ? '#facc15' : '#334155'}" stroke="#facc15" stroke-width="1"/>
          <text x="18" y="11" fill="${compState.group2On && !compState.group2Tripped ? '#000000' : '#ffffff'}" font-size="6.5" font-weight="bold" text-anchor="middle">S: ${compState.group2Tripped ? 'TRIP' : compState.group2On ? 'ON' : 'OFF'}</text>
        </g>
        ` : ''}
        <!-- Group 3 (T) -->
        ${!compState.labelsHidden ? `
        <g transform="translate(94, 118)">
          <rect width="36" height="16" rx="3" fill="${compState.group3Tripped ? '#ef4444' : compState.group3On ? '#10b981' : '#334155'}" stroke="#64748b" stroke-width="1"/>
          <text x="18" y="11" fill="#ffffff" font-size="6.5" font-weight="bold" text-anchor="middle">T: ${compState.group3Tripped ? 'TRIP' : compState.group3On ? 'ON' : 'OFF'}</text>
        </g>
        ` : ''}
      </g>
    ` : ''}
  `;
}


