import { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_DATA } from '../data/mockData';
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // { username, role, ...details }
    const [data, setData] = useState(() => {
        const saved = localStorage.getItem('zoom_data');
        return saved ? JSON.parse(saved) : INITIAL_DATA;
    });
    // Persist data changes
    useEffect(() => {
        localStorage.setItem('zoom_data', JSON.stringify(data));
    }, [data]);
    // Check for active session
    useEffect(() => {
        const session = localStorage.getItem('zoom_user');
        if (session) {
            setUser(JSON.parse(session));
        }
    }, []);
    const login = (username, password, type) => {
        if (type === 'admin') {
            if (username === data.admin.username && password === data.admin.password) {
                const adminUser = { username, role: 'admin' };
                setUser(adminUser);
                localStorage.setItem('zoom_user', JSON.stringify(adminUser));
                return { success: true };
            }
        } else {
            const tenant = data.tenants.find(t => t.username === username && t.password === password);
            if (tenant) {
                const tenantUser = { ...tenant, role: 'tenant' };
                setUser(tenantUser);
                localStorage.setItem('zoom_user', JSON.stringify(tenantUser));
                return { success: true };
            }
        }
        return { success: false, message: 'Invalid credentials' };
    };
    const logout = () => {
        setUser(null);
        localStorage.removeItem('zoom_user');
    };
    // --- Data Management Actions ---
    const resetTenantPassword = (username, newPassword) => {
        setData(prev => {
            const updatedTenants = prev.tenants.map(t =>
                t.username === username ? { ...t, password: newPassword } : t
            );
            return { ...prev, tenants: updatedTenants };
        });
    };
    const addTenant = (tenant) => {
        const newTenant = { ...tenant, id: Date.now() };
        setData(prev => ({
            ...prev,
            tenants: [...prev.tenants, newTenant]
        }));
    };
    const removeTenant = (id) => {
        setData(prev => ({
            ...prev,
            tenants: prev.tenants.filter(t => t.id !== id)
        }));
    };
    const updateTenant = (id, updatedDetails) => {
        setData(prev => ({
            ...prev,
            tenants: prev.tenants.map(t => t.id === id ? { ...t, ...updatedDetails } : t)
        }));
    };
    const addStaff = (staffMember) => {
        const newStaff = { ...staffMember, id: Date.now(), paid: false };
        setData(prev => ({
            ...prev,
            staff: [...prev.staff, newStaff]
        }));
    };
    const removeStaff = (id) => {
        setData(prev => ({
            ...prev,
            staff: prev.staff.filter(s => s.id !== id)
        }));
    };
    const updateStaff = (id, updatedDetails) => {
        setData(prev => ({
            ...prev,
            staff: prev.staff.map(s => s.id === id ? { ...s, ...updatedDetails } : s)
        }));
    };
    const toggleSalaryPayment = (staffId) => {
        setData(prev => ({
            ...prev,
            staff: prev.staff.map(s => s.id === staffId ? { ...s, paid: !s.paid } : s)
        }));
    };
    const addComplaint = (complaint) => {
        const newComplaint = {
            ...complaint,
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            status: 'pending'
        };
        setData(prev => ({
            ...prev,
            complaints: [newComplaint, ...prev.complaints] // Newest first
        }));
    };

    const updateComplaintStatus = (id, newStatus) => {
        setData(prev => ({
            ...prev,
            complaints: prev.complaints.map(c => c.id === id ? { ...c, status: newStatus } : c)
        }));
    };

    return (
        <AuthContext.Provider value={{
            user,
            data,
            login,
            logout,
            actions: {
                resetTenantPassword,
                addTenant,
                removeTenant,
                updateTenant,
                addStaff,
                removeStaff,
                updateStaff,
                toggleSalaryPayment,
                addComplaint,
                updateComplaintStatus
            }
        }}>
            {children}
        </AuthContext.Provider>
    );
};

