import Task from "./task.model.js";
import ExcelJS from 'exceljs';

export const createTask = async (req, res) => {
    try {
        const userId = req.user.uid; // Corregido a uid
        const { type, projectName, title, status, progressPercentage, timeSpentMinutes, dueDate, comments, isTemplate } = req.body;

        const newTask = new Task({
            user: userId,
            type,
            projectName: type === 'PROJECT' ? projectName : undefined,
            title,
            status: status || (type === 'DAILY_TASK' || type === 'MEETING' ? 'DONE_TODAY' : 'IN_PROGRESS'),
            progressPercentage: type === 'PROJECT' ? (progressPercentage || 0) : 100,
            timeSpentMinutes: timeSpentMinutes || 0,
            dueDate,
            comments,
            isTemplate: isTemplate || false
        });

        await newTask.save();

        return res.status(201).json({
            success: true,
            message: 'Registro creado exitosamente',
            task: newTask
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al crear el registro',
            error: error.message
        });
    }
};

export const getTasks = async (req, res) => {
    try {
        const { uid, role } = req.user; // Usando uid
        const { type, status, activeProjects } = req.query;

        let filter = {};

        // Filtro de negocio: Si no es FULL ADMIN, solo ve lo suyo
        if (role !== 'FULL ADMIN') {
            filter.user = uid;
        }

        if (activeProjects === 'true') {
            filter.type = 'PROJECT';
            filter.status = { $ne: 'COMPLETED' };
        } else {
            if (type) filter.type = type;
            if (status) filter.status = status;
        }

        const tasks = await Task.find(filter)
            .populate('user', 'name surname email role')
            .sort({ updatedAt: -1 });

        return res.status(200).json({
            success: true,
            total: tasks.length,
            tasks
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener los registros',
            error: error.message
        });
    }
};

export const getWeeklySummary = async (req, res) => {
    try {
        // Validación eliminada: La ruta ya lo bloquea con isFullAdmin

        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const summary = await Task.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfWeek, $lte: endOfWeek }
                }
            },
            {
                $group: {
                    _id: "$user",
                    totalTasks: { $sum: 1 },
                    totalTimeSpentMinutes: { $sum: "$timeSpentMinutes" },
                    projectsCount: {
                        $sum: { $cond: [{ $eq: ["$type", "PROJECT"] }, 1, 0] }
                    },
                    dailyTasksCount: {
                        $sum: { $cond: [{ $eq: ["$type", "DAILY_TASK"] }, 1, 0] }
                    },
                    meetingsCount: {
                        $sum: { $cond: [{ $eq: ["$type", "MEETING"] }, 1, 0] }
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            { $unwind: "$userInfo" },
            {
                $project: {
                    _id: 1,
                    collaborator: { $concat: ["$userInfo.name", " ", "$userInfo.surname"] },
                    email: "$userInfo.email",
                    totalTasks: 1,
                    totalHoursSpent: { $round: [{ $divide: ["$totalTimeSpentMinutes", 60] }, 2] },
                    projectsCount: 1,
                    dailyTasksCount: 1,
                    meetingsCount: 1
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            period: { startOfWeek, endOfWeek },
            summary
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al generar el resumen semanal',
            error: error.message
        });
    }
};

export const getUserTemplates = async (req, res) => {
    try {
        const templates = await Task.find({ user: req.user.uid, isTemplate: true }) // Corregido a uid
            .select('title type projectName timeSpentMinutes comments');

        return res.status(200).json({
            success: true,
            templates
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener plantillas',
            error: error.message
        });
    }
};

export const exportTasksToExcel = async (req, res) => {
    try {
        const { uid, role } = req.user; // Corregido a uid
        let filter = {};

        // Filtro de negocio
        if (role !== 'FULL ADMIN') filter.user = uid;

        const tasks = await Task.find(filter)
            .populate('user', 'name surname')
            .sort({ createdAt: -1 });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Reporte de Trabajo');

        worksheet.columns = [
            { header: 'Colaborador', key: 'collaborator', width: 25 },
            { header: 'Tipo', key: 'type', width: 15 },
            { header: 'Proyecto / Tarea', key: 'title', width: 35 },
            { header: 'Estado', key: 'status', width: 15 },
            { header: '% Avance', key: 'progress', width: 12 },
            { header: 'Tiempo (Min)', key: 'timeSpent', width: 15 },
            { header: 'Fecha Entrega', key: 'dueDate', width: 15 },
            { header: 'Comentarios', key: 'comments', width: 40 }
        ];

        tasks.forEach(task => {
            worksheet.addRow({
                collaborator: `${task.user.name} ${task.user.surname}`,
                type: task.type,
                title: task.type === 'PROJECT' ? `[${task.projectName}] ${task.title}` : task.title,
                status: task.status,
                progress: task.type === 'PROJECT' ? `${task.progressPercentage}%` : 'N/A',
                timeSpent: task.timeSpentMinutes,
                dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : 'N/A',
                comments: task.comments
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Reporte_Actividades_IAN.xlsx');

        await workbook.xlsx.write(res);
        return res.status(200).end();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al generar reporte en Excel',
            error: error.message
        });
    }
}

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { uid, role } = req.user; // Corregido a uid

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Registro no encontrado'
            });
        }

        // Validación de propiedad usando uid
        if (task.user.toString() !== uid.toString() && role !== 'FULL ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para modificar este registro'
            });
        }

        if (req.body.status === 'COMPLETED' && task.type === 'PROJECT') {
            req.body.progressPercentage = 100;
        }

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: 'Registro actualizado correctamente',
            task: updatedTask
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al actualizar el registro',
            error: error.message
        });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { uid, role } = req.user; // Corregido a uid

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Registro no encontrado'
            });
        }

        // Validación de propiedad usando uid
        if (task.user.toString() !== uid.toString() && role !== 'FULL ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para eliminar este registro'
            });
        }

        await Task.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: 'Registro eliminado correctamente'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al eliminar el registro',
            error: error.message
        });
    }
};