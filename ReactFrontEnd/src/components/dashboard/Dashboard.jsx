import React, { useState } from 'react';
import { Box, Container, Grid, Typography, Paper, Stack, Avatar, Tabs, Tab, Select, MenuItem, FormControl, InputLabel, IconButton, Tooltip } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import { useDashboard } from './hooks/useDashboard';
import styles from './Dashboard.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from 'react-router-dom';
import ContentBlock from '../common/ContentBlock';
import { 
  faUsers, 
  faChalkboardTeacher, 
  faSchool, 
  faBookOpen,
  faUserGraduate,
  faCalendarDay,
  faChartLine,
  faCalendarAlt,
  faClipboardList,
  faCalendar,
  faLayerGroup,
  faLevelUpAlt,
  faClipboardCheck,
  faGraduationCap
} from "@fortawesome/free-solid-svg-icons";
import WelcomeSection from './sections/WelcomeSection';
import StatsCards from './sections/StatsCards';
import TimeTableSection from "./sections/TimeTableSection";
import ChartsSection from "./sections/ChartsSection";
import { useSelector } from 'react-redux';
import { useAuth } from '../../utils/contexts/AuthContext';

// Mock data
const mockData = {
  stats: {
    total_students: 3643,
    total_teachers: 254,
    total_staff: 161,
    total_classes: 72,
    total_subjects: 81
  },
  timeTable: {
    "Lundi": [
      { time: "08:00 - 09:30", subject: "Mathématiques", teacher: "M. Martin", room: "101" },
      { time: "09:45 - 11:15", subject: "Physique", teacher: "Mme. Bernard", room: "102" },
      { time: "11:30 - 13:00", subject: "Français", teacher: "M. Dubois", room: "103" }
    ],
    "Mardi": [
      { time: "08:00 - 09:30", subject: "Chimie", teacher: "M. Thomas", room: "104" },
      { time: "09:45 - 11:15", subject: "Histoire", teacher: "Mme. Robert", room: "105" },
      { time: "11:30 - 13:00", subject: "Anglais", teacher: "M. Petit", room: "106" }
    ],
    "Mercredi": [
      { time: "08:00 - 09:30", subject: "SVT", teacher: "Mme. Richard", room: "107" },
      { time: "09:45 - 11:15", subject: "Informatique", teacher: "M. Durand", room: "108" },
      { time: "11:30 - 13:00", subject: "Sport", teacher: "M. Moreau", room: "Gym" }
    ]
  },
  attendanceData: [
    { day: 'Lundi', Present: 120, Absent: 10, Late: 5 },
    { day: 'Mardi', Present: 115, Absent: 15, Late: 3 },
    { day: 'Mercredi', Present: 118, Absent: 12, Late: 4 },
    { day: 'Jeudi', Present: 122, Absent: 8, Late: 2 },
    { day: 'Vendredi', Present: 116, Absent: 14, Late: 6 }
  ],
  performanceData: [
    { performance: 'Excellent', students: 45 },
    { performance: 'Moyen', students: 30 },
    { performance: 'Faible', students: 25 }
  ],
  topSubjectsData: [
    { subject: 'Mathématiques', percentage: 85 },
    { subject: 'Physique', percentage: 75 },
    { subject: 'Chimie', percentage: 70 },
    { subject: 'Biologie', percentage: 65 },
    { subject: 'Anglais', percentage: 80 }
  ],
  genderData: [
    { name: 'Garçons', value: 60 },
    { name: 'Filles', value: 40 }
  ],
  tableData: {
    students: [
      { id: 1, firstName: 'Jean', lastName: 'Dupont', class: '2A', email: 'jean.dupont@email.com' },
      { id: 2, firstName: 'Marie', lastName: 'Martin', class: '1B', email: 'marie.martin@email.com' },
      { id: 3, firstName: 'Pierre', lastName: 'Durand', class: '3C', email: 'pierre.durand@email.com' }
    ],
    teachers: [
      { id: 1, firstName: 'Sophie', lastName: 'Bernard', subject: 'Mathématiques', email: 'sophie.bernard@email.com' },
      { id: 2, firstName: 'Marc', lastName: 'Dubois', subject: 'Physique', email: 'marc.dubois@email.com' },
      { id: 3, firstName: 'Julie', lastName: 'Martin', subject: 'Français', email: 'julie.martin@email.com' }
    ],
    classes: [
      { id: 1, name: '1A', level: 'Première', students: 32, mainTeacher: 'Sophie Bernard' },
      { id: 2, name: '2B', level: 'Deuxième', students: 28, mainTeacher: 'Marc Dubois' },
      { id: 3, name: '3C', level: 'Troisième', students: 30, mainTeacher: 'Julie Martin' }
    ],
    groups: [
      { id: 1, name: 'Groupe A', class: '1A', students: 16, subject: 'Informatique' },
      { id: 2, name: 'Groupe B', class: '1A', students: 16, subject: 'Informatique' },
      { id: 3, name: 'Groupe Sciences', class: '2B', students: 14, subject: 'Sciences' }
    ],
    subjects: [
      { id: 1, name: 'Mathématiques', code: 'MATH', coefficient: 4 },
      { id: 2, name: 'Physique', code: 'PHYS', coefficient: 3 },
      { id: 3, name: 'Français', code: 'FRAN', coefficient: 4 }
    ],
    levels: [
      { id: 1, name: 'Première', code: '1', classes: 4 },
      { id: 2, name: 'Deuxième', code: '2', classes: 4 },
      { id: 3, name: 'Troisième', code: '3', classes: 4 }
    ],
    attendance: [
      { date: '2023-05-15', class: '1A', present: 30, absent: 2, late: 0 },
      { date: '2023-05-15', class: '2B', present: 26, absent: 1, late: 1 },
      { date: '2023-05-15', class: '3C', present: 28, absent: 2, late: 0 }
    ],
    grades: [
      { id: 1, studentName: 'Jean Dupont', subject: 'Mathématiques', grade: 16, date: '2023-05-10' },
      { id: 2, studentName: 'Marie Martin', subject: 'Physique', grade: 14, date: '2023-05-12' },
      { id: 3, studentName: 'Pierre Durand', subject: 'Français', grade: 18, date: '2023-05-14' }
    ]
  }
};

