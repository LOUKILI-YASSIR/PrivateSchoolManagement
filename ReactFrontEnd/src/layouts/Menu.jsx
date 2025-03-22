import MenuNavigation from "../components/menu/NavigationMenu.jsx";
import MenuTop from "../components/menu/TopMenu.jsx";
import { Fragment } from "react";
export default function AppMenu({content}) {
  return (
    <Fragment>
        <MenuNavigation/>
        <MenuTop content={content}/>
    </Fragment>
  )
}
