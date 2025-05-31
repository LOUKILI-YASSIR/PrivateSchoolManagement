import React, { useMemo } from "react";

// Helper function to handle empty values consistently
const renderEmptyCell = () => <span style={{ color: '#999', fontStyle: 'italic' }}>---</span>;

// Helper function to format ISO date string with configurable format options
const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return original if invalid
    
    // Format date part: YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Date only format
    let formattedDate = `${year}-${month}-${day}`;
    
    // Add time if requested
    if (includeTime) {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      formattedDate += ` ${hours}:${minutes}:${seconds}`;
    }
    
    return formattedDate;
  } catch (e) {
    return dateString; // Return original on error
  }
};

export const AcademicYearsColumns = (Traduction, FilterModeOptions) => [
  {
    header: Traduction("Data.status"),
    accessorKey: "StatusYR",
    filterFn: "equals",
    filterVariant: "select",
    filterSelectOptions: ["active", "inactive", "archived", "planned"],
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
    size: 170,
    Cell: ({ renderedCellValue }) => {
      if (!renderedCellValue) return renderEmptyCell();
      
      // Determine color based on status
      const getStatusColor = (status) => {
        switch(status.toLowerCase()) {
          case 'active':
            return '#4caf50'; // Green
          case 'clouse':
            return '#9e9e9e'; // Gray
          case 'planifier':
            return '#2196f3'; // Blue
          default:
            return '#f44336'; // Red
        }
      };
      
      const color = getStatusColor(renderedCellValue);
      
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div 
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: color,
              boxShadow: `0 0 3px ${color}`,
              display: 'inline-block'
            }}
          />
          <span>{renderedCellValue}</span>
        </div>
      );
    },
  },
  {
    header: Traduction("Data.name"),
    accessorKey: "NameYR",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
    size: 150,
    Cell: ({ renderedCellValue, row }) => {
      if (!renderedCellValue) return renderEmptyCell();
      const isClosed = row.original.statistics?.is_closed;
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {isClosed && <span style={{ color: '#f44336' }}>🔒 {renderedCellValue}</span>}
          <span>{renderedCellValue}</span>
        </div>
      );
    },
  },
  {
    header: Traduction("Data.description"),
    accessorKey: "DescriptionYR",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
    size: 250,
    Cell: ({ renderedCellValue }) => {
      return renderedCellValue || renderEmptyCell();
    },
  },
  {
    header: Traduction("Data.startDate"),
    accessorKey: "StartDateYR",
    filterFn: "greaterThanOrEqualTo",
    filterVariant: "date",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    size: 220,
    Cell: ({ renderedCellValue }) => {
      if (!renderedCellValue) return renderEmptyCell();
      return formatDate(renderedCellValue) || renderEmptyCell();
    },
  },
  {
    header: Traduction("Data.endDate"),
    accessorKey: "EndDateYR",
    filterFn: "greaterThanOrEqualTo",
    filterVariant: "date",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    size: 220,
    Cell: ({ renderedCellValue }) => {
      if (!renderedCellValue) return renderEmptyCell();
      return formatDate(renderedCellValue) || renderEmptyCell();
    },
  },
  {
    header: Traduction("Data.archivedDate"),
    accessorKey: "ArchivedDateYR",
    filterFn: "greaterThanOrEqualTo",
    filterVariant: "date",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    size: 240,
    Cell: ({ renderedCellValue }) => {
      if (!renderedCellValue) return renderEmptyCell();
      return formatDate(renderedCellValue) || renderEmptyCell();
    },
  },
  {
    header: Traduction("Data.isCurrent"),
    accessorKey: "IsCurrentYR",
    filterFn: "equals",
    filterVariant: "select",
    filterSelectOptions: [true, false],
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
    size: 220,
    Cell: ({ renderedCellValue }) => {
      if (renderedCellValue === undefined || renderedCellValue === null) return renderEmptyCell();
      return (
        <span style={{ 
          color: renderedCellValue ? '#4caf50' : '#f44336',
          fontWeight: 'bold'
        }}>
          {renderedCellValue ? "✅ Est actuel" : "❌ N'est pas actuel"}
        </span>
      );
    },
  },
  {
    header: Traduction("Data.createdBy"),
    accessorKey: "user.UserNameUT",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
    size: 180,
    Cell: ({ renderedCellValue }) => {
      return renderedCellValue || renderEmptyCell();
    },
  },
  {
    header: Traduction("Data.createdAt"),
    accessorKey: "created_at",
    filterFn: "greaterThanOrEqualTo",
    filterVariant: "date",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    size: 240,
    Cell: ({ renderedCellValue }) => {
      if (!renderedCellValue) return renderEmptyCell();
      return formatDate(renderedCellValue, true) || renderEmptyCell();
    },
  },
  {
    header: Traduction("Data.updatedAt"),
    accessorKey: "updated_at",
    filterFn: "greaterThanOrEqualTo",
    filterVariant: "date",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    size: 260,
    Cell: ({ renderedCellValue }) => {
      if (!renderedCellValue) return renderEmptyCell();
      return formatDate(renderedCellValue, true) || renderEmptyCell();
    },
  },
  // Statistics columns with consistent styling
  {
    header: Traduction("Data.professorsCount"),
    accessorKey: "statistics.professors_count",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    size: 260,
    Cell: ({ renderedCellValue }) => {
      if (renderedCellValue === undefined || renderedCellValue === null) return renderEmptyCell();
      return (
        <span style={{ 
          color: renderedCellValue > 0 ? '#4caf50' : '#f44336',
          fontWeight: 'medium'
        }}>
          {renderedCellValue}
        </span>
      );
    },
  },
  {
    header: Traduction("Data.studentsCount"),
    accessorKey: "statistics.students_count",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    size: 260,
    Cell: ({ renderedCellValue }) => {
      if (renderedCellValue === undefined || renderedCellValue === null) return renderEmptyCell();
      return (
        <span style={{ 
          color: renderedCellValue > 0 ? '#4caf50' : '#f44336',
          fontWeight: 'medium'
        }}>
          {renderedCellValue}
        </span>
      );
    },
  },
  {
    header: Traduction("Data.subjectsCount"),
    accessorKey: "statistics.subjects_count",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    size: 260,
    Cell: ({ renderedCellValue }) => {
      if (renderedCellValue === undefined || renderedCellValue === null) return renderEmptyCell();
      return (
        <span style={{ 
          color: renderedCellValue > 0 ? '#4caf50' : '#f44336',
          fontWeight: 'medium'
        }}>
          {renderedCellValue}
        </span>
      );
    },
  },
  {
    header: Traduction("Data.groupsCount"),
    accessorKey: "statistics.groups_count",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    size: 260,
    Cell: ({ renderedCellValue }) => {
      if (renderedCellValue === undefined || renderedCellValue === null) return renderEmptyCell();
      return (
        <span style={{ 
          color: renderedCellValue > 0 ? '#4caf50' : '#f44336',
          fontWeight: 'medium'
        }}>
          {renderedCellValue}
        </span>
      );
    },
  },
  {
    header: Traduction("Data.sallesCount"),
    accessorKey: "statistics.salles_count",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    size: 260,
    Cell: ({ renderedCellValue }) => {
      if (renderedCellValue === undefined || renderedCellValue === null) return renderEmptyCell();
      return (
        <span style={{ 
          color: renderedCellValue > 0 ? '#4caf50' : '#f44336',
          fontWeight: 'medium'
        }}>
          {renderedCellValue}
        </span>
      );
    },
  },
  {
    header: Traduction("Data.niveauxCount"),
    accessorKey: "statistics.niveaux_count",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    size: 260,
    Cell: ({ renderedCellValue }) => {
      if (renderedCellValue === undefined || renderedCellValue === null) return renderEmptyCell();
      return (
        <span style={{ 
          color: renderedCellValue > 0 ? '#4caf50' : '#f44336',
          fontWeight: 'medium'
        }}>
          {renderedCellValue}
        </span>
      );
    },
  },
  {
    header: Traduction("Data.evaluationsCount"),
    accessorKey: "statistics.evaluations_count",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    size: 260,
    Cell: ({ renderedCellValue }) => {
      if (renderedCellValue === undefined || renderedCellValue === null) return renderEmptyCell();
      return (
        <span style={{ 
          color: renderedCellValue > 0 ? '#4caf50' : '#f44336',
          fontWeight: 'medium'
        }}>
          {renderedCellValue}
        </span>
      );
    },
  },
  {
    header: Traduction("Data.finalNotesCount"),
    accessorKey: "statistics.final_notes_count",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    size: 260,
    Cell: ({ renderedCellValue }) => {
      if (renderedCellValue === undefined || renderedCellValue === null) return renderEmptyCell();
      return (
        <span style={{ 
          color: renderedCellValue > 0 ? '#4caf50' : '#f44336',
          fontWeight: 'medium'
        }}>
          {renderedCellValue}
        </span>
      );
    },
  },
  {
    header: Traduction("Data.regularTimetablesCount"),
    accessorKey: "statistics.regular_timetables_count",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    size: 320,
    Cell: ({ renderedCellValue }) => {
      if (renderedCellValue === undefined || renderedCellValue === null) return renderEmptyCell();
      return (
        <span style={{ 
          color: renderedCellValue > 0 ? '#4caf50' : '#f44336',
          fontWeight: 'medium'
        }}>
          {renderedCellValue}
        </span>
      );
    },
  },
  {
    header: Traduction("Data.specialSchedulesCount"),
    accessorKey: "statistics.special_schedules_count",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    size: 320,
    Cell: ({ renderedCellValue }) => {
      if (renderedCellValue === undefined || renderedCellValue === null) return renderEmptyCell();
      return (
        <span style={{ 
          color: renderedCellValue > 0 ? '#4caf50' : '#f44336',
          fontWeight: 'medium'
        }}>
          {renderedCellValue}
        </span>
      );
    },
  },
  {
    header: Traduction("Data.timetableExceptionsCount"),
    accessorKey: "statistics.timetable_exceptions_count",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    size: 340,
    Cell: ({ renderedCellValue }) => {
      if (renderedCellValue === undefined || renderedCellValue === null) return renderEmptyCell();
      return (
        <span style={{ 
          color: renderedCellValue > 0 ? '#4caf50' : '#f44336',
          fontWeight: 'medium'
        }}>
          {renderedCellValue}
        </span>
      );
    },
  },
  {
    header: Traduction("Data.schoolEventsCount"),
    accessorKey: "statistics.school_events_count",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    size: 300,
    Cell: ({ renderedCellValue }) => {
      if (renderedCellValue === undefined || renderedCellValue === null) return renderEmptyCell();
      return (
        <span style={{ 
          color: renderedCellValue > 0 ? '#4caf50' : '#f44336',
          fontWeight: 'medium'
        }}>
          {renderedCellValue}
            </span>
      );
    },
  },
  {
    header: Traduction("Data.teacherVocationsCount"),
    accessorKey: "statistics.teacher_vocations_count",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    size: 320,
    Cell: ({ renderedCellValue }) => {
      if (renderedCellValue === undefined || renderedCellValue === null) return renderEmptyCell();
      return (
        <span style={{ 
          color: renderedCellValue > 0 ? '#4caf50' : '#f44336',
          fontWeight: 'medium'
        }}>
          {renderedCellValue}
        </span>
      );
    },
  },
  {
    header: Traduction("Data.notesCount"),
    accessorKey: "statistics.notes_count",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    size: 240,
    Cell: ({ renderedCellValue }) => {
      if (renderedCellValue === undefined || renderedCellValue === null) return renderEmptyCell();
      return (
        <span style={{ 
          color: renderedCellValue > 0 ? '#4caf50' : '#f44336',
          fontWeight: 'medium'
        }}>
          {renderedCellValue}
        </span>
      );
    },
  },
  {
    header: Traduction("Data.evaluationResultsCount"),
    accessorKey: "statistics.evaluation_results_count",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    size: 320,
    Cell: ({ renderedCellValue }) => {
      if (renderedCellValue === undefined || renderedCellValue === null) return renderEmptyCell();
      return (
        <span style={{ 
          color: renderedCellValue > 0 ? '#4caf50' : '#f44336',
          fontWeight: 'medium'
        }}>
          {renderedCellValue}
        </span>
      );
    },
  },
  {
    header: Traduction("Data.gradeAdjustmentsCount"),
    accessorKey: "statistics.grade_adjustments_count",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    size: 320,
    Cell: ({ renderedCellValue }) => {
      if (renderedCellValue === undefined || renderedCellValue === null) return renderEmptyCell();
      return (
        <span style={{ 
          color: renderedCellValue > 0 ? '#4caf50' : '#f44336',
          fontWeight: 'medium'
        }}>
          {renderedCellValue}
        </span>
      );
    },
  },
  {
    header: Traduction("Data.attendancesCount"),
    accessorKey: "statistics.attendances_count",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    size: 280,
    Cell: ({ renderedCellValue }) => {
      if (renderedCellValue === undefined || renderedCellValue === null) return renderEmptyCell();
      return (
        <span style={{ 
          color: renderedCellValue > 0 ? '#4caf50' : '#f44336',
          fontWeight: 'medium'
        }}>
          {renderedCellValue}
        </span>
      );
    },
  },
  {
    header: Traduction("Data.successRate"),
    accessorKey: "student_statistics.success_percentage",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    size: 150,
    Cell: ({ renderedCellValue }) => {
      if (renderedCellValue === undefined || renderedCellValue === null) return renderEmptyCell();
      const color = renderedCellValue >= 50 ? '#4caf50' : '#f44336';
      return (
        <span style={{ 
          color: color,
          fontWeight: 'medium'
        }}>
          {renderedCellValue}%
        </span>
      );
    },
  },
  {
    header: Traduction("Data.boysPercentage"),
    accessorKey: "student_statistics.boys_percentage",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    size: 280,
    Cell: ({ renderedCellValue }) => {
      if (renderedCellValue === undefined || renderedCellValue === null) return renderEmptyCell();
      return (
        <span style={{ 
          color: '#2196f3',
          fontWeight: 'medium'
        }}>
          {renderedCellValue}%
        </span>
      );
    },
  },
  {
    header: Traduction("Data.girlsPercentage"),
    accessorKey: "student_statistics.girls_percentage",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    size: 280,
    Cell: ({ renderedCellValue }) => {
      if (renderedCellValue === undefined || renderedCellValue === null) return renderEmptyCell();
      return (
        <span style={{ 
          color: '#e91e63',
          fontWeight: 'medium'
        }}>
          {renderedCellValue}%
        </span>
      );
    },
  },
  {
    header: Traduction("Data.passedCount"),
    accessorKey: "student_statistics.passed_count",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    size: 250,
    Cell: ({ renderedCellValue }) => {
      if (renderedCellValue === undefined || renderedCellValue === null) return renderEmptyCell();
      return (
        <span style={{ 
          color: '#4caf50',
          fontWeight: 'medium'
        }}>
          {renderedCellValue}
        </span>
      );
    },
  },
  {
    header: Traduction("Data.failedCount"),
    accessorKey: "student_statistics.failed_count",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    size: 240,
    Cell: ({ renderedCellValue }) => {
      if (renderedCellValue === undefined || renderedCellValue === null) return renderEmptyCell();
      return (
        <span style={{ 
          color: '#f44336',
          fontWeight: 'medium'
        }}>
          {renderedCellValue}
        </span>
      );
    },
  },
];

// Export options for column selection
export const AcademicYearsExportOptions = [
  { value: "MatriculeYR", label: "Matricule" },
  { value: "StatusYR", label: "Status" },
  { value: "NameYR", label: "Name" },
  { value: "DescriptionYR", label: "Description" },
  { value: "StartDateYR", label: "Start Date" },
  { value: "EndDateYR", label: "End Date" },
  { value: "ArchivedDateYR", label: "Archived Date" },
  { value: "IsCurrentYR", label: "Is Current" },
  { value: "user.UserNameUT", label: "Created By" },
  { value: "created_at", label: "Created At" },
  { value: "updated_at", label: "Updated At" },
  { value: "statistics.professors_count", label: "Professors Count" },
  { value: "statistics.students_count", label: "Students Count" },
  { value: "statistics.subjects_count", label: "Subjects Count" },
  { value: "statistics.groups_count", label: "Groups Count" },
  { value: "statistics.evaluations_count", label: "Evaluations Count" },
  { value: "statistics.final_notes_count", label: "Final Notes Count" },
  { value: "statistics.regular_timetables_count", label: "Regular Timetables Count" },
  { value: "statistics.special_schedules_count", label: "Special Schedules Count" },
  { value: "statistics.timetable_exceptions_count", label: "Timetable Exceptions Count" },
  { value: "statistics.school_events_count", label: "School Events Count" },
  { value: "statistics.teacher_vocations_count", label: "Teacher Vocations Count" },
  { value: "statistics.notes_count", label: "Notes Count" },
  { value: "statistics.evaluation_results_count", label: "Evaluation Results Count" },
  { value: "statistics.grade_adjustments_count", label: "Grade Adjustments Count" },
  { value: "statistics.attendances_count", label: "Attendances Count" },
  { value: "statistics.is_closed", label: "Is Closed" },
  { value: "student_statistics.success_percentage", label: "Success Rate (%)" },
  { value: "student_statistics.boys_percentage", label: "Boys Percentage (%)" },
  { value: "student_statistics.girls_percentage", label: "Girls Percentage (%)" },
  { value: "student_statistics.passed_count", label: "Passed Students Count" },
  { value: "student_statistics.failed_count", label: "Failed Students Count" },
  { value: "student_statistics.total_students", label: "Total Students" },
  { value: "student_statistics.boys_count", label: "Boys Count" },
  { value: "student_statistics.girls_count", label: "Girls Count" },
  { value: "student_statistics.total_notes", label: "Total Notes" },
];

export const academicYearsSelectedColumns = {
  Status: {
    label: "Status",
    enable: false,
    columns: {
      "StatusYR": false,
      created_at: false,
      updated_at: false,
    },
  },
  Year: {
    label: "Year Information",
    enable: true,
    columns: {
      "NameYR": true,
      "DescriptionYR": true,
    },
  },
  Period: {
    label: "Period Information",
    enable: true,
    columns: {
      "StartDateYR": true,
      "EndDateYR": true,
      "ArchivedDateYR": true,
      "IsCurrentYR": true,
    },
  },
  Statistics: {
    label: "Statistics Information",
    enable: true,
    columns: {
      "statistics.professors_count": true,
      "statistics.students_count": true,
      "statistics.subjects_count": true,
      "statistics.groups_count": true,
      "statistics.evaluations_count": true,
      "statistics.final_notes_count": true,
      "student_statistics.success_percentage": true,
      "student_statistics.boys_percentage": true,
      "student_statistics.girls_percentage": true,
      "student_statistics.passed_count": true,
      "student_statistics.failed_count": true,
    },
  },
};
