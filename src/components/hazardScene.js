// Ilustrasi adegan "Bengkel Listrik" untuk widget Identifikasi Bahaya (viewBox 0 0 600 380).
// Setiap bahaya punya dua kondisi: .hz-danger (bahaya) dan .hz-safe (setelah diamankan).

export const HAZARD_GEOMETRY = {
  kabel_air:           { x: 24,  y: 250, w: 160, h: 92,  markerX: 16,  markerY: 296, anchorX: 38,  anchorY: 308 },
  stopkontak_overload: { x: 468, y: 58,  w: 106, h: 160, markerX: 584, markerY: 90,  anchorX: 556, anchorY: 112 },
  kabel_menjuntai:     { x: 178, y: 280, w: 246, h: 74,  markerX: 307, markerY: 266, anchorX: 307, anchorY: 288 },
  panel_terbuka:       { x: 160, y: 26,  w: 184, h: 180, markerX: 356, markerY: 46,  anchorX: 338, anchorY: 56 },
  sambungan_terbuka:   { x: 420, y: 204, w: 100, h: 46,  markerX: 447, markerY: 186, anchorX: 447, anchorY: 212 },
  pekerja_tanpa_apd:   { x: 46,  y: 68,  w: 110, h: 180, markerX: 38,  markerY: 150, anchorX: 70,  anchorY: 150 }
};

const DEFS = `
<defs>
  <filter id="hz-glow" x="-30%" y="-30%" width="160%" height="160%">
    <feGaussianBlur stdDeviation="3" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/>
  </filter>
  <linearGradient id="hzWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b3b54"/><stop offset="1" stop-color="#1a2536"/></linearGradient>
  <linearGradient id="hzFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#18233a"/><stop offset="1" stop-color="#0a101d"/></linearGradient>
  <linearGradient id="hzMetal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8493a8"/><stop offset="1" stop-color="#56657b"/></linearGradient>
  <linearGradient id="hzCopper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fcd34d"/><stop offset="1" stop-color="#b45309"/></linearGradient>
  <radialGradient id="hzPuddle" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#7dd3fc" stop-opacity=".9"/><stop offset=".65" stop-color="#0284c7" stop-opacity=".75"/><stop offset="1" stop-color="#075985" stop-opacity=".2"/></radialGradient>
  <radialGradient id="hzHeat" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fb923c" stop-opacity=".65"/><stop offset="1" stop-color="#ef4444" stop-opacity="0"/></radialGradient>
  <radialGradient id="hzSpark" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fef08a" stop-opacity=".95"/><stop offset="1" stop-color="#f59e0b" stop-opacity="0"/></radialGradient>
  <pattern id="hzStripe" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <rect width="12" height="12" fill="#1f2937"/><rect width="6" height="12" fill="#facc15"/>
  </pattern>
</defs>`;

