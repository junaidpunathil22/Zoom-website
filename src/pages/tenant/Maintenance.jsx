import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Maintenance = () => {
    const { user, data, actions } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [complaint, setComplaint] = useState({ type: 'Plumbing', description: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        actions.addComplaint({
            ...complaint,
            tenantId: user.id
        });
        setShowForm(false);
        setComplaint({ type: 'Plumbing', description: '' });
    };

    const myComplaints = data.complaints.filter(c => c.tenantId === user?.id);

    return (
        <div>
            <div className="flex flex-col items-center justify-center mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Maintenance Requests</h1>
                <p className="text-text-muted mb-6">Submit and track your building complaints.</p>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn btn-primary shadow-lg hover:shadow-primary/20"
                >
                    <Plus size={18} /> New Request
                </button>
            </div>

            <div className="space-y-4">
                {myComplaints.length === 0 ? (
                    <div className="text-center py-10 text-text-muted">
                        No maintenance requests found.
                    </div>
                ) : (
                    myComplaints.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-4 rounded-xl bg-surface/30 border border-glass-border hover:bg-surface/50 transition-colors"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className={`text-xs px-2 py-1 rounded-full border mb-2 inline-block ${item.status === 'pending' ? 'bg-warning/20 border-warning/50 text-warning' : 'bg-success/20 border-success/50 text-success'
                                        }`}>
                                        {item.status.toUpperCase()}
                                    </span>
                                    <h3 className="font-semibold text-white">{item.type} Issue</h3>
                                    <p className="text-text-muted text-sm mt-1">{item.description}</p>
                                </div>
                                <div className="text-right text-xs text-text-muted">
                                    {item.date}
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card w-full max-w-lg p-6"
                    >
                        <h2 className="text-xl font-bold mb-4">Submit Complaint</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm text-text-muted block mb-1">Issue Type</label>
                                <select
                                    className="glass-input"
                                    value={complaint.type}
                                    onChange={e => setComplaint({ ...complaint, type: e.target.value })}
                                >
                                    <option>Plumbing</option>
                                    <option>Electrical</option>
                                    <option>Appliance</option>
                                    <option>Structural</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm text-text-muted block mb-1">Description</label>
                                <textarea
                                    required
                                    className="glass-input min-h-[100px]"
                                    value={complaint.description}
                                    onChange={e => setComplaint({ ...complaint, description: e.target.value })}
                                    placeholder="Please describe the issue in detail..."
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
                                <button type="submit" className="btn btn-primary">Submit Request</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Maintenance;
