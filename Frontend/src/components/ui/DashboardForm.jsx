import React, { useState } from 'react';
import { Input } from './Input.jsx'; 
import { useForm } from '../../shared/hooks/useForm.js'; 
import { addDashboard, updateDashboard } from '../../services/api.js'; 
import toast from 'react-hot-toast';
import { Save, Info, Building, BrainCircuit, Tags } from 'lucide-react';

export const DashboardForm = ({ dashboard, onSuccess }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('general');

    // 1. INICIALIZAMOS TODOS LOS CAMPOS (¡Esto repara el bug de escritura!)
    const { formData, handleValueChange, handleValidationOnBlur, isFormValid } = useForm({
        // Pestaña: General
        codigo: { value: dashboard?.codigo || '', isValid: !!dashboard, showError: false },
        nombre: { value: dashboard?.nombre || '', isValid: !!dashboard, showError: false },
        url: { value: dashboard?.url || '', isValid: !!dashboard, showError: false },
        pais: { value: dashboard?.pais || '', isValid: true, showError: false },
        destino: { value: dashboard?.destino || '', isValid: true, showError: false },
        descripcion: { value: dashboard?.descripcion || '', isValid: true, showError: false },
        
        // Pestaña: Admin
        area: { value: dashboard?.area || '', isValid: true, showError: false },
        responsable: { value: dashboard?.responsable || '', isValid: true, showError: false },
        frecuencia: { value: dashboard?.frecuencia || '', isValid: true, showError: false },
        // Si tu BD trae "30/06/2026", el input type="date" prefiere "YYYY-MM-DD". Lo dejamos como string genérico por ahora.
        actualizacion: { value: dashboard?.actualizacion || '', isValid: true, showError: false }, 
        
        // Pestaña: Contexto IA
        resumenIA: { value: dashboard?.resumenIA || '', isValid: true, showError: false },
        cuandoUsar: { value: dashboard?.cuandoUsar ? dashboard.cuandoUsar.join('\n') : '', isValid: true, showError: false },
        cuandoNoUsar: { value: dashboard?.cuandoNoUsar ? dashboard.cuandoNoUsar.join('\n') : '', isValid: true, showError: false },
        
        // Pestaña: Metadatos
        keywords: { value: dashboard?.keywords ? dashboard.keywords.join('\n') : '', isValid: true, showError: false },
        preguntas: { value: dashboard?.preguntas ? dashboard.preguntas.join('\n') : '', isValid: true, showError: false },
        
        // Para los KPIs, los mostramos como "Nombre: Valor"
        kpis: { 
            value: dashboard?.kpis 
                ? dashboard.kpis.map(k => `${k.name || k.name || 'KPI'}: ${k.valor || k.definition || ''}`).join('\n') 
                : '', 
            isValid: true, 
            showError: false 
        }
    });

    // 2. FORMATEADORES PARA EL BACKEND
    // Convierte texto con saltos de línea a un Array normal
    const parseArray = (text) => text ? text.split('\n').map(item => item.trim()).filter(item => item !== '') : [];
    
    // Convierte "Ventas: 100\nMeta: 50" a [{nombre: "Ventas", valor: "100"}, {nombre: "Meta", valor: "50"}]
    const parseKPIs = (text) => {
        if (!text) return [];
        return text.split('\n').filter(line => line.trim() !== '').map(line => {
            const parts = line.split(':');
            const name = parts[0]?.trim() || 'KPI Desconocido';
            const definition = parts.slice(1).join(':')?.trim() || '';
            return { name, definition };
        });
    };

    // 3. ENVÍO DE DATOS
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            codigo: formData.codigo.value,
            nombre: formData.nombre.value,
            url: formData.url.value,
            pais: formData.pais.value,
            destino: formData.destino.value,
            descripcion: formData.descripcion.value,
            area: formData.area.value,
            responsable: formData.responsable.value,
            frecuencia: formData.frecuencia.value,
            actualizacion: formData.actualizacion.value,
            resumenIA: formData.resumenIA.value,
            
            // Arrays procesados
            cuandoUsar: parseArray(formData.cuandoUsar.value),
            cuandoNoUsar: parseArray(formData.cuandoNoUsar.value),
            keywords: parseArray(formData.keywords.value),
            preguntas: parseArray(formData.preguntas.value),
            
            // KPIs procesados como Objetos
            kpis: parseKPIs(formData.kpis.value)
        };

        let res;
        const dashboardId = dashboard?._id || dashboard?.id;

        if (dashboard) res = await updateDashboard(dashboardId, payload);
        else res = await addDashboard(payload);

        setIsSubmitting(false);

        if (!res.error) {
            toast.success(dashboard ? 'Tablero actualizado' : 'Tablero creado exitosamente');
            onSuccess(); 
        } else {
            toast.error(res.message || 'Error al guardar');
        }
    };

    // COMPONENTE DE PESTAÑAS
    const TabButton = ({ id, icon: Icon, label }) => (
        <button
            type="button"
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
                activeTab === id 
                ? 'border-admosa-dark text-admosa-dark' 
                : 'border-transparent text-admosa-dark/40 hover:text-admosa-dark/70'
            }`}
        >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
        </button>
    );

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            
            {/* TABS DE NAVEGACIÓN */}
            <div className="flex border-b border-admosa-dark/10 mb-6 overflow-x-auto">
                <TabButton id="general" icon={Info} label="General" />
                <TabButton id="admin" icon={Building} label="Administración" />
                <TabButton id="ia" icon={BrainCircuit} label="Contexto IA" />
                <TabButton id="meta" icon={Tags} label="Metadatos" />
            </div>

            {/* CONTENIDO DE LAS PESTAÑAS */}
            <div className="space-y-4 flex-1">
                
                {/* 📌 PESTAÑA 1: GENERAL */}
                {activeTab === 'general' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="grid grid-cols-2 gap-4">
                            <Input field="codigo" label="Código *" value={formData.codigo.value} onChangeHandler={handleValueChange} onBlurHandler={handleValidationOnBlur} type="text" placeholder="MKT001" />
                            <Input field="pais" label="País" value={formData.pais.value} onChangeHandler={handleValueChange} onBlurHandler={handleValidationOnBlur} type="text" placeholder="Guatemala" />
                        </div>
                        <Input field="nombre" label="Nombre *" value={formData.nombre.value} onChangeHandler={handleValueChange} onBlurHandler={handleValidationOnBlur} type="text" />
                        <Input field="url" label="URL (PowerBI) *" value={formData.url.value} onChangeHandler={handleValueChange} onBlurHandler={handleValidationOnBlur} type="text" />
                        <div className="grid grid-cols-2 gap-4">
                            <Input field="destino" label="Destino (Sector)" value={formData.destino.value} onChangeHandler={handleValueChange} onBlurHandler={handleValidationOnBlur} type="text" placeholder="motos" />
                        </div>
                        <Input field="descripcion" label="Descripción" value={formData.descripcion.value} onChangeHandler={handleValueChange} onBlurHandler={handleValidationOnBlur} type="text" textarea={true} />
                    </div>
                )}

                {/* 🏢 PESTAÑA 2: ADMINISTRACIÓN */}
                {activeTab === 'admin' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        <Input field="area" label="Área de la Empresa" value={formData.area.value} onChangeHandler={handleValueChange} onBlurHandler={handleValidationOnBlur} type="text" placeholder="Inteligencia de mercados" />
                        <Input field="responsable" label="Responsable" value={formData.responsable.value} onChangeHandler={handleValueChange} onBlurHandler={handleValidationOnBlur} type="text" />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <Input field="frecuencia" label="Frecuencia" value={formData.frecuencia.value} onChangeHandler={handleValueChange} onBlurHandler={handleValidationOnBlur} type="text" placeholder="Mensual" />
                            {/* EL CALENDARIO AQUÍ: type="date" */}
                            <Input field="actualizacion" label="Última Actualización" value={formData.actualizacion.value} onChangeHandler={handleValueChange} onBlurHandler={handleValidationOnBlur} type="date" />
                        </div>
                    </div>
                )}

                {/* 🧠 PESTAÑA 3: CONTEXTO IA */}
                {activeTab === 'ia' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        <Input field="resumenIA" label="Resumen para IA" value={formData.resumenIA.value} onChangeHandler={handleValueChange} onBlurHandler={handleValidationOnBlur} type="text" textarea={true} placeholder="Este tablero es la columna vertebral..." />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input field="cuandoUsar" label="Cuándo Usar (1 por línea)" value={formData.cuandoUsar.value} onChangeHandler={handleValueChange} onBlurHandler={handleValidationOnBlur} type="text" textarea={true} placeholder="Análisis de cuotas...&#10;Planeación comercial..." />
                            <Input field="cuandoNoUsar" label="Cuándo NO Usar (1 por línea)" value={formData.cuandoNoUsar.value} onChangeHandler={handleValueChange} onBlurHandler={handleValidationOnBlur} type="text" textarea={true} placeholder="Monitorear stock...&#10;Análisis financiero..." />
                        </div>
                    </div>
                )}

                {/* 📊 PESTAÑA 4: METADATOS */}
                {activeTab === 'meta' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input field="keywords" label="Palabras Clave (1 por línea)" value={formData.keywords.value} onChangeHandler={handleValueChange} onBlurHandler={handleValidationOnBlur} type="text" textarea={true} placeholder="Motos&#10;Alzas&#10;Guatemala" />
                            <Input field="preguntas" label="Preguntas Frecuentes (1 por línea)" value={formData.preguntas.value} onChangeHandler={handleValueChange} onBlurHandler={handleValidationOnBlur} type="text" textarea={true} placeholder="¿Qué marca lidera?&#10;¿Cuál es el alza?" />
                        </div>

                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mt-4">
                            <p className="text-xs font-bold text-blue-800 mb-2">Instrucciones para KPIs:</p>
                            <p className="text-xs text-blue-700 mb-3">Escribe el nombre del KPI, dos puntos (:) y el valor. Uno por línea.</p>
                            <Input field="kpis" label="KPIs del Tablero" value={formData.kpis.value} onChangeHandler={handleValueChange} onBlurHandler={handleValidationOnBlur} type="text" textarea={true} placeholder="Crecimiento Urbana: +15%&#10;Participación Yamaha: 22%" />
                        </div>
                    </div>
                )}
            </div>

            {/* BOTÓN DE GUARDADO */}
            <div className="pt-6 mt-6 border-t border-admosa-dark/10">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold transition-all bg-admosa-dark text-white hover:bg-black shadow-lg shadow-admosa-dark/20"
                >
                    <Save className="w-5 h-5" />
                    <span>{isSubmitting ? 'Guardando...' : (dashboard ? 'Actualizar Tablero' : 'Crear Tablero')}</span>
                </button>
            </div>
        </form>
    );
};