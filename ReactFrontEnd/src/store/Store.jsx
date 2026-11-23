import { configureStore } from "@reduxjs/toolkit";
import MenuReducer from "./slices/MenuSlice";
import ExportReducer from "./slices/ExportSlice";
import ThemeReducer from "../Store/Slices/ThemeSlice";

const Store = configureStore({
    reducer:{
        Menu: MenuReducer,
        Export: ExportReducer,
        theme: ThemeReducer,
    }
})
export default Store