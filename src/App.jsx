import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import AdminLogin from "./pages/adminLogin";
import Dashboard from "./pages/dashboard";
import Sidebar from "./pages/sidebar";
import PrivateRoute from "./components/privateRoute";
import MainProjLand from "./MainComp/ProLand/proLand";
import ViewProjects from "./pages/Projects/viewProjects";
import AvailablePlotDimension from "./pages/Projects/availablePlotDimension";
import ViewLandDetails from "./pages/Projects/viewLandDetails";
import AddProjectStatus from "./pages/Projects/addProjectStatus";
import ViewProjectStatus from "./pages/Projects/viewProjectStatus";
import Navbar from "./Components/navbar";
import EditViewProjectStatus from "./pages/Projects/editViewProjectStatus";
import MemberFormWrapper from "./Components/memberDetails/memberFormWrapper";
import ViewMemberdetails from "./Components/memberDetails/viewMemberdetails";
import ViewInactiveMembers from "./Components/memberDetails/viewInactiveMembers";
import ViewUserdetails from "./Components/memberDetails/viewUserdetails";
import SiteBookingConfirmation from "./Components/memberDetails/siteBookingConfirmation";
import AddConfirmationletter from "./Components/memberDetails/addConfirmationletter";
import ViewSitebookingConfirmation from "./Components/recieptDetails/viewSitebookingConfirmation";
import ViewReceiptDetails from "./Components/recieptDetails/viewReceipts";
import ViewReceiptHistory from "./Components/memberDetails/viewHistory";
import AddReceipt from "./Components/recieptDetails/addReceipt";
import EditConfirmationLetter from "./Components/recieptDetails/editConfirmationLetter";
import EditReceipt from "./Components/recieptDetails/editReceipt";
import PlotTransferForm from "./Components/plotDetails/plotTransferform";

import ShareCertificate from "./Components/shareCertification/shareCertification";
import PlotTransferhistory from "./Components/plotDetails/plotTransferhistory";
import ExtraChargeFormDetails from "./Components/ExtraCharge/extraChargeFormDetails";
import PlotCancellationForm from "./Components/plotDetails/plotCancelationForm";
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const isLoginPage = location.pathname === "/adminlogin";

  return (
    <div className="flex flex-col min-h-screen">
      {!isLoginPage && <Navbar />}
      <div className={`flex flex-1 ${!isLoginPage ? "pt-[100px]" : ""}`}>
        <MainLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          success: { style: { background: "#22c55e", color: "white" } },
          error: { style: { background: "#ef4444", color: "white" } },
        }}
      />
    </div>
  );
}

function MainLayout({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const isLoginPage = location.pathname === "/adminlogin";

  return (
    <div className="flex flex-1">
      {!isLoginPage && (
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      )}

      <div
        className={`flex-1 transition-all duration-300 ${
          !isLoginPage && sidebarOpen ? "ml-72" : "ml-0"
        }`}
      >
        <Routes>
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/projectLand"
            element={
              <PrivateRoute>
                <MainProjLand />
              </PrivateRoute>
            }
          />
          <Route
            path="/viewProjects"
            element={
              <PrivateRoute>
                <ViewProjects />
              </PrivateRoute>
            }
          />
          <Route
            path="/plotDimensions"
            element={
              <PrivateRoute>
                <AvailablePlotDimension />
              </PrivateRoute>
            }
          />
          <Route
            path="/viewlanddetails"
            element={
              <PrivateRoute>
                <ViewLandDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/addprojectstatus"
            element={
              <PrivateRoute>
                <AddProjectStatus />
              </PrivateRoute>
            }
          />
          <Route
            path="/viewprojectstatus"
            element={
              <PrivateRoute>
                <ViewProjectStatus />
              </PrivateRoute>
            }
          />
          <Route
            path="/editviewprojectstatus/:id"
            element={
              <PrivateRoute>
                <EditViewProjectStatus />
              </PrivateRoute>
            }
          />
          <Route
            path="/addmemberdetails"
            element={
              <PrivateRoute>
                <MemberFormWrapper />
              </PrivateRoute>
            }
          />
          <Route
            path="/viewmemberdetails"
            element={
              <PrivateRoute>
                <ViewMemberdetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/viewInactiveMembers"
            element={
              <PrivateRoute>
                <ViewInactiveMembers />
              </PrivateRoute>
            }
          />
          <Route
            path="/ViewUserDetails"
            element={
              <PrivateRoute>
                <ViewUserdetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/siteBookingConfirmation"
            element={
              <PrivateRoute>
                <SiteBookingConfirmation />
              </PrivateRoute>
            }
          />
          <Route
            path="/addconfirmationLetter/:id"
            element={
              <PrivateRoute>
                <AddConfirmationletter />
              </PrivateRoute>
            }
          />
          <Route
            path="/viewSiteBooking"
            element={
              <PrivateRoute>
                <ViewSitebookingConfirmation />
              </PrivateRoute>
            }
          />
          <Route
            path="/viewReceipts"
            element={
              <PrivateRoute>
                <ViewReceiptDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-member/:id"
            element={
              <PrivateRoute>
                <MemberFormWrapper />
              </PrivateRoute>
            }
          />
          <Route
            path="/view-history/:id"
            element={
              <PrivateRoute>
                <ViewReceiptHistory />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-receipt/:id"
            element={
              <PrivateRoute>
                <AddReceipt />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-receipt/:id"
            element={
              <PrivateRoute>
                <EditReceipt />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-confirmationletter/:id"
            element={
              <PrivateRoute>
                <EditConfirmationLetter />
              </PrivateRoute>
            }
          />
          <Route
            path="/plotTransferForm"
            element={
              <PrivateRoute>
                <PlotTransferForm />
              </PrivateRoute>
            }
          />
          1
          <Route
            path="/view-share-certificate"
            element={
              <PrivateRoute>
                <ShareCertificate />
              </PrivateRoute>
            }
          />
          <Route
            path="/plotTransferhistory"
            element={
              <PrivateRoute>
                <PlotTransferhistory />
              </PrivateRoute>
            }
          />
          <Route
            path="/extrachargeform"
            element={
              <PrivateRoute>
                <ExtraChargeFormDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/plotCancelationForm"
            element={
              <PrivateRoute>
                <PlotCancellationForm />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default AppWrapper;
