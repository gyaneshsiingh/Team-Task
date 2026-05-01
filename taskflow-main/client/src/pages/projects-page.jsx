import React, { useState, useEffect } from 'react';
import { Plus, Folder, Users, Trash2, Edit, X, UserPlus, CheckCircle, AlertCircle, ArrowLeft, Briefcase, Crown, User } from 'lucide-react';
import api from '@/lib/api';

const token = () => localStorage.getItem('token');
const cfg = () => ({ headers: { Authorization: `Bearer ${token()}` } });

function Notify({ notifications }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map(n => (
        <div key={n.id} className={`px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium ${n.type === 'success' ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}`}>
          {n.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          {n.message}
        </div>
      ))}
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null); // selected project detail
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', color: '#8b5cf6' });
  const [memberEmail, setMemberEmail] = useState('');
  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'medium', dueDate: '', assignedTo: '' });
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const notify = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(p => [...p, { id, message, type }]);
    setTimeout(() => setNotifications(p => p.filter(n => n.id !== id)), 3000);
  };

  useEffect(() => {
    if (!token()) { window.location.href = '/login'; return; }
    api.get('/auth/profile', cfg()).then(r => setCurrentUser(r.data.data.user)).catch(() => {});
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    api.get('/projects', cfg()).then(r => setProjects(r.data.data.projects)).catch(() => notify('Failed to load projects', 'error'));
  };

  const fetchTasks = (projectId) => {
    api.get(`/projects/${projectId}/tasks`, cfg()).then(r => setTasks(r.data.data.tasks)).catch(() => {});
  };

  const selectProject = (p) => { setSelected(p); fetchTasks(p._id); };

  const createProject = () => {
    if (!form.name.trim()) return notify('Project name required', 'error');
    setLoading(true);
    api.post('/projects', form, cfg())
      .then(r => { setProjects(p => [...p, r.data.data.project]); setShowCreate(false); setForm({ name: '', description: '', color: '#8b5cf6' }); notify('Project created!'); })
      .catch(e => notify(e?.response?.data?.message || 'Error', 'error'))
      .finally(() => setLoading(false));
  };

  const deleteProject = (id) => {
    api.delete(`/projects/${id}`, cfg())
      .then(() => { setProjects(p => p.filter(x => x._id !== id)); if (selected?._id === id) setSelected(null); notify('Project archived'); })
      .catch(e => notify(e?.response?.data?.message || 'Error', 'error'));
  };

  const addMember = () => {
    if (!memberEmail.trim()) return notify('Email required', 'error');
    api.post(`/projects/${selected._id}/members`, { email: memberEmail, role: 'member' }, cfg())
      .then(r => { setSelected(r.data.data.project); setMemberEmail(''); setShowAddMember(false); notify('Member added!'); })
      .catch(e => notify(e?.response?.data?.message || 'Error', 'error'));
  };

  const removeMember = (memberId) => {
    api.delete(`/projects/${selected._id}/members/${memberId}`, cfg())
      .then(r => { setSelected(r.data.data.project); notify('Member removed'); })
      .catch(e => notify(e?.response?.data?.message || 'Error', 'error'));
  };

  const updateRole = (memberId, role) => {
    api.patch(`/projects/${selected._id}/members/${memberId}/role`, { role }, cfg())
      .then(r => { setSelected(r.data.data.project); notify('Role updated!'); })
      .catch(e => notify(e?.response?.data?.message || 'Error', 'error'));
  };

  const addTask = () => {
    if (!taskForm.title.trim()) return notify('Title required', 'error');
    if (!taskForm.description || taskForm.description.length < 10) return notify('Description must be ≥10 chars', 'error');
    const assignedTo = taskForm.assignedTo || currentUser?._id;
    api.post('/todos', { ...taskForm, projectId: selected._id, assignedTo }, cfg())
      .then(r => { setTasks(p => [r.data.data.todo, ...p]); setShowAddTask(false); setTaskForm({ title: '', description: '', priority: 'medium', dueDate: '', assignedTo: '' }); notify('Task created!'); })
      .catch(e => notify(e?.response?.data?.message || 'Error', 'error'));
  };

  const updateTaskStatus = (taskId, status) => {
    api.patch(`/todos/${taskId}/status`, { status }, cfg())
      .then(r => setTasks(p => p.map(t => t._id === taskId ? r.data.data.todo : t)))
      .catch(e => notify(e?.response?.data?.message || 'Error', 'error'));
  };

  const deleteTask = (taskId) => {
    api.delete(`/todos/${taskId}`, cfg())
      .then(() => { setTasks(p => p.filter(t => t._id !== taskId)); notify('Task deleted'); })
      .catch(e => notify(e?.response?.data?.message || 'Error', 'error'));
  };

  const isAdmin = (project) => project?.members?.find(m => m.user?._id === currentUser?._id || m.user === currentUser?._id)?.role === 'admin';

  const statusCols = ['todo', 'in-progress', 'done'];
  const statusLabel = { 'todo': 'To Do', 'in-progress': 'In Progress', 'done': 'Done' };
  const statusColor = { 'todo': 'border-slate-500', 'in-progress': 'border-amber-500', 'done': 'border-emerald-500' };

  const inputCls = "w-full px-4 py-2.5 rounded-xl bg-[#1a0f2e] border border-blue-800/40 text-white placeholder-violet-400/50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm";

  return (
    <div className="min-h-screen pt-16" style={{ background: 'hsl(220,20%,6%)' }}>
      <Notify notifications={notifications} />

      {!selected ? (
        /* ── Project List ── */
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Projects</h1>
              <p className="text-blue-400 mt-1">Manage your team projects</p>
            </div>
            <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm shadow-lg transition-all">
              <Plus size={16} /> New Project
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-24">
              <Briefcase size={56} className="mx-auto text-blue-800 mb-4" />
              <p className="text-blue-300 text-lg font-medium">No projects yet</p>
              <p className="text-blue-500 text-sm mt-1">Create your first project to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map(p => (
                <div key={p._id} onClick={() => selectProject(p)} className="cursor-pointer rounded-2xl border border-blue-800/30 hover:border-blue-600/60 transition-all hover:shadow-xl hover:shadow-violet-900/30 hover:scale-[1.02]" style={{ background: 'hsl(220,18%,9%)' }}>
                  <div className="h-2 rounded-t-2xl" style={{ background: p.color || '#8b5cf6' }} />
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <h3 className="text-white font-semibold text-lg leading-tight">{p.name}</h3>
                      {isAdmin(p) && (
                        <button onClick={e => { e.stopPropagation(); deleteProject(p._id); }} className="p-1.5 text-blue-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    {p.description && <p className="text-blue-400 text-sm mt-1.5 line-clamp-2">{p.description}</p>}
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-blue-800/20">
                      <div className="flex items-center gap-1.5 text-blue-400 text-xs">
                        <Users size={13} /> {p.members?.length || 0} members
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-700/30">
                        {isAdmin(p) ? 'Admin' : 'Member'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ── Project Detail ── */
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-blue-400 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft size={15} /> Back to Projects
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: selected.color || '#8b5cf6' }}>
                <Folder size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{selected.name}</h1>
                {selected.description && <p className="text-blue-400 text-sm">{selected.description}</p>}
              </div>
            </div>
            <div className="flex gap-2">
              {isAdmin(selected) && (
                <button onClick={() => setShowAddMember(true)} className="flex items-center gap-2 px-4 py-2 border border-blue-700/50 text-blue-300 hover:bg-blue-900/30 rounded-xl text-sm transition-all">
                  <UserPlus size={14} /> Add Member
                </button>
              )}
              <button onClick={() => setShowAddTask(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg">
                <Plus size={14} /> Add Task
              </button>
            </div>
          </div>

          {/* Members Strip */}
          <div className="rounded-2xl border border-blue-800/30 p-4 mb-6" style={{ background: 'hsl(220,18%,9%)' }}>
            <h3 className="text-sm font-semibold text-blue-300 mb-3 flex items-center gap-2"><Users size={14} /> Team Members</h3>
            <div className="flex flex-wrap gap-3">
              {selected.members?.map(m => {
                const u = m.user;
                const uid = u?._id || u;
                const isOwner = selected.owner?._id === uid || selected.owner === uid;
                return (
                  <div key={uid} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-900/30 border border-blue-700/30">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                      {isOwner ? <Crown size={11} className="text-yellow-300" /> : <User size={11} className="text-white" />}
                    </div>
                    <span className="text-white text-sm">{u?.name || 'User'}</span>
                    <span className="text-xs text-blue-400">{m.role}</span>
                    {isAdmin(selected) && !isOwner && uid !== currentUser?._id && (
                      <div className="flex items-center gap-1 ml-1">
                        <button onClick={() => updateRole(uid, m.role === 'admin' ? 'member' : 'admin')} className="text-xs text-blue-400 hover:text-blue-200 transition-colors px-1.5 py-0.5 rounded bg-blue-800/40">
                          {m.role === 'admin' ? '→ member' : '→ admin'}
                        </button>
                        <button onClick={() => removeMember(uid)} className="text-red-400 hover:text-red-300 transition-colors">
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kanban Board */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {statusCols.map(col => {
              const colTasks = tasks.filter(t => (t.status || (t.completed ? 'done' : 'todo')) === col);
              return (
                <div key={col} className={`rounded-2xl border-t-2 ${statusColor[col]} border-x border-b border-blue-800/25 overflow-hidden`} style={{ background: 'hsl(220,18%,9%)' }}>
                  <div className="px-4 py-3 flex items-center justify-between border-b border-blue-800/20">
                    <h3 className="font-semibold text-white text-sm">{statusLabel[col]}</h3>
                    <span className="text-xs text-blue-400 bg-blue-900/40 px-2 py-0.5 rounded-full">{colTasks.length}</span>
                  </div>
                  <div className="p-3 space-y-3 min-h-[200px]">
                    {colTasks.map(t => (
                      <div key={t._id} className="rounded-xl p-3 border border-blue-800/20 hover:border-blue-600/40 transition-all" style={{ background: 'hsl(220,20%,12%)' }}>
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-medium ${t.completed ? 'line-through text-blue-500' : 'text-white'}`}>{t.title}</p>
                          <button onClick={() => deleteTask(t._id)} className="text-blue-600 hover:text-red-400 transition-colors flex-shrink-0">
                            <Trash2 size={12} />
                          </button>
                        </div>
                        {t.description && <p className="text-xs text-blue-400 mt-1 line-clamp-2">{t.description}</p>}
                        <div className="flex items-center justify-between mt-2.5 flex-wrap gap-1">
                          <div className="flex items-center gap-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.priority === 'high' ? 'bg-red-900/50 text-red-300 border border-red-700/30' : t.priority === 'medium' ? 'bg-amber-900/50 text-amber-300 border border-amber-700/30' : 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/30'}`}>
                              {t.priority}
                            </span>
                            {t.assignedTo?.name && (
                              <span className="text-xs text-blue-400">@{t.assignedTo.name.split(' ')[0]}</span>
                            )}
                          </div>
                          <select value={t.status || (t.completed ? 'done' : 'todo')} onChange={e => updateTaskStatus(t._id, e.target.value)} onClick={e => e.stopPropagation()}
                            className="text-xs bg-blue-900/40 border border-blue-700/40 text-blue-300 rounded-lg px-1.5 py-0.5 focus:outline-none cursor-pointer">
                            <option value="todo">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="done">Done</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowCreate(false)}>
          <div className="w-full max-w-md rounded-2xl border border-blue-700/40 shadow-2xl" style={{ background: 'hsl(220,18%,8%)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-blue-800/30">
              <h2 className="text-white font-bold text-lg">New Project</h2>
              <button onClick={() => setShowCreate(false)} className="text-blue-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Project name *" className={inputCls} />
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description (optional)" rows={3} className={inputCls + ' resize-none'} />
              <div>
                <label className="text-blue-300 text-sm mb-2 block">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {['#8b5cf6','#6366f1','#ec4899','#f97316','#10b981','#3b82f6','#f59e0b','#ef4444'].map(c => (
                    <button key={c} onClick={() => setForm({ ...form, color: c })} className={`w-8 h-8 rounded-lg transition-all ${form.color === c ? 'ring-2 ring-white scale-110' : ''}`} style={{ background: c }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-blue-800/30 flex gap-3">
              <button onClick={createProject} disabled={loading} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-all shadow-lg">
                {loading ? 'Creating...' : 'Create Project'}
              </button>
              <button onClick={() => setShowCreate(false)} className="px-5 py-2.5 border border-blue-700/50 text-blue-300 rounded-xl text-sm hover:bg-blue-900/30 transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowAddMember(false)}>
          <div className="w-full max-w-sm rounded-2xl border border-blue-700/40 shadow-2xl" style={{ background: 'hsl(220,18%,8%)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-blue-800/30">
              <h2 className="text-white font-bold text-lg">Add Team Member</h2>
              <button onClick={() => setShowAddMember(false)} className="text-blue-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <input value={memberEmail} onChange={e => setMemberEmail(e.target.value)} placeholder="Member's email address" type="email" className={inputCls} />
              <p className="text-blue-400 text-xs">The user must already have an account on TaskFlow.</p>
            </div>
            <div className="px-6 py-4 border-t border-blue-800/30 flex gap-3">
              <button onClick={addMember} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-all">Add Member</button>
              <button onClick={() => setShowAddMember(false)} className="px-5 py-2.5 border border-blue-700/50 text-blue-300 rounded-xl text-sm hover:bg-blue-900/30 transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTask && selected && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowAddTask(false)}>
          <div className="w-full max-w-md rounded-2xl border border-blue-700/40 shadow-2xl" style={{ background: 'hsl(220,18%,8%)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-blue-800/30">
              <h2 className="text-white font-bold text-lg">Add Task</h2>
              <button onClick={() => setShowAddTask(false)} className="text-blue-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <input value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} placeholder="Task title *" className={inputCls} />
              <textarea value={taskForm.description} onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} placeholder="Description (min 10 chars) *" rows={3} className={inputCls + ' resize-none'} />
              <div className="grid grid-cols-2 gap-3">
                <select value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })} className={inputCls}>
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <input type="date" value={taskForm.dueDate} onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })} min={new Date().toISOString().split('T')[0]} className={inputCls} />
              </div>
              <select value={taskForm.assignedTo} onChange={e => setTaskForm({ ...taskForm, assignedTo: e.target.value })} className={inputCls}>
                <option value="">Assign to (yourself by default)</option>
                {selected.members?.map(m => {
                  const u = m.user;
                  return <option key={u?._id || u} value={u?._id || u}>{u?.name || u?.email || 'Member'}</option>;
                })}
              </select>
            </div>
            <div className="px-6 py-4 border-t border-blue-800/30 flex gap-3">
              <button onClick={addTask} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-all shadow-lg">Create Task</button>
              <button onClick={() => setShowAddTask(false)} className="px-5 py-2.5 border border-blue-700/50 text-blue-300 rounded-xl text-sm hover:bg-blue-900/30 transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
