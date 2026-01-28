import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/store/useStore';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  Users,
  Clipboard,
  ArrowRight,
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export default function VolunteerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { events } = useStore();

  const myTasks = [
    {
      id: '1',
      title: 'Registration Desk Setup',
      description: 'Set up registration materials and check-in system',
      status: 'pending',
      priority: 'high',
      dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      location: 'Main Lobby',
    },
    {
      id: '2',
      title: 'Welcome Packet Distribution',
      description: 'Distribute welcome packets to attendees',
      status: 'in_progress',
      priority: 'medium',
      dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000),
      location: 'Registration Area',
    },
    {
      id: '3',
      title: 'Technical Session Support',
      description: 'Assist with microphones and Q&A',
      status: 'pending',
      priority: 'medium',
      dueDate: new Date(Date.now() + 6 * 60 * 60 * 1000),
      location: 'Room A',
    },
  ];

  const completedTasks = 5;
  const totalTasks = myTasks.length + completedTasks;
  const upcomingEvents = events.slice(0, 4);

  const stats = [
    {
      label: 'Tasks Assigned',
      value: totalTasks,
      icon: Clipboard,
      color: 'from-blue-500 to-cyan-500',
      textColor: 'text-blue-600',
    },
    {
      label: 'Completed',
      value: completedTasks,
      icon: CheckCircle,
      color: 'from-emerald-500 to-teal-500',
      textColor: 'text-emerald-600',
    },
    {
      label: 'Pending',
      value: myTasks.length,
      icon: Clock,
      color: 'from-amber-500 to-orange-500',
      textColor: 'text-amber-600',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-surface-100 text-surface-700 border-surface-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'completed':
        return 'bg-emerald-100 text-emerald-700';
      default:
        return 'bg-surface-100 text-surface-700';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-display font-bold text-surface-900"
          >
            Welcome back, {user?.name.split(' ')[0]} 👋
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-surface-500 mt-1"
          >
            User ID: <span className="font-mono font-semibold text-primary-600">{user?.uniqueUserId}</span> • Volunteer
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3"
        >
          <Button variant="secondary" onClick={() => navigate('/schedule')}>
            View Schedule
          </Button>
          <Button onClick={() => navigate('/schedule')}>
            Check In
          </Button>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover className="relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-surface-500 font-medium">{stat.label}</p>
                  <p className="text-3xl font-display font-bold text-surface-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
            </Card>
          </motion.div>
        ))}
      </div>

      {/* My Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>My Tasks</CardTitle>
              <span className="text-sm text-surface-500">{myTasks.length} pending</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="p-4 rounded-xl border border-surface-100 hover:border-primary-200 hover:shadow-glass transition-all"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-surface-900">{task.title}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-sm text-surface-600 mb-2">{task.description}</p>
                      <div className="flex items-center gap-4 text-xs text-surface-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Due {formatDistanceToNow(task.dueDate, { addSuffix: true })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{task.location}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {task.status === 'pending' && (
                      <Button size="sm" variant="secondary">
                        Start Task
                      </Button>
                    )}
                    {task.status === 'in_progress' && (
                      <Button size="sm">
                        Complete Task
                      </Button>
                    )}
                    <Button size="sm" variant="ghost">
                      View Details
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Upcoming Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Events</CardTitle>
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />} onClick={() => navigate('/schedule')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 rounded-xl border border-surface-100 hover:border-primary-200 hover:shadow-glass transition-all cursor-pointer"
                    onClick={() => navigate('/schedule')}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        event.type === 'keynote' ? 'bg-purple-100 text-purple-700' :
                        event.type === 'workshop' ? 'bg-blue-100 text-blue-700' :
                        event.type === 'panel' ? 'bg-orange-100 text-orange-700' :
                        'bg-surface-100 text-surface-700'
                      }`}>
                        {event.type}
                      </span>
                    </div>
                    <h4 className="font-medium text-surface-900 mb-2 line-clamp-2">
                      {event.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-surface-500">
                      <MapPin className="w-3 h-3" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-surface-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No upcoming events</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-3">
              <Button variant="secondary" className="justify-start" leftIcon={<Users className="w-4 h-4" />}>
                Team Directory
              </Button>
              <Button variant="secondary" className="justify-start" leftIcon={<MapPin className="w-4 h-4" />}>
                Venue Map
              </Button>
              <Button variant="secondary" className="justify-start" leftIcon={<AlertCircle className="w-4 h-4" />}>
                Report Issue
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
