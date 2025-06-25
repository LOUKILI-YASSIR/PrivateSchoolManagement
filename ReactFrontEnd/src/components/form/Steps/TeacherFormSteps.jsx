import { isValidNumber } from 'libphonenumber-js';
import { useFormOptions } from '../utils/hooks';
import { commonValidations, generateField } from '../utils/formUtils';
import { countryPhonePrefixes, generateCountryOptions, postalCodeValidators } from '../utils/countryUtils';
import { useFetchData } from '../../../api/queryHooks';
import { useMemo, useCallback, useEffect } from 'react';

export const getFormStepsPr = (formContext, row) => {
  const {
    TYPE: { SELECT, TEXT, DATE, TEXTAREA, EMAIL, PHONE, IMAGE, NUMBER, AUTO_COMPLETE_SELECT, MULTI_SELECT },
  } = useFormOptions();

  const { formMethods, isSubmitting } = formContext;
  const { watch } = formMethods;

  // Watch for country changes to fetch cities
  const selectedCountry = watch("PaysPL");
  const MatriculePR = row?.MatriculePR || "";

  // Unified data fetching similar to student form
  const { data: FormData, refetch } = useFetchData(
    `getfromprofesseurs/${selectedCountry}${MatriculePR ? `/${MatriculePR}` : ""}`
  );
  useEffect(()=>{if(isSubmitting) refetch();},[isSubmitting])
  // Memoize filtered data to prevent recalculation on every render
  const FilteredEmailsPhonesData = useMemo(() => {
    if (!row || !FormData?.EmailsPhonesData) return null;
    return {
      emails: FormData?.EmailsPhonesData?.emails?.filter(email => email !== row.EmailPR) || [],
      phones: FormData?.EmailsPhonesData?.phones?.filter(phone => phone !== row.PhonePR) || [],
      noms: FormData?.EmailsPhonesData?.noms?.filter(nom => nom !== row.NomPL) || [],
      prenoms: FormData?.EmailsPhonesData?.prenoms?.filter(prenom => prenom !== row.PrenomPL) || [],
    };
  }, [row, FormData?.EmailsPhonesData]);

  // Memoize validation functions to prevent recreation on every render
  const validateTELEPHONE = useCallback((value, context, index, role) => {
    const errorTargets = document.querySelectorAll(".react-tel-input .special-label");
    const telephoneLabel = errorTargets[index];
    
    // Clear any previous error classes
    telephoneLabel?.classList.remove("special-label-error");

    // If the value is empty, consider it valid (handled elsewhere if required)
    if (!value?.trim()) return true;

    // Check if phone number already exists
    if (FilteredEmailsPhonesData) {
      if (FilteredEmailsPhonesData?.phones && FilteredEmailsPhonesData.phones.includes(value)) {
        telephoneLabel?.classList.add("special-label-error");
        return "Ce numéro de téléphone est déjà utilisé par un autre utilisateur";
      }
    } else if (FormData?.EmailsPhonesData?.phones && FormData?.EmailsPhonesData.phones.includes(value)) {
      telephoneLabel?.classList.add("special-label-error");
      return "Ce numéro de téléphone est déjà utilisé par un autre utilisateur";
    }

    // Determine the country by matching the phone number's starting prefix
    const matchingEntry = countryPhonePrefixes.find(
      ([prefix, isoCountry]) => value.startsWith(prefix)
    );
    if (!matchingEntry) {
      telephoneLabel?.classList.add("special-label-error");
      return "Le numéro doit commencer par un préfixe de pays valide";
    }

    // Extract the ISO country code from the mapping (second element)
    const countryCode = matchingEntry[1].toUpperCase();

    // Validate the phone number using libphonenumber-js and the determined country code
    if (!isValidNumber(value, countryCode)) {
      telephoneLabel?.classList.add("special-label-error");
      return "Le format du numéro n'est pas valide pour le pays sélectionné";
    }

    return true;
  }, [FilteredEmailsPhonesData, FormData?.EmailsPhonesData]);

  const validateEmail = useCallback((value) => {
    // Check if email already exists
    if (FilteredEmailsPhonesData) {
      if (FilteredEmailsPhonesData?.emails && FilteredEmailsPhonesData.emails.includes(value)) {
        return "Cette adresse email est déjà utilisée par un autre utilisateur";
      }
    } else if (FormData?.EmailsPhonesData?.emails && FormData?.EmailsPhonesData.emails.includes(value)) {
      return "Cette adresse email est déjà utilisée par un autre utilisateur";
    }
    return true;
  }, [FilteredEmailsPhonesData, FormData?.EmailsPhonesData]);

  const validateNom = useCallback((value) => {
    const prenom = watch("PrenomPL");
    if (FilteredEmailsPhonesData) {
      if (FilteredEmailsPhonesData?.noms && FilteredEmailsPhonesData?.prenoms) {
        for (let i = 0; i < FilteredEmailsPhonesData.noms.length; i++) {
          if (FilteredEmailsPhonesData.noms[i] === value && FilteredEmailsPhonesData.prenoms[i] === prenom) {
            return "Cette combinaison de nom et prénom est déjà utilisée par un autre utilisateur";
          }
        }
      }
    } else if (FormData?.EmailsPhonesData?.noms && FormData?.EmailsPhonesData?.prenoms) {
      for (let i = 0; i < FormData?.EmailsPhonesData.noms.length; i++) {
        if (FormData?.EmailsPhonesData.noms[i] === value && FormData?.EmailsPhonesData.prenoms[i] === prenom) {
          return "Cette combinaison de nom et prénom est déjà utilisée par un autre utilisateur";
        }
      }
    }
    return true;
  }, [FilteredEmailsPhonesData, FormData?.EmailsPhonesData, watch]);

  const validatePrenom = useCallback((value) => {
    const nom = watch("NomPL");
    if (FilteredEmailsPhonesData) {
      if (FilteredEmailsPhonesData?.noms && FilteredEmailsPhonesData?.prenoms) {
        for (let i = 0; i < FilteredEmailsPhonesData.prenoms.length; i++) {
          if (FilteredEmailsPhonesData.prenoms[i] === value && FilteredEmailsPhonesData.noms[i] === nom) {
            return "Cette combinaison de nom et prénom est déjà utilisée par un autre utilisateur";
          }
        }
      }
    } else if (FormData?.EmailsPhonesData?.noms && FormData?.EmailsPhonesData?.prenoms) {
      for (let i = 0; i < FormData?.EmailsPhonesData.prenoms.length; i++) {
        if (FormData?.EmailsPhonesData.prenoms[i] === value && FormData?.EmailsPhonesData.noms[i] === nom) {
          return "Cette combinaison de nom et prénom est déjà utilisée par un autre utilisateur";
        }
      }
    }
    return true;
  }, [FilteredEmailsPhonesData, FormData?.EmailsPhonesData, watch]);

  // Memoize options to prevent recreating arrays on every render
  const countryOptions = useMemo(() => generateCountryOptions(), []);

  const villeOptions = FormData?.villes?.cities
    ? FormData?.villes?.cities?.map(city => ({
        value: city.name,
        label: city.name
      }))
    : [];

  const matieresOptions = (!FormData?.matieres || FormData?.matieres?.length === 0)
    ? []
    : FormData?.matieres?.map((matiere) => ({
        value: matiere.MatriculeMT,
        label: matiere.NameMT,
      }));

  const groupOptions = (!FormData?.groups?.groups || FormData?.groups?.groups?.length === 0)
    ? []
    : FormData?.groups?.groups?.map((group) => ({
        value: group.MatriculeGP,
        label: group.NameGP,
      }));

  // Get selected groups for editing mode
  const selectedGroups = useMemo(() => {
    return row?.groups?.map(group => group.MatriculeGP) ||
           FormData?.groups?.selectedGP?.map((group) => group.MatriculeGP) ||
           [];
  }, [row, FormData?.groups?.selectedGP]);

  // Memoize the entire form steps to prevent recreation
  return useMemo(() => [
    {
      title: "Informations personnelles",
      Fields: [
        generateField({
          type: SELECT,
          label: "CivilitePR",
          propsLabel: "Civilité",
          options: [
            { value: "M.", label: "M." },
            { value: "Mme", label: "Mme" },
            { value: "Mlle", label: "Mlle" },
          ],
          validation: commonValidations.combine(
            commonValidations.required("Civilité"),
            commonValidations.inArray("Civilité", ["M.", "Mme", "Mlle"], "Civilité doit être M., Mme ou Mlle")
          ),
        }),
        generateField({
          type: IMAGE,
          label: "ProfileFileNamePL",
          propsLabel: "Photo de Profil",
          extraProps: { ImgPathUploads: "/Uploads/professeurs" },
          validation: commonValidations.required("Photo de profil est requise"),
        }),
        generateField({
          type: TEXT,
          label: "NomPL",
          propsType: "text",
          propsLabel: "Nom",
          enablePlaceholder: true,
          validation: commonValidations.combine(
            commonValidations.required("Nom"),
            commonValidations.pattern(
              "Nom",
              /^([A-Z][a-z]+(?:-[A-Z][a-z]+)?)(\s[A-Z][a-z]+(?:-[A-Z][a-z]+)?)*$/,
              "Nom doit commencer par une lettre majuscule, contenir uniquement des noms valides et avoir un seul espace entre les mots."
            ),
            { validate: validateNom }
          ),
        }),
        generateField({
          type: TEXT,
          label: "PrenomPL",
          propsType: "text",
          propsLabel: "Prénom",
          enablePlaceholder: true,
          validation: commonValidations.combine(
            commonValidations.required("Prénom"),
            commonValidations.pattern(
              "Prénom",
              /^([A-Z][a-z]+(?:-[A-Z][a-z]+)?)(\s[A-Z][a-z]+(?:-[A-Z][a-z]+)?)*$/,
              "Prénom doit commencer par une lettre majuscule, contenir uniquement des noms valides et avoir un seul espace entre les mots."
            ),
            { validate: validatePrenom }
          ),
        }),
        generateField({
          type: SELECT,
          label: "GenrePL",
          propsLabel: "Genre",
          options: [
            { value: "Homme", label: "Homme" },
            { value: "Femme", label: "Femme" },
          ],
          validation: commonValidations.combine(
            commonValidations.required("Genre"),
            commonValidations.inArray("Genre", ["Homme", "Femme"], "Genre doit être Homme ou Femme")
          ),
        }),
        generateField({
          type: DATE,
          label: "DateNaissancePL",
          propsLabel: "Date de Naissance",
          enableShrink: true,
          validation: commonValidations.combine(
            commonValidations.required("Date de Naissance"),
            {
              validate: (value) => {
                const today = new Date();
                const birthDate = new Date(value);
                if (birthDate > today) {
                  return "Date de Naissance ne peut pas être dans le futur";
                }
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDifference = today.getMonth() - birthDate.getMonth();
                if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
                  age--;
                }
                return age >= 18 || "Vous devez avoir au moins 18 ans";
              },
            }
          ),
        }),
        generateField({
          type: TEXT,
          label: "LieuNaissancePL",
          propsType: "text",
          propsLabel: "Lieu de Naissance",
          enablePlaceholder: true,
          validation: commonValidations.combine(
            commonValidations.required("Lieu de Naissance"),
            commonValidations.pattern(
              "Lieu de Naissance",
              /^([A-Z][a-z]+(?:-[A-Z][a-z]+)?)(\s[A-Z][a-z]+(?:-[A-Z][a-z]+)?)*$/,
              "Lieu de Naissance doit commencer par une lettre majuscule, contenir uniquement des noms valides et avoir un seul espace entre les mots."
            )
          ),
        }),
        generateField({
          type: SELECT,
          label: "NationalitePL",
          propsLabel: "Nationalité",
          options: countryOptions,
          validation: commonValidations.combine(
            commonValidations.required("Nationalité"),
            commonValidations.inArray(
              "Nationalité",
              countryOptions.map(option => option.value),
              "Nationalité doit être dans la liste des pays"
            )
          ),
        }),
        generateField({
          type: TEXT,
          label: "CINPR",
          propsType: "text",
          propsLabel: "CIN",
          enablePlaceholder: true,
          validation: commonValidations.combine(
            commonValidations.required("CIN"),
            commonValidations.pattern(
              "CIN",
              /^[A-Z0-9]{6,12}$/,
              "CIN doit contenir entre 6 et 12 caractères alphanumériques"
            )
          ),
        }),
      ],
    },
    {
      title: "Coordonnées",
      Fields: [
        generateField({
          type: EMAIL,
          label: "EmailPR",
          propsLabel: "Email",
          enablePlaceholder: true,
          validation: commonValidations.combine(
            commonValidations.required("Email"),
            commonValidations.pattern(
              "Email",
              /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              "Adresse email invalide"
            ),
            { validate: validateEmail }
          ),
        }),
        generateField({
          type: PHONE,
          label: "PhonePR",
          propsLabel: "Téléphone",
          validation: commonValidations.combine(
            {
              validate: (value, context) => validateTELEPHONE(value, context, 0, "PR"),
            },
            commonValidations.required("Téléphone")
          ),
        }),
        generateField({
          type: SELECT,
          label: "PaysPL",
          propsLabel: "Pays",
          options: countryOptions,
          validation: commonValidations.combine(
            commonValidations.required("Pays"),
            commonValidations.inArray(
              "Pays",
              countryOptions.map(option => option.value),
              "Pays doit être dans la liste des pays"
            )
          ),
        }),
        generateField({
          type: SELECT,
          label: "VillePL",
          propsLabel: "Ville",
          options: villeOptions,
          validation: commonValidations.required("Ville"),
        }),
        generateField({
          type: TEXT,
          label: "CodePostalPL",
          propsType: "text",
          propsLabel: "Code Postal",
          enablePlaceholder: true,
          validation: commonValidations.combine(
            commonValidations.required("Code Postal"),
            {
              validate: (value, context) => {
                const countryCode = context?.PaysPL || "";
                const validator = postalCodeValidators[countryCode.toUpperCase()];
                if (!validator) {
                  return "Ce pays n'a pas de validation de code postal";
                }
                const { regex, message } = validator;
                return regex.test(value) || message;
              },
            }
          ),
        }),
        generateField({
          type: TEXTAREA,
          label: "AdressPL",
          propsLabel: "Adresse",
          enablePlaceholder: true,
          extraProps: { maxLength: 321, rows: 3 },
          validation: commonValidations.combine(
            commonValidations.maxLength("Adresse", 321),
          ),
        }),
      ],
    },
    {
      title: "Informations professionnelles",
      Fields: [
        generateField({
          type: DATE,
          label: "DateEmbauchePR",
          propsLabel: "Date d'Embauche",
          enableShrink: true,
          validation: commonValidations.combine(
            commonValidations.required("Date d'Embauche"),
            {
              validate: (value) => {
                const today = new Date();
                const hireDate = new Date(value);
                if (hireDate > today) {
                  return "Date d'Embauche ne peut pas être dans le futur";
                }
                return true;
              },
            }
          ),
        }),
        generateField({
          type: TEXT,
          label: "SalairePR",
          propsLabel: "Salaire",
          propsType: "number",
          validation: commonValidations.combine(
            commonValidations.required("Salaire"),
            commonValidations.pattern(
              "Salaire",
              /^\d+(\.\d{1,2})?$/,
              "Salaire doit être un nombre positif avec jusqu'à deux décimales"
            )
          ),
        }),
        generateField({
          type: TEXT,
          label: "NomBanquePR",
          propsType: "text",
          propsLabel: "Nom de la Banque",
          enablePlaceholder: true,
          validation: commonValidations.combine(
            commonValidations.required("Nom de la Banque"),
            commonValidations.pattern(
              "Nom de la Banque",
              /^([A-Z][a-z]+(?:-[A-Z][a-z]+)?)(\s[A-Z][a-z]+(?:-[A-Z][a-z]+)?)*$/,
              "Nom de la Banque doit commencer par une lettre majuscule et contenir des noms valides"
            )
          ),
        }),
        generateField({
          type: TEXT,
          label: "RIBPR",
          propsType: "text",
          propsLabel: "RIB",
          enablePlaceholder: true,
          validation: commonValidations.combine(
            commonValidations.required("RIB"),
            commonValidations.pattern(
              "RIB",
              /^[A-Z0-9]{20,34}$/,
              "RIB doit contenir entre 20 et 34 caractères alphanumériques"
            )
          ),
        }),
        generateField({
          type: TEXTAREA,
          label: "ObservationPL",
          propsLabel: "Observation",
          enablePlaceholder: true,
          extraProps: { maxLength: 321, rows: 3 },
          validation: commonValidations.combine(
            commonValidations.maxLength("Observation", 321),
            commonValidations.minLength("Observation", 0)
          ),
        }),
      ],
    },
    {
      title: "Scolaire",
      Fields: [
        generateField({
          type: SELECT,
          label: "MatriculeMT",
          propsLabel: "Matières",
          options: matieresOptions,
        }),
        generateField({
          type: MULTI_SELECT,
          label: "Groups",
          propsLabel: "Groups",
          options: groupOptions,
          value: selectedGroups,
          validation: commonValidations.combine(
            commonValidations.optionalArray("Groups", {
              validate: (value) =>
                value.every(id => groupOptions.some(p => p.value === id)) ||
                "All selected groups must exist",
            })
          ),
        }),
        generateField({
          type: TEXT,
          label: "daily_hours_limit",
          propsType: "number",
          propsLabel: "Number of Daily Teaching Seance",
          enablePlaceholder: true,
          value:row?.daily_hours_limit,
          validation: commonValidations.combine(
              commonValidations.required("Number of Daily Teaching Seance "),
              { 
                  validate: (value, context) => value => 1 && value <= FormData?.CountTimeSlot ?
                              true : 'Error: Value must be a number greater than 0 and liter then or equal '+FormData?.CountTimeSlot+'.'
                },
            )
        }), 
      ],
    }
  ]) 
};