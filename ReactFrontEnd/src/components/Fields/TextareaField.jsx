import { TextareaAutosize } from '@mui/material';

export default function TEXTAREA ({ register, fieldItem, handleChange, errors, isFilter = false }) {
    if (isFilter) {
        return (
            <div className="w-full border-2 border-gray-300 rounded-md focus-within:border-gray-300">
                <TextareaAutosize 
                    onChange={(e) => handleChange(e)}
                    minRows={fieldItem.props.rows || 3}
                    maxLength={fieldItem.props.maxLength || 321}
                    value={fieldItem.value ?? ''}
                    placeholder={fieldItem.props.placeholder}
                    className="w-full p-2 pb-0 bg-transparent outline-none"
                />
            </div>
        );
    }

    return (
        <div className={`w-full border-2 border-gray-300 rounded-md focus-within:border-gray-300 ${errors[fieldItem.label] ? 'border-red-500' : ''}`}>
            <TextareaAutosize 
                {...register(fieldItem.label, fieldItem.validation)}
                onChange={(e) => handleChange(e, fieldItem.label)}
                minRows={fieldItem.props.rows || 3}
                maxLength={fieldItem.props.maxLength || 321}
                value={fieldItem.value ?? ''}
                placeholder={fieldItem.props.placeholder}
                className="w-full p-2 pb-0 bg-transparent outline-none"
            />
        </div>
    )
}