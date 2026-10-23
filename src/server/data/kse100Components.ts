export interface KSE100Company {
  symbol: string;
  name: string;
  sector: string;
  basePrice: number;
}

export const KSE100_COMPONENTS: KSE100Company[] = [
  // Commercial Banks
  { symbol: "MEBL", name: "Meezan Bank Limited", sector: "Commercial Banks", basePrice: 245.50 },
  { symbol: "MCB", name: "MCB Bank Limited", sector: "Commercial Banks", basePrice: 228.10 },
  { symbol: "UBL", name: "United Bank Limited", sector: "Commercial Banks", basePrice: 288.75 },
  { symbol: "HBL", name: "Habib Bank Limited", sector: "Commercial Banks", basePrice: 132.40 },
  { symbol: "BAHL", name: "Bank AL Habib Limited", sector: "Commercial Banks", basePrice: 114.20 },
  { symbol: "BAFL", name: "Bank Alfalah Limited", sector: "Commercial Banks", basePrice: 68.90 },
  { symbol: "BOP", name: "The Bank of Punjab", sector: "Commercial Banks", basePrice: 7.85 },
  { symbol: "FABL", name: "Faysal Bank Limited", sector: "Commercial Banks", basePrice: 48.60 },
  { symbol: "SCBPL", name: "Standard Chartered Bank (Pakistan)", sector: "Commercial Banks", basePrice: 42.15 },
  { symbol: "NBP", name: "National Bank of Pakistan", sector: "Commercial Banks", basePrice: 53.40 },
  { symbol: "AKBL", name: "Askari Bank Limited", sector: "Commercial Banks", basePrice: 26.50 },
  { symbol: "SNBL", name: "Soneri Bank Limited", sector: "Commercial Banks", basePrice: 14.80 },

  // Oil & Gas Exploration Companies
  { symbol: "OGDC", name: "Oil & Gas Development Co.", sector: "Oil & Gas Exploration", basePrice: 154.25 },
  { symbol: "PPL", name: "Pakistan Petroleum Limited", sector: "Oil & Gas Exploration", basePrice: 128.60 },
  { symbol: "MARI", name: "Mari Petroleum Company", sector: "Oil & Gas Exploration", basePrice: 2680.00 },
  { symbol: "POL", name: "Pakistan Oilfields Limited", sector: "Oil & Gas Exploration", basePrice: 520.40 },

  // Fertilizer
  { symbol: "ENGRO", name: "Engro Corporation Limited", sector: "Fertilizer", basePrice: 345.00 },
  { symbol: "FFC", name: "Fauji Fertilizer Company", sector: "Fertilizer", basePrice: 198.80 },
  { symbol: "EFERT", name: "Engro Fertilizers Limited", sector: "Fertilizer", basePrice: 172.50 },
  { symbol: "FFBL", name: "Fauji Fertilizer Bin Qasim", sector: "Fertilizer", basePrice: 46.20 },
  { symbol: "FATIMA", name: "Fatima Fertilizer Company", sector: "Fertilizer", basePrice: 54.30 },

  // Cement
  { symbol: "LUCK", name: "Lucky Cement Limited", sector: "Cement", basePrice: 915.00 },
  { symbol: "DGKC", name: "D.G. Khan Cement Company", sector: "Cement", basePrice: 88.50 },
  { symbol: "MLCF", name: "Maple Leaf Cement Factory", sector: "Cement", basePrice: 42.10 },
  { symbol: "CHCC", name: "Cherat Cement Company", sector: "Cement", basePrice: 184.60 },
  { symbol: "FCCL", name: "Fauji Cement Company", sector: "Cement", basePrice: 24.30 },
  { symbol: "KOHC", name: "Kohat Cement Company", sector: "Cement", basePrice: 242.00 },
  { symbol: "PIOC", name: "Pioneer Cement Limited", sector: "Cement", basePrice: 146.50 },
  { symbol: "ACPL", name: "Attock Cement Pakistan", sector: "Cement", basePrice: 108.00 },
  { symbol: "FLYNG", name: "Flying Cement Company", sector: "Cement", basePrice: 9.80 },

  // Technology & Communication
  { symbol: "SYS", name: "Systems Limited", sector: "Technology & Communication", basePrice: 435.50 },
  { symbol: "TRG", name: "TRG Pakistan Limited", sector: "Technology & Communication", basePrice: 62.40 },
  { symbol: "AVN", name: "Avanceon Limited", sector: "Technology & Communication", basePrice: 58.90 },
  { symbol: "NETSOL", name: "NetSol Technologies", sector: "Technology & Communication", basePrice: 112.50 },
  { symbol: "AIRLINK", name: "Air Link Communication", sector: "Technology & Communication", basePrice: 124.00 },
  { symbol: "PTC", name: "Pakistan Telecommunication Co.", sector: "Technology & Communication", basePrice: 15.20 },
  { symbol: "WTL", name: "WorldCall Telecom Limited", sector: "Technology & Communication", basePrice: 1.35 },
  { symbol: "TELE", name: "Telecard Limited", sector: "Technology & Communication", basePrice: 7.90 },
  { symbol: "TPLP", name: "TPL Properties Limited", sector: "Technology & Communication", basePrice: 8.45 },
  { symbol: "HUMNL", name: "Hum Network Limited", sector: "Technology & Communication", basePrice: 9.10 },

  // Power Generation & Distribution
  { symbol: "HUBC", name: "The Hub Power Company", sector: "Power Generation", basePrice: 138.75 },
  { symbol: "KEL", name: "K-Electric Limited", sector: "Power Generation", basePrice: 4.85 },
  { symbol: "KAPCO", name: "Kot Addu Power Company", sector: "Power Generation", basePrice: 35.60 },
  { symbol: "NPL", name: "Nishat Power Limited", sector: "Power Generation", basePrice: 28.40 },
  { symbol: "NCPL", name: "Nishat Chunian Power", sector: "Power Generation", basePrice: 24.10 },
  { symbol: "LPL", name: "Lalpir Power Limited", sector: "Power Generation", basePrice: 18.20 },

  // Oil & Gas Marketing Companies
  { symbol: "PSO", name: "Pakistan State Oil", sector: "Oil & Gas Marketing", basePrice: 198.50 },
  { symbol: "SHEL", name: "Shell Pakistan Limited", sector: "Oil & Gas Marketing", basePrice: 168.00 },
  { symbol: "SNGP", name: "Sui Northern Gas Pipelines", sector: "Oil & Gas Marketing", basePrice: 76.50 },
  { symbol: "SSGC", name: "Sui Southern Gas Company", sector: "Oil & Gas Marketing", basePrice: 12.30 },
  { symbol: "HASCOL", name: "Hascol Petroleum Limited", sector: "Oil & Gas Marketing", basePrice: 7.40 },
  { symbol: "APL", name: "Attock Petroleum Limited", sector: "Oil & Gas Marketing", basePrice: 385.00 },

  // Refinery
  { symbol: "PRL", name: "Pakistan Refinery Limited", sector: "Refinery", basePrice: 28.90 },
  { symbol: "ATRL", name: "Attock Refinery Limited", sector: "Refinery", basePrice: 395.00 },
  { symbol: "CNERGY", name: "Cnergyico PK Limited", sector: "Refinery", basePrice: 4.60 },
  { symbol: "NRL", name: "National Refinery Limited", sector: "Refinery", basePrice: 268.00 },

  // Pharmaceuticals
  { symbol: "SEARL", name: "The Searle Company", sector: "Pharmaceuticals", basePrice: 65.50 },
  { symbol: "AGP", name: "AGP Limited", sector: "Pharmaceuticals", basePrice: 118.00 },
  { symbol: "ABOT", name: "Abbott Laboratories (Pakistan)", sector: "Pharmaceuticals", basePrice: 580.00 },
  { symbol: "GSK", name: "GlaxoSmithKline Pakistan", sector: "Pharmaceuticals", basePrice: 135.00 },
  { symbol: "HINOON", name: "Highnoon Laboratories", sector: "Pharmaceuticals", basePrice: 620.00 },
  { symbol: "IBFL", name: "IBL Healthcare", sector: "Pharmaceuticals", basePrice: 52.00 },

  // Automobile Assembler
  { symbol: "INDU", name: "Indus Motor Company", sector: "Automobile Assembler", basePrice: 1780.00 },
  { symbol: "MTL", name: "Millat Tractors Limited", sector: "Automobile Assembler", basePrice: 640.00 },
  { symbol: "HCAR", name: "Honda Atlas Cars (Pakistan)", sector: "Automobile Assembler", basePrice: 285.00 },
  { symbol: "PSMC", name: "Pak Suzuki Motor Co.", sector: "Automobile Assembler", basePrice: 410.00 },
  { symbol: "SAZEW", name: "Sazgar Engineering Works", sector: "Automobile Assembler", basePrice: 945.00 },
  { symbol: "GHNI", name: "Ghandhara Industries", sector: "Automobile Assembler", basePrice: 165.00 },

  // Chemical & Industrial
  { symbol: "EPCL", name: "Engro Polymer & Chemicals", sector: "Chemical", basePrice: 45.20 },
  { symbol: "LOTCHEM", name: "Lotte Chemical Pakistan", sector: "Chemical", basePrice: 21.80 },
  { symbol: "ICI", name: "Lucky Core Industries (ICI)", sector: "Chemical", basePrice: 920.00 },
  { symbol: "SITC", name: "Sitara Chemical Industries", sector: "Chemical", basePrice: 260.00 },
  { symbol: "BAPL", name: "Bawany Air Products", sector: "Chemical", basePrice: 18.50 },

  // Food & Personal Care
  { symbol: "NESTLE", name: "Nestle Pakistan Limited", sector: "Food & Personal Care", basePrice: 7100.00 },
  { symbol: "NATF", name: "National Foods Limited", sector: "Food & Personal Care", basePrice: 168.00 },
  { symbol: "UNITY", name: "Unity Foods Limited", sector: "Food & Personal Care", basePrice: 26.80 },
  { symbol: "MUREB", name: "Murree Brewery Company", sector: "Food & Personal Care", basePrice: 480.00 },
  { symbol: "SHEZ", name: "Shezan International", sector: "Food & Personal Care", basePrice: 125.00 },
  { symbol: "RMPL", name: "Rafhan Maize Products", sector: "Food & Personal Care", basePrice: 8400.00 },

  // Textile Composite
  { symbol: "ILP", name: "Interloop Limited", sector: "Textile Composite", basePrice: 82.50 },
  { symbol: "NML", name: "Nishat Mills Limited", sector: "Textile Composite", basePrice: 74.00 },
  { symbol: "KTML", name: "Kohinoor Textile Mills", sector: "Textile Composite", basePrice: 61.50 },
  { symbol: "GATM", name: "Gul Ahmed Textile Mills", sector: "Textile Composite", basePrice: 22.40 },
  { symbol: "FML", name: "Feroze1888 Mills", sector: "Textile Composite", basePrice: 95.00 },
  { symbol: "CRTM", name: "Crescent Textile Mills", sector: "Textile Composite", basePrice: 18.30 },

  // Engineering & Steel
  { symbol: "ISL", name: "International Steels Limited", sector: "Engineering & Steel", basePrice: 88.00 },
  { symbol: "INIL", name: "International Industries Limited", sector: "Engineering & Steel", basePrice: 142.00 },
  { symbol: "MUGHAL", name: "Mughal Iron & Steel", sector: "Engineering & Steel", basePrice: 74.50 },
  { symbol: "ASTL", name: "Amreli Steels Limited", sector: "Engineering & Steel", basePrice: 22.80 },
  { symbol: "AGHA", name: "Agha Steel Industries", sector: "Engineering & Steel", basePrice: 14.10 },

  // Glass & Ceramics
  { symbol: "TGL", name: "Tariq Glass Industries", sector: "Glass & Ceramics", basePrice: 118.00 },
  { symbol: "GHGL", name: "Ghani Glass Limited", sector: "Glass & Ceramics", basePrice: 38.50 },
  { symbol: "SHFA", name: "Shifa International Hospitals", sector: "Healthcare", basePrice: 165.00 },

  // Paper & Board
  { symbol: "PKGS", name: "Packages Limited", sector: "Paper & Board", basePrice: 510.00 },
  { symbol: "SEPL", name: "Security Papers Limited", sector: "Paper & Board", basePrice: 135.00 },
  { symbol: "CEPB", name: "Century Paper & Board Mills", sector: "Paper & Board", basePrice: 64.00 },

  // Cables & Electrical Goods
  { symbol: "PAEL", name: "Pak Elektron Limited", sector: "Electrical Goods", basePrice: 26.40 },
  { symbol: "PGLC", name: "Pakline Cables", sector: "Electrical Goods", basePrice: 88.00 },

  // Transport & Logistics
  { symbol: "PNSC", name: "Pakistan National Shipping Corp.", sector: "Transport", basePrice: 320.00 },

  // Automobile Parts & Accessories
  { symbol: "THALL", name: "Thal Limited", sector: "Auto Parts", basePrice: 330.00 },
  { symbol: "GTYR", name: "General Tyre and Rubber", sector: "Auto Parts", basePrice: 36.50 },

  // Real Estate Investment Trust & Misc
  { symbol: "DCR", name: "Dolmen City REIT", sector: "Real Estate", basePrice: 16.20 },
  { symbol: "TOMCL", name: "The Organic Meat Company", sector: "Food & Meat", basePrice: 32.50 },
  { symbol: "BIPL", name: "BankIslami Pakistan", sector: "Commercial Banks", basePrice: 34.20 },
  { symbol: "GADT", name: "Gadoon Textile Mills", sector: "Textile Composite", basePrice: 245.00 },
  { symbol: "BIFO", name: "Bannu Woollen Mills", sector: "Textile Composite", basePrice: 38.00 }
];
