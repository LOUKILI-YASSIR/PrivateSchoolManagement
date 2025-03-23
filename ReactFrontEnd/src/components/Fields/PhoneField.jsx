import { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';

export default function PHONE ({ register, fieldItem, handleChange, errors, isFilter = false }) {
    const [isfocus, setisfocus] = useState(false);
    
    // Helper to compute the index from the label's last character
    const getIndex = () => {
      // Extract the number before the underscore
      const match = fieldItem.label.match(/\d+/);
      return match ? Number(match[0])-1 : 0; // Default to 0 if no number is found
    };
  
    // Function to update the error class on the input and label elements
    const updateErrorClass = () => {
      if (isFilter) return;
      
      const index = getIndex();
      const inputElements = document.querySelectorAll(".react-tel-input .form-control");
      const labelElements = document.querySelectorAll(".react-tel-input .special-label");
  
      if (inputElements[index] && labelElements[index]) {
        if (errors[fieldItem.label]) {
          // Add error classes
          inputElements[index].classList.add("form-control-error");
          labelElements[index].classList.add("special-label-error");
          // Remove focus classes if present
          if(!isfocus){
            inputElements[index].classList.remove("form-control-focus");
            labelElements[index].classList.remove("special-label-focus");
          }
        } else {
          // Remove error classes
          inputElements[index].classList.remove("form-control-error");
          labelElements[index].classList.remove("special-label-error");
        }
      }
    };
  
    // Update the error class whenever errors or the field value change
    useEffect(() => {
      updateErrorClass();
    }, [errors, fieldItem.value]);
    
    useEffect(() => handleupdateFocus(), [isfocus]);
    
    const handleupdateFocus = () => {
      const index = getIndex();
      const labelElements = document.querySelectorAll(".react-tel-input .special-label");
  
      if (labelElements[index] && isfocus) {
          labelElements[index].classList.add("special-label-focus");
        } else if (labelElements[index] && !isfocus) {
          // Remove error classes
          labelElements[index].classList.remove("special-label-focus");
        }
    }

    const phoneInputProps = isFilter ? {
        value: fieldItem.value ?? "",
        onFocus: () => setisfocus(true),
        onBlur: () => setisfocus(false),
        country: fieldItem.value ?? "ma",
        onChange: (value) => {
          const event = {
            target: {
              value: value && !value.startsWith("+") ? "+" + value : value || "",
            },
          };
          handleChange(event);
        },
        specialLabel: fieldItem.props.label,
        placeholder: fieldItem.props.placeholder,
        enableSearch: true,
        autocompleteSearch: true,
        inputStyle: { width: "100%" }
    } : {
        ...register(fieldItem.label, fieldItem.validation),
        value: fieldItem.value ?? "",
        onFocus: () => setisfocus(true),
        onBlur: () => setisfocus(false),
        country: fieldItem.value ?? "ma",
        onChange: (value) => {
          const event = {
            target: {
              value: value && !value.startsWith("+") ? "+" + value : value || "",
            },
          };
          handleChange(event, fieldItem.label);
          updateErrorClass();
        },
        specialLabel: fieldItem.props.label,
        placeholder: fieldItem.props.placeholder,
        enableSearch: true,
        autocompleteSearch: true,
        inputStyle: { width: "100%" }
    };
  
    return (
      <PhoneInput
        {...phoneInputProps}
      />
    );
}