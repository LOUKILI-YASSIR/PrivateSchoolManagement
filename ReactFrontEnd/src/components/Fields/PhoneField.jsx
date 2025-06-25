import { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import './styles/PhoneField.css';

export default function PHONE({
  register,
  fieldItem,
  handleChange,
  errors,
  isFilter = false,
  isDarkMode,
  isLogin = false,
  value,
  onChange,
  disabled,
  label,
  placeholder,
  variant = 'outlined' // New prop to match TextField variant
}) {
  const [isfocus, setisfocus] = useState(false);

  const getIndex = () => {
    if (isLogin) return 0;
    const match = fieldItem?.label?.match(/\d+/);
    return match ? Number(match[0]) - 1 : 0;
  };

  const updateErrorClass = () => {
    if (isFilter || isLogin) return;

    const index = getIndex();
    const inputElements = document.querySelectorAll('.react-tel-input .form-control');
    const labelElements = document.querySelectorAll('.react-tel-input .special-label');

    if (inputElements[index] && labelElements[index]) {
      if (errors[fieldItem.label]) {
        inputElements[index].classList.add('form-control-error');
        labelElements[index].classList.add('special-label-error');
        if (!isfocus) {
          inputElements[index].classList.remove('form-control-focus');
          labelElements[index].classList.remove('special-label-focus');
        }
      } else {
        inputElements[index].classList.remove('form-control-error');
        labelElements[index].classList.remove('special-label-error');
      }
    }
  };

  const addModeClass = (element) => {
    if (isDarkMode) {
      element.classList.add('dark-mode');
    } else {
      element.classList.remove('dark-mode');
    }
    if (isLogin) {
      element.classList.add('is-login');
      if (variant === 'standard') {
        element.classList.add('standard');
      } else {
        element.classList.remove('standard');
      }
    } else {
      element.classList.remove('is-login');
      element.classList.remove('standard');
    }
  };

  const handleupdateFocus = () => {
    const index = getIndex();
    const labelElements = document.querySelectorAll('.react-tel-input .special-label');
    const allPhonesFields = document.querySelectorAll('.react-tel-input');
    addModeClass(allPhonesFields[index]);

    if (labelElements[index]) {
      if (isfocus) {
        labelElements[index].classList.add('special-label-focus');
      } else {
        labelElements[index].classList.remove('special-label-focus');
      }
    }
  };

  useEffect(() => {
    if (!isLogin) updateErrorClass();
  }, [errors, fieldItem?.value]);

  useEffect(() => handleupdateFocus(), [isfocus, isDarkMode, isLogin, variant]);

  const phoneInputProps = isLogin
    ? {
        value: value || '',
        onChange: onChange,
        disabled: disabled,
        onFocus: () => setisfocus(true),
        onBlur: () => setisfocus(false),
        country: value ? undefined : 'ma',
        specialLabel: label,
        placeholder: placeholder,
        enableSearch: true,
        autocompleteSearch: true,
        containerStyle: { backgroundColor: 'transparent' },
        inputStyle: { width: '100%', backgroundColor: 'transparent' }
      }
    : isFilter
    ? {
        value: fieldItem.value ?? '',
        onFocus: () => setisfocus(true),
        onBlur: () => setisfocus(false),
        country: fieldItem.value ? undefined : 'ma',
        onChange: (value) => {
          const event = {
            target: {
              value: value && !value.startsWith('+') ? '+' + value : value || ''
            }
          };
          handleChange(event);
        },
        specialLabel: fieldItem.props.label,
        placeholder: fieldItem.props.placeholder,
        enableSearch: true,
        autocompleteSearch: true,
        containerStyle: { backgroundColor: 'transparent' },
        inputStyle: { width: '100%', backgroundColor: 'transparent' }
      }
    : {
        ...register(fieldItem.label, fieldItem.validation),
        value: fieldItem.value ?? '',
        onFocus: () => setisfocus(true),
        onBlur: () => setisfocus(false),
        country: fieldItem.value ? undefined : 'ma',
        onChange: (value) => {
          const event = {
            target: {
              value: value && !value.startsWith('+') ? '+' + value : value || ''
            }
          };
          handleChange(event, fieldItem.label);
          updateErrorClass();
        },
        specialLabel: fieldItem.props.label,
        placeholder: fieldItem.props.placeholder,
        enableSearch: true,
        autocompleteSearch: true,
        containerStyle: { backgroundColor: 'transparent' },
        inputStyle: { width: '100%', backgroundColor: 'transparent' }
      };

  return <PhoneInput {...phoneInputProps} />;
}