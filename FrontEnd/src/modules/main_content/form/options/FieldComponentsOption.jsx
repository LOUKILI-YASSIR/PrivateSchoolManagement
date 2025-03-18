import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { TextField, Select, MenuItem, InputLabel, TextareaAutosize, Typography, Pagination, Box, Autocomplete, InputAdornment, List } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import imageCompression from 'browser-image-compression';
export const FieldComponents = {
  TEXT: ({ register, fieldItem, handleChange, errors }) => (
    <TextField
      {...register(fieldItem.label, fieldItem.validation)}
      onChange={(e) => handleChange(e, fieldItem.label)}
      label={fieldItem.props.label}
      placeholder={fieldItem.props.placeholder}
      fullWidth
      error={Boolean(errors[fieldItem.label])}
      value={fieldItem.value ?? ''} // Ensure value is never undefined
    />
  ),

  SELECT : ({ register, fieldItem, handleChange, errors }) => {
    const options = useMemo(() => fieldItem.props.options, [fieldItem.props.options]);
  
    return (
      <Fragment>
        <InputLabel>{fieldItem.props.label}</InputLabel>
        <Select
          {...register(fieldItem.label, fieldItem.validation)}
          onChange={(e) => handleChange(e, fieldItem.label)}
          label={fieldItem.props.label}
          fullWidth
          error={!!errors[fieldItem.label]}
          value={fieldItem.value ?? ''} // Ensuring value is never undefined
        >
          {options.map((option, index) => (
            <MenuItem key={`${option.value}-${index}`} value={option.value}>
              {fieldItem.props.isComponent ? option.label() : option.label}
            </MenuItem>
          ))}
        </Select>
      </Fragment>
    );
  },  
  TEXT_SELECT: ({ register, fieldItem, errors, setValue }) => {
    const options = fieldItem.props.options;
  
    // Initialize select value: use fieldItem.value if it’s an option, otherwise "Autre"
    const [selectValue, setSelectValue] = useState(
      options.some(option => option.value === fieldItem.value) ? fieldItem.value : 'Autre'
    );
    // Initialize text field value: use fieldItem.value if "Autre" is selected, otherwise empty
    const [otherValue, setOtherValue] = useState(
      selectValue === 'Autre' ? fieldItem.value : ''
    );
  
    // Handle select dropdown changes
    const handleSelectChange = (e) => {
      const value = e.target.value;
      setSelectValue(value);
      if (value === 'Autre') {
        // Set the form value to otherValue under `${field.label}_other` when "Autre" is selected
        setValue(`${fieldItem.label}_other`, otherValue, { shouldValidate: true });
      } else {
        // Set the form value to the selected option under `field.label` and clear otherValue
        setValue(fieldItem.label, value, { shouldValidate: true });
        setOtherValue('');
      }
    };
  
    // Handle text field changes
    const handleTextChange = (e) => {
      const value = e.target.value;
      setOtherValue(value);
      if (selectValue === 'Autre') {
        // Update the form value with `${field.label}_other` when "Autre" is selected
        setValue(`${fieldItem.label}_other`, value, { shouldValidate: true });
      }
    };
  
    return (
      <>
        <InputLabel>{fieldItem.props.label}</InputLabel>
        <Select
          value={selectValue}
          onChange={handleSelectChange}
          label={fieldItem.props.label}
          fullWidth
        >
          {options.map((option, index) => (
            <MenuItem key={`${option.value}-${index}`} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {selectValue === 'Autre' && (
          <TextField
            label="Specify Other"
            fullWidth
            value={otherValue}
            onChange={handleTextChange}
            error={!!errors[`${fieldItem.label}_other`]}
            helperText={errors[`${fieldItem.label}_other`]?.message}
            style={{ marginTop: '16px' }} // Added margin top for spacing
          />
        )}
      </>
    );
  },
AUTO_COMPLETE_SELECT: ({
  register,
  fieldItem,
  handleChange,
  errors,
  pageSize = 50,
}) => {
  // Get options (e.g. using generateCountryOptions) from fieldItem.props.options
  const options = useMemo(
    () => fieldItem.props.options || [],
    [fieldItem.props.options]
  );
  const [inputValue, setInputValue] = useState('');
  const [page, setPage] = useState(1);

  // Filter options based on inputValue
  // If the option has a flag (i.e. a searchText value), we filter by that.
  const filteredOptions = useMemo(() => {
    const searchTerm = inputValue.toLowerCase();
    return options.filter((option) => {
      // Use searchText if available, otherwise (if label is a string) fallback to label.
      const searchable = option.searchText
        ? String(option.searchText).toLowerCase()
        : (typeof option.label === 'string' ? option.label.toLowerCase() : '');
      return searchable.includes(searchTerm);
    });
  }, [options, inputValue]);

  // Pagination for filtered options
  const paginatedOptions = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredOptions.slice(startIndex, startIndex + pageSize);
  }, [filteredOptions, page, pageSize]);

  // getOptionLabel is used by Autocomplete to know what to display in the input
  // Here, we return the searchText (if available) or fallback to a string.
  const getOptionLabel = (option) => {
    if (!option) return '';
    return option.searchText || (typeof option.label === 'string' ? option.label : '');
  };

  // Custom listbox to include pagination if there are many options.
  const CustomListboxComponent = React.forwardRef((props, ref) => (
    <div ref={ref}>
      <List {...props} />
      {filteredOptions.length > pageSize && (
        <Pagination
          count={Math.ceil(filteredOptions.length / pageSize)}
          page={page}
          onChange={(_, p) => setPage(p)}
          size="small"
          sx={{ px: 2, py: 1 }}
        />
      )}
    </div>
  ));

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <Autocomplete
        options={paginatedOptions}
        inputValue={inputValue}
        onInputChange={(_, newValue) => {
          setInputValue(newValue);
          setPage(1); // Reset pagination when search changes.
        }}
        onChange={(_, newValue) =>
          handleChange(
            { target: { value: newValue?.value || '' } },
            fieldItem.label
          )
        }
        // Set current value based on fieldItem.value
        value={options.find((opt) => opt.value === fieldItem.value) || null}
        getOptionLabel={getOptionLabel}
        isOptionEqualToValue={(option, value) => option.value === value?.value}
        renderInput={(params) => {
          // Determine the selected option
          const selectedOption = options.find(
            (opt) => opt.value === fieldItem.value
          );
          return (
            <TextField
              {...params}
              label={fieldItem.props.label}
              error={!!errors[fieldItem.label]}
              InputProps={{
                ...params.InputProps,
                // When an option is selected, show its flag and country name.
                startAdornment: selectedOption ? (
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    {selectedOption.searchText && (
                      <img
                        src={`/country-flag-icons-3x2/${selectedOption.value}.svg`}
                        alt={selectedOption.searchText}
                        style={{
                          width: '20px',
                          height: '15px',
                          borderRadius: '2px',
                          marginRight: '8px',
                        }}
                      />
                    )}
                  </span>
                ) : null,
                endAdornment: (
                  <>
                    {params.InputProps.endAdornment}
                    <Typography variant="caption" sx={{ mr: 2 }}>
                      {`${Math.min(page * pageSize, filteredOptions.length)}/${filteredOptions.length}`}
                    </Typography>
                  </>
                ),
              }}
            />
          );
        }}
        renderOption={(props, option, index) => (
          <li {...props} key={`${option.value}-${index}`}>
            {option.label}
          </li>
        )}

        ListboxComponent={CustomListboxComponent}
        fullWidth
        disablePortal
        blurOnSelect
        clearOnBlur={false}
      />

      {/* Hidden input field for form registration */}
      <input
        type="hidden"
        {...register(fieldItem.label, fieldItem.validation)}
        value={fieldItem.value || ''}
      />
    </Box>
  );
},

  TEXTAREA: ({ register, fieldItem, handleChange, errors }) => (
    <div className={`w-full border-2 border-gray-300 rounded-md focus-within:border-gray-300 ${errors[fieldItem.label] ? 'border-red-500' : ''}`}>
      <TextareaAutosize 
        {...register(fieldItem.label, fieldItem.validation)}
        onChange={(e) => handleChange(e, fieldItem.label)}
        minRows={fieldItem.props.rows || 3}
        maxLength={fieldItem.props.maxLength || 321}
        value={fieldItem.value ?? ''} // Default value fix
        placeholder={fieldItem.props.placeholder}
        className="w-full p-2 pb-0 bg-transparent outline-none"
      />
    </div>
  ),

  PHONE : ({ register, fieldItem, handleChange, errors }) => {
    const { ref } = register(fieldItem.label, fieldItem.validation);
    const [isfocus,setisfocus]=useState(false)
    // Helper to compute the index from the label's last character
    const getIndex = () => {
      // Extract the number before the underscore
      const match = fieldItem.label.match(/\d+/);
      return match ? Number(match[0])-1 : 0; // Default to 0 if no number is found
    };
  
    // Function to update the error class on the input and label elements
    const updateErrorClass = () => {
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
    useEffect(()=>handleupdateFocus(),[isfocus])
    const handleupdateFocus = ()=>{
      const index = getIndex();
      const labelElements = document.querySelectorAll(".react-tel-input .special-label");
  
      if (labelElements[index] && isfocus) {
          labelElements[index].classList.add("special-label-focus");
        } else if (labelElements[index] && !isfocus) {
          // Remove error classes
          labelElements[index].classList.remove("special-label-focus");
        }
    }
    return (
      <PhoneInput
        {...register(fieldItem.label, fieldItem.validation)}
        inputRef={ref}
        value={fieldItem.value ?? ""}
        onFocus={()=>setisfocus(true)}
        onBlur={()=>setisfocus(false)}
        country={fieldItem.value ?? "ma"}
        onChange={(value) => {
          const event = {
            target: {
              value: value && !value.startsWith("+") ? "+" + value : value || "",
            },
          };
          handleChange(event, fieldItem.label);
          updateErrorClass();
        }}
        specialLabel={fieldItem.props.label}
        placeholder={fieldItem.props.placeholder}
        enableSearch
        autocompleteSearch
        inputStyle={{ width: "100%" }}
      />
    );
  },  

  EMAIL: ({ register, fieldItem, handleChange, errors }) => (
    <TextField
      {...register(fieldItem.label, fieldItem.validation)}
      onChange={(e) => handleChange(e, fieldItem.label)}
      label={fieldItem.props.label}
      placeholder={fieldItem.props.placeholder}
      type="email"
      value={fieldItem.value ?? ''} // Fix default value
      fullWidth
      error={!!errors[fieldItem.label]}
    />
  ),

  DATE: ({ register, fieldItem, handleChange, errors }) => {
    const { ref, ...rest } = register(fieldItem.label, fieldItem.validation);

    return (
        <DatePicker
          {...rest}
          inputRef={ref}
          value={fieldItem.value ? dayjs(fieldItem.value) : null} // Ensuring value is valid
          onChange={(date) => {
            const event = { target: { value: date?.toISOString() || null } };
            handleChange(event, fieldItem.label);
          }}
          label={fieldItem.props.label}
          inputFormat="MM/dd/yyyy"
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!errors[fieldItem.label],
            },
          }}
        />
    );
  },

  IMAGE: ({
    register,
    fieldItem,
    handleChange,
    errors,
    tableName,
    matricule,
    setValue,
    ImgPathUploads,
  }) => {
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);
  
    const actionUrl = matricule
      ? `http://localhost:3000/upload/${tableName}/${matricule}`
      : `http://localhost:3000/upload/${tableName}`;
  
    useEffect(() => {
      if (fieldItem.value) {
        let imageUrl = fieldItem.value;
        if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/uploads')) {
          imageUrl = `${ImgPathUploads}/${fieldItem.value}`;
        }
        const timestamp = Date.now();
        setFileList([
          {
            uid: '-1',
            name: imageUrl.split('/').pop(),
            status: 'done',
            url: `${imageUrl}?t=${timestamp}`,
          },
        ]);
      } else {
        setFileList([]);
      }
    }, [fieldItem.value, ImgPathUploads]);
  
    const handleUploadChange = async (info) => {
      let newFileList = [...info.fileList].slice(-1);
      newFileList = newFileList.map((file) => {
        if (file.response) {
          const timestamp = Date.now();
          file.url = `${file.response.filename}?t=${timestamp}`;
        }
        return file;
      });
      setFileList(newFileList);
  
      if (info.file.status === 'uploading') {
        setUploading(true);
      } else if (info.file.status === 'done') {
        setUploading(false);
        message.success(`${info.file.name} uploaded successfully`);
        const uploadedPath = info.file.response.filename;
        handleChange({ target: { value: uploadedPath } }, fieldItem.label);
        setValue(fieldItem.label, uploadedPath, { shouldValidate: true });
      } else if (info.file.status === 'error') {
        setUploading(false);
        message.error(`${info.file.name} upload failed`);
        console.error('Upload error:', info.file.response);
      }
    };
  
    const beforeUpload = async (file) => {
      if (!file.type.startsWith('image/')) {
        message.error('You can only upload image files!');
        return Upload.LIST_IGNORE;
      }
  
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Image must be smaller than 5MB!');
        return Upload.LIST_IGNORE;
      }
  
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: false,
        };
        const compressedFile = await imageCompression(file, options);
        const jpegFile = await convertToJpeg(compressedFile);
        return jpegFile;
      } catch (error) {
        message.error('Image compression failed');
        console.error('Compression error:', error);
        return Upload.LIST_IGNORE;
      }
    };
  
    const convertToJpeg = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(
              (blob) => {
                const jpegFile = new File(
                  [blob],
                  file.name.replace(/\.\w+$/, '.jpg'),
                  { type: 'image/jpeg' }
                );
                resolve(jpegFile);
              },
              'image/jpeg',
              0.9
            );
          };
          img.onerror = reject;
          img.src = event.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };
  
    return (
      <div className='d-flex justify-content-center align-items-center w-full'>
        <div className="image-upload-container" style={{ width: 125, height: 125, border: '1px dashed #d9d9d9', borderRadius: 8, position: 'relative', overflow: 'hidden', background: '#fafafa', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Upload
            name="fileToUpload"
            action={actionUrl}
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={beforeUpload}
            showUploadList={false}
            maxCount={1}
            accept="image/*"
          >
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              {fileList.length > 0 && fileList[0].url ? (
                <img src={fileList[0].url} alt="Upload preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <UploadOutlined style={{ fontSize: 24, marginBottom: 8 }} />
                  <div style={{ fontSize: 12, color: '#666' }}>Click to upload</div>
                </div>
              )}
              <Button icon={<UploadOutlined />} style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', background: 'rgba(255, 255, 255, 0.8)', borderTop: '1px solid #d9d9d9', borderRadius: 0, height: 32 }}>
                {uploading ? 'Uploading...' : 'Change Image'}
              </Button>
            </div>
          </Upload>
          <input type="hidden" {...register(fieldItem.label, fieldItem.validation)} value={fieldItem.value || ''} />
        </div>
      </div>
    );
  },

  };