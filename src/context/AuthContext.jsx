import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('zoom_user')) || null);
    const [data, setData] = useState({
        tenants: [],
        staff: [],
        complaints: []
    });
    const navigate = useNavigate();
    const API_URL = 'http://localhost:5000/api';

    // Fetch Data on Load (if admin) or periodically
    const fetchData = async () => {
        try {
            const [tenantsRes, staffRes, complaintsRes] = await Promise.all([
                fetch(`${API_URL}/tenants`),
                fetch(`${API_URL}/staff`),
                fetch(`${API_URL}/complaints`)
            ]);

            const tenants = await tenantsRes.json();
            const staff = await staffRes.json();
            const complaints = await complaintsRes.json();

            // Transform _id to id for frontend compatibility
            const format = (list) => Array.isArray(list) ? list.map(item => ({ ...item, id: item._id })) : [];

            setData({
                tenants: format(tenants),
                staff: format(staff),
                complaints: format(complaints)
            });
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const login = async (username, password, type) => {
        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, type })
            });
            const result = await res.json();

            if (result.success) {
                setUser(result.user);
                localStorage.setItem('zoom_user', JSON.stringify(result.user));
                fetchData(); // Refresh data after login
                return true;
            }
            return false;
        } catch (error) {
            console.error("Login failed:", error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('zoom_user');
        navigate('/');
    };

    // --- Actions ---

    const addTenant = async (tenant) => {
        await fetch(`${API_URL}/tenants`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tenant)
        });
        fetchData();
    };

    const removeTenant = async (id) => {
        await fetch(`${API_URL}/tenants/${id}`, { method: 'DELETE' });
        fetchData();
    };

    const updateTenant = async (id, updates) => {
        await fetch(`${API_URL}/tenants/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        fetchData();
    };

    const resetTenantPassword = async (username, newPassword) => {
        // Need to find ID first (frontend has it)
        const tenant = data.tenants.find(t => t.username === username);
        if (tenant) {
            await updateTenant(tenant.id, { password: newPassword });
        }
    };

    const addStaff = async (staff) => {
        await fetch(`${API_URL}/staff`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(staff)
        });
        fetchData();
    };

    const removeStaff = async (id) => {
        await fetch(`${API_URL}/staff/${id}`, { method: 'DELETE' });
        fetchData();
    };

    const updateStaff = async (id, updates) => {
        await fetch(`${API_URL}/staff/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        fetchData();
    };

    const toggleSalaryPayment = async (id) => {
        const staffMember = data.staff.find(s => s.id === id);
        if (staffMember) {
            await updateStaff(id, { paid: !staffMember.paid });
        }
    };

    const addComplaint = async (complaint) => {
        await fetch(`${API_URL}/complaints`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...complaint,
                date: new Date().toISOString().split('T')[0],
                status: 'pending'
            })
        });
        fetchData();
    };

    const updateComplaintStatus = async (id, newStatus) => {
        await fetch(`${API_URL}/complaints/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        fetchData();
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

export const useAuth = () => useContext(AuthContext);
