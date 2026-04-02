import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, CheckSquare, Settings, LogOut, CodeSquare } from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { name: 'Tasks', path: '/dashboard', icon: CheckSquare },
    { name: 'Overview', path: '#', icon: LayoutDashboard },
    { name: 'Settings', path: '#', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-indigo-500/20 text-white flex flex-col hidden md:flex">
        <div className="p-6">
          <div className="flex items-center gap-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-fuchsia-400">
            <CodeSquare size={28} className="text-indigo-400" />
            ExecuteIt
          </div>
        </div>

        <nav className="flex-1 px-4 mt-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                location.pathname === item.path
                  ? 'bg-gradient-to-r from-indigo-500/20 to-fuchsia-500/10 text-indigo-300 shadow-sm border border-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 text-slate-300 mb-2 truncate">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center font-bold text-white shadow-md">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="truncate text-sm">
              <span className="block text-white font-medium truncate">{user?.email?.split('@')[0]}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-rose-400 hover:text-white hover:bg-rose-500/20 rounded-xl transition-all w-full"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-slate-50">
        {/* Subtle top decoration for dash */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-indigo-100 to-transparent opacity-50 z-0 pointer-events-none"></div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
