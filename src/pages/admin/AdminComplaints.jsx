import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

const AdminComplaints = () => {
    const { data, actions } = useAuth();

    // Sort: Pending first, then by date
    const sortedComplaints = [...data.complaints].sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return new Date(b.date) - new Date(a.date);
    });

    const getTenantName = (id) => {
        const tenant = data.tenants.find(t => t.id === id);
        return tenant ? tenant.name : 'Unknown Tenant';
    };

    const statusColors = {
        pending: 'text-warning border-warning/50 bg-warning/10',
        inprogress: 'text-primary border-primary/50 bg-primary/10',
        resolved: 'text-success border-success/50 bg-success/10'
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center justify-center mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Complaint Management</h1>
                <p className="text-text-muted mb-6">Track and resolve maintenance issues reported by tenants.</p>
            </div>

            <div className="grid gap-4 max-w-4xl mx-auto">
                {sortedComplaints.length === 0 ? (
                    <div className="text-center py-12 text-text-muted">
                        <CheckCircle size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No complaints found. Good job!</p>
                    </div>
                ) : (
                    sortedComplaints.map((complaint) => (
                        <motion.div
                            key={complaint.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-6 flex flex-col md:flex-row gap-6 md:items-center justify-between"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-bold text-lg text-white">{complaint.type} Issue</h3>
                                    <span className="text-xs text-text-muted px-2 py-1 rounded-full bg-surface border border-glass-border">
                                        {complaint.date}
                                    </span>
                                </div>
                                <p className="text-text-muted mb-3">{complaint.description}</p>
                                <div className="flex items-center gap-2 text-sm text-primary">
                                    <span className="font-semibold">{getTenantName(complaint.tenantId)}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 min-w-[200px]">
                                <p className="text-xs text-text-muted mb-1 ml-1">Update Status:</p>
                                <div className="flex gap-2">
                                    <select
                                        value={complaint.status}
                                        onChange={(e) => actions.updateComplaintStatus(complaint.id, e.target.value)}
                                        className={`glass-input appearance-none cursor-pointer font-medium ${statusColors[complaint.status || 'pending']}`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="inprogress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminComplaints;
