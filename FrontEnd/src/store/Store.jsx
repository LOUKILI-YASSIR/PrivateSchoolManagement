import { configureStore } from "@reduxjs/toolkit";
import ReducerMenu from "./slices/MenuSlice";
import ReducerExport from "./slices/ExportSlice";
const Store = configureStore({
    reducer:{
        Menu:ReducerMenu,
        Export:ReducerExport,
    }
})
export default Store