interface Country {
  id: number;
  alpha2: string;
  alpha3: string;
  name: string;
}
export class CountriesUtil {
  private static instance: CountriesUtil;
  private countries: Country[] = countries;
  private contriesMapperByAlpha3 = new Map<string, Country>();
  private countriesMapperByName = new Map<string, Country>();
  private allAlpha3: string[] = [];
  private allNames: string[] = [];

  private constructor() {
    this.countries.forEach((country) => {
      this.contriesMapperByAlpha3.set(country.alpha3, country);
      this.countriesMapperByName.set(country.name, country);
      this.allNames.push(country.name);
      this.allAlpha3.push(country.alpha3);
    });
  }

  public static getInstance(): CountriesUtil {
    if (!CountriesUtil.instance) {
      CountriesUtil.instance = new CountriesUtil();
    }
    return CountriesUtil.instance;
  }

  getAllAlpha3() {
    return this.allAlpha3;
  }

  getAllNames() {
    return this.allNames;
  }

  getAlpha3ByName(name: string) {
    return this.countriesMapperByName.get(name)?.alpha3;
  }

  getNameByAlpha3(alpha3: string) {
    return this.contriesMapperByAlpha3.get(alpha3)?.name;
  }

  isValidAlpha3(alpha3: string) {
    return !!this.contriesMapperByAlpha3.get(alpha3);
  }

  getCountries() {
    return this.countries;
  }
}

