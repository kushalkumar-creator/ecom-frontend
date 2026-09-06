import { ArrowLeft, EyeIcon, EyeOff, ShoppingBag, User, Mail, Lock, LogIn, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register(name, email, password);
            navigate('/');
        } catch (err) {
            setError('Registration failed. Email may already be taken, or password is too short.');
        } finally {
            setLoading(false);
        }
    };

    const formValidation = name !== '' && email !== '' && password !== '';

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 py-10 bg-white relative">
            <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-indigo-700 hover:text-indigo-800 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
            </Link>

            <motion.h1
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-4xl font-extrabold text-indigo-700 mb-2"
            >
                Create Account
            </motion.h1>

            <p className="text-gray-600 mb-8 flex items-center gap-2">
                Join ShopEasy Today <ShoppingBag className="w-5 h-5 text-indigo-600" />
            </p>

            <motion.form
                onSubmit={handleRegister}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col gap-5 w-full max-w-sm"
            >
                <div className="relative">
                    <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Enter Name"
                        className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                </div>

                <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                        type="email"
                        placeholder="Enter Email"
                        className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </div>

                <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter Password (min 6 chars)"
                        className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                    {showPassword ? (
                        <EyeOff className="absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer" onClick={() => setShowPassword(false)} />
                    ) : (
                        <EyeIcon className="absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer" onClick={() => setShowPassword(true)} />
                    )}
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <button
                    type="submit"
                    disabled={!formValidation || loading}
                    className={`w-full font-semibold py-3 rounded-xl transition-all duration-200 shadow-md inline-flex items-center justify-center gap-2 ${
                        formValidation ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register'}
                </button>
            </motion.form>

            <Link to="/login" className="cursor-pointer text-gray-600 mt-6 text-sm flex items-center gap-1">
                Already have an Account?
                <LogIn className="w-4 h-4" />
                <span className="text-indigo-600">Sign in</span>
            </Link>
        </div>
    );
}