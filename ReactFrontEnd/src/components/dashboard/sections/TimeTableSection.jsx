import React, { useState } from 'react';
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
  useTheme
} from '@mui/material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import styles from '../Dashboard.module.css';

const TimeTableSection = ({ 
  selectedTimeTableClass, 
  setSelectedTimeTableClass,
  isDarkMode
}) => {
  const theme = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [scheduleData, setScheduleData] = useState({
    'Monday-09:00 - 09:45': { subject: 'Maths', teacher: 'Jacquelin', color: '#ffebee', id: 'slot-1' },
    'Monday-09:45 - 10:30': { subject: 'English', teacher: 'Hellana', color: '#f3e5f5', id: 'slot-2' },
    'Monday-10:45 - 11:30': { subject: 'Computer', teacher: 'Daniel', color: '#e8f5e9', id: 'slot-3' },
    'Tuesday-09:00 - 09:45': { subject: 'Spanish', teacher: 'Erickson', color: '#e3f2fd', id: 'slot-4' },
  });

  const currentClass = selectedTimeTableClass || 'Class I';

  const timeSlots = [
    { time: '09:00 - 09:45', displayTime: '09:00 - 09:45 AM' },
    { time: '09:45 - 10:30', displayTime: '09:45 - 10:30 AM' },
    { time: '10:45 - 11:30', displayTime: '10:45 - 11:30 AM' },
    { time: '11:30 - 12:15', displayTime: '11:30 - 12:15 PM' },
    { time: '01:30 - 02:15', displayTime: '01:30 - 02:15 PM' },
    { time: '02:15 - 03:00', displayTime: '02:15 - 03:00 PM' },
    { time: '03:15 - 04:00', displayTime: '03:15 - 04:00 PM' },
  ];

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getSubjectColor = (subject) => {
    const colorMap = {
      'Maths': isDarkMode ? 'rgba(255, 235, 238, 0.1)' : '#ffebee',
      'English': isDarkMode ? 'rgba(243, 229, 245, 0.1)' : '#f3e5f5',
      'Computer': isDarkMode ? 'rgba(232, 245, 233, 0.1)' : '#e8f5e9',
      'Spanish': isDarkMode ? 'rgba(227, 242, 253, 0.1)' : '#e3f2fd',
      'Physics': isDarkMode ? 'rgba(255, 243, 224, 0.1)' : '#fff3e0',
      'Chemistry': isDarkMode ? 'rgba(243, 229, 245, 0.1)' : '#f3e5f5',
      'Science': isDarkMode ? 'rgba(224, 247, 250, 0.1)' : '#e0f7fa'
    };
    return colorMap[subject] || (isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#ffffff');
  };

  const handleSlotClick = (day, timeSlot) => {
    setSelectedSlot({ day, timeSlot });
    setShowModal(true);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const sourceKey = `${source.droppableId}-${timeSlots[source.index].time}`;
    const destKey = `${destination.droppableId}-${timeSlots[destination.index].time}`;

    if (sourceKey === destKey) {
      return;
    }

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
        minHeight: '70px',
        mb: 1,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-2px)'
        },
        ...provided.draggableProps.style
      }}
      onClick={() => handleSlotClick(day, slot)}
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
              src={`/avatars/${scheduleItem.teacher.toLowerCase()}.jpg`}
              alt={scheduleItem.teacher}
              sx={{ width: 16, height: 16, mr: 0.5 }}
            />
            <Typography variant="caption">{scheduleItem.teacher}</Typography>
          </Box>
        </>
      )}
    </Box>
  );

  return (
    <Box>
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
            {daysOfWeek.map((day) => (
              <Box 
                key={day} 
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
                  {day}
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
            {daysOfWeek.map((day) => (
              <Droppable droppableId={day} key={day}>
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
                    {timeSlots.map((slot, index) => {
                      const scheduleKey = `${day}-${slot.time}`;
                      const scheduleItem = scheduleData[scheduleKey];
                      
                      return (
                        <Draggable
                          key={scheduleKey}
                          draggableId={scheduleKey}
                          index={index}
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
        onClose={() => setShowModal(false)}
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
              {selectedSlot ? `${selectedSlot.day} - ${selectedSlot.timeSlot.displayTime}` : ''}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 1 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel 
              id="subject-label"
              sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.primary' }}
            >
              Matière
            </InputLabel>
            <Select
              labelId="subject-label"
              label="Matière"
              defaultValue="Maths"
              sx={{
                color: isDarkMode ? '#ffffff' : 'text.primary',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'inherit'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'inherit'
                }
              }}
            >
              <MenuItem value="Maths">Maths</MenuItem>
              <MenuItem value="English">English</MenuItem>
              <MenuItem value="Computer">Computer</MenuItem>
              <MenuItem value="Spanish">Spanish</MenuItem>
              <MenuItem value="Physics">Physics</MenuItem>
              <MenuItem value="Chemistry">Chemistry</MenuItem>
              <MenuItem value="Science">Science</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel 
              id="teacher-label"
              sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.primary' }}
            >
              Professeur
            </InputLabel>
            <Select
              labelId="teacher-label"
              label="Professeur"
              defaultValue="Jacquelin"
              sx={{
                color: isDarkMode ? '#ffffff' : 'text.primary',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'inherit'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'inherit'
                }
              }}
            >
              <MenuItem value="Jacquelin">Jacquelin</MenuItem>
              <MenuItem value="Hellana">Hellana</MenuItem>
              <MenuItem value="Daniel">Daniel</MenuItem>
              <MenuItem value="Erickson">Erickson</MenuItem>
              <MenuItem value="Teresa">Teresa</MenuItem>
              <MenuItem value="Aaron">Aaron</MenuItem>
              <MenuItem value="Morgan">Morgan</MenuItem>
            </Select>
          </FormControl>
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
            onClick={() => setShowModal(false)}
            sx={{
              color: isDarkMode ? '#ffffff' : 'text.primary',
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'inherit',
              '&:hover': {
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'inherit'
              }
            }}
          >
            Annuler
          </Button>
          <Button 
            variant="contained" 
            onClick={() => setShowModal(false)}
            sx={{
              bgcolor: isDarkMode ? '#3b82f6' : theme.palette.primary.main,
              '&:hover': {
                bgcolor: isDarkMode ? '#2563eb' : theme.palette.primary.dark
              }
            }}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TimeTableSection;