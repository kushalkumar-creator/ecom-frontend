import { Share2, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-linear-to-r from-indigo-600 to-indigo-800 text-white mt-20">
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10">
                <div>
                    <h3 className="text-2xl font-bold mb-3">ShopEasy</h3>
                    <p className="text-indigo-100 text-sm">
                        Your one-stop online store delivering quality products to your doorstep.
                        Shop smart, shop easy!
                    </p>
                </div>

                <div>
                    <h4 className="font-semibold text-lg mb-3">Quick Links</h4>
                    <div className="flex flex-col gap-2 text-sm text-indigo-100">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <Link to="/cart" className="hover:text-white transition-colors">Cart</Link>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold text-lg mb-3">Contact Us</h4>
                    <div className="flex flex-col gap-2 text-sm text-indigo-100">
                        <span className="flex items-center gap-2"><MapPin size={16} /> Bengaluru, India</span>
                        <span className="flex items-center gap-2"><Phone size={16} /> +91 1234567890</span>
                        <span className="flex items-center gap-2"><Mail size={16} /> support@shopeasy.in</span>
                    </div>
                </div>
            </div>

            <div className="border-t border-indigo-500 text-center py-4 text-xs text-indigo-200">
                © 2026 ShopEasy. All rights reserved.
            </div>
        </footer>
    );
}