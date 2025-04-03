import { getFormSharedOptions } from "./ShearedFieldsFormOption";
import { generateField } from "./FormOption"

export const getFormStepsEt = () => {
    const {
        ADRESSE, VILLE, CODE_POSTAL, DATE_NAISSANCE, GENRE, PAYS, NATIONALITE,
        LIEU_NAISSANCE, EMAIL, NOM, OBSERVATION, PRENOM, TELEPHONE1, TELEPHONE2,
        PROFILE, 
        FORM_OPTION: { TYPE: { TEXT_SELECT , TEXT } }
    } = getFormSharedOptions();

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
                GENRE, PROFILE, NOM, PRENOM, LIEU_NAISSANCE, DATE_NAISSANCE, 
                NATIONALITE, PAYS, VILLE, CODE_POSTAL, EMAIL, ADRESSE, OBSERVATION,
            ]
        },
        
        // Step 2: Parent d'Etudiant (Student's Parent)
        {
            title: "Responsable d'Etudiant",
            Fields: [
                generateField({
                    type: TEXT_SELECT,
                    label: "Lien de Parenté",
                    options: lienParenteOptions.map(value => ({
                        value,
                        label: value,
                    })),
                    validation: { 
                      required: 'Parent relationship is required',
                      validate: (value) => lienParenteOptions.includes(value) || "Veuillez sélectionner une option valide",
                    }
                  }),
                NOM, PRENOM,
                generateField({
                    type: TEXT,
                    label: "Profession",
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
                TELEPHONE1, TELEPHONE2, EMAIL, OBSERVATION
            ]   
        }
    ];
};