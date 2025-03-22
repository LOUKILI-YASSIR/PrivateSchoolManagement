import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData, postData, updateData, deleteData, postImage } from "./apiServices";

// Hook for GET requests
export const useFetchData = (apiName, start = null, length = null) => {
  if(!apiName) return { data:[], isLoading:false, error:false, isRefetching:false };
  
  return useQuery({
    queryKey: [apiName, start, length], // Include pagination in cache key
    queryFn: () => fetchData(apiName, start, length),
  });
};

// Hook for POST requests
export const usePostData = (apiName) => {
  if(!apiName) return;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => postData(apiName, data),
    onSuccess: () => {
      queryClient.invalidateQueries([apiName]); // Refetch data after success
    },
  });
};

// Hook for PUT requests (update)
export const useUpdateData = (apiName) => {
  if(!apiName) return;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateData(apiName, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries([apiName]); // Refetch data after success
    },
  });
};

// Hook for DELETE requests
export const useDeleteData = (apiName) => {
  if(!apiName) return;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteData(apiName, id),
    onSuccess: () => {
      queryClient.invalidateQueries([apiName]); // Refetch data after success
    },
  });
};

// Hook for POST requests
export const usePostImage = (apiName) => {
  if(!apiName) return;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => postImage(apiName, data),
    onSuccess: () => {
      queryClient.invalidateQueries([apiName]); // Refetch data after success
    },
  });
};