export const countries = [
  { id: 4, alpha2: 'af', alpha3: 'afg', name: 'Afeganistão' },
  { id: 710, alpha2: 'za', alpha3: 'zaf', name: 'África do Sul' },
  { id: 8, alpha2: 'al', alpha3: 'alb', name: 'Albânia' },
  { id: 276, alpha2: 'de', alpha3: 'deu', name: 'Alemanha' },
  { id: 20, alpha2: 'ad', alpha3: 'and', name: 'Andorra' },
  { id: 24, alpha2: 'ao', alpha3: 'ago', name: 'Angola' },
  { id: 28, alpha2: 'ag', alpha3: 'atg', name: 'Antígua e Barbuda' },
  { id: 682, alpha2: 'sa', alpha3: 'sau', name: 'Arábia Saudita' },
  { id: 12, alpha2: 'dz', alpha3: 'dza', name: 'Argélia' },
  { id: 32, alpha2: 'ar', alpha3: 'arg', name: 'Argentina' },
  { id: 51, alpha2: 'am', alpha3: 'arm', name: 'Armênia' },
  { id: 36, alpha2: 'au', alpha3: 'aus', name: 'Austrália' },
  { id: 40, alpha2: 'at', alpha3: 'aut', name: 'Áustria' },
  { id: 31, alpha2: 'az', alpha3: 'aze', name: 'Azerbaijão' },
  { id: 44, alpha2: 'bs', alpha3: 'bhs', name: 'Bahamas' },
  { id: 50, alpha2: 'bd', alpha3: 'bgd', name: 'Bangladexe' },
  { id: 52, alpha2: 'bb', alpha3: 'brb', name: 'Barbados' },
  { id: 48, alpha2: 'bh', alpha3: 'bhr', name: 'Barém' },
  { id: 56, alpha2: 'be', alpha3: 'bel', name: 'Bélgica' },
  { id: 84, alpha2: 'bz', alpha3: 'blz', name: 'Belize' },
  { id: 204, alpha2: 'bj', alpha3: 'ben', name: 'Benim' },
  { id: 112, alpha2: 'by', alpha3: 'blr', name: 'Bielorrússia' },
  { id: 68, alpha2: 'bo', alpha3: 'bol', name: 'Bolívia' },
  { id: 70, alpha2: 'ba', alpha3: 'bih', name: 'Bósnia e Herzegovina' },
  { id: 72, alpha2: 'bw', alpha3: 'bwa', name: 'Botsuana' },
  { id: 76, alpha2: 'br', alpha3: 'bra', name: 'Brasil' },
  { id: 96, alpha2: 'bn', alpha3: 'brn', name: 'Brunei' },
  { id: 100, alpha2: 'bg', alpha3: 'bgr', name: 'Bulgária' },
  { id: 854, alpha2: 'bf', alpha3: 'bfa', name: 'Burquina Fasso' },
  { id: 108, alpha2: 'bi', alpha3: 'bdi', name: 'Burundi' },
  { id: 64, alpha2: 'bt', alpha3: 'btn', name: 'Butão' },
  { id: 132, alpha2: 'cv', alpha3: 'cpv', name: 'Cabo Verde' },
  { id: 116, alpha2: 'kh', alpha3: 'khm', name: 'Camboja' },
  { id: 120, alpha2: 'cm', alpha3: 'cmr', name: 'Camarões' },
  { id: 124, alpha2: 'ca', alpha3: 'can', name: 'Canadá' },
  { id: 634, alpha2: 'qa', alpha3: 'qat', name: 'Catar' },
  { id: 398, alpha2: 'kz', alpha3: 'kaz', name: 'Cazaquistão' },
  {
    id: 140,
    alpha2: 'cf',
    alpha3: 'caf',
    name: 'República Centro-Africana',
  },
  { id: 148, alpha2: 'td', alpha3: 'tcd', name: 'Chade' },
  { id: 203, alpha2: 'cz', alpha3: 'cze', name: 'Chéquia' },
  { id: 152, alpha2: 'cl', alpha3: 'chl', name: 'Chile' },
  { id: 156, alpha2: 'cn', alpha3: 'chn', name: 'China' },
  { id: 196, alpha2: 'cy', alpha3: 'cyp', name: 'Chipre' },
  { id: 170, alpha2: 'co', alpha3: 'col', name: 'Colômbia' },
  { id: 174, alpha2: 'km', alpha3: 'com', name: 'Comores' },
  { id: 178, alpha2: 'cg', alpha3: 'cog', name: 'República do Congo' },
  {
    id: 180,
    alpha2: 'cd',
    alpha3: 'cod',
    name: 'República Democrática do Congo',
  },
  { id: 410, alpha2: 'kr', alpha3: 'kor', name: 'Coreia do Sul' },
  { id: 408, alpha2: 'kp', alpha3: 'prk', name: 'Coreia do Norte' },
  { id: 384, alpha2: 'ci', alpha3: 'civ', name: 'Costa do Marfim' },
  { id: 188, alpha2: 'cr', alpha3: 'cri', name: 'Costa Rica' },
  { id: 191, alpha2: 'hr', alpha3: 'hrv', name: 'Croácia' },
  { id: 192, alpha2: 'cu', alpha3: 'cub', name: 'Cuba' },
  { id: 208, alpha2: 'dk', alpha3: 'dnk', name: 'Dinamarca' },
  { id: 262, alpha2: 'dj', alpha3: 'dji', name: 'Djibuti' },
  { id: 212, alpha2: 'dm', alpha3: 'dma', name: 'Dominica' },
  {
    id: 214,
    alpha2: 'do',
    alpha3: 'dom',
    name: 'República Dominicana',
  },
  { id: 818, alpha2: 'eg', alpha3: 'egy', name: 'Egito' },
  { id: 222, alpha2: 'sv', alpha3: 'slv', name: 'El Salvador' },
  {
    id: 784,
    alpha2: 'ae',
    alpha3: 'are',
    name: 'Emirados Árabes Unidos',
  },
  { id: 218, alpha2: 'ec', alpha3: 'ecu', name: 'Equador' },
  { id: 232, alpha2: 'er', alpha3: 'eri', name: 'Eritreia' },
  { id: 703, alpha2: 'sk', alpha3: 'svk', name: 'Eslováquia' },
  { id: 705, alpha2: 'si', alpha3: 'svn', name: 'Eslovênia' },
  { id: 724, alpha2: 'es', alpha3: 'esp', name: 'Espanha' },
  { id: 840, alpha2: 'us', alpha3: 'usa', name: 'Estados Unidos' },
  { id: 233, alpha2: 'ee', alpha3: 'est', name: 'Estónia' },
  { id: 748, alpha2: 'sz', alpha3: 'swz', name: 'Essuatíni' },
  { id: 231, alpha2: 'et', alpha3: 'eth', name: 'Etiópia' },
  { id: 242, alpha2: 'fj', alpha3: 'fji', name: 'Fiji' },
  { id: 608, alpha2: 'ph', alpha3: 'phl', name: 'Filipinas' },
  { id: 246, alpha2: 'fi', alpha3: 'fin', name: 'Finlândia' },
  { id: 250, alpha2: 'fr', alpha3: 'fra', name: 'França' },
  { id: 266, alpha2: 'ga', alpha3: 'gab', name: 'Gabão' },
  { id: 270, alpha2: 'gm', alpha3: 'gmb', name: 'Gâmbia' },
  { id: 288, alpha2: 'gh', alpha3: 'gha', name: 'Gana' },
  { id: 268, alpha2: 'ge', alpha3: 'geo', name: 'Geórgia' },
  { id: 308, alpha2: 'gd', alpha3: 'grd', name: 'Granada' },
  { id: 300, alpha2: 'gr', alpha3: 'grc', name: 'Grécia' },
  { id: 320, alpha2: 'gt', alpha3: 'gtm', name: 'Guatemala' },
  { id: 328, alpha2: 'gy', alpha3: 'guy', name: 'Guiana' },
  { id: 624, alpha2: 'gw', alpha3: 'gnb', name: 'Guiné-Bissau' },
  { id: 324, alpha2: 'gn', alpha3: 'gin', name: 'Guiné' },
  { id: 226, alpha2: 'gq', alpha3: 'gnq', name: 'Guiné Equatorial' },
  { id: 332, alpha2: 'ht', alpha3: 'hti', name: 'Haiti' },
  { id: 340, alpha2: 'hn', alpha3: 'hnd', name: 'Honduras' },
  { id: 348, alpha2: 'hu', alpha3: 'hun', name: 'Hungria' },
  { id: 887, alpha2: 'ye', alpha3: 'yem', name: 'Iêmen' },
  { id: 356, alpha2: 'in', alpha3: 'ind', name: 'Índia' },
  { id: 360, alpha2: 'id', alpha3: 'idn', name: 'Indonésia' },
  { id: 368, alpha2: 'iq', alpha3: 'irq', name: 'Iraque' },
  { id: 364, alpha2: 'ir', alpha3: 'irn', name: 'Irã' },
  { id: 372, alpha2: 'ie', alpha3: 'irl', name: 'Irlanda' },
  { id: 352, alpha2: 'is', alpha3: 'isl', name: 'Islândia' },
  { id: 376, alpha2: 'il', alpha3: 'isr', name: 'Israel' },
  { id: 380, alpha2: 'it', alpha3: 'ita', name: 'Itália' },
  { id: 388, alpha2: 'jm', alpha3: 'jam', name: 'Jamaica' },
  { id: 392, alpha2: 'jp', alpha3: 'jpn', name: 'Japão' },
  { id: 400, alpha2: 'jo', alpha3: 'jor', name: 'Jordânia' },
  { id: 414, alpha2: 'kw', alpha3: 'kwt', name: 'Kuwait' },
  { id: 418, alpha2: 'la', alpha3: 'lao', name: 'Laos' },
  { id: 426, alpha2: 'ls', alpha3: 'lso', name: 'Lesoto' },
  { id: 428, alpha2: 'lv', alpha3: 'lva', name: 'Letônia' },
  { id: 422, alpha2: 'lb', alpha3: 'lbn', name: 'Líbano' },
  { id: 430, alpha2: 'lr', alpha3: 'lbr', name: 'Libéria' },
  { id: 434, alpha2: 'ly', alpha3: 'lby', name: 'Líbia' },
  { id: 438, alpha2: 'li', alpha3: 'lie', name: 'Listenstaine' },
  { id: 440, alpha2: 'lt', alpha3: 'ltu', name: 'Lituânia' },
  { id: 442, alpha2: 'lu', alpha3: 'lux', name: 'Luxemburgo' },
  { id: 807, alpha2: 'mk', alpha3: 'mkd', name: 'Macedônia do Norte' },
  { id: 450, alpha2: 'mg', alpha3: 'mdg', name: 'Madagáscar' },
  { id: 458, alpha2: 'my', alpha3: 'mys', name: 'Malásia' },
  { id: 454, alpha2: 'mw', alpha3: 'mwi', name: 'Maláui' },
  { id: 462, alpha2: 'mv', alpha3: 'mdv', name: 'Maldivas' },
  { id: 466, alpha2: 'ml', alpha3: 'mli', name: 'Mali' },
  { id: 470, alpha2: 'mt', alpha3: 'mlt', name: 'Malta' },
  { id: 504, alpha2: 'ma', alpha3: 'mar', name: 'Marrocos' },
  { id: 584, alpha2: 'mh', alpha3: 'mhl', name: 'Ilhas Marshall' },
  { id: 480, alpha2: 'mu', alpha3: 'mus', name: 'Ilhas Maurícias' },
  { id: 478, alpha2: 'mr', alpha3: 'mrt', name: 'Mauritânia' },
  { id: 484, alpha2: 'mx', alpha3: 'mex', name: 'México' },
  { id: 104, alpha2: 'mm', alpha3: 'mmr', name: 'Mianmar' },
  {
    id: 583,
    alpha2: 'fm',
    alpha3: 'fsm',
    name: 'Estados Federados da Micronésia',
  },
  { id: 508, alpha2: 'mz', alpha3: 'moz', name: 'Moçambique' },
  { id: 498, alpha2: 'md', alpha3: 'mda', name: 'Moldávia' },
  { id: 492, alpha2: 'mc', alpha3: 'mco', name: 'Mónaco' },
  { id: 496, alpha2: 'mn', alpha3: 'mng', name: 'Mongólia' },
  { id: 499, alpha2: 'me', alpha3: 'mne', name: 'Montenegro' },
  { id: 516, alpha2: 'na', alpha3: 'nam', name: 'Namíbia' },
  { id: 520, alpha2: 'nr', alpha3: 'nru', name: 'Nauru' },
  { id: 524, alpha2: 'np', alpha3: 'npl', name: 'Nepal' },
  { id: 558, alpha2: 'ni', alpha3: 'nic', name: 'Nicarágua' },
  { id: 562, alpha2: 'ne', alpha3: 'ner', name: 'Níger' },
  { id: 566, alpha2: 'ng', alpha3: 'nga', name: 'Nigéria' },
  { id: 578, alpha2: 'no', alpha3: 'nor', name: 'Noruega' },
  { id: 554, alpha2: 'nz', alpha3: 'nzl', name: 'Nova Zelândia' },
  { id: 512, alpha2: 'om', alpha3: 'omn', name: 'Omã' },
  { id: 528, alpha2: 'nl', alpha3: 'nld', name: 'Países Baixos' },
  { id: 585, alpha2: 'pw', alpha3: 'plw', name: 'Palau' },
  { id: 591, alpha2: 'pa', alpha3: 'pan', name: 'Panamá' },
  { id: 598, alpha2: 'pg', alpha3: 'png', name: 'Papua-Nova Guiné' },
  { id: 586, alpha2: 'pk', alpha3: 'pak', name: 'Paquistão' },
  { id: 600, alpha2: 'py', alpha3: 'pry', name: 'Paraguai' },
  { id: 604, alpha2: 'pe', alpha3: 'per', name: 'Peru' },
  { id: 616, alpha2: 'pl', alpha3: 'pol', name: 'Polónia' },
  { id: 620, alpha2: 'pt', alpha3: 'prt', name: 'Portugal' },
  { id: 404, alpha2: 'ke', alpha3: 'ken', name: 'Quênia' },
  { id: 417, alpha2: 'kg', alpha3: 'kgz', name: 'Quirguistão' },
  { id: 296, alpha2: 'ki', alpha3: 'kir', name: 'Quiribáti' },
  { id: 826, alpha2: 'gb', alpha3: 'gbr', name: 'Reino Unido' },
  { id: 642, alpha2: 'ro', alpha3: 'rou', name: 'Roménia' },
  { id: 646, alpha2: 'rw', alpha3: 'rwa', name: 'Ruanda' },
  { id: 643, alpha2: 'ru', alpha3: 'rus', name: 'Rússia' },
  { id: 882, alpha2: 'ws', alpha3: 'wsm', name: 'Samoa' },
  { id: 90, alpha2: 'sb', alpha3: 'slb', name: 'Ilhas Salomão' },
  { id: 674, alpha2: 'sm', alpha3: 'smr', name: 'San Marino' },
  { id: 662, alpha2: 'lc', alpha3: 'lca', name: 'Santa Lúcia' },
  {
    id: 659,
    alpha2: 'kn',
    alpha3: 'kna',
    name: 'São Cristóvão e Neves',
  },
  { id: 678, alpha2: 'st', alpha3: 'stp', name: 'São Tomé e Príncipe' },
  {
    id: 670,
    alpha2: 'vc',
    alpha3: 'vct',
    name: 'São Vicente e Granadinas',
  },
  { id: 690, alpha2: 'sc', alpha3: 'syc', name: 'Seicheles' },
  { id: 686, alpha2: 'sn', alpha3: 'sen', name: 'Senegal' },
  { id: 144, alpha2: 'lk', alpha3: 'lka', name: 'Seri Lanca' },
  { id: 694, alpha2: 'sl', alpha3: 'sle', name: 'Serra Leoa' },
  { id: 688, alpha2: 'rs', alpha3: 'srb', name: 'Sérvia' },
  { id: 702, alpha2: 'sg', alpha3: 'sgp', name: 'Singapura' },
  { id: 760, alpha2: 'sy', alpha3: 'syr', name: 'Síria' },
  { id: 706, alpha2: 'so', alpha3: 'som', name: 'Somália' },
  { id: 729, alpha2: 'sd', alpha3: 'sdn', name: 'Sudão' },
  { id: 728, alpha2: 'ss', alpha3: 'ssd', name: 'Sudão do Sul' },
  { id: 752, alpha2: 'se', alpha3: 'swe', name: 'Suécia' },
  { id: 756, alpha2: 'ch', alpha3: 'che', name: 'Suíça' },
  { id: 740, alpha2: 'sr', alpha3: 'sur', name: 'Suriname' },
  { id: 764, alpha2: 'th', alpha3: 'tha', name: 'Tailândia' },
  { id: 762, alpha2: 'tj', alpha3: 'tjk', name: 'Tajiquistão' },
  { id: 834, alpha2: 'tz', alpha3: 'tza', name: 'Tanzânia' },
  { id: 626, alpha2: 'tl', alpha3: 'tls', name: 'Timor-Leste' },
  { id: 768, alpha2: 'tg', alpha3: 'tgo', name: 'Togo' },
  { id: 776, alpha2: 'to', alpha3: 'ton', name: 'Tonga' },
  { id: 780, alpha2: 'tt', alpha3: 'tto', name: 'Trinidad e Tobago' },
  { id: 788, alpha2: 'tn', alpha3: 'tun', name: 'Tunísia' },
  { id: 795, alpha2: 'tm', alpha3: 'tkm', name: 'Turcomenistão' },
  { id: 792, alpha2: 'tr', alpha3: 'tur', name: 'Turquia' },
  { id: 798, alpha2: 'tv', alpha3: 'tuv', name: 'Tuvalu' },
  { id: 804, alpha2: 'ua', alpha3: 'ukr', name: 'Ucrânia' },
  { id: 800, alpha2: 'ug', alpha3: 'uga', name: 'Uganda' },
  { id: 858, alpha2: 'uy', alpha3: 'ury', name: 'Uruguai' },
  { id: 860, alpha2: 'uz', alpha3: 'uzb', name: 'Uzbequistão' },
  { id: 548, alpha2: 'vu', alpha3: 'vut', name: 'Vanuatu' },
  { id: 862, alpha2: 've', alpha3: 'ven', name: 'Venezuela' },
  { id: 704, alpha2: 'vn', alpha3: 'vnm', name: 'Vietname' },
  { id: 894, alpha2: 'zm', alpha3: 'zmb', name: 'Zâmbia' },
  { id: 716, alpha2: 'zw', alpha3: 'zwe', name: 'Zimbábue' },
];
