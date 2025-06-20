import { useState, useEffect, useMemo } from 'react';
import { Radio, RadioGroup ,FormControlLabel, Box, Container, Grid, Typography, Paper, Stack, Avatar, Tabs, Tab, Select, MenuItem, FormControl, InputLabel, IconButton, Tooltip } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import { useDashboard } from './hooks/useDashboard';
import styles from './Dashboard.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useLocation } from 'react-router-dom';
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
import StatsCardsProf from './sections/StatsCardsProf';
import TimeTableSection from "./sections/TimeTableSection";
import ChartsSection from "./sections/ChartsSection";
import { useSelector } from 'react-redux';
import { useAuth } from '../../utils/contexts/AuthContext';
import { EnhancedGroupSelect } from '../../pages/TimeTable';
import { useTranslation } from 'react-i18next';
import { useDays, useTimeSlots, useSaveDays, useSaveTimeSlots, useFetchData } from '../../api/queryHooks';
import { message } from 'antd';
import { generateFullTimetable, getGroupTimeTable, saveDays, saveTimeSlots } from '../../api/apiServices';
import { useTheme } from '@mui/material/styles';

// Mock data
const mockData = {
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
  const location = useLocation();
  const { Language } = useDashboard();
  const { userRole, isAuthenticated, checkTokenValidity } = useAuth();
  const isDarkMode = useSelector((state) => state?.theme?.darkMode || false);
  
  // Log authentication state for debugging
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    console.log('Dashboard Auth State:', {
      isAuthenticated,
      userRole,
      hasToken: !!token,
      tokenValue: token,
      path: location.pathname
    });
  }, [isAuthenticated, userRole, location.pathname]);
  
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
  const [activeTab, setActiveTab] = useState('gender');
  const [selectedClass, setSelectedClass] = useState('Class I');
  const isMobile = window.innerWidth < 600;

  // Render dashboard based on user type
  const renderDashboard = () => {
    // Admin dashboard
    if (type === "admin") {
      const { data: AdminDashboardData } = useFetchData("dashboard/admin");
      const { 
        stats = {},
        gender_distribution = [{name:"male",value:0},{name:"female",value:0}]
      } = AdminDashboardData || {};
        const { t: Traduction } = useTranslation();
          const theme = useTheme();
          const isDarkMode = useSelector((state) => state?.theme?.darkMode || false);
              const [niveaux, setNiveaux] = useState([]); // Changed from TimeTableClasses to niveaux
      
          const [TimeTableClasses, setTimeTableClasses] = useState([]);
          const [selectedGroup, setSelectedGroup] = useState('');
          const [timeTableData, setTimeTableData] = useState(null);
          const [isLoadingTimeTable, setIsLoadingTimeTable] = useState(false);
          const { userRole } = useAuth();
          const nav = useNavigate();
      
          useEffect(() => {
              if (!userRole || !["admin", "etudiant", "professeur"].includes(userRole)) {
                  nav("/YLSchool/Login");
              }
          }, [userRole, nav]);
      
          const { data: groupsData, isLoading: isLoadingGroups } = useFetchData("getallniveauxwithgroups");
          const { data: timeSlotsData, isLoading: isLoadingTimeSlots } = useTimeSlots();
          const { data: daysData, isLoading: isLoadingDays } = useDays();
          useEffect(() => {
              if (!isLoadingGroups && groupsData?.length) { // Changed to check niveaux
                  setNiveaux(groupsData); // Changed to set niveaux
              }
          }, [groupsData, isLoadingGroups]);
      
          useEffect(() => {
              if (selectedGroup) {
                  fetchTimeTableData();
              }
          }, [selectedGroup]);
      
          const fetchTimeTableData = async () => {
              try {
                  setIsLoadingTimeTable(true);
                  const response = await getGroupTimeTable(selectedGroup);
                  setTimeTableData(response);
              } catch (error) {
                  console.error('Error fetching time table data:', error);
              } finally {
                  setIsLoadingTimeTable(false);
              }
          };
      
          const handleGroupChange = (event) => {
              setSelectedGroup(event.target.value);
          };
      
          const handleGenerateTimeTable = async () => {
              try {
                  const timetable = await generateFullTimetable();
                  console.log("generation: ", timetable)
                  message.success(Traduction('TimeTable Generated successfully'));
              } catch (error) {
                  console.error('Error generating time table:', error);
              }
          };
      
          // Transform time slots data for TimeTableSection
          const transformTimeSlotsForSection = () => {
              if (!timeSlotsData) return [];
              return timeSlotsData.map(slot => ({
                  time: `${slot.StartTimeTS} - ${slot.EndTimeTS}`,
                  displayTime: `${slot.StartTimeTS} - ${slot.EndTimeTS}`,
                  MatriculeTS: slot.MatriculeTS
              }));
          };
      
          // Transform days data for TimeTableSection
          const transformDaysForSection = () => {
              if (!daysData?.data) return [];
              return daysData.data.map(day => ({
                  day: Traduction(day.DayNameDW),
                  MatriculeDW: day.MatriculeDW
              }));
          };

      return (
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <WelcomeSection user={{ name: "Admin" }} />
            </Grid>
            
            <Grid item xs={12}>
              <StatsCards stats={stats} isDarkMode={isDarkMode} />
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
                  mockGenderData={gender_distribution}
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
              <Box sx={{ mt: 2 }}>
                <Paper  
                    elevation={2} 
                    sx={{ 
                        p: 2,
                        backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        color: isDarkMode ? '#e0e0e0' : 'inherit',
                        border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)'
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <h3>{Traduction('Time Table')}</h3>
                        {/* Enhanced Group Select */}
                        <EnhancedGroupSelect
                            niveaux={niveaux}
                            selectedGroup={selectedGroup}
                            handleGroupChange={handleGroupChange}
                            Traduction={Traduction}
                            isDarkMode={isDarkMode}
                        />
                    </Box>{console.log("selected : ",selectedGroup,timeTableData)}
                    <TimeTableSection
                        selectedTimeTableClass={selectedGroup}
                        setSelectedTimeTableClass={setSelectedGroup}
                        isDarkMode={isDarkMode}
                        timeSlots={transformTimeSlotsForSection()}
                        daysOfWeek={transformDaysForSection()}
                        isLoading={isLoadingDays || isLoadingTimeSlots || isLoadingTimeTable}
                        ExtratimeTableData={timeTableData}
                    />
                </Paper>
              </Box>
            </Grid>
            
          </Grid>
        </Container>
      );
    } 
    // Professor dashboard
    else if (type === "professeur") {
      
      const MatriculeUT = sessionStorage.getItem("userID");
      const { data:ProfesseurDashboadData, isLoading:ProfesseurDashboadLoading } = useFetchData("dashboard/professeur/"+MatriculeUT);
        const { 
        stats = {},
        gender_distribution = [{name:"male",value:0},{name:"female",value:0}],
        selectedGroup:ProfID
      } = ProfesseurDashboadData || {};
        const { t: Traduction } = useTranslation();
          const theme = useTheme();
          const isDarkMode = useSelector((state) => state?.theme?.darkMode || false);
              const [niveaux, setNiveaux] = useState([]); // Changed from TimeTableClasses to niveaux
      
          const [TimeTableClasses, setTimeTableClasses] = useState([]);
          const [selectedGroup, setSelectedGroup] = useState(ProfID);
          const [timeTableData, setTimeTableData] = useState(null);
          const [isLoadingTimeTable, setIsLoadingTimeTable] = useState(false);
          const [showtype,setshowtype] =useState("my");
          const { userRole } = useAuth();
          const nav = useNavigate();
          useEffect(()=>{
            console.log("profid:",ProfID);
            if(ProfID && showtype === "my") setSelectedGroup(ProfID)
              else setSelectedGroup("");
          },[ProfID,showtype])
          useEffect(() => {
              if (!userRole || !["admin", "etudiant", "professeur"].includes(userRole)) {
                  nav("/YLSchool/Login");
              }
          }, [userRole, nav]);
      
          const { data: groupsData, isLoading: isLoadingGroups } = useFetchData("getallniveauxwithgroups/"+MatriculeUT);
          const { data: timeSlotsData, isLoading: isLoadingTimeSlots } = useTimeSlots();
          const { data: daysData, isLoading: isLoadingDays } = useDays();
          useEffect(() => {
              if (!isLoadingGroups && groupsData?.length) { // Changed to check niveaux
                  setNiveaux(groupsData); // Changed to set niveaux
              }
          }, [groupsData, isLoadingGroups]);
      
          useEffect(() => {
              if (selectedGroup) {
                  fetchTimeTableData();
              }
          }, [selectedGroup,showtype]);
      
          const fetchTimeTableData = async () => {
              try {
                  setIsLoadingTimeTable(true);
                  const response = await getGroupTimeTable(selectedGroup);
                  setTimeTableData(response);
              } catch (error) {
                  console.error('Error fetching time table data:', error);
              } finally {
                  setIsLoadingTimeTable(false);
              }
          };
      
          // Transform time slots data for TimeTableSection
          const transformTimeSlotsForSection = () => {
              if (!timeSlotsData) return [];
              return timeSlotsData.map(slot => ({
                  time: `${slot.StartTimeTS} - ${slot.EndTimeTS}`,
                  displayTime: `${slot.StartTimeTS} - ${slot.EndTimeTS}`,
                  MatriculeTS: slot.MatriculeTS
              }));
          };
      
          // Transform days data for TimeTableSection
          const transformDaysForSection = () => {
              if (!daysData?.data) return [];
              return daysData.data.map(day => ({
                  day: Traduction(day.DayNameDW),
                  MatriculeDW: day.MatriculeDW
              }));
          };

      return (
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <WelcomeSection user={{ name: "Professeur" }} />
            </Grid>
            
            <Grid item xs={12}>
              <StatsCardsProf stats={stats} isDarkMode={isDarkMode} />
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
                  mockGenderData={gender_distribution}
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
              <Box sx={{ mt: 2 }}>
                <Paper  
                    elevation={2} 
                    sx={{ 
                        p: 2,
                        backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        color: isDarkMode ? '#e0e0e0' : 'inherit',
                        border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)'
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <h3>{Traduction('Time Table')}</h3>
                        {/* Enhanced Group Select */}
                        <TimetableSelector
                          groupOptions={niveaux}
                          profID={selectedGroup}
                          setSelectedGroup={setSelectedGroup}
                          setshowtype={setshowtype}
                        />
                    </Box>{console.log("selected : ",selectedGroup,timeTableData)}
                    <TimeTableSection
                        selectedTimeTableClass={selectedGroup}
                        setSelectedTimeTableClass={setSelectedGroup}
                        isDarkMode={isDarkMode}
                        timeSlots={transformTimeSlotsForSection()}
                        daysOfWeek={transformDaysForSection()}
                        isLoading={isLoadingDays || isLoadingTimeSlots || isLoadingTimeTable || ProfesseurDashboadLoading}
                        ExtratimeTableData={timeTableData}
                    />
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      );
    } 
    // Student dashboard
    else if (type === "etudiant") {
      const MatriculeUT = sessionStorage.getItem("userID");
      const { t:Traduction } = useTranslation();
      const { data:EtudiantDashboadData, isLoading:EtudiantDashboadLoading } = useFetchData("dashboard/etudiant/"+MatriculeUT);
      console.log(EtudiantDashboadData);
        const transformTimeSlotsForSection = () => {
              if (!EtudiantDashboadData?.timeSlotsData) return [];
              return EtudiantDashboadData?.timeSlotsData.map(slot => ({
                  time: `${slot.StartTimeTS} - ${slot.EndTimeTS}`,
                  displayTime: `${slot.StartTimeTS} - ${slot.EndTimeTS}`,
                  MatriculeTS: slot.MatriculeTS
              }));
          };
      
          // Transform days data for TimeTableSection
          const transformDaysForSection = () => {
              if (!EtudiantDashboadData?.daysData) return [];
              return EtudiantDashboadData?.daysData.map(day => ({
                  day: Traduction(day.DayNameDW),
                  MatriculeDW: day.MatriculeDW
              }));
          };
          
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
                    <TimeTableSection
                        selectedTimeTableClass={EtudiantDashboadData?.selectedGroup}
                        setSelectedTimeTableClass={()=>{}}
                        isDarkMode={isDarkMode}
                        timeSlots={transformTimeSlotsForSection()}
                        daysOfWeek={transformDaysForSection()}
                        isLoading={EtudiantDashboadLoading}
                        timeTableData={EtudiantDashboadData?.timeTableData}
                    />
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

export const TimetableSelector = ({groupOptions,ProfID,setSelectedGroup,setshowtype}) => {
  const [selection, setSelection] = useState('my');
  const [selectGroup,SetSelectGroup] = useState("")
  const handleRadioChange = (event) => {
    setSelection(event.target.value);
    setshowtype(event.target.value);
    setSelectedGroup(event.target.value === "my" ? ProfID : ""); // Reset group when switching
    SetSelectGroup("");
  };

  const handleGroupChange = (event) => {
    setSelectedGroup(event.target.value);
    SetSelectGroup(event.target.value);
  };

  return (
    <Box p={2} sx={{display:"flex",flexDirection:"row",width:selection !== "my" ? "1000px" : "auto"}}>

      <RadioGroup row sx={{width:selection !== "my" ? "650px" : "auto"}} value={selection} onChange={handleRadioChange}>
        <FormControlLabel value="my" control={<Radio />} label="Show my timetable" />
        <FormControlLabel value="group" control={<Radio />} label="Show by my groups" />
      </RadioGroup>

      {selection === 'group' && (
        <>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Group</InputLabel>
            <Select value={selectGroup} onChange={handleGroupChange} label="Select Group">
              {groupOptions.map((group) => (
                <MenuItem key={group.MatriculeGP} value={group.MatriculeGP}>
                  {group.NameGP}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
    </Box>
  );
};

export default Dashboard;