import React from "react";
import {Outlet} from "react-router-dom";
import {Toolbar} from "./components/ToolBar";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export const App = () => {
  return(
      <>
        <Toolbar/>
        <Outlet/>
      </>
  )
}