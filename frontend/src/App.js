import React, {useEffect, useState} from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/NavBar";
import Sidebar from "./components/SideBar";
import Dashboard from "./pages/dashboard/Dashboard";
import Inventory from "./pages/inventory/Inventory";
import Orders from "./pages/orders/Orders";
import Suppliers from "./pages/suppliers/Suppliers";
import Customers from "./pages/customers/Customers";
import Settings from "./pages/settings/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import {AuthProvider, useAuth} from "./context/AuthContext";
import SignIn from "./pages/auth/Signin";
import SignUp from "./pages/auth/Signup";
import Otp from "./pages/auth/Otp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import { DataProvider } from "./context/DataContext";
import CustomerDetailed from "./pages/customers/CustomerDetailed";
import SupplierDetailed from "./pages/suppliers/SupplierDetailed";
import {Toaster} from "sonner";

const AppLayout = ({ children }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarCollapsed((prev) => !prev);
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
            <Sidebar
                isSidebarCollapsed={isSidebarCollapsed}
                isMobileSidebarOpen={isMobileSidebarOpen}
                setMobileSidebarOpen={setMobileSidebarOpen}
            />

            <div
                className={`flex-1 transition-all duration-300 ${
                    isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
                }`}
            >
                <Navbar
                    toggleSidebar={toggleSidebar}
                    isSidebarCollapsed={isSidebarCollapsed}
                    isMobileSidebarOpen={isMobileSidebarOpen}
                    setMobileSidebarOpen={setMobileSidebarOpen}
                />

                <main className="p-3 pt-20 sm:pt-24">
                    <div className="max-w-full">{children}</div>
                </main>
            </div>
            <Toaster richColors/>
        </div>
    );
};
const PublicRoute = ({ children }) => {
    const { isAuthenticated, setFromAuthFlow } = useAuth();

    useEffect(() => {
        setFromAuthFlow(true);
    }, [setFromAuthFlow]);

    if (isAuthenticated) return <Navigate to="/dashboard" replace />;

    return children;
};

const OtpRoute = ({ children }) => {
    const { fromAuthFlow } = useAuth();
    return fromAuthFlow ? children : <Navigate to="/signin" replace />;
};
const App = () => {
    return (
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/signin" element={<PublicRoute><SignIn/></PublicRoute>}/>
                        <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
                        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

                        <Route path="/otp" element={<OtpRoute><Otp /></OtpRoute>} />

                        <Route
                            path="/*"
                            element={
                                <DataProvider>
                                    <Routes>
                                        <Route
                                            path="/dashboard"
                                            element={
                                                <ProtectedRoute>
                                                    <AppLayout>
                                                        <Dashboard />
                                                    </AppLayout>
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/customers/details"
                                            element={
                                                <ProtectedRoute>
                                                        <CustomerDetailed />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/suppliers/details"
                                            element={
                                                <ProtectedRoute>
                                                    <SupplierDetailed />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/inventory"
                                            element={
                                                <ProtectedRoute>
                                                    <AppLayout>
                                                        <Inventory />
                                                    </AppLayout>
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/orders"
                                            element={
                                                <ProtectedRoute>
                                                    <AppLayout>
                                                        <Orders />
                                                    </AppLayout>
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/suppliers"
                                            element={
                                                <ProtectedRoute>
                                                    <AppLayout>
                                                        <Suppliers />
                                                    </AppLayout>
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/customers"
                                            element={
                                                <ProtectedRoute>
                                                    <AppLayout>
                                                        <Customers />
                                                    </AppLayout>
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/settings"
                                            element={
                                                <ProtectedRoute>
                                                    <AppLayout>
                                                        <Settings />
                                                    </AppLayout>
                                                </ProtectedRoute>
                                            }
                                        />
                                    </Routes>
                                </DataProvider>
                            }
                        />

                        <Route path="/" element={<Navigate to="/signin" replace />} />

                        <Route
                            path="*"
                            element={
                                <div className="flex items-center justify-center h-screen text-xl text-gray-600">
                                    404 - Page Not Found
                                </div>
                            }
                        />
                    </Routes>
                </Router>
            </AuthProvider>
    );
};

export default App;
