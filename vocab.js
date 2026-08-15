/* vocab.js: human-readable names and the intake vocabulary.
 * Country codes are never shown to a user; every surface resolves through
 * COUNTRY_NAME. Pseudo-codes the register uses for groups (any, eea,
 * commonwealth, developing) are spelled out too. */
(function (global) {
  'use strict';

  var COUNTRY_NAME = {
    AE: 'United Arab Emirates', AF: 'Afghanistan', AG: 'Antigua and Barbuda', AI: 'Anguilla',
    AO: 'Angola', AR: 'Argentina', AT: 'Austria', AU: 'Australia', AZ: 'Azerbaijan',
    BB: 'Barbados', BD: 'Bangladesh', BE: 'Belgium', BF: 'Burkina Faso', BH: 'Bahrain',
    BJ: 'Benin', BM: 'Bermuda', BO: 'Bolivia', BR: 'Brazil', BS: 'Bahamas', BY: 'Belarus',
    BZ: 'Belize', CA: 'Canada', CG: 'Republic of the Congo', CH: 'Switzerland',
    CI: 'Côte d’Ivoire', CL: 'Chile', CM: 'Cameroon', CN: 'China', CO: 'Colombia',
    CR: 'Costa Rica', CU: 'Cuba', CV: 'Cabo Verde', DE: 'Germany', DM: 'Dominica',
    DO: 'Dominican Republic', DZ: 'Algeria', EC: 'Ecuador', EG: 'Egypt', ES: 'Spain',
    ET: 'Ethiopia', FR: 'France', GA: 'Gabon', GB: 'United Kingdom', GD: 'Grenada',
    GH: 'Ghana', GM: 'Gambia', GN: 'Guinea', GQ: 'Equatorial Guinea', GR: 'Greece',
    GT: 'Guatemala', GW: 'Guinea-Bissau', GY: 'Guyana', HK: 'Hong Kong SAR', HN: 'Honduras',
    HT: 'Haiti', ID: 'Indonesia', IE: 'Ireland', IL: 'Israel', IN: 'India', IS: 'Iceland',
    IT: 'Italy', JM: 'Jamaica', JP: 'Japan', KE: 'Kenya', KG: 'Kyrgyzstan', KM: 'Comoros',
    KN: 'Saint Kitts and Nevis', KR: 'South Korea', KW: 'Kuwait', KY: 'Cayman Islands',
    KZ: 'Kazakhstan', LC: 'Saint Lucia', LK: 'Sri Lanka', LR: 'Liberia', LY: 'Libya',
    MA: 'Morocco', MG: 'Madagascar', ML: 'Mali', MR: 'Mauritania', MS: 'Montserrat',
    MX: 'Mexico', MY: 'Malaysia', MZ: 'Mozambique', NE: 'Niger', NG: 'Nigeria',
    NI: 'Nicaragua', NL: 'Netherlands', NO: 'Norway', NZ: 'New Zealand', OM: 'Oman',
    PA: 'Panama', PE: 'Peru', PH: 'Philippines', PK: 'Pakistan', PL: 'Poland',
    PT: 'Portugal', PY: 'Paraguay', QA: 'Qatar', RU: 'Russia', SA: 'Saudi Arabia',
    SD: 'Sudan', SE: 'Sweden', SG: 'Singapore', SL: 'Sierra Leone', SN: 'Senegal',
    SO: 'Somalia', SR: 'Suriname', SV: 'El Salvador', SY: 'Syria',
    TC: 'Turks and Caicos Islands', TD: 'Chad', TG: 'Togo', TH: 'Thailand',
    TJ: 'Tajikistan', TN: 'Tunisia', TR: 'Türkiye', TT: 'Trinidad and Tobago',
    TZ: 'Tanzania', UG: 'Uganda', US: 'United States', UY: 'Uruguay', UZ: 'Uzbekistan',
    VC: 'Saint Vincent and the Grenadines', VE: 'Venezuela', VG: 'British Virgin Islands',
    VN: 'Vietnam', ZA: 'South Africa',
    AL: 'Albania', AM: 'Armenia', BA: 'Bosnia and Herzegovina', BG: 'Bulgaria',
    BW: 'Botswana', CD: 'Democratic Republic of the Congo', CF: 'Central African Republic',
    CZ: 'Czechia', DK: 'Denmark', EE: 'Estonia', FI: 'Finland', FJ: 'Fiji',
    FM: 'Micronesia', FO: 'Faroe Islands', GE: 'Georgia', GL: 'Greenland',
    HU: 'Hungary', IQ: 'Iraq', IR: 'Iran', JO: 'Jordan', KH: 'Cambodia',
    KI: 'Kiribati', LA: 'Laos', LB: 'Lebanon', LS: 'Lesotho', LT: 'Lithuania',
    LU: 'Luxembourg', LV: 'Latvia', MD: 'Moldova', ME: 'Montenegro',
    MH: 'Marshall Islands', MK: 'North Macedonia', MM: 'Myanmar', MN: 'Mongolia',
    MU: 'Mauritius', MV: 'Maldives', MW: 'Malawi', NA: 'Namibia',
    NC: 'New Caledonia', NP: 'Nepal', NR: 'Nauru', NU: 'Niue',
    PF: 'French Polynesia', PG: 'Papua New Guinea', PS: 'Palestine', PW: 'Palau',
    RO: 'Romania', RS: 'Serbia', RW: 'Rwanda', SB: 'Solomon Islands',
    SH: 'Saint Helena', SI: 'Slovenia', SK: 'Slovakia', SZ: 'Eswatini',
    TL: 'Timor-Leste', TO: 'Tonga', TV: 'Tuvalu', TW: 'Taiwan', UA: 'Ukraine',
    VU: 'Vanuatu', WF: 'Wallis and Futuna', WS: 'Samoa', XK: 'Kosovo',
    ZM: 'Zambia', ZW: 'Zimbabwe', BN: 'Brunei', MO: 'Macao SAR', BT: 'Bhutan',
    BI: 'Burundi', DJ: 'Djibouti', ER: 'Eritrea', ST: 'São Tomé and Príncipe',
    YE: 'Yemen', SS: 'South Sudan', KP: 'North Korea', TK: 'Tokelau',
    MT: 'Malta', CY: 'Cyprus', HR: 'Croatia', LI: 'Liechtenstein',
    // group pseudo-codes used by the register
    EU: 'European Union', eea: 'European Economic Area',
    any: 'Open to any country', commonwealth: 'Commonwealth countries',
    africa: 'African countries', asia: 'Asian countries',
    developing: 'Developing countries (funder’s own list)'
  };

  function countryName(code) {
    if (!code) return '';
    return COUNTRY_NAME[code] || COUNTRY_NAME[String(code).toUpperCase()] || String(code);
  }

  /** Broad course groups mapped onto the free-text fields the register uses. */
  var COURSE_GROUPS = [
    { key: 'business', label: 'Business & management', match: ['business', 'management', 'mba', 'economics', 'finance', 'entrepreneur', 'administration'] },
    { key: 'engineering', label: 'Engineering & technology', match: ['engineering', 'technology', 'mechatronics', 'control systems', 'electrical', 'petroleum', 'infrastructure', 'e-mobility', 'advanced technologies', 'high technology'] },
    { key: 'computing', label: 'Computer science & AI', match: ['computer', 'artificial intelligence', 'machine learning', 'information technology', 'robotics', 'computer vision', 'natural language', 'digital'] },
    { key: 'health', label: 'Medicine & health', match: ['health', 'medicine', 'medical', 'paramed', 'public health'] },
    { key: 'sciences', label: 'Natural sciences & mathematics', match: ['science', 'sciences', 'mathematics', 'biology', 'geoscience', 'natural sciences', 'applied sciences'] },
    { key: 'environment', label: 'Environment & sustainability', match: ['environment', 'climate', 'sustainab', 'ecological', 'energy', 'agricultur', 'food systems', 'natural resources'] },
    { key: 'law', label: 'Law & governance', match: ['law', 'legal', 'governance', 'political', 'public policy', 'public administration', 'peace and conflict', 'international studies', 'global affairs'] },
    { key: 'social', label: 'Social sciences & development', match: ['social', 'development', 'humanities', 'education', 'urban', 'social protection'] },
    { key: 'arts', label: 'Arts, media & humanities', match: ['arts', 'fine arts', 'design', 'performing', 'media', 'journalism', 'communications', 'literature', 'history', 'language', 'yoga', 'culture'] }
  ];

  var STUDY_LEVELS = [
    { key: 'bachelor', label: 'Bachelor’s' }, { key: 'masters', label: 'Master’s' },
    { key: 'mba', label: 'MBA' }, { key: 'phd', label: 'PhD / doctorate' },
    { key: 'postdoc', label: 'Postdoctoral' }, { key: 'short_course', label: 'Short course / training' }
  ];

  /** Circumstances funders actually price in. Free text covers the rest. */
  var STATUSES = [
    { key: 'first_generation', label: 'First in my family to attend university' },
    { key: 'disability', label: 'Applicant with a disability' },
    { key: 'refugee', label: 'Refugee or displaced' },
    { key: 'woman_in_stem', label: 'Woman in STEM' },
    { key: 'indigenous', label: 'Indigenous or First Nations' },
    { key: 'rural_remote', label: 'From a rural or remote area' },
    { key: 'care_experienced', label: 'Care-experienced' },
    { key: 'single_parent', label: 'Single parent' },
    { key: 'veteran', label: 'Military veteran' },
    { key: 'public_servant', label: 'Government or public-sector employee' },
    { key: 'ngo_worker', label: 'NGO or development-sector worker' }
  ];

  var DEGREE_CLASSES = [
    { key: 'first', label: 'First class / distinction' },
    { key: 'upper_second', label: 'Upper second (2:1) / merit' },
    { key: 'lower_second', label: 'Lower second (2:2) / pass' },
    { key: 'other', label: 'Other or not classified' },
    { key: 'in_progress', label: 'Still studying' }
  ];

  var EMPLOYMENT = [
    { key: 'employed_full_time', label: 'Employed full-time' },
    { key: 'employed_public_sector', label: 'Employed in the public sector' },
    { key: 'employed_ngo', label: 'Employed by an NGO or development agency' },
    { key: 'self_employed', label: 'Self-employed or founder' },
    { key: 'student', label: 'Full-time student' },
    { key: 'researcher', label: 'Researcher or academic' },
    { key: 'unemployed', label: 'Not currently working' }
  ];

  var LANGUAGES = [
    'English B2+', 'English C1+', 'French B2+', 'Spanish B1+', 'Spanish B2+',
    'German B2+', 'Italian B2+', 'Portuguese B2+', 'Japanese (JLPT N2+)',
    'Korean (TOPIK 3+)', 'Chinese (HSK 4+)', 'Arabic B2+'
  ];

  var CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'SGD', 'AED', 'ZAR', 'NGN', 'KES', 'BRL', 'MXN', 'PHP', 'IDR', 'PKR', 'BDT', 'LKR', 'JPY', 'CNY'];

  var INTAKE_TERMS = [
    { key: 'autumn', label: 'Autumn (September or October)' },
    { key: 'spring', label: 'Spring (January to March)' },
    { key: 'summer', label: 'Summer' },
    { key: 'rolling', label: 'Rolling or unsure' }
  ];

  /**
   * Which Involve service helps with a given requirement.
   * Resume/CV work → involveresume.com. Anything written and argued —
   * essays, statements, references, interviews → involve-consulting.com.
   */
  var HELP_RULES = [
    { svc: 'resume', match: /\b(cv|curriculum vitae|r[ée]sum[ée])\b/i },
    { svc: 'consulting', match: /\b(essay|personal statement|supporting statement|statement of purpose|motivation|cover letter|letter of recommendation|recommendation|referee|reference|research proposal|work plan|study plan|interview|leadership|portfolio)\b/i }
  ];

  var HELP_COPY = {
    resume: {
      name: 'Involve Resume',
      url: 'https://involveresume.com',
      line: 'Scholarship panels read a CV differently from employers — Involve Resume builds the academic-format version this asks for.'
    },
    consulting: {
      name: 'Involve Consulting',
      url: 'https://involve-consulting.com',
      line: 'Essays, statements, references and interviews are where funded places are won and lost — Involve Consulting works on these with you.'
    }
  };

  function helpFor(text) {
    for (var i = 0; i < HELP_RULES.length; i++) {
      if (HELP_RULES[i].match.test(String(text || ''))) return HELP_RULES[i].svc;
    }
    return null;
  }

  global.INVOLVE_VOCAB = {
    COUNTRY_NAME: COUNTRY_NAME, countryName: countryName,
    COURSE_GROUPS: COURSE_GROUPS, STUDY_LEVELS: STUDY_LEVELS, STATUSES: STATUSES,
    DEGREE_CLASSES: DEGREE_CLASSES, EMPLOYMENT: EMPLOYMENT, LANGUAGES: LANGUAGES,
    CURRENCIES: CURRENCIES, INTAKE_TERMS: INTAKE_TERMS,
    HELP_COPY: HELP_COPY, helpFor: helpFor
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
