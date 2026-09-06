import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, Users, Truck, IndianRupee, TrendingUp } from 'lucide-react';
import api from '../api';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        api.get('/dashboard-stats').then((res) => setStats(res.data));
    }, []);

    if (!stats) return <p className="text-center text-gray-500">Loading dashboard...</p>;

    return (
        <div className="max-w-5xl mx-auto pb-16">
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-8 text-center flex items-center justify-center gap-2">
                🏪 Admin Dashboard
            </h1>

            <div className="bg-indigo-50 rounded-2xl p-8 text-center mb-8 border border-indigo-100">
                <p className="text-indigo-700 font-semibold">Total Earning</p>
                <p className="text-4xl font-bold text-indigo-800 mt-2">₹{stats.totalRevenue}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                <StatCard icon={<Package className="text-indigo-600" />} label="Total Orders" value={stats.totalOrders} />
                <StatCard icon={<Users className="text-indigo-600" />} label="Total Customers" value={stats.totalCustomers} />
                <StatCard icon={<Truck className="text-indigo-600" />} label="Pending Deliveries" value={stats.pendingDeliveries} />
                <StatCard icon={<IndianRupee className="text-indigo-600" />} label="Total Revenue" value={`₹${stats.totalRevenue}`} />
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-indigo-600" /> Order Overview (Last 7 Days)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="orders" stroke="#4f46e5" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-start gap-2">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">{icon}</div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-xl font-bold text-gray-800">{value}</p>
        </div>
    );
}