// src/lib/formula-library.ts
// Bank rumus statis (offline, tanpa AI) untuk persiapan SNBT/UTBK.
// Dipakai oleh Papan Coret & Rangkuman Rumus.

export const FORMULA_FIELDS = ["matematika", "fisika", "kimia", "biologi"] as const;
export type FormulaField = (typeof FORMULA_FIELDS)[number];

export const FIELD_LABELS: Record<FormulaField, string> = {
  matematika: "Matematika",
  fisika: "Fisika",
  kimia: "Kimia",
  biologi: "Biologi",
};

export type FormulaEntry = {
  /** Nama rumus/konsep. */
  name: string;
  /** LaTeX tanpa delimiter. Kosong bila konsep hafalan murni. */
  latex: string;
  /** Bidang. */
  field: FormulaField;
  /** Topik / bab. */
  topic: string;
  /** Keterangan singkat: arti simbol atau kondisi pakai. */
  note: string;
  /** Kata kunci tambahan untuk pencarian. */
  keywords?: string[];
};

export const FORMULAS: FormulaEntry[] = [
  /* ------------------------------- MATEMATIKA ------------------------------ */
  {
    name: "Rumus kuadrat (ABC)",
    latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
    field: "matematika",
    topic: "Aljabar",
    note: "Akar dari ax² + bx + c = 0.",
    keywords: ["akar", "persamaan kuadrat", "abc"],
  },
  {
    name: "Diskriminan",
    latex: "D = b^2 - 4ac",
    field: "matematika",
    topic: "Aljabar",
    note: "D > 0 dua akar real, D = 0 akar kembar, D < 0 tidak real.",
  },
  {
    name: "Jumlah & hasil kali akar",
    latex: "x_1 + x_2 = -\\frac{b}{a}, \\quad x_1 x_2 = \\frac{c}{a}",
    field: "matematika",
    topic: "Aljabar",
    note: "Tanpa menghitung akarnya satu per satu.",
  },
  {
    name: "Suku ke-n barisan aritmetika",
    latex: "U_n = a + (n-1)b",
    field: "matematika",
    topic: "Barisan & Deret",
    note: "a suku pertama, b beda.",
  },
  {
    name: "Jumlah n suku aritmetika",
    latex: "S_n = \\frac{n}{2}\\,(2a + (n-1)b)",
    field: "matematika",
    topic: "Barisan & Deret",
    note: "Bisa juga S_n = n(a + U_n)/2.",
  },
  {
    name: "Suku ke-n barisan geometri",
    latex: "U_n = a r^{\\,n-1}",
    field: "matematika",
    topic: "Barisan & Deret",
    note: "r rasio antar suku.",
  },
  {
    name: "Deret geometri tak hingga",
    latex: "S_\\infty = \\frac{a}{1-r}",
    field: "matematika",
    topic: "Barisan & Deret",
    note: "Konvergen hanya bila |r| < 1.",
  },
  {
    name: "Identitas Pythagoras trigonometri",
    latex: "\\sin^2\\theta + \\cos^2\\theta = 1",
    field: "matematika",
    topic: "Trigonometri",
    note: "Turunannya: 1 + tan²θ = sec²θ.",
  },
  {
    name: "Aturan sinus",
    latex: "\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R",
    field: "matematika",
    topic: "Trigonometri",
    note: "R jari-jari lingkaran luar segitiga.",
  },
  {
    name: "Aturan cosinus",
    latex: "c^2 = a^2 + b^2 - 2ab\\cos C",
    field: "matematika",
    topic: "Trigonometri",
    note: "Dipakai saat dua sisi dan sudut apitnya diketahui.",
  },
  {
    name: "Luas segitiga (dua sisi & sudut)",
    latex: "L = \\tfrac{1}{2}ab\\sin C",
    field: "matematika",
    topic: "Geometri",
    note: "C sudut antara sisi a dan b.",
  },
  {
    name: "Sudut rangkap",
    latex: "\\sin 2\\theta = 2\\sin\\theta\\cos\\theta,\\ \\cos 2\\theta = 1 - 2\\sin^2\\theta",
    field: "matematika",
    topic: "Trigonometri",
    note: "Sering muncul pada penyederhanaan.",
  },
  {
    name: "Sifat logaritma",
    latex: "\\log_a (xy) = \\log_a x + \\log_a y,\\quad \\log_a x^n = n\\log_a x",
    field: "matematika",
    topic: "Eksponen & Logaritma",
    note: "Basis harus sama sebelum digabung.",
  },
  {
    name: "Ubah basis logaritma",
    latex: "\\log_a b = \\frac{\\log_c b}{\\log_c a}",
    field: "matematika",
    topic: "Eksponen & Logaritma",
    note: "c basis bebas, biasanya 10 atau e.",
  },
  {
    name: "Turunan dasar",
    latex: "\\frac{d}{dx}x^n = n x^{n-1}",
    field: "matematika",
    topic: "Kalkulus",
    note: "Berlaku untuk n real.",
  },
  {
    name: "Aturan rantai",
    latex: "\\frac{d}{dx} f(g(x)) = f'(g(x))\\cdot g'(x)",
    field: "matematika",
    topic: "Kalkulus",
    note: "Turunan luar kali turunan dalam.",
  },
  {
    name: "Aturan hasil kali & bagi",
    latex: "(uv)' = u'v + uv',\\quad \\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2}",
    field: "matematika",
    topic: "Kalkulus",
    note: "Jangan tertukar urutan pada aturan bagi.",
  },
  {
    name: "Integral pangkat",
    latex: "\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C",
    field: "matematika",
    topic: "Kalkulus",
    note: "Berlaku untuk n ≠ -1; bila n = -1 hasilnya ln|x| + C.",
  },
  {
    name: "Limit bentuk tak tentu",
    latex: "\\lim_{x\\to 0}\\frac{\\sin x}{x} = 1",
    field: "matematika",
    topic: "Limit",
    note: "Untuk 0/0 lain: faktorkan, kalikan sekawan, atau L'Hôpital.",
  },
  {
    name: "Permutasi & kombinasi",
    latex: "P(n,r) = \\frac{n!}{(n-r)!},\\quad C(n,r) = \\frac{n!}{r!(n-r)!}",
    field: "matematika",
    topic: "Peluang",
    note: "Permutasi memperhatikan urutan, kombinasi tidak.",
  },
  {
    name: "Peluang gabungan",
    latex: "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)",
    field: "matematika",
    topic: "Peluang",
    note: "Bila saling lepas, P(A ∩ B) = 0.",
  },
  {
    name: "Rata-rata & simpangan baku",
    latex: "\\bar{x} = \\frac{\\sum x_i}{n},\\quad s = \\sqrt{\\frac{\\sum (x_i - \\bar{x})^2}{n}}",
    field: "matematika",
    topic: "Statistika",
    note: "Sampel memakai pembagi n − 1.",
  },
  {
    name: "Jarak dua titik",
    latex: "d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}",
    field: "matematika",
    topic: "Geometri Analitik",
    note: "Perluasan Pythagoras di bidang koordinat.",
  },
  {
    name: "Gradien & garis lurus",
    latex: "m = \\frac{y_2-y_1}{x_2-x_1},\\quad y - y_1 = m(x - x_1)",
    field: "matematika",
    topic: "Geometri Analitik",
    note: "Sejajar m sama; tegak lurus m₁·m₂ = −1.",
  },
  {
    name: "Determinan matriks 2×2",
    latex: "\\det \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc",
    field: "matematika",
    topic: "Matriks",
    note: "Invers ada hanya bila determinan ≠ 0.",
  },
  {
    name: "Invers matriks 2×2",
    latex: "A^{-1} = \\frac{1}{ad-bc}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}",
    field: "matematika",
    topic: "Matriks",
    note: "Tukar diagonal utama, balik tanda diagonal lain.",
  },
  {
    name: "Bunga majemuk",
    latex: "M_n = M_0 (1 + i)^n",
    field: "matematika",
    topic: "Aritmetika Sosial",
    note: "i bunga per periode, n jumlah periode.",
    keywords: ["pertumbuhan", "peluruhan"],
  },

  /* --------------------------------- FISIKA -------------------------------- */
  {
    name: "Gerak lurus berubah beraturan",
    latex: "v = v_0 + at,\\quad s = v_0 t + \\tfrac{1}{2}at^2",
    field: "fisika",
    topic: "Kinematika",
    note: "a percepatan konstan.",
    keywords: ["glbb", "kecepatan"],
  },
  {
    name: "Persamaan tanpa waktu",
    latex: "v^2 = v_0^2 + 2as",
    field: "fisika",
    topic: "Kinematika",
    note: "Dipakai ketika waktu tidak diketahui.",
  },
  {
    name: "Hukum II Newton",
    latex: "\\Sigma F = m a",
    field: "fisika",
    topic: "Dinamika",
    note: "Resultan gaya searah percepatan.",
  },
  {
    name: "Gaya gesek",
    latex: "f = \\mu N",
    field: "fisika",
    topic: "Dinamika",
    note: "μ koefisien gesek, N gaya normal.",
  },
  {
    name: "Energi kinetik & potensial",
    latex: "E_k = \\tfrac{1}{2}mv^2,\\quad E_p = mgh",
    field: "fisika",
    topic: "Energi",
    note: "Energi mekanik total kekal bila tak ada gesekan.",
  },
  {
    name: "Usaha & daya",
    latex: "W = F s \\cos\\theta,\\quad P = \\frac{W}{t}",
    field: "fisika",
    topic: "Energi",
    note: "θ sudut antara gaya dan perpindahan.",
  },
  {
    name: "Momentum & impuls",
    latex: "p = mv,\\quad I = F\\Delta t = \\Delta p",
    field: "fisika",
    topic: "Momentum",
    note: "Momentum total kekal pada tumbukan.",
  },
  {
    name: "Gerak melingkar",
    latex: "a_s = \\frac{v^2}{R} = \\omega^2 R,\\quad v = \\omega R",
    field: "fisika",
    topic: "Gerak Melingkar",
    note: "a_s percepatan sentripetal, arahnya ke pusat.",
  },
  {
    name: "Tekanan hidrostatis",
    latex: "P = \\rho g h",
    field: "fisika",
    topic: "Fluida",
    note: "Hanya bergantung kedalaman, bukan bentuk wadah.",
  },
  {
    name: "Gaya Archimedes",
    latex: "F_A = \\rho_f\\, g\\, V_{\\text{tercelup}}",
    field: "fisika",
    topic: "Fluida",
    note: "Terapung bila F_A = berat benda.",
  },
  {
    name: "Kontinuitas & Bernoulli",
    latex: "A_1 v_1 = A_2 v_2,\\quad P + \\tfrac{1}{2}\\rho v^2 + \\rho g h = \\text{konstan}",
    field: "fisika",
    topic: "Fluida",
    note: "Pipa menyempit → laju naik, tekanan turun.",
  },
  {
    name: "Pemuaian & kalor",
    latex: "Q = m c \\Delta T,\\quad Q = m L",
    field: "fisika",
    topic: "Suhu & Kalor",
    note: "Gunakan mL saat terjadi perubahan wujud (suhu tetap).",
  },
  {
    name: "Hukum I Termodinamika",
    latex: "\\Delta U = Q - W",
    field: "fisika",
    topic: "Termodinamika",
    note: "Q masuk positif, W dilakukan sistem positif.",
  },
  {
    name: "Efisiensi mesin Carnot",
    latex: "\\eta = 1 - \\frac{T_c}{T_h}",
    field: "fisika",
    topic: "Termodinamika",
    note: "Suhu dalam Kelvin.",
  },
  {
    name: "Hukum Ohm & daya listrik",
    latex: "V = IR,\\quad P = VI = I^2 R",
    field: "fisika",
    topic: "Listrik",
    note: "Seri: R total dijumlah; paralel: kebalikannya dijumlah.",
  },
  {
    name: "Kapasitor",
    latex: "C = \\frac{Q}{V},\\quad E = \\tfrac{1}{2}CV^2",
    field: "fisika",
    topic: "Listrik",
    note: "Paralel kapasitas dijumlah, seri kebalikannya.",
  },
  {
    name: "Gaya Coulomb",
    latex: "F = k\\frac{q_1 q_2}{r^2},\\quad k = 9\\times 10^9\\ \\mathrm{N\\,m^2/C^2}",
    field: "fisika",
    topic: "Listrik Statis",
    note: "Berbanding balik kuadrat jarak.",
  },
  {
    name: "Gaya Lorentz",
    latex: "F = qvB\\sin\\theta = BIL\\sin\\theta",
    field: "fisika",
    topic: "Magnet",
    note: "Arah pakai aturan tangan kanan.",
  },
  {
    name: "Gelombang",
    latex: "v = \\lambda f,\\quad T = \\frac{1}{f}",
    field: "fisika",
    topic: "Gelombang",
    note: "Berlaku untuk semua jenis gelombang.",
  },
  {
    name: "Efek Doppler",
    latex: "f' = \\frac{v \\pm v_p}{v \\mp v_s}\\, f",
    field: "fisika",
    topic: "Gelombang Bunyi",
    note: "Tanda mengikuti arah mendekat/menjauh.",
  },
  {
    name: "Lensa & cermin",
    latex: "\\frac{1}{f} = \\frac{1}{s} + \\frac{1}{s'},\\quad M = \\left|\\frac{s'}{s}\\right|",
    field: "fisika",
    topic: "Optik",
    note: "f positif untuk lensa cembung/cermin cekung.",
  },
  {
    name: "Energi foton",
    latex: "E = hf = \\frac{hc}{\\lambda}",
    field: "fisika",
    topic: "Fisika Modern",
    note: "h = 6,63 × 10⁻³⁴ J·s.",
  },

  /* ---------------------------------- KIMIA -------------------------------- */
  {
    name: "Mol dari massa",
    latex: "n = \\frac{m}{M_r}",
    field: "kimia",
    topic: "Stoikiometri",
    note: "m massa (g), M_r massa molar (g/mol).",
  },
  {
    name: "Jumlah partikel",
    latex: "N = n \\times 6{,}022\\times 10^{23}",
    field: "kimia",
    topic: "Stoikiometri",
    note: "Bilangan Avogadro.",
  },
  {
    name: "Volume gas keadaan standar",
    latex: "V = n \\times 22{,}4\\ \\mathrm{L}",
    field: "kimia",
    topic: "Stoikiometri",
    note: "Hanya pada STP (0 °C, 1 atm).",
  },
  {
    name: "Gas ideal",
    latex: "PV = nRT",
    field: "kimia",
    topic: "Gas",
    note: "R = 0,082 L·atm/mol·K bila P dalam atm.",
  },
  {
    name: "Molaritas & pengenceran",
    latex: "M = \\frac{n}{V},\\quad M_1V_1 = M_2V_2",
    field: "kimia",
    topic: "Larutan",
    note: "V dalam liter.",
  },
  {
    name: "pH asam & basa kuat",
    latex: "\\mathrm{pH} = -\\log[\\mathrm{H^+}],\\quad \\mathrm{pH} + \\mathrm{pOH} = 14",
    field: "kimia",
    topic: "Asam Basa",
    note: "Asam kuat terionisasi sempurna.",
  },
  {
    name: "Asam lemah",
    latex: "[\\mathrm{H^+}] = \\sqrt{K_a \\cdot M}",
    field: "kimia",
    topic: "Asam Basa",
    note: "Derajat ionisasi α = √(K_a/M).",
  },
  {
    name: "Larutan penyangga",
    latex: "\\mathrm{pH} = pK_a + \\log\\frac{[\\text{basa konjugasi}]}{[\\text{asam}]}",
    field: "kimia",
    topic: "Asam Basa",
    note: "Persamaan Henderson–Hasselbalch.",
  },
  {
    name: "Tetapan kesetimbangan",
    latex: "K_c = \\frac{[C]^c[D]^d}{[A]^a[B]^b}",
    field: "kimia",
    topic: "Kesetimbangan",
    note: "Zat padat dan cairan murni tidak dimasukkan.",
  },
  {
    name: "Hubungan Kp dan Kc",
    latex: "K_p = K_c (RT)^{\\Delta n}",
    field: "kimia",
    topic: "Kesetimbangan",
    note: "Δn = mol gas produk − mol gas reaktan.",
  },
  {
    name: "Laju reaksi",
    latex: "v = k[A]^m[B]^n",
    field: "kimia",
    topic: "Laju Reaksi",
    note: "Orde ditentukan dari percobaan, bukan koefisien.",
  },
  {
    name: "Pengaruh suhu pada laju",
    latex: "v_2 = v_1 \\times x^{\\frac{\\Delta T}{T_{\\text{naik}}}}",
    field: "kimia",
    topic: "Laju Reaksi",
    note: "Contoh: laju 2× setiap kenaikan 10 °C.",
  },
  {
    name: "Entalpi reaksi (hukum Hess)",
    latex: "\\Delta H = \\Sigma \\Delta H_f^{\\text{produk}} - \\Sigma \\Delta H_f^{\\text{reaktan}}",
    field: "kimia",
    topic: "Termokimia",
    note: "ΔH negatif = eksoterm.",
  },
  {
    name: "Sifat koligatif",
    latex: "\\Delta T_b = K_b\\, m\\, i,\\quad \\Delta T_f = K_f\\, m\\, i",
    field: "kimia",
    topic: "Sifat Koligatif",
    note: "m molalitas, i faktor van't Hoff untuk elektrolit.",
  },
  {
    name: "Tekanan osmotik",
    latex: "\\pi = M R T i",
    field: "kimia",
    topic: "Sifat Koligatif",
    note: "Naik seiring jumlah partikel terlarut.",
  },
  {
    name: "Hasil kali kelarutan",
    latex: "K_{sp} = [\\mathrm{A}^{+}]^x[\\mathrm{B}^{-}]^y",
    field: "kimia",
    topic: "Kelarutan",
    note: "Mengendap bila Q > K_sp.",
  },
  {
    name: "Potensial sel",
    latex: "E^\\circ_{\\text{sel}} = E^\\circ_{\\text{katoda}} - E^\\circ_{\\text{anoda}}",
    field: "kimia",
    topic: "Elektrokimia",
    note: "Reaksi berlangsung spontan bila E° sel positif.",
  },
  {
    name: "Hukum Faraday",
    latex: "m = \\frac{e \\cdot i \\cdot t}{96500}",
    field: "kimia",
    topic: "Elektrokimia",
    note: "e = M_r/valensi, i ampere, t detik.",
  },

  /* --------------------------------- BIOLOGI ------------------------------- */
  {
    name: "Fotosintesis",
    latex: "6\\mathrm{CO_2} + 6\\mathrm{H_2O} \\xrightarrow{\\text{cahaya}} \\mathrm{C_6H_{12}O_6} + 6\\mathrm{O_2}",
    field: "biologi",
    topic: "Metabolisme",
    note: "Reaksi terang di tilakoid, siklus Calvin di stroma.",
  },
  {
    name: "Respirasi aerob",
    latex: "\\mathrm{C_6H_{12}O_6} + 6\\mathrm{O_2} \\rightarrow 6\\mathrm{CO_2} + 6\\mathrm{H_2O} + 38\\ \\mathrm{ATP}",
    field: "biologi",
    topic: "Metabolisme",
    note: "Glikolisis 2 ATP, siklus Krebs 2 ATP, transpor elektron 34 ATP.",
  },
  {
    name: "Perbandingan Mendel monohibrid",
    latex: "F_2 = 3 : 1",
    field: "biologi",
    topic: "Genetika",
    note: "Dominan : resesif dari persilangan Aa × Aa.",
  },
  {
    name: "Perbandingan dihibrid",
    latex: "F_2 = 9 : 3 : 3 : 1",
    field: "biologi",
    topic: "Genetika",
    note: "Dua sifat bebas, AaBb × AaBb.",
  },
  {
    name: "Jumlah macam gamet",
    latex: "\\text{gamet} = 2^n",
    field: "biologi",
    topic: "Genetika",
    note: "n = jumlah pasangan gen heterozigot.",
  },
  {
    name: "Hukum Hardy–Weinberg",
    latex: "p^2 + 2pq + q^2 = 1,\\quad p + q = 1",
    field: "biologi",
    topic: "Genetika Populasi",
    note: "p frekuensi alel dominan, q resesif.",
  },
  {
    name: "Pembelahan sel",
    latex: "2n \\xrightarrow{\\text{mitosis}} 2n,\\quad 2n \\xrightarrow{\\text{meiosis}} n",
    field: "biologi",
    topic: "Pembelahan Sel",
    note: "Mitosis untuk pertumbuhan, meiosis untuk gamet.",
  },
  {
    name: "Perbesaran mikroskop",
    latex: "M = M_{\\text{objektif}} \\times M_{\\text{okuler}}",
    field: "biologi",
    topic: "Biologi Sel",
    note: "Perbesaran total adalah hasil kali keduanya.",
  },
  {
    name: "Indeks keanekaragaman Shannon",
    latex: "H' = -\\sum p_i \\ln p_i",
    field: "biologi",
    topic: "Ekologi",
    note: "p_i proporsi individu tiap spesies.",
  },
  {
    name: "Pertumbuhan populasi eksponensial",
    latex: "N_t = N_0 e^{rt}",
    field: "biologi",
    topic: "Ekologi",
    note: "r laju pertumbuhan intrinsik.",
  },
  {
    name: "Laju transpirasi & potensial air",
    latex: "\\Psi_w = \\Psi_s + \\Psi_p",
    field: "biologi",
    topic: "Fisiologi Tumbuhan",
    note: "Air bergerak dari potensial tinggi ke rendah.",
  },
  {
    name: "Kode genetik",
    latex: "\\text{DNA} \\rightarrow \\text{mRNA} \\rightarrow \\text{protein}",
    field: "biologi",
    topic: "Sintesis Protein",
    note: "Transkripsi di nukleus, translasi di ribosom; 1 kodon = 3 basa.",
  },
  {
    name: "Golongan darah ABO",
    latex: "I^A, I^B > i",
    field: "biologi",
    topic: "Genetika",
    note: "I^A dan I^B kodominan, i resesif.",
  },
  {
    name: "Volume pernapasan",
    latex: "\\text{Kapasitas vital} = V_t + \\mathrm{IRV} + \\mathrm{ERV}",
    field: "biologi",
    topic: "Sistem Pernapasan",
    note: "Kapasitas total = kapasitas vital + volume residu.",
  },
  {
    name: "Filtrasi ginjal",
    latex: "\\text{Filtrasi} \\rightarrow \\text{Reabsorpsi} \\rightarrow \\text{Augmentasi}",
    field: "biologi",
    topic: "Sistem Ekskresi",
    note: "Glomerulus → tubulus proksimal → tubulus distal.",
  },
];