const BACKGROUND = `
  <!-- DINDING -->
  <rect width="600" height="246" fill="url(#hzWall)"/>
  <g stroke="#0b1220" stroke-opacity=".35">
    <line x1="100" y1="0" x2="100" y2="246"/><line x1="200" y1="0" x2="200" y2="246"/><line x1="300" y1="0" x2="300" y2="246"/>
    <line x1="400" y1="0" x2="400" y2="246"/><line x1="500" y1="0" x2="500" y2="246"/>
  </g>
  <rect y="172" width="600" height="3" fill="#0b1220" opacity=".4"/>
  <!-- lampu neon langit-langit dan cahayanya -->
  <polygon points="215,14 385,14 480,170 120,170" fill="#fde68a" opacity=".045"/>
  <rect x="222" y="5" width="156" height="9" rx="3" fill="#cbd5e1"/><rect x="227" y="7" width="146" height="5" rx="2" fill="#fef9c3"/>
  <!-- jam dinding -->
  <circle cx="566" cy="40" r="15" fill="#0f172a" stroke="#64748b" stroke-width="2"/>
  <line x1="566" y1="40" x2="566" y2="30" stroke="#e2e8f0" stroke-width="2" stroke-linecap="round"/><line x1="566" y1="40" x2="574" y2="44" stroke="#e2e8f0" stroke-width="2" stroke-linecap="round"/>
  <!-- poster K3 -->
  <g>
    <rect x="20" y="28" width="60" height="84" rx="3" fill="#0f172a" stroke="#64748b" stroke-width="1.5"/>
    <rect x="20" y="28" width="60" height="16" rx="3" fill="#facc15"/>
    <text x="50" y="40" fill="#0f172a" font-size="8.5" font-weight="900" text-anchor="middle">K3 LISTRIK</text>
    <g fill="#64748b"><rect x="28" y="54" width="44" height="3" rx="1.5"/><rect x="28" y="63" width="36" height="3" rx="1.5"/><rect x="28" y="72" width="44" height="3" rx="1.5"/><rect x="28" y="81" width="30" height="3" rx="1.5"/></g>
    <path d="M45 96 L55 96 L50 106 Z" fill="#facc15"/>
  </g>
  <!-- APAR (alat pemadam) di dinding: objek aman -->
  <g>
    <rect x="364" y="134" width="22" height="50" rx="9" fill="#dc2626" stroke="#7f1d1d" stroke-width="1.5"/>
    <rect x="370" y="124" width="10" height="12" rx="2" fill="#475569"/><rect x="366" y="122" width="18" height="4" rx="2" fill="#0f172a"/>
    <path d="M384 126 Q398 126 396 142" stroke="#0f172a" stroke-width="3" fill="none"/>
    <circle cx="375" cy="146" r="5" fill="#e2e8f0" stroke="#475569"/><rect x="368" y="160" width="14" height="12" fill="#fef2f2" opacity=".9"/>
    <text x="375" y="169" fill="#7f1d1d" font-size="6" font-weight="800" text-anchor="middle">APAR</text>
  </g>
  <!-- LANTAI -->
  <rect y="246" width="600" height="134" fill="url(#hzFloor)"/>
  <rect y="243" width="600" height="6" fill="#475569"/><rect y="243" width="600" height="2" fill="#94a3b8" opacity=".5"/>
  <g stroke="#243148" stroke-width="1.5">
    <line x1="60" y1="249" x2="-30" y2="380"/><line x1="180" y1="249" x2="120" y2="380"/><line x1="300" y1="249" x2="300" y2="380"/>
    <line x1="420" y1="249" x2="480" y2="380"/><line x1="540" y1="249" x2="630" y2="380"/>
    <line x1="0" y1="276" x2="600" y2="276" opacity=".7"/><line x1="0" y1="312" x2="600" y2="312" opacity=".55"/><line x1="0" y1="354" x2="600" y2="354" opacity=".4"/>
  </g>
  <!-- jalur jalan (marka kuning) -->
  <g>
    <line x1="182" y1="286" x2="432" y2="286" stroke="#facc15" stroke-width="3" stroke-dasharray="14 8" opacity=".85"/>
    <line x1="182" y1="348" x2="432" y2="348" stroke="#facc15" stroke-width="3" stroke-dasharray="14 8" opacity=".85"/>
    <text x="307" y="368" fill="#facc15" font-size="8" font-weight="800" text-anchor="middle" opacity=".75" letter-spacing="2">JALUR JALAN</text>
  </g>
  <!-- MEJA KERJA (kanan) -->
  <g>
    <ellipse cx="445" cy="318" rx="130" ry="9" fill="#000" opacity=".35"/>
    <rect x="344" y="266" width="9" height="56" fill="#334155"/><rect x="540" y="266" width="9" height="56" fill="#334155"/>
    <polygon points="352,212 540,212 562,256 330,256" fill="#64748b" stroke="#0b1220" stroke-width="1.5"/>
    <rect x="330" y="256" width="232" height="9" fill="#475569" stroke="#0b1220" stroke-width="1.5"/>
    <!-- APD diletakkan tidak terpakai di atas meja -->
    <path d="M356 214 C356 196, 392 196, 392 214 Z" fill="#facc15" stroke="#b45309" stroke-width="1.5"/>
    <rect x="352" y="212" width="44" height="5" rx="2.5" fill="#f59e0b" stroke="#b45309" stroke-width="1"/>
    <path d="M404 216 C400 202, 412 196, 418 204 C424 212, 420 220, 412 220 Z" fill="#ef4444" stroke="#991b1b" stroke-width="1.5"/>
    <rect x="404" y="214" width="14" height="5" rx="2" fill="#7f1d1d"/>
    <!-- kotak perkakas -->
    <rect x="516" y="228" width="30" height="16" rx="3" fill="#0e7490" stroke="#0b1220" stroke-width="1.5"/><rect x="525" y="223" width="12" height="6" rx="2" fill="none" stroke="#0b1220" stroke-width="2"/>
  </g>`;

