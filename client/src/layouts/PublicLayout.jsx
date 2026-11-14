import { Link, Outlet, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const categories = ['All', 'Pure Water', 'Bottles', 'Packing Bags', 'Shrink Wrapper'];

export default function PublicLayout() {
  const location = useLocation();
    const { cartCount } = useCart();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* ================= TOPBAR ================= */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          
          {/* Logo */}
          <Link to="/" className="shrink-0 flex items-center gap-2">
            <img
              src="https://placehold.co/48x48/0f172a/facc15?text=SS"
              alt="Silver-Semat Logo"
              className="h-12 w-12 rounded-xl object-cover shadow-sm"
            />
            <span className="hidden sm:block text-xl font-bold text-slate-900 tracking-tight">
              Silver-Semat
            </span>
          </Link>

          {/* Search bar */}
          <div className="flex-1 flex items-center border border-gray-300 rounded-full pl-4 pr-1 py-2 max-w-xl bg-gray-50 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <input
              type="text"
              placeholder="Search pure water, bottles, bags..."
              className="flex-1 outline-none text-sm bg-transparent text-gray-700 placeholder-gray-400"
            />
            <button className="h-9 w-9 rounded-full bg-slate-PublicLayout900 text-white flex items-center justify-center shrink-0 hover:bg-slate-800 transition">
              <SearchIcon />
            </button>
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative shrink-0 p-2 text-slate-700 hover:text-blue-600 transition">
            <CartIcon />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 h-5 w-5 bg-blue-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>


      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 pb-24 md:pb-12">
        <Outlet />
      </main>

      {/* ================= BOTTOMBAR (mobile only) ================= */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-4">
          <BottomItem to="/" label="Shop" active={location.pathname.startsWith('/products')} icon={<ShopIcon />} />
          <BottomItem to="/cart" label="Cart" active={location.pathname === '/cart'} icon={<CartIcon />} badge={cartCount} />
          <a
            href="https://wa.me/2340000000000"
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center justify-center gap-1 py-3 text-green-600 hover:bg-green-50 transition"
          >
            <WhatsAppIcon />
            <span className="text-[11px] font-semibold">Inquire</span>
          </a>
        </div>
      </nav>

      {/* ================= FOOTER (desktop only) ================= */}
      <footer className="hidden md:block bg-slate-900 text-gray-400 py-8 text-center text-sm">
        <div className="max-w-6xl mx-auto px-4">
          <p className="font-semibold text-white mb-2">Silver-Semat Enterprises</p>
          <p>Premium Pure Water, Bottles, Packing Bags & Shrink Wrappers.</p>
          <p className="mt-4 text-xs text-gray-500">&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

/* ---------- Reusable bottom bar item ---------- */
function BottomItem({ to, label, icon, active, badge }) {
  return (
    <Link
      to={to}
      className={`relative flex flex-col items-center justify-center gap-1 py-3 transition ${
        active ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
      }`}
    >
      {icon}
      <span className="text-[11px] font-semibold">{label}</span>
      {badge > 0 && (
        <span className="absolute top-2 right-6 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {badge}
        </span>
      )}
    </Link>
  );
}

/* ---------- Inline SVG icons ---------- */
function SearchIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}
function CartIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M6 7h12l1 13H5L6 7z" strokeLinejoin="round" /><path d="M9 7a3 3 0 016 0" strokeLinecap="round" />
    </svg>
  );
}
function HomeIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M3 11l9-8 9 8" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 9v11h14V9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ShopIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M4 9h16M4 9l1-5h14l1 5M4 9v11h16V9M9 20v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function WhatsAppIcon() {
  return (
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1112 20zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.7.9-.1.2-.3.2-.5.1a6.5 6.5 0 01-3.2-2.8c-.2-.4.2-.6.4-.8.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.7.7-.9 1.7-.5 2.8.5 1.4 1.6 2.9 3.1 3.9 1.5 1 2.8 1.3 3.8 1.1.6-.1 1.2-.5 1.5-1 .2-.5.2-1 .1-1.1z" />
    </svg>
  );
}