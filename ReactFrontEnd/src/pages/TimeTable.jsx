import { useState, useEffect, useMemo } from 'react';
import { Card } from "react-bootstrap";
import { 
    Box, 
    Button, 
    IconButton, 
    Tooltip, 
    Paper, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel,
    TextField,
    Typography,
    ListSubheader,
    InputAdornment,
    RadioGroup,
    FormControlLabel,
    Radio
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faCalendarAlt, faBroom } from '@fortawesome/free-solid-svg-icons';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import ActionMenu from '../components/menu/ActionMenu';
import FormWrapper from '../components/form/FormWrapper';
import { useTheme } from '@mui/material/styles';
import { useDays, useTimeSlots, useSaveDays, useSaveTimeSlots, useFetchData } from '../api/queryHooks';
import { useSelector } from 'react-redux';
import { MainProvider } from '../utils/contexts/MainContext';
import MultiSelectField from '../components/Fields/MultiSelectField';
import { useForm } from 'react-hook-form';
import { message } from 'antd';
import TimeTableSection from '../components/dashboard/sections/TimeTableSection';
import { generateFullTimetable,ClearFullTimetable, getGroupTimeTable, saveDays, saveTimeSlots } from '../api/apiServices';
import { useAuth } from "../utils/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { TimetableSelector } from "../components/dashboard/Dashboard";
// Enhanced Group Select Component
export const EnhancedGroupSelect = ({ 
    niveaux = [], 
    selectedGroup, 
    handleGroupChange, 
    Traduction,
    isDarkMode ,
    defaultViewMode = "group"
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [open, setOpen] = useState(false);
    const [viewMode, setViewMode] = useState(defaultViewMode); // 'group' or 'prof'

    // Process niveaux data and filter by search term
    const groupedAndFilteredClasses = useMemo(() => {
        const result = {};

        niveaux.forEach(niveau => {
            // Filter groups within this niveau based on search term
            const filteredGroups = niveau.groups?.filter(group => {
                const groupMatch = group.NameGP?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    niveau.NomNV?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    group.MatriculeGP?.toLowerCase().includes(searchTerm.toLowerCase());
                
                // If showing by prof, also check professor names
                if (viewMode === 'prof' && group.professeurs) {
                    const profMatch = group.professeurs.some(prof => 
                        prof.user.NamePL?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        prof.user.PrenomPL?.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                    return groupMatch || profMatch;
                }
                
                return groupMatch;
            }) || [];

            // Only include niveau if it has filtered groups
            if (filteredGroups.length > 0) {
                result[niveau.NomNV] = filteredGroups.sort((a, b) => 
                    a.NameGP.localeCompare(b.NameGP)
                );
            }
        });

        return result;
    }, [niveaux, searchTerm, viewMode]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSelectOpen = () => {
        setOpen(true);
    };

    const handleSelectClose = () => {
        setOpen(false);
        setSearchTerm(''); // Reset search when closing
    };

    const handleViewModeChange = (event) => {
        setViewMode(event.target.value);
        setSearchTerm(''); // Reset search when changing mode
    };

    const renderMenuItems = () => {
        const items = [];
        
        Object.entries(groupedAndFilteredClasses).forEach(([niveauName, groups]) => {
            // Add niveau header
            items.push(
                <ListSubheader 
                    key={`header-${niveauName}`}
                    sx={{ 
                        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                        fontWeight: 'bold',
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'primary.main'
                    }}
                >
                    {niveauName}
                </ListSubheader>
            );
            
            // Add groups for this niveau
            groups.forEach(group => {
                if (viewMode === 'group') {
                    // Show groups only
                    items.push(
                        <MenuItem 
                            key={group.MatriculeGP} 
                            value={group.MatriculeGP}
                            sx={{ 
                                pl: 4,
                                color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'inherit'
                            }}
                        >
                            <Box>
                                <Typography variant="body1">{group.NameGP}</Typography>
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary'
                                    }}
                                >
                                    {niveauName}
                                </Typography>
                            </Box>
                        </MenuItem>
                    );
                } else {
                    // Show groups with professors
                    // First add the group as a subheader
                    items.push(
                        <ListSubheader 
                            key={`group-header-${group.MatriculeGP}`}
                            sx={{ 
                                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                                fontWeight: 'medium',
                                color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.primary',
                                pl: 6,
                                fontSize: '0.875rem'
                            }}
                        >
                            {group.NameGP}
                        </ListSubheader>
                    );
                    
                    // Then add professors for this group
                    if (group.professeurs && group.professeurs.length > 0) {
                        group.professeurs.forEach(prof => {
                            items.push(
                                <MenuItem 
                                    key={`${group.MatriculeGP}-${prof.MatriculePR}`} 
                                    value={prof.MatriculePR}
                                    sx={{ 
                                        pl: 8,
                                        color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'inherit'
                                    }}
                                >
                                    <Box>
                                        <Typography variant="body2">
                                            {prof.user.PrenomPL} {prof.user.NomPL}
                                        </Typography>
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'text.secondary'
                                            }}
                                        >
                                            {prof.user.EmailPL || group.NameGP}
                                        </Typography>
                                    </Box>
                                </MenuItem>
                            );
                        });
                    } else {
                        // If no professors, show a placeholder
                        items.push(
                            <MenuItem 
                                disabled
                                key={`no-prof-${group.MatriculeGP}`}
                                sx={{ 
                                    pl: 8,
                                    color: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'text.disabled'
                                }}
                            >
                                <Typography variant="caption">
                                    {Traduction('No professors assigned')}
                                </Typography>
                            </MenuItem>
                        );
                    }
                }
            });
        });

        return items;
    };

    return (
        <Box sx={{ display:'flex', flexDirection: 'row', gap: 2, width:"850px" }}>
            {/* Radio buttons for view mode */}
            <Box sx={{ mt: 1, }}>
                <FormControl component="fieldset">
                    <RadioGroup
                        row
                        value={viewMode}
                        onChange={handleViewModeChange}
                        sx={{ gap: 3 }}
                    >
                        <FormControlLabel 
                            value="group" 
                            control={
                                <Radio 
                                    sx={{ 
                                        color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'inherit'
                                    }} 
                                />
                            } 
                            label={
                                <Typography sx={{ 
                                    color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'inherit' 
                                }}>
                                    {Traduction('Show by Group')}
                                </Typography>
                            }
                        />
                        <FormControlLabel 
                            value="prof" 
                            control={
                                <Radio 
                                    sx={{ 
                                        color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'inherit'
                                    }} 
                                />
                            } 
                            label={
                                <Typography sx={{ 
                                    color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'inherit' 
                                }}>
                                    {Traduction('Show by Prof')}
                                </Typography>
                            }
                        />
                    </RadioGroup>
                </FormControl>
            </Box>

            {/* Select component */}
            <FormControl sx={{ width: "500px" }}>
                <InputLabel 
                    id="group-select-label"
                    sx={{ 
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'inherit'
                    }}
                >
                    {viewMode === 'group' ? Traduction('Select Group') : Traduction('Select Professor')}
                </InputLabel>
                <Select
                    labelId="group-select-label"
                    value={selectedGroup}
                    onChange={handleGroupChange}
                    label={viewMode === 'group' ? Traduction('Select Group') : Traduction('Select Professor')}
                    open={open}
                    onOpen={handleSelectOpen}
                    onClose={handleSelectClose}
                    sx={{
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'inherit',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'inherit'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'inherit'
                        }
                    }}
                    MenuProps={{
                        PaperProps: {
                            sx: { 
                                maxHeight: 400,
                                backgroundColor: isDarkMode ? '#1e293b' : 'white',
                                color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'inherit'
                            }
                        }
                    }}
                >
                    {/* Search field at the top of dropdown */}
                    <Box sx={{ 
                        px: 2, 
                        py: 1, 
                        position: 'sticky', 
                        top: 0, 
                        backgroundColor: isDarkMode ? '#1e293b' : 'white', 
                        zIndex: 100,
                        borderBottom: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)'
                    }}>
                        <TextField
                            size="small"
                            placeholder={
                                viewMode === 'group' 
                                    ? Traduction('Search groups...') 
                                    : Traduction('Search groups and professors...')
                            }
                            value={searchTerm}
                            onChange={handleSearchChange}
                            fullWidth
                            sx={{
                                '& .MuiInputBase-input': {
                                    color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'inherit'
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'inherit'
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon 
                                            fontSize="small" 
                                            sx={{ 
                                                color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'inherit'
                                            }}
                                        />
                                    </InputAdornment>
                                ),
                            }}
                            onClick={(e) => e.stopPropagation()} // Prevent select from closing
                            onKeyDown={(e) => e.stopPropagation()} // Prevent select navigation
                        />
                    </Box>
                    
                    {/* Render grouped menu items */}
                    {renderMenuItems()}
                    
                    {/* Show message when no results found */}
                    {Object.keys(groupedAndFilteredClasses).length === 0 && (
                        <MenuItem disabled>
                            <Typography 
                                sx={{ 
                                    color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary'
                                }}
                            >
                                {viewMode === 'group' 
                                    ? Traduction('No groups found') 
                                    : Traduction('No groups or professors found')
                                }
                            </Typography>
                        </MenuItem>
                    )}
                </Select>
            </FormControl>
        </Box>
    );
};

