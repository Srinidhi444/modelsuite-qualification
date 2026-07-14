import { useEffect, useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import TasksTable from '../../components/admin/TasksTable';
import CreateTaskModal from '../../components/admin/CreateTaskModal';
import EditTaskModal from '../../components/admin/EditTaskModal';
import { fetchAllTasks } from '../../api/tasks';


/* ── Search icon ── */
const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8.5" cy="8.5" r="5.5" />
    <path d="M17 17l-4-4" />
  </svg>
);


/* ── Plus icon ── */
const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M10 4v12M4 10h12" />
  </svg>
);


const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [limit, setLimit] = useState(10);


  const loadTasks = async (currentPage = page, currentLimit = limit) => {
    try {
      const { data } = await fetchAllTasks(currentPage, currentLimit);


      setTasks(data.tasks);
      setPage(data.page);
      setLimit(data.limit);
      setTotalPages(data.totalPages);
      setTotalTasks(data.totalTasks);
    } catch {
      alert('Failed to load tasks');
    }
  };


  // eslint-disable-next-line
  useEffect(() => {
    loadTasks(page, limit);
  }, [page, limit]);


  const stats = {
    total: totalTasks,
    open: tasks.filter((t) => t.status === 'Open').length,
    submitted: tasks.filter((t) => t.status === 'Submitted').length,
    approved: tasks.filter((t) => t.status === 'Approved').length,
  };


  const statCards = [
    { label: 'Total Tasks', value: stats.total, colorClass: 'stat-card-default', valueColor: '#E5E2E1' },
    { label: 'Open', value: stats.open, colorClass: 'stat-card-blue', valueColor: '#60A5FA' },
    { label: 'Submitted', value: stats.submitted, colorClass: 'stat-card-info', valueColor: '#60A5FA' },
    { label: 'Approved', value: stats.approved, colorClass: 'stat-card-green', valueColor: '#34D399' },
  ];


  /* Filter tasks */
  const filteredTasks = tasks.filter((t) => {
    const matchSearch = !search ||
      t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.assignedTo?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });


  return (
    <div className="flex min-h-screen" style={{ background: '#050505' }}>
      <Sidebar />


      <main className="ml-[240px] flex-1 px-8 py-8" style={{ maxWidth: 'calc(100vw - 240px)' }}>
        {/* Page header */}
        <div className="flex items-center justify-between mb-7 page-section">
          <div>
            <h1
              className="font-display text-[22px] font-semibold tracking-tight"
              style={{ color: '#F0F0F0', fontFamily: 'Poppins, sans-serif' }}
            >
              Task Management
            </h1>
            <p className="mt-0.5 text-[13px]" style={{ color: '#6B7280' }}>
              Create, assign, and track all tasks across your talent pool.
            </p>
          </div>


          <button
            onClick={() => setShowCreate(true)}
            className="btn-gradient flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13px] font-semibold cursor-pointer font-sans"
          >
            <IconPlus />
            Create Task
          </button>
        </div>


        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-4 mb-6 page-section">
          {statCards.map(({ label, value, colorClass, valueColor }) => (
            <div key={label} className={`stat-card ${colorClass}`}>
              <span
                className="block text-[10.5px] font-semibold uppercase tracking-[0.08em] mb-3"
                style={{ color: '#4B5563', fontFamily: 'Inter, sans-serif' }}
              >
                {label}
              </span>
              <span
                className="block text-[32px] font-bold leading-none"
                style={{ color: valueColor, fontFamily: 'Poppins, sans-serif' }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>


        {/* Tasks table */}
        <div className="tasks-container page-section">
          {/* Table toolbar */}
          <div className="table-header-bar">
            <div className="flex items-center gap-2">
              <h2
                className="text-[15px] font-semibold"
                style={{ color: '#E5E2E1', fontFamily: 'Poppins, sans-serif' }}
              >
                All Tasks
              </h2>
              <span
                className="text-[11px] px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: '#6B7280',
                  border: '1px solid rgba(255,255,255,0.09)',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
              </span>
            </div>


            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Search */}
              <div className="relative">
                <span
                  className="absolute left-2.5 top-1/2 -translate-y-1/2"
                  style={{ color: '#4B5563' }}
                >
                  <IconSearch />
                </span>
                <input
                  type="text"
                  placeholder="Search tasks…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-input-glass"
                  style={{ minWidth: '180px' }}
                />
              </div>


              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="search-input-glass custom-select"
                style={{ paddingLeft: '12px', cursor: 'pointer' }}
              >
                <option value="All">All Status</option>
                <option value="Open">Open</option>
                <option value="Claimed">Claimed</option>
                <option value="Submitted">Submitted</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>


          <TasksTable tasks={filteredTasks} onEdit={setEditTask} onRefresh={loadTasks} />

          {/* Pagination */}
          <div className="flex items-center justify-between mt-5 border-t border-white/10 pt-4">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <span
                className="text-[13px]"
                style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}
              >
                Showing{' '}
                <span style={{ color: '#E5E2E1' }}>
                  {totalTasks === 0 ? 0 : (page - 1) * limit + 1}
                </span>
                –
                <span style={{ color: '#E5E2E1' }}>
                  {Math.min(page * limit, totalTasks)}
                </span>{' '}
                of <span style={{ color: '#E5E2E1' }}>{totalTasks}</span> tasks
              </span>

              <div className="flex items-center gap-2">
                <span
                  className="text-[13px]"
                  style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}
                >
                  Rows
                </span>

                <select
                  value={limit}
                  onChange={(e) => {
                    setPage(1);
                    setLimit(Number(e.target.value));
                  }}
                  className="search-input-glass custom-select"
                  style={{
                    width: '78px',
                    paddingLeft: '10px',
                    cursor: 'pointer',
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-1.5">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-2.5 py-1.5 rounded-md border text-[12px] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:border-blue-500 hover:text-blue-400"
                style={{
                  borderColor: 'rgba(255,255,255,0.12)',
                  color: '#E5E2E1',
                }}
              >
                ← Previous
              </button>

              <div
                className="px-3 py-1.5 rounded-md text-[12px]"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#E5E2E1',
                  minWidth: '64px',
                  textAlign: 'center',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {page} / {totalPages}
              </div>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-2.5 py-1.5 rounded-md border text-[12px] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:border-blue-500 hover:text-blue-400"
                style={{
                  borderColor: 'rgba(255,255,255,0.12)',
                  color: '#E5E2E1',
                }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </main>


      {showCreate && (
        <CreateTaskModal onClose={() => setShowCreate(false)} onCreated={loadTasks} />
      )}
      {editTask && (
        <EditTaskModal
          task={editTask}
          onClose={() => setEditTask(null)}
          onUpdated={() => {
            loadTasks();
            setEditTask(null);
          }}
        />
      )}
    </div>
  );
};


export default AdminDashboard;