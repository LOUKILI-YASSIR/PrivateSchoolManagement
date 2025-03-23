  import { isValidNumber } from 'libphonenumber-js';
import { useFormOptions } from '../utils/hooks';
import { commonValidations, formatLabel, generateField } from '../utils/formUtils';
import { countryPhonePrefixes, generateCountryOptions, postalCodeValidators } from '../utils/countryUtils';
  export const getFormSharedOptions = () => {
    const FORM_OPTION = useFormOptions();
    const {
      TYPE: { SELECT, TEXT, DATE, TEXTAREA, EMAIL, PHONE, IMAGE, NUMBER, AUTO_COMPLETE_SELECT }
    } = FORM_OPTION;
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
    
    return {
      FORM_OPTION,
  
      // Genre field
      GENRE: generateField({
        type: SELECT,
        label: 'Genre',
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
  
      // Name-related fields: NOM, PRENOM, LIEU_NAISSANCE, CODE_POSTAL
      ...["NOM", "PRENOM", "LIEU_NAISSANCE", "CODE_POSTAL"].reduce((acc, field) => {
        const fieldLabel = formatLabel(field);
  
        // Base validations: required and pattern.
        const baseValidations = commonValidations.combine(
          commonValidations.required(fieldLabel),
          commonValidations.pattern(
            fieldLabel,
            // Pattern: starts with a capital letter, then lowercase letters; allows hyphenated parts and multiple words.
            /^([A-Z][a-z]+(?:-[A-Z][a-z]+)?)(\s[A-Z][a-z]+(?:-[A-Z][a-z]+)?)*$/,
            `${fieldLabel} doit commencer par une lettre majuscule, contenir uniquement des noms valides et avoir un seul espace entre les mots.`
          )
        );
  
        // If the field is CODE_POSTAL, add a postal code validator.
        const validations =
          field === "CODE_POSTAL"
            ? commonValidations.combine(
                commonValidations.required(fieldLabel),
                {
                    validate: (value, context) => {
                      const countryCode = context?.PAYS_1 || "";
                      const validator = postalCodeValidators[countryCode.toUpperCase()];
                      if (!validator) {
                        return "This country does not have any postal code validation";
                      }
                      const { regex, message } = validator;
                      return regex.test(value) || message(fieldLabel);
                    }
                }
            ) : baseValidations;
  
        acc[field] = generateField({
          type: TEXT,
          // For PRENOM, adjust the label (replace "e" with "è") if needed.
          label: field === "PRENOM" ? fieldLabel.replace("e", "è") : fieldLabel,
          enablePlaceholder: true,
          validation: validations
        });
        return acc;
      }, {}),
  
      // Date of birth field
      DATE_NAISSANCE: generateField({
        type: DATE,
        label: 'Date de Naissance',
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
  
      // Address field
      ADRESSE: generateField({
        type: TEXTAREA,
        label: 'Adresse',
        enablePlaceholder: true,
        extraProps: { maxLength: 321, rows: 3 },
        validation: commonValidations.combine(
          commonValidations.required('Adresse'),
          commonValidations.maxLength('Adresse', 321),
          commonValidations.minLength('Adresse', 5)
        )
      }),

      // City field based on country
      VILLE: generateField({
        type: SELECT,
        label: 'Ville',
        validation: commonValidations.required('Ville')
      }),
      // Email field
      EMAIL: generateField({
        type: EMAIL,
        label: 'Email',
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
  
      // Observation field
      OBSERVATION: generateField({
        type: TEXTAREA,
        label: 'Observation',
        enablePlaceholder: true,
        extraProps: { maxLength: 321, rows: 3 },
        validation: commonValidations.combine(
          commonValidations.maxLength('Observation', 321),
          commonValidations.minLength('Observation', 0)
        )
      }),
  
      // Phone fields (Téléphone1 is required, Téléphone2 is optional)
      ...[...Array(2).keys()].reduce((acc, index) => {
        acc[`TELEPHONE${index + 1}`] = generateField({
          type: PHONE,
          label: `Téléphone N°${index + 1}`,
          validation: commonValidations.combine(
            { 
              validate: (value, context) => 
                validateTELEPHONE(value, context, index)
            },
            index === 0 ? commonValidations.required(`Téléphone N°1`) : {}
          )
        });
        return acc;
      }, {}),

      // Nationalite & Pays fields
      ...["NATIONALITE", "PAYS"].reduce((acc, field) => {
        const fieldLabel = formatLabel(field);
        acc[field] = generateField({
          type: SELECT,
          label: fieldLabel,
          options: generateCountryOptions(),
          validation: commonValidations.combine(
            commonValidations.required(fieldLabel),
            commonValidations.inArray(
              fieldLabel,
              generateCountryOptions().map(option => option.value),
              `${fieldLabel} doit être dans la liste des pays`
            )
          )
        });
        return acc;
      }, {}),

      // Profile picture field
      PROFILE: generateField({
        type: IMAGE,
        label: "Profile Picture",
        validation: commonValidations.required('Profile picture is required')
      })
    };
  };
