import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Boxes,
  ClipboardCheckIcon,
  LogOut,
  Menu,
  Package,
  PlusCircle,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";
import { useAuth } from "../context/AuthContext";
import { getCartCount } from "../cartUtils";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(getCartCount());
  const profileDropDown = useRef(null);

  const hideSearch =
    location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileDropDown.current &&
        !profileDropDown.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const syncCart = () => setCartCount(getCartCount());
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("cartUpdated", syncCart);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("cartUpdated", syncCart);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(search ? `/?q=${encodeURIComponent(search)}` : "/");
  };

  const sideBar = menuOpen
    ? createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100 }}
            transition={{ type: "spring", stiffness: 100, damping: 14 }}
            className="fixed top-0 left-0 h-full w-[75%] sm:w-[60%] z-9999 bg-linear-to-b from-indigo-800/90 via-indigo-700/80 to-indigo-900/90 backdrop-blur-xl border-r border-indigo-400/20 shadow-[0_0_50px_-10px_rgba(80,80,255,0.3)] flex flex-col p-6 text-white"
          >
            <div className="flex justify-between items-center mb-2">
              <h1 className="font-extrabold text-2xl tracking-wide text-white/90">
                Admin Panel
              </h1>
              <button
                className="text-white/80 hover:text-red-400 text-2xl font-bold transition"
                onClick={() => setMenuOpen(false)}
              >
                <X />
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 mt-3 rounded-xl bg-white/10 hover:bg-white/15 transition-all shadow-inner">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-400/60 shadow-lg flex items-center justify-center bg-white/20">
                <User />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {user?.name}
                </h2>
                <p className="text-xs text-indigo-200 capitalize tracking-wide">
                  {user?.role}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 font-medium mt-6">
              <Link
                to="/admin/products"
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all"
                onClick={() => setMenuOpen(false)}
              >
                <PlusCircle className="w-5 h-5" /> Manage Products
              </Link>
              <Link
                to="/admin/orders"
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all"
                onClick={() => setMenuOpen(false)}
              >
                <ClipboardCheckIcon className="w-5 h-5" /> Manage Orders
              </Link>
            </div>

            <div className="my-5 border-t border-white/20"></div>
            <div
              className="flex items-center gap-3 text-red-300 font-semibold mt-auto hover:bg-red-500/20 p-3 rounded-lg transition-all cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 text-red-300" />
              Logout
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body,
      )
    : null;

  return (
    <div className="w-[95%] fixed top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-indigo-500 to-indigo-700 rounded-2xl shadow-lg shadow-black/30 flex justify-between items-center h-20 px-4 md:px-8 z-50">
      <Link
        to="/"
        className="text-white font-extrabold text-2xl sm:text-3xl tracking-wide hover:scale-105 transition-transform"
      >
        ShopEasy
      </Link>
      {(!user || user.role === "customer") && !hideSearch && (
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center bg-white rounded-full px-4 py-2 w-1/2 max-w-lg shadow-md"
        >
          <Search className="text-gray-500 w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      )}
      <div className="flex items-center gap-3 md:gap-6 relative">
        {(!user || user.role === "customer") && (
          <Link
            to="/cart"
            className="relative bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-md hover:scale-105 transition"
          >
            <ShoppingCart className="text-indigo-600 w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold shadow">
                {cartCount}
              </span>
            )}
          </Link>
        )}

        {user?.role === "customer" && (
          <Link
            to="/my-orders"
            className="bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-md hover:scale-105 transition"
          >
            <Package className="text-indigo-600 w-6 h-6" />
          </Link>
        )}

        {user?.role === "admin" && (
          <>
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/admin"
                className="flex items-center gap-2 bg-white text-indigo-700 font-semibold px-4 py-2 rounded-full hover:bg-indigo-100 transition-all"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/products"
                className="flex items-center gap-2 bg-white text-indigo-700 font-semibold px-4 py-2 rounded-full hover:bg-indigo-100 transition-all"
              >
                <Boxes className="w-5 h-5" /> Manage Products
              </Link>
              <Link
                to="/admin/orders"
                className="flex items-center gap-2 bg-white text-indigo-700 font-semibold px-4 py-2 rounded-full hover:bg-indigo-100 transition-all"
              >
                <ClipboardCheckIcon className="w-5 h-5" /> Manage Orders
              </Link>
            </div>
            <div
              className="md:hidden bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md cursor-pointer"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <Menu className="text-indigo-600 w-6 h-6" />
            </div>
          </>
        )}

        {user ? (
          <div className="relative" ref={profileDropDown}>
            <div
              className="bg-white rounded-full w-11 h-11 flex items-center justify-center overflow-hidden shadow-md hover:scale-105 transition-transform cursor-pointer"
              onClick={() => setOpen((prev) => !prev)}
            >
              <User className="text-indigo-600" />
            </div>
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 p-3 z-999"
                >
                  <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                      <User className="text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-gray-800 font-semibold">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {user.role}
                      </div>
                    </div>
                  </div>

                  <button
                    className="flex items-center gap-2 w-full text-left px-3 py-3 hover:bg-red-100 rounded-lg text-gray-700 font-medium"
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut className="w-5 h-5 text-red-600" />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="bg-white text-indigo-700 font-semibold px-4 py-2 rounded-full hover:bg-indigo-100 transition-all"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white text-indigo-700 font-semibold px-4 py-2 rounded-full hover:bg-indigo-100 transition-all"
            >
              Register
            </Link>
          </div>
        )}
      </div>

      {sideBar}
    </div>
  );
}
