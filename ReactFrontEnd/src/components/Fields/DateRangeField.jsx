import { Fragment } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';

export default function DateRangeField({ register, fieldItem, handleChange, errors, isFilter = false }) {
    const startValue = fieldItem.value?.start ? dayjs(fieldItem.value.start) : null;
    const endValue = fieldItem.value?.end ? dayjs(fieldItem.value.end) : null;
    const isTimeRange = fieldItem.props.type === 'time';

    const Picker = isTimeRange ? TimePicker : DatePicker;
    const format = isTimeRange ? "HH:mm" : "MM/DD/YYYY";

    const commonProps = {
        fullWidth: true,
        sx: { 
            mb: 1,
            '& .MuiOutlinedInput-root': theme => ({
                color: theme.palette.mode === 'dark' ? '#fff' : 'inherit',
                '& fieldset': {
                    borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                },
                '&:hover fieldset': {
                    borderColor: theme.palette.mode === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.87)',
                },
            })
        }
    };

    if (isFilter) {
        return (
            <Box>
                <Typography variant="caption" color="textSecondary" sx={{ mb: 1 }}>
                    {fieldItem.props.label}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Picker
                        {...commonProps}
                        value={startValue}
                        onChange={(date) => {
                            const event = {
                                target: {
                                    value: {
                                        ...fieldItem.value,
                                        start: date?.toISOString() || null
                                    }
                                }
                            };
                            handleChange(event);
                        }}
                        label="Start"
                        format={format}
                        slotProps={{
                            textField: commonProps
                        }}
                    />
                    <Picker
                        {...commonProps}
                        value={endValue}
                        onChange={(date) => {
                            const event = {
                                target: {
                                    value: {
                                        ...fieldItem.value,
                                        end: date?.toISOString() || null
                                    }
                                }
                            };
                            handleChange(event);
                        }}
                        label="End"
                        format={format}
                        slotProps={{
                            textField: commonProps
                        }}
                    />
                </Box>
            </Box>
        );
    }

    const { ref: startRef, ...startRest } = register(`${fieldItem.label}.start`, fieldItem.validation);
    const { ref: endRef, ...endRest } = register(`${fieldItem.label}.end`, fieldItem.validation);

    return (
        <Fragment>
            <Typography variant="caption" color="textSecondary" sx={{ mb: 1 }}>
                {fieldItem.props.label}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Picker
                    {...startRest}
                    inputRef={startRef}
                    value={startValue}
                    onChange={(date) => {
                        const event = {
                            target: {
                                value: {
                                    ...fieldItem.value,
                                    start: date?.toISOString() || null
                                }
                            }
                        };
                        handleChange(event, `${fieldItem.label}.start`);
                    }}
                    label="Start"
                    format={format}
                    slotProps={{
                        textField: {
                            ...commonProps,
                            error: errors[fieldItem.label]?.start
                        }
                    }}
                />
                <Picker
                    {...endRest}
                    inputRef={endRef}
                    value={endValue}
                    onChange={(date) => {
                        const event = {
                            target: {
                                value: {
                                    ...fieldItem.value,
                                    end: date?.toISOString() || null
                                }
                            }
                        };
                        handleChange(event, `${fieldItem.label}.end`);
                    }}
                    label="End"
                    format={format}
                    slotProps={{
                        textField: {
                            ...commonProps,
                            error: errors[fieldItem.label]?.end
                        }
                    }}
                />
            </Box>
        </Fragment>
    );
}
