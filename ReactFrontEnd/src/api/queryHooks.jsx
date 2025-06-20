import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiServices, { getDays, getTimeSlots, saveDays, saveTimeSlots, updateTimeSlot, deleteTimeSlot } from "./apiServices";
const { fetchData, postData, updateData, deleteData, postImage,getPaginatedData } = apiServices;

// Data Hooks with optimized caching

// Hook for GET requests
export const useFetchData = (apiName) => {
  return useQuery({
    queryKey: [apiName],
    queryFn: () => {
      if (!apiName) {
        return Promise.reject(new Error("Invalid API parameters"));
      }
      return apiServices.getData(apiName);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 3
  });
};
// Hook for POST requests
export const usePostData = (apiName) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => postData(apiName, data),
    onSuccess: () => {
      queryClient.invalidateQueries([apiName]);
    },
    onError: (error) => {
      console.error(`Error in ${apiName}:`, error);
    },
  });
};

// Hook for PUT requests
export const useUpdateData = (apiName) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ matricule, data }) => updateData(apiName, matricule, data),
    onSuccess: (_, { matricule }) => {
      queryClient.invalidateQueries([apiName, matricule]); // Ensure only updated data is refreshed
    }
  });
};

// Hook for DELETE requests
export const useDeleteData = (apiName) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (matricule) => deleteData(apiName, matricule),
    onSuccess: () => {
      queryClient.invalidateQueries([apiName]); 
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });
};

// Hook for image upload
export const usePostImage = (apiName) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => postImage(apiName, formData),
    onSuccess: () => {
      queryClient.invalidateQueries([apiName]);
    }
  });
};

export const useFetchCountData = (apiName) => {
  if (!apiName) return { data: [], isLoading: false, error: false, isRefetching: false };

  return useQuery({
    queryKey: [apiName ],
    queryFn: () => fetchData(apiName),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    retry: 1,
  });
};

// Time Table Query Hooks
export const useDays = () => {
    return useQuery({
        queryKey: ['days'],
        queryFn: getDays
    });
};

export const useTimeSlots = () => {
    return useQuery({
        queryKey: ['timeSlots'],
        queryFn: getTimeSlots
    });
};

export const useSaveDays = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: saveDays,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['days'] });
        }
    });
};

export const useSaveTimeSlots = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: saveTimeSlots,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timeSlots'] });
        }
    });
};

export const useUpdateTimeSlot = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateTimeSlot(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timeSlots'] });
        }
    });
};

export const useDeleteTimeSlot = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => deleteTimeSlot(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timeSlots'] });
        }
    });
};