const TimeTableContent = () => {
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
    const [showtype,setshowtype] =useState("my");
    useEffect(() => {
        if (!userRole || !["admin", "etudiant", "professeur"].includes(userRole)) {
            nav("/YLSchool/Login");
        }
    }, [userRole, nav]);
    const MatriculeUT = sessionStorage.getItem("userID");
    const { data: selectedGroupData } = useFetchData("getgroupfromuser/"+MatriculeUT);
    const { data: groupsData, isLoading: isLoadingGroups } = userRole !== "professeur" ? useFetchData("getallniveauxwithgroups") : useFetchData("getallniveauxwithgroups/"+MatriculeUT);
    const { data: timeSlotsData, isLoading: isLoadingTimeSlots } = useTimeSlots();
    const { data: daysData, isLoading: isLoadingDays } = useDays();
    useEffect(()=>{
      console.log("profid:",selectedGroupData);
      if(selectedGroupData && showtype === "my") setSelectedGroup(selectedGroupData)
        else setSelectedGroup("");
    },[selectedGroupData,showtype])
    useEffect(() => {
        if (!isLoadingGroups && groupsData?.length) { // Changed to check niveaux
            setNiveaux(groupsData); // Changed to set niveaux
        }
    }, [groupsData, isLoadingGroups]);
    useEffect(()=>setSelectedGroup(selectedGroupData),[selectedGroupData])
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
    const handleClearTimeTable = async () => {
        try {
            const timetable = await ClearFullTimetable();
            message.success(Traduction('TimeTable cleared successfully'));
        } catch (error) {
            console.error('Error clearing time table:', error);
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
        <div id="info">
            <Card 
                className={`shadow-lg rounded-2xl p-6 ${isDarkMode ? 'bg-dark text-light' : 'bg-white text-dark'}`}
                style={{
                    backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    color: isDarkMode ? '#e0e0e0' : 'inherit',
                    transition: 'all 0.3s ease',
                    borderRadius: '10px',
                    border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)'
                }}
            >
                {/* Header */}
                <div 
                    className="cardHeader text-white h-20 flex items-center p-6 rounded-xl justify-between"
                    style={{
                        backgroundColor: isDarkMode ? '#1e293b' : '#2a2185',
                        color: '#fff',
                        transition: 'all 0.3s ease',
                    }}
                >
                    <div className="h4">{Traduction('Time Table Management')}</div>
                    {
                        userRole === 'admin' && (
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleClearTimeTable}
                                    startIcon={<FontAwesomeIcon icon={faBroom} />}
                                    sx={{
                                        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.2)',
                                        color: '#fff',
                                        borderRadius: '8px',
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        padding: '6px 12px',
                                        fontSize: '0.85rem',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        boxShadow: 'none',
                                        marginRight: '8px',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.25)',
                                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                        }
                                    }}
                                >
                                    {Traduction('Clear Time Table')}
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleGenerateTimeTable}
                                    startIcon={<FontAwesomeIcon icon={faCalendarAlt} />}
                                    sx={{
                                        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.2)',
                                        color: '#fff',
                                        borderRadius: '8px',
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        padding: '6px 12px',
                                        fontSize: '0.85rem',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        boxShadow: 'none',
                                        marginRight: '8px',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.25)',
                                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                        }
                                    }}
                                >
                                    {Traduction('Generate Time Table')}
                                </Button>
                            </div>       
                        )
                    }
                </div>

                {/* Main Content */}
                <div className="p-6 pb-0">
                    <div className="overflow-x-auto" style={{height:"100%"}}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

                            {/* Time Table Section */}
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
                                        {
                                            userRole === "admin" && (
                                                <>
                                                    <EnhancedGroupSelect
                                                        niveaux={niveaux}
                                                        selectedGroup={selectedGroup}
                                                        handleGroupChange={handleGroupChange}
                                                        Traduction={Traduction}
                                                        isDarkMode={isDarkMode}
                                                    />
                                                    <FormWrapper
                                                        refetch = {()=>{}}
                                                        matricule = {null}
                                                        row = {null}
                                                        typeOpt = 'CONFIG'
                                                        ExtraTableName = 'config-timetable'
                                                    />
                                                </>
                                            )
                                        }
                                        {
                                            userRole === "professeur" && (
                                                <TimetableSelector
                                                  groupOptions={niveaux}
                                                  profID={selectedGroup}
                                                  setSelectedGroup={setSelectedGroup}
                                                  setshowtype={setshowtype}
                                                />
                                            )
                                        }
                                    </Box>
                                    <TimeTableSection
                                        selectedTimeTableClass={selectedGroup}
                                        setSelectedTimeTableClass={setSelectedGroup}
                                        isDarkMode={isDarkMode}
                                        timeSlots={transformTimeSlotsForSection()}
                                        daysOfWeek={transformDaysForSection()}
                                        isLoading={isLoadingDays || isLoadingTimeSlots || isLoadingTimeTable}
                                        timeTableData={timeTableData}
                                        modifiable = {userRole === "admin"}
                                    />
                                </Paper>
                            </Box>
                        </Box>
                    </div>
                </div>
            </Card>
        </div>
    );
};

const TimeTable = () => {
    return (
        <div>
            <TimeTableContent />
        </div>
    );
};

export default TimeTable;