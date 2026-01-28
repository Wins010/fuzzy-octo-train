import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';

export default function Layout() {
  const { sidebarOpen } = useStore();

  return (
    <div className="flex h-screen bg-surface-50 overflow-hidden">
      <Sidebar />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <Header />
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-auto p-6 lg:p-8"
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </motion.main>
      </div>
    </div>
  );
}
