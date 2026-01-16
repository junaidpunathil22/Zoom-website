import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, Search, Key, User, Trash2, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';

const TenantManager = () => {
    const { data, actions } = useAuth();
    const [showAddModal, setShowAddModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTenantId, setCurrentTenantId] = useState(null);
    const [newTenant, setNewTenant] = useState({ name: '', username: '', building: '', apartment: '', email: '' });
    const [generatedPassword, setGeneratedPassword] = useState('');

    const handleAddTenant = async (e) => {
        e.preventDefault();
        if (isEditing) {
            await actions.updateTenant(currentTenantId, newTenant);
            closeModal();
        } else {
            const password = Math.random().toString(36).slice(-8);
            const result = await actions.addTenant({ ...newTenant, password });
            if (result.success) {
                setGeneratedPassword(password);
                setShowAddModal(false);
                alert(`Tenant Created!\nUsername: ${newTenant.username}\nPassword: ${password}`);
                setNewTenant({ name: '', username: '', building: '', apartment: '', email: '' });
            } else {
                alert(`Failed: ${result.message}`);
            }
        }
    };

    const openAddModal = () => {
        setIsEditing(false);
        setGeneratedPassword('');
        setNewTenant({ name: '', username: '', building: '', apartment: '', email: '' });
        setShowAddModal(true);
    };

    const openEditModal = (tenant) => {
        setIsEditing(true);
        setCurrentTenantId(tenant.id);
        setNewTenant({ name: tenant.name, username: tenant.username, building: tenant.building, apartment: tenant.apartment, email: tenant.email });
        setShowAddModal(true);
    };

    const closeModal = () => {
        setShowAddModal(false);
        setNewTenant({ name: '', username: '', building: '', apartment: '', email: '' });
        setIsEditing(false);
        setCurrentTenantId(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center justify-center mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Tenant Management</h1>
                <p className="text-text-muted mb-6">Manage all tenants and their credentials.</p>
                <button
                    onClick={openAddModal}
                    className="btn btn-primary shadow-lg hover:shadow-primary/20"
                >
                    <Plus size={18} /> Add Tenant
                </button>
            </div>

            {/* Tenant List */}
            <div className="grid gap-4">
                {data.tenants.map((tenant) => (
                    <motion.div
                        key={tenant.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-surface/30 border border-glass-border flex justify-between items-center hover:bg-surface/50 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <User size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">{tenant.name}</h3>
                                <p className="text-sm text-text-muted">@{tenant.username} • {tenant.building} - Apt {tenant.apartment}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right mr-4 hidden sm:block">
                                <p className="text-xs text-text-muted uppercase">Password</p>
                                <p className="text-sm font-mono text-white tracking-wider">{tenant.password}</p>
                            </div>
                            <button
                                className="p-2 hover:bg-white/10 rounded-lg text-text-muted hover:text-white"
                                title="Reset Password"
                                onClick={() => {
                                    const newPass = prompt("Enter new password for " + tenant.name);
                                    if (newPass) actions.resetTenantPassword(tenant.username, newPass);
                                }}
                            >
                                <Key size={18} />
                            </button>
                            <button
                                onClick={() => openEditModal(tenant)}
                                className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                                title="Edit Tenant"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button
                                className="p-2 hover:bg-danger/20 rounded-lg text-danger hover:text-danger border border-transparent hover:border-danger/30 transition-colors"
                                title="Remove Tenant"
                                onClick={() => {
                                    if (confirm(`Are you sure you want to remove tenant ${tenant.name}?`)) {
                                        actions.removeTenant(tenant.id);
                                    }
                                }}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </motion.div>
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
                        <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Tenant Details' : 'Add New Tenant'}</h2>
                        <form onSubmit={handleAddTenant} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-text-muted block mb-1">Full Name</label>
                                    <input required className="glass-input" value={newTenant.name} onChange={e => setNewTenant({ ...newTenant, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-sm text-text-muted block mb-1">Username</label>
                                    <input required className="glass-input" value={newTenant.username} onChange={e => setNewTenant({ ...newTenant, username: e.target.value })} disabled={isEditing} />
                                </div>
                                <div>
                                    <label className="text-sm text-text-muted block mb-1">Building</label>
                                    <input required className="glass-input" value={newTenant.building} onChange={e => setNewTenant({ ...newTenant, building: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-sm text-text-muted block mb-1">Apartment</label>
                                    <input required className="glass-input" value={newTenant.apartment} onChange={e => setNewTenant({ ...newTenant, apartment: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-text-muted block mb-1">Email (Optional)</label>
                                <input type="email" className="glass-input" value={newTenant.email} onChange={e => setNewTenant({ ...newTenant, email: e.target.value })} />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={closeModal} className="btn btn-secondary">Cancel</button>
                                <button type="submit" className="btn btn-primary">{isEditing ? 'Save Changes' : 'Create Tenant'}</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default TenantManager;
