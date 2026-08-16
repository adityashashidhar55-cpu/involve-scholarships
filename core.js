/* Involve Scholarships — matching engine.
 * Generated from packages/core/src by tools/build-core.mjs. Do not edit here.
 * Source of truth is the TypeScript; regenerate after any change to it.
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

/** "age_max lte 35" — compact quoted form of the rule. */
function formatRule(criterion           )         {
  return `${criterion.attribute} ${criterion.operator} ${JSON.stringify(criterion.value)}`;
}

function withSnippet(base        , criterion           )         {
  return criterion.source_snippet
    ? `${base} — official page: "${criterion.source_snippet}"`
    : base;
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

function evaluatePresent(
  criterion           ,
  profileValue         ,
)                                   {
  const { attribute, operator, value } = criterion;

  switch (operator) {
    case 'exists':
      // The resolver already established the field is present.
      if (typeof profileValue === 'boolean') return profileValue ? 'satisfied' : 'failed';
      return 'satisfied';

    case 'eq':
      if (typeof value === 'boolean' || typeof profileValue === 'boolean') {
        return profileValue === value ? 'satisfied' : 'failed';
      }
      if (isNumeric(profileValue) && isNumeric(value)) {
        return profileValue === value ? 'satisfied' : 'failed';
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
      let member         ;
      if (list.includes('any')) {
        member = true;
      } else if (COUNTRY_LIST_ATTRIBUTES.has(attribute)) {
        member =
          typeof profileValue === 'string' && nationalityListIncludes(list, profileValue);
      } else if (Array.isArray(profileValue)) {
        member = profileValue.some((pv) => list.some((lv) => stringEquals(lv, pv)));
      } else {
        member = list.some((lv) => stringEquals(lv, profileValue));
      }
      return operator === 'in'
        ? member
          ? 'satisfied'
          : 'failed'
        : member
          ? 'failed'
          : 'satisfied';
    }

    case 'between': {
      if (!Array.isArray(value) || value.length !== 2) return 'incomparable';
      const [min, max] = value;
      if (!isNumeric(profileValue) || !isNumeric(min) || !isNumeric(max)) return 'incomparable';
      return profileValue >= min && profileValue <= max ? 'satisfied' : 'failed';
    }
  }
}

/**
 * Evaluate one criterion against an applicant profile.
 *
 * - 'satisfied' / 'failed' when the profile carries the field the rule reads.
 * - 'unknown' when the profile lacks the field (never guessed), or when the
 *   rule and profile value are not comparable (e.g. numeric rule vs text band).
 */
function evaluateCriterion(
  criterion           ,
  profile                  ,
)                      {
  const resolved = resolveProfileValue(criterion.attribute, profile);
  const rule = formatRule(criterion);

  if (!resolved.present) {
    return {
      criterion,
      status: 'unknown',
      explanation: withSnippet(
        `Rule "${rule}" cannot be checked: your profile does not state ${resolved.fieldLabel}. Providing it is an action you can take.`,
        criterion,
      ),
    };
  }

  const outcome = evaluatePresent(criterion, resolved.value);

  if (outcome === 'incomparable') {
    return {
      criterion,
      status: 'unknown',
      explanation: withSnippet(
        `Rule "${rule}" cannot be compared against your ${resolved.fieldLabel} (${JSON.stringify(resolved.value)}) — verify this rule manually on the official page.`,
        criterion,
      ),
    };
  }

  const profileDesc = `your ${resolved.fieldLabel} is ${JSON.stringify(resolved.value)}`;
  return {
    criterion,
    status: outcome,
    explanation: withSnippet(
      outcome === 'satisfied'
        ? `Rule "${rule}" satisfied: ${profileDesc}.`
        : `Rule "${rule}" NOT satisfied: ${profileDesc}.`,
      criterion,
    ),
  };
}

/** Evaluate every criterion of a record against a profile. */
function evaluateCriteria(
  criteria                      ,
  profile                  ,
)                        {
  return criteria.map((c) => evaluateCriterion(c, profile));
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

function prefilter(profile                  , s             )                {
  if (profile.nationality) {
    const nat = profile.nationality;
    if (published(s.excluded_nationalities) && nationalityListIncludes(s.excluded_nationalities, nat)) {
      return `Pre-filter: nationality ${nat} is explicitly excluded (excluded_nationalities: [${s.excluded_nationalities.join(', ')}]).`;
    }
    if (published(s.eligible_nationalities) && !nationalityListIncludes(s.eligible_nationalities, nat)) {
      return `Pre-filter: nationality ${nat} is not in eligible_nationalities [${s.eligible_nationalities.join(', ')}].`;
    }
  }
  if (profile.study_level && published(s.study_levels) && !levelCovered(s, profile.study_level)) {
    return `Pre-filter: study level "${profile.study_level}" is not in study_levels [${s.study_levels.join(', ')}]` +
      (LEVEL_PARENT[profile.study_level] && s.study_levels.includes(LEVEL_PARENT[profile.study_level])
        ? ', and the funder excludes MBA programmes in its own wording.' : '.');
  }
  if (
    profile.destinations &&
    profile.destinations.length > 0 &&
    published(s.destination_countries) &&
    !s.destination_countries.includes('any') &&
    !overlap(s.destination_countries, profile.destinations)
  ) {
    return `Pre-filter: none of your destinations [${profile.destinations.join(', ')}] is in destination_countries [${s.destination_countries.join(', ')}].`;
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
    'Book the test now — allow roughly 1–3 months for preparation, test availability and official score reporting before the deadline.',
  admission:
    'Secure university admission first — allow roughly 2–6 months for the admission application and decision cycle.',
  nomination:
    'Secure a nomination — allow roughly 1–3 months; contact the nominating body (university / government / embassy) early.',
  missing_profile_field:
    'Provide this information or evidence — usually resolvable within days once gathered.',
};

function actionForUnknownCriterion(ev                     )                 {
  const attr = ev.criterion.attribute;
  if (TEST_SCORE_ATTRIBUTES.has(attr)) {
    const test = attr.replace('_min', '').toUpperCase();
    return {
      kind: 'missing_test_score',
      label: `Take the ${test} and report your score`,
      lead_time_note: LEAD_TIME.missing_test_score,
    };
  }
  if (attr === 'admission_required') {
    return {
      kind: 'admission',
      label: 'Obtain university admission',
      lead_time_note: LEAD_TIME.admission,
    };
  }
  return {
    kind: 'missing_profile_field',
    label: `Provide: ${attr.replace(/_/g, ' ')}`,
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

  const evaluations = evaluateCriteria(scholarship.criteria, profile);

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
      reason: `${failingRules.length} hard rule(s) failed: ${failingRules
        .map((e) => formatRule(e.criterion))
        .join('; ')}`,
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
    !seen.has('Obtain university admission')
  ) {
    seen.add('Obtain university admission');
    blockingActions.push({
      kind: 'admission',
      label: 'Obtain university admission first',
      lead_time_note: LEAD_TIME.admission,
    });
  }
  if (scholarship.requires_nomination && !seen.has('nomination')) {
    seen.add('nomination');
    blockingActions.push({
      kind: 'nomination',
      label: scholarship.nomination_note
        ? `Secure nomination (${scholarship.nomination_note})`
        : 'Secure a nomination',
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
      reason: `You meet the hard rules, but fall short of ${softFailures.length} typical (soft) bar(s): ${softFailures
        .map((e) => formatRule(e.criterion))
        .join('; ')}. Success odds are below average — strengthen these areas or treat as a stretch.`,
      failing_rules: [],
      prefilter_passed: true,
    };
  }

  // 5. all clear
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
      'Verify on the official page — dates are as last verified, not guaranteed.',
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
  buildCalendar: typeof buildCalendar === 'function' ? buildCalendar : undefined,
  toICS: typeof toICS === 'function' ? toICS : undefined,
  assertProvenance: typeof assertProvenance === 'function' ? assertProvenance : undefined,
  buildProvenance: typeof buildProvenance === 'function' ? buildProvenance : undefined,
};
})(typeof globalThis !== 'undefined' ? globalThis : this);
