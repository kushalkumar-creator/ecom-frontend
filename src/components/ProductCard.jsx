import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MinusCircle, PlusCircle, ShoppingCart } from 'lucide-react';

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
}

export default function ProductCard({ item }) {
    const [cart, setCart] = useState(getCart());
    const cartItem = cart.find((i) => i.id === item.id);

    useEffect(() => {
        const sync = () => setCart(getCart());
        window.addEventListener('cartUpdated', sync);
        return () => window.removeEventListener('cartUpdated', sync);
    }, []);

    const addToCart = () => {
        const current = getCart();
        current.push({ ...item, quantity: 1 });
        saveCart(current);
    };

    const increaseQuantity = () => {
        const current = getCart();
        const found = current.find((i) => i.id === item.id);
        if (found) found.quantity += 1;
        saveCart(current);
    };

    const decreaseQuantity = () => {
        let current = getCart();
        const found = current.find((i) => i.id === item.id);
        if (found) {
            found.quantity -= 1;
            if (found.quantity <= 0) {
                current = current.filter((i) => i.id !== item.id);
            }
        }
        saveCart(current);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, amount: 0.3 }}
            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
        >
            <div className="relative w-full aspect-4/3 bg-gray-50 overflow-hidden group">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
            </div>

            <div className="p-4 flex flex-col flex-1">
                <p className="text-xs text-gray-500 font-medium mb-1">{item.category}</p>
                <h3 className="font-semibold text-gray-900">{item.name}</h3>

                <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                        {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                    </span>
                    <span className="text-indigo-700 font-bold text-lg">₹{item.price}</span>
                </div>

                {!cartItem ? (
                    <motion.button
                        className="mt-4 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full py-2 text-sm font-medium transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                        whileTap={{ scale: 0.96 }}
                        onClick={addToCart}
                        disabled={item.stock <= 0}
                    >
                        <ShoppingCart size={18} /> Add to Cart
                    </motion.button>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 flex items-center justify-center bg-indigo-50 border border-indigo-200 rounded-full py-2 px-4 gap-4"
                    >
                        <button
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-indigo-100 hover:bg-indigo-200 transition-all"
                            onClick={decreaseQuantity}
                        >
                            <MinusCircle size={24} className="text-indigo-700" />
                        </button>

                        <span className="text-xl font-semibold text-gray-800">{cartItem.quantity}</span>

                        <button
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-indigo-100 hover:bg-indigo-200 transition-all"
                            onClick={increaseQuantity}
                        >
                            <PlusCircle size={24} className="text-indigo-700" />
                        </button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}