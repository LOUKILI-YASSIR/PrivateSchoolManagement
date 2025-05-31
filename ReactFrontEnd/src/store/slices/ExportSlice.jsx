import { createSlice } from "@reduxjs/toolkit";
const ExportSlice=createSlice({
    name:"Export",
    initialState:{
      IndexExportType : 0,
      fileExtension : "Csv",
      selectedColumns: [],
      exportNotes: "",
      selectedSubProperties: {},
    },
    reducers:{
      ChangeIndexExportType:(state, action) => {
          state.IndexExportType = action.payload || 0;
      },
      ChangeFileExtention:(state, action) => {
          state.fileExtension = action.payload || "Csv";
      },
      UpdateSelectedColumns:(state, action) => {
          state.selectedColumns = action.payload || [];
      },
      UpdateExportNotes:(state, action) => {
          state.exportNotes = action.payload || "";
      },
      UpdateSelectedSubProperties:(state, action) => {
          state.selectedSubProperties = action.payload || {};
      },
    }
})
export const { 
  ChangeIndexExportType, 
  ChangeFileExtention, 
  UpdateSelectedColumns,
  UpdateExportNotes,
  UpdateSelectedSubProperties
} = ExportSlice.actions
export default ExportSlice.reducer