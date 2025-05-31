import { TextField } from '@mui/material';

export default function TEXTAREA ({ register, fieldItem, handleChange, errors, isFilter = false }) {
    if (isFilter) {
        return (
            <TextField
                fullWidth
                multiline
                minRows={fieldItem.props.rows || 3}
                maxRows={fieldItem.props.maxRows || 6}
                onChange={(e) => handleChange(e)}
                inputProps={{
                    maxLength: fieldItem.props.maxLength || 321
                }}
                value={fieldItem.value ?? ''}
                label={fieldItem.props.label}
                placeholder={fieldItem.props.placeholder}
            />
        );
    }

    return (
        <TextField
            fullWidth
            multiline
            minRows={fieldItem.props.rows || 3}
            maxRows={fieldItem.props.maxRows || 6}
            {...register(fieldItem.label, fieldItem.validation)}
            onChange={(e) => handleChange(e, fieldItem.label)}
            inputProps={{
                maxLength: fieldItem.props.maxLength || 321
            }}
            value={fieldItem.value ?? ''}
            label={fieldItem.props.label}
            placeholder={fieldItem.props.placeholder}
            error={!!errors[fieldItem.label]}
        />
    );
}