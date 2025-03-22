import Axios from './apiClient';


// Generic GET request function
const fetchData = async (apiName, start = null, length = null) => {
  const url = start !== null && length !== null 
    ? `/${apiName}/${start}/${length}`
    : `/${apiName}`;
  
  const response = await Axios.get(url);
  return response.data;
};

// Example POST request function
const postData = async (apiName, data) => {
  const response = await Axios.post(`/${apiName}`, data);
  return response.data;
};

// Example PUT request function
const updateData = async (apiName, id, data) => {console.log(1111111,data)
  const response = await Axios.put(`/${apiName}/${id}`, data);
  return response.data;
};

// Example DELETE request function
const deleteData = async (apiName, id) => {
  const response = await Axios.delete(`/${apiName}/${id}`);
  return response.data;
};

const postImage = async (apiName,image)=>{
  const response = await fetch('http://localhost:3000/process-image', {
    method: 'POST',
    body: formData,
  });
  return response.data;
}
export {deleteData,updateData,postData,fetchData,postImage}