const H_KABEL_AIR = `
  <g id="scene-kabel_air">
    <g class="hz-danger">
      <ellipse cx="96" cy="318" rx="64" ry="23" fill="#000" opacity=".3"/>
      <ellipse cx="96" cy="312" rx="62" ry="22" fill="url(#hzPuddle)" stroke="#38bdf8" stroke-width="1.5" stroke-opacity=".7"/>
      <path d="M62 306 Q80 301 98 305" stroke="#e0f2fe" stroke-width="2" fill="none" opacity=".7" stroke-linecap="round"/>
      <path d="M110 318 Q125 316 138 311" stroke="#e0f2fe" stroke-width="1.5" fill="none" opacity=".5" stroke-linecap="round"/>
      <ellipse cx="96" cy="312" rx="40" ry="13" fill="none" stroke="#bae6fd" stroke-width="1" opacity=".45"/>
      <!-- kabel dari dinding menuju genangan -->
      <path d="M40 252 C46 282, 70 304, 94 306" stroke="#0b1220" stroke-width="8" fill="none" stroke-linecap="round"/>
      <path d="M40 252 C46 282, 70 304, 94 306" stroke="#f97316" stroke-width="5.5" fill="none" stroke-linecap="round"/>
      <path d="M152 292 C134 308, 116 312, 102 308" stroke="#0b1220" stroke-width="8" fill="none" stroke-linecap="round"/>
      <path d="M152 292 C134 308, 116 312, 102 308" stroke="#f97316" stroke-width="5.5" fill="none" stroke-linecap="round"/>
      <!-- isolasi terkelupas: kawat tembaga terlihat -->
      <g stroke="url(#hzCopper)" stroke-width="2.2" stroke-linecap="round" fill="none">
        <path d="M92 306 Q96 300 100 307"/><path d="M93 308 Q97 313 101 307"/><path d="M91 304 L99 309"/>
      </g>
      <circle cx="97" cy="306" r="13" fill="url(#hzSpark)" filter="url(#hz-glow)"/>
      <path d="M97 306 L88 295 M97 306 L108 296 M97 306 L101 318 M97 306 L84 308 M97 306 L111 308" stroke="#fde047" stroke-width="2" stroke-linecap="round"/>
      <path d="M100 296 L94 306 L100 306 L95 318" stroke="#fffbeb" stroke-width="2" fill="none" stroke-linejoin="round"/>
      <!-- ujung kabel kiri: dari kotak sambung dinding -->
      <rect x="30" y="244" width="22" height="12" rx="2" fill="#e2e8f0" stroke="#475569" stroke-width="1.5"/>
    </g>
    <g class="hz-safe" style="opacity:0">
      <!-- lantai kering, kabel di dalam conduit sepanjang dinding menuju kotak sambung kedap air -->
      <rect x="26" y="238" width="26" height="18" rx="3" fill="#e2e8f0" stroke="#10b981" stroke-width="2"/>
      <circle cx="31" cy="243" r="1.6" fill="#64748b"/><circle cx="47" cy="243" r="1.6" fill="#64748b"/>
      <path d="M39 256 L39 258 Q39 266 47 266 L148 266" stroke="#0b1220" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M39 256 L39 258 Q39 266 47 266 L148 266" stroke="#e2e8f0" stroke-width="7.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M55 263 L146 263" stroke="#ffffff" stroke-width="1.5" opacity=".7" stroke-linecap="round"/>
      <g fill="#94a3b8" stroke="#0b1220" stroke-width="1"><rect x="68" y="260" width="6" height="12" rx="1.5"/><rect x="104" y="260" width="6" height="12" rx="1.5"/></g>
      <rect x="148" y="254" width="32" height="24" rx="4" fill="#e2e8f0" stroke="#10b981" stroke-width="2.2"/>
      <circle cx="153" cy="259" r="1.6" fill="#64748b"/><circle cx="175" cy="259" r="1.6" fill="#64748b"/><circle cx="153" cy="273" r="1.6" fill="#64748b"/><circle cx="175" cy="273" r="1.6" fill="#64748b"/>
      <text x="164" y="270" fill="#065f46" font-size="8" font-weight="900" text-anchor="middle">IP65</text>
    </g>
  </g>`;

