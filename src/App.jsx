import React from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import AddNewProject from "./Components/AddNewProject/addNewProject";
import "./App.css";
import AddLandDetails from "./Components/AddLandDetails/addLandDet";
import MainProjLand from "./MainComp/ProLand/proLand";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: "#22c55e",
              color: "white",
            },
          },
          error: {
            style: {
              background: "#ef4444",
              color: "white",
            },
          },
        }}
      />
      {/* <AddNewProject />
      <AddLandDetails /> */}
      <MainProjLand />
    </>
  );
}

export default App;
