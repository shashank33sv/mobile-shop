import React from 'react';
import { Smartphone, ShoppingCart, Wrench, TrendingUp, Package, LogOut } from 'lucide-react';

const Sidebar = ({ activePage, setActivePage, onLogout }) => {
  const navItems = ['Dashboard', 'Billing', 'Services', 'Investments', 'Products'];

  const icons = {
    Dashboard: <Smartphone size={20} />,
    Billing: <ShoppingCart size={20} />,
    Services: <Wrench size={20} />,
    Investments: <TrendingUp size={20} />,
    Products: <Package size={20} />,  // Added 'Products' icon properly
  };

  return (
    <aside className="w-16 md:w-64 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 flex flex-col transition-all duration-300 no-print">
      <div className="h-20 flex items-center justify-center md:justify-start md:px-6 border-b border-gray-200 dark:border-gray-700">
        <Smartphone className="text-blue-500" size={28} />
        <span className="hidden md:inline ml-3 text-xl font-bold select-none">Sri Maruthi Cell Care & Services</span>
      </div>

      <nav className="flex-1 px-2 md:px-4 py-4" role="navigation" aria-label="Main navigation">
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => setActivePage(item)}
            className={`flex items-center w-full p-3 my-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              activePage === item
                ? 'bg-blue-500 text-white shadow-lg'
                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            aria-current={activePage === item ? 'page' : undefined}
            aria-label={`Go to ${item} page`}
          >
            <span className="flex-shrink-0">{icons[item]}</span>
            <span className="hidden md:inline ml-4 font-medium select-none">{item}</span>
          </button>
        ))}
      </nav>

      <div className="px-2 md:px-4 py-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onLogout}
          className="flex items-center w-full p-3 my-2 rounded-lg transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Logout"
        >
          <LogOut size={20} />
          <span className="hidden md:inline ml-4 font-medium select-none">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;