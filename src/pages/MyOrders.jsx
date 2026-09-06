import { useEffect, useState } from 'react';
import { Package, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import api from '../api';

const statusColor = {
    pending: 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-blue-100 text-blue-700',
    rejected: 'bg-red-100 text-red-700',
    delivered: 'bg-green-100 text-green-700',
};

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/my-orders')
            .then((res) => setOrders(res.data))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="max-w-2xl mx-auto pb-16">
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-8 text-center flex items-center justify-center gap-2">
                <Package className="text-indigo-600" /> My Orders
            </h1>

            {loading ? (
                <p className="text-center text-gray-500">Loading your orders...</p>
            ) : orders.length === 0 ? (
                <p className="text-center text-gray-500">You haven't placed any orders yet.</p>
            ) : (
                <div className="space-y-5">
                    {orders.map((order) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden"
                        >
                            <div className="flex justify-between items-center border-b border-gray-100 px-5 py-4 bg-linear-to-r from-indigo-50 to-white">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Order <span className="text-indigo-700 font-bold">#{order.id}</span>
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">{new Date(order.created_at).toLocaleString()}</p>
                                </div>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${statusColor[order.status]}`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="p-5 space-y-3">
                                {order.address && (
                                    <div className="flex items-center gap-2 text-gray-700 text-sm">
                                        <MapPin size={16} className="text-indigo-600" />
                                        <span className="truncate">{order.address}</span>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    {order.items?.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center bg-gray-50 rounded-xl px-3 py-2">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={item.product?.image}
                                                    alt={item.product?.name}
                                                    className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                                                />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">{item.product?.name}</p>
                                                    <p className="text-xs text-gray-500">{item.quantity} x ₹{item.price}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-800">₹{item.price * item.quantity}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t pt-3 flex justify-between items-center text-sm font-semibold text-gray-800">
                                    <span>Total</span>
                                    <span className="text-indigo-700 font-bold text-lg">₹{order.total}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}