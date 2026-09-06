import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Boxes, ImagePlus, IndianRupee, Package, PlusCircle, Tag, Trash2, Edit3 } from 'lucide-react';
import api from '../api';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ name: '', description: '', price: '', image: '', category: '', stock: '' });
    const [editingId, setEditingId] = useState(null);

    const loadProducts = () => {
        api.get('/products').then((res) => setProducts(res.data));
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/products/${editingId}`, form);
            } else {
                await api.post('/products', form);
            }
            setForm({ name: '', description: '', price: '', image: '', category: '', stock: '' });
            setEditingId(null);
            loadProducts();
        } catch (err) {
            alert('Failed to save product. Are you logged in as admin?');
        }
    };

    const editProduct = (p) => {
        setForm({
            name: p.name,
            description: p.description || '',
            price: p.price,
            image: p.image || '',
            category: p.category || '',
            stock: p.stock,
        });
        setEditingId(p.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteProduct = async (id) => {
        if (!confirm('Delete this product?')) return;
        await api.delete(`/products/${id}`);
        loadProducts();
    };

    return (
        <div className="max-w-3xl mx-auto pb-16">
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-8 text-center flex items-center justify-center gap-2">
                <Boxes className="text-indigo-600" /> Manage Products
            </h1>

            <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 mb-8"
            >
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <PlusCircle className="text-indigo-600" size={20} />
                    {editingId ? 'Edit Product' : 'Add New Product'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                        <Package className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                            name="name"
                            placeholder="Product Name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>

                    <div className="relative">
                        <Tag className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                            name="category"
                            placeholder="Category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>

                    <div className="relative">
                        <IndianRupee className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                            name="price"
                            type="number"
                            placeholder="Price"
                            value={form.price}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>

                    <div className="relative">
                        <Boxes className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                            name="stock"
                            type="number"
                            placeholder="Stock"
                            value={form.stock}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>

                    <div className="relative sm:col-span-2">
                        <ImagePlus className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                            name="image"
                            placeholder="Image URL"
                            value={form.image}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl py-3 px-4 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:col-span-2"
                        rows={2}
                    />
                </div>

                <div className="flex gap-3 mt-4">
                    <button
                        type="submit"
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all"
                    >
                        {editingId ? 'Update Product' : 'Add Product'}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingId(null);
                                setForm({ name: '', description: '', price: '', image: '', category: '', stock: '' });
                            }}
                            className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </motion.form>

            <div className="space-y-3">
                {products.map((p) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between px-5 py-4"
                    >
                        <div className="flex items-center gap-4">
                            <img
                                src={p.image}
                                alt={p.name}
                                className="w-14 h-14 rounded-lg object-cover border border-gray-200 bg-gray-50"
                            />
                            <div>
                                <p className="font-semibold text-gray-800">{p.name}</p>
                                <p className="text-sm text-gray-500">₹{p.price} · {p.stock} in stock</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => editProduct(p)}
                                className="w-9 h-9 flex items-center justify-center rounded-lg bg-indigo-100 hover:bg-indigo-200 transition-all"
                            >
                                <Edit3 size={16} className="text-indigo-700" />
                            </button>
                            <button
                                onClick={() => deleteProduct(p.id)}
                                className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-100 hover:bg-red-200 transition-all"
                            >
                                <Trash2 size={16} className="text-red-600" />
                            </button>
                        </div>
                    </motion.div>
                ))}
                {products.length === 0 && <p className="text-center text-gray-500">No products yet.</p>}
            </div>
        </div>
    );
}