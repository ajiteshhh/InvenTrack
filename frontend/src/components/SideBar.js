import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AlertDialog from "./AlertDialog";
import logo from "../logo.png";

const Sidebar = ({ isSidebarCollapsed, isMobileSidebarOpen, setMobileSidebarOpen }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const { user, logout } = useAuth();
  const userMenuRef = useRef(null);
  const userButtonRef = useRef(null);

  const mobileSidebarClass = isMobileSidebarOpen
      ? "translate-x-0"
      : "-translate-x-full";

  useEffect(() => {
    function handleClickOutside(event) {
      if (
          userMenuOpen &&
          userMenuRef.current &&
          !userMenuRef.current.contains(event.target) &&
          userButtonRef.current &&
          !userButtonRef.current.contains(event.target)
      ) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  useEffect(() => {
    if (!isMobileSidebarOpen) {
      setUserMenuOpen(false);
    }
  }, [isMobileSidebarOpen]);

  useEffect(() => {
    if (isSidebarCollapsed) {
      setUserMenuOpen(false);
    }
  }, [isSidebarCollapsed]);

  return (
      <>
        {/* Mobile Sidebar */}
        <aside
            className={`fixed inset-y-0 left-0 bg-white border-r border-gray-200 z-[60] w-64 transform transition-transform duration-300 ease-in-out ${mobileSidebarClass} lg:hidden overflow-y-auto`}
        >
          <div className="flex flex-col min-h-screen">
            <div className="p-6 border-b border-gray-200">
            <span className="text-2xl font-heading font-bold text-primary-700">
              InvenTrack
            </span>
            </div>

            <nav className="flex-1">
              <ul className="space-y-2 px-4 py-4">
                <li>
                  <NavLink
                      to="/dashboard"
                      className={({ isActive }) =>
                          `flex items-center px-4 py-3 rounded-lg hover:bg-primary-50 transition-colors duration-150 ${
                              isActive ? "bg-primary-50 text-primary-700" : "text-gray-700"
                          }`
                      }
                      onClick={() => setMobileSidebarOpen(false)}
                  >
                    <i className="fas fa-chart-line w-5" />
                    <span className="ml-3 font-medium">Dashboard</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                      to="/inventory"
                      className={({ isActive }) =>
                          `flex items-center px-4 py-3 rounded-lg hover:bg-primary-50 transition-colors duration-150 ${
                              isActive ? "bg-primary-50 text-primary-700" : "text-gray-700"
                          }`
                      }
                      onClick={() => setMobileSidebarOpen(false)}
                  >
                    <i className="fas fa-box w-5" />
                    <span className="ml-3 font-medium">Inventory</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                      to="/orders"
                      className={({ isActive }) =>
                          `flex items-center px-4 py-3 rounded-lg hover:bg-primary-50 transition-colors duration-150 ${
                              isActive ? "bg-primary-50 text-primary-700" : "text-gray-700"
                          }`
                      }
                      onClick={() => setMobileSidebarOpen(false)}
                  >
                    <i className="fas fa-shopping-cart w-5" />
                    <span className="ml-3 font-medium">Orders</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                      to="/suppliers"
                      className={({ isActive }) =>
                          `flex items-center px-4 py-3 rounded-lg hover:bg-primary-50 transition-colors duration-150 ${
                              isActive ? "bg-primary-50 text-primary-700" : "text-gray-700"
                          }`
                      }
                      onClick={() => setMobileSidebarOpen(false)}
                  >
                    <i className="fas fa-truck w-5" />
                    <span className="ml-3 font-medium">Suppliers</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                      to="/customers"
                      className={({ isActive }) =>
                          `flex items-center px-4 py-3 rounded-lg hover:bg-primary-50 transition-colors duration-150 ${
                              isActive ? "bg-primary-50 text-primary-700" : "text-gray-700"
                          }`
                      }
                      onClick={() => setMobileSidebarOpen(false)}
                  >
                    <i className="fas fa-users w-5" />
                    <span className="ml-3 font-medium">Customers</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                      to="/settings"
                      className={({ isActive }) =>
                          `flex items-center px-4 py-3 rounded-lg hover:bg-primary-50 transition-colors duration-150 ${
                              isActive ? "bg-primary-50 text-primary-700" : "text-gray-700"
                          }`
                      }
                      onClick={() => setMobileSidebarOpen(false)}
                  >
                    <i className="fas fa-cog w-5" />
                    <span className="ml-3 font-medium">Settings</span>
                  </NavLink>
                </li>
              </ul>
            </nav>

            <div className="border-t border-gray-200 p-4 mt-auto">
              <div className="flex items-center relative">
                <img
                    src={user.profile_picture}
                    alt="User"
                    className="w-10 h-10 rounded-full"
                />
                <div className="ml-3">
                  <button
                      ref={userButtonRef}
                      onClick={() => setUserMenuOpen((prev) => !prev)}
                      className="text-sm font-medium text-gray-700 hover:text-primary-600"
                  >
                    {user.name}
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </button>
                  {userMenuOpen && (
                      <div
                          ref={userMenuRef}
                          className="absolute bottom-full left-0 mb-2 w-48 rounded-lg shadow-lg bg-white border border-gray-200"
                      >
                        <div className="py-1">
                          <a
                              onClick={() => {
                                setUserMenuOpen(false);
                                setAlertVisible(true);
                              }}
                              className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                          >
                            Logout
                          </a>
                        </div>
                      </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Desktop Sidebar */}
        <aside
            className={`hidden lg:block fixed inset-y-0 left-0 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
                isSidebarCollapsed ? "w-20" : "w-64"
            } z-50`}
        >
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-gray-200">
              {isSidebarCollapsed ? (
                  <img className="w-10 h-auto" src={logo} alt="logo"/>
              ) : (
                  <span className="text-2xl font-heading font-bold text-primary-700">
                InvenTrack
              </span>
              )}
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1">
              <ul className="space-y-2 px-4 py-6">
                <li>
                  <NavLink
                      to="/dashboard"
                      className={({ isActive }) =>
                          `flex items-center px-4 py-3 rounded-lg hover:bg-primary-50 transition-colors duration-150 ${
                              isActive ? "bg-primary-50 text-primary-700" : "text-gray-700"
                          }`
                      }
                  >
                    <i className="fas fa-chart-line w-5" />
                    {!isSidebarCollapsed && (
                        <span className="ml-3 font-medium">Dashboard</span>
                    )}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                      to="/inventory"
                      className={({ isActive }) =>
                          `flex items-center px-4 py-3 rounded-lg hover:bg-primary-50 transition-colors duration-150 ${
                              isActive ? "bg-primary-50 text-primary-700" : "text-gray-700"
                          }`
                      }
                  >
                    <i className="fas fa-box w-5" />
                    {!isSidebarCollapsed && (
                        <span className="ml-3 font-medium">Inventory</span>
                    )}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                      to="/orders"
                      className={({ isActive }) =>
                          `flex items-center px-4 py-3 rounded-lg hover:bg-primary-50 transition-colors duration-150 ${
                              isActive ? "bg-primary-50 text-primary-700" : "text-gray-700"
                          }`
                      }
                  >
                    <i className="fas fa-shopping-cart w-5" />
                    {!isSidebarCollapsed && (
                        <span className="ml-3 font-medium">Orders</span>
                    )}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                      to="/suppliers"
                      className={({ isActive }) =>
                          `flex items-center px-4 py-3 rounded-lg hover:bg-primary-50 transition-colors duration-150 ${
                              isActive ? "bg-primary-50 text-primary-700" : "text-gray-700"
                          }`
                      }
                  >
                    <i className="fas fa-truck w-5" />
                    {!isSidebarCollapsed && (
                        <span className="ml-3 font-medium">Suppliers</span>
                    )}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                      to="/customers"
                      className={({ isActive }) =>
                          `flex items-center px-4 py-3 rounded-lg hover:bg-primary-50 transition-colors duration-150 ${
                              isActive ? "bg-primary-50 text-primary-700" : "text-gray-700"
                          }`
                      }
                  >
                    <i className="fas fa-users w-5" />
                    {!isSidebarCollapsed && (
                        <span className="ml-3 font-medium">Customers</span>
                    )}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                      to="/settings"
                      className={({ isActive }) =>
                          `flex items-center px-4 py-3 rounded-lg hover:bg-primary-50 transition-colors duration-150 ${
                              isActive ? "bg-primary-50 text-primary-700" : "text-gray-700"
                          }`
                      }
                  >
                    <i className="fas fa-cog w-5" />
                    {!isSidebarCollapsed && (
                        <span className="ml-3 font-medium">Settings</span>
                    )}
                  </NavLink>
                </li>
              </ul>
            </nav>
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center relative">
                <img
                    src={user.profile_picture}
                    alt="User"
                    className="w-10 h-10 rounded-full"
                />
                {!isSidebarCollapsed && (
                    <div className="ml-3 relative">
                      <button
                          ref={userButtonRef}
                          onClick={() => setUserMenuOpen((prev) => !prev)}
                          className="text-sm font-medium text-gray-700 hover:text-primary-600"
                      >
                        {user.name}
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </button>
                      {userMenuOpen && (
                          <div
                              ref={userMenuRef}
                              className="absolute bottom-full left-0 mb-2 w-48 rounded-lg shadow-lg bg-white border border-gray-200"
                          >
                            <div className="py-1">
                              <a
                                  onClick={() => {
                                    setUserMenuOpen(false);
                                    setAlertVisible(true);
                                  }}
                                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                              >
                                Logout
                              </a>
                            </div>
                          </div>
                      )}
                    </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        {isMobileSidebarOpen && (
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300"
                onClick={() => {
                  setMobileSidebarOpen(false);
                  setUserMenuOpen(false);
                }}
            />
        )}

        {alertVisible && (
            <AlertDialog
                title="Logout"
                message="Are you sure you want to logout?"
                type="Logout"
                onConfirm={() => {
                  logout();
                  setAlertVisible(false);
                }}
                onCancel={() => setAlertVisible(false)}
            />
        )}
      </>
  );
};

export default Sidebar;