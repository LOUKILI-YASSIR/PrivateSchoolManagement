import { isValidNumber } from 'libphonenumber-js';
import { useFormOptions } from '../utils/hooks';
import { commonValidations, generateField } from '../utils/formUtils';
import { countryPhonePrefixes, generateCountryOptions, postalCodeValidators } from '../utils/countryUtils';
import { useFetchData } from '../../../api/queryHooks';
import { useFormSubmission } from '../hooks/useFormSubmission';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { message } from 'antd';
import { useMemo, useCallback, useEffect } from 'react';

export const getFormStepsEt = (formContext, row) => {
    const {
      TYPE: { SELECT, TEXT, DATE, TEXTAREA, EMAIL, PHONE, IMAGE, NUMBER, AUTO_COMPLETE_SELECT, MULTI_SELECT }
    } = useFormOptions();
    const { setUserInfo, formMethods, isSubmitting } = formContext;
    const { handleSubmit, watch } = formMethods;
    const niveauxselected = watch("MatriculeNV") || row?.MatriculeNV || "";

    // Watch for country changes to fetch cities
    const selectedCountry = watch("PaysPL");
    const firstName = watch("PrenomPL");
    const lastName = watch("NomPL");

    const { data: FormData, refetch } = useFetchData(
        `getfrometudiants/${selectedCountry}${niveauxselected ? `/${niveauxselected}` : ""}`
    );
    useEffect(()=>{if(isSubmitting) refetch();},[isSubmitting])

    // Memoize filtered data to prevent recalculation on every render
    const FilteredEmailsPhonesData = useMemo(() => {
        if (!row || !FormData?.EmailsPhonesData) return null;
        return {
            emails: FormData?.EmailsPhonesData?.emails?.filter(email => email !== row.EmailET) || [],
            phones: FormData?.EmailsPhonesData?.phones?.filter(phone => phone !== row.PhoneET) || [],
            noms: FormData?.EmailsPhonesData?.noms?.filter(nom => nom !== row.NomPL) || [],
            prenoms: FormData?.EmailsPhonesData?.prenoms?.filter(prenom => prenom !== row.PrenomPL) || [],
        };
    }, [row, FormData?.EmailsPhonesData]);


    // Memoize validation functions to prevent recreation on every render
    const validateTELEPHONE = useCallback((value, context, index, role) => {
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
        if (FilteredEmailsPhonesData) {
            if (FilteredEmailsPhonesData?.phones && FilteredEmailsPhonesData?.phones?.includes(value)) {
                return "Ce numéro de téléphone est déjà utilisé par un autre utilisateur";
            }
        } else if (FormData?.EmailsPhonesData?.phones && FormData?.EmailsPhonesData?.phones?.includes(value)) {
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
    }, [FilteredEmailsPhonesData, FormData?.EmailsPhonesData]);

    const validateEmail = useCallback((value) => {
        // Check if email already exists
        if (FilteredEmailsPhonesData) {
            if (FilteredEmailsPhonesData?.emails && FilteredEmailsPhonesData?.emails?.includes(value)) {
                return "Cette adresse email est déjà utilisée par un autre utilisateur";
            }
        } else if (FormData?.EmailsPhonesData?.emails && FormData?.EmailsPhonesData?.emails?.includes(value)) {
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
            for (let i = 0; i < FormData?.EmailsPhonesData?.noms?.length; i++) {
                if (FormData?.EmailsPhonesData?.noms[i] === value && FormData?.EmailsPhonesData?.prenoms[i] === prenom) {
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
                for (let i = 0; i < FilteredEmailsPhonesData?.prenoms?.length; i++) {
                    if (FilteredEmailsPhonesData?.prenoms[i] === value && FilteredEmailsPhonesData?.noms[i] === nom) {
                        return "Cette combinaison de nom et prénom est déjà utilisée par un autre utilisateur";
                    }
                }
            }
        } else if (FormData?.EmailsPhonesData?.noms && FormData?.EmailsPhonesData?.prenoms) {
            for (let i = 0; i < FormData?.EmailsPhonesData?.prenoms?.length; i++) {
                if (FormData?.EmailsPhonesData?.prenoms[i] === value && FormData?.EmailsPhonesData?.noms[i] === nom) {
                    return "Cette combinaison de nom et prénom est déjà utilisée par un autre utilisateur";
                }
            }
        }
        return true;
    }, [FilteredEmailsPhonesData, FormData?.EmailsPhonesData, watch]);

    // Memoize options to prevent recreating arrays on every render
    const lienParenteOptions = useMemo(() => [
        "Père", "Mère", "Tuteur", "Frère", "Sœur", "Oncle", 
        "Tante", "Grand-père", "Grand-mère", "Autre"
    ], []);

    const countryOptions = useMemo(() => generateCountryOptions(), []);
    
    const villeOptions = useMemo(() => {
        return FormData?.villes?.cities 
            ? FormData?.villes?.cities?.map(city => ({
                value: city.name,
                label: city.name
            }))
            : [];
    }, [FormData?.villes]);

    const niveauxOptions = useMemo(() => {
        return (!FormData?.niveaux || FormData?.niveaux?.length === 0)
            ? []
            : FormData?.niveaux?.map((niveau) => ({
                value: niveau.MatriculeNV,
                label: niveau.NomNV,
            }));
    }, [FormData?.niveaux]);

    const groupOptions = useMemo(() => {
        return (!FormData?.groups || FormData?.groups?.length === 0)
            ? []
            : FormData?.groups?.map((group) => ({
                value: group.MatriculeGP,
                label: group.NameGP,
            }));
    }, [FormData?.groups]);

    // Memoize the entire form steps to prevent recreation
    return useMemo(() => [
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
                    classes: " mt-5",
                    validation: commonValidations.combine(
                        commonValidations.required("Genre"),
                        commonValidations.inArray("Genre", ["Homme", "Femelle"], "Genre doit être Homme ou Femme")
                    )
                }),
                // Profile picture field
                generateField({
                    type: IMAGE,
                    propsLabel: "Profile Picture",
                    label: "ProfileFileNamePL",
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
                    options: countryOptions,
                    validation: commonValidations.combine(
                        commonValidations.required("Nationalité"),
                        commonValidations.inArray(
                            "Nationalité",
                            countryOptions.map(option => option.value),
                            `Nationalité doit être dans la liste des pays`
                        )
                    )
                }),
                generateField({
                    type: SELECT,
                    propsLabel: "Pays",
                    label: "PaysPL",
                    options: countryOptions,
                    validation: commonValidations.combine(
                        commonValidations.required("Pays"),
                        commonValidations.inArray(
                            "Pays",
                            countryOptions.map(option => option.value),
                            `Pays doit être dans la liste des pays`
                        )
                    )
                }),
                generateField({
                    type: SELECT,
                    propsLabel: 'Ville',
                    label: "VillePL",
                    options: villeOptions,
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
                    options: lienParenteOptions?.map(value => ({
                        value,
                        label: value,
                    })),
                    validation: {
                        required: 'Parent relationship is required',
                        validate: (value) => lienParenteOptions?.includes(value) || "Veuillez sélectionner une option valide",
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
                    value: "",
                    enablePlaceholder: true,
                    validation: {
                        required: 'Profession is required',
                        validate: (value) =>
                            /\b[A-Za-z]+[- ]?[A-Za-z]*'?[- ]?[A-Za-z]+\b/.test(value)
                            || `Profession doit commencer par une lettre majuscule, 
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
                    options: niveauxOptions,
                    validation: commonValidations.combine(
                        commonValidations.required("Niveaux")
                    )
                }),
                generateField({
                    type: SELECT,
                    label: 'MatriculeGP',
                    propsLabel: "Groups",
                    options: groupOptions,
                }),
            ]
        }
    ]);
};