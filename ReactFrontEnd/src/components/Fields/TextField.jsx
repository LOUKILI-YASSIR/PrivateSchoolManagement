import { TextField } from '@mui/material';

export default function TEXT ({ register, fieldItem, handleChange, errors, isFilter = false }) {
    if (isFilter) {
        return (
            <TextField
                onChange={(e) => handleChange(e)}
                label={fieldItem.props.label}
                placeholder={fieldItem.props.placeholder}
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
            fullWidth
            error={Boolean(errors[fieldItem.label])}
            value={fieldItem.value ?? ''}
        />
    );
}