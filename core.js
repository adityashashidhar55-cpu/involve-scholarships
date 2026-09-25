/* Involve Scholarships — matching engine.
 * Generated from packages/core/src by tools/build-core.mjs.
 * NOTE (QA pass, Sept 2026): the comparability, grade-scale, currency and
 * plain-language changes below were made directly in this file because the
 * TypeScript source is not in this repo. Port them to packages/core/src
 * before the next regeneration, or they will be lost.
 */
(function (global) {
'use strict';
// ===== types.ts =====
/**
 * types.ts — all record + profile + result types for Involve Scholarships.
 *
 * The Funder / School / Scholarship shapes are an exact mirror of the seed JSON
 * shape defined in /mnt/agents/output/research/RECORD_FORMAT.md (binding contract).
 * Profile + result shapes follow SPEC.md §"Matching engine".
 */

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

/** ISO 3166-1 alpha-2 country code, e.g. "DE". */
                                 
/** ISO date "YYYY-MM-DD" or ISO datetime string. */
                                   

// ---------------------------------------------------------------------------
// Funder / School (RECORD_FORMAT.md §Funder / §School)
// ---------------------------------------------------------------------------

                                                                                                   

                         
               
                   
                                              
                                   
                         
 

                         
               
                            
                      
                             
                             
                             
                            
                                       
 

// ---------------------------------------------------------------------------
// Scholarship enums (RECORD_FORMAT.md)
// ---------------------------------------------------------------------------

                              
                        
                         
                  
            
                 

                                                                                             

                          
               
                  
                     
                  
                 
                
                   

                              
                            
                          
                         
                 
                                

                                                                                     

                                                                    

                                                                                    

/** Group tokens allowed in eligible_nationalities besides ISO codes (RECORD_FORMAT.md). */
                                                                                         

                                                                                             

// ---------------------------------------------------------------------------
// Criteria vocabulary (SPEC.md + RECORD_FORMAT.md)
// ---------------------------------------------------------------------------

/**
 * Attribute vocabulary from SPEC.md, plus 'study_level' which RECORD_FORMAT.md's
 * own worked example uses inside criteria[] (kept for contract compatibility).
 */
                                
             
             
             
              
             
               
               
                               
                               
            
                 
               
                
                      
                
                    
                        
                        
                       
                      
                               
                        
                 
                                                                            
                                                                          
                             
                         

                               
        
        
         
        
         
        
            
             
             

/** A single eligibility rule. is_hard=true means failure disqualifies. */
                            
                                
                              
                                                                                   
                 
                   
                                                                   
                                
 

// ---------------------------------------------------------------------------
// Requirements / procedure (RECORD_FORMAT.md)
// ---------------------------------------------------------------------------

                              
               
                     
                      
                             
 

                                                                                        

                                
                  
                
                        
                     
                        
 

                                 
                
                         
 

                                   
                                                                                 
                         
                                                                          
                                  
                         
 

                                    
                   
                      
                            
                                     
 

// ---------------------------------------------------------------------------
// Provenance (SPEC.md data integrity rules)
// ---------------------------------------------------------------------------

/**
 * The provenance block every record must carry. In the seed JSON these fields
 * live flat on the Scholarship record; this block type is the extracted view
 * used by provenance.ts and embedded in API/tool responses.
 */
                             
                     
                         
                                  
                                                                      
                                                 
 

// ---------------------------------------------------------------------------
// Scholarship (RECORD_FORMAT.md — the core record)
// ---------------------------------------------------------------------------

                              
               
               
                                                         
                      
                                                                        
                             
                          
                             
                                                   
                            
                                            
                                                    
                                                                                         
                                                                     
                                        

                                     
                                      
                                
                                  
                                       
                            
                                
                               
                            
                                    
                                  
                                  

                                      
                                                      
                                      
                                 
                                 
                                          
                                      
                               
                              
                             
                                      
                                        

                                       
                                   
                              
                                              

                                           
                                                    
                               

                       

                                                               
                     
                         
                                  
                                          

                                                             
                        
                                       
                              
                                   
 

// ---------------------------------------------------------------------------
// Seed file wrapper (RECORD_FORMAT.md top-level structure)
// ---------------------------------------------------------------------------

                           
                 
                             
                    
                    
                              
 

// ---------------------------------------------------------------------------
// Applicant profile (SPEC.md §Matching engine input)
// ---------------------------------------------------------------------------

                                                                                   

                           
                
                
 

                             
                      
                     
                       
                       
 

/**
 * All fields optional/nullable: a missing field means the engine reports
 * 'unknown' for criteria that depend on it (never guesses).
 */
                                   
                                   
                                 
                                  
                                                     
                    
                                                                         
                               
                             
                     
                              
                      
                         
                                 
                        
                                        
                                           
                                        
     
                                                                        
                                                                             
                                                                                   
     
                                          
                                                                                                    
                                            
                                   

                                                                          
                                     
                                     
                                    
                                                                 
                                     
                                                                               
                                          
                                                                                  
                                 
                                                                              
                                 
                                                                           
                                      
                                                                        
                            
                                                                                                    
                                   
     
                                                                               
                                                                                
                                                                               
                                                
     
                                           
                                                                                      
                                    
 

// ---------------------------------------------------------------------------
// Match results (SPEC.md §Matching engine output)
// ---------------------------------------------------------------------------

                        
                  
                         
                         
                   

const BUCKET_NAMES                        = [
  'eligible_now',
  'eligible_if_you_act',
  'competitive_stretch',
  'rules_not_checked',
  'not_eligible',
]         ;

                                                                 

                                      
                       
                          
                                                                                  
                      
 

                                
                        
               
                
                            

                                 
                           
                                                                           
                
                                           
                         
 

/**
 * The transparent sub-scores behind fit_score.
 * fit_score = value_score × fit × (1 / competition_factor) × deadline_urgency
 */
                             
                      
              
                             
                           
                                  
 

                              
                           
                     
                                                          
                                     
                    
                      
                                           
                                     
                                                                               
                        
                                                           
                                       
                                                                                
                            
 

                               
                              
                                     
                                     
                              
 

                              
                        
                                                                                
                              
                                     
 

// ---------------------------------------------------------------------------
// Calendar (calendar.ts)
// ---------------------------------------------------------------------------

                                                                                    

                                
                             
                      
                
               
                          
                      
                     
 


// ===== countries.ts =====
/**
 * countries.ts — embedded ISO 3166-1 alpha-2 lists backing the nationality
 * group tokens allowed by RECORD_FORMAT.md: 'any' | 'developing' | 'commonwealth' | 'eu' | 'eea'.
 *
 * 'developing' is modelled as the complement of a high-income/developed list
 * (UN/World-Bank style approximation) — documented heuristic, not a legal list.
 */

/** European Union (27 members). */
const EU_COUNTRIES                    = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU',
  'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES',
  'SE',
];

/** European Economic Area = EU + Iceland, Liechtenstein, Norway. */
const EEA_COUNTRIES                    = [...EU_COUNTRIES, 'IS', 'LI', 'NO'];

/** Commonwealth of Nations (56 members, incl. Gabon & Togo admitted 2022). */
const COMMONWEALTH_COUNTRIES                    = [
  'AG', 'AU', 'BS', 'BD', 'BB', 'BZ', 'BW', 'BN', 'CM', 'CA', 'CY', 'DM', 'FJ',
  'GA', 'GM', 'GH', 'GD', 'GY', 'IN', 'JM', 'KE', 'KI', 'LS', 'MW', 'MY', 'MV',
  'MT', 'MU', 'MZ', 'NA', 'NR', 'NZ', 'NG', 'PK', 'PG', 'RW', 'KN', 'LC', 'VC',
  'WS', 'SC', 'SL', 'SG', 'SB', 'ZA', 'LK', 'SZ', 'TZ', 'TG', 'TO', 'TT', 'TV',
  'UG', 'GB', 'VU', 'ZM',
];

/**
 * High-income / "developed" economies (approximation). 'developing' matches any
 * ISO code NOT in this set. Kept deliberately conservative.
 */
const DEVELOPED_COUNTRIES                    = [
  // Western & Northern Europe
  'AT', 'BE', 'DK', 'FI', 'FR', 'DE', 'IS', 'IE', 'IT', 'LI', 'LU', 'MT', 'NL',
  'NO', 'PT', 'ES', 'SE', 'CH', 'GB', 'AD', 'MC', 'SM', 'VA',
  // Southern Europe (high income)
  'GR', 'CY', 'SI', 'MT', 'HR',
  // Central Europe (high income)
  'CZ', 'EE', 'LV', 'LT', 'PL', 'SK', 'HU',
  // North America
  'US', 'CA', 'BM',
  // East Asia / Oceania high income
  'JP', 'KR', 'SG', 'HK', 'MO', 'TW', 'AU', 'NZ', 'BN',
  // Middle East high income
  'IL', 'AE', 'BH', 'KW', 'QA', 'SA',
  // Other high income
  'BS', 'BB', 'TT', 'UY', 'PA', 'PR', 'AW', 'CUW', 'GU', 'KY', 'VI', 'NC',
  'PF', 'GI', 'GG', 'JE', 'IM', 'FO', 'GL', 'MH', 'NR', 'PW', 'TC', 'VG', 'MP',
];

const EU_SET = new Set(EU_COUNTRIES);
const EEA_SET = new Set(EEA_COUNTRIES);
const COMMONWEALTH_SET = new Set(COMMONWEALTH_COUNTRIES);
const DEVELOPED_SET = new Set(DEVELOPED_COUNTRIES);

                                                                                    

const NATIONALITY_GROUP_TOKENS                              = [
  'any',
  'developing',
  'commonwealth',
  'eu',
  'eea',
];

function isGroupToken(value        )                            {
  return (NATIONALITY_GROUP_TOKENS                     ).includes(value);
}

/** Does a group token include the given ISO alpha-2 country code? */
function groupTokenIncludes(token                  , iso        )          {
  const code = iso.toUpperCase();
  switch (token) {
    case 'any':
      return true;
    case 'eu':
      return EU_SET.has(code);
    case 'eea':
      return EEA_SET.has(code);
    case 'commonwealth':
      return COMMONWEALTH_SET.has(code);
    case 'developing':
      return !DEVELOPED_SET.has(code);
  }
}

/**
 * Does an eligible/excluded nationality list (ISO codes + group tokens)
 * include the given ISO alpha-2 code?
 */
function nationalityListIncludes(list                   , iso        )          {
  const code = iso.toUpperCase();
  for (const entry of list) {
    if (isGroupToken(entry)) {
      if (groupTokenIncludes(entry, code)) return true;
    } else if (entry.toUpperCase() === code) {
      return true;
    }
  }
  return false;
}


// ===== provenance.ts =====
/**
 * provenance.ts — provenance block builder + enforcer (SPEC.md data integrity).
 *
 * "Provenance block enforced at serialization — a record without provenance
 * cannot serialize." assertProvenance THROWS when source_url, source_snippet
 * or last_verified_at is missing/empty.
 *
 * Pure: `now` is injected by the caller.
 */

                                                                 

class ProvenanceError extends Error {
           missing          ;
  constructor(missing          , slug         ) {
    super(
      `Provenance violation${slug ? ` on record "${slug}"` : ''}: missing or empty required field(s): ${missing.join(
        ', ',
      )}. A record without provenance cannot serialize.`,
    );
    this.name = 'ProvenanceError';
    this.missing = missing;
  }
}

                             
                
                             
                                 
                                   
                                                  
 

function missingFields(record                   )           {
  const missing           = [];
  if (!record.source_url || record.source_url.trim() === '') missing.push('source_url');
  if (!record.source_snippet || record.source_snippet.trim() === '') missing.push('source_snippet');
  if (!record.last_verified_at || String(record.last_verified_at).trim() === '') {
    missing.push('last_verified_at');
  }
  return missing;
}

/**
 * Throws ProvenanceError if source_url / source_snippet / last_verified_at is
 * missing or empty. Returns the extracted Provenance block otherwise.
 */
function assertProvenance(record                   )             {
  const missing = missingFields(record);
  if (missing.length > 0) throw new ProvenanceError(missing, record.slug);
  return {
    source_url: record.source_url ,
    source_snippet: record.source_snippet ,
    last_verified_at: String(record.last_verified_at),
    // Never upgrade an absent status to a verification claim. Unknown = null,
    // and the UI renders that as "verification status not recorded".
    verification_status: record.verification_status ?? null,
  };
}

/**
 * Build a provenance block for a record being serialized now.
 * - source_url / source_snippet must already be present (throws otherwise).
 * - last_verified_at defaults to the injected `now` when absent; if both are
 *   absent the build cannot satisfy the contract and throws.
 */
function buildProvenance(record                   , now      )             {
  const withNow                    = {
    ...record,
    last_verified_at: record.last_verified_at ?? now.toISOString(),
  };
  return assertProvenance(withNow);
}

/**
 * Serialize a record to a JSON string, enforcing provenance first.
 * This is the serialization-layer gate from SPEC.md.
 */
function serializeRecord                             (record   )         {
  assertProvenance(record);
  return JSON.stringify(record);
}


// ===== criteria.ts =====
/**
 * criteria.ts — criteria evaluation engine.
 *
 * evaluateCriterion(criterion, profile) → CriterionEvaluation with
 * status 'satisfied' | 'failed' | 'unknown' and a human-readable explanation
 * that quotes the rule (attribute, operator, value) and the source snippet
 * when the record carries one.
 *
 * 'unknown' happens when the profile lacks the field the rule reads — the
 * engine never guesses.
 *
 * Pure: no I/O, no clock, no framework imports.
 */

             
                   
            
                     
                      
                  
                    

/** Attributes whose values are country lists that may contain group tokens. */
const COUNTRY_LIST_ATTRIBUTES                                  = new Set([
  'nationality',
  'residency',
]);

/** Attributes backed by profile.special_status tokens. */
const SPECIAL_STATUS_TOKEN                                              = {
  first_generation: 'first_generation',
  disability: 'disability',
  refugee_status: 'refugee',
};

                         
                   
                 
                                                                    
                     
 

/**
 * Map a criterion attribute onto the applicant profile.
 * Returns present=false when the profile lacks the field.
 */
function resolveProfileValue(
  attribute                    ,
  profile                  ,
)                {
  const tests = profile.test_scores ?? null;
  switch (attribute) {
    case 'age_max':
    case 'age_min':
      return { present: profile.age != null, value: profile.age ?? null, fieldLabel: 'age' };
    case 'gpa_min':
      return {
        present: profile.gpa != null,
        value: profile.gpa?.value ?? null,
        fieldLabel: 'gpa',
      };
    case 'gmat_min':
      return { present: tests?.gmat != null, value: tests?.gmat ?? null, fieldLabel: 'GMAT score' };
    case 'gre_min':
      return { present: tests?.gre != null, value: tests?.gre ?? null, fieldLabel: 'GRE score' };
    case 'ielts_min':
      return { present: tests?.ielts != null, value: tests?.ielts ?? null, fieldLabel: 'IELTS score' };
    case 'toefl_min':
      return { present: tests?.toefl != null, value: tests?.toefl ?? null, fieldLabel: 'TOEFL score' };
    case 'work_experience_years_min':
    case 'work_experience_years_max':
      return {
        present: profile.work_experience_years != null,
        value: profile.work_experience_years ?? null,
        fieldLabel: 'work experience (years)',
      };
    case 'gender':
      return { present: profile.gender != null, value: profile.gender ?? null, fieldLabel: 'gender' };
    case 'nationality':
      return {
        present: profile.nationality != null,
        value: profile.nationality ?? null,
        fieldLabel: 'nationality',
      };
    case 'residency':
      return {
        present: profile.residence != null,
        value: profile.residence ?? null,
        fieldLabel: 'country of residence',
      };
    case 'income_max':
      // income_max rules are numeric caps. A band label ("low", "25k-50k") is
      // not comparable to one, so only the numeric field can satisfy the rule;
      // a band-only profile stays 'unknown' rather than producing a false pass.
      if (profile.household_income_amount != null) {
        return {
          present: true,
          value: profile.household_income_amount,
          fieldLabel: 'annual household income',
        };
      }
      return {
        present: false,
        value: null,
        fieldLabel: 'annual household income',
      };
    case 'first_generation':
    case 'disability':
    case 'refugee_status': {
      if (profile.special_status == null) {
        return { present: false, value: null, fieldLabel: `special status (${attribute})` };
      }
      const token = SPECIAL_STATUS_TOKEN[attribute] ;
      return {
        present: true,
        value: profile.special_status.includes(token),
        fieldLabel: `special status (${attribute})`,
      };
    }
    case 'prior_degree_field':
      // falls back to intended fields when a dedicated prior-degree field is absent
      if (profile.prior_degree_field != null) {
        return { present: true, value: profile.prior_degree_field, fieldLabel: 'prior degree field' };
      }
      return {
        present: profile.fields != null && profile.fields.length > 0,
        value: profile.fields ?? null,
        fieldLabel: 'prior degree field',
      };
    case 'prior_degree_class':
      return {
        present: profile.prior_degree_class != null,
        value: profile.prior_degree_class ?? null,
        fieldLabel: 'prior degree class',
      };
    case 'employment_status':
      return {
        present: profile.employment_status != null,
        value: profile.employment_status ?? null,
        fieldLabel: 'employment status',
      };
    case 'must_return_home':
      return {
        present: profile.willing_to_return_home != null,
        value: profile.willing_to_return_home ?? null,
        fieldLabel: 'willingness to return home after graduation',
      };
    case 'must_not_hold_other_award':
      // inverted polarity: rule value "true" means the applicant must NOT hold
      // another award, so we expose "does not hold another award" as the value.
      return {
        present: profile.holds_other_award != null,
        value: profile.holds_other_award == null ? null : !profile.holds_other_award,
        fieldLabel: 'does not hold another award',
      };
    case 'admission_required':
      return {
        present: profile.has_admission != null,
        value: profile.has_admission ?? null,
        fieldLabel: 'university admission',
      };
    case 'study_level':
      return {
        present: profile.study_level != null,
        value: profile.study_level ?? null,
        fieldLabel: 'study level',
      };
    case 'language_of_instruction':
      // Rule values are prose ("English B2", "Spanish B1 minimum") rather than a
      // closed vocabulary, so a match is only ever advisory. We expose the
      // languages the applicant can certify; absent = unknown, never a pass.
      return {
        present: (profile.certified_languages?.length ?? 0) > 0,
        value: profile.certified_languages ?? null,
        fieldLabel: 'certified language of instruction',
      };
    case 'enrolled_full_time':
      return {
        present: profile.enrolled_full_time != null,
        value: profile.enrolled_full_time ?? null,
        fieldLabel: 'full-time enrolment status',
      };
  }
}

/** "age_max lte 35" — compact machine form of the rule, for logs only. */
function formatRule(criterion           )         {
  return `${criterion.attribute} ${criterion.operator} ${JSON.stringify(criterion.value)}`;
}

function isNumeric(value         )                  {
  return typeof value === 'number' && Number.isFinite(value);
}

function asStringArray(value         )                  {
  if (!Array.isArray(value)) return null;
  if (!value.every((v) => typeof v === 'string')) return null;
  return value            ;
}

function stringEquals(a         , b         )          {
  return String(a).toLowerCase() === String(b).toLowerCase();
}

// ---------------------------------------------------------------------------
// Comparability. A rule can only fail you when we can really compare it.
//
// The register records many rule values as the funder's own prose
// ("international student", "ADB borrowing member countries", "Demonstrate
// financial need"). Comparing those as strings against a profile value can
// never match, so every one of them used to read as a HARD FAIL: an Indian
// applicant was "not eligible" for awards open to India because the list said
// "commonwealth eligible low-middle income countries (incl. IN ...)". A value
// we cannot read is now 'incomparable' -> unknown -> "check this yourself",
// never a rejection.
// ---------------------------------------------------------------------------

const CLOSED_VOCAB = {
  gender: ['female', 'male', 'other'],
  study_level: ['bachelor', 'masters', 'mba', 'phd', 'postdoc', 'short_course', 'mim', 'emba'],
  employment_status: ['employed_full_time', 'employed_public_sector', 'employed_ngo', 'self_employed',
    'student', 'researcher', 'unemployed'],
  prior_degree_class: ['first', 'upper_second', 'lower_second', 'other', 'in_progress'],
};

/** Attributes whose rule values are free text: matched loosely, never failed on. */
const FREE_TEXT_ATTRIBUTES = new Set(['prior_degree_field', 'language_of_instruction']);

function normGender(x         )         {
  const v = String(x).trim().toLowerCase();
  if (['female', 'woman', 'women', 'f', 'girl', 'girls'].indexOf(v) >= 0) return 'female';
  if (['male', 'man', 'men', 'm'].indexOf(v) >= 0) return 'male';
  return v;
}

function recognised(attribute                    , item         )          {
  if (typeof item === 'boolean' || isNumeric(item)) return true;
  if (typeof item !== 'string') return false;
  if (COUNTRY_LIST_ATTRIBUTES.has(attribute)) return /^[A-Z]{2}$/.test(item) || isGroupToken(item);
  if (attribute === 'gender') return CLOSED_VOCAB.gender.indexOf(normGender(item)) >= 0;
  if (CLOSED_VOCAB[attribute]) return CLOSED_VOCAB[attribute].indexOf(item.toLowerCase()) >= 0;
  return false;
}

function looseTextMatch(profileValue         , ruleItems                   )          {
  const mine = (Array.isArray(profileValue) ? profileValue : [profileValue])
    .filter((x) => typeof x === 'string' && x.trim() !== '')
    .map((x) => x.toLowerCase());
  return ruleItems.some((r) => {
    const rv = String(r).toLowerCase().trim();
    if (!rv) return false;
    return mine.some((m) => m.indexOf(rv) >= 0 || rv.indexOf(m) >= 0 || m.split(/\s+/)[0] === rv.split(/\s+/)[0]);
  });
}

function evaluatePresent(
  criterion           ,
  profileValue         ,
)                                   {
  const { attribute, operator, value } = criterion;

  // Free text (degree subject, language): a loose match is a pass, anything
  // else is for the applicant to judge. Never a fail.
  if (FREE_TEXT_ATTRIBUTES.has(attribute)) {
    if (operator === 'exists') return 'incomparable';
    const items = Array.isArray(value) ? value : [value];
    if (!items.every((v) => typeof v === 'string')) return 'incomparable';
    const hit = looseTextMatch(profileValue, items);
    if (operator === 'in' || operator === 'eq') return hit ? 'satisfied' : 'incomparable';
    return 'incomparable';
  }

  switch (operator) {
    case 'exists':
      // "exists" with a prose value means "the funder has a rule about this,
      // written in words". Having the field is not the same as meeting it.
      if (typeof profileValue === 'boolean') return profileValue ? 'satisfied' : 'failed';
      if (value === true || value == null) return 'satisfied';
      return 'incomparable';

    case 'eq':
      if (typeof value === 'boolean' || typeof profileValue === 'boolean') {
        if (typeof value !== 'boolean' || typeof profileValue !== 'boolean') return 'incomparable';
        return profileValue === value ? 'satisfied' : 'failed';
      }
      if (isNumeric(profileValue) && isNumeric(value)) {
        return profileValue === value ? 'satisfied' : 'failed';
      }
      if (!recognised(attribute, value)) return 'incomparable';
      if (attribute === 'gender') return normGender(profileValue) === normGender(value) ? 'satisfied' : 'failed';
      if (COUNTRY_LIST_ATTRIBUTES.has(attribute) && typeof profileValue === 'string') {
        return nationalityListIncludes([value], profileValue) ? 'satisfied' : 'failed';
      }
      return stringEquals(profileValue, value) ? 'satisfied' : 'failed';

    case 'lt':
    case 'lte':
    case 'gt':
    case 'gte': {
      if (!isNumeric(profileValue) || !isNumeric(value)) return 'incomparable';
      const ok =
        operator === 'lt'
          ? profileValue < value
          : operator === 'lte'
            ? profileValue <= value
            : operator === 'gt'
              ? profileValue > value
              : profileValue >= value;
      return ok ? 'satisfied' : 'failed';
    }

    case 'in':
    case 'not_in': {
      const list = asStringArray(value);
      if (!list) return 'incomparable';
      // 'any' token means unrestricted → 'in' always satisfied, 'not_in' never satisfied.
      if (list.indexOf('any') >= 0) return operator === 'in' ? 'satisfied' : 'failed';
      const known = list.filter((v) => recognised(attribute, v));
      const unreadable = list.length - known.length;
      let member         ;
      if (COUNTRY_LIST_ATTRIBUTES.has(attribute)) {
        member = typeof profileValue === 'string' && nationalityListIncludes(known, profileValue);
      } else if (attribute === 'gender') {
        member = known.some((lv) => normGender(lv) === normGender(profileValue));
      } else if (Array.isArray(profileValue)) {
        member = profileValue.some((pv) => known.some((lv) => stringEquals(lv, pv)));
      } else {
        member = known.some((lv) => stringEquals(lv, profileValue));
      }
      if (operator === 'in') return member ? 'satisfied' : unreadable ? 'incomparable' : 'failed';
      return member ? 'failed' : unreadable ? 'incomparable' : 'satisfied';
    }

    case 'between': {
      if (!Array.isArray(value) || value.length !== 2) return 'incomparable';
      const [min, max] = value;
      if (!isNumeric(profileValue) || !isNumeric(min) || !isNumeric(max)) return 'incomparable';
      return profileValue >= min && profileValue <= max ? 'satisfied' : 'failed';
    }
  }
  return 'incomparable';
}

// ---------------------------------------------------------------------------
// Grades and money need units, not just numbers.
//
// gpa_min values in the register are on many scales: 3.5 (out of 4), 60
// (percent), 7.5 (out of 10), 5 (out of 7), and 2.5 on the German scale where
// LOWER is better. The engine used to compare the raw numbers, so an Indian
// CGPA of 8.1/10 "failed" a 60% rule and "passed" a 3.7/4 rule. We now only
// compare when the rule's scale is known and matches the scale you gave.
// Income caps are the same problem with currency: a cap of 800,000 rupees and
// one of 95,000 dollars cannot both be compared with one number.
// ---------------------------------------------------------------------------

const PLAUSIBLE_SCALES = [3, 4, 4.3, 4.33, 4.5, 5, 6, 7, 9, 10, 20, 100];

function gpaRuleScale(c           )                {
  const v = Array.isArray(c.value) ? c.value[c.value.length - 1] : c.value;
  if (!isNumeric(v)) return null;
  const text = String(c.source_snippet || '');
  const found           = [];
  const patterns = [
    /(?:out of|on an?|scale of|scale:|escala de [\d.,]+ a|escala 0\s*-\s*)\s*(\d{1,3}(?:[.,]\d{1,2})?)/gi,
    /\d\s*\/\s*(\d{1,3}(?:[.,]\d{1,2})?)/g,
    /(\d{1,3}(?:[.,]\d{1,2})?)\s*-?\s*point/gi,
    /(\d{1,2})\s*=\s*max/gi,
  ];
  for (const re of patterns) {
    let m;
    re.lastIndex = 0;
    while ((m = re.exec(text))) {
      const n = Number(String(m[1]).replace(',', '.'));
      if (PLAUSIBLE_SCALES.indexOf(n) >= 0 && n >= v) found.push(n);
    }
  }
  if (v > 10 && /%|percent|per cent/i.test(text)) found.push(100);
  if (found.length) return Math.min(...found);
  return v > 10 && v <= 100 ? 100 : null;
}

function incomeRuleCurrency(c           )                {
  const t = String(c.source_snippet || '') + ' ' + String(c.value);
  if (/₹|\bRs\.?\s?\d|\blakhs?\b|\bINR\b/i.test(t)) return 'INR';
  if (/\byen\b|¥|\bJPY\b/i.test(t)) return 'JPY';
  if (/€|\bEUR\b|\beuros?\b/i.test(t)) return 'EUR';
  if (/£|\bGBP\b/.test(t)) return 'GBP';
  if (/\bA\$|\bAUD\b/.test(t)) return 'AUD';
  if (/\bC\$|\bCAD\b/.test(t)) return 'CAD';
  if (/S\/\s?\d/.test(t)) return 'PEN';
  if (/\bR\s?\d{2,3}[, ]?\d{3}/.test(t)) return 'ZAR';
  if (/\$|\bUSD\b/.test(t)) return 'USD';
  return null;
}

/** A cap on monthly pay or on the student's own earnings is not a household-income cap. */
function incomeRuleNotHousehold(c           )          {
  return /month|mensual|monatlich|per mese|par mois|own income|received by the candidate|Nebenverdienst|paid employment/i
    .test(String(c.source_snippet || ''));
}

// ---------------------------------------------------------------------------
// Plain-language wording. Everything a visitor reads about a rule comes from
// here, so it is written for someone reading English as a second language.
// Country codes are left as codes; the app turns them into names.
// ---------------------------------------------------------------------------

const FIELD_WORDS = {
  age_max: 'your age', age_min: 'your age', gpa_min: 'your grades', gmat_min: 'your GMAT score',
  gre_min: 'your GRE score', ielts_min: 'your IELTS score', toefl_min: 'your TOEFL score',
  work_experience_years_min: 'your years of work experience', work_experience_years_max: 'your years of work experience',
  gender: 'your gender', nationality: 'your nationality', residency: 'the country you live in',
  income_max: 'your family income and its currency', first_generation: 'if you are the first in your family at university',
  disability: 'if you have a disability', refugee_status: 'if you are a refugee', prior_degree_field: 'the subject of your last degree',
  prior_degree_class: 'your degree result', employment_status: 'your work situation',
  must_return_home: 'if you will go home after your studies', must_not_hold_other_award: 'if you already hold another scholarship',
  admission_required: 'if you have a university offer', study_level: 'your study level',
  language_of_instruction: 'the languages you can prove', enrolled_full_time: 'if you will study full-time',
};

const LEVEL_WORDS = { bachelor: 'Bachelor’s', masters: 'Master’s', mba: 'MBA', phd: 'PhD', postdoc: 'Postdoc',
  short_course: 'Short course', mim: 'Master’s in Management', emba: 'Executive MBA' };

function listText(v         )         {
  if (Array.isArray(v)) return v.map((x) => LEVEL_WORDS[x] || String(x)).join(', ');
  if (v === true) return 'yes';
  if (v === false) return 'no';
  if (v == null) return '';
  if (typeof v === 'object') return v.note ? String(v.note) : JSON.stringify(v);
  return String(v);
}

function said(label        , v         )         {
  const t = listText(v);
  return t && t !== 'yes' ? `${label}: ${t}` : label;
}

/** One rule, in plain words. */
function plainRule(c           )         {
  const v = c.value, op = c.operator, num = isNumeric(v);
  switch (c.attribute) {
    case 'age_max':
      if (num) return op === 'lt' ? `You must be younger than ${v}` : `You must be ${v} or younger`;
      return said('Age limit', v);
    case 'age_min':
      if (num) return op === 'gt' ? `You must be older than ${v}` : `You must be at least ${v}`;
      return said('Minimum age', v);
    case 'gpa_min': {
      if (op === 'between' && Array.isArray(v)) return `Your grades must be between ${v[0]} and ${v[1]}`;
      if (num && (op === 'gte' || op === 'gt')) {
        const sc = gpaRuleScale(c);
        return `Your grades must be at least ${v}${sc ? (sc === 100 ? '%' : ' out of ' + sc) : ''}`;
      }
      if (num && (op === 'lte' || op === 'lt')) return `Your grade must be ${v} or better (on a scale where lower is better)`;
      return said('Grades the funder looks for', v);
    }
    case 'gmat_min': case 'gre_min': case 'ielts_min': case 'toefl_min': {
      const t = c.attribute.replace('_min', '').toUpperCase();
      return num ? `${t} score of at least ${v}` : said(`${t} score needed`, v);
    }
    case 'work_experience_years_min':
      if (op === 'between' && Array.isArray(v)) return `Between ${v[0]} and ${v[1]} years of experience`;
      return num ? `At least ${v} year${v === 1 ? '' : 's'} of work experience` : said('Work experience needed', v);
    case 'work_experience_years_max':
      return num ? `No more than ${v} years of experience` : said('Experience limit', v);
    case 'gender':
      return normGender(Array.isArray(v) ? v[0] : v) === 'female' ? 'Only for women' : said('Gender', v);
    case 'nationality':
      if ((Array.isArray(v) && v.indexOf('any') >= 0) || v === 'any') return 'Open to all nationalities';
      if (op === 'in' || op === 'eq') return `Open to citizens of: ${listText(v)}`;
      if (op === 'not_in') return `Not open to citizens of: ${listText(v)}`;
      return said('Nationality', v);
    case 'residency':
      if (op === 'in' || (op === 'eq' && recognised('residency', v))) return `You must live in: ${listText(v)}`;
      if (op === 'not_in') return `Not open if you live in: ${listText(v)}`;
      return said('Where you live', v);
    case 'income_max':
      if (num) {
        const cur = incomeRuleCurrency(c);
        return `Income must be ${cur ? cur + ' ' : ''}${Number(v).toLocaleString('en')} or less`;
      }
      return said('Money', v);
    case 'first_generation': return 'For students who are the first in their family to go to university';
    case 'disability': return 'For students with a disability';
    case 'refugee_status': return 'For refugees or displaced people';
    case 'prior_degree_field':
      return (op === 'not_in' ? 'Your last degree must not be in: ' : 'Your last degree should be in: ') + listText(v);
    case 'prior_degree_class': return said('Degree result needed', v);
    case 'employment_status': return op === 'not_in' ? `Not open to: ${listText(v)}` : said('Work situation', v);
    case 'must_return_home':
      return v === true ? 'You must go back to your home country after your studies' : said('Going home after your studies', v);
    case 'must_not_hold_other_award':
      return v === true ? 'You cannot hold another big scholarship at the same time' : said('Other scholarships', v);
    case 'admission_required':
      return v === true ? 'You need a university offer first' : said('University offer', v);
    case 'study_level':
      return (op === 'not_in' ? 'Not for: ' : 'For: ') + listText(v);
    case 'language_of_instruction': return said('Language needed', v);
    case 'enrolled_full_time':
      return v === true ? 'You must study full-time' : said('Study mode', v);
  }
  return said(String(c.attribute).replace(/_/g, ' '), v);
}

function describeProfileValue(attribute                    , value         , profile                  )         {
  if (attribute === 'gpa_min' && profile.gpa) return `${profile.gpa.value} out of ${profile.gpa.scale}`;
  if (attribute === 'income_max' && profile.household_income_amount != null) {
    return `${Number(profile.household_income_amount).toLocaleString('en')}${profile.household_income_currency ? ' ' + profile.household_income_currency : ''}`;
  }
  if (attribute === 'study_level' && LEVEL_WORDS[value]) return LEVEL_WORDS[value];
  if (typeof value === 'string' && value.indexOf('_') > 0) return value.replace(/_/g, ' ');
  return listText(value);
}

/**
 * Evaluate one criterion against an applicant profile.
 *
 * - 'satisfied' / 'failed' only when the rule and your answer can really be
 *   compared (same scale, same currency, a value we can read).
 * - 'unknown' otherwise. reason_kind says why:
 *     'missing' — you did not tell us this yet
 *     'action'  — something you still have to do (get a university offer)
 *     'unclear' — the funder's rule is in words we cannot check for you
 * `record` is optional; it lets an MBA applicant pass a "Master's" level rule.
 */
function evaluateCriterion(
  criterion           ,
  profile                  ,
  record              ,
)                      {
  const rule_text = plainRule(criterion);
  const field = FIELD_WORDS[criterion.attribute] || String(criterion.attribute).replace(/_/g, ' ');
  const unknown = (reason_kind        , explanation        ) => ({
    criterion, status: 'unknown', reason_kind, rule_text, explanation,
  });
  const UNCLEAR = 'We can’t check this for you. Read this rule on the funder’s page and decide if it fits you.';

  // You said "not yet" to having a university offer: that is a step still to
  // take, not a reason you cannot apply.
  if (criterion.attribute === 'admission_required' && profile.has_admission === false) {
    return unknown('action', 'You need a university offer before you can get this award.');
  }

  // "You cannot hold another award (these ones...)": if you hold none, you
  // meet it whatever the list says.
  if (criterion.attribute === 'must_not_hold_other_award' && profile.holds_other_award === false &&
      criterion.value !== false) {
    return { criterion, status: 'satisfied', reason_kind: null, rule_text,
      explanation: 'You meet this. You told us you don\u2019t hold another scholarship.' };
  }

  const resolved = resolveProfileValue(criterion.attribute, profile);
  if (!resolved.present) {
    return unknown('missing', `We can’t check this yet. You didn’t tell us ${field}.`);
  }

  if (criterion.attribute === 'gpa_min' && profile.gpa && isNumeric(criterion.value) || 
      criterion.attribute === 'gpa_min' && profile.gpa && criterion.operator === 'between') {
    const rs = gpaRuleScale(criterion);
    if (criterion.operator === 'lte' || criterion.operator === 'lt' || !rs || Math.abs(rs - profile.gpa.scale) > 0.01) {
      return unknown('unclear', (criterion.operator === 'lte' || criterion.operator === 'lt')
        ? 'This rule uses a grading scale where a lower number is better. Check how the funder converts your grades.'
        : rs
        ? `This rule uses grades out of ${rs}. You gave yours out of ${profile.gpa.scale}. Check how the funder converts grades.`
        : 'We can’t tell which grading scale this rule uses. Check it on the funder’s page.');
    }
  }

  if (criterion.attribute === 'income_max' && isNumeric(criterion.value)) {
    const cur = incomeRuleCurrency(criterion);
    if (incomeRuleNotHousehold(criterion)) {
      return unknown('unclear', 'This limit is about monthly pay or your own earnings, not yearly family income. Check it on the funder’s page.');
    }
    if (!cur || !profile.household_income_currency || cur !== profile.household_income_currency) {
      return unknown('unclear', cur
        ? `This limit is in ${cur}. ${profile.household_income_currency ? 'You gave your income in ' + profile.household_income_currency + '.' : 'You didn’t say which currency your income is in.'} Convert it and check.`
        : 'The funder doesn’t say which currency this limit is in. Check it on their page.');
    }
  }

  let outcome = evaluatePresent(criterion, resolved.value);

  // An MBA is a master's degree unless the funder says MBAs are excluded.
  if (criterion.attribute === 'study_level' && outcome === 'failed' && (criterion.operator === 'in' || criterion.operator === 'eq') &&
      record && LEVEL_PARENT[profile.study_level]) {
    const lv = Array.isArray(criterion.value) ? criterion.value : [criterion.value];
    if (lv.indexOf(LEVEL_PARENT[profile.study_level]) >= 0 && !excludesMba(record)) outcome = 'satisfied';
  }

  if (outcome === 'incomparable') return unknown('unclear', UNCLEAR);

  const mine = describeProfileValue(criterion.attribute, resolved.value, profile);
  return {
    criterion,
    status: outcome,
    reason_kind: null,
    rule_text,
    explanation: outcome === 'satisfied'
      ? `You meet this.${mine ? ' You told us ' + field + ': ' + mine + '.' : ''}`
      : `You don’t meet this.${mine ? ' You told us ' + field + ': ' + mine + '.' : ''}`,
  };
}

/** Evaluate every criterion of a record against a profile. */
function evaluateCriteria(
  criteria                      ,
  profile                  ,
  record              ,
)                        {
  return criteria.map((c) => evaluateCriterion(c, profile, record));
}


// ===== match.ts =====
/**
 * match.ts — four-bucket classifier + transparent ranking (SPEC.md).
 *
 * Buckets (never one list):
 *   1. eligible_now          — all hard criteria satisfied, no actionable gaps
 *   2. eligible_if_you_act   — no hard failures, but ≥1 actionable gap
 *      (unknown profile field on a hard rule, missing test score, admission,
 *      nomination). The blocking action is named + lead time given.
 *   3. competitive_stretch   — hard criteria OK, soft criteria failed; plain reason
 *   4. not_eligible          — a hard rule failed (rule quoted verbatim) or the
 *      nationality/level/destination pre-filter excluded the record
 *
 * Priority order per record: not_eligible > eligible_if_you_act >
 * competitive_stretch > eligible_now.
 *
 * Ranking within buckets:
 *   fit_score = value_score × fit × (1 / competition_factor) × deadline_urgency
 * Every sub-score is exposed on the result (FitFactors) — no hidden maths.
 *
 * Pure: `now` is injected by the caller; the engine never reads the clock.
 */

             
                   
                 
             
                     
                      
             
               
              
              
              
                    

const DAY_MS = 86_400_000;

// ---------------------------------------------------------------------------
// Sub-score: value_score (0..1)
// ---------------------------------------------------------------------------

const VALUE_BASE                                                            = {
  full_ride: 1.0,
  full_tuition: 0.85,
  partial_tuition: 0.6,
  stipend_only: 0.55,
  fee_waiver: 0.4,
  travel_only: 0.3,
  loan_subsidy: 0.25,
};

/** Neutral base when the funder does not publish the coverage shape. */
const VALUE_BASE_UNKNOWN_COVERAGE = 0.35;

/** value_score: base by coverage_type, +0.05 per confirmed extra, capped at 1. */
function valueScore(s             )         {
  let v = s.coverage_type ? VALUE_BASE[s.coverage_type] : VALUE_BASE_UNKNOWN_COVERAGE;
  for (const key of ['travel', 'insurance', 'language_course']         ) {
    if (s.extras?.[key]) v += 0.05;
  }
  return Math.min(1, v);
}

// ---------------------------------------------------------------------------
// Sub-score: fit (0..1)
// ---------------------------------------------------------------------------

/** True when a record actually published this list (not null, not empty). */
function isList(v         )                         {
  return Array.isArray(v) && v.length > 0;
}

function overlap(a                   , b                   )          {
  const set = new Set(a.map((x) => x.toLowerCase()));
  return b.some((x) => set.has(x.toLowerCase()));
}

/**
 * fit: weighted alignment of field (0.4), destination (0.3), study level (0.3).
 * Each component: 1 = match or record unrestricted ("any"); 0.5 = profile
 * silent (neutral — never penalise an unknown); 0 = mismatch.
 */
function fitScore(profile                  , s             )         {
  // An unpublished list on the record scores as unknown (0.5), never as a miss.
  // Scoring it 0 would push records the funder simply did not describe to the
  // bottom of every ranking, which reads as "bad fit" rather than "not stated".
  let field        ;
  if (!isList(s.fields_of_study)) field = 0.5;
  else if (s.fields_of_study.includes('any')) field = 1;
  else if (!profile.fields || profile.fields.length === 0) field = 0.5;
  else field = overlap(s.fields_of_study, profile.fields) ? 1 : 0;

  let destination        ;
  if (!isList(s.destination_countries)) destination = 0.5;
  else if (s.destination_countries.includes('any')) destination = 1;
  else if (!profile.destinations || profile.destinations.length === 0) destination = 0.5;
  else destination = overlap(s.destination_countries, profile.destinations) ? 1 : 0;

  let level        ;
  if (!profile.study_level || !isList(s.study_levels)) level = 0.5;
  else if (s.study_levels.includes(profile.study_level)) level = 1;
  // A parent-level match is a real match, but an award that names your exact
  // level should rank above one that merely covers it.
  else level = levelCovered(s, profile.study_level) ? 0.8 : 0;

  return 0.4 * field + 0.3 * destination + 0.3 * level;
}

// ---------------------------------------------------------------------------
// Sub-score: competition_factor (>= 1; higher = more competitive)
// ---------------------------------------------------------------------------

/**
 * competition_factor heuristic from published award counts:
 *   null (unknown) → 2.0 (conservative); ≤10 → 3.0; ≤100 → 2.0;
 *   ≤1000 → 1.5; else 1.2.  +0.5 when a nomination is required.
 */
function competitionFactor(s             )         {
  let f        ;
  const n = s.number_of_awards;
  if (n == null) f = 2.0;
  else if (n <= 10) f = 3.0;
  else if (n <= 100) f = 2.0;
  else if (n <= 1000) f = 1.5;
  else f = 1.2;
  if (s.requires_nomination) f += 0.5;
  return f;
}

// ---------------------------------------------------------------------------
// Sub-score: deadline_urgency (0..1.5)
// ---------------------------------------------------------------------------

/**
 * deadline_urgency from days to deadline:
 *   closed/discontinued or past → 0.1; unknown (rolling/unpublished) → 0.5;
 *   ≤30d → 1.5; ≤90d → 1.25; ≤180d → 1.0; else 0.8.
 */
function deadlineUrgency(daysToDeadline               , status                       )         {
  if (status !== 'open') return 0.1;
  if (daysToDeadline == null) return 0.5;
  if (daysToDeadline < 0) return 0.1;
  if (daysToDeadline <= 30) return 1.5;
  if (daysToDeadline <= 90) return 1.25;
  if (daysToDeadline <= 180) return 1.0;
  return 0.8;
}

/**
 * Days from `now` to the record's relevant deadline (nearest upcoming of
 * deadline_date + round deadlines; latest past date when all have passed).
 * null when no date is published. `now` is injected — pure.
 */
function daysToDeadline(s             , now      )                {
  const dates           = [];
  if (s.deadline_date) {
    const t = Date.parse(s.deadline_date);
    if (!Number.isNaN(t)) dates.push(t);
  }
  for (const r of s.rounds ?? []) {
    if (!r.deadline) continue;
    const t = Date.parse(r.deadline);
    if (!Number.isNaN(t)) dates.push(t);
  }
  if (dates.length === 0) return null;
  const nowMs = now.getTime();
  const upcoming = dates.filter((t) => t >= nowMs).sort((a, b) => a - b);
  const chosen = upcoming.length > 0 ? upcoming[0]  : Math.max(...dates);
  return Math.floor((chosen - nowMs) / DAY_MS);
}

// ---------------------------------------------------------------------------
// Pre-filter: nationality / study level / destination
// ---------------------------------------------------------------------------

/**
 * A record list that is null/absent/empty means the funder did not publish that
 * restriction — NOT that the applicant fails it. Excluding on an unpublished
 * list would invent a restriction, and over-exclusion is the worse failure here:
 * the applicant never sees an award they may well qualify for. So an unpublished
 * list skips its prefilter and the record stays in the pool, where the record
 * page shows the field as NOT PUBLISHED for the applicant to check themselves.
 */
function published   (list                                 )                       {
  return Array.isArray(list) && list.length > 0;
}

/**
 * An MBA is a taught master's degree, and an MiM is a master's in management.
 * Funders overwhelmingly write "master's" and fund both. Treating 'mba' as a
 * level unrelated to 'masters' meant an MBA applicant matched nothing at all:
 * Chevening, Felix, Charpak, GREAT, Commonwealth and Fundación Carolina all
 * fund MBAs and all were being filtered out.
 *
 * The exception is real and must be respected. ANID's Becas Chile says, in so
 * many words, "Se excluyen programas de Magíster en Administración de empresas
 * o negocios". So the parent level is accepted by default and an explicit
 * exclusion in the funder's own wording takes it away again.
 */
var LEVEL_PARENT = { mba: 'masters', mim: 'masters', emba: 'masters' };

var MBA_EXCLUDED = new RegExp(
  '(?:excludes?|excluding|not eligible|ineligible|are excluded|se excluyen|no se financian|sind ausgeschlossen)' +
  '[^.;]{0,90}(?:mba|business administration|administración de empresas|administracion de empresas)' +
  '|(?:mba|business administration|administración de empresas|administracion de empresas)' +
  '[^.;]{0,90}(?:are not eligible|is not eligible|are excluded|is excluded|se excluyen|not funded|are not funded)',
  'i');

function excludesMba(s             )          {
  if (s && s.excludes_levels && s.excludes_levels.indexOf('mba') >= 0) return true;
  var hay = [s && s.source_snippet, s && s.nomination_note, s && s.deadline_note]
    .concat((s && s.criteria ? s.criteria : []).map(function (c) {
      return (c && (c.rule_verbatim || c.rule || c.note)) || '';
    }))
    .filter(Boolean).join(' ');
  return MBA_EXCLUDED.test(hay);
}

/**
 * Does this record's published level list cover the applicant's level?
 * Exact match first, then the parent level for MBA-family programmes.
 */
function levelCovered(s             , level         )          {
  if (!published(s.study_levels)) return true;
  if (s.study_levels.indexOf(level) >= 0) return true;
  var parent = LEVEL_PARENT[level];
  if (!parent) return false;
  if (s.study_levels.indexOf(parent) < 0) return false;
  return !excludesMba(s);
}

function shortList(list          )         {
  const a = (list || []).filter(Boolean);
  return a.length > 8 ? a.slice(0, 6).join(', ') + ` and ${a.length - 6} more` : a.join(', ');
}

/** A nationality list we can read in full: ISO codes and group tokens only. */
function readableCountryList(list          )          {
  return (list || []).every((v) => /^[A-Z]{2}$/.test(v) || isGroupToken(v));
}

function prefilter(profile                  , s             )                {
  if (profile.nationality) {
    const nat = profile.nationality;
    if (published(s.excluded_nationalities) && nationalityListIncludes(s.excluded_nationalities, nat)) {
      return `This award is not open to citizens of ${nat}.`;
    }
    // A list with a word we cannot read ("asia", "africa") might include you,
    // so it is never used to rule you out. The record page shows the list.
    if (published(s.eligible_nationalities) && readableCountryList(s.eligible_nationalities) &&
        !nationalityListIncludes(s.eligible_nationalities, nat)) {
      return `This award is only for citizens of: ${shortList(s.eligible_nationalities)}.`;
    }
  }
  if (profile.study_level && published(s.study_levels) && !levelCovered(s, profile.study_level)) {
    const mbaExcluded = LEVEL_PARENT[profile.study_level] && s.study_levels.includes(LEVEL_PARENT[profile.study_level]);
    return `This award is not for ${LEVEL_WORDS[profile.study_level] || profile.study_level} study. It is for: ${listText(s.study_levels)}.` +
      (mbaExcluded ? ' The funder says MBA courses are not included.' : '');
  }
  if (
    profile.destinations &&
    profile.destinations.length > 0 &&
    published(s.destination_countries) &&
    !s.destination_countries.includes('any') &&
    !overlap(s.destination_countries, profile.destinations)
  ) {
    return `This award is not for study in the countries you picked. It is for study in: ${shortList(s.destination_countries)}.`;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Blocking actions (bucket 2)
// ---------------------------------------------------------------------------

const TEST_SCORE_ATTRIBUTES                                  = new Set([
  'gmat_min',
  'gre_min',
  'ielts_min',
  'toefl_min',
]);

const LEAD_TIME                                         = {
  missing_test_score:
    'Book the test soon. Getting your score can take 1 to 3 months.',
  admission:
    'Apply to the university first. An offer can take 2 to 6 months.',
  nomination:
    'Ask early. Getting nominated can take 1 to 3 months.',
  missing_profile_field:
    'Add this to your profile. It takes a minute.',
  check_rule:
    'Read this rule on the funder’s page and decide if it fits you.',
};

function actionForUnknownCriterion(ev                     )                 {
  const attr = ev.criterion.attribute;
  if (attr === 'admission_required' && ev.reason_kind !== 'unclear') {
    return { kind: 'admission', label: 'Get a university offer first', lead_time_note: LEAD_TIME.admission };
  }
  if (ev.reason_kind === 'unclear') {
    return { kind: 'check_rule', label: `Check this rule yourself: ${ev.rule_text}`, lead_time_note: LEAD_TIME.check_rule };
  }
  if (TEST_SCORE_ATTRIBUTES.has(attr)) {
    const test = attr.replace('_min', '').toUpperCase();
    return { kind: 'missing_test_score', label: `Take the ${test} and add your score`, lead_time_note: LEAD_TIME.missing_test_score };
  }
  return {
    kind: 'missing_profile_field',
    label: `Tell us ${FIELD_WORDS[attr] || attr.replace(/_/g, ' ')}`,
    lead_time_note: LEAD_TIME.missing_profile_field,
  };
}

// ---------------------------------------------------------------------------
// Classification
// ---------------------------------------------------------------------------

function computeFactors(profile                  , s             , now      )             {
  const days = daysToDeadline(s, now);
  return {
    value_score: round4(valueScore(s)),
    fit: round4(fitScore(profile, s)),
    competition_factor: round4(competitionFactor(s)),
    deadline_urgency: round4(deadlineUrgency(days, s.status)),
    days_to_deadline: days,
  };
}

function round4(n        )         {
  return Math.round(n * 10_000) / 10_000;
}

function computeFitScore(f            )         {
  return round4(f.value_score * f.fit * (1 / f.competition_factor) * f.deadline_urgency);
}

/** Match one scholarship against a profile. `now` is injected (pure). */
function matchScholarship(
  profile                  ,
  scholarship             ,
  now      ,
)              {
  const factors = computeFactors(profile, scholarship, now);
  const fit_score = computeFitScore(factors);

  // 1. nationality / level / destination pre-filter
  const prefilterReason = prefilter(profile, scholarship);
  if (prefilterReason) {
    return {
      scholarship,
      bucket: 'not_eligible',
      evaluations: [],
      fit_score,
      factors,
      blocking_actions: [],
      reason: prefilterReason,
      failing_rules: [],
      prefilter_passed: false,
    };
  }

  const evaluations = evaluateCriteria(scholarship.criteria || [], profile, scholarship);

  // 2. hard failures → not_eligible (rule quoted verbatim)
  const failingRules = evaluations.filter((e) => e.criterion.is_hard && e.status === 'failed');
  if (failingRules.length > 0) {
    return {
      scholarship,
      bucket: 'not_eligible',
      evaluations,
      fit_score,
      factors,
      blocking_actions: [],
      reason: (failingRules.length === 1 ? 'You don\u2019t meet this rule: ' : 'You don\u2019t meet these rules: ') +
        failingRules.map((e) => e.rule_text).join('; ') + '.',
      failing_rules: failingRules,
      prefilter_passed: true,
    };
  }

  // 3. actionable gaps → eligible_if_you_act
  const blockingActions                   = [];
  const seen = new Set                                 ();

  for (const ev of evaluations) {
    if (ev.criterion.is_hard && ev.status === 'unknown') {
      const action = actionForUnknownCriterion(ev);
      if (!seen.has(action.label)) {
        seen.add(action.label);
        blockingActions.push(action);
      }
    }
  }
  if (
    scholarship.requires_university_admission_first &&
    profile.has_admission !== true &&
    !seen.has('Get a university offer first')
  ) {
    seen.add('Get a university offer first');
    blockingActions.push({
      kind: 'admission',
      label: 'Get a university offer first',
      lead_time_note: LEAD_TIME.admission,
    });
  }
  if (scholarship.requires_nomination && !seen.has('nomination')) {
    seen.add('nomination');
    blockingActions.push({
      kind: 'nomination',
      label: scholarship.nomination_note
        ? `Get nominated first (${scholarship.nomination_note})`
        : 'Get nominated first',
      lead_time_note: LEAD_TIME.nomination,
    });
  }

  if (blockingActions.length > 0) {
    return {
      scholarship,
      bucket: 'eligible_if_you_act',
      evaluations,
      fit_score,
      factors,
      blocking_actions: blockingActions,
      reason: null,
      failing_rules: [],
      prefilter_passed: true,
    };
  }

  // 4. soft failures → competitive_stretch
  const softFailures = evaluations.filter((e) => !e.criterion.is_hard && e.status === 'failed');
  if (softFailures.length > 0) {
    return {
      scholarship,
      bucket: 'competitive_stretch',
      evaluations,
      fit_score,
      factors,
      blocking_actions: [],
      reason: 'You meet the must-have rules, but not what the funder prefers: ' +
        softFailures.map((e) => e.rule_text).join('; ') + '. You can still apply, but it will be harder.',
      failing_rules: [],
      prefilter_passed: true,
    };
  }

  // 5. NO RULES ON FILE - the case that was silently reading as "eligible".
  //
  // A record with an empty `criteria` array cannot fail step 2, cannot raise a
  // blocking action in step 3 and cannot fail step 4, so it fell straight
  // through to "eligible now" having been checked against nothing but the
  // pre-filter: nationality, study level and destination country.
  //
  // That inverted the tool. The LESS we knew about an award, the more
  // confidently it was recommended - so the awards at the top of the list were
  // exactly the ones nobody had read the rules of. It is how a 35-year-old MBA
  // candidate was told the Rhodes Scholarship was open to them: Rhodes carries
  // a hard age limit, we had simply not recorded it, and an unrecorded rule
  // cannot fail.
  //
  // "We have not checked this one" is a different statement from "you are
  // eligible for this one". It is now said out loud, and it fails closed.
  if (!Array.isArray(scholarship.criteria) || scholarship.criteria.length === 0) {
    return {
      scholarship,
      bucket: 'rules_not_checked',
      evaluations,
      fit_score,
      factors,
      blocking_actions: [],
      reason:
        'We haven\u2019t read this award\u2019s rules yet. We only checked your nationality, ' +
        'study level and country. Read the funder\u2019s page before you spend time on it.',
      failing_rules: [],
      prefilter_passed: true,
    };
  }

  // 6. all clear - and "clear" now means checked against real rules
  return {
    scholarship,
    bucket: 'eligible_now',
    evaluations,
    fit_score,
    factors,
    blocking_actions: [],
    reason: null,
    failing_rules: [],
    prefilter_passed: true,
  };
}

function byFitScoreDesc(a             , b             )         {
  return b.fit_score - a.fit_score;
}

/**
 * Match a profile against a catalogue → four labelled buckets, each sorted by
 * fit_score descending. `now` is injected (pure).
 */
function matchScholarships(
  profile                  ,
  scholarships                        ,
  now      ,
)              {
  const buckets               = {
    eligible_now: [],
    eligible_if_you_act: [],
    competitive_stretch: [],
    rules_not_checked: [],
    not_eligible: [],
  };
  for (const s of scholarships) {
    const result = matchScholarship(profile, s, now);
    buckets[result.bucket].push(result);
  }
  for (const name of Object.keys(buckets)                ) {
    buckets[name].sort(byFitScoreDesc);
  }
  return {
    buckets,
    generated_at: now.toISOString(),
    counts: {
      eligible_now: buckets.eligible_now.length,
      eligible_if_you_act: buckets.eligible_if_you_act.length,
      competitive_stretch: buckets.competitive_stretch.length,
      rules_not_checked: buckets.rules_not_checked.length,
      not_eligible: buckets.not_eligible.length,
    },
  };
}


// ===== calendar.ts =====
/**
 * calendar.ts — funding calendar + RFC 5545 iCalendar output.
 *
 * buildCalendar(shortlistedItems) → timeline entries sorted by date.
 * toICS(entries) → a valid RFC 5545 VCALENDAR string (pure string builder):
 * CRLF line endings, 75-octet line folding, TEXT escaping, UTC DTSTAMP.
 *
 * Pure: the caller injects `now` for DTSTAMP; no clock is read internally.
 */

                                                             

/**
 * Build a sorted (date ascending, then title) timeline from shortlisted
 * scholarships. Entries: main deadline, each round deadline, application_open.
 * Records with no published dates produce no entries (never invented).
 */
function buildCalendar(shortlistedItems                        )                  {
  const entries                  = [];
  for (const s of shortlistedItems) {
    if (s.deadline_date) {
      entries.push({
        date: s.deadline_date,
        title: `Deadline: ${s.name}`,
        slug: s.slug,
        kind: 'deadline',
        note: s.deadline_note,
        url: s.application_url ?? s.source_url ?? null,
      });
    }
    for (const r of s.rounds ?? []) {
      if (!r.deadline) continue;
      entries.push({
        date: r.deadline,
        title: `Round ${r.round} deadline: ${s.name}`,
        slug: s.slug,
        kind: 'round_deadline',
        note: s.deadline_note,
        url: s.application_url ?? s.source_url ?? null,
      });
    }
    if (s.application_opens) {
      entries.push({
        date: s.application_opens,
        title: `Applications open: ${s.name}`,
        slug: s.slug,
        kind: 'application_opens',
        note: null,
        url: s.application_url ?? s.source_url ?? null,
      });
    }
  }
  entries.sort((a, b) => (a.date === b.date ? a.title.localeCompare(b.title) : a.date < b.date ? -1 : 1));
  return entries;
}

// ---------------------------------------------------------------------------
// RFC 5545 helpers
// ---------------------------------------------------------------------------

/** Escape a TEXT value per RFC 5545 §3.3.11. */
function escapeText(value        )         {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n/g, '\\n')
    .replace(/\n/g, '\\n');
}

/** Fold a content line to 75 octets per RFC 5545 §3.1 (space-continuation). */
function foldLine(line        )         {
  const encoderAvailable = typeof TextEncoder !== 'undefined';
  const bytes = (s        ) => (encoderAvailable ? new TextEncoder().encode(s).length : s.length);
  if (bytes(line) <= 75) return line;
  const parts           = [];
  let current = '';
  for (const ch of line) {
    if (bytes(current + ch) > 75) {
      parts.push(current);
      current = ' ' + ch; // continuation lines start with a single space
    } else {
      current += ch;
    }
  }
  if (current) parts.push(current);
  return parts.join('\r\n');
}

/** "2026-10-15" → "20261015"; falls back to stripping non-digits. */
function toIcsDate(isoDate        )         {
  return isoDate.slice(0, 10).replace(/[^0-9]/g, '');
}

function toIcsDateTimeUtc(d      )         {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/**
 * Render calendar entries as an RFC 5545 VCALENDAR string.
 * All-day events (DTSTART;VALUE=DATE). `now` is injected for DTSTAMP.
 */
function toICS(entries                          , now      )         {
  const dtstamp = toIcsDateTimeUtc(now);
  const lines           = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Involve Scholarships//Funding Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  // UIDs must be stable across re-downloads or calendar clients duplicate events
  // instead of updating them. Identity is (slug, kind, date); the counter only
  // disambiguates genuine collisions, so adding an unrelated entry to the
  // shortlist never renumbers the others.
  const seen = new Map                ();

  entries.forEach((e) => {
    const key = `${e.slug}-${e.kind}-${toIcsDate(e.date)}`;
    const n = seen.get(key) ?? 0;
    seen.set(key, n + 1);
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${key}${n > 0 ? `-${n}` : ''}@involve-scholarships`);
    lines.push(`DTSTAMP:${dtstamp}`);
    lines.push(`DTSTART;VALUE=DATE:${toIcsDate(e.date)}`);
    lines.push(`SUMMARY:${escapeText(e.title)}`);
    const descParts = [
      e.note ? e.note : null,
      `Record: ${e.slug}`,
      'Check the date on the funder\u2019s page. Dates can change.',
    ].filter(Boolean);
    lines.push(`DESCRIPTION:${escapeText(descParts.join(' | '))}`);
    if (e.url) lines.push(`URL:${e.url}`);
    lines.push(`CATEGORIES:${e.kind.toUpperCase()}`);
    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');
  return lines.map(foldLine).join('\r\n') + '\r\n';
}


global.InvolveCore = {
  matchScholarships: typeof matchScholarships === 'function' ? matchScholarships : undefined,
  evaluateCriterion: typeof evaluateCriterion === 'function' ? evaluateCriterion : undefined,
  plainRule: typeof plainRule === 'function' ? plainRule : undefined,
  buildCalendar: typeof buildCalendar === 'function' ? buildCalendar : undefined,
  toICS: typeof toICS === 'function' ? toICS : undefined,
  assertProvenance: typeof assertProvenance === 'function' ? assertProvenance : undefined,
  buildProvenance: typeof buildProvenance === 'function' ? buildProvenance : undefined,
};
})(typeof globalThis !== 'undefined' ? globalThis : this);