/** Daftar topik unik untuk satu bidang. */
export function topicsOf(field: FormulaField): string[] {
  return [...new Set(FORMULAS.filter((f) => f.field === field).map((f) => f.topic))].sort();
}

/** Pencarian sederhana: cocokkan nama, topik, catatan, LaTeX, dan kata kunci. */
export function searchFormulas(
  query: string,
  field: FormulaField | "semua" = "semua",
): FormulaEntry[] {
  const q = query.trim().toLowerCase();
  const base = field === "semua" ? FORMULAS : FORMULAS.filter((f) => f.field === field);
  if (!q) return base;
  const terms = q.split(/\s+/);
  return base.filter((f) => {
    const blob = [f.name, f.topic, f.note, f.latex, FIELD_LABELS[f.field], ...(f.keywords ?? [])]
      .join(" ")
      .toLowerCase();
    return terms.every((t) => blob.includes(t));
  });
}

/** Ekspor daftar rumus jadi Markdown (untuk disimpan ke Notes). */
export function formulasToMarkdown(entries: FormulaEntry[], title = "Rangkuman Rumus"): string {
  const byTopic = new Map<string, FormulaEntry[]>();
  for (const e of entries) {
    const key = `${FIELD_LABELS[e.field]} — ${e.topic}`;
    byTopic.set(key, [...(byTopic.get(key) ?? []), e]);
  }
  const parts = [`# ${title}`, ""];
  for (const [key, list] of byTopic) {
    parts.push(`## ${key}`, "");
    for (const e of list) {
      parts.push(`**${e.name}**`, "", `$$${e.latex}$$`, "", `${e.note}`, "");
    }
  }
  return parts.join("\n");
}
