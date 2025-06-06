import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./Header.jsx";
import SideBar from "./SideBar.jsx";

 import "./main.css";

import PageTitle from "./PageTitle.jsx";

import Protected from "../Pages/Protected.jsx";
import SuperAdminDashboard from "../Pages/Admin/SuperAdminDashboard.jsx";
import AdminDashboard from "../Pages/Subadmin/AdminDashboard.jsx";
import AdminRegister from "../Pages/Admin/SubAdmin/AdminRegister.jsx";
import SubAdminList from "../Pages/Admin/SubAdmin/SubAdminList.jsx";
import RegisterUser from "../Pages/Admin/User/RegisterUser.jsx";
import UserList from "../Pages/Admin/User/UserList.jsx";
import CreateGroup from "../Pages/Subadmin/Group/CreateGroup.jsx";
import AsssignGroupToAdmin from "../Pages/Admin/Groups/AsssignGroupToAdmin.jsx";
import SelfGroupList from "../Pages/Subadmin/Group/SelfGroupList.jsx";
import LiveSession from "../Pages/Subadmin/Group/LiveSession.jsx";
import UserGroupList from "../Pages/User/UserGroupList.jsx";
import AllgroupList from "../Pages/Admin/Groups/AllgroupList.jsx";
import FeedbackList from "../Pages/Admin/FeedbackList.jsx";


const Allmain = () => {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("");

     useEffect(() => {
  //       // Map routes to page titles
        const routeToTitle = {
          "/Super Admin Dashboard": "Dashboard",
          "/Admin Dashboard": "Franchise dashboard",
          "/Register Admin":"Register Admin",
          "/Admin List":"Admin List",
          "/User Register":"Register User",
          "/User List":"User List",
          "/Create Group":"Create Group",
          "/Assign-group":"Assing Group",
          "/Your Groups":"Your Groups",
          "/User Group":"User Group",
          "/All Group":"All Group",
         "/FeedBack List":"Feedbacks"
         
        };

        const title = routeToTitle[location.pathname];
        if (title) {
          setPageTitle(title);
        } else {
          setPageTitle("");
        }
     }, [location.pathname]);
  return (
    <>
      <Header />
      <SideBar />
      <main
        id="main"
        className="main"
        style={{ backgroundColor: "#D6E9FC", height: "auto" }}
      >
        {/* <PageTitle page={pageTitle} /> */}
        <Routes>
          <Route path="/super-admin-dashboard" element={<SuperAdminDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/register-admin" element={<AdminRegister />} />
          <Route path="/admin-list" element={<SubAdminList />} />
          <Route path="/user-register" element={<RegisterUser />} />
          <Route path="/user-list" element={<UserList />} />
          <Route path="/create-group" element={<CreateGroup />} />
          <Route path="/assign-group" element={<AsssignGroupToAdmin />} />
          <Route path="/my-groups" element={<SelfGroupList />} />
          <Route path="/join-session/:groupId" element={<LiveSession />} />
          <Route path="/user-group" element={<UserGroupList />} />
          <Route path="/all-group" element={<AllgroupList />} />
<Route path="/feedbacks" element={<FeedbackList />} />       

          
        </Routes>
      </main>
    </>
  );
};

export default Allmain;