const H_STOPKONTAK = `
  <g id="scene-stopkontak_overload">
    <g class="hz-danger">
      <ellipse cx="520" cy="140" rx="56" ry="58" fill="url(#hzHeat)"/>
      <!-- pelat stop kontak dinding, hangus di sekitar lubang -->
      <rect x="492" y="104" width="56" height="78" rx="7" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2"/>
      <circle cx="520" cy="122" r="12" fill="#cbd5e1" stroke="#94a3b8"/><circle cx="520" cy="122" r="9" fill="#475569"/>
      <ellipse cx="520" cy="112" rx="18" ry="8" fill="#78350f" opacity=".45"/>
      <rect x="494" y="168" width="52" height="12" rx="4" fill="#92400e" opacity=".35"/>
      <!-- adaptor cabang 4 lubang menancap pada lubang bawah -->
      <rect x="484" y="136" width="72" height="30" rx="7" fill="#e2e8f0" stroke="#f97316" stroke-width="2.5"/>
      <rect x="490" y="141" width="60" height="6" rx="3" fill="#cbd5e1"/>
      <!-- empat steker bertumpuk dan kabelnya -->
      <rect x="488" y="148" width="13" height="18" rx="3" fill="#ef4444" stroke="#7f1d1d"/><rect x="504" y="148" width="13" height="18" rx="3" fill="#3b82f6" stroke="#1e3a8a"/>
      <rect x="520" y="148" width="13" height="18" rx="3" fill="#22c55e" stroke="#14532d"/><rect x="536" y="148" width="13" height="18" rx="3" fill="#facc15" stroke="#854d0e"/>
      <g fill="none" stroke-linecap="round">
        <path d="M494 166 C488 184, 474 196, 480 214" stroke="#0b1220" stroke-width="6"/><path d="M494 166 C488 184, 474 196, 480 214" stroke="#ef4444" stroke-width="3.5"/>
        <path d="M510 166 C512 186, 518 200, 508 218" stroke="#0b1220" stroke-width="6"/><path d="M510 166 C512 186, 518 200, 508 218" stroke="#3b82f6" stroke-width="3.5"/>
        <path d="M527 166 C536 186, 548 198, 542 214" stroke="#0b1220" stroke-width="6"/><path d="M527 166 C536 186, 548 198, 542 214" stroke="#22c55e" stroke-width="3.5"/>
        <path d="M543 166 C562 182, 570 194, 562 208" stroke="#0b1220" stroke-width="6"/><path d="M543 166 C562 182, 570 194, 562 208" stroke="#facc15" stroke-width="3.5"/>
      </g>
      <!-- asap dan percikan panas -->
      <g fill="#94a3b8"><circle cx="518" cy="94" r="6" opacity=".5"/><circle cx="526" cy="82" r="8" opacity=".38"/><circle cx="519" cy="68" r="7" opacity=".26"/></g>
      <g stroke="#fb923c" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-dasharray="3 3"><path d="M494 130 Q488 116 494 104"/><path d="M552 130 Q558 116 552 104"/></g>
      <path d="M540 128 l-6 -9 l6 2 l-4 -8" stroke="#fde047" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <g class="hz-safe" style="opacity:0">
      <rect x="492" y="104" width="56" height="78" rx="7" fill="#f1f5f9" stroke="#10b981" stroke-width="2.2"/>
      <circle cx="520" cy="122" r="12" fill="#e2e8f0" stroke="#94a3b8"/><circle cx="515" cy="122" r="2.2" fill="#334155"/><circle cx="525" cy="122" r="2.2" fill="#334155"/>
      <!-- satu steker standar rapi pada lubang bawah -->
      <circle cx="520" cy="152" r="12" fill="#e2e8f0" stroke="#94a3b8"/>
      <rect x="509" y="140" width="22" height="26" rx="5" fill="#1e293b" stroke="#10b981" stroke-width="1.8"/>
      <path d="M520 166 C520 182, 518 196, 518 212" stroke="#0b1220" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M520 166 C520 182, 518 196, 518 212" stroke="#334155" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    </g>
  </g>`;

