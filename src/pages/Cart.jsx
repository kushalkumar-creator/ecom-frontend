import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Package, ShoppingBag, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Cart() {
    const [cart, setCart] = useState([]);
    const [address, setAddress] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        setCart(JSON.parse(localStorage.getItem('cart')) || []);
    }, []);

    const removeItem = (id) => {
        const updated = cart.filter((item) => item.id !== id);
        setCart(updated);
        localStorage.setItem('cart', JSON.stringify(updated));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const checkout = async () => {
        if (!user) {
            alert('Please login to checkout');
            navigate('/login');
            return;
        }
        try {
            await api.post('/orders', {
                items: cart.map((item) => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.price,
                })),
                address,
            });
            localStorage.removeItem('cart');
            window.dispatchEvent(new Event('cartUpdated'));
            setCart([]);
            alert('Order placed successfully!');
            navigate('/');
        } catch (err) {
            alert('Checkout failed. Please try again.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto pb-16">
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-8 text-center flex items-center justify-center gap-2">
                <ShoppingBag className="text-indigo-600" /> Your Cart
            </h1>

            {cart.length === 0 ? (
                <p className="text-center text-gray-500">Your cart is empty.</p>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden"
                >
                    <div className="border-b border-gray-100 px-5 py-4 bg-linear-to-r from-indigo-50 to-white">
                        <h3 className="text-lg font-semibold text-gray-800">
                            <span className="text-indigo-700 font-bold">{cart.length}</span> item(s) in cart
                        </h3>
                    </div>

                    <div className="p-5 space-y-3">
                        {cart.map((item) => (
                            <div key={item.id} className="flex justify-between items-center bg-gray-50 rounded-xl px-3 py-2 hover:bg-gray-100 transition">
                                <div className="flex items-center gap-3">
                                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{item.name}</p>
                                        <p className="text-xs text-gray-500">{item.quantity} x ₹{item.price}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <p className="text-sm font-semibold text-gray-800">₹{item.price * item.quantity}</p>
                                    <button onClick={() => removeItem(item.id)}>
                                        <Trash2 size={18} className="text-red-500 hover:text-red-600 transition" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="relative mt-4">
                            <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Delivery address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="border-t pt-3 pb-5 px-5 flex justify-between items-center text-sm font-semibold text-gray-800">
                        <div className="flex items-center gap-2 text-gray-700 text-sm">
                            <Package size={16} className="text-indigo-600" />
                            <span>Total</span>
                        </div>
                        <div className="text-lg">
                            <span className="text-indigo-700 font-bold">₹{total}</span>
                        </div>
                    </div>

                    <div className="px-5 pb-5">
                        <button
                            onClick={checkout}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all"
                        >
                            Place Order
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}