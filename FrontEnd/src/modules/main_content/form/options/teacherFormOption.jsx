import { getFormSharedOptions } from "./ShearedFieldsFormOption"
export const getFormStepsPr = () => {
    const { 
        ADRESSE, VILLE, CODE_POSTAL, DATE_NAISSANCE, GENRE, PAYS, NATIONALITE,
        LIEU_NAISSANCE, MAIL, NOM, OBSERVATION, PRENOM, TELEPHONE1, TELEPHONE2,
        FORM_OPTION: { TYPE: { 
            DATE, TEXT, NUMBER 
        } },
        Traduction
    } = getFormSharedOptions()
    return [
        {
            title: "Professeur",
            Fields: [
                {
                    type: TEXT,
                    Label:"CIVILITE",
                    props: {
                        label: "Civilite : ",
                        Placeholder: "Entrer Civilite ...",
                        classes: ""
                    }
                },
                NOM, PRENOM, NATIONALITE, 
                {
                    type: TEXT,
                    Label:"CIN",
                    props: {
                        label: "CIN : ",
                        Placeholder: "Entrer CIN ...",
                        classes: ""
                    }
                },
                LIEU_NAISSANCE, DATE_NAISSANCE, PAYS, VILLE, 
                CODE_POSTAL, MAIL, TELEPHONE1, TELEPHONE2,
                {
                    type: DATE,
                    Label:"DATE_EMBAUCHE",
                    props: {
                        label: "Date d'Embauche : ",
                        InputLabelProps: {
                            shrink: true
                        },
                        value:new Date().toISOString().slice(0, 10),
                        classes: ""
                    }
                },
                {
                    type: NUMBER,
                    Label:"SALAIRE",
                    props: {
                        label: "Salaire : ",
                        classes: ""
                    }
                },
                {
                    type: TEXT,
                    Label:"NOM_BANQUE",
                    props: {
                        label: "Nom de la Banque : ",
                        Placeholder: "Entrer Nom de la Banque ...",
                        classes: ""
                    }
                },
                {
                    type: TEXT,
                    props: {
                        label: "RIB : ",
                        Label:"RIB",
                        Placeholder: "Entrer Nom de la RIB ...",
                        classes: ""
                    }
                },
                ADRESSE, OBSERVATION,
            ]
        },
    ]
}
