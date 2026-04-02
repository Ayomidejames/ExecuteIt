import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, AlertCircle, Clock, CheckCircle2, Circle } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    category: 'Other'
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/getTasks');
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleOpenModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
        category: task.category || 'Other'
      });
    } else {
      setEditingTask(null);
      setFormData({ title: '', description: '', status: 'pending', category: 'Other' });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => {
      setEditingTask(null);
      setFormData({ title: '', description: '', status: 'pending', category: 'Other' });
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await axiosClient.put(`/updateTask/${editingTask._id}`, formData);
      } else {
        await axiosClient.post('/addTask', formData);
      }
      fetchTasks();
      closeModal();
    } catch (err) {
      console.error('Error saving task', err);
      alert(err.response?.data?.msg || 'Error saving task');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axiosClient.delete(`/removeTask/${id}`);
        fetchTasks();
      } catch (err) {
        console.error('Delete error', err);
      }
    }
  };

  const toggleStatus = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await axiosClient.put(`/updateTask/${task._id}`, { ...task, status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'in-progress': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <div className="flex justify-between items-end border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Tasks</h1>
          <p className="text-slate-500 mt-1">Manage and track your execution process.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5"
        >
          <Plus size={18} />
          New Task
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading your tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm flex flex-col items-center">
          <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
            <CheckSquare size={40} className="text-indigo-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No tasks found</h3>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">You're all caught up! Ready to execute something new? Create a task to get started.</p>
          <button
            onClick={() => handleOpenModal()}
            className="mt-6 text-indigo-600 font-semibold hover:text-indigo-700 hover:underline"
          >
            Create your first task
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {tasks.map(task => (
            <div
              key={task._id}
              className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full transform hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(task.status)}`}>
                  {task.status || 'pending'}
                </span>
                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                  <button onClick={() => handleOpenModal(task)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(task._id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-4 flex-1">
                <button
                  onClick={() => toggleStatus(task)}
                  className="mt-1 flex-shrink-0 focus:outline-none"
                >
                  {task.status === 'completed' ? (
                    <CheckCircle2 size={24} className="text-emerald-500 hover:text-emerald-600 transition-colors" />
                  ) : (
                    <Circle size={24} className="text-slate-300 hover:text-indigo-500 transition-colors" />
                  )}
                </button>

                <div>
                  <h3 className={`font-bold text-lg leading-tight mb-2 ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                    {task.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                    {task.description}
                  </p>
                </div>
              </div>

              {task.category && (
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <span className="bg-slate-100 px-2.5 py-1 rounded-md">{task.category}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Slide-over Modal Overlay */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          ></div>

          <div className="relative w-full max-w-md h-full bg-white shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 z-10">
              <h2 className="text-xl font-bold text-slate-800">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  Task Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  placeholder="E.g., Implement authentication middleware"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="5"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none"
                  placeholder="Provide clarity and context for execution..."
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all appearance-none"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all appearance-none"
                >
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Finance">Finance</option>
                  <option value="Health">Health</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="pt-6 border-t border-slate-100 flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
