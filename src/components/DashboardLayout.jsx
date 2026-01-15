import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, Users, Briefcase, DollarSign, Wrench } from 'lucide-react';

const DashboardLayout = ({ children, role }) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const NavItem = ({ to, icon: Icon, label }) => {
        const isActive = location.pathname === to;
        return (
            <button
                onClick={() => navigate(to)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-2 ${isActive
                    ? role === 'admin' ? 'bg-secondary text-white shadow-lg' : 'bg-primary text-white shadow-lg'
                    : 'text-text-muted hover:bg-white/5 hover:text-white'
                    }`}
            >
                <Icon size={20} />
                <span className="font-medium">{label}</span>
            </button>
        );
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 glass-card m-4 mr-0 flex flex-col">
                <div className="p-6">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        WELCOME TO <br />ZOOM REALESTATE
                    </h2>
                    <p className="text-xs text-text-muted uppercase tracking-wider mt-1">
                        {role === 'admin' ? 'Admin Portal' : 'Tenant Portal'}
                    </p>
                </div>

                <nav className="flex-1 px-4 py-2">
                    {role === 'admin' ? (
                        <>
                            <NavItem to="/admin" icon={Home} label="HOME" />
                            <NavItem to="/admin/tenants" icon={Users} label="TENANTS" />
                            <NavItem to="/admin/staff" icon={Briefcase} label="STAFF &BUILDINGS" />
                            <NavItem to="/admin/complaints" icon={Wrench} label="COMPLAINTS" />
                        </>
                    ) : (
                        <>
                            <NavItem to="/tenant" icon={Home} label="My Home" />
                            <NavItem to="/tenant/maintenance" icon={Wrench} label="Maintenance" />
                        </>
                    )}
                </nav>

                <div className="p-4 mt-auto border-t border-glass-border">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${role === 'admin' ? 'bg-secondary' : 'bg-primary'
                            }`}>
                            {user?.username?.[0].toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">{user?.username}</p>
                            <p className="text-xs text-text-muted capitalize">{role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-danger hover:bg-danger/10 rounded-lg transition-colors text-sm"
                    >
                        <LogOut size={16} /> Sign Out or login page
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-4">
                <div className="h-full w-full max-w-6xl mx-auto glass-card overflow-auto p-8 relative">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
