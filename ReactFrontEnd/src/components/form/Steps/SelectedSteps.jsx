import { getFormStepsEt } from "./StudentFormSteps";
import { getFormStepsPr } from "./TeacherFormSteps";
import { getFormStepsSl } from "./SalleFormSteps";
import { getFormStepsMt } from "./MatiereFormSteps";
import { getFormStepsGp } from "./GroupsFormSteps";
import { getFormStepsEp } from "./EvaluationFormSteps";
import { getFormStepsNv } from "./NiveauFormSteps";
import { getFormStepsYr } from "./AnneeScolaireFormSteps";
import { getFromStepsTp } from "./ConfigTimeTableFormSteps";

export const GetSteps = (TableName, formContext,row) => (
    {
        etudiants : () => getFormStepsEt(formContext,row),
        professeurs : () => getFormStepsPr(formContext,row),
        salles : () => getFormStepsSl(formContext,row),
        matieres : () => getFormStepsMt(formContext,row),
        groups : () => getFormStepsGp(formContext,row),
        "evaluation-types" : () => getFormStepsEp(formContext,row),
        niveaux : () => getFormStepsNv(formContext,row),
        "academic-years" : () => getFormStepsYr(formContext,row),
        "config-timetable" : () => getFromStepsTp(formContext,row), 
    }[TableName]() || [] // Default to an empty array if TableName is not found
) 