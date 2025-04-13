import { isValidNumber } from 'libphonenumber-js';
import { useFormOptions } from '../utils/hooks';

import { commonValidations, generateField } from '../utils/formUtils';
import { countryPhonePrefixes, generateCountryOptions, postalCodeValidators } from '../utils/countryUtils';
import { useFetchData } from '../../../api/queryHooks';
export const getFormStepsEt = () => {
    const {
      TYPE: { SELECT, TEXT, DATE, TEXTAREA, EMAIL, PHONE, IMAGE, NUMBER, AUTO_COMPLETE_SELECT }
    } = useFormOptions();
    const { data, isLoading, error } = useFetchData("niveaux");
    const validateTELEPHONE = (value, index) => {
      // Get error label elements
      const errorTargets = document.querySelectorAll(".react-tel-input .special-label");
      const telephone1Label = errorTargets[0];
      const telephone2Label = errorTargets[1];
      const telephoneCorentLabel = errorTargets[index];
    
      // Clear any previous error classes
      telephone1Label?.classList.remove("special-label-error");
      telephone2Label?.classList.remove("special-label-error");
      telephoneCorentLabel?.classList.remove("special-label-error");
    
      // If the value is empty, consider it valid (handled elsewhere if required)
      if (!value?.trim()) return true;
      // Determine the country by matching the phone number's starting prefix
      const matchingEntry = countryPhonePrefixes.find(
        ([prefix, isoCountry]) => value.startsWith(prefix)
      );
      if (!matchingEntry) {
        telephoneCorentLabel?.classList.add("special-label-error");
        return "Le numéro ne commence pas par un préfixe reconnu";
      }
    
      // Extract the ISO country code from the mapping (second element)
      const countryCode = matchingEntry[1].toUpperCase();
    
      // Validate the phone number using libphonenumber-js and the determined country code
      if (!isValidNumber(value, countryCode)) {
        telephoneCorentLabel?.classList.add("special-label-error");
        return "Numéro invalide pour le pays sélectionné";
      }
    
      return true;  
    };

    // Define options for Parent relationship dynamically
    const lienParenteOptions = [
        "Père", "Mère", "Tuteur", "Frère", "Sœur", "Oncle", 
        "Tante", "Grand-père", "Grand-mère", "Autre"
    ]
    return [
        // Step 1: Etudiant (Student)
        {
            title: "Etudiant",
            Fields: [
                // Genre field
                generateField({
                  type: SELECT,
                  label: 'genrePl',
                  propsLabel: "Genre",
                  options: [
                    { value: 'Homme', label: 'Homme' },
                    { value: 'Femelle', label: 'Femelle' }
                  ],
                  classes:" mt-5",
                  validation: commonValidations.combine(
                    commonValidations.required("Genre"),
                    commonValidations.inArray("Genre", ["Homme", "Femelle"], "Genre doit être Homme ou Femme")
                  )
                }),
                // Profile picture field
                generateField({
                  type: IMAGE,
                  propsLabel: "Profile Picture",
                  label : "profileFileNamePl",
                  validation: commonValidations.required('Profile picture is required')
                }), 
                generateField({
                    type: TEXT,
                    label: "NomPl",
                    propsType: "text",
                    propsLabel: "Nom",
                    enablePlaceholder: true,
                    validation: commonValidations.combine(
                        commonValidations.required("Nom"),
                        commonValidations.pattern(
                          "Nom",
                          // Pattern: starts with a capital letter, then lowercase letters; allows hyphenated parts and multiple words.
                          /^([A-Z][a-z]+(?:-[A-Z][a-z]+)?)(\s[A-Z][a-z]+(?:-[A-Z][a-z]+)?)*$/,
                          `Nom doit commencer par une lettre majuscule, contenir uniquement des noms valides et avoir un seul espace entre les mots.`
                        )
                      )
                  }), 
                generateField({
                    type: TEXT,
                    label: "PrenomPl",
                    propsType: "text",
                    propsLabel: "Prenom",
                    enablePlaceholder: true,
                    validation: commonValidations.combine(
                        commonValidations.required("Prenom"),
                        commonValidations.pattern(
                          "Prenom",
                          // Pattern: starts with a capital letter, then lowercase letters; allows hyphenated parts and multiple words.
                          /^([A-Z][a-z]+(?:-[A-Z][a-z]+)?)(\s[A-Z][a-z]+(?:-[A-Z][a-z]+)?)*$/,
                          `Prenom doit commencer par une lettre majuscule, contenir uniquement des noms valides et avoir un seul espace entre les mots.`
                        )
                      )
                  }), 
                generateField({
                    type: TEXT,
                    label: "lieuNaissancePl",
                    propsType: "text",
                    propsLabel: "Lieu de Naissance",
                    enablePlaceholder: true,
                    validation: commonValidations.combine(
                        commonValidations.required("Lieu de Naissance"),
                        commonValidations.pattern(
                          "Lieu de Naissance",
                          // Pattern: starts with a capital letter, then lowercase letters; allows hyphenated parts and multiple words.
                          /^([A-Z][a-z]+(?:-[A-Z][a-z]+)?)(\s[A-Z][a-z]+(?:-[A-Z][a-z]+)?)*$/,
                          `Lieu de Naissance doit commencer par une lettre majuscule, contenir uniquement des noms valides et avoir un seul espace entre les mots.`
                        )
                      )
                  }), 
                  // Date of birth field
                  generateField({
                    type: DATE,
                    propsLabel: 'Date de Naissance',
                    label: "dateNaissancePl",
                    enableShrink: true,
                    validation: commonValidations.combine(
                      commonValidations.required('Date de Naissance'),
                      {
                        validate: (value) => {
                          const today = new Date();
                          const birthDate = new Date(value);
                          if (birthDate > today) {
                            return 'Date de Naissance ne peut pas être dans le futur';
                          }
                          let age = today.getFullYear() - birthDate.getFullYear();
                          const monthDifference = today.getMonth() - birthDate.getMonth();
                      
                          if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
                            age--;
                          }
                      
                          return age >= 6 || `Vous devez avoir au moins 6 ans`;
                        }
                      }
                    )
                  }), 
                  generateField({
                    type: SELECT,
                    propsLabel: "Nationalité",
                    label: "nationalitePl",
                    options: generateCountryOptions(),
                    validation: commonValidations.combine(
                      commonValidations.required("Nationalité"),
                      commonValidations.inArray(
                        "Nationalité",
                        generateCountryOptions().map(option => option.value),
                        `Nationalité doit être dans la liste des pays`
                      )
                    )
                  }),
                  generateField({
                    type: SELECT,
                    propsLabel: "Pays",
                    label: "paysPl",
                    options: generateCountryOptions(),
                    validation: commonValidations.combine(
                      commonValidations.required("Pays"),
                      commonValidations.inArray(
                        "Pays",
                        generateCountryOptions().map(option => option.value),
                        `Pays doit être dans la liste des pays`
                      )
                    )
                  }), 
                  generateField({
                    type: SELECT,
                    propsLabel: 'Ville',
                    label: "villePl",
                    validation: commonValidations.required('Ville')
                  }),
                  generateField({
                    type: TEXT,
                    propsType: "text",
                    label: "codePostalPl",
                    propsLabel: "Code Postal",
                    enablePlaceholder: true,
                    validation: commonValidations.combine(
                        commonValidations.required("Code Postal"),
                        {
                            validate: (value, context) => {
                              const countryCode = context?.paysPl || "";
                              const validator = postalCodeValidators[countryCode.toUpperCase()];
                              if (!validator) {
                                return "This country does not have any postal code validation";
                              }
                              const { regex, message } = validator;
                              return regex.test(value) || message("Code Postal");
                            }
                        }
                    )
                  }), 
                  generateField({
                    type: EMAIL,
                    propsLabel: 'Email',
                    label: "emailEt",
                    enablePlaceholder: true,
                    validation: commonValidations.combine(
                      commonValidations.required('Email'),
                      commonValidations.pattern(
                        'Email',
                        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        'Adresse email invalide'
                      )
                    )
                  }),
                  generateField({
                    type: PHONE,
                    propsLabel: `Téléphone`,
                    label: "phoneEt",
                    validation: commonValidations.combine(
                      { 
                        validate: (value, context) => 
                          validateTELEPHONE(value, context, 0)
                      },
                      commonValidations.required(`Téléphone`)
                    )
                  }), 
                  generateField({
                    type: TEXTAREA,
                    propsLabel: 'Adresse',
                    label: "adressPl",
                    enablePlaceholder: true,
                    extraProps: { maxLength: 321, rows: 3 },
                    validation: commonValidations.combine(
                      commonValidations.required('Adresse'),
                      commonValidations.maxLength('Adresse', 321),
                      commonValidations.minLength('Adresse', 5)
                    )
                  }), 
                  generateField({
                    type: TEXTAREA,
                    propsLabel: 'Observation',
                    label: "ObservationPl",
                    enablePlaceholder: true,
                    extraProps: { maxLength: 321, rows: 3 },
                    validation: commonValidations.combine(
                      commonValidations.maxLength('Observation', 321),
                      commonValidations.minLength('Observation', 0)
                    )
                  }),
            ]
        },
        
        // Step 2: Parent d'Etudiant (Student's Parent)
        {
            title: "Responsable d'Etudiant",
            Fields: [
                generateField({
                    type: SELECT,
                    propsLabel: "Lien de Parenté",
                    label: "lienParenteTr",
                    options: lienParenteOptions.map(value => ({
                        value,
                        label: value,
                    })),
                    validation: { 
                      required: 'Parent relationship is required',
                      validate: (value) => lienParenteOptions.includes(value) || "Veuillez sélectionner une option valide",
                    }
                  }),
                  generateField({
                    type: TEXT,
                    propsType: "text",
                    label: "NomTr",
                    propsLabel: "Nom",
                    enablePlaceholder: true,
                    validation: commonValidations.combine(
                        commonValidations.required("Nom"),
                        commonValidations.pattern(
                          "Nom",
                          // Pattern: starts with a capital letter, then lowercase letters; allows hyphenated parts and multiple words.
                          /^([A-Z][a-z]+(?:-[A-Z][a-z]+)?)(\s[A-Z][a-z]+(?:-[A-Z][a-z]+)?)*$/,
                          `Nom doit commencer par une lettre majuscule, contenir uniquement des noms valides et avoir un seul espace entre les mots.`
                        )
                      )
                  }), 
                generateField({
                    type: TEXT,
                    propsType: "text",
                    label: "PrenomTr",
                    propsLabel: "Prenom",
                    enablePlaceholder: true,
                    validation: commonValidations.combine(
                        commonValidations.required("Prenom"),
                        commonValidations.pattern(
                          "Prenom",
                          // Pattern: starts with a capital letter, then lowercase letters; allows hyphenated parts and multiple words.
                          /^([A-Z][a-z]+(?:-[A-Z][a-z]+)?)(\s[A-Z][a-z]+(?:-[A-Z][a-z]+)?)*$/,
                          `Prenom doit commencer par une lettre majuscule, contenir uniquement des noms valides et avoir un seul espace entre les mots.`
                        )
                      )
                  }), 
                generateField({
                    type: TEXT,
                    propsType: "text",
                    propsLabel: "Profession",
                    label: "professionTr",
                    value:"",
                    enablePlaceholder: true,
                    validation: { 
                        required: 'Profession is required', 
                        validate: (value) => 
                            /\b[A-Za-z]+[- ]?[A-Za-z]*'?[- ]?[A-Za-z]+\b/.test(value) 
                            || `Professiondoit commencer par une lettre majuscule, 
                                contenir uniquement des noms valides et avoir un seul espace entre les mots.`
                    }
                }),
                generateField({
                    type: PHONE,
                    propsLabel: `Téléphone N°1`,
                    label: "Phone1Tr",
                    validation: commonValidations.combine(
                      { 
                        validate: (value, context) => 
                          validateTELEPHONE(value, context, 0)
                      },
                      commonValidations.required(`Téléphone N°1`)
                    )
                  }),
                  generateField({
                    type: PHONE,
                    propsLabel: `Téléphone N°2`,
                    label: "Phone2Tr",
                    validation: commonValidations.combine(
                      { 
                        validate: (value, context) => 
                          validateTELEPHONE(value, context, 1)
                      }
                    )
                  }), 
                  generateField({
                    type: EMAIL,
                    propsLabel: 'Email',
                    label: "EmailTr",
                    enablePlaceholder: true,
                    validation: commonValidations.combine(
                      commonValidations.required('Email'),
                      commonValidations.pattern(
                        'Email',
                        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        'Adresse email invalide'
                      )
                    )
                  }),
                  generateField({
                    type: TEXTAREA,
                    propsLabel: 'Observation',
                    label: "ObservationTr",
                    enablePlaceholder: true,
                    extraProps: { maxLength: 321, rows: 3 },
                    validation: commonValidations.combine(
                      commonValidations.maxLength('Observation', 321),
                      commonValidations.minLength('Observation', 0)
                    )
                  }),
            ]   
        },
        {
            title: "Scolaire",
            Fields: [
              generateField({
                type: SELECT,
                label: 'matriculeNv',
                propsLabel: "Niveaux",
                options: (isLoading || error || !data || data?.data?.length === 0
                  ? [] // Fallback to empty array if data is not ready
                  : data?.data.map((niveau) => ({
                      value: niveau.matriculeNv,
                      label: niveau.NomNv+(niveau.parent?.NomNv ? ` (${niveau.parent?.NomNv})` : ""),
                  }))),
                validation: commonValidations.required("Niveaux")
              }),
            ]
        }
    ];
};