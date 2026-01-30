import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import {
  Calendar,
  MapPin,
  Users,
  FileText,
  Download,
  Clock,
  CheckCircle,
  Bell,
  Ticket,
  Award,
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function AttendeeDashboard() {
  const { user } = useAuth();

  // Mock data for attendee dashboard
  const registrationStatus = {
    type: 'Attendee Pass',
    price: 150,
    status: 'confirmed',
    confirmationNumber: 'ATT-2025-12345',
  };

  const upcomingSessions = [
    {
      id: 1,
      title: 'Opening Keynote: The Future of AI',
      speaker: 'Dr. Jane Smith',
      time: '9:00 AM - 10:00 AM',
      location: 'Main Hall',
      date: 'June 15, 2025',
    },
    {
      id: 2,
      title: 'Workshop: Hands-on Machine Learning',
      speaker: 'Prof. John Doe',
      time: '10:30 AM - 12:00 PM',
      location: 'Room A',
      date: 'June 15, 2025',
    },
    {
      id: 3,
      title: 'Panel Discussion: Ethics in AI',
      speaker: 'Multiple Speakers',
      time: '2:00 PM - 3:30 PM',
      location: 'Room B',
      date: 'June 15, 2025',
    },
  ];

  const networkingEvents = [
    { id: 1, name: 'Welcome Reception', time: 'June 14, 2025, 6:00 PM', location: 'Lobby' },
    { id: 2, name: 'Coffee Break', time: 'June 15, 2025, 3:30 PM', location: 'Café Area' },
    { id: 3, name: 'Gala Dinner', time: 'June 16, 2025, 7:00 PM', location: 'Ballroom' },
  ];

  const conferenceInfo = {
    name: 'AI & Machine Learning Conference 2025',
    dates: 'June 15-17, 2025',
    venue: 'San Francisco Convention Center',
    attendees: 500,
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 p-8 text-white"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold">
                Welcome back, {user?.fullName}!
              </h1>
              <p className="text-white/80">Attendee ID: {user?.uniqueUserId}</p>
            </div>
          </div>
          <p className="text-white/90 text-lg">
            Your registration is confirmed for {conferenceInfo.name}
          </p>
        </div>
      </motion.div>

      {/* Registration Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-surface-900">Registration Confirmed</h3>
                <p className="text-sm text-surface-600">
                  {registrationStatus.type} • ${registrationStatus.price} • 
                  Confirmation: {registrationStatus.confirmationNumber}
                </p>
              </div>
            </div>
            <Button variant="secondary" size="sm" leftIcon={<Download className="w-4 h-4" />}>
              Download Pass
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Conference Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Conference Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-surface-500">Dates</p>
                  <p className="font-semibold text-surface-900">{conferenceInfo.dates}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-accent-600" />
                </div>
                <div>
                  <p className="text-sm text-surface-500">Venue</p>
                  <p className="font-semibold text-surface-900">SF Convention Center</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-surface-500">Attendees</p>
                  <p className="font-semibold text-surface-900">{conferenceInfo.attendees}+</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-surface-500">Status</p>
                  <Badge variant="success">Registered</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Upcoming Sessions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Sessions</CardTitle>
              <Button variant="ghost" size="sm">View Full Agenda</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-surface-100 hover:border-primary-200 hover:bg-primary-50/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-surface-900">{session.title}</h4>
                    <p className="text-sm text-surface-600 mt-1">by {session.speaker}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-surface-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {session.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {session.location}
                      </div>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">Add to Calendar</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Networking Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Networking Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {networkingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-surface-50"
                  >
                    <div className="w-8 h-8 rounded-lg bg-accent-100 flex items-center justify-center">
                      <Users className="w-4 h-4 text-accent-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-surface-900">{event.name}</p>
                      <p className="text-sm text-surface-500">{event.time}</p>
                    </div>
                    <Badge variant="primary">{event.location}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* What's Included */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Your Registration Includes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  'Full conference access',
                  'Food and snacks throughout',
                  'Conference merchandise',
                  'Workshop participation',
                  'Panel discussion access',
                  'Networking sessions',
                  'Conference materials',
                  'Certificate of participation',
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-surface-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Important Announcements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-surface-900 mb-2">Important Information</h3>
              <ul className="space-y-2 text-sm text-surface-700">
                <li>• Conference check-in opens at 8:00 AM on June 15th</li>
                <li>• Please bring a valid ID and your confirmation email</li>
                <li>• Free Wi-Fi available throughout the venue</li>
                <li>• Download the conference app for real-time updates</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
