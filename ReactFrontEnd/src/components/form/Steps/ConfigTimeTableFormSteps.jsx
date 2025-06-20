import { useFetchData } from '../../../api/queryHooks';
import { useMemo, useCallback, useEffect } from 'react';
import { commonValidations, generateField } from '../utils/formUtils';
import { useFormOptions } from '../utils/hooks';

export const getFromStepsTp = (formContext, row) => {
  const {
    TYPE: { MULTI_SELECT, TIME_SLOT }
  } = useFormOptions();
  const { isSubmitting, Traduction } = formContext;
  
  // Fetch timetable configuration data if needed
  const { data: FormDT , isLoading: FormLD, error: FormER, refetch } = useFetchData("gettimetableconfig");
  useEffect(() => { if (isSubmitting) refetch(); }, [isSubmitting]);
  const { days = [], timesSlot = [] } = FormDT || {}
  // Days of week options
  const DaysOptions = useMemo(() => [
        { value: 'monday', label: Traduction('Monday'), order: 1 },
        { value: 'tuesday', label: Traduction('Tuesday'), order: 2 },
        { value: 'wednesday', label: Traduction('Wednesday'), order: 3 },
        { value: 'thursday', label: Traduction('Thursday'), order: 4 },
        { value: 'friday', label: Traduction('Friday'), order: 5 },
        { value: 'saturday', label: Traduction('Saturday'), order: 6 },
        { value: 'sunday', label: Traduction('Sunday'), order: 7 }
  ], []);
  const sortedSelectedDays = useMemo(()=>{
        const res = [...days].sort((a, b) => {
          const dayA = DaysOptions?.find(day => day.value === a.DayNameDW);
          const dayB = DaysOptions?.find(day => day.value === b.DayNameDW);
          return dayA.order - dayB.order;
        }).map(day=>(day.DayNameDW));
        return res
    }
  ,[days, row]);
  // Selected time slots from existing data
  const selectedTimeSlots = useMemo(() => {
    return timesSlot || [];
  }, [timesSlot, row]);
  return [
    {
      title: "Days Configuration",
      Fields: [
        generateField({
          type: MULTI_SELECT,
          label: "days",
          propsLabel: "Days Of Week",
          options: DaysOptions?.map(day=>({label:day.label,value:day.value})),
          value: sortedSelectedDays,
          validation: commonValidations.combine(
            commonValidations.required("Days Of Week"),
            commonValidations.optionalArray("Days Of Week", {
              validate: (value) => {
                if (!value || value.length === 0) {
                  return "At least one day must be selected";
                }
                return value.every(id => DaysOptions.some(s => s.value === id)) ||
                  "All selected Days Of Week must exist";
              }
            })
          ),
        })
      ]
    },
    {
      title: "Time Slots Configuration",
      Fields: [
        generateField({
          type: TIME_SLOT,
          label: "timeSlots",
          propsLabel: "Time Slots",
          classes: "time-slots-field",
          propsType: "array",
          value: selectedTimeSlots,
          enablePlaceholder: false,
          enableShrink: true,
          options: [],
          isComponent: true,
          extraProps: {
            component: "TimeSlotFormSteps",
            arrayField: true,
            fieldName: "timeSlots",
            fieldStructure: {
              StartTimeTS: "string",
              EndTimeTS: "string"
            }
          },
          validation: {
            required: true,
            validate: (value) => {
              // Check if it's an array
              if (!Array.isArray(value)) return "Time slots must be an array";
              
              // Check if at least one time slot is provided
              if (value.length === 0) return "At least one time slot must be configured";
              
              // Validate each time slot
              for (let i = 0; i < value.length; i++) {
                const slot = value[i];
                
                // Check if both start and end times are provided
                if (!slot.StartTimeTS || !slot.EndTimeTS) {
                  return `Time slot ${i + 1} must have both start and end times`;
                }
                
                // Validate time format (HH:MM)
                const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
                if (!timeRegex.test(slot.StartTimeTS) || !timeRegex.test(slot.EndTimeTS)) {
                  return `Time slot ${i + 1} has invalid time format (use HH:MM)`;
                }
                
                // Validate that end time is after start time
                const start = new Date(`1970-01-01T${slot.StartTimeTS}:00`);
                const end = new Date(`1970-01-01T${slot.EndTimeTS}:00`);
                if (end <= start) {
                  return `Time slot ${i + 1}: End time must be after start time`;
                }
              }
              
              // Check for overlapping time slots
              for (let i = 0; i < value.length; i++) {
                for (let j = i + 1; j < value.length; j++) {
                  const slot1 = value[i];
                  const slot2 = value[j];
                  
                  const start1 = new Date(`1970-01-01T${slot1.StartTimeTS}:00`);
                  const end1 = new Date(`1970-01-01T${slot1.EndTimeTS}:00`);
                  const start2 = new Date(`1970-01-01T${slot2.StartTimeTS}:00`);
                  const end2 = new Date(`1970-01-01T${slot2.EndTimeTS}:00`);
                  
                  // Check if slots overlap
                  if ((start1 < end2 && end1 > start2)) {
                    return `Time slots ${i + 1} and ${j + 1} overlap`;
                  }
                }
              }
              
              return true;
            }
          }
        })
      ]
    }
  ];
};