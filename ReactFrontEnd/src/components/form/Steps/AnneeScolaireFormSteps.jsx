import { useFetchData } from '../../../api/queryHooks';
import { useEffect, useState } from 'react';
import { commonValidations, generateField } from '../utils/formUtils';
import { useFormOptions } from '../utils/hooks';

export const getFormStepsYr = (formContext, row) => {
  const {
    TYPE: { SELECT, TEXT, DATE, CHECKBOX, TEXTAREA }
  } = useFormOptions();

  const [allYearsData, setAllYearsData] = useState([]);
  const [allYearsLoading, setAllYearsLoading] = useState(false);
  const [allYearsError, setAllYearsError] = useState(null);

  const { data: yearsDT, isLoading: yearsLD, error: yearsER } = useFetchData('academic-years');

  useEffect(() => setAllYearsData(yearsDT), [yearsDT]);
  useEffect(() => setAllYearsLoading(yearsLD), [yearsLD]);
  useEffect(() => setAllYearsError(yearsER), [yearsER]);

  // تحضير قائمة أسماء السنوات مع استثناء اسم السنة الحالية (في حالة التعديل)
  let filteredNamesData = null;
  if (row && typeof row === 'object' && allYearsData && allYearsData?.data && Array.isArray(allYearsData?.data?.data)) {
    filteredNamesData = allYearsData.data.data
      .map((year) => year.NameYR)
      .filter((name) => name !== row.NameYR);
  }
  // دالة تحقق من اسم السنة
  function NamesValidation(value) {
    if (!value || value.trim() === '') {
      return "Le nom de l'année scolaire ne peut pas être vide.";
    }
    if (filteredNamesData) {
      if (filteredNamesData.includes(value.trim())) {
        return "Ce nom est déjà utilisé.";
      }
    } else if (
      allYearsData &&
      allYearsData.data &&
      allYearsData.data.data &&
      allYearsData.data.data.some((year) => year.NameYR === value.trim())
    ) {
      return "Ce nom est déjà utilisé.";
    }
    return true;
  }

  // خيارات حالة السنة الدراسية (StatusYR)
  const statusOptions = [
    { value: 'planifier', label: 'Planifiée' },
    { value: 'active', label: 'Active' },
    { value: 'clouse', label: 'Clôturée' },
  ];

  return [
    {
      title: 'Général',
      Fields: [
        generateField({
          type: TEXT,
          label: 'NameYR',
          propsType: 'text',
          propsLabel: "Nom de l'année scolaire",
          enablePlaceholder: true,
          validation: commonValidations.combine(
            commonValidations.required("Nom de l'année scolaire"),
            commonValidations.maxLength("Nom de l'année scolaire", 255),
            { validate: NamesValidation }
          )
        }),
        generateField({
          type: TEXTAREA,
          label: 'DescriptionYR',
          propsLabel: 'Description',
          enablePlaceholder: true,
          extraProps: { maxLength: 500, rows: 4 },
          validation: commonValidations.maxLength('Description', 500)
        }),
      ],
    },
    {
      title: 'Dates',
      Fields: [
        generateField({
          type: DATE,
          label: 'StartDateYR',
          propsLabel: 'Date de début',
          validation: commonValidations.required('Date de début')
        }),
        generateField({
          type: DATE,
          label: 'EndDateYR',
          propsLabel: 'Date de fin',
          validation: commonValidations.required('Date de fin')
        }),
      ],
    },
    // إظهار حقل StatusYR فقط في حالة التعديل (عندما يكون row موجود)
    ...(row
      ? [
          {
            title: 'Statut',
            Fields: [
              generateField({
                type: SELECT,
                label: 'StatusYR',
                propsLabel: 'Statut',
                options: statusOptions,
                validation: commonValidations.required('Statut'),
              }),
            ],
          },
        ]
      : []),
  ];
};
