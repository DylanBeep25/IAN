import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Home from "./Home.jsx";
import Header from "../components/Header.jsx";
import AgentIAN from "./AgentIAN.jsx";
import Glossary from "./Glossary.jsx";
import Dashboards from "./Dashboards.jsx";

export const MainPage = () => {
    return (
        // Reemplazamos el bg-gray-900 por tu color de fondo institucional (#F4F7F9)
        // Y el color de texto general será tu tono oscuro (#0A1F33)
        <div className="flex flex-col h-screen overflow-hidden bg-[#F4F7F9] text-[#0A1F33] font-sans">
            
            {/* El Header fijo arriba */}
            <div className="shrink-0">
                <Header />
            </div>
            
            <div className="flex flex-1 overflow-hidden">
                
                {/* Sidebar: Fondo blanco para contrastar con el gris-azulado del fondo, borde sutil */}
                <div className="w-64 bg-white border-r border-[#0A1F33]/10 overflow-y-auto z-10 shadow-[4px_0_24px_rgba(10,31,51,0.02)]">
                    <Sidebar />
                </div>
                
                {/* Contenido dinámico con scroll independiente */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <Routes>
                        <Route path="/home" element={<Home />} />
                        <Route path="/agente" element={<AgentIAN />} />
                        <Route path="/glosario" element={<Glossary />} />
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