import { isValidNumber } from 'libphonenumber-js';
import { useFormOptions } from '../utils/hooks';
import { commonValidations, generateField } from '../utils/formUtils';
import { countryPhonePrefixes, generateCountryOptions, postalCodeValidators } from '../utils/countryUtils';
import { useFetchData } from '../../../api/queryHooks';
import { useFormSubmission } from '../hooks/useFormSubmission';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { message } from 'antd';
import { useEffect, useState } from 'react';

export const getFormStepsEt = (formContext,row) => {
    const {
      TYPE: { SELECT, TEXT, DATE, TEXTAREA, EMAIL, PHONE, IMAGE, NUMBER, AUTO_COMPLETE_SELECT, MULTI_SELECT }
    } = useFormOptions();
    const { setUserInfo, formMethods } = formContext;
    const { handleSubmit, watch } = formMethods;
    const niveauxselected= watch("MatriculeNV") || row?.MatriculeNV || "";
    const [niveauxData,setNiveauxData] = useState([]);
    const [niveauxLoading,setNiveauxLoading] = useState(false);
    const [niveauxError,setNiveauxError] = useState(false);
    const [groupsData,setGroupsData] = useState([]);
    const [groupsLoading,setGroupsLoading] = useState(false);
    const [EmailsPhonesData,setEmailsPhonesData] = useState({});
    const [EmailsPhonesLoading,setEmailsPhonesLoading] = useState(false);
    const { data: NiveauxDT, isLoading: NiveauxLD, error: NiveauxER } = useFetchData("niveaux");
    const { data: GroupsDT, isLoading: GroupsLD } = useFetchData("getgroups"+(niveauxselected ? "/"+niveauxselected : ""));
    const { data: EmailsPhonesDT, isLoading: EmailsPhonesLD } = useFetchData("getemailsphonesusernames/etudiant");
    useEffect(()=>setNiveauxData(NiveauxDT),[NiveauxDT])
    useEffect(()=>setNiveauxLoading(NiveauxLD),[NiveauxLD])
    useEffect(()=>setNiveauxError(NiveauxER),[NiveauxER])
    useEffect(()=>setGroupsData(GroupsDT),[GroupsDT])
    useEffect(()=>setGroupsLoading(GroupsLD),[GroupsLD])
    useEffect(()=>setEmailsPhonesData(EmailsPhonesDT),[EmailsPhonesDT])
    useEffect(()=>setEmailsPhonesLoading(EmailsPhonesLD),[EmailsPhonesLD])
    let FilteredEmailsPhonesData = null; // Default to null
    if (row && EmailsPhonesData) {
      FilteredEmailsPhonesData = {
        emails: EmailsPhonesData.emails?.filter(email => email !== row.EmailET) || [],
        phones: EmailsPhonesData.phones?.filter(phone => phone !== row.PhoneET) || [],
        noms: EmailsPhonesData.noms?.filter(nom => nom !== row.NomPL) || [],
        prenoms: EmailsPhonesData.prenoms?.filter(prenom => prenom !== row.PrenomPL) || [],
      };
    }    

    // Watch for country changes to fetch cities
    const selectedCountry = watch("PaysPL");
    const firstName = watch("PrenomPL");
    const lastName = watch("NomPL");

    // Fetch cities based on selected country
    const { data: citiesData, isLoading: citiesLoading } = useQuery({
        queryKey: ['cities', selectedCountry],
        queryFn: async () => {
            if (!selectedCountry) return { cities: [] };
            const response = await axios.get(`localhost:3000/ville/${selectedCountry}`);
            return response.data;
        },
        enabled: !!selectedCountry,
    });
    const validateTELEPHONE = (value, index, role) => {
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

        // Check if phone number already exists
        if (FilteredEmailsPhonesData){
          if(FilteredEmailsPhonesData?.phones && FilteredEmailsPhonesData.phones.includes(value)){
            return "Ce numéro de téléphone est déjà utilisé par un autre utilisateur";
          }
        }
        else if(EmailsPhonesData?.phones && EmailsPhonesData.phones.includes(value)) {
            telephoneCorentLabel?.classList.add("special-label-error");
            return "Ce numéro de téléphone est déjà utilisé par un autre utilisateur";
        }
    
        // Determine the country by matching the phone number's starting prefix
        const matchingEntry = countryPhonePrefixes.find(
            ([prefix, isoCountry]) => value.startsWith(prefix)
        );
        if (!matchingEntry) {
            telephoneCorentLabel?.classList.add("special-label-error");
            return "Le numéro doit commencer par un préfixe de pays valide";
        }
    
        // Extract the ISO country code from the mapping (second element)
        const countryCode = matchingEntry[1].toUpperCase();
    
        // Validate the phone number using libphonenumber-js and the determined country code
        if (!isValidNumber(value, countryCode)) {
            telephoneCorentLabel?.classList.add("special-label-error");
            return "Le format du numéro n'est pas valide pour le pays sélectionné";
        }
    
        return true;  
    };

    const validateEmail = (value) => {
        // Check if email already exists
        if (FilteredEmailsPhonesData) {
          if(FilteredEmailsPhonesData?.emails && FilteredEmailsPhonesData.emails.includes(value)){
            return "Cette adresse email est déjà utilisée par un autre utilisateur";
          }
        }
        else if (EmailsPhonesData?.emails && EmailsPhonesData.emails.includes(value)) {
          return "Cette adresse email est déjà utilisée par un autre utilisateur";
        }
        return true;
    };

    const validateNom = (value) => {
        const prenom = watch("PrenomPL");
        if (FilteredEmailsPhonesData) {
          if(FilteredEmailsPhonesData?.noms && FilteredEmailsPhonesData?.prenoms){
            for (let i = 0; i < FilteredEmailsPhonesData.noms.length; i++) {
                if (FilteredEmailsPhonesData.noms[i] === value && FilteredEmailsPhonesData.prenoms[i] === prenom) {
                    return "Cette combinaison de nom et prénom est déjà utilisée par un autre utilisateur";
                }
            }
          }
        }else if(EmailsPhonesData?.noms && EmailsPhonesData?.prenoms) {
          for (let i = 0; i < EmailsPhonesData.noms.length; i++) {
              if (EmailsPhonesData.noms[i] === value && EmailsPhonesData.prenoms[i] === prenom) {
                  return "Cette combinaison de nom et prénom est déjà utilisée par un autre utilisateur";
              }
          }
        }
        return true;
    };

    const validatePrenom = (value) => {
        const nom = watch("NomPL");
        if (FilteredEmailsPhonesData){
          if(FilteredEmailsPhonesData?.noms && FilteredEmailsPhonesData?.prenoms){
            for (let i = 0; i < FilteredEmailsPhonesData.prenoms.length; i++) {
                if (FilteredEmailsPhonesData.prenoms[i] === value && FilteredEmailsPhonesData.noms[i] === nom) {
                    return "Cette combinaison de nom et prénom est déjà utilisée par un autre utilisateur";
                }
            }
          }
        }else if (EmailsPhonesData?.noms && EmailsPhonesData?.prenoms) {
          for (let i = 0; i < EmailsPhonesData.prenoms.length; i++) {
              if (EmailsPhonesData.prenoms[i] === value && EmailsPhonesData.noms[i] === nom) {
                  return "Cette combinaison de nom et prénom est déjà utilisée par un autre utilisateur";
              }
          }
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
                  label: 'GenrePL',
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
                  label : "ProfileFileNamePL",
                  validation: commonValidations.required('Profile picture is required')
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
                          // Pattern: starts with a capital letter, then lowercase letters; allows hyphenated parts and multiple words.
                          /^([A-Z][a-z]+(?:-[A-Z][a-z]+)?)(\s[A-Z][a-z]+(?:-[A-Z][a-z]+)?)*$/,
                          `Nom doit commencer par une lettre majuscule, contenir uniquement des noms valides et avoir un seul espace entre les mots.`
                        ),
                        { validate: validateNom }
                    )
                }), 
                generateField({
                    type: TEXT,
                    label: "PrenomPL",
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
                        ),
                        { validate: validatePrenom }
                    )
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
                    label: "DateNaissancePL",
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
                    label: "NationalitePL",
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
                    label: "PaysPL",
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
                    label: "VillePL",
                    options: citiesLoading || !citiesData?.cities 
                      ? [] 
                      : citiesData.cities.map(city => ({
                          value: city.name,
                          label: city.name
                        })),
                    validation: commonValidations.required('Ville')
                  }),
                  generateField({
                    type: TEXT,
                    propsType: "text",
                    label: "CodePostalPL",
                    propsLabel: "Code Postal",
                    enablePlaceholder: true,
                    validation: commonValidations.combine(
                        commonValidations.required("Code Postal"),
                        {
                            validate: (value, context) => {
                              const countryCode = context?.PaysPL || "";
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
                    label: "EmailET",
                    enablePlaceholder: true,
                    validation: commonValidations.combine(
                      commonValidations.required('Email'),
                      commonValidations.pattern(
                        'Email',
                        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        'Adresse email invalide'
                      ),
                      { validate: validateEmail }
                    )
                  }),
                  generateField({
                    type: PHONE,
                    propsLabel: `Téléphone`,
                    label: "PhoneET",
                    validation: commonValidations.combine(
                      { 
                        validate: (value, context) => 
                          validateTELEPHONE(value, context, 0, "ET")
                      },
                      commonValidations.required(`Téléphone`)
                    )
                  }), 
                  generateField({
                    type: TEXTAREA,
                    propsLabel: 'Adresse',
                    label: "AdressPL",
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
                    label: "ObservationPL",
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
                    label: "LienParenteTR",
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
                    label: "NomTR",
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
                    label: "PrenomTR",
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
                    label: "ProfessionTR",
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
                    label: "Phone1TR",
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
                    label: "Phone2TR",
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
                    label: "EmailTR",
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
                    label: "ObservationTR",
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
                label: 'MatriculeNV',
                propsLabel: "Niveaux",
                options: (niveauxLoading || niveauxError || !niveauxData || niveauxData?.data?.length === 0
                  ? [] // Fallback to empty array if data is not ready
                  : niveauxData?.data?.map((niveau) => ({
                      value: niveau.MatriculeNV,
                      label: niveau.NomNV+(niveau.parent?.NomNV ? ` (${niveau.parent?.NomNV})` : ""),
                  }))),
                validation: commonValidations.combine(
                  commonValidations.required("Niveaux")
                )
              }),
              generateField({
                type: SELECT,
                label: 'MatriculeGP',
                propsLabel: "Groups",
                options: (groupsLoading || !groupsData || groupsData?.data?.length === 0
                  ? [] // Fallback to empty array if data is not ready
                  : groupsData?.data?.map((group) => ({
                      value: group.MatriculeGP,
                      label: group.NameGP,
                  }))),
              }),            
            ]
        }
    ];
};