import { createSlice } from "@reduxjs/toolkit";
const ExportSlice=createSlice({
    name:"Export",
    initialState:{
      IndexExportType : 0,
      fileExtension : "Csv",
    },
    reducers:{
      ChangeIndexExportType:(state, action) => {
          state.IndexExportType = action.payload || 0;
      },
      ChangeFileExtention:(state, action) => {
          state.fileExtension = action.payload || "Csv";
      },
    }
})
export const { ChangeIndexExportType, ChangeFileExtention }=ExportSlice.actions
export default ExportSlice.reducer