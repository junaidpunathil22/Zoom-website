import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, DollarSign, CheckCircle, XCircle, Trash2, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
const StaffManager = () => {
    const { data, actions } = useAuth();
    const [showAddModal, setShowAddModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentStaffId, setCurrentStaffId] = useState(null);
    const [newStaff, setNewStaff] = useState({ name: '', role: 'cleaner', building: '', salary: '' });

    const handleAddStaff = (e) => {
        e.preventDefault();
        if (isEditing) {
            actions.updateStaff(currentStaffId, { ...newStaff, salary: Number(newStaff.salary) });
        } else {
            actions.addStaff({ ...newStaff, salary: Number(newStaff.salary) });
        }
        closeModal();
    };

    const openAddModal = () => {
        setIsEditing(false);
        setNewStaff({ name: '', role: 'cleaner', building: '', salary: '' });
        setShowAddModal(true);
    };

    const openEditModal = (staff) => {
        setIsEditing(true);
        setCurrentStaffId(staff.id);
        setNewStaff({ name: staff.name, role: staff.role, building: staff.building, salary: staff.salary });
        setShowAddModal(true);
    };

    const closeModal = () => {
        setShowAddModal(false);
        setNewStaff({ name: '', role: 'cleaner', building: '', salary: '' });
        setIsEditing(false);
        setCurrentStaffId(null);
    };
    const StaffCard = ({ staff }) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 rounded-xl bg-surface/30 border border-glass-border flex flex-col justify-between"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-semibold text-lg text-white">{staff.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full border ${staff.role === 'driver' ? 'bg-accent/20 border-accent/50 text-accent' : 'bg-secondary/20 border-secondary/50 text-secondary'
                        }`}>
                        {staff.role.toUpperCase()}
                    </span>
                </div>
                <div className="text-right">
                    <p className="text-text-muted text-xs">Salary</p>
                    <p className="font-bold text-white">${staff.salary}</p>
                </div>
            </div>
            <div className="mb-4">
                <p className="text-sm text-text-muted">Assigned to:</p>
                <p className="text-white">{staff.building}</p>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => actions.toggleSalaryPayment(staff.id)}
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 font-medium transition-all ${staff.paid
                        ? 'bg-success/20 text-success border border-success/30'
                        : 'bg-surface hover:bg-white/10 text-text-muted border border-glass-border'
                        }`}
                >
                    {staff.paid ? (
                        <>
                            <CheckCircle size={18} /> Paid
                        </>
                    ) : (
                        <>
                            <DollarSign size={18} /> Pay Salary
                        </>
                    )}
                </button>
                <button
                    onClick={() => openEditModal(staff)}
                    className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                    title="Edit Staff"
                >
                    <Edit2 size={18} />
                </button>
                <button
                    onClick={() => {
                        if (confirm('Are you sure you want to remove this staff member?')) {
                            actions.removeStaff(staff.id);
                        }
                    }}
                    className="p-2 rounded-lg bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20 transition-colors"
                    title="Remove Staff"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </motion.div>
    );
    return (
        <div>
            <div className="flex flex-col items-center justify-center mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Staff & Payroll</h1>
                <p className="text-text-muted mb-6 max-w-2xl">Manage cleaners, drivers, and process salaries efficiently.</p>
                <button
                    onClick={openAddModal}
                    className="btn btn-primary shadow-lg hover:shadow-primary/20"
                >
                    <Plus size={18} /> Add Staff
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                {data.staff.map(staff => (
                    <div key={staff.id} className="w-full">
                        <StaffCard staff={staff} />
                    </div>
                ))}
            </div>
            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card w-full max-w-lg p-6"
                    >
                        <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Staff Details' : 'Add New Staff'}</h2>
                        <form onSubmit={handleAddStaff} className="space-y-4">
                            <div>
                                <label className="text-sm text-text-muted block mb-1">Full Name</label>
                                <input required className="glass-input" value={newStaff.name} onChange={e => setNewStaff({ ...newStaff, name: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-text-muted block mb-1">Role</label>
                                    <select className="glass-input" value={newStaff.role} onChange={e => setNewStaff({ ...newStaff, role: e.target.value })}>
                                        <option value="cleaner">Cleaner</option>
                                        <option value="driver">Driver</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm text-text-muted block mb-1">Salary ($)</label>
                                    <input required type="number" className="glass-input" value={newStaff.salary} onChange={e => setNewStaff({ ...newStaff, salary: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-text-muted block mb-1">Assigned Building(s)</label>
                                <input required className="glass-input" value={newStaff.building} onChange={e => setNewStaff({ ...newStaff, building: e.target.value })} placeholder="e.g. Building A or 'All'" />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={closeModal} className="btn btn-secondary">Cancel</button>
                                <button type="submit" className="btn btn-primary">{isEditing ? 'Save Changes' : 'Add Staff'}</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};
export default StaffManager;

