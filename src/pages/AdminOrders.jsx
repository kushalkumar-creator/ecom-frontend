import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ChevronUp, MapPin, Package, Truck, User } from 'lucide-react';
import api from '../api';

function AdminOrderCard({ order, onUpdate }) {
    const [expanded, setExpanded] = useState(false);

    const updateStatus = async (status) => {
        try {
            await api.put(`/orders/${order.id}/status`, { status });
            onUpdate();
        } catch (err) {
            alert('Failed to update order.');
        }
    };

    const statusColor = {
        pending: 'bg-yellow-100 text-yellow-700',
        accepted: 'bg-blue-100 text-blue-700',
        rejected: 'bg-red-100 text-red-700',
        delivered: 'bg-green-100 text-green-700',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white shadow-md hover:shadow-lg border border-gray-100 rounded-2xl p-6 transition-all"
        >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-1">
                    <p className="text-lg font-bold flex items-center gap-2 text-indigo-600">
                        <Package size={20} />
                        Order #{order.id}
                    </p>
                    <p className="text-gray-500 text-sm">{new Date(order.created_at).toLocaleString()}</p>
                    <p className="flex items-center gap-2 font-semibold text-sm text-gray-700">
                        <User size={16} className="text-indigo-600" />
                        {order.user?.name} ({order.user?.email})
                    </p>
                    {order.address && (
                        <p className="flex items-center gap-2 text-sm text-gray-700">
                            <MapPin size={16} className="text-indigo-600" />
                            {order.address}
                        </p>
                    )}
                </div>

                <div className="flex flex-col items-start md:items-end gap-2">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusColor[order.status]}`}>
                        {order.status}
                    </span>
                    {order.status === 'pending' && (
                        <div className="flex gap-2">
                            <button onClick={() => updateStatus('accepted')} className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition">
                                Accept
                            </button>
                            <button onClick={() => updateStatus('rejected')} className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-red-600 transition">
                                Reject
                            </button>
                        </div>
                    )}
                    {order.status === 'accepted' && (
                        <button onClick={() => updateStatus('delivered')} className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-green-700 transition">
                            Mark Delivered
                        </button>
                    )}
                </div>
            </div>

            <div className="border-t border-gray-200 mt-3 pt-3">
                <button onClick={() => setExpanded((p) => !p)} className="w-full flex justify-between items-center text-sm font-medium text-gray-700 hover:text-indigo-700 transition">
                    <span className="flex items-center gap-2">
                        <Package size={16} className="text-indigo-600" />
                        {expanded ? 'Hide order items' : `View ${order.items?.length || 0} items`}
                    </span>
                    {expanded ? <ChevronUp size={16} className="text-indigo-600" /> : <ChevronDown size={16} className="text-indigo-600" />}
                </button>

                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                >
                    <div className="mt-3 space-y-3">
                        {order.items?.map((item) => (
                            <div key={item.id} className="flex justify-between items-center bg-gray-50 rounded-xl px-3 py-2 hover:bg-gray-100 transition">
                                <div className="flex items-center gap-3">
                                    <img src={item.product?.image} alt={item.product?.name} className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{item.product?.name}</p>
                                        <p className="text-xs text-gray-500">{item.quantity} x ₹{item.price}</p>
                                    </div>
                                </div>
                                <p className="text-sm font-semibold text-gray-800">₹{item.price * item.quantity}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <div className="border-t pt-3 mt-3 flex justify-between items-center text-sm font-semibold text-gray-800">
                <div className="flex items-center gap-2 text-gray-700 text-sm">
                    <Truck size={16} className="text-indigo-600" />
                    <span>Status: <span className="text-indigo-700 font-semibold capitalize">{order.status}</span></span>
                </div>
                <div>Total: <span className="text-indigo-700 font-bold">₹{order.total}</span></div>
            </div>
        </motion.div>
    );
}

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);

    const loadOrders = () => {
        api.get('/orders').then((res) => setOrders(res.data));
    };

    useEffect(() => {
        loadOrders();
    }, []);

    return (
        <div className="max-w-3xl mx-auto pb-16">
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-8 text-center">Manage Orders</h1>
            <div className="space-y-5">
                {orders.map((order) => (
                    <AdminOrderCard key={order.id} order={order} onUpdate={loadOrders} />
                ))}
                {orders.length === 0 && <p className="text-center text-gray-500">No orders yet.</p>}
            </div>
        </div>
    );
}