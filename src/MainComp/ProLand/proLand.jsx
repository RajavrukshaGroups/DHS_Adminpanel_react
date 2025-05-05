import React, { useState } from "react";
import AddLandDetails from "../../Components/AddLandDetails/addLandDet";
import AddNewProject from "../../Components/AddNewProject/addNewProject";
import "./proLand.css";

const MainProjLand = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1); // Increment to trigger useEffect in AddLandDetails
  };

  return (
    <div className="add-new-proland">
      <AddNewProject onProjectAdded={triggerRefresh} />
      <AddLandDetails refreshKey={refreshKey} />
    </div>
  );
};

export default MainProjLand;
