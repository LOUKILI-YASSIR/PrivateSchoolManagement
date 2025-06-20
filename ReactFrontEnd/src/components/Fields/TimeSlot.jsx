import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faPlus, faTrash, faEdit, faCog, faHand } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { 
  Box, 
  Button, 
  Stack, 
  Tooltip, 
  IconButton, 
  Paper, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Grid,
  TextField,
  Tabs,
  Tab,
  Divider,
  Switch,
  FormControlLabel
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { message } from 'antd';

// Extend dayjs with the isSameOrBefore plugin
dayjs.extend(isSameOrBefore);

const TIME_SLOT = ({ 
  register, 
  fieldItem, 
  handleChange, 
  errors, 
  isFilter = false 
}) => {
  const theme = useTheme();
  const [showExisting, setShowExisting] = useState(true);
  const [currentMethod, setCurrentMethod] = useState(0); // 0: Manual, 1: Automatic
  const [isAdding, setIsAdding] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  
  // Manual form data
  const [manualFormData, setManualFormData] = useState({
    StartTimeTS: '00:00',
    EndTimeTS: '00:00',
  });

  // Automatic form data
  const [automaticFormData, setAutomaticFormData] = useState({
    startTime: '08:00',
    endTime: '18:00',
    slotDuration: 60, // minutes
    breakDuration: 0, // minutes (default 0)
  });
  useEffect(()=>{
    handleChange({ target : { value : fieldItem?.props?.value || [] } }, fieldItem?.label || '')
  },[fieldItem?.props?.value])
  const { t: Traduction } = useTranslation();
  const [existingTimeSlots,setExistingTimeSlots] = useState(fieldItem?.props?.value || [])
  // Get field name and current value from fieldItem
  const fieldName = fieldItem?.label || 'timeSlots';
  const fieldProps = fieldItem?.props || {};

  // Time options
  const hours = Array.from({ length: 24 }, (_, i) => ({
    value: i.toString().padStart(2, '0'),
    label: i.toString().padStart(2, '0'),
  }));

  const minutes = Array.from({ length: 12 }, (_, i) => ({
    value: (i * 5).toString().padStart(2, '0'),
    label: (i * 5).toString().padStart(2, '0'),
  }));

  // Duration options (in minutes)
  const durationOptions = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' },
  ];

  // Break duration options (in minutes)
  const breakOptions = [
    { value: 0, label: 'No break' },
    { value: 5, label: '5 minutes' },
    { value: 10, label: '10 minutes' },
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
  ];

  // Generate unique ID for new time slots
  const generateMatriculeTS = () => {
    return `TS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Update field value using handleChange or register
  const updateFieldValue = (newValue) => {
    if (handleChange) {
      console.log(newValue)
      handleChange({ target: { value: newValue } }, fieldName);
      setExistingTimeSlots(newValue)
    }
    // Also trigger register update if available
    if (register && register(fieldName)) {
      const field = register(fieldName);
      if (field.onChange) {
        field.onChange({ target: { value: newValue } });
      }
    }
  };

  // Handle manual time selection changes
  const handleManualTimeChange = (field, type, value) => {
    setManualFormData((prev) => {
      const currentTime = prev[field] || '00:00';
      const [currentHour, currentMinute] = currentTime.split(':');
      const newTime = type === 'hour' 
        ? `${value}:${currentMinute}` 
        : `${currentHour}:${value}`;
      
      return { ...prev, [field]: newTime };
    });
  };

  // Handle automatic form changes
  const handleAutomaticChange = (field, value) => {
    setAutomaticFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Generate automatic time slots
  const generateAutomaticTimeSlots = () => {
    const { startTime, endTime, slotDuration, breakDuration } = automaticFormData;
    
    if (!startTime || !endTime || !slotDuration) {
      message.error(Traduction('Please fill in all required fields for automatic generation'));
      return [];
    }

    const start = dayjs(startTime, 'HH:mm');
    const end = dayjs(endTime, 'HH:mm');
    
    if (end.isSameOrBefore(start)) {
      message.error(Traduction('End time must be after start time'));
      return [];
    }

    const slots = [];
    let currentStart = start;
    let slotNumber = 1;

    while (currentStart.add(slotDuration, 'minute').isSameOrBefore(end)) {
      const currentEnd = currentStart.add(slotDuration, 'minute');
      
      slots.push({
        MatriculeTS: `AUTO_${generateMatriculeTS()}_${slotNumber}`,
        StartTimeTS: currentStart.format('HH:mm'),
        EndTimeTS: currentEnd.format('HH:mm'),
      });

      // Add break duration for next slot start time
      currentStart = currentEnd.add(breakDuration, 'minute');
      slotNumber++;
    }

    return slots;
  };

  // Validate time slot
  const validateTimeSlot = (start, end, excludeMatricule = null) => {
    if (!start || !end) {
      message.error(Traduction('Please select both start and end times'));
      return false;
    }

    const startTime = dayjs(start, 'HH:mm');
    const endTime = dayjs(end, 'HH:mm');

    if (endTime.isSameOrBefore(startTime)) {
      message.error(Traduction('End time must be after start time'));
      return false;
    }

    // Check for overlapping time slots
    const isOverlapping = existingTimeSlots.some(slot => {
      if (excludeMatricule && slot.MatriculeTS === excludeMatricule) {
        return false; // Skip the slot being edited
      }
      
      const slotStart = dayjs(slot.StartTimeTS, 'HH:mm');
      const slotEnd = dayjs(slot.EndTimeTS, 'HH:mm');
      
      return (
        (startTime.isBefore(slotEnd) && endTime.isAfter(slotStart))
      );
    });

    if (isOverlapping) {
      message.error(Traduction('Time slot overlaps with existing time slot'));
      return false;
    }

    return true;
  };

  // Handle manual save action
  const handleManualSave = () => {
    const excludeMatricule = editingSlot ? editingSlot.MatriculeTS : null;
    
    if (validateTimeSlot(manualFormData.StartTimeTS, manualFormData.EndTimeTS, excludeMatricule)) {
      const timeSlotData = {
        MatriculeTS: editingSlot ? editingSlot.MatriculeTS : generateMatriculeTS(),
        StartTimeTS: manualFormData.StartTimeTS,
        EndTimeTS: manualFormData.EndTimeTS,
      };

      let updatedSlots;
      if (editingSlot) {
        // Update existing time slot
        updatedSlots = existingTimeSlots.map(slot => 
          slot.MatriculeTS === editingSlot.MatriculeTS ? timeSlotData : slot
        );
        message.success(Traduction('Time slot updated successfully'));
      } else {
        // Add new time slot
        updatedSlots = [...existingTimeSlots, timeSlotData];
        message.success(Traduction('Time slot added successfully'));
      }

      // Update the field value
      updateFieldValue(updatedSlots);

      // Reset form
      setManualFormData({ StartTimeTS: '00:00', EndTimeTS: '00:00' });
      setIsAdding(false);
      setEditingSlot(null);
    }
  };

  // Handle automatic generation
  const handleAutomaticGenerate = () => {
    const newSlots = generateAutomaticTimeSlots();
    
    if (newSlots.length > 0) {
      // Check if any generated slots overlap with existing ones
      const hasOverlap = newSlots.some(newSlot => 
        existingTimeSlots.some(existingSlot => {
          const newStart = dayjs(newSlot.StartTimeTS, 'HH:mm');
          const newEnd = dayjs(newSlot.EndTimeTS, 'HH:mm');
          const existingStart = dayjs(existingSlot.StartTimeTS, 'HH:mm');
          const existingEnd = dayjs(existingSlot.EndTimeTS, 'HH:mm');
          
          return (newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart));
        })
      );

      if (hasOverlap) {
        if (!window.confirm(Traduction('Some generated slots may overlap with existing ones. Do you want to replace all existing slots?'))) {
          return;
        }
        // Replace all existing slots
        updateFieldValue(newSlots);
      } else {
        // Add to existing slots
        updateFieldValue([...existingTimeSlots, ...newSlots]);
      }

      message.success(Traduction(`${newSlots.length} time slots generated successfully`));
      setIsAdding(false);
    }
  };

  // Handle edit initialization
  const handleEdit = (slot) => {
    setManualFormData({
      StartTimeTS: slot.StartTimeTS,
      EndTimeTS: slot.EndTimeTS,
    });
    setEditingSlot(slot);
    setCurrentMethod(0); // Switch to manual mode for editing
    setIsAdding(true);
  };

  // Handle cancel
  const handleCancel = () => {
    setIsAdding(false);
    setEditingSlot(null);
    setManualFormData({ StartTimeTS: '00:00', EndTimeTS: '00:00' });
  };

  // Handle delete action
  const handleDelete = (slot) => {
    if (window.confirm(Traduction('Are you sure you want to delete this time slot?'))) {
      const updatedSlots = existingTimeSlots.filter(
        existingSlot => existingSlot.MatriculeTS !== slot.MatriculeTS
      );
      updateFieldValue(updatedSlots);
      message.success(Traduction('Time slot deleted successfully'));
    }
  };

  // Clear all slots
  const handleClearAll = () => {
    if (window.confirm(Traduction('Are you sure you want to delete all time slots?'))) {
      updateFieldValue([]);
      message.success(Traduction('All time slots deleted successfully'));
    }
  };

  // Render manual time select component
  const renderTimeSelect = (field, label) => {
    const time = manualFormData[field] || '00:00';
    const [hour, minute] = time.split(':');

    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {label}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth size="small">
            <InputLabel>{Traduction('Hour')}</InputLabel>
            <Select
              value={hour}
              label={Traduction('Hour')}
              onChange={(e) => handleManualTimeChange(field, 'hour', e.target.value)}
            >
              {hours.map((h) => (
                <MenuItem key={h.value} value={h.value}>
                  {h.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth size="small">
            <InputLabel>{Traduction('Minute')}</InputLabel>
            <Select
              value={minute}
              label={Traduction('Minute')}
              onChange={(e) => handleManualTimeChange(field, 'minute', e.target.value)}
            >
              {minutes.map((m) => (
                <MenuItem key={m.value} value={m.value}>
                  {m.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    );
  };

  // Render automatic configuration form
  const renderAutomaticForm = () => (
    <Stack spacing={3}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            size="small"
            type="time"
            label={Traduction('Start Time')}
            value={automaticFormData.startTime}
            onChange={(e) => handleAutomaticChange('startTime', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            size="small"
            type="time"
            label={Traduction('End Time')}
            value={automaticFormData.endTime}
            onChange={(e) => handleAutomaticChange('endTime', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>
      
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl fullWidth size="small">
            <InputLabel>{Traduction('Slot Duration')}</InputLabel>
            <Select
              value={automaticFormData.slotDuration}
              label={Traduction('Slot Duration')}
              onChange={(e) => handleAutomaticChange('slotDuration', e.target.value)}
            >
              {durationOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {Traduction(option.label)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth size="small">
            <InputLabel>{Traduction('Break Duration')}</InputLabel>
            <Select
              value={automaticFormData.breakDuration}
              label={Traduction('Break Duration')}
              onChange={(e) => handleAutomaticChange('breakDuration', e.target.value)}
            >
              {breakOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {Traduction(option.label)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Typography variant="body2" color="text.secondary">
        {Traduction('This will generate time slots from')} {automaticFormData.startTime} {Traduction('to')} {automaticFormData.endTime} 
        {Traduction(', each lasting')} {automaticFormData.slotDuration} {Traduction('minutes')}
        {automaticFormData.breakDuration > 0 && (
          <> {Traduction('with')} {automaticFormData.breakDuration} {Traduction('minutes break between slots')}</>
        )}
      </Typography>
    </Stack>
  );

  return (
    <Box sx={{ position: 'relative', zIndex: 1, p: 2 }}>
      {/* Header Actions */}
      <Stack direction="row" spacing={1} sx={{ mb: 2 }} justifyContent="space-between">
        <Stack direction="row" spacing={1}>
          <Tooltip title={showExisting ? Traduction('Hide Time Slots') : Traduction('Show Time Slots')}>
            <IconButton
              onClick={() => setShowExisting(!showExisting)}
              sx={{ color: theme.palette.primary.main }}
            >
              <FontAwesomeIcon icon={showExisting ? faEyeSlash : faEye} />
            </IconButton>
          </Tooltip>
          <Tooltip title={Traduction('Add New Time Slot')}>
            <IconButton
              onClick={() => {
                setIsAdding(true);
                setEditingSlot(null);
                setManualFormData({ StartTimeTS: '00:00', EndTimeTS: '00:00' });
              }}
              sx={{ color: theme.palette.primary.main }}
            >
              <FontAwesomeIcon icon={faPlus} />
            </IconButton>
          </Tooltip>
        </Stack>
        
        {existingTimeSlots.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={handleClearAll}
            startIcon={<FontAwesomeIcon icon={faTrash} />}
          >
            {Traduction('Clear All')}
          </Button>
        )}
      </Stack>

      {/* Add/Edit Time Slot Form */}
      {isAdding && (
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            mb: 3, 
            bgcolor: theme.palette.background.paper 
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            {editingSlot ? Traduction('Edit Time Slot') : Traduction('Add Time Slots')}
          </Typography>

          {!editingSlot && (
            <Box sx={{ mb: 3 }}>
              <Tabs 
                value={currentMethod} 
                onChange={(e, newValue) => setCurrentMethod(newValue)}
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab 
                  icon={<FontAwesomeIcon icon={faHand} />} 
                  label={Traduction('Manual')} 
                  iconPosition="start"
                />
                <Tab 
                  icon={<FontAwesomeIcon icon={faCog} />} 
                  label={Traduction('Automatic')} 
                  iconPosition="start"
                />
              </Tabs>
            </Box>
          )}

          {(currentMethod === 0 || editingSlot) && (
            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  {renderTimeSelect('StartTimeTS', Traduction('Start Time'))}
                </Grid>
                <Grid item xs={6}>
                  {renderTimeSelect('EndTimeTS', Traduction('End Time'))}
                </Grid>
              </Grid>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={handleCancel}>
                  {Traduction('actions.cancel')}
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleManualSave}
                  disabled={!manualFormData.StartTimeTS || !manualFormData.EndTimeTS}
                >
                  {editingSlot ? Traduction('Update') : Traduction('actions.submit')}
                </Button>
              </Stack>
            </Stack>
          )}

          {currentMethod === 1 && !editingSlot && (
            <Stack spacing={3}>
              {renderAutomaticForm()}
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={handleCancel}>
                  {Traduction('actions.cancel')}
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleAutomaticGenerate}
                  disabled={!automaticFormData.startTime || !automaticFormData.endTime}
                >
                  {Traduction('Generate Slots')}
                </Button>
              </Stack>
            </Stack>
          )}
        </Paper>
      )}

      {/* Existing Time Slots */}
      {showExisting && (
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {Traduction('Existing Time Slots')} ({existingTimeSlots.length})
          </Typography>
          {existingTimeSlots.length === 0 ? (
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {Traduction('No time slots available')}
              </Typography>
            </Paper>
          ) : (
            existingTimeSlots.map((slot, index) => (
              <Paper
                key={slot.MatriculeTS || index}
                elevation={1}
                sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  bgcolor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {slot.StartTimeTS} - {slot.EndTimeTS}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Tooltip title={Traduction('Edit')}>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(slot)}
                      sx={{ color: theme.palette.primary.main }}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={Traduction('Delete')}>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(slot)}
                      sx={{ color: theme.palette.error.main }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Paper>
            ))
          )}
        </Stack>
      )}

      {/* Display validation errors */}
      {errors?.[fieldName] && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          {errors[fieldName].message}
        </Typography>
      )}
    </Box>
  );
};

export default TIME_SLOT;