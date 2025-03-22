import { useDeleteData } from "../../../api/queryHooks";

export const useHandlesData = (ApiName) => {
  const deleteData = useDeleteData(ApiName);
  return {
    handleDelete: (itemId) => {
      deleteData.mutate(itemId, {
        onSuccess: () => {
          console.log("Item deleted successfully");
        },
        onError: (error) => {
          console.error("Error deleting item:", error);
        },
      });
    },
  };
}
