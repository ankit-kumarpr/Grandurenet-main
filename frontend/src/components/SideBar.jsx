import React, { useState } from "react";
import "./sidebar.css";

import { FaUsers } from "react-icons/fa";
import { RiBriefcase4Fill } from "react-icons/ri";
import { IoGridOutline } from "react-icons/io5";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { MdHistoryEdu } from "react-icons/md";
import { MdOutlineCategory } from "react-icons/md";
import { Link } from "react-router-dom";

const SideBar = () => {
  let role = "";

  const [dropdowns, setDropdowns] = useState({
    employees: false,
    admin:false,
    
  });

  const toggleDropdown = (name) => {
    setDropdowns({ ...dropdowns, [name]: !dropdowns[name] });
  };
  role = sessionStorage.getItem("userRole");
  console.log("role in sidebar",role);
  return (
    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">
       
        {role === "SuperAdmin" && (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/super-admin-dashboard">
                <IoGridOutline size={20} />
                <span className="nav-heading collapsed">Super Admin Dashboard</span>
              </Link>
            </li>
 <li className="nav-item">
              <div
                className="nav-link"
                onClick={() => toggleDropdown("admin")}
              >
                <MdOutlineCategory size={20} />
                <span className="nav-heading collapsed">Admin</span>
              </div>
              {dropdowns.admin && (
                <ul className="nav-content">
                  <li className="ps-3">
                    <Link to="/register-admin" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Add Admin
                      </span>
                    </Link>
                  </li>
                  <li className="ps-3">
                    <Link to="/admin-list" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Admin List
                      </span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
 <li className="nav-item">
              <div
                className="nav-link"
                onClick={() => toggleDropdown("user")}
              >
                <MdOutlineCategory size={20} />
                <span className="nav-heading collapsed">User</span>
              </div>
              {dropdowns.user && (
                <ul className="nav-content">
                  <li className="ps-3">
                    <Link to="/user-register" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        Add User
                      </span>
                    </Link>
                  </li>
                  <li className="ps-3">
                    <Link to="/user-list" className="nav-link">
                      <i className="bi bi-circle"></i>
                      <span className="nav-heading collapsed">
                        User List
                      </span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/assign-group">
                <IoGridOutline size={20} />
                <span className="nav-heading collapsed">Assing Group</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/all-group">
                <IoGridOutline size={20} />
                <span className="nav-heading collapsed">All Groups</span>
              </Link>
            </li>

             <li className="nav-item">
              <Link className="nav-link" to="/feedbacks">
                <IoGridOutline size={20} />
                <span className="nav-heading collapsed">Feedbacks</span>
              </Link>
            </li>
          </>
        )}

        {role === "Admin" && (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/admin-dashboard">
                <IoGridOutline size={20} />
                <span className="nav-heading collapsed">
                  Admin Dashboard
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/create-group">
                <IoGridOutline size={20} />
                <span className="nav-heading collapsed">
                  Create Group
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/my-groups">
                <IoGridOutline size={20} />
                <span className="nav-heading collapsed">
                  Your Groups
                </span>
              </Link>
            </li>
           
          </>
        )}
        {role === "User" && (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/user-dashboard">
                <IoGridOutline size={20} />
                <span className="nav-heading collapsed">
                  User Dashboard
                </span>
              </Link>
            </li>
         
            <li className="nav-item">
              <Link className="nav-link" to="/user-group">
                <IoGridOutline size={20} />
                <span className="nav-heading collapsed">
                  Your Groups
                </span>
              </Link>
            </li>
           
          </>
        )}
      </ul>
    </aside>
  );
};

export default SideBar;
