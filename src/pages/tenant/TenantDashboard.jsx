import { useAuth } from '../../context/AuthContext';
import { Home, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const TenantDashboard = () => {
    const { user, data } = useAuth();
    const navigate = useNavigate();

    const myComplaints = data.complaints.filter(c => c.tenantId === user?.id);

    return (
        <div className="space-y-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Welcome Home, {user?.name.split(' ')[0]}</h1>
                <p className="text-text-muted text-lg">Building: {user?.building} • Apt: {user?.apartment}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-6 cursor-pointer group"
                    onClick={() => navigate('/tenant/maintenance')}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-full bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <Wrench size={24} />
                        </div>
                        <h3 className="text-xl font-bold">Maintenance Requests</h3>
                    </div>
                    <p className="text-text-muted mb-4">Report issues with plumbing, electrical, or general building problems.</p>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{myComplaints.filter(c => c.status === 'pending').length}</span>
                        <span className="text-sm text-text-muted">Active Request(s)</span>
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-6 cursor-pointer group"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-full bg-secondary/20 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                            <Home size={24} />
                        </div>
                        <h3 className="text-xl font-bold">Rental Info (Mock)</h3>
                    </div>
                    <p className="text-text-muted mb-4">View your lease agreement and payment history.</p>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-success">Rent Paid</span>
                        <span className="text-xs text-text-muted">for current month</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TenantDashboard;
