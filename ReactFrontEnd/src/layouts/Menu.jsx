import MenuNavigation from "../components/menu/NavigationMenu.jsx";
import MenuTop from "../components/menu/TopMenu.jsx";
import { Outlet } from "react-router-dom";
import { Fragment } from "react";

export default function AppMenu() {
  return (
    <Fragment>
        <MenuNavigation/>
        <MenuTop content={<Outlet />}/>
    </Fragment>
  )
}
