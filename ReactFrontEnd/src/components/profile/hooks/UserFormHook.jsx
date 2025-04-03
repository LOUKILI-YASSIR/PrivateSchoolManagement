import { useForm } from 'react-hook-form';
import IMAGE from "../../Fields/ImageField.jsx"; // Adjust the import path as necessary
export default function UserForm({ userData, ImgPathUploads, handleAvatarChange }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      avatar: userData.avatar ? userData.avatar.split('/').pop() : '',
    },
  });

  const onSubmit = (data) => {
    console.log(data); // Includes the avatar filename
    // Update userData or perform other actions here
    handleAvatarChange(data.avatar);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='mb-4'>
      <IMAGE
        isSubmit={true}
        register={register}
        fieldItem={{
          label: 'avatar',
          value: userData.avatar ? userData.avatar.split('/').pop() : '/uploads/default.jpg',
          validation: { required: false },
        }}
        handleChange={(e, label) => {
          // Optional: Add custom logic if needed
        }}
        setValue={setValue}
        ImgPathUploads={ImgPathUploads}
        tableName="users"
        matricule={userData.matricule}
      />
    </form>
  );
}