import { useAuth } from '../../context/AuthContext';
import { Users, Briefcase, Wrench, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const { data } = useAuth();

    const StatCard = ({ icon: Icon, label, value, color }) => (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-surface/30 border border-glass-border flex items-center gap-4"
        >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color} bg-opacity-20 text-white`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-text-muted text-sm">{label}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </motion.div>
    );

    const pendingSalary = data.staff.filter(s => !s.paid).reduce((acc, curr) => acc + curr.salary, 0);

    return (
        <div className="space-y-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Welcome to Zoom <br />Realestate</h1>
                <p className="text-text-muted text-lg">Here's what's happening at ZOOM Real Estate today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={Users} label="Total Tenants" value={data.tenants.length} color="bg-primary" />
                <StatCard icon={Briefcase} label="Total Staff" value={data.staff.length} color="bg-secondary" />
                <StatCard icon={Wrench} label="Active Complaints" value={data.complaints.filter(c => c.status === 'pending').length} color="bg-warning" />
                <StatCard icon={DollarSign} label="Pending Payroll" value={`$${pendingSalary}`} color="bg-danger" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                    <h3 className="font-bold mb-4">Recent Activity</h3>
                    <p className="text-text-muted text-sm italic">No recent activity log implemented in this demo.</p>
                </div>
                <div className="glass-card p-6">
                    <h3 className="font-bold mb-4">System Status</h3>
                    <div className="flex items-center gap-2 text-success">
                        <div className="w-2 h-2 rounded-full bg-success"></div>
                        <span className="text-sm">All Systems Operational</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
