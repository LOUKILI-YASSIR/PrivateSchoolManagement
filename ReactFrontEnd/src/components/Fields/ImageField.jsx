import { useEffect, useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { CircularProgress } from '@mui/material'; // Import MUI CircularProgress
import imageCompression from 'browser-image-compression';
import { useFetchCountData } from '../../api/queryHooks';

export default function IMAGE({
  register,
  fieldItem,
  handleChange,
  errors,
  tableName,
  matricule,
  setValue,
  ImgPathUploads,
  isSubmit,
}) {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const handleCountData = useFetchCountData(tableName);
  const { data: countData } = handleCountData;
  const actionUrl = matricule
    ? `http://localhost:3000/upload/${tableName}/${matricule}`
    : `http://localhost:3000/upload/${tableName}?count=${countData}`;

  useEffect(() => {
    console.log('IMAGE: fieldItem.value=', fieldItem.value, 'ImgPathUploads=', ImgPathUploads);
    if (fieldItem.value) {
      let imageUrl = fieldItem.value;

      if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
        const filename = imageUrl.split('/').pop();
        imageUrl = `${ImgPathUploads}/${filename}`;
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
      setValue(fieldItem.label, '', { shouldValidate: true });
    }
  }, [fieldItem.value, ImgPathUploads, fieldItem.label, setValue]);

  const handleUploadChange = async (info) => {
    let newFileList = [...info.fileList].slice(-1);
    newFileList = newFileList.map((file) => {
      if (file.response) {
        const timestamp = Date.now();
        const filename = file.response.filename.split('/').pop();
        const fullUrl = `${ImgPathUploads}/${filename}?t=${timestamp}`;
        file.url = fullUrl;
      }
      return file;
    });
    setFileList(newFileList);

    if (info.file.status === 'uploading') {
      setUploading(true);
    } else if (info.file.status === 'done') {
      setUploading(false);
      message.success(`${info.file.name} uploaded successfully`);
      const uploadedPath = info.file.response.filename.split('/').pop();
      setValue(fieldItem.label, uploadedPath, { shouldValidate: true });
      handleChange({ target: { value: uploadedPath } }, fieldItem.label);
    } else if (info.file.status === 'error') {
      setUploading(false);
      message.error(`${info.file.name} upload failed`);
      setValue(fieldItem.label, '', { shouldValidate: true });
    }
  };

  const beforeUpload = async (file) => {
    if (!file.type.startsWith('image/')) {
      message.error('You can only upload image files!');
      return false;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
      return false;
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
      return false;
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
              const jpegFile = new File([blob], file.name.replace(/\.\w+$/, '.jpg'), {
                type: 'image/jpeg',
              });
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
    <div className="d-flex flex-column align-items-center w-full gap-2">
      <label className="text-white font-medium">{fieldItem.props?.label || ""}</label>
      <div
        className="image-upload-container"
        style={{
          width: 125,
          height: 125,
          border: '1px dashed #d9d9d9',
          borderRadius: 8,
          position: 'relative',
          overflow: 'hidden',
          background: '#fafafa',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
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
          <div style={{ width: '100%', height: '100%', position: 'relative', cursor: 'pointer' }}>
            {fileList.length > 0 && fileList[0].url ? (
              <img
                src={fileList[0].url}
                alt="Upload preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `uploads/default.jpg`;
                }}
              />
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                }}
              >
                <UploadOutlined style={{ fontSize: 24, marginBottom: 8 }} />
              </div>
            )}
            <Button
              htmlType={isSubmit ? 'submit' : 'button'}
              style={{
                position: 'absolute',
                bottom: 10,
                left: 10,
                width: '105px',
                background: 'rgba(255, 255, 255, 0.8)',
                borderTop: '1px solid #d9d9d9',
                borderRadius: 5,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              disabled={uploading}
            >
              {uploading ? (
                <CircularProgress size={16} thickness={4} />
              ) : (
                'Change Image'
              )}
            </Button>
          </div>
        </Upload>
        <input
          type="hidden"
          {...register(fieldItem.label, {
            ...fieldItem.validation,
            value: fieldItem.value || '',
          })}
        />
      </div>
    </div>
  );
}