const Dashboard = ({ type = "admin" }) => {
  const navigate = useNavigate();
  const { Language } = useDashboard();
  const { userRole } = useAuth();
  const isDarkMode = useSelector((state) => state?.theme?.darkMode || false);
  
  // Add state for horizontal navigation
  const [activeGestionTab, setActiveGestionTab] = useState('students');
  const [chartsExpanded, setChartsExpanded] = useState(true);
  
  // Define navigation items
  const gestionItems = [
    { key: 'students', label: 'Étudiants', icon: faUserGraduate },
    { key: 'teachers', label: 'Professeurs', icon: faChalkboardTeacher },
    { key: 'classes', label: 'Classes', icon: faSchool },
    { key: 'groups', label: 'Groupes', icon: faLayerGroup },
    { key: 'levels', label: 'Niveaux', icon: faLevelUpAlt },
    { key: 'subjects', label: 'Matières', icon: faBookOpen },
    { key: 'attendance', label: 'Présences', icon: faClipboardCheck },
    { key: 'grades', label: 'Notes', icon: faGraduationCap }
  ];
  const currentClass = 'Class I';
  // Add state to manage active tabs for each section
  const [activeStudentsTab, setActiveStudentsTab] = useState('students');
  const [activeTeachersTab, setActiveTeachersTab] = useState('teachers');
  const [activeClassesTab, setActiveClassesTab] = useState('classes');
  const [activeGroupsTab, setActiveGroupsTab] = useState('groups');
  const [activeLevelsTab, setActiveLevelsTab] = useState('levels');
  const [activeSubjectsTab, setActiveSubjectsTab] = useState('subjects');
  const [activeAttendanceTab, setActiveAttendanceTab] = useState('attendance');
  const [activeGradesTab, setActiveGradesTab] = useState('grades');
  const [selectedTimeTableClass, setSelectedTimeTableClass] = useState('Class I');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedClass, setSelectedClass] = useState('Class I');
  const isMobile = window.innerWidth < 600;

  // Render dashboard based on user type
  const renderDashboard = () => {
    // Admin dashboard
    if (type === "admin") {
      return (
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <WelcomeSection user={{ name: "Admin" }} />
            </Grid>
            
            <Grid item xs={12}>
              <StatsCards stats={mockData.stats} isDarkMode={isDarkMode} />
            </Grid>

            {/* Charts Section */}
            <Grid item xs={12}>
              <ContentBlock
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FontAwesomeIcon icon={faChartLine} style={{ marginRight: '8px' }} />
                    Statistiques et Analyses
                  </Box>
                }
                rightElement={
                  <Box>
                    <Tooltip title={chartsExpanded ? "Collapse" : "Expand"}>
                      <IconButton 
                        size="small"
                        onClick={() => setChartsExpanded(!chartsExpanded)}
                        sx={{ 
                          color: isDarkMode ? 'rgba(224, 224, 224, 0.8)' : 'rgba(0, 0, 0, 0.54)'
                        }}
                      >
                        {chartsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
              >
                <ChartsSection
                  isDarkMode={isDarkMode}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  mockAttendanceData={mockData.attendanceData}
                  mockGenderData={mockData.genderData}
                  mockPerformanceData={mockData.performanceData}
                  mockTopSubjectsData={mockData.topSubjectsData}
                  mockSuccessFailureData={mockData.performanceData}
                  mockPerformanceTrendData={mockData.performanceData}
                  mockClassSizeData={mockData.tableData.classes}
                  selectedClass={selectedClass}
                  setSelectedClass={setSelectedClass}
                  isMobile={isMobile}
                  expanded={chartsExpanded}
                />
              </ContentBlock>
            </Grid>
            
            {/* Timetable Section */}
            <Grid item xs={12}>
              <ContentBlock
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FontAwesomeIcon icon={faCalendar} style={{ marginRight: '8px' }} />
                    Emploi du Temps
                  </Box>
                }
                rightElement={
                  <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel 
                      id="class-select-label"
                      sx={{ color: isDarkMode ? 'rgba(224, 224, 224, 0.8)' : 'text.primary' }}
                    >
                      Classe
                    </InputLabel>
                    <Select
                      labelId="class-select-label"
                      value={selectedTimeTableClass}
                      onChange={(e) => setSelectedTimeTableClass(e.target.value)}
                      label="Classe"
                      sx={{
                        color: isDarkMode ? '#e0e0e0' : 'text.primary',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: isDarkMode ? 'rgba(224, 224, 224, 0.3)' : 'inherit'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: isDarkMode ? 'rgba(224, 224, 224, 0.5)' : 'inherit'
                        }
                      }}
                    >
                      <MenuItem value="Class I">Classe I</MenuItem>
                      <MenuItem value="Class II">Classe II</MenuItem>
                      <MenuItem value="Class III">Classe III</MenuItem>
                      <MenuItem value="Class IV">Classe IV</MenuItem>
                    </Select>
                  </FormControl>
                }
              >
                <TimeTableSection 
                  isDarkMode={isDarkMode}
                  selectedTimeTableClass={selectedTimeTableClass}
                  setSelectedTimeTableClass={setSelectedTimeTableClass}
                />
              </ContentBlock>
            </Grid>
            
          </Grid>
        </Container>
      );
    } 
    // Professor dashboard
    else if (type === "professeur") {
      return (
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <WelcomeSection user={{ name: "Professeur" }} />
            </Grid>
            
            {/* Classes Section */}
            <Grid item xs={12}>
              <ContentBlock>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  <FontAwesomeIcon icon={faSchool} style={{ marginRight: '8px' }} />
                  Mes Classes
                </Typography>
                <Grid container spacing={3}>
                  {mockData.tableData.classes.map((classItem) => (
                    <Grid item xs={12} md={4} key={classItem.id}>
                      <Paper 
                        elevation={1}
                        sx={{ 
                          p: 3, 
                          bgcolor: isDarkMode ? 'rgba(35, 47, 63, 0.8)' : 'white',
                          color: isDarkMode ? '#e0e0e0' : 'inherit',
                          borderRadius: 2,
                          height: '100%',
                          '&:hover': {
                            boxShadow: 3,
                            cursor: 'pointer'
                          }
                        }}
                      >
                        <Typography variant="h6" sx={{ mb: 1 }}>Classe {classItem.name}</Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          Niveau: {classItem.level}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {classItem.students} étudiants
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </ContentBlock>
            </Grid>
            
            {/* Timetable Section */}
            <Grid item xs={12}>
              <ContentBlock>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  <FontAwesomeIcon icon={faCalendar} style={{ marginRight: '8px' }} />
                  Mon Emploi du Temps
                </Typography>
                <TimeTableSection isDarkMode={isDarkMode} />
              </ContentBlock>
            </Grid>
          </Grid>
        </Container>
      );
    } 
    // Student dashboard
    else if (type === "etudiant") {
      return (
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <WelcomeSection user={{ name: "Étudiant" }} />
            </Grid>
            
            {/* Timetable Section */}
            <Grid item xs={12}>
              <ContentBlock>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  <FontAwesomeIcon icon={faCalendar} style={{ marginRight: '8px' }} />
                  Mon Emploi du Temps
                </Typography>
                <TimeTableSection isDarkMode={isDarkMode} />
              </ContentBlock>
            </Grid>
          </Grid>
        </Container>
      );
    }
  };

  return (
    <Box sx={{ 
      backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(248, 250, 252, 0.95)',
      color: isDarkMode ? '#e0e0e0' : 'inherit',
      transition: 'all 0.3s ease',
      minHeight: '100vh',
      py: 4,
      borderRadius: '10px'
    }}>
      {renderDashboard()}
    </Box>
  );
};

export default Dashboard;