const H_KABEL_MENJUNTAI = `
  <g id="scene-kabel_menjuntai">
    <g class="hz-danger">
      <path d="M202 322 C240 292, 270 362, 312 326 C348 296, 388 332, 414 308" stroke="#000" stroke-width="8" fill="none" opacity=".35" transform="translate(2,5)" stroke-linecap="round"/>
      <path d="M202 322 C240 292, 270 362, 312 326 C348 296, 388 332, 414 308" stroke="#0b1220" stroke-width="8" fill="none" stroke-linecap="round"/>
      <path d="M202 322 C240 292, 270 362, 312 326 C348 296, 388 332, 414 308" stroke="#ef4444" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M202 322 C240 292, 270 362, 312 326 C348 296, 388 332, 414 308" stroke="#fecaca" stroke-width="1" fill="none" stroke-linecap="round" opacity=".6" transform="translate(0,-1.5)"/>
      <!-- steker di ujung kiri tertarik -->
      <rect x="190" y="314" width="16" height="16" rx="3" fill="#e2e8f0" stroke="#475569" stroke-width="1.5"/>
      <rect x="182" y="318" width="9" height="3" fill="#94a3b8"/><rect x="182" y="325" width="9" height="3" fill="#94a3b8"/>
      <!-- lakban perbaikan asal-asalan -->
      <rect x="296" y="318" width="22" height="10" rx="2" fill="#1e293b" stroke="#94a3b8" transform="rotate(-18 307 323)"/>
    </g>
    <g class="hz-safe" style="opacity:0">
      <!-- pelindung kabel lantai (cable protector) berstrip kuning-hitam -->
      <path d="M204 328 L212 304 L400 304 L408 328 Z" fill="url(#hzStripe)" stroke="#10b981" stroke-width="2" stroke-linejoin="round"/>
      <rect x="212" y="304" width="188" height="5" fill="#0b1220" opacity=".5"/>
      <rect x="190" y="314" width="16" height="16" rx="3" fill="#e2e8f0" stroke="#475569" stroke-width="1.5"/><rect x="182" y="318" width="9" height="3" fill="#94a3b8"/><rect x="182" y="325" width="9" height="3" fill="#94a3b8"/>
      <path d="M206 322 L204 322" stroke="#1e293b" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M408 322 L424 322" stroke="#1e293b" stroke-width="4.5" stroke-linecap="round"/>
    </g>
  </g>`;

const H_PANEL = `
  <g id="scene-panel_terbuka">
    <g class="hz-danger">
      <!-- badan lemari panel -->
      <rect x="206" y="36" width="132" height="166" rx="5" fill="url(#hzMetal)" stroke="#0b1220" stroke-width="2"/>
      <rect x="214" y="44" width="116" height="150" rx="3" fill="#0b1220"/>
      <!-- busbar R S T N telanjang (tanpa penutup) -->
      <g stroke="#0b1220" stroke-width="1">
        <rect x="234" y="52" width="80" height="8" fill="#ef4444"/><rect x="234" y="64" width="80" height="8" fill="#facc15"/>
        <rect x="234" y="76" width="80" height="8" fill="#1f2937" stroke="#94a3b8"/><rect x="234" y="88" width="80" height="8" fill="#38bdf8"/>
      </g>
      <g fill="url(#hzCopper)"><rect x="229" y="51" width="8" height="10"/><rect x="311" y="51" width="8" height="10"/><rect x="229" y="63" width="8" height="10"/><rect x="311" y="63" width="8" height="10"/>
        <rect x="229" y="75" width="8" height="10"/><rect x="311" y="75" width="8" height="10"/><rect x="229" y="87" width="8" height="10"/><rect x="311" y="87" width="8" height="10"/></g>
      <g font-size="7" font-weight="800" text-anchor="middle"><text x="222" y="59" fill="#ef4444">R</text><text x="222" y="71" fill="#facc15">S</text><text x="222" y="83" fill="#cbd5e1">T</text><text x="222" y="95" fill="#38bdf8">N</text></g>
      <!-- stiker bahaya -->
      <path d="M283 104 L296 128 L270 128 Z" fill="#facc15" stroke="#854d0e" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M284 110 L280 119 L285 119 L282 126" stroke="#0f172a" stroke-width="2" fill="none" stroke-linejoin="round"/>
      <text x="283" y="140" fill="#ef4444" font-size="8" font-weight="900" text-anchor="middle">AWAS 380V</text>
      <!-- MCB pada rel DIN -->
      <rect x="218" y="150" width="104" height="3" fill="#94a3b8"/>
      <g stroke="#0b1220" stroke-width="1">
        <rect x="222" y="152" width="14" height="32" rx="2" fill="#e2e8f0"/><rect x="240" y="152" width="14" height="32" rx="2" fill="#e2e8f0"/>
        <rect x="258" y="152" width="14" height="32" rx="2" fill="#e2e8f0"/><rect x="276" y="152" width="14" height="32" rx="2" fill="#e2e8f0"/><rect x="294" y="152" width="14" height="32" rx="2" fill="#e2e8f0"/>
      </g>
      <g fill="#1f2937"><rect x="225" y="156" width="8" height="10" rx="1"/><rect x="243" y="156" width="8" height="10" rx="1"/><rect x="261" y="156" width="8" height="10" rx="1"/><rect x="279" y="156" width="8" height="10" rx="1"/><rect x="297" y="156" width="8" height="10" rx="1"/></g>
      <!-- pintu panel terbuka (engsel di kiri) -->
      <polygon points="206,36 162,50 162,190 206,202" fill="#475569" stroke="#0b1220" stroke-width="2"/>
      <polygon points="200,46 170,56 170,184 200,194" fill="#64748b"/>
      <rect x="171" y="108" width="6" height="22" rx="2" fill="#0f172a"/>
      <path d="M185 92 L192 104 L178 104 Z" fill="#facc15" stroke="#854d0e" stroke-width="1" transform="translate(0,6)"/>
      <!-- percikan pada busbar -->
      <circle cx="316" cy="84" r="12" fill="url(#hzSpark)" filter="url(#hz-glow)"/>
      <path d="M316 78 L311 85 L317 85 L312 93" stroke="#fffbeb" stroke-width="2" fill="none" stroke-linejoin="round"/>
    </g>
    <g class="hz-safe" style="opacity:0">
      <rect x="206" y="36" width="132" height="166" rx="5" fill="url(#hzMetal)" stroke="#10b981" stroke-width="2.5"/>
      <rect x="214" y="44" width="116" height="150" rx="3" fill="#64748b" stroke="#475569"/>
      <rect x="318" y="108" width="8" height="22" rx="2" fill="#0f172a"/><circle cx="322" cy="140" r="3" fill="#facc15"/>
      <path d="M272 70 L292 108 L252 108 Z" fill="#facc15" stroke="#854d0e" stroke-width="2" stroke-linejoin="round"/>
      <path d="M273 80 L267 95 L274 95 L270 106" stroke="#0f172a" stroke-width="2.5" fill="none" stroke-linejoin="round"/>
      <text x="272" y="124" fill="#e2e8f0" font-size="7.5" font-weight="900" text-anchor="middle">BAHAYA</text><text x="272" y="134" fill="#e2e8f0" font-size="7.5" font-weight="900" text-anchor="middle">TEGANGAN TINGGI</text>
      <rect x="236" y="146" width="72" height="16" rx="3" fill="#052e16" stroke="#10b981"/>
      <text x="272" y="157" fill="#6ee7b7" font-size="8" font-weight="900" text-anchor="middle">TERKUNCI (LOTO)</text>
      <path d="M312 170 v-10 a5 5 0 0 1 10 0 v10" stroke="#facc15" stroke-width="2.2" fill="none"/><rect x="309" y="168" width="16" height="12" rx="2" fill="#facc15" stroke="#854d0e"/>
    </g>
  </g>`;

const H_SAMBUNGAN = `
  <g id="scene-sambungan_terbuka">
    <g class="hz-danger">
      <ellipse cx="447" cy="238" rx="46" ry="5" fill="#000" opacity=".3"/>
      <!-- kabel masuk dan keluar -->
      <path d="M388 232 L428 228" stroke="#0b1220" stroke-width="8" stroke-linecap="round"/><path d="M388 232 L428 228" stroke="#f97316" stroke-width="5.5" stroke-linecap="round"/>
      <path d="M466 224 L512 220" stroke="#0b1220" stroke-width="8" stroke-linecap="round"/><path d="M466 224 L512 220" stroke="#f97316" stroke-width="5.5" stroke-linecap="round"/>
      <!-- kawat tembaga dipilin telanjang -->
      <g stroke="url(#hzCopper)" stroke-width="3" stroke-linecap="round" fill="none">
        <path d="M426 228 Q436 221 446 227 Q456 233 468 224"/><path d="M426 227 Q436 233 446 226 Q456 219 468 225"/>
      </g>
      <g stroke="#fbbf24" stroke-width="1.6" stroke-linecap="round"><path d="M436 222 l-4 -8"/><path d="M452 220 l4 -9"/><path d="M458 232 l6 6"/></g>
      <!-- lakban hitam terlepas menjuntai -->
      <path d="M422 224 Q424 236 418 246 Q414 252 420 254" stroke="#1f2937" stroke-width="5" fill="none" stroke-linecap="round"/>
      <rect x="418" y="222" width="10" height="12" rx="2" fill="#1f2937" stroke="#64748b" transform="rotate(-10 423 228)"/>
      <circle cx="447" cy="226" r="9" fill="url(#hzSpark)" opacity=".75" filter="url(#hz-glow)"/>
    </g>
    <g class="hz-safe" style="opacity:0">
      <path d="M388 232 L422 228" stroke="#0b1220" stroke-width="8" stroke-linecap="round"/><path d="M388 232 L422 228" stroke="#334155" stroke-width="5.5" stroke-linecap="round"/>
      <path d="M472 226 L512 222" stroke="#0b1220" stroke-width="8" stroke-linecap="round"/><path d="M472 226 L512 222" stroke="#334155" stroke-width="5.5" stroke-linecap="round"/>
      <!-- kotak sambung (T-Dos) tertutup -->
      <rect x="420" y="212" width="52" height="30" rx="5" fill="#e2e8f0" stroke="#10b981" stroke-width="2.2"/>
      <circle cx="426" cy="218" r="2" fill="#64748b"/><circle cx="466" cy="218" r="2" fill="#64748b"/><circle cx="426" cy="236" r="2" fill="#64748b"/><circle cx="466" cy="236" r="2" fill="#64748b"/>
      <text x="446" y="231" fill="#065f46" font-size="9" font-weight="900" text-anchor="middle">T-DOS</text>
    </g>
  </g>`;

const H_PEKERJA = `
  <g id="scene-pekerja_tanpa_apd">
    <g class="hz-danger">
      <ellipse cx="96" cy="244" rx="30" ry="5" fill="#000" opacity=".4"/>
      <!-- kaki telanjang dan sandal jepit -->
      <g stroke="#0b1220" stroke-width="1.2">
        <rect x="82" y="196" width="12" height="40" rx="5" fill="#f1c9a0"/><rect x="100" y="196" width="12" height="40" rx="5" fill="#f1c9a0"/>
        <rect x="78" y="234" width="22" height="7" rx="3" fill="#3b82f6"/><rect x="98" y="234" width="22" height="7" rx="3" fill="#3b82f6"/>
      </g>
      <path d="M86 234 L90 226 M94 234 L90 226 M104 234 L108 226 M112 234 L108 226" stroke="#1e3a8a" stroke-width="1.6"/>
      <!-- celana pendek -->
      <path d="M78 172 L114 172 L117 200 L100 200 L96 188 L92 200 L76 200 Z" fill="#64748b" stroke="#0b1220" stroke-width="1.2"/>
      <!-- kaos merah lengan pendek -->
      <path d="M78 120 Q96 114 114 120 L118 172 L76 172 Z" fill="#dc2626" stroke="#0b1220" stroke-width="1.2"/>
      <path d="M86 118 Q96 126 106 118" stroke="#7f1d1d" stroke-width="2" fill="none"/>
      <!-- lengan kanan menjulur ke panel (telanjang) -->
      <path d="M112 124 C124 126, 134 124, 146 120" stroke="#0b1220" stroke-width="12" fill="none" stroke-linecap="round"/>
      <path d="M112 124 C124 126, 134 124, 146 120" stroke="#f1c9a0" stroke-width="9.5" fill="none" stroke-linecap="round"/>
      <circle cx="150" cy="119" r="6.5" fill="#f1c9a0" stroke="#0b1220" stroke-width="1.2"/>
      <path d="M154 114 l6 -2 M155 119 l7 0 M154 124 l6 3" stroke="#f1c9a0" stroke-width="2.4" stroke-linecap="round"/>
      <!-- lengan kiri menggantung -->
      <path d="M80 124 C72 140, 70 152, 74 164" stroke="#0b1220" stroke-width="12" fill="none" stroke-linecap="round"/>
      <path d="M80 124 C72 140, 70 152, 74 164" stroke="#f1c9a0" stroke-width="9.5" fill="none" stroke-linecap="round"/>
      <circle cx="74" cy="168" r="5.5" fill="#f1c9a0" stroke="#0b1220" stroke-width="1.2"/>
      <!-- kepala tanpa helm -->
      <rect x="91" y="108" width="10" height="12" fill="#e5b98d"/>
      <circle cx="97" cy="96" r="15" fill="#f1c9a0" stroke="#0b1220" stroke-width="1.2"/>
      <path d="M83 94 C82 78, 112 78, 111 94 C106 88, 92 88, 83 94 Z" fill="#1f2937"/>
      <circle cx="103" cy="97" r="1.8" fill="#0b1220"/><path d="M103 104 Q107 106 110 103" stroke="#7f1d1d" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <!-- keringat/basah di tangan dan kening -->
      <path d="M144 130 q-3 5 0 8 q3 -3 0 -8 Z M156 132 q-3 5 0 8 q3 -3 0 -8 Z" fill="#38bdf8"/>
      <path d="M110 86 q-3 5 0 8 q3 -3 0 -8 Z" fill="#38bdf8"/>
      <!-- percikan ketika tangan menyentuh pintu panel -->
      <circle cx="162" cy="119" r="11" fill="url(#hzSpark)" filter="url(#hz-glow)"/>
      <path d="M162 111 L157 120 L163 120 L158 129" stroke="#fffbeb" stroke-width="2" fill="none" stroke-linejoin="round"/>
    </g>
    <g class="hz-safe" style="opacity:0">
      <ellipse cx="96" cy="244" rx="30" ry="5" fill="#000" opacity=".4"/>
      <!-- sepatu safety sol karet -->
      <rect x="82" y="196" width="12" height="38" rx="5" fill="#1e3a8a" stroke="#0b1220" stroke-width="1.2"/><rect x="100" y="196" width="12" height="38" rx="5" fill="#1e3a8a" stroke="#0b1220" stroke-width="1.2"/>
      <path d="M78 232 L96 232 L98 244 L76 244 Z" fill="#a16207" stroke="#0b1220" stroke-width="1.2"/><path d="M98 232 L116 232 L118 244 L96 244 Z" fill="#a16207" stroke="#0b1220" stroke-width="1.2"/>
      <rect x="76" y="241" width="22" height="3" fill="#10b981"/><rect x="96" y="241" width="22" height="3" fill="#10b981"/>
      <!-- baju kerja biru lengan panjang -->
      <path d="M78 172 L114 172 L117 200 L76 200 Z" fill="#1e3a8a" stroke="#0b1220" stroke-width="1.2"/>
      <path d="M78 120 Q96 114 114 120 L118 172 L76 172 Z" fill="#2563eb" stroke="#0b1220" stroke-width="1.2"/>
      <rect x="92" y="130" width="10" height="3" fill="#facc15" opacity=".9"/><rect x="82" y="150" width="30" height="3" fill="#facc15" opacity=".9"/>
      <path d="M112 124 C124 126, 134 124, 146 120" stroke="#0b1220" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M112 124 C124 126, 134 124, 146 120" stroke="#2563eb" stroke-width="9.5" fill="none" stroke-linecap="round"/>
      <path d="M80 124 C72 140, 70 152, 74 164" stroke="#0b1220" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M80 124 C72 140, 70 152, 74 164" stroke="#2563eb" stroke-width="9.5" fill="none" stroke-linecap="round"/>
      <!-- sarung tangan isolasi merah -->
      <path d="M144 114 L162 112 L164 128 L144 128 Z" fill="#ef4444" stroke="#7f1d1d" stroke-width="1.5" stroke-linejoin="round"/><rect x="140" y="112" width="8" height="18" rx="2" fill="#7f1d1d"/>
      <circle cx="74" cy="168" r="6.5" fill="#ef4444" stroke="#7f1d1d" stroke-width="1.5"/>
      <!-- kepala berhelm dan kacamata -->
      <rect x="91" y="108" width="10" height="12" fill="#e5b98d"/>
      <circle cx="97" cy="96" r="15" fill="#f1c9a0" stroke="#0b1220" stroke-width="1.2"/>
      <path d="M80 94 C78 70, 116 70, 114 94 Z" fill="#facc15" stroke="#b45309" stroke-width="1.8"/><rect x="76" y="92" width="42" height="5" rx="2.5" fill="#f59e0b" stroke="#b45309"/>
      <rect x="95" y="94" width="16" height="8" rx="3" fill="#bae6fd" opacity=".75" stroke="#0b1220"/><circle cx="103" cy="105" r="1" fill="none"/>
      <path d="M104 110 Q107 112 110 109" stroke="#7f1d1d" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    </g>
  </g>`;

export const HAZARD_SCENE_SVG = DEFS + BACKGROUND + H_PEKERJA + H_PANEL + H_KABEL_AIR + H_KABEL_MENJUNTAI + H_SAMBUNGAN + H_STOPKONTAK;
