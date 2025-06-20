import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  FormControl, 
  Select, 
  MenuItem, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Avatar, 
  InputLabel,
  useTheme,
  CircularProgress,
  IconButton
} from '@mui/material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import styles from '../Dashboard.module.css';
import ActionMenu from '../../menu/ActionMenu';
import { useTranslation } from 'react-i18next';
import SelectField from '../../Fields/SelectField';
import axios from 'axios';
import { 
  getTimeTableResources, 
  createTimeTableEntry, 
  updateTimeTablePosition,
  getGroupTimeTable,
  deleteTimeTableEntry,
  updateTimeTableEntry
} from '../../../api/apiServices';

const TimeTableSection = ({ 
  selectedTimeTableClass, 
  setSelectedTimeTableClass,
  isDarkMode,
  timeSlots = [],
  daysOfWeek = [],
  isLoading = false,
  ExtraTimeTableData = [],
  modifiable = false
}) => {
  const { t: Traduction } = useTranslation();
  const theme = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [defaultSelected, setDefaultSelected] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [scheduleData, setScheduleData] = useState({});
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(selectedTimeTableClass || '');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState(null);
  const currentClass = selectedTimeTableClass || 'Class I';
  const RoleUT = sessionStorage.getItem("userRole");

  useEffect(() => {
    if (selectedTeacher) {
      setSelectedSubject(
        teachers.find(teacher => teacher.MatriculePR === selectedTeacher)?.matiere.MatriculeMT || ''
      );
    }
  }, [selectedTeacher, teachers]);

  useEffect(() => {
    if (selectedTimeTableClass) {
      fetchTimeTableData();
    }
  }, [selectedTimeTableClass, selectedSlot]);

  useEffect(() => {
    if (selectedTimeTableClass) {
      setSelectedGroup(selectedTimeTableClass);
    }
  }, [selectedTimeTableClass]);

  const handleDelete = async (id) => {
    if (!modifiable) {
      alert(Traduction('No permission to modify timetable'));
      return;
    }
    try {
      await deleteTimeTableEntry(id);
      alert(Traduction('Timetable entry deleted successfully'));
      await fetchTimeTableData();
    } catch (error) {
      console.error('Failed to delete:', error);
      alert(Traduction('Error occurred during deletion'));
    }
  };

  const handleUpdate = async (id, formData) => {
    if (!modifiable) {
      alert(Traduction('No permission to modify timetable'));
      return;
    }
    try {
      const updatedEntry = await updateTimeTableEntry(id, formData);
      alert(Traduction('Timetable entry updated successfully'));
      await fetchTimeTableData();
      return updatedEntry;
    } catch (error) {
      console.error('Update error:', error.message);
      alert(Traduction('Failed to update timetable entry'));
    }
  };
 const getSubjectColor = (subject) => {
    const lightColors = [
      '#ffebee', '#f3e5f5', '#e8f5e9', '#e3f2fd', '#fff3e0',
      '#e0f7fa', '#fce4ec', '#f1f8e9', '#ede7f6', '#e0f2f1',
      '#fff8e1', '#f9fbe7', '#ede7f6', '#e8eaf6', '#fbe9e7'
    ];

    const darkColors = [
      'rgba(255, 235, 238, 0.1)', 'rgba(243, 229, 245, 0.1)', 'rgba(232, 245, 233, 0.1)',
      'rgba(227, 242, 253, 0.1)', 'rgba(255, 243, 224, 0.1)', 'rgba(224, 247, 250, 0.1)',
      'rgba(252, 228, 236, 0.1)', 'rgba(241, 248, 233, 0.1)', 'rgba(237, 231, 246, 0.1)',
      'rgba(224, 242, 241, 0.1)', 'rgba(255, 248, 225, 0.1)', 'rgba(249, 251, 231, 0.1)',
      'rgba(237, 231, 246, 0.1)', 'rgba(232, 234, 246, 0.1)', 'rgba(251, 233, 231, 0.1)'
    ];

    if (!subject || typeof subject !== 'string') {
      return isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#f5f5f5';
    }

    const hash = [...subject].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = hash % lightColors.length;

    return isDarkMode ? darkColors[index] : lightColors[index];
  };
  const fetchTimeTableData = async () => {
    try {
      setIsLoadingData(true);
      setError(null);
      const [resourcesData, timeTableData] = await Promise.all([
        getTimeTableResources(
          selectedSlot?.timeSlot?.MatriculeTS || null,
          selectedSlot?.day?.MatriculeDW || null,
          selectedSlot?.day?.MatriculeDW && 
          selectedSlot?.timeSlot?.MatriculeTS ? 
            selectedTimeTableClass || null : 
            null,
        ),
        getGroupTimeTable(selectedTimeTableClass).catch(() => ExtraTimeTableData)
      ]);
      console.log("TB:",timeTableData,"ETB:",ExtraTimeTableData)
      const effectiveData = timeTableData && timeTableData?.length ? timeTableData : ExtraTimeTableData;

      const transformedData = effectiveData?.reduce((acc, item) => {
        const day = Traduction(item.day_week?.DayNameDW || item.dayName);
        const key = `${day}-${item.time_slot?.StartTimeTS || item.startTime} - ${item.time_slot?.EndTimeTS || item.endTime}`;
        acc[key] = {
          id: item.MatriculeRT || item.id,
          subject: item.matiere?.NameMT || item.subjectName,
          teacher: item.professeur ? 
            `${item.professeur.user.NomPL} ${item.professeur.user.PrenomPL}` : 
            item.teacherName,
          group: item.group?.NameGP || item.groupName,
          room: item.salle?.NameSL || item.roomName,
          color: getSubjectColor(item.matiere?.NameMT || item.subjectName),
          matiereid: item.matiere?.MatriculeMT || item.subjectId,
          profid: item.professeur?.MatriculePR || item.teacherId,
          dayid: item.day_week?.MatriculeDW || item.dayId,
          timeid: item.time_slot?.MatriculeTS || item.timeSlotId,
          groupid: item.group?.MatriculeGP || item.groupId,
          salleid: item.salle?.MatriculeSL || item.roomId
        };
        return acc;
      }, {});
      console.log("transformedData",transformedData)
      setScheduleData(transformedData);
      setTeachers(resourcesData.professeurs || []);
      setGroups(resourcesData.groups || []);
      setRooms(resourcesData.salles || []);
    } catch (error) {
      console.error('Error fetching timetable data:', error);
      setError(error.message);
    } finally {
      setIsLoadingData(false);
    }
  };

  if (isLoading || isLoadingData) {
    return (
      <Box 
        sx={{ 
          p: 4, 
          textAlign: 'center',
          bgcolor: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          borderRadius: 2,
          border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : theme.palette.divider}`
        }}
      >
        <CircularProgress 
          sx={{ 
            color: isDarkMode ? '#60a5fa' : theme.palette.primary.main,
            mb: 2
          }} 
        />
        <Typography 
          variant="h6" 
          sx={{ 
            color: isDarkMode ? '#ffffff' : 'text.primary',
            mb: 1
          }}
        >
          {Traduction("Loading configuration...")}
        </Typography>
      </Box>
    );
  }

  if (!timeSlots.length || !daysOfWeek.length || !Object.keys(scheduleData).length) {
    let message;
    if (RoleUT === "admin") {
      message = Traduction("Should be configure the daysweek and timeslots");
    } else if (RoleUT === "etudiant") {
      message = Traduction("You must be assigned to a group to view your timetable. Please wait for the administration to configure your access.");
    } else if (RoleUT === "professeur") {
      message = Traduction("Please wait for the administration to configure your schedule.");
    }

    return (
      <Box 
        sx={{ 
          p: 4, 
          textAlign: 'center',
          bgcolor: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          borderRadius: 2,
          border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : theme.palette.divider}`
        }}
      >
        <Typography 
          variant="h6" 
          sx={{
            color: isDarkMode ? '#ffffff' : 'text.primary',
            mb: 1
          }}
        >
          {message}
        </Typography>
      </Box>
    );
  }

  const handleSlotClick = (day, timeSlot, scheduleItem) => {
    if (!modifiable && RoleUT !== "admin") return;
    
    const selectedDay = daysOfWeek.find(d => d.day === day.day);
    const selectedTimeSlot = timeSlots.find(ts => ts.time === timeSlot.time);
    setDefaultSelected(scheduleItem);
    setSelectedSlot({ 
      day: {
        name: day.day,
        MatriculeDW: selectedDay?.MatriculeDW
      }, 
      timeSlot: {
        time: timeSlot.time,
        MatriculeTS: selectedTimeSlot?.MatriculeTS
      }
    });
    setShowModal(true);
  };

  const onDragEnd = async (result) => {
    if (!modifiable || RoleUT !== "admin") {
      alert(Traduction('No permission to modify timetable'));
      return;
    }

    const { source, destination } = result;

    if (!destination) return;

    const sourceKey = `${source.droppableId}-${timeSlots[source.index].time}`;
    const destKey = `${destination.droppableId}-${timeSlots[destination.index].time}`;

    if (sourceKey === destKey) return;

    try {
      const sourceDay = daysOfWeek.find(d => d.day === source.droppableId);
      const destDay = daysOfWeek.find(d => d.day === destination.droppableId);
      const sourceTimeSlot = timeSlots[source.index];
      const destTimeSlot = timeSlots[destination.index];
      const obj = {
        source: {
          day: sourceDay?.MatriculeDW,
          time_slot: sourceTimeSlot?.MatriculeTS
        },
        destination: {
          day: destDay?.MatriculeDW,
          time_slot: destTimeSlot?.MatriculeTS
        },
        group_id: selectedTimeTableClass
      };
      await updateTimeTablePosition(obj);

      const newScheduleData = { ...scheduleData };
      const sourceItem = scheduleData[sourceKey];
      const destItem = scheduleData[destKey];

      if (sourceItem) {
        delete newScheduleData[sourceKey];
      }
      if (destItem) {
        newScheduleData[sourceKey] = destItem;
      }
      if (sourceItem) {
        newScheduleData[destKey] = sourceItem;
      }

      setScheduleData(newScheduleData);
    } catch (error) {
      console.error('Error updating position:', error);
      setError(error.message);
    }
  };

  const handleSaveSchedule = async () => {
    if (!modifiable || RoleUT !== "admin") {
      alert(Traduction('No permission to modify timetable'));
      return;
    }

    if (selectedSlot && selectedSubject && selectedTeacher && selectedGroup && selectedGroup !== "null" && selectedRoom) {
      try {
        const scheduleKey = `${selectedSlot.day.name}-${selectedSlot.timeSlot.time}`;
        const response = await createTimeTableEntry({
          MatriculeDW: selectedSlot.day.MatriculeDW,
          MatriculeTS: selectedSlot.timeSlot.MatriculeTS,
          MatriculeMT: selectedSubject,
          MatriculePR: selectedTeacher,
          MatriculeGP: selectedGroup,
          MatriculeSL: selectedRoom
        });
        setScheduleData(prev => ({
          ...prev,
          [scheduleKey]: {
            id: response.id,
            subject: response.matiere.NameMT,
            teacher: `${response.professeur.user.NomPL} ${response.professeur.user.PrenomPL}`,
            group: response.group.NameGP,
            room: response.salle.NameSL,
            color: getSubjectColor(response.matiere.NameMT),
            matiereid: response.matiere.MatriculeMT,
            profid: response.professeur.MatriculePR,
            dayid: response.day_week.MatriculeDW,
            timeid: response.time_slot.MatriculeTS,
            groupid: response.group.MatriculeGP,
            salleid: response.salle.MatriculeSL
          }
        }));
        await fetchTimeTableData();
        setShowModal(false);
        resetSelections();
      } catch (error) {
        console.error('Error saving schedule:', error);
        setError(error.message);
      }
    }
  };

  const resetSelections = () => {
    setSelectedSubject('');
    setSelectedTeacher('');
    setSelectedGroup('');
    setSelectedRoom('');
  };

  const renderTimeSlot = (provided, snapshot, day, slot, scheduleItem) => (
    <Box
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`${styles.timeSlotCard} ${snapshot.isDragging ? styles.dragging : ''} ${isDarkMode ? styles.darkMode : ''}`}
      sx={{
        backgroundColor: scheduleItem ? getSubjectColor(scheduleItem.subject) : isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
        borderRadius: 1,
        p: 1,
        boxShadow: snapshot.isDragging ? 3 : 1,
        minHeight: '120px',
        mb: 1,
        cursor: modifiable && RoleUT === "admin" ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: modifiable && RoleUT === "admin" ? 3 : 1,
          transform: modifiable && RoleUT === "admin" ? 'translateY(-2px)' : 'none'
        },
        ...provided.draggableProps.style
      }}
      onClick={() => handleSlotClick(day, slot, scheduleItem)}
    >
      <Box sx={{ 
        fontSize: '0.75rem', 
        color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary', 
        mb: 0.5 
      }}>
        {slot.displayTime}
      </Box>
      {scheduleItem && (
        <>
          <Box sx={{ 
            fontWeight: 'medium', 
            mb: 0.5,
            color: isDarkMode ? '#ffffff' : 'text.primary'
          }}>
            {scheduleItem.subject}
          </Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            fontSize: '0.75rem',
            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'
          }}>
            <Avatar
              src={`/professeurs/${scheduleItem?.teacher?.toLowerCase()}.jpg`}
              alt={scheduleItem.teacher}
              sx={{ width: 16, height: 16, mr: 0.5 }}
            />
            <Typography variant="caption">{scheduleItem.teacher}</Typography>
          </Box>
          <Box>
            {scheduleItem.room}
          </Box>
        </>
      )}
    </Box>
  );

  return (
    <Box>
      {error && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'error.main', color: 'white', borderRadius: 1 }}>
          {error}
        </Box>
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <Box className={styles.timeTableModern}>
          <Box 
            className={styles.timeTableHeader} 
            sx={{ 
              display: 'flex', 
              borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : theme.palette.divider}`,
              bgcolor: isDarkMode ? 'rgba(59, 130, 246, 0.8)' : theme.palette.primary.light,
              borderRadius: '8px 8px 0 0',
              overflow: 'hidden'
            }}
          >
            {daysOfWeek?.map((day) => (
              <Box 
                key={day.day} 
                className={styles.dayColumn}
                sx={{ 
                  flex: 1, 
                  p: 1,
                  textAlign: 'center',
                  borderRight: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : theme.palette.divider}`,
                  '&:last-child': {
                    borderRight: 'none'
                  }
                }}
              >
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: '#ffffff'
                  }}
                >
                  {day.day}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box 
            className={styles.timeTableContent} 
            sx={{ 
              display: 'flex',
              bgcolor: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : theme.palette.background.paper,
              borderRadius: '0 0 8px 8px',
              border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : theme.palette.divider}`,
              borderTop: 'none'
            }}
          >
            {daysOfWeek?.map((day) => (
              <Droppable droppableId={day.day} key={day.day}>
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`${styles.dayColumn} ${snapshot.isDraggingOver ? styles.dragOver : ''}`}
                    sx={{ 
                      flex: 1,
                      p: 1,
                      minHeight: '500px',
                      borderRight: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : theme.palette.divider}`,
                      backgroundColor: snapshot.isDraggingOver ? 
                        (isDarkMode ? 'rgba(255, 255, 255, 0.05)' : theme.palette.action.hover) : 
                        'transparent',
                      transition: 'background-color 0.2s ease',
                      '&:last-child': {
                        borderRight: 'none'
                      }
                    }}
                  >
                    {timeSlots?.map((slot, index) => {
                      const scheduleKey = `${day.day}-${slot.time}`;
                      const scheduleItem = scheduleData[scheduleKey];
                      return (
                        <Draggable
                          key={scheduleKey}
                          draggableId={scheduleKey}
                          index={index}
                          isDragDisabled={!modifiable || RoleUT !== "admin"}
                        >
                          {(provided, snapshot) => renderTimeSlot(provided, snapshot, day, slot, scheduleItem)}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            ))}
          </Box>
        </Box>
      </DragDropContext>

      <Dialog 
        open={showModal} 
        onClose={() => {
          setDefaultSelected(null);
          setShowModal(false);
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'background.paper',
            color: isDarkMode ? '#ffffff' : 'text.primary'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : theme.palette.divider}`, 
            pb: 2 
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ScheduleIcon sx={{ mr: 1, color: isDarkMode ? '#60a5fa' : theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ color: isDarkMode ? '#ffffff' : 'text.primary' }}>
              {selectedSlot ? `${selectedSlot.day.name} - ${selectedSlot.timeSlot.time}` : ''}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ minWidth: 100, color: isDarkMode ? '#ffffff' : 'text.primary' }}>
                {Traduction('Teacher')}:
              </Typography>
              <Box sx={{ flex: 1 }}>
                <FormControl fullWidth disabled={!modifiable || RoleUT !== "admin"}>
                  <InputLabel id="teacher-select-label">{Traduction('Teacher')}</InputLabel>
                  <Select
                    labelId="teacher-select-label"
                    id="teacher-select"
                    value={selectedTeacher || defaultSelected?.profid || ''}
                    label={Traduction('Teacher')}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                    sx={{
                      color: isDarkMode ? '#ffffff' : 'text.primary',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: isDarkMode ? '#fff' : 'rgba(0, 0, 0, 0.87)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: isDarkMode ? '#fff' : theme.palette.primary.main,
                      }
                    }}
                  >
                    {defaultSelected?.profid && (
                      <MenuItem key={defaultSelected.profid} value={defaultSelected.profid}>
                        {defaultSelected.teacher}
                      </MenuItem>
                    )}
                    {teachers?.map((teacher) => (
                      <MenuItem key={teacher.MatriculePR} value={teacher.MatriculePR}>
                        {teacher.user.NomPL} {teacher.user.PrenomPL}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ minWidth: 100, color: isDarkMode ? '#ffffff' : 'text.primary' }}>
                {Traduction('Room')}:
              </Typography>
              <Box sx={{ flex: 1 }}>
                <FormControl fullWidth disabled={!modifiable || RoleUT !== "admin"}>
                  <InputLabel id="room-select-label">{Traduction('Room')}</InputLabel>
                  <Select
                    labelId="room-select-label"
                    id="room-select"
                    value={selectedRoom || defaultSelected?.salleid || ''}
                    label={Traduction('Room')}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    sx={{
                      color: isDarkMode ? '#ffffff' : 'text.primary',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: isDarkMode ? '#fff' : 'rgba(0, 0, 0, 0.87)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: isDarkMode ? '#fff' : theme.palette.primary.main,
                      }
                    }}
                  >
                    {defaultSelected?.salleid && (
                      <MenuItem key={defaultSelected.salleid} value={defaultSelected.salleid}>
                        {defaultSelected.room}
                      </MenuItem>
                    )}
                    {rooms?.map((room) => (
                      <MenuItem key={room.MatriculeSL} value={room.MatriculeSL}>
                        {room.NameSL}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions 
          sx={{ 
            px: 3, 
            py: 2, 
            borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : theme.palette.divider}` 
          }}
        >
          <Button 
            variant="outlined" 
            onClick={() => {
              setDefaultSelected(null);
              setShowModal(false);
            }}
            sx={{
              color: isDarkMode ? '#ffffff' : 'text.primary',
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'inherit',
              '&:hover': {
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'inherit'
              }
            }}
          >
            {Traduction('actions.cancel')}
          </Button>
          {defaultSelected?.room && defaultSelected?.teacher && modifiable && RoleUT === "admin" && (
            <Button 
              variant="contained" 
              onClick={() => {
                const RT = defaultSelected.id;
                if (RT) {
                  handleDelete(RT);
                  setDefaultSelected(null);
                  setShowModal(false);
                }
              }}
              disabled={!defaultSelected.id}
              sx={{
                bgcolor: isDarkMode ? '#3b82f6' : theme.palette.primary.main,
                '&:hover': {
                  bgcolor: isDarkMode ? '#2563eb' : theme.palette.primary.dark
                }
              }}
            >
              {Traduction("actions.clear")}
            </Button>
          )}
          {!(defaultSelected?.room && defaultSelected?.teacher) ? (
            <Button 
              variant="contained" 
              onClick={() => {
                handleSaveSchedule();
                setDefaultSelected(null);
                setShowModal(false);
              }}
              disabled={!modifiable || RoleUT !== "admin" || !selectedSubject || !selectedTeacher || !selectedGroup || !selectedRoom}
              sx={{
                bgcolor: isDarkMode ? '#3b82f6' : theme.palette.primary.main,
                '&:hover': {
                  bgcolor: isDarkMode ? '#2563eb' : theme.palette.primary.dark
                }
              }}
            >
              {Traduction('actions.add')}
            </Button>
          ) : (
            <Button 
              variant="contained" 
              onClick={() => {
                const obj = {
                  id: defaultSelected.id,
                  data: {
                    MatriculeGP: defaultSelected.groupid,
                    MatriculeTS: defaultSelected.timeid,
                    MatriculeDW: defaultSelected.dayid,
                    MatriculePR: selectedTeacher || defaultSelected?.profid,
                    MatriculeMT: defaultSelected.matiereid,
                    MatriculeSL: selectedRoom || defaultSelected?.salleid,
                  }
                };
                if (
                  obj.id &&
                  obj.data.MatriculeGP &&
                  obj.data.MatriculeTS &&
                  obj.data.MatriculeDW &&
                  obj.data.MatriculePR &&
                  obj.data.MatriculeMT &&
                  obj.data.MatriculeSL
                ) {
                  handleUpdate(obj.id, obj.data);
                  setDefaultSelected(null);
                  resetSelections();
                  setShowModal(false);
                }
              }}
              disabled={
                !modifiable ||
                RoleUT !== "admin" ||
                !defaultSelected?.id ||
                !defaultSelected?.groupid ||
                !defaultSelected?.timeid ||
                !defaultSelected?.dayid ||
                !defaultSelected?.matiereid ||
                !defaultSelected?.profid ||
                !defaultSelected?.salleid
              }
              sx={{
                bgcolor: isDarkMode ? '#3b82f6' : theme.palette.primary.main,
                '&:hover': {
                  bgcolor: isDarkMode ? '#2563eb' : theme.palette.primary.dark
                }
              }}
            >
              {Traduction('actions.update')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TimeTableSection;