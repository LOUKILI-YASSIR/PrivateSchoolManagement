import { createSlice } from '@reduxjs/toolkit';

const MenuSlice = createSlice({
  name: "data",
  initialState: {
    list: [],
    inscritUser: true,
    MenuActive: false,
    isCollapsed: false,
    selectedKeys: [],
    openKeys: []
  },
  reducers: {
    checkLogin: () => {},
    desinscrit: (state) => ({ ...state, inscritUser: false }),
    changeViewMenu: (state, action) => {
      const { MenuType } = action.payload;
      if (MenuType === "active") {
        state.MenuActive = !state.MenuActive;
      }
    }
  }
});

export const { checkLogin, desinscrit, changeViewMenu } = MenuSlice.actions;
export default MenuSlice.reducer;
