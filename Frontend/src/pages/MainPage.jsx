import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar.jsx";
import Home from "./Home.jsx";
import Header from "../components/layout/Header.jsx";
import AgentIAN from "./AgentIAN.jsx";
import Glossary from "./Glossary.jsx";
import Dashboards from "./Dashboards.jsx";
import RawData from "./RawData.jsx";
import { Login } from "./Login.jsx";
import { UsersManager } from "./Full Admin/UserManager.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {AdminDashboards} from "../pages/Admin/AdminDashboards.jsx"
import { AdminRawData } from "./Admin/AdminRawData.jsx";
import { AdminSynonyms } from "./Admin/AdminGlossary.jsx";
import { AdminUsers } from "./Admin/AdminUsers.jsx";
import UserProfile from "./Admin/UserProfile.jsx";
import TasksPage from "./Admin/taskPage.jsx";

export const MainPage = () => {
    const [sidebarAbierto, setSidebarAbierto] = useState(false);
    const { user, loading } = useAuth(); 
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';

    const isAdmin = user?.role === 'ADMIN' || user?.role === 'FULL ADMIN'

    if (loading) {
        return <div className="flex h-screen items-center justify-center bg-admosa-gray text-admosa-dark font-bold">Cargando...</div>;
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-admosa-gray text-admosa-dark font-sans relative">
            
            {/* 1. EL HEADER SE OCULTA SI ESTAMOS EN LOGIN */}
            {!isLoginPage && (
                <div className="shrink-0 w-full z-30">
                    <Header onToggleSidebar={() => setSidebarAbierto(!sidebarAbierto)} isSidebarOpen={sidebarAbierto} />
                </div>
            )}
            
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden relative">
                
                {/* 2. EL SIDEBAR SE OCULTA SI ESTAMOS EN LOGIN */}
                {!isLoginPage && (
                    <>
                        <div className={`
                            fixed md:static top-0 md:top-0 left-0 h-full md:h-full w-72 md:w-64 
                          bg-white border-r border-admosa-dark/10 z-40 transition-transform duration-300 ease-in-out shrink-0
                            ${sidebarAbierto ? "translate-x-0" : "-translate-x-full"} 
                            md:translate-x-0 md:block
                        `}>
                            <Sidebar alNavegar={() => setSidebarAbierto(false)} />
                        </div>
                        
                        {sidebarAbierto && (
                            <div 
                                className="fixed inset-0 bg-black/40 z-30 md:hidden top-0" 
                                onClick={() => setSidebarAbierto(false)}
                            />
                        )}
                    </>
                )}
                
                {/* 3. RUTAS Y CONTENIDO PRINCIPAL */}
                <div className={`flex-1 overflow-y-auto ${isLoginPage ? 'p-0' : 'p-4 md:p-8'}`}>
                    <Routes>
                        {/* RUTAS PÚBLICAS (Todos pueden ver) */}
                        <Route path="/home" element={<Home />} />
                        <Route path="/agente" element={<AgentIAN />} />
                        <Route path="/rawdata" element={<RawData />} />
                        <Route path="/tableros" element={<Dashboards />} />
                        
                        {/* RUTA DE LOGIN (Si ya es admin, lo manda al home) */}
                        <Route path="/login" element={user ? <Navigate to="/home" replace /> : <Login />} />

                        {/* RUTA SÚPER PRIVADA (Solo Full Admin) */}
                        <Route 
                            path="/admin/usuarios" 
                            element={user?.role === 'full_admin' || user?.role === 'FULL ADMIN' ? <AdminUsers /> : <Navigate to="/home" replace />} 
                        />


                        {/* RUTA SOLO ADMINS*/}
                        <Route 
                            path="/admin/perfil" 
                            element={isAdmin ? <UserProfile /> : <Navigate to="/home" replace />} 
                        />

                        <Route 
                            path="/admin/tableros" 
                            element={isAdmin ? <AdminDashboards /> : <Navigate to="/home" replace />} 
                        />

                        <Route 
                            path="/admin/rutas" 
                            element={isAdmin ? <AdminRawData /> : <Navigate to="/home" replace />} 
                        />

                        <Route 
                            path="/admin/glosario" 
                            element={isAdmin ? <AdminSynonyms /> : <Navigate to="/home" replace />} 
                        />

                        <Route 
                            path="/admin/tasks" 
                            element={isAdmin ? <TasksPage /> : <Navigate to="/home" replace />} 
                        />

                        {/* REDIRECCIONES POR DEFECTO */}
                        <Route path="/" element={<Navigate to="/home" replace />} />
                        <Route path="*" element={<Navigate to="/home" replace />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default MainPage;