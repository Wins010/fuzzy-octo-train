import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/store/useStore';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Download,
  Mic,
  BookOpen,
  Coffee,
  MessageCircle,
  Image,
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { format, addDays } from 'date-fns';

const getEventIcon = (type: string) => {
  switch (type) {
    case 'keynote':
      return <Mic className="w-5 h-5" />;
    case 'workshop':
      return <BookOpen className="w-5 h-5" />;
    case 'break':
      return <Coffee className="w-5 h-5" />;
    case 'panel':
      return <MessageCircle className="w-5 h-5" />;
    case 'poster':
      return <Image className="w-5 h-5" />;
    default:
      return <Calendar className="w-5 h-5" />;
  }
};

const getEventColor = (type: string) => {
  switch (type) {
    case 'keynote':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'workshop':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'break':
      return 'bg-surface-100 text-surface-600 border-surface-200';
    case 'panel':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'presentation':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'poster':
      return 'bg-pink-100 text-pink-700 border-pink-200';
    default:
      return 'bg-primary-100 text-primary-700 border-primary-200';
  }
};

export default function SchedulePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const { events } = useStore();
  const [selectedDate, setSelectedDate] = useState(new Date('2024-06-15'));
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');

  const conferenceDays = [
    new Date('2024-06-15'),
    new Date('2024-06-16'),
    new Date('2024-06-17'),
  ];

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const selectedEventData = events.find((e) => e.id === selectedEvent);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-display font-bold text-surface-900"
          >
            Conference Schedule
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-surface-500 mt-1"
          >
            Plan and manage your conference sessions
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3"
        >
          <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
            Export PDF
          </Button>
          {isAdmin && (
            <Button 
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/schedule-management')}
            >
              Add Event
            </Button>
          )}
        </motion.div>
      </div>

      {/* Date Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-surface-100 transition-colors">
                <ChevronLeft className="w-5 h-5 text-surface-500" />
              </button>
              <div className="flex gap-2">
                {conferenceDays.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(day)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${
                      format(selectedDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                        : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                    }`}
                  >
                    <span className="text-xs block opacity-70">Day {index + 1}</span>
                    <span className="text-sm">{format(day, 'MMM d')}</span>
                  </button>
                ))}
              </div>
              <button className="p-2 rounded-lg hover:bg-surface-100 transition-colors">
                <ChevronRight className="w-5 h-5 text-surface-500" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex gap-1 bg-surface-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'timeline' ? 'bg-white shadow text-surface-900' : 'text-surface-500'
                  }`}
                >
                  Timeline
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'grid' ? 'bg-white shadow text-surface-900' : 'text-surface-500'
                  }`}
                >
                  Grid
                </button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card padding="none">
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Time header */}
                <div className="flex border-b border-surface-100">
                  <div className="w-20 flex-shrink-0 p-4 bg-surface-50"></div>
                  <div className="flex-1 flex">
                    {timeSlots.map((time) => (
                      <div
                        key={time}
                        className="flex-1 p-4 text-xs font-medium text-surface-500 text-center border-l border-surface-100"
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tracks */}
                {['Main Hall', 'Room A', 'Room B'].map((track) => (
                  <div key={track} className="flex border-b border-surface-100 last:border-0">
                    <div className="w-20 flex-shrink-0 p-4 bg-surface-50 font-medium text-sm text-surface-700 flex items-center">
                      {track}
                    </div>
                    <div className="flex-1 relative h-24">
                      {events
                        .filter((e) => e.room === track || (track === 'Main Hall' && e.location.includes('Grand')))
                        .map((event) => {
                          const startHour = new Date(event.startTime).getHours();
                          const endHour = new Date(event.endTime).getHours();
                          const left = ((startHour - 9) / 11) * 100;
                          const width = ((endHour - startHour) / 11) * 100;

                          return (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              onClick={() => {
                                setSelectedEvent(event.id);
                                setShowEventModal(true);
                              }}
                              className={`absolute top-2 bottom-2 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${getEventColor(event.type)}`}
                              style={{
                                left: `${left}%`,
                                width: `${width}%`,
                              }}
                            >
                              <div className="p-2 h-full overflow-hidden">
                                <div className="flex items-center gap-1 mb-1">
                                  {getEventIcon(event.type)}
                                  <span className="text-xs font-medium capitalize">{event.type}</span>
                                </div>
                                <p className="text-xs font-medium truncate">{event.title}</p>
                              </div>
                            </motion.div>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                hover
                onClick={() => {
                  setSelectedEvent(event.id);
                  setShowEventModal(true);
                }}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <Badge variant="surface" className={getEventColor(event.type)}>
                      {getEventIcon(event.type)}
                      <span className="ml-1 capitalize">{event.type}</span>
                    </Badge>
                    {event.capacity && (
                      <span className="text-xs text-surface-500">
                        {event.registeredCount}/{event.capacity}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-surface-900 line-clamp-2">{event.title}</h3>
                    {event.speakers.length > 0 && (
                      <p className="text-sm text-surface-500 mt-1">
                        {event.speakers.map((s) => s.name).join(', ')}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm text-surface-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {format(event.startTime, 'HH:mm')} - {format(event.endTime, 'HH:mm')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {event.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="surface" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Event Detail Modal */}
      <Modal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        title="Event Details"
        size="lg"
      >
        {selectedEventData && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${getEventColor(selectedEventData.type)}`}>
                {getEventIcon(selectedEventData.type)}
              </div>
              <div className="flex-1">
                <Badge variant="surface" className="mb-2">
                  {selectedEventData.type}
                </Badge>
                <h3 className="text-xl font-semibold text-surface-900">
                  {selectedEventData.title}
                </h3>
              </div>
            </div>

            <p className="text-surface-600">{selectedEventData.description}</p>

            {selectedEventData.speakers.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-surface-700 mb-3">Speakers</h4>
                <div className="space-y-3">
                  {selectedEventData.speakers.map((speaker) => (
                    <div key={speaker.id} className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
                      {speaker.avatar ? (
                        <img src={speaker.avatar} alt={speaker.name} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-medium">
                          {speaker.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-surface-900">{speaker.name}</p>
                        <p className="text-sm text-surface-500">{speaker.title}, {speaker.organization}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-surface-50 rounded-xl">
                <Clock className="w-5 h-5 text-surface-400" />
                <div>
                  <p className="text-xs text-surface-500">Time</p>
                  <p className="text-sm font-medium text-surface-900">
                    {format(selectedEventData.startTime, 'HH:mm')} - {format(selectedEventData.endTime, 'HH:mm')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-surface-50 rounded-xl">
                <MapPin className="w-5 h-5 text-surface-400" />
                <div>
                  <p className="text-xs text-surface-500">Location</p>
                  <p className="text-sm font-medium text-surface-900">{selectedEventData.location}</p>
                </div>
              </div>
            </div>

            {selectedEventData.capacity && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-surface-600">Registration</span>
                  <span className="text-sm font-medium text-surface-900">
                    {selectedEventData.registeredCount}/{selectedEventData.capacity} seats
                  </span>
                </div>
                <div className="h-2 bg-surface-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                    style={{ width: `${(selectedEventData.registeredCount / selectedEventData.capacity) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-100">
              <Button variant="secondary" onClick={() => setShowEventModal(false)}>
                Close
              </Button>
              <Button>Register for Event</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
