import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q')?.toLowerCase() || '';

    useEffect(() => {
        api.get('/products').then((res) => setProducts(res.data));
    }, []);

    const filtered = query
        ? products.filter((p) => p.name.toLowerCase().includes(query) || p.category?.toLowerCase().includes(query))
        : products;

    return (
        <div className="-mx-4 md:-mx-8">
            <div className="flex flex-col gap-16 md:gap-20 pb-16 md:pb-24 px-4 md:px-8 min-h-[50vh]">
                <div className="w-[90%] md:w-[80%] mx-auto mt-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-8 text-center">
                        {query ? `Results for "${query}"` : 'Popular Products'}
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        {filtered.map((item, index) => (
                            <ProductCard key={index} item={item} />
                        ))}
                    </div>
                    {filtered.length === 0 && <p className="text-center text-gray-500">No products found.</p>}
                </div>
            </div>
            <Footer />
        </div>
    );
}