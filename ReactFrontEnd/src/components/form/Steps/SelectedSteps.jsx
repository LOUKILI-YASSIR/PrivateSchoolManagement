import { getFormStepsEt } from "./StudentFormSteps";
import { getFormStepsPr } from "./TeacherFormSteps";
import { getFormStepsSl } from "./SalleFormSteps";
import { getFormStepsMt } from "./MatiereFormSteps";
import { getFormStepsGp } from "./GroupsFormSteps";
import { getFormStepsEp } from "./EvaluationFormSteps";
import { getFormStepsNv } from "./NiveauFormSteps";
import { getFormStepsYr } from "./AnneeScolaireFormSteps";

export const GetSteps = (TableName) => (
    {
        etudiants : getFormStepsEt(),
        professeurs : getFormStepsPr(),
        salles : getFormStepsSl(),
        matieres : getFormStepsMt(),
        groupes : getFormStepsGp(),
        evaluations : getFormStepsEp(),
        niveaux : getFormStepsNv(),
        anneescolaire : getFormStepsYr(),
    }[TableName] || [] // Default to an empty array if TableName is not found
) 