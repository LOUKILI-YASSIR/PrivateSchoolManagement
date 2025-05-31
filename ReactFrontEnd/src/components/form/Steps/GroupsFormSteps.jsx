import { useFetchData, usePostData } from '../../../api/queryHooks';
import { useEffect, useState } from 'react';
import { commonValidations, generateField } from '../utils/formUtils';
import { useFormOptions } from '../utils/hooks';

export const getFormStepsGp = (formContext,row) => {
    const {
      TYPE: { SELECT, TEXT, DATE, TEXTAREA, EMAIL, PHONE, IMAGE, NUMBER, AUTO_COMPLETE_SELECT, MULTI_SELECT }
    } = useFormOptions();

    const [niveauxData, setNiveauxData] = useState([]);
    const [niveauxLoading, setNiveauxLoading] = useState(false);
    const [niveauxError, setNiveauxError] = useState(null);
    const [studentsData, setStudentsData] = useState({});
    const [SelectedStudentsData, setSelectedStudentsData] = useState([]);
    const [studentsLoading, setStudentsLoading] = useState(false);
    const [NamesData, setNomsData] = useState({});
    const [NamesLoading, setNomsLoading] = useState(false);
    const [ProfesseursData, setProfesseursData] = useState({});
    const [SelectedProfesseursData, setSelectedProfesseursData] = useState([])
    const [ProfesseursLoading, setProfesseursLoading] = useState(false);
    const { data: niveauxDT, isLoading: niveauxLD, error: niveauxER } = useFetchData("niveaux");
    const { data: studentsDT, isLoading: studentsLD } = useFetchData("getetudiantsselect"+ (row?.MatriculeGP ? "/" + row?.MatriculeGP : ""));
    const { data: professeursDT, isLoading: professeursLD } = useFetchData("getprofesseursselect"+ (row?.MatriculeGP ? "/" + row?.MatriculeGP : ""));
    const { data: nomsDT, isLoading: nomsLD } = useFetchData("getallgroupsnames");
    useEffect(() => setNiveauxData(niveauxDT), [niveauxDT]);
    useEffect(() => setNiveauxLoading(niveauxLD), [niveauxLD]);
    useEffect(() => setNiveauxError(niveauxER), [niveauxER]);
    useEffect(() => setStudentsData(studentsDT), [studentsDT]);
    useEffect(() => setStudentsLoading(studentsLD), [studentsLD]);
    useEffect(() => setNomsData(nomsDT), [nomsDT]);
    useEffect(() => setNomsLoading(nomsLD), [nomsLD]);
    useEffect(() => {
        if(professeursDT || professeursDT?.professeurs) {
            setProfesseursData(professeursDT?.professeurs)
        }
        if(professeursDT || professeursDT?.selectedPR) {
            setSelectedProfesseursData(
                row?.professeurs?.map(prof=>prof.MatriculePR) ||
                professeursDT?.selectedPR?.map(prof=>prof.MatriculePR) || 
                []
            )
        }
    }, [professeursDT]);
    useEffect(() => {
        if(studentsDT && studentsDT?.etudiants) {
            setStudentsData(studentsDT?.etudiants)
        }
        if((studentsDT && studentsDT?.selectedET) || row?.etudiants) {
            setSelectedStudentsData(
                row?.etudiants?.map(etudiant=>etudiant.MatriculeET) ||
                studentsDT?.selectedET?.map(etudiant=>etudiant.MatriculeET) || 
                []
            )
        }
    }, [studentsDT]); 
    useEffect(() => setProfesseursLoading(professeursLD), [professeursLD]);
    let FilteredNamesData = null;
    if (row && typeof row === "object" && NamesData && NamesData?.noms) {
        FilteredNamesData = {
            noms: NamesData?.noms?.filter(nom => nom !== row.NameGP) || [],
        };
    }


    function NamesValidation (value) {
      if (!value || value.trim() === "") {
        return "Le nom ne peut pas être vide.";
      }
      if (FilteredNamesData) {
        if(FilteredNamesData.noms.includes(value.trim())) {
          return "Ce nom est déjà utilisé.";
        }
      }else if (NamesData && NamesData?.noms && NamesData?.noms?.includes(value.trim())) {
        return "Ce nom est déjà utilisé.";
      }
      return true;
    }


    return [
        {
            title: "General",
            Fields: [
                generateField({
                    type: TEXT,
                    label: "NameGP",
                    propsType: "text",
                    propsLabel: "Group Name",
                    enablePlaceholder: true,
                    validation: commonValidations.combine(
                        commonValidations.required("Group Name"),
                        commonValidations.maxLength("Group Name", 255),
                        commonValidations.pattern(
                          "Nom",
                          // Pattern: starts with a capital letter, then lowercase letters; allows hyphenated parts and multiple words.
                          /^([A-Z][a-z]+[0-9]*)(?:-[A-Z][a-z]+)*(?:\s[A-Z][a-z]+[0-9]*(?:-[A-Z][a-z]+)*)*$/,
                          `chaque mot doit commencer par une majuscule, peut contenir des chiffres à la fin (pas après un tiret), et peut être composé avec des tirets ou séparé par des espaces. Exemples valides : Jean, Jean3, Jean-Pierre, Jean3 Dupont2.`
                        ),
                        {validate: NamesValidation}
                    )
                }),
                generateField({
                    type: TEXTAREA,
                    label: "DescriptionGP",
                    propsLabel: "Description",
                    enablePlaceholder: true,
                    extraProps: { maxLength: 500, rows: 4 },
                    validation: commonValidations.combine(
                        commonValidations.maxLength("Description", 500)
                    )
                })
            ]
        },
        {
            title: "Scolaire",
            Fields: [
                generateField({
                    type: SELECT,
                    label: "MatriculeNV",
                    propsLabel: "Level",
                    options: (niveauxLoading || niveauxError || !niveauxData?.data?.length
                        ? []
                        : niveauxData.data?.map((niveau) => ({
                            value: niveau.MatriculeNV,
                            label: niveau.NomNV + (niveau.parent?.NomNV ? ` (${niveau.parent?.NomNV})` : "")
                        })) || []),
                    validation: commonValidations.required("Level")
                }),
                generateField({
                    type: MULTI_SELECT,
                    label: "Etudiants",
                    propsLabel: "Students",
                    options: (studentsLoading || !studentsData?.length
                        ? []
                        : studentsData?.map((student) => ({
                            value: student.MatriculeET,
                            label: student.FullNameET
                        })) || []),
                    value: SelectedStudentsData || [],
                    validation: commonValidations.combine(
                        commonValidations.optionalArray("Students", {
                          validate: (value) =>
                            value.every(id => studentsData.some(s => s.MatriculeET === id)) ||
                            "All selected students must exist",
                        })
                    )
                }),
                generateField({
                    type: MULTI_SELECT,
                    label: "Professeurs",
                    propsLabel: "Professeurs",
                    options: (ProfesseursLoading || !ProfesseursData?.length
                        ? []
                        : ProfesseursData?.map((prof) => ({
                            value: prof.MatriculePR,
                            label: prof.FullNamePR
                        })) || []),
                    value: SelectedProfesseursData || [],
                    validation: commonValidations.combine(
                        commonValidations.optionalArray("Professeurs", {
                          validate: (value) =>
                            value.every(id => ProfesseursData.some(p => p.MatriculePR === id)) ||
                            "All selected professeurs must exist",
                        })
                    ),
                }),

            ]
        }
    ];
};