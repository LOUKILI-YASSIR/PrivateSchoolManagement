import { useEffect, useState } from 'react';
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import imageCompression from 'browser-image-compression';

export default function IMAGE ({
    register,
    fieldItem,
    handleChange,
    errors,
    tableName,
    matricule,
    setValue,
    ImgPathUploads,
  }) {
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);
  
    const actionUrl = matricule
      ? `http://localhost:3000/upload/${tableName}/${matricule}`
      : `http://localhost:3000/upload/${tableName}`;
  
    useEffect(() => {
      if (fieldItem.value) {
        let imageUrl = fieldItem.value;
        
        // If the value is just a filename, construct the full URL
        if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
          // Extract just the filename if a full path is provided
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
      }
    }, [fieldItem.value, ImgPathUploads]);
  
    const handleUploadChange = async (info) => {
      let newFileList = [...info.fileList].slice(-1);
      newFileList = newFileList.map((file) => {
        if (file.response) {
          const timestamp = Date.now();
          // Extract just the filename from the response
          const filename = file.response.filename.split('/').pop();
          // Store the full URL for preview
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
        // Store just the filename in the form value
        const uploadedPath = info.file.response.filename.split('/').pop();
        handleChange({ target: { value: uploadedPath } }, fieldItem.label);
        setValue(fieldItem.label, uploadedPath, { shouldValidate: true });
      } else if (info.file.status === 'error') {
        setUploading(false);
        message.error(`${info.file.name} upload failed`);
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
                <img 
                  src={fileList[0].url} 
                  alt="Upload preview" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    // Try to load the image without the timestamp
                    const baseUrl = e.target.src.split('?')[0];
                    e.target.src = baseUrl;
                    // If still fails, set default image
                    e.target.onerror = () => {
                      e.target.onerror = null;
                      e.target.src = '/default.jpg';
                    };
                  }}
                />
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
  }