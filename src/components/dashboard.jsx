import React, { useEffect, useState } from "react";
import { logout } from "../redux/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import toast from "react-hot-toast";
import axios from "axios";
import axiosInstance from "../api/interceptors";

function Dashboard() {
  const [totalProjectsCount, setTotalProjects] = useState(0);
  const [totalRegMembers, setTotalRegMembers] = useState(0);
  const [totalInactiveMembers, setTotalInactiveMembers] = useState(0);
  const user = {
    name: "Tom Cook",
    email: "tom@example.com",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout()); // Dispatch logout action
    navigate("/adminlogin"); // Redirect to login page
  };

  useEffect(() => {
    const fetchProjectsCount = async () => {
      try {
        // const response = await axios.get(
        //   "http://localhost:4000/project/totalprojectscount"
        //   // "https://adminpanel.defencehousingsociety.com/project/totalprojectscount"
        // );
        const data = await axiosInstance.get("/project/totalprojectscount");
        // setTotalProjects(response.data.totalProjects);
        // setTotalRegMembers(response.data.totalRegMembers);
        // setTotalInactiveMembers(response.data.totalInactiveMembers);
        setTotalProjects(data.totalProjects);
        setTotalRegMembers(data.totalRegMembers);
        setTotalInactiveMembers(data.totalInactiveMembers);
      } catch (err) {
        toast.error("failed to fetch the projects count");
        console.error("failed to fetch the projects count", err);
      }
    };
    fetchProjectsCount();
  }, []);
  return (
    <>
      <div className="bg-[#E7F2FD] w-full h-screen">
        <div className="min-h-full bg-[#E7F2FD]">
          <div className="flex justify-center gap-10 pt-12">
            <div className="bg-white border-1 border-green-500 text-green-600 rounded-lg shadow-md w-64 h-48 flex flex-col items-center justify-center text-center hover:shadow-lg transition p-4">
              <h2 className="text-2xl font-semibold capitalize mb-2">
                Total number of Projects
              </h2>
              <p className="text-4xl font-bold">{totalProjectsCount}</p>
            </div>

            <div className="bg-white border-1 border-red-500 text-red-600 rounded-lg shadow-md w-64 h-48 flex flex-col items-center justify-center text-center hover:shadow-lg transition p-4">
              <h2 className="text-2xl font-semibold capitalize mb-2">
                Total Registered Members
              </h2>
              <p className="text-4xl font-bold">{totalRegMembers}</p>
            </div>
            <div className="bg-white border-1 border-blue-500 text-blue-600 rounded-lg shadow-md w-64 h-48 flex flex-col items-center justify-center text-center hover:shadow-lg transition p-4">
              <h2 className="text-2xl font-semibold capitalize mb-2">
                Inactive Members
              </h2>
              <p className="text-4xl font-bold">{totalInactiveMembers}</p>
            </div>
          </div>
          <div className="mt-12 mx-auto w-11/12 max-w-5xl overflow-hidden rounded-lg border border-gray-300 bg-white shadow-md">
            <div className="p-8 text-gray-700 text-lg leading-relaxed animate-scroll overflow-y-auto h-72 hover:[animation-play-state:paused] space-y-4">
              <p>
                ⭐️ Defence Habitat is a social service organization,
                functioning with an objective of promoting and facilitating to
                Serving and Retired Armed / Defence Forces as well as Para
                Military personnel.
              </p>
              <p>
                ⭐️ The objectives of Defence Habitat amongst others, include
                facilitating provisions of residential plots by promoting
                housing schemes in cities all over the States as per the demand
                of Defence and Para Military personnel and their families.
              </p>
              <p>
                ⭐️ Although Defence Habitat does not construct any projects on
                its own, it ties up with reputed builders /developers to provide
                the best in class dwelling units to its members at genuine
                prices.
              </p>
              <p>
                ⭐️ Defence Habitat amongst others provides premium residential
                plots which is peaceful, and pollution-free property by
                promoting housing schemes in cities all over the state as per
                the demand of Defence and ParaMilitary personnel and their
                families.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
