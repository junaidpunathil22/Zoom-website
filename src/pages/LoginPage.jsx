import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Key } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const [role, setRole] = useState('tenant'); // 'tenant' | 'admin'
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // UX Helper: Check if user is trying to login as admin on tenant tab
        if (username.toLowerCase() === 'admin' && role === 'tenant') {
            setError("You are in the 'Tenant' tab. Please click 'Admin' tab above.");
            return;
        }

        try {
            const result = await login(username, password, role);
            if (result.success) {
                if (role === 'admin') navigate('/admin');
                else navigate('/tenant');
            } else {
                setError(result.message || 'Invalid username or password');
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card w-full max-w-md p-8 relative overflow-hidden"
            >
                {/* Decorator */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none"></div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-2">
                        ZOOM
                    </h1>
                    <p className="text-text-muted">Real Estate Management</p>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-surface/50 rounded-lg mb-8 relative">
                    <button
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all duration-300 ${role === 'tenant'
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-105'
                                : 'text-text-muted hover:text-white'
                            }`}
                        onClick={() => { setRole('tenant'); setError(''); }}
                    >
                        <User size={18} /> Tenant
                    </button>
                    <button
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all duration-300 ${role === 'admin'
                                ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg scale-105'
                                : 'text-text-muted hover:text-white'
                            }`}
                        onClick={() => { setRole('admin'); setError(''); }}
                    >
                        <Shield size={18} /> Admin
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={`glass-input transition-colors duration-300 ${role === 'admin' ? 'focus:border-pink-500' : 'focus:border-cyan-500'}`}
                            placeholder={role === 'admin' ? 'admin' : 'tenant1'}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`glass-input transition-colors duration-300 ${role === 'admin' ? 'focus:border-pink-500' : 'focus:border-cyan-500'}`}
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="p-3 rounded bg-danger/10 border border-danger/20 text-danger text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className={`w-full btn transition-all duration-300 hover:scale-[1.02] ${role === 'admin'
                                ? 'bg-gradient-to-r from-pink-500 to-rose-600 shadow-pink-500/20 shadow-lg'
                                : 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-500/20 shadow-lg'
                            }`}
                    >
                        Sign In <Key size={18} />
                    </button>
                </form>

                {role === 'tenant' && (
                    <div className="mt-6 text-center">
                        <p className="text-sm text-text-muted">
                            Forgot password? <span className="text-primary cursor-pointer hover:underline">Contact Admin</span>
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default LoginPage;
