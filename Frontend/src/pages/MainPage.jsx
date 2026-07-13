import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Home from "./Home.jsx";
import Header from "../components/Header.jsx";
import AgentIAN from "./AgentIAN.jsx";
import Glossary from "./Glossary.jsx";
import Dashboards from "./Dashboards.jsx";
import RawData from "./rawdata.jsx";

export const MainPage = () => {
    // 🔑 Estado global para controlar el menú en móviles
    const [sidebarAbierto, setSidebarAbierto] = useState(false);

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-admosa-gray text-admosa-dark font-sans relative">
            
            {/* Pasamos la función para abrir/cerrar al Header */}
            <div className="shrink-0 w-full z-30">
                <Header onToggleSidebar={() => setSidebarAbierto(!sidebarAbierto)} isSidebarOpen={sidebarAbierto} />
            </div>
            
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden relative">
                
                {/* 📱 Sidebar Adaptado para Móviles (Drawer Flotante) y PC:
                  - md:static md:block md:w-64: En PC se queda fijo a la izquierda.
                  - En móvil: Si está activo, flota sobre el contenido ocupando casi toda la pantalla.
                */}
                <div className={`
                    fixed md:static top-0 md:top-0 left-0 h-full md:h-full w-72 md:w-64 
                  bg-white border-r border-admosa-dark/10 z-40 transition-transform duration-300 ease-in-out shrink-0
                    ${sidebarAbierto ? "translate-x-0" : "-translate-x-full"} 
                    md:translate-x-0 md:block
                `}>
                    {/* Pasamos la función para cerrarlo automáticamente cuando el usuario haga clic en un link */}
                    <Sidebar alNavegar={() => setSidebarAbierto(false)} />
                </div>
                
                {/* 🌫️ Fondo oscuro traslúcido (Overlay) que bloquea la pantalla al abrir el menú en móviles */}
                {sidebarAbierto && (
                    <div 
                        className="fixed inset-0 bg-black/40 z-30 md:hidden top-0" 
                        onClick={() => setSidebarAbierto(false)}
                    />
                )}
                
                {/* Contenido dinámico */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <Routes>
                        <Route path="/home" element={<Home />} />
                        <Route path="/agente" element={<AgentIAN />} />
                        {/*<Route path="/glosario" element={<Glossary />} /> */}
                        <Route path="/rawdata" element={<RawData />} />
                        <Route path="/tableros" element={<Dashboards />} />
                        <Route path="/" element={<Navigate to="/home" replace />} />
                        <Route path="*" element={<Navigate to="/home" replace />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default MainPage;