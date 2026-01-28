import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import {
  Bell,
  Search,
  Menu,
  LogOut,
  User,
  Settings,
  ChevronDown,
  Check,
  Clock,
  AlertCircle,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';

export default function Header() {
  const navigate = useNavigate();
  const { user, notifications, markAsRead, markAllAsRead, setSidebarOpen, sidebarOpen } = useStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'deadline':
        return <Clock className="w-5 h-5 text-primary-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-xl border-b border-surface-100">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-surface-500 hover:bg-surface-100 md:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="hidden sm:flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="text"
                placeholder="Search submissions, events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 lg:w-80 pl-10 pr-4 py-2 rounded-xl bg-surface-50 border border-surface-200 text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
              className="relative p-2 rounded-xl text-surface-500 hover:bg-surface-100 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-glass-lg border border-surface-100 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-surface-100">
                    <h3 className="font-semibold text-surface-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAllAsRead()}
                        className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-surface-400">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => {
                            markAsRead(notification.id);
                            if (notification.link) navigate(notification.link);
                            setShowNotifications(false);
                          }}
                          className={clsx(
                            'flex gap-3 p-4 cursor-pointer hover:bg-surface-50 transition-colors border-b border-surface-50 last:border-0',
                            !notification.read && 'bg-primary-50/50'
                          )}
                        >
                          <div className="flex-shrink-0">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-surface-900 truncate">
                              {notification.title}
                            </p>
                            <p className="text-xs text-surface-500 line-clamp-2 mt-0.5">
                              {notification.message}
                            </p>
                            <p className="text-xs text-surface-400 mt-1">
                              {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 5 && (
                    <div className="p-3 border-t border-surface-100">
                      <button className="w-full py-2 text-sm text-primary-600 hover:text-primary-700 font-medium rounded-lg hover:bg-primary-50 transition-colors">
                        View all notifications
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surface-100 transition-colors"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-lg object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-surface-900 leading-tight">
                  {user?.name}
                </p>
                <p className="text-xs text-surface-500 capitalize">{user?.role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-surface-400 hidden md:block" />
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-glass-lg border border-surface-100 overflow-hidden"
                >
                  <div className="p-4 border-b border-surface-100">
                    <p className="font-semibold text-surface-900">{user?.name}</p>
                    <p className="text-sm text-surface-500">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        navigate('/settings');
                        setShowProfile(false);
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-surface-600 hover:bg-surface-50 hover:text-surface-900 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm">Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/settings');
                        setShowProfile(false);
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-surface-600 hover:bg-surface-50 hover:text-surface-900 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Settings</span>
                    </button>
                  </div>
                  <div className="p-2 border-t border-surface-100">
                    <button
                      onClick={() => navigate('/')}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Sign out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
