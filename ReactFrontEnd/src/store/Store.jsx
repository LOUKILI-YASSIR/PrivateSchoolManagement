import { configureStore } from "@reduxjs/toolkit";
import MenuReducer from "./Slices/MenuSlice";
import ExportReducer from "./Slices/ExportSlice";
import ThemeReducer from "./Slices/ThemeSlice";

const Store = configureStore({
    reducer:{
        Menu: MenuReducer,
        Export: ExportReducer,
        theme: ThemeReducer,
    }
})
export default Store