import { TextField } from '@mui/material';

export default function EMAIL ({ register, fieldItem, handleChange, errors, isFilter = false }) {
    if (isFilter) {
        return (
            <TextField
                onChange={(e) => handleChange(e)}
                label={fieldItem.props.label}
                placeholder={fieldItem.props.placeholder}
                type="email"
                fullWidth
                value={fieldItem.value ?? ''}
            />
        );
    }

    return (    
        <TextField
            {...register(fieldItem.label, fieldItem.validation)}
            onChange={(e) => handleChange(e, fieldItem.label)}
            label={fieldItem.props.label}
            placeholder={fieldItem.props.placeholder}
            type="email"
            value={fieldItem.value ?? ''}
            fullWidth
            error={!!errors[fieldItem.label]}
        />
    )
}