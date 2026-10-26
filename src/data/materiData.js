// Data Materi Virtual Laboratory Instalasi Penerangan Listrik
// SMK Kelas XI TITL

import { resolveAssetUrl } from './realisticAssets.js';

export const materiData = {

  k3lh: {
    id: "k3lh",
    title: "K3LH Kelistrikan",
    icon: "bi-shield-check",
    sections: [
      {
        subtitle: "Prinsip Keselamatan Kerja Kelistrikan",
        gridItems: [
          {
            name: "Pengertian dan Tujuan K3LH",
            desc: "Upaya perlindungan agar tenaga kerja dan sumber energi listrik dapat digunakan secara aman.",
            symbol: "bi-book-fill",
            detailId: "k3lh_pengertian",
            detail: {
              content: "K3LH (Keselamatan, Kesehatan Kerja, dan Lingkungan Hidup) dalam kelistrikan adalah suatu upaya perlindungan untuk menjamin agar setiap tenaga kerja/siswa dan orang lain di tempat kerja selalu dalam keadaan selamat dan sehat, serta agar setiap sumber produksi (energi listrik) dapat digunakan secara aman dan efisien. Tujuan utamanya adalah mencegah kecelakaan kerja akibat sengatan listrik, kebakaran akibat hubung singkat, serta penyakit akibat kerja.",
              sections: [
                {
                  heading: "Tiga Unsur K3LH",
                  icon: "bi-diagram-3-fill",
                  paragraphs: [
                    "K3LH terdiri atas tiga unsur yang saling melengkapi. Jika salah satu diabaikan, pekerjaan listrik menjadi tidak aman, tidak sehat, atau merugikan lingkungan."
                  ],
                  figure: { src: "src/assets/images/k3lh/k3lh-tiga-pilar.svg", alt: "Infografik tiga pilar K3LH: keselamatan kerja, kesehatan kerja, dan lingkungan hidup", caption: "Gambar 1. Tiga pilar K3LH.", width: 720, height: 380 },
                  items: [
                    "<strong>Keselamatan Kerja</strong>: upaya mencegah kecelakaan di tempat kerja, misalnya sengatan listrik, hubung singkat, dan kebakaran akibat instalasi.",
                    "<strong>Kesehatan Kerja</strong>: upaya menjaga tubuh pekerja tetap sehat, misalnya dengan posisi kerja yang benar, ruang kerja berventilasi, dan menjaga diri dari debu serta kebisingan alat.",
                    "<strong>Lingkungan Hidup</strong>: upaya menjaga lingkungan sekitar, misalnya membuang sisa kabel, lampu bekas, dan baterai pada tempat yang tepat serta tidak membakar sisa isolasi."
                  ]
                },
                {
                  heading: "Tujuan K3LH",
                  icon: "bi-bullseye",
                  paragraphs: ["Penerapan K3LH dalam pekerjaan kelistrikan bertujuan untuk:"],
                  items: [
                    "Melindungi keselamatan dan kesehatan tenaga kerja atau siswa saat praktik.",
                    "Mencegah kecelakaan kerja, hubung singkat, dan kebakaran akibat listrik.",
                    "Menjaga alat, bahan, dan hasil pekerjaan agar tidak rusak.",
                    "Menciptakan tempat kerja yang aman, nyaman, dan tertib.",
                    "Meningkatkan efisiensi dan produktivitas kerja karena pekerjaan berjalan tanpa gangguan.",
                    "Menjaga kelestarian lingkungan di sekitar tempat kerja."
                  ]
                },
                {
                  heading: "Mengapa K3LH Penting dalam Pekerjaan Listrik?",
                  icon: "bi-lightning-charge-fill",
                  paragraphs: [
                    "Listrik tidak terlihat, tidak berbau, dan tidak bersuara, sehingga bahayanya sering baru disadari setelah terjadi kecelakaan. Arus yang sangat kecil pun dapat membahayakan tubuh, sedangkan kabel yang longgar atau beban berlebih dapat memicu panas dan api.",
                    "Karena itu, K3LH bukan sekadar aturan, tetapi kebiasaan kerja. Kebiasaan yang benar sejak praktik di sekolah akan terbawa ke dunia kerja."
                  ],
                  callout: { title: "Ingat", text: "Anggap setiap penghantar bertegangan sampai terbukti tidak bertegangan dengan memeriksanya memakai tespen atau alat ukur." }
                },
                {
                  heading: "Penyebab Kecelakaan Kerja",
                  icon: "bi-exclamation-triangle-fill",
                  paragraphs: [
                    "Kecelakaan jarang disebabkan oleh satu hal saja. Biasanya ada tindakan tidak aman dari pekerja yang bertemu dengan kondisi tidak aman di tempat kerja. Dengan mengenali keduanya, kecelakaan dapat dicegah sebelum terjadi."
                  ],
                  figure: { src: "src/assets/images/k3lh/k3lh-penyebab-kecelakaan.svg", alt: "Bagan tindakan tidak aman dan kondisi tidak aman yang menyebabkan kecelakaan kerja listrik", caption: "Gambar 2. Tindakan tidak aman dan kondisi tidak aman penyebab kecelakaan.", width: 720, height: 400 }
                },
                {
                  heading: "Hierarki Pengendalian Bahaya",
                  icon: "bi-layers-fill",
                  paragraphs: [
                    "Untuk mengurangi risiko, bahaya dikendalikan secara bertingkat. Pengendalian yang paling atas paling efektif karena menghilangkan sumber bahayanya, sedangkan Alat Pelindung Diri (APD) adalah pertahanan terakhir saat tingkat lain belum cukup."
                  ],
                  figure: { src: "src/assets/images/k3lh/k3lh-hierarki-pengendalian.svg", alt: "Piramida terbalik lima tingkat pengendalian bahaya dari eliminasi sampai APD dengan contoh pekerjaan listrik", caption: "Gambar 3. Hierarki pengendalian bahaya beserta contoh pada pekerjaan listrik.", width: 720, height: 440 }
                },
                {
                  heading: "Dasar Hukum dan Standar",
                  icon: "bi-journal-bookmark-fill",
                  paragraphs: ["Penerapan K3LH di Indonesia memiliki dasar hukum dan standar, antara lain:"],
                  items: [
                    "Undang-Undang Nomor 1 Tahun 1970 tentang Keselamatan Kerja.",
                    "Undang-Undang Nomor 13 Tahun 2003 tentang Ketenagakerjaan (mengatur kewajiban penerapan K3 di tempat kerja).",
                    "Peraturan Pemerintah Nomor 50 Tahun 2012 tentang Penerapan Sistem Manajemen K3 (SMK3).",
                    "Peraturan Menteri Tenaga Kerja Nomor 12 Tahun 2015 tentang Keselamatan dan Kesehatan Kerja Listrik di Tempat Kerja.",
                    "Undang-Undang Nomor 32 Tahun 2009 tentang Perlindungan dan Pengelolaan Lingkungan Hidup.",
                    "Persyaratan Umum Instalasi Listrik (PUIL, SNI 0225) sebagai acuan pemasangan instalasi listrik."
                  ]
                },
                {
                  heading: "Rangkuman dan Refleksi",
                  icon: "bi-check2-circle",
                  items: [
                    "K3LH meliputi keselamatan kerja, kesehatan kerja, dan lingkungan hidup.",
                    "Kecelakaan dicegah dengan mengenali tindakan dan kondisi tidak aman.",
                    "Gunakan pengendalian bertingkat: kerja tanpa tegangan lebih dulu, APD sebagai pertahanan terakhir.",
                    "Lanjutkan ke materi berikutnya: APD, SOP Kerja Aman, Bahaya-Bahaya Listrik, P3K Sengatan Listrik, dan Rambu Keselamatan."
                  ],
                  callout: { title: "Ayo Renungkan", text: "1) Kebiasaan apa di bengkel atau di rumah yang menurutmu masih tidak aman? 2) Kondisi tidak aman apa yang bisa kamu perbaiki hari ini? 3) Mengapa bekerja tanpa tegangan lebih baik daripada hanya memakai sarung tangan?" }
                }
              ]
            }
          },
          {
            name: "Alat Pelindung Diri (APD) Kelistrikan",
            desc: "APD wajib: sarung tangan isolasi, sepatu safety, kacamata pelindung, dan helm.",
            symbol: "bi-eyeglasses",
            detailId: "k3lh_apd",
            detail: {
              content: "Dalam praktikum atau pekerjaan listrik, wajib mengenakan APD standar berikut:",
              items: [
                "<strong>Sarung Tangan Isolasi (Insulated Gloves)</strong>: Melindungi tangan dari sentuhan langsung dengan bagian bertegangan. Harus terbuat dari karet khusus dengan rating tegangan yang sesuai.",
                "<strong>Sepatu Safety (Safety Shoes)</strong>: Memiliki sol karet tebal tanpa bahan logam konduktif untuk memutus aliran listrik ke bumi (isolasi diri).",
                "<strong>Kacamata Pelindung (Safety Goggles)</strong>: Melindungi mata dari percikan bunga api listrik atau pecahan material saat pengeboran/pemotongan.",
                "<strong>Helm Pelindung (Safety Helmet)</strong>: Melindungi kepala dari benturan benda keras atau kontak dengan kabel di atas kepala."
              ],
              hasInteractiveMechanism: true
            }
          },
          {
            name: "SOP Kerja Aman",
            desc: "Prosedur keselamatan sebelum, saat, dan sesudah bekerja dengan instalasi listrik.",
            symbol: "bi-clipboard-check",
            detailId: "k3lh_sop",
            detail: {
              content: "Prosedur keselamatan dibagi menjadi tiga tahap penting:",
              items: [
                "<strong>Sebelum Bekerja</strong>: Pastikan sumber tegangan utama (PHB/MCB Pusat) dalam keadaan OFF dan dipasang LOTO (Lockout/Tagout). Gunakan tespen untuk memastikan tidak ada tegangan sisa. Siapkan alat kerja terisolasi standar.",
                "<strong>Saat Bekerja</strong>: Gunakan APD lengkap. Jangan bekerja di area yang basah/lembab. Hindari menyentuh dua konduktor yang berbeda potensi secara bersamaan. Lakukan perakitan tanpa tegangan.",
                "<strong>Setelah Bekerja</strong>: Periksa kembali kerapian sambungan. Pastikan tidak ada kabel mengambang. Bersihkan area kerja dari serpihan tembaga. Mintalah guru/instruktur memeriksa sebelum menyalakan MCB utama."
              ],
              hasInteractiveMechanism: true
            }
          },
          {
            name: "Bahaya-Bahaya Listrik",
            desc: "Sengatan listrik, hubung singkat, dan kebakaran akibat listrik.",
            symbol: "bi-exclamation-triangle-fill",
            detailId: "k3lh_bahaya",
            detail: {
              content: "Energi listrik memiliki bahaya yang tidak terlihat namun mematikan:",
              items: [
                "<strong>Sengatan Listrik (Electric Shock)</strong>: Terjadi ketika arus listrik mengalir melewati tubuh manusia menuju bumi (shock hazard). Dapat menyebabkan henti jantung dan luka bakar serius.",
                "<strong>Hubung Singkat (Short Circuit / Korsleting)</strong>: Bertemunya konduktor fasa dan netral/ground secara langsung tanpa hambatan (beban). Menyebabkan arus melonjak sangat tinggi seketika, menimbulkan percikan api dan potensi kebakaran.",
                "<strong>Kebakaran Akibat Listrik</strong>: Disebabkan oleh pembebanan lebih (overload), sambungan kabel yang longgar (menimbulkan panas/busur api), atau korsleting."
              ],
              hasInteractiveMechanism: true
            }
          },
          {
            name: "Prosedur P3K Sengatan Listrik",
            desc: "Langkah penyelamatan jika terjadi kecelakaan sengatan listrik.",
            symbol: "bi-heart-pulse-fill",
            detailId: "k3lh_p3k",
            detail: {
              content: "Jika terjadi kecelakaan sengatan listrik, lakukan tindakan penyelamatan berikut secara tenang:",
              items: [
                "<strong>Putuskan Aliran Listrik</strong>: Matikan MCB utama segera. Jika tidak memungkinkan, pisahkan korban dari konduktor menggunakan benda non-konduktor (kayu kering, plastik, kain tebal). Jangan menyentuh korban langsung dengan tangan telanjang!",
                "<strong>Panggil Bantuan</strong>: Segera hubungi medis atau guru pendamping.",
                "<strong>Periksa Kesadaran & Pernapasan</strong>: Jika korban tidak bernapas, lakukan RJP (Resusitasi Jantung Paru) atau CPR jika Anda terlatih.",
                "<strong>Amankan Luka Bakar</strong>: Tutup luka bakar akibat sengatan dengan kain bersih steril, jangan gunakan minyak atau salep sembarangan."
              ],
              hasInteractiveMechanism: true
            }
          },
          {
            name: "Rambu Keselamatan Kelistrikan",
            desc: "3 jenis rambu K3: Peringatan (kuning), Larangan (merah), Wajib (biru).",
            symbol: "bi-cone-striped",
            detailId: "k3lh_rambu",
            detail: {
              content: "Rambu K3 dikategorikan menjadi 3 jenis:",
              items: [
                "<strong>Rambu Peringatan (Kuning, Segitiga)</strong>: Contoh: Gambar petir (Awas Tegangan Tinggi), memperingatkan bahaya sengatan listrik.",
                "<strong>Rambu Larangan (Merah, Lingkaran dengan Garis Diagonal)</strong>: Contoh: Dilarang Menyalakan Sakelar (sedang ada perbaikan).",
                "<strong>Rambu Wajib / Perintah (Biru, Lingkaran)</strong>: Contoh: Gunakan Sarung Tangan Isolasi, menunjukkan APD wajib dipakai."
              ],
              hasInteractiveMechanism: true
            }
          }
        ]
      }
    ]
  },
  
  alat: {
    id: "alat",
    title: "Alat dan Bahan Kerja IPL",
    icon: "bi-tools",
    sections: [
      {
        subtitle: "Daftar Alat dan Bahan Kerja Praktik & Fungsinya",
        content: "Berikut adalah alat-alat tangan dan bahan yang digunakan siswa TITL untuk melakukan instalasi penerangan:",
        gridItems: [
          {
            name: "Tang Kombinasi",
            desc: "Alat serbaguna untuk memotong kabel, memegang konduktor, memuntir kabel saat penyambungan ekor babi (pig-tail), dan membengkokkan kawat tembaga.",
            symbol: "bi-scissors",
            imagePath: resolveAssetUrl("src/assets/images/tools/tang-kombinasi.jpg"),
            detailId: "alat_tang_kombinasi",
            detail: {
              content: "Tersedia dalam ukuran 6-8 inci dengan rahang bergerigi untuk menjepit dan permukaan pemotong di bagian dalam rahang. Umumnya berbahan chrome vanadium steel agar tahan lama. Untuk pekerjaan kelistrikan, pilih yang gagangnya berlapis isolasi karet dengan rating hingga 1000V demi keamanan."
            }
          },
          {
            name: "Tang Potong (Cutting Plier)",
            desc: "Memiliki mata pisau tajam khusus untuk memotong kabel tembaga berdiameter kecil hingga sedang atau memotong isolasi luar kabel.",
            symbol: "bi-scissors",
            imagePath: resolveAssetUrl("src/assets/images/tools/tang-potong.jpg"),
            detailId: "alat_tang_potong",
            detail: {
              content: "Memiliki mata pisau yang lebih tajam dan keras khusus untuk memotong, BUKAN untuk menjepit. Hanya digunakan untuk memotong kabel tembaga/aluminium — jangan dipakai memotong kawat baja/besi karena bisa merusak/menumpulkan mata pisaunya."
            }
          },
          {
            name: "Tang Pengupas Kabel (Wire Stripper)",
            desc: "Digunakan untuk mengupas jaket isolasi kabel tembaga (seperti NYA atau NYM) tanpa merusak atau melukai inti konduktor tembaganya.",
            symbol: "bi-gear-fill",
            imagePath: resolveAssetUrl("src/assets/images/tools/wire-stripper.jpg"),
            detailId: "alat_wire_stripper",
            detail: {
              content: "Memiliki beberapa lubang bergradasi ukuran sesuai diameter kabel (AWG/mm²) untuk mengupas isolasi tanpa melukai inti tembaga di dalamnya. Ada juga jenis otomatis (self-adjusting) yang menyesuaikan ukuran kabel secara otomatis. Teknik yang benar: kupas dengan sekali tarik lurus, jangan memutar berlebihan agar inti kabel tidak tergores."
            }
          },
          {
            name: "Obeng Plus (+) dan Minus (-)",
            desc: "Digunakan untuk mengencangkan sekrup pada terminal MCB, saklar, fitting, stop kontak, maupun sekrup pengikat pipa conduit.",
            symbol: "bi-wrench",
            imagePath: resolveAssetUrl("src/assets/images/tools/obeng.jpg"),
            detailId: "alat_obeng",
            detail: {
              content: "Tersedia berbagai ukuran mata obeng menyesuaikan ukuran kepala sekrup. Untuk pekerjaan kelistrikan, gunakan obeng dengan gagang berisolasi (rating hingga 1000V). Beberapa jenis memiliki ujung magnetis untuk memudahkan memegang sekrup saat memasang di tempat sempit."
            }
          },
          {
            name: "Tespen (Test Pen)",
            desc: "Obeng kecil dengan lampu neon indikator di dalamnya. Digunakan untuk memeriksa apakah suatu konduktor listrik mengandung tegangan fasa.",
            symbol: "bi-pen-fill",
            imagePath: resolveAssetUrl("src/assets/images/tools/tespen.jpg"),
            detailId: "alat_tespen",
            detail: {
              content: "Berbentuk seperti obeng dengan lampu neon kecil di dalamnya yang akan menyala jika ujungnya menyentuh titik yang bertegangan (fasa). Bekerja berdasarkan prinsip kopling kapasitif melalui tubuh pengguna ke bumi (ground). PENTING: tespen bukan alat ukur yang 100% pasti akurat — sebaiknya dikombinasikan dengan multimeter untuk memastikan benar-benar tidak ada tegangan sebelum bekerja."
            }
          },
          {
            name: "Multimeter / AVO Meter",
            desc: "Alat ukur listrik serbaguna untuk menguji kontinuitas kabel (tidak putus), mengukur tegangan AC 220V/380V, arus, maupun tahanan isolator.",
            symbol: "bi-speedometer2",
            imagePath: resolveAssetUrl("src/assets/images/tools/multimeter.jpg"),
            detailId: "alat_multimeter",
            detail: {
              content: "Alat ukur serbaguna untuk mengukur Ampere (arus), Volt (tegangan), dan Ohm (tahanan/kontinuitas). Tersedia jenis analog (jarum) dan digital (angka). Fungsi kontinuitas berguna memeriksa apakah kabel putus di tengah jalur tanpa harus dibongkar. Posisi selector harus disesuaikan dengan jenis pengukuran (AC/DC, V/A/Ω) sebelum digunakan."
            }
          },
          {
            name: "Palu (Hammer)",
            desc: "Digunakan untuk memaku klem kabel (klem PVC) pada dinding kayu/bata atau memasang dynabolt/fischer panel PHB.",
            symbol: "bi-hammer",
            imagePath: resolveAssetUrl("src/assets/images/tools/palu.jpg"),
            detailId: "alat_palu",
            detail: {
              content: "Jenis palu cakar (claw hammer) paling umum digunakan untuk memasang paku beton dan pekerjaan perakitan ringan. Untuk pekerjaan kelistrikan, palu berukuran ringan (100-300 gram) sudah cukup, tidak perlu palu besar seperti untuk konstruksi bangunan."
            }
          },
          {
            name: "Bor Listrik / Bor Tangan",
            desc: "Digunakan untuk membuat lubang pada dinding atau kayu guna memasang kotak saklar (in-bow doos) dan panel hubung bagi.",
            symbol: "bi-lightning-charge-fill",
            imagePath: resolveAssetUrl("src/assets/images/tools/bor-listrik.jpg"),
            detailId: "alat_bor",
            detail: {
              content: "Digunakan untuk membuat lubang pada tembok/beton sebagai tempat memasang fischer atau klem. Wajib menggunakan mata bor khusus beton (masonry bit), berbeda dari mata bor untuk kayu/besi. Kecepatan putar (RPM) disesuaikan dengan kekerasan material yang dibor."
            }
          },
          {
            name: "Cutter / Pisau Kabel",
            desc: "Mengupas isolasi luar kabel NYM (selubung PVC putih) secara membujur dengan aman tanpa memotong inti kabel fasa/netral.",
            symbol: "bi-slash-lg",
            imagePath: resolveAssetUrl("src/assets/images/tools/cutter.jpg"),
            detailId: "alat_cutter",
            detail: {
              content: "Digunakan untuk mengupas selubung/jaket luar kabel NYM (yang membungkus beberapa inti kabel sekaligus) sebelum inti kabel di dalamnya dikupas satu per satu menggunakan wire stripper. Perlu kehati-hatian agar tidak melukai isolasi inti kabel di dalamnya."
            }
          },
          {
            name: "Meteran / Alat Ukur",
            desc: "Mengukur panjang bentangan pipa conduit, kabel, serta menentukan jarak ketinggian sakelar (1.5m dari lantai) dan stop kontak.",
            symbol: "bi-rulers",
            imagePath: resolveAssetUrl("src/assets/images/tools/meteran.jpg"),
            detailId: "alat_meteran",
            detail: {
              content: "Digunakan mengukur panjang bentangan pipa conduit dan kabel, serta menentukan jarak ketinggian standar pemasangan komponen sesuai kebiasaan instalasi — umumnya saklar dipasang sekitar 1,5m dari lantai dan stop kontak sekitar 30cm dari lantai."
            }
          },
          {
            name: "Pipa PVC / Conduit",
            desc: "Pipa pelindung jalur kabel dari kerusakan fisik, kelembaban, dan gangguan luar. Wajib digunakan pada instalasi tertanam (in-bow) sesuai standar PUIL.",
            symbol: "bi-grip-vertical",
            imagePath: resolveAssetUrl("src/assets/images/tools/pipa-conduit.png"),
            detailId: "bahan_pipa_pvc",
            detail: {
              content: "Tersedia dalam beberapa ukuran diameter standar (5/8 inci, 3/4 inci, 1 inci) disesuaikan dengan jumlah dan ukuran kabel yang akan dilindungi di dalamnya. Bisa dipasang tertanam di dalam tembok (in-bow) atau di permukaan tembok (out-bow) tergantung desain instalasi."
            }
          },
          {
            name: "Gergaji Pipa (Hacksaw)",
            desc: "Digunakan untuk memotong pipa PVC/conduit sesuai ukuran yang dibutuhkan sebelum dipasang sebagai pelindung jalur kabel.",
            symbol: "bi-scissors",
            imagePath: resolveAssetUrl("src/assets/images/tools/gergaji-pipa.png"),
            detailId: "bahan_gergaji_pipa",
            detail: {
              content: "Memiliki mata gergaji dengan jumlah gigi per inci (TPI) yang sesuai untuk memotong material PVC dengan hasil potongan rapi. Teknik memotong yang benar: tegak lurus terhadap sumbu pipa agar sambungan pipa nantinya rapat dan rapi."
            }
          },
          {
            name: "Klem Pipa / Klem Kabel",
            desc: "Digunakan untuk mengikat dan menahan pipa conduit atau kabel agar terpasang rapi dan kuat pada dinding atau permukaan instalasi.",
            symbol: "bi-paperclip",
            imagePath: resolveAssetUrl("src/assets/images/tools/klem-pipa.png"),
            detailId: "bahan_klem",
            detail: {
              content: "Klem pipa berbentuk melingkar disesuaikan diameter pipa conduit, sedangkan klem kabel berbentuk pipih untuk menahan kabel langsung tanpa pipa. Sebagai panduan umum, jarak antar klem pada jalur lurus sebaiknya sekitar 50-60cm agar pipa/kabel tidak melorot atau bergelombang."
            }
          },
          {
            name: "Sekrup & Fischer (Dynabolt)",
            desc: "Alat pengencang untuk memasang klem, saklar, stop kontak, dan kotak sambung ke permukaan tembok atau kayu.",
            symbol: "bi-gear",
            imagePath: resolveAssetUrl("src/assets/images/tools/sekrup-fischer.png"),
            detailId: "bahan_sekrup_fischer",
            detail: {
              content: "Fischer (wall plug) akan mengembang mengunci ke dalam lubang tembok saat sekrup dimasukkan ke dalamnya. Ukuran fischer dan mata bor yang dipakai harus sesuai (biasanya tertera pada kemasan) agar kuncian tidak longgar."
            }
          },
          {
            name: "Paku Beton",
            desc: "Paku baja keras untuk memasang klem pipa/kabel langsung ke permukaan tembok atau beton menggunakan palu, sebagai alternatif yang lebih cepat dari sekrup dan fischer untuk pemasangan ringan.",
            symbol: "bi-pin-angle-fill",
            imagePath: resolveAssetUrl("src/assets/images/tools/paku-beton.jpg"),
            detailId: "bahan_paku_beton",
            detail: {
              content: "Tersedia dalam berbagai ukuran panjang (2,5cm hingga 7,5cm umum digunakan). Untuk tembok beton yang sangat keras, sebaiknya buat lubang kecil terlebih dahulu dengan bor agar paku tidak bengkok saat dipukul."
            }
          },
          {
            name: "Lasdop",
            desc: "Tutup pelindung berbahan isolator untuk melindungi ujung sambungan kabel di dalam kotak sambung (T-dos), mencegah korsleting dan sentuhan langsung.",
            symbol: "bi-plug",
            imagePath: resolveAssetUrl("src/assets/images/tools/lasdop.png"),
            detailId: "bahan_lasdop",
            detail: {
              content: "Tersedia berbagai ukuran (biasanya dibedakan lewat warna) disesuaikan dengan jumlah dan diameter kabel yang disambung di dalamnya. Cara pakai: puntir ujung-ujung kabel tembaga yang telanjang terlebih dahulu, lalu tutup dengan cara memutar lasdop searah jarum jam hingga seluruh bagian tembaga tertutup rapat, tidak ada yang terbuka."
            }
          },
          {
            name: "Isolasi Listrik (Lakban Listrik)",
            desc: "Bahan pembungkus/pelindung tambahan pada sambungan kabel untuk menjaga isolasi dan mencegah kontak listrik yang tidak diinginkan.",
            symbol: "bi-bandaid-fill",
            imagePath: resolveAssetUrl("src/assets/images/tools/isolasi-listrik.png"),
            detailId: "bahan_isolasi_listrik",
            detail: {
              content: "Berbahan dasar PVC dengan rating tegangan tertentu (biasanya tertera pada kemasan). Cara pemasangan yang benar: dililitkan secara spiral bertumpuk (overlapping) mengelilingi sambungan kabel, memastikan tidak ada bagian tembaga yang masih terbuka."
            }
          },
          {
            name: "Kotak Sambung",
            desc: "Junction Box (T-dos/Kruis-dos). Tempat bertemunya percabangan kabel instalasi. Di dalamnya, kabel disambung menggunakan lasdop agar terlindung.",
            symbol: "bi-box-seam-fill",
            imagePath: resolveAssetUrl("src/assets/images/kotak-sambung.png"),
            symbolPath: `<svg viewBox="0 0 100 60" width="80" height="48"><circle cx="50" cy="30" r="4" fill="#000"/><line x1="20" y1="30" x2="80" y2="30" stroke="#000" stroke-width="1.5"/><line x1="50" y1="10" x2="50" y2="50" stroke="#000" stroke-width="1.5"/><text x="25" y="52" font-size="8">Junction Box</text></svg>`,
            detailId: "bahan_kotak_sambung",
            detail: {
              content: "Tersedia dalam beberapa bentuk sesuai jumlah cabang: T-dos (3 arah) dan kruis-dos (4 arah). Umumnya dipasang tertanam di dalam tembok (in-bow) sejajar dengan jalur pipa conduit, dengan sambungan kabel di dalamnya dilindungi lasdop."
            }
          },
          {
            name: "Kabel NYA, NYM",
            desc: "Media penghantar arus. NYA berinti tunggal dengan isolasi PVC tunggal. NYM berinti lebih dari satu dengan selubung isolasi PVC putih tebal. Kode warna PUIL klasik: Fasa = Merah/Kuning/Hitam, Netral = Biru, Ground = Kuning-Hijau.",
            symbol: "bi-plug-fill",
            imagePath: resolveAssetUrl("src/assets/images/tools/kabel-nym.png"),
            symbolPath: `<svg viewBox="0 0 100 60" width="80" height="48"><line x1="15" y1="20" x2="85" y2="20" stroke="red" stroke-width="3"/><line x1="15" y1="30" x2="85" y2="30" stroke="blue" stroke-width="3"/><line x1="15" y1="40" x2="85" y2="40" stroke="green" stroke-width="3"/><text x="25" y="14" font-size="8">NYM (L, N, PE)</text></svg>`,
            detailId: "bahan_kabel_nym",
            detail: {
              content: "NYA memiliki inti tunggal (solid) dengan isolasi PVC tunggal, tidak punya selubung luar tambahan sehingga WAJIB dilindungi pipa conduit saat dipasang. NYM memiliki lebih dari 1 inti sekaligus dengan selubung PVC tebal tambahan di luarnya, sehingga lebih kuat secara fisik. Ukuran penampang kabel umum: 1,5mm², 2,5mm², dan 4mm², dipilih sesuai kapasitas arus yang akan dialirkan."
            }
          }
        ]
      }
    ]
  },

  komponen: {
    id: "komponen",
    title: "Komponen Listrik (PUIL)",
    icon: "bi-lightbulb",
    sections: [
      {
        subtitle: "Daftar Komponen Instalasi Penerangan Listrik",
        content: "Komponen-komponen berikut digunakan untuk mengalirkan, mengamankan, dan mengontrol energi listrik menuju beban penerangan. Simbol standar mengikuti aturan PUIL (Persyaratan Umum Instalasi Listrik):",
        gridItems: [
          {
            name: "MCB 1-Fasa",
            desc: "Miniature Circuit Breaker. Berfungsi sebagai pengaman beban lebih (thermal) dan hubung singkat (magnetic). Memutus sirkuit fasa secara otomatis saat terjadi gangguan.",
            imagePath: resolveAssetUrl("src/assets/images/mcb-1p-off.png"),
            presetKey: "MCB_1P",
            detailId: "komp_mcb1p",
            detail: {
              content: "Secara konstruksi, MCB tersusun dari bimetal strip yang akan melengkung dan memutus arus saat terjadi beban lebih (overload) secara bertahap (thermal trip), serta kumparan elektromagnetik yang bereaksi cepat memutus arus saat terjadi hubung singkat (magnetic trip). Terdapat ruang pemadam busur api (arc chute) untuk memadamkan percikan api saat kontak terbuka. MCB tersedia dalam berbagai rating arus standar (2A, 4A, 6A, 10A, 16A, 20A, 25A, 32A, dst) yang dipilih sesuai kebutuhan beban.",
              partsImagePath: "src/assets/images/konstruksi/mcb-1p-parts.jpg",
              parts: [
                { name: "Tuas ON/OFF (Actuator)", description: "Untuk mengaktifkan atau memutus aliran listrik secara manual." },
                { name: "Bimetal Strip", description: "Melengkung dan memutus arus secara bertahap saat terjadi beban lebih (thermal trip)." },
                { name: "Kumparan Elektromagnetik (Solenoid)", description: "Bereaksi cepat memutus arus saat terjadi hubung singkat (magnetic trip)." },
                { name: "Ruang Pemadam Busur Api (Arc Chute)", description: "Memecah dan memadamkan loncatan bunga api listrik saat kontak terbuka." },
                { name: "Kontak Bergerak & Tetap (Contacts)", description: "Titik temu logam tempat arus utama mengalir atau terputus." },
                { name: "Terminal Input & Output", description: "Titik sambungan sekrup untuk kabel fasa masuk dan keluar." }
              ],
              hasInteractiveMechanism: true
            }
          },
          {
            name: "Sekring (Fuse)",
            desc: "Pengaman lebur tradisional. Menggunakan kawat halus yang akan meleleh/putus jika dilalui arus listrik melebihi rating kapasitasnya.",
            imagePath: resolveAssetUrl("src/assets/images/sekring.webp"),
            symbolPath: `<svg viewBox="0 0 100 60" width="80" height="48"><rect x="25" y="25" width="50" height="10" fill="none" stroke="#000" stroke-width="2"/><line x1="10" y1="30" x2="90" y2="30" stroke="#000" stroke-width="2"/><text x="40" y="48" font-size="10" font-weight="bold">Fuse</text></svg>`,
            presetKey: "Fuse",
            detailId: "komp_fuse",
            detail: {
              content: "Sekring terdiri dari elemen kawat halus (fuse element) yang dipasang di dalam tabung kaca atau keramik. Saat arus melebihi rating kapasitasnya, elemen ini akan meleleh dan putus, memutus aliran listrik. Berbeda dari MCB, sekring yang sudah putus TIDAK BISA direset dan harus diganti dengan yang baru. Dikenal 2 jenis umum: sekring ulir (tipe Diazed, dipasang dengan cara diputar) dan sekring patron (cartridge, dipasang menjepit).",
              partsImagePath: "src/assets/images/konstruksi/sekring-parts.jpg",
              parts: [
                { name: "Kawat Lebur (Fuse Element)", description: "Kawat halus khusus yang meleleh dan putus ketika arus melampaui batas aman." },
                { name: "Tabung Isolator (Body)", description: "Selongsong keramik porselen atau kaca tahan panas pembungkus kawat lebur." },
                { name: "Tutup Kontak Logam (End Caps)", description: "Tutup kuningan konduktif di kedua ujung sebagai penghantar arus ke dudukan sekring." },
                { name: "Pasir Kuarsa (Silica Sand)", description: "Bahan pengisi internal untuk meredam ledakan dan memadamkan busur api saat kawat putus." },
                { name: "Indikator Putus (Indicator)", description: "Penanda warna atau pegas kecil di ujung sekring yang lepas saat kawat di dalam putus." }
              ],
              hasInteractiveMechanism: true
            }
          },
          {
            name: "Saklar Tunggal",
            desc: "Sakelar 1 kutub untuk mengontrol (menghubungkan/memutuskan) satu atau kelompok lampu dari satu lokasi kontrol.",
            imagePath: resolveAssetUrl("src/assets/images/saklar-tunggal-off.png"),
            presetKey: "SwitchSingle",
            detailId: "komp_saklar_tunggal",
            detail: {
              content: "Konstruksi saklar tunggal terdiri dari mekanisme tuas pegas (spring-loaded toggle) yang menghubungkan/memutuskan 2 kontak logam saat ditekan. Rumah (housing) umumnya berbahan termoplastik tahan panas. Rating standar SNI untuk saklar rumah tangga umumnya 250V/6A atau 250V/10A.",
              partsImagePath: "src/assets/images/konstruksi/saklar-tunggal-parts.jpg",
              parts: [
                { name: "Tuas / Rocker", description: "Bagian permukaan luar yang ditekan pengguna untuk mengubah posisi ON atau OFF." },
                { name: "Mekanisme Pegas (Spring Toggle)", description: "Pegas pemicu kontak cepat agar perpindahan terjadi seketika tanpa percikan bunga api berkepanjangan." },
                { name: "Bilah Kontak Bergerak (Moving Contact)", description: "Bilah tembaga konduktif yang menghubungkan atau memutuskan kontak listrik." },
                { name: "Terminal Input (Fasa In)", description: "Terminal sekrup atau quick-clamp tempat masuknya kabel Fasa dari sumber listrik." },
                { name: "Terminal Output (Fasa Out)", description: "Terminal tempat keluarnya kabel Fasa kontrol menuju beban lampu." },
                { name: "Rumah Isolator (Housing)", description: "Bodi plastik polikarbonat tahan panas dan api yang melindungi seluruh komponen mekanis." }
              ],
              hasInteractiveMechanism: true
            }
          },
          {
            name: "Saklar Seri (Deret)",
            desc: "Dua saklar tunggal yang digabung dalam satu wadah/inbow. Digunakan untuk mengontrol dua beban lampu secara terpisah dari satu lokasi.",
            imagePath: resolveAssetUrl("src/assets/images/saklar-seri-off.png"),
            presetKey: "SwitchDouble",
            detailId: "komp_saklar_seri",
            detail: {
              content: "Merupakan 2 mekanisme saklar tunggal independen yang digabung dalam 1 rumah/plat, berbagi 1 terminal input fasa yang sama, namun masing-masing punya tuas dan terminal output terpisah. Memungkinkan pengendalian 2 titik lampu berbeda dari 1 kotak saklar.",
              partsImagePath: "src/assets/images/konstruksi/saklar-seri-parts.jpg",
              parts: [
                { name: "Dua Tuas Independen (Double Rocker)", description: "Dua tombol berdampingan untuk mengendalikan dua grup lampu secara terpisah." },
                { name: "Terminal Input Bersama (Common Input)", description: "Terminal fasa masuk yang terhubung atau dijumper ke kedua saklar." },
                { name: "Terminal Output 1 (Beban 1)", description: "Terminal kabel keluaran fasa menuju lampu kelompok pertama." },
                { name: "Terminal Output 2 (Beban 2)", description: "Terminal kabel keluaran fasa menuju lampu kelompok kedua." },
                { name: "Dua Set Kontak Mandiri", description: "Dua pasang kontak logam dan pegas pemutus yang bekerja tanpa saling mempengaruhi." },
                { name: "Plat Dudukan / Rangka (Mounting Frame)", description: "Rangka penopang untuk mengunci saklar ke mangkok inbow doos di dinding." }
              ],
              hasInteractiveMechanism: true
            }
          },
          {
            name: "Saklar Tukar (Hotel)",
            desc: "Sakelar 3 terminal (1 common, 2 cabang). Digunakan berpasangan (minimal 2 saklar) untuk mengontrol 1 beban lampu dari dua tempat berbeda (misalnya lorong atau tangga).",
            imagePath: resolveAssetUrl("src/assets/images/saklar-tukar-off.png"),
            presetKey: "SwitchWay3",
            detailId: "komp_saklar_tukar",
            detail: {
              content: "Secara konstruksi disebut saklar SPDT (Single Pole Double Throw) — 1 terminal common (COM) di dalamnya terhubung secara mekanis bergantian ke salah satu dari 2 terminal output (L1 atau L2) tergantung posisi tuas. Untuk berfungsi sebagai saklar hotel/tangga, WAJIB dipasang berpasangan (2 unit) dengan kedua terminal L1-L1 dan L2-L2 saling dihubungkan.",
              partsImagePath: "src/assets/images/konstruksi/saklar-tukar-parts.jpg",
              parts: [
                { name: "Tuas Pengalih (SPDT Rocker)", description: "Tuas untuk mengalihkan hubungan kontak dari cabang satu ke cabang lainnya." },
                { name: "Terminal Common (COM / Pin 0)", description: "Terminal input fasa pada saklar pertama, atau terminal output ke lampu pada saklar kedua." },
                { name: "Terminal Cabang 1 (L1 / Pin 1)", description: "Titik sambungan kabel penghubung jalur pertama antar kedua saklar tukar." },
                { name: "Terminal Cabang 2 (L2 / Pin 2)", description: "Titik sambungan kabel penghubung jalur kedua antar kedua saklar tukar." },
                { name: "Kontak Pengalih Bolak-Balik", description: "Bilah tembaga yang selalu terhubung ke salah satu cabang tanpa posisi netral." }
              ],
              hasInteractiveMechanism: true
            }
          },
          {
            name: "Saklar Silang",
            desc: "Digunakan di antara dua saklar tukar untuk memperbanyak titik kontrol (misalnya mengendalikan 1 lampu dari 3 lokasi atau lebih).",
            imagePath: resolveAssetUrl("src/assets/images/saklar-silang-off.png"),
            presetKey: "SwitchCross",
            detailId: "komp_saklar_silang",
            detail: {
              content: "Memiliki mekanisme internal yang lebih kompleks dari saklar tukar — saat tuas pada posisi 'lurus', kedua jalur input terhubung langsung ke output yang sejajar; saat tuas pada posisi 'menyilang', jalur input-output saling bertukar (disilangkan). Dipasang DI ANTARA 2 unit saklar tukar untuk memungkinkan kontrol lampu dari 3 titik atau lebih.",
              partsImagePath: "src/assets/images/konstruksi/saklar-silang-parts.jpg",
              parts: [
                { name: "Tuas Pembalik Jalur", description: "Tuas pengendali untuk mengubah koneksi internal antara konfigurasi paralel dan menyilang." },
                { name: "Sepasang Terminal Input (In 1 & In 2)", description: "Terminal penerima sepasang kabel penghubung dari saklar tukar pertama." },
                { name: "Sepasang Terminal Output (Out 1 & Out 2)", description: "Terminal pengirim sepasang kabel penghubung menuju saklar tukar kedua." },
                { name: "Mekanisme Pembalik Silang (Cross Contacts)", description: "Susunan kontak 4-kutub yang menghubungkan In 1-Out 1 & In 2-Out 2 saat lurus, atau In 1-Out 2 & In 2-Out 1 saat silang." },
                { name: "Bilik Isolasi Internal", description: "Partisi plastik pemisah jalur tegangan tinggi agar tidak terjadi korsleting saat kontak berpindah." }
              ],
              hasInteractiveMechanism: true
            }
          },
          {
            name: "Stop Kontak 1-Fasa",
            desc: "Titik keluaran tegangan listrik untuk menyuplai peralatan portabel. Terdiri atas kontak Fasa, Netral, dan klip Arde/Grounding pengaman logam.",
            imagePath: resolveAssetUrl("src/assets/images/stop-kontak.png"),
            presetKey: "Socket",
            detailId: "komp_stop_kontak",
            detail: {
              content: "Terdiri dari 2 lubang kontak (fasa dan netral) berbahan logam konduktif, serta klip/terminal arde (ground) di bagian atas/bawah untuk sistem grounding. Rumah berbahan PVC/termoplastik sebagai isolator. Standar tipe colokan bulat (Europlug/CEE 7) umum digunakan di Indonesia.",
              partsImagePath: "src/assets/images/konstruksi/stop-kontak-parts.jpg",
              parts: [
                { name: "Lubang Kontak Fasa (L)", description: "Klip jepit kuningan berpegas yang menerima pin steker fasa (bertegangan 220V)." },
                { name: "Lubang Kontak Netral (N)", description: "Klip jepit kuningan berpegas yang menerima pin steker netral sebagai arus balik." },
                { name: "Klip Grounding / Arde (PE)", description: "Plat logam elastis di bagian atas dan bawah yang menyentuh plat arde steker demi keamanan." },
                { name: "Katup Pengaman Anak (Safety Shutter)", description: "Penutup lubang otomatis yang hanya terbuka jika kedua pin steker ditekan bersamaan." },
                { name: "Terminal Kabel Belakang", description: "Tiga terminal baut pengunci kabel instalasi (Fasa, Netral, dan Ground/Arde)." },
                { name: "Plat Muka (Faceplate)", description: "Penutup estetik berbahan termoplastik isolator tahan pecah dan tahan panas." }
              ],
              hasInteractiveMechanism: true
            }
          },
          {
            name: "Lampu",
            desc: "Beban instalasi yang mengubah energi listrik menjadi cahaya. Jenis yang umum: lampu pijar, halogen, lampu hemat energi (CFL), dan lampu LED.",
            imagePath: resolveAssetUrl("src/assets/images/lampu-mati.png"),
            presetKey: "Lamp",
            detailId: "komp_lampu",
            detail: {
              content: "Lampu berfungsi sebagai <strong>beban</strong> pada instalasi penerangan — komponen yang menerima arus dari kabel Fasa dan mengembalikannya lewat kabel Netral. Beberapa jenis yang umum digunakan: <strong>Lampu pijar</strong> (kawat filamen tungsten yang berpijar saat dialiri arus, boros energi dan banyak menghasilkan panas), <strong>Lampu halogen</strong> (mirip lampu pijar dengan gas halogen di dalamnya sehingga lebih terang dan awet), <strong>Lampu hemat energi/CFL</strong> (tabung berisi gas yang berpendar, lebih hemat), dan <strong>Lampu LED</strong> (memakai dioda pemancar cahaya dengan rangkaian driver, paling hemat energi dan paling awet). Daya lampu dinyatakan dalam Watt dan menentukan total beban yang harus ditanggung MCB. Bagian pangkal lampu (ulir) umumnya bertipe E27 (besar) atau E14 (kecil) agar cocok dengan fitting-nya.",
              partsImagePath: "src/assets/images/konstruksi/lampu-parts.jpg",
              parts: [
                { name: "Kubah Diffuser (Globe/Dome)", description: "Tudung kaca atau plastik buram untuk menyebarkan pancaran cahaya dan melindungi komponen dalam." },
                { name: "Modul LED / Filamen (Light Source)", description: "Elemen penghasil cahaya: keping LED hemat energi atau kawat filamen tungsten pijar." },
                { name: "Driver Rangkaian Elektronik", description: "Sirkuit terintegrasi di dasar lampu yang menyearahkan AC 220V menjadi arus searah DC stabil." },
                { name: "Pendingin Bodi (Heat Sink)", description: "Bodi aluminium atau plastik konduktif termal untuk membuang panas driver dan LED." },
                { name: "Ulir Logam Luar (E27 Screw)", description: "Drat logam penghubung listrik bagian samping yang terhubung ke kabel Netral." },
                { name: "Kaki Kontak Tengah (Foot Contact)", description: "Titik plat logam di ujung bawah ulir lampu yang menerima arus kabel Fasa." }
              ],
              hasInteractiveMechanism: true
            }
          },
          {
            name: "Fitting Lampu",
            desc: "Dudukan lampu yang memegang lampu dan menyalurkan listrik dari kabel instalasi ke lampu. Terdiri dari kontak lidah di tengah (Fasa) dan ulir logam di luar (Netral).",
            imagePath: resolveAssetUrl("src/assets/images/fitting-lampu.png"),
            symbol: "bi-lightbulb",
            presetKey: "Lamp",
            detailId: "komp_fitting",
            detail: {
              content: "Fitting (dudukan lampu) memiliki kontak lidah di bagian tengah (terhubung ke terminal Fasa) dan ulir logam di bagian luar (terhubung ke terminal Netral). Konstruksi ulir standar yang umum adalah tipe E27 (ulir besar) dan E14 (ulir kecil). Badan fitting umumnya terbuat dari porselen/keramik atau termoplastik tahan panas. Tersedia beberapa model pemasangan: fitting duduk (dipasang di dinding/plafon), fitting gantung (dengan kabel), dan fitting downlight. PENTING: pemasangan polaritas yang benar (Fasa ke lidah tengah, bukan ke ulir luar) wajib diikuti demi keselamatan saat mengganti lampu.",
              partsImagePath: "src/assets/images/konstruksi/fitting-lampu-parts.jpg",
              parts: [
                { name: "Lidah Kontak Tengah (Center Tongue)", description: "Plat tembaga berpegas di bagian dasar tengah yang wajib disambung ke kabel Fasa." },
                { name: "Selongsong Ulir Logam (Threaded Shell)", description: "Drat kuningan/aluminium dudukan lampu yang wajib disambung ke kabel Netral." },
                { name: "Terminal Sekrup Kabel (Fasa & Netral)", description: "Blok baut tempat menjepit kupasan inti kawat tembaga kabel instalasi." },
                { name: "Badan Isolator (Ceramic/Bakelite Body)", description: "Rumah utama berbahan keramik atau bakelit tahan suhu tinggi akibat panas lampu." },
                { name: "Kubah / Flens Pemasangan", description: "Bibir dudukan yang dilengkapi lubang sekrup untuk menempel kuat di plafon atau dinding." }
              ],
              hasInteractiveMechanism: true
            }
          },
          {
            name: "Lampu TL (Neon/Fluorescent)",
            desc: "Lampu tabung yang memanfaatkan gas neon terionisasi untuk menghasilkan cahaya, lebih hemat energi dibanding lampu pijar konvensional.",
            imagePath: resolveAssetUrl("src/assets/images/lampu-tl-mati.png"),
            symbolPath: `<svg viewBox="0 0 120 50" width="90" height="38"><rect width="120" height="50" rx="6" fill="#1e293b" stroke="#334155" stroke-width="2"/><rect x="8" y="15" width="12" height="20" rx="2" fill="#475569"/><rect x="100" y="15" width="12" height="20" rx="2" fill="#475569"/><rect x="18" y="16" width="84" height="18" rx="9" fill="#334155"/><text x="60" y="46" fill="#94a3b8" font-size="6.5" font-weight="bold" text-anchor="middle">LAMPU TL</text></svg>`,
            presetKey: "LampTL",
            detailId: "komp_lampu_tl",
            detail: {
              content: "Berbeda dari lampu pijar/LED biasa, Lampu TL konvensional memerlukan 3 komponen pendukung untuk menyala: <strong>Ballast (Trafo/Choke)</strong> yang berfungsi menaikkan tegangan awal untuk memicu ionisasi gas dan membatasi arus setelah menyala, <strong>Starter</strong> yang berfungsi sebagai saklar otomatis sementara untuk memanaskan elektroda di kedua ujung tabung sebelum lampu menyala penuh, dan <strong>Tabung (Tube)</strong> berisi gas argon dan sedikit uap merkuri yang akan berpendar saat dialiri listrik melalui proses ionisasi. Ketiga komponen ini bekerja secara berurutan: starter memanaskan elektroda terlebih dahulu, lalu ballast memberikan lonjakan tegangan untuk menyalakan gas di dalam tabung, setelah menyala ballast berfungsi membatasi arus supaya tabung tidak rusak.",
              partsImagePath: "src/assets/images/konstruksi/lampu-tl-parts.jpg",
              parts: [
                { name: "Tabung Kaca Pendar (Fluorescent Tube)", description: "Tabung kaca berisi gas argon dan uap merkuri bertekanan rendah dengan lapisan fosfor pendar." },
                { name: "Elektroda Filamen (Tungsten Cathodes)", description: "Filamen pemancar elektron di kedua ujung tabung yang dipanaskan saat awal menyala." },
                { name: "Pin Terminal Ganda (Bi-Pin Caps)", description: "Dua pin logam di masing-masing tutup ujung tabung untuk sambungan ke fitting kap." },
                { name: "Starter", description: "Tabung saklar otomatis berisi gas dan bimetal untuk memanaskan filamen sebelum gas terionisasi." },
                { name: "Ballast (Choke / Trafo)", description: "Induktor penyuplai lonjakan tegangan kejut awal dan pembatas arus kerja agar tabung awet." },
                { name: "Kap / Armatur (Luminaire Fixture)", description: "Rumah plat logam dudukan tempat meletakkan tabung, ballast, dan starter secara terpadu." }
              ],
              hasInteractiveMechanism: true
            }
          },
          {
            name: "MCB 3-Fasa",
            desc: "Digunakan sebagai pengaman sirkuit suplai 3-fasa. Terdiri dari 3 MCB 1-fasa yang terkopel secara mekanik sehingga jika salah satu fasa trip, ketiganya memutus aliran.",
            imagePath: resolveAssetUrl("src/assets/images/mcb-3p-off.png"),
            presetKey: "MCB_3P",
            detailId: "komp_mcb3p",
            detail: {
              content: "Terdiri dari 3 mekanisme MCB 1-fasa yang digabung dan dikopel secara mekanis melalui 1 batang penghubung (common trip bar). Jika salah satu fasa (R, S, atau T) mengalami gangguan (overload/short circuit) dan trip, batang penghubung ini akan memaksa ketiga kutub (pole) ikut terbuka bersamaan — memastikan seluruh fasa terputus serempak demi keamanan.",
              partsImagePath: "src/assets/images/konstruksi/mcb-3p-parts.jpg",
              parts: [
                { name: "Tuas Gandeng (Coupled Handle)", description: "Satu tuas panjang yang menghubungkan ketiga kutub fasa untuk kontrol manual serentak." },
                { name: "Batang Pemicu Internal (Trip Bar)", description: "Poros mekanis penghubung yang memaksa ketiga kutub trip bersamaan jika salah satu fasa gangguan." },
                { name: "3 Modul Bimetal Thermal", description: "Tiga unit bimetal strip mandiri untuk proteksi beban lebih pada masing-masing fasa R, S, dan T." },
                { name: "3 Kumparan Solenoid Magnetik", description: "Tiga kumparan pemutus cepat untuk respon arus hubung singkat seketika." },
                { name: "3 Ruang Pemadam Busur Api", description: "Tiga bilik arc chute pemadam bunga api listrik pada masing-masing kutub fasa." },
                { name: "Terminal Input & Output 3-Kutub", description: "Tiga pasang terminal sekrup bertanda fasa R/L1, S/L2, dan T/L3." }
              ],
              hasInteractiveMechanism: true
            }
          },
          {
            name: "PHB / Panel Distribusi 3-Fasa",
            desc: "Panel Hubung Bagi. Berfungsi menerima daya dari kabel utama (feeder) 3-fasa dan membagi pasokan daya tersebut ke grup-grup sirkit cabang fasa tunggal secara merata (balancing).",
            imagePath: resolveAssetUrl("src/assets/images/panel-3fasa.webp"),
            symbolPath: `<svg viewBox="0 0 100 60" width="80" height="48"><rect x="30" y="15" width="40" height="30" fill="none" stroke="#000" stroke-width="2"/><line x1="30" y1="30" x2="70" y2="30" stroke="#000" stroke-width="2"/><line x1="50" y1="15" x2="50" y2="45" stroke="#000" stroke-width="2"/><text x="35" y="54" font-size="8">Panel 3F</text></svg>`,
            presetKey: "PanelPHB",
            detailId: "komp_phb",
            detail: {
              content: "Terdiri dari kotak panel (metal/termoplastik) yang di dalamnya berisi sistem rel tembaga (busbar) untuk mendistribusikan fasa masuk, 1 pengaman utama (MCB 3-Fasa) di bagian input, dan beberapa pengaman kecil (MCB 1-Fasa) untuk tiap grup sirkit output yang dibagi ke fasa R, S, dan T secara merata (balancing). Rel Netral dan Ground biasanya dipasang terpisah sebagai jalur bus bersama yang tidak melalui pemutus.",
              partsImagePath: "src/assets/images/konstruksi/panel-3fasa-parts.jpg",
              parts: [
                { name: "Lemari Box Panel (Enclosure)", description: "Kotak plat baja atau polikarbonat berpelindung standar IP untuk mengamankan seluruh instalasi internal." },
                { name: "Rel Tembaga Fasa (Busbars R-S-T)", description: "Batang tembaga padat penyalur arus utama untuk pembagian fasa R (Merah), S (Kuning), T (Hitam)." },
                { name: "Rel Netral (Neutral Busbar)", description: "Batang terminal tembaga titik kumpul seluruh kabel netral rangkaian cabang." },
                { name: "Rel Arde / Pembumian (Grounding Busbar)", description: "Batang tembaga yang terhubung ke badan panel dan kawat elektroda tanah (arde)." },
                { name: "MCB Utama / Induk (Main Breaker)", description: "MCB 3-fasa pengaman dan pemutus total suplai daya listrik feeder gedung." },
                { name: "Deretan MCB Cabang (Branch Breakers)", description: "MCB 1-fasa pengaman masing-masing kelompok sirkit beban penerangan dan stop kontak." },
                { name: "Rel Din-Rail", description: "Rel profil logam omega tempat modul-modul MCB dikaitkan (snap-on) secara rapi." }
              ]
            }
          }
        ]
      }
    ]
  },

  sistem3fasa: {
    id: "sistem3fasa",
    title: "Sistem 3 Fasa",
    icon: "bi-lightning-charge-fill",
    sections: [
      {
        subtitle: "Prinsip Sistem Distribusi 3 Fasa",
        gridItems: [
          {
            name: "Konsep Tegangan Fasa-Netral vs Fasa-Fasa",
            desc: "Perbedaan tegangan 220V (V_LN) dan 380V (V_LL) dengan pergeseran sudut fase 120°.",
            symbol: "bi-lightning-charge-fill",
            detailId: "3f_tegangan",
            detail: {
              content: "Sistem listrik 3-fasa menggunakan 3 penghantar aktif fasa (R, S, T) dengan beda sudut fase masing-masing 120 derajat elektrik, ditambah 1 penghantar Netral (N) dan Ground (PE).",
              items: [
                "<strong>Tegangan Fasa-Netral (V_LN)</strong>: Tegangan diukur antara salah satu fasa (R, S, atau T) dengan kabel Netral (N). Standar tegangannya adalah <strong>220 Volt AC</strong>. Tegangan inilah yang disalurkan untuk mensuplai beban penerangan rumah tinggal/gedung 1-fasa.",
                "<strong>Tegangan Fasa-Fasa (V_LL)</strong>: Tegangan diukur di antara dua fasa yang berbeda (R ke S, S ke T, atau R ke T). Karena beda fase 120°, nilai tegangannya adalah: V_LL = V_LN x √3 ≈ 220V x 1,732 ≈ <strong>380 Volt AC</strong>."
              ],
              hasInteractiveMechanism: true
            }
          },
          {
            name: "Sambungan Wye (Bintang) dan Delta (Segitiga)",
            desc: "Konfigurasi Wye (Y) dengan titik netral dan Delta (Δ) untuk beban daya besar.",
            symbol: "bi-diagram-3-fill",
            detailId: "3f_sambungan",
            detail: {
              content: "Konfigurasi sistem 3-fasa pada sumber/beban:",
              items: [
                "<strong>Konfigurasi Bintang (Y / Wye)</strong>: Ujung-ujung lilitan dihubungkan pada satu titik bintang menjadi titik Netral (N). Menghasilkan dua jenis tegangan (220V dan 380V). Sangat cocok untuk menyuplai beban penerangan karena memiliki jalur Netral.",
                "<strong>Konfigurasi Segitiga (Delta / Δ)</strong>: Lilitan dihubungkan ujung ke ujung membentuk segitiga tertutup. Tidak memiliki titik netral alami. Digunakan untuk beban daya besar seimbang seperti motor 3-fasa."
              ],
              hasInteractiveMechanism: true
            }
          },
          {
            name: "Penyeimbangan Beban (Load Balancing)",
            desc: "Pembagian beban 1-fasa secara merata ke fasa R, S, dan T di PHB gedung untuk mencegah arus kawat netral berlebih.",
            symbol: "bi-sliders",
            detailId: "3f_balancing",
            detail: {
              content: "Instalasi penerangan gedung bertingkat umumnya disuplai oleh sumber listrik 3-fasa dari gardu/trafo. Hal ini dilakukan karena daya total gedung sangat besar. Namun, beban-beban lampu dan stop kontak di dalam ruangan tetap merupakan peralatan 1-fasa (220V).",
              items: [
                "<strong>Mengapa perlu penyeimbangan?</strong>: Jika fasa R memikul 90% lampu, sedangkan fasa S dan T kosong, maka akan terjadi ketidakseimbangan beban. Hal ini memicu arus mengalir sangat besar di kawat Netral (yang seharusnya mendekati nol pada beban seimbang) dan memicu panas serta rugi daya di trafo distribusi.",
                "<strong>Prosedur Balancing</strong>: Di panel hubung bagi (PHB), beban dibagi ke dalam minimal 3 grup sirkuit. Grup 1 dihubungkan ke Fasa R, Grup 2 ke Fasa S, dan Grup 3 ke Fasa T. Daya total terpasang (Watt) di setiap grup harus diupayakan mendekati sama agar beban di trafo seimbang."
              ],
              hasInteractiveMechanism: true
            }
          }
        ]
      }
    ]
  }
};
