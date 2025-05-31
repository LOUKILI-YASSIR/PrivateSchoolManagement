import { isValidNumber } from 'libphonenumber-js';
import { useFormOptions } from '../utils/hooks';
import { commonValidations, generateField } from '../utils/formUtils';
import { countryPhonePrefixes, generateCountryOptions, postalCodeValidators } from '../utils/countryUtils';
import { useFetchData, usePostData } from '../../../api/queryHooks';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';

export const getFormStepsPr = (formContext, row) => {
  const {
    TYPE: { SELECT, TEXT, DATE, TEXTAREA, EMAIL, PHONE, IMAGE, NUMBER, AUTO_COMPLETE_SELECT, MULTI_SELECT },
  } = useFormOptions();

  const [EmailsPhonesData, setEmailsPhonesData] = useState({});
  const [MatieresData, setMatieresData] = useState([]);
  const [GroupsData, setGroupsData] = useState([]);
  const [SelectedGroups, setSelectedGroups] = useState([]);
  const [EmailsPhonesLoading, setEmailsPhonesLoading] = useState(false);
  const [MatieresLoading, setMatieresLoading] = useState(false);
  const { data: EmailsPhonesDT, isLoading: EmailsPhonesLD } = useFetchData("getemailsphonesusernames/professeur");
  const { data: MatieresDT, isLoading: MatieresLD } = useFetchData("matieres");
const { data: GroupDT } = useFetchData(
  row?.MatriculePR ? `getgroupsselect/${row.MatriculePR}` : "getgroupsselect"
);
  //console.log(SelectedGroups,GroupsData,MatieresData);
  useEffect(() => setEmailsPhonesData(EmailsPhonesDT), [EmailsPhonesDT]);
  useEffect(() => setEmailsPhonesLoading(EmailsPhonesLD), [EmailsPhonesLD]);
  useEffect(() => setMatieresData(MatieresDT), [MatieresDT]);
  useEffect(() => setMatieresLoading(MatieresLD), [MatieresLD]);
  useEffect(() => {
    if (GroupDT && GroupDT.groups) {
      setGroupsData(GroupDT.groups);
      setSelectedGroups(
        row?.groups?.map(group => group.MatriculeGP) ||
        GroupDT?.selectedGP?.map((group) => group.MatriculeGP) ||
        []
      );
    }
  }, [GroupDT]);

  let FilteredEmailsPhonesData = null;
  if (row && typeof row === "object" && EmailsPhonesData) {
    FilteredEmailsPhonesData = {
      emails: EmailsPhonesData.emails?.filter(email => email !== row.EmailPR) || [],
      phones: EmailsPhonesData.phones?.filter(phone => phone !== row.PhonePR) || [],
      noms: EmailsPhonesData.noms?.filter(nom => nom !== row.NomPL) || [],
      prenoms: EmailsPhonesData.prenoms?.filter(prenom => prenom !== row.PrenomPL) || [],
    };
  }
  const { formMethods } = formContext;
  const { watch } = formMethods;

  // Watch for country changes to fetch cities
  const selectedCountry = watch("PaysPL");

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
    const errorTargets = document.querySelectorAll(".react-tel-input .special-label");
    const telephoneLabel = errorTargets[index];
    telephoneLabel?.classList.remove("special-label-error");

    if (!value?.trim()) return true;

    if (FilteredEmailsPhonesData) {
      if (FilteredEmailsPhonesData?.phones && FilteredEmailsPhonesData.phones.includes(value)) {
        telephoneLabel?.classList.add("special-label-error");
        return "Ce numéro de téléphone est déjà utilisé par un autre utilisateur";
      }
    } else if (EmailsPhonesData?.phones && EmailsPhonesData.phones.includes(value)) {
      telephoneLabel?.classList.add("special-label-error");
      return "Ce numéro de téléphone est déjà utilisé par un autre utilisateur";
    }

    const matchingEntry = countryPhonePrefixes.find(
      ([prefix, isoCountry]) => value.startsWith(prefix)
    );
    if (!matchingEntry) {
      telephoneLabel?.classList.add("special-label-error");
      return "Le numéro doit commencer par un préfixe de pays valide";
    }

    const countryCode = matchingEntry[1].toUpperCase();
    if (!isValidNumber(value, countryCode)) {
      telephoneLabel?.classList.add("special-label-error");
      return "Le format du numéro n'est pas valide pour le pays sélectionné";
    }

    return true;
  };

  const validateEmail = (value) => {
    if (FilteredEmailsPhonesData) {
      if (FilteredEmailsPhonesData?.emails && FilteredEmailsPhonesData.emails.includes(value)) {
        return "Cette adresse email est déjà utilisée par un autre utilisateur";
      }
    } else if (EmailsPhonesData?.emails && EmailsPhonesData.emails.includes(value)) {
      return "Cette adresse email est déjà utilisée par un autre utilisateur";
    }
    return true;
  };

  const validateNom = (value) => {
    const prenom = watch("PrenomPL");
    if (FilteredEmailsPhonesData) {
      if (FilteredEmailsPhonesData?.noms && FilteredEmailsPhonesData?.prenoms) {
        for (let i = 0; i < FilteredEmailsPhonesData.noms.length; i++) {
          if (FilteredEmailsPhonesData.noms[i] === value && FilteredEmailsPhonesData.prenoms[i] === prenom) {
            return "Cette combinaison de nom et prénom est déjà utilisée par un autre utilisateur";
          }
        }
      }
    } else if (EmailsPhonesData?.noms && EmailsPhonesData?.prenoms) {
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
    if (FilteredEmailsPhonesData) {
      if (FilteredEmailsPhonesData?.noms && FilteredEmailsPhonesData?.prenoms) {
        for (let i = 0; i < FilteredEmailsPhonesData.prenoms.length; i++) {
          if (FilteredEmailsPhonesData.prenoms[i] === value && FilteredEmailsPhonesData.noms[i] === nom) {
            return "Cette combinaison de nom et prénom est déjà utilisée par un autre utilisateur";
          }
        }
      }
    } else if (EmailsPhonesData?.noms && EmailsPhonesData?.prenoms) {
      for (let i = 0; i < EmailsPhonesData.prenoms.length; i++) {
        if (EmailsPhonesData.prenoms[i] === value && EmailsPhonesData.noms[i] === nom) {
          return "Cette combinaison de nom et prénom est déjà utilisée par un autre utilisateur";
        }
      }
    }
    return true;
  };

  return [
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
          options: generateCountryOptions(),
          validation: commonValidations.combine(
            commonValidations.required("Nationalité"),
            commonValidations.inArray(
              "Nationalité",
              generateCountryOptions().map(option => option.value),
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
          options: generateCountryOptions(),
          validation: commonValidations.combine(
            commonValidations.required("Pays"),
            commonValidations.inArray(
              "Pays",
              generateCountryOptions().map(option => option.value),
              "Pays doit être dans la liste des pays"
            )
          ),
        }),
        generateField({
          type: SELECT,
          label: "VillePL",
          propsLabel: "Ville",
          options: citiesLoading || !citiesData?.cities
            ? []
            : citiesData?.cities?.map(city => ({
                value: city.name,
                label: city.name,
              })) || [],
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
                return regex.test(value) || message("Code Postal");
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
            commonValidations.required("Adresse"),
            commonValidations.maxLength("Adresse", 321),
            commonValidations.minLength("Adresse", 5)
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
          propsType:"number",
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
          options: (MatieresLoading || !MatieresData || MatieresData?.data?.length === 0 ? [] 
          : MatieresData?.data?.map(matiere => ({
              value: matiere.MatriculeMT,
              label: matiere.NameMT,
          }))),
        }),
        generateField({
            type: MULTI_SELECT,
            label: "Groups",
            propsLabel: "Groups",
            options: (!GroupsData?.length
                ? []
                : GroupsData.map((group) => ({
                    value: group.MatriculeGP,
                    label: group.NameGP
                }))),
            value: SelectedGroups || [],
            validation: commonValidations.combine(
                commonValidations.optionalArray("Groups", {
                  validate: (value) =>
                    value.every(id => GroupsData.some(p => p.MatriculeGP === id)) ||
                    "All selected groups must exist",
                })
            ),
        }),
      ],
    }
  ];
};