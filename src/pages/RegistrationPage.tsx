import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import {
  Ticket,
  Check,
  Calendar,
  MapPin,
  Users,
  CreditCard,
  Star,
  Gift,
  Coffee,
  Wifi,
  BookOpen,
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import toast from 'react-hot-toast';

const ticketTypes = [
  {
    id: 'early-bird',
    name: 'Early Bird',
    price: 299,
    originalPrice: 499,
    currency: 'USD',
    description: 'Best value for early registrants',
    benefits: [
      'Full conference access',
      'Workshop participation',
      'Networking events',
      'Conference materials',
      'Lunch & refreshments',
    ],
    popular: true,
    available: 50,
    sold: 42,
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 499,
    currency: 'USD',
    description: 'Complete conference experience',
    benefits: [
      'Full conference access',
      'Workshop participation',
      'Networking events',
      'Conference materials',
      'Lunch & refreshments',
      'Gala dinner access',
    ],
    popular: false,
    available: 200,
    sold: 87,
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 899,
    currency: 'USD',
    description: 'Premium experience with exclusive perks',
    benefits: [
      'Full conference access',
      'All workshops included',
      'VIP networking events',
      'Premium conference kit',
      'Priority seating',
      'Gala dinner access',
      'Meet & greet with speakers',
      '1-year digital library access',
    ],
    popular: false,
    available: 30,
    sold: 12,
  },
];

const workshops = [
  { id: 'ws-1', name: 'Hands-on Machine Learning with PyTorch', spots: 50, filled: 48 },
  { id: 'ws-2', name: 'Advanced NLP Techniques', spots: 40, filled: 35 },
  { id: 'ws-3', name: 'Ethics in AI Development', spots: 60, filled: 45 },
  { id: 'ws-4', name: 'Research Paper Writing Workshop', spots: 30, filled: 28 },
];

export default function RegistrationPage() {
  const { events } = useStore();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [selectedWorkshops, setSelectedWorkshops] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    organization: '',
    dietary: '',
    specialNeeds: '',
  });

  const handleWorkshopToggle = (workshopId: string) => {
    if (selectedWorkshops.includes(workshopId)) {
      setSelectedWorkshops(selectedWorkshops.filter((id) => id !== workshopId));
    } else if (selectedWorkshops.length < 2) {
      setSelectedWorkshops([...selectedWorkshops, workshopId]);
    }
  };

  const handleRegister = () => {
    toast.success('Registration successful! Check your email for confirmation.');
    setStep(3);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-display font-bold text-surface-900"
        >
          Event Registration
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-surface-500 mt-1"
        >
          Secure your spot at the conference
        </motion.p>
      </div>

      {/* Conference Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-r from-primary-500 to-accent-500 text-white border-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">AI & Machine Learning Conference 2024</h2>
              <div className="flex flex-wrap gap-4 text-white/80">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>June 15-17, 2024</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>500+ Attendees</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm">Early bird ends in</p>
              <p className="text-2xl font-bold">12 days</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {step === 1 && (
        <>
          {/* Ticket Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-surface-900 mb-4">Choose Your Pass</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {ticketTypes.map((ticket, index) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card
                    hover
                    onClick={() => setSelectedTicket(ticket.id)}
                    className={`relative ${
                      selectedTicket === ticket.id
                        ? 'ring-2 ring-primary-500 border-primary-200'
                        : ''
                    } ${ticket.popular ? 'border-accent-200' : ''}`}
                  >
                    {ticket.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge variant="accent">
                          <Star className="w-3 h-3 mr-1" />
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    <div className="text-center mb-6 pt-2">
                      <h3 className="text-lg font-semibold text-surface-900">{ticket.name}</h3>
                      <p className="text-sm text-surface-500 mt-1">{ticket.description}</p>
                      <div className="mt-4">
                        {ticket.originalPrice && (
                          <span className="text-sm text-surface-400 line-through mr-2">
                            ${ticket.originalPrice}
                          </span>
                        )}
                        <span className="text-3xl font-bold text-surface-900">${ticket.price}</span>
                        <span className="text-surface-500">/person</span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      {ticket.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span className="text-sm text-surface-600">{benefit}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-surface-500">Availability</span>
                        <span className="text-surface-700 font-medium">
                          {ticket.available - ticket.sold} left
                        </span>
                      </div>
                      <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                          style={{ width: `${(ticket.sold / ticket.available) * 100}%` }}
                        />
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      variant={selectedTicket === ticket.id ? 'primary' : 'secondary'}
                    >
                      {selectedTicket === ticket.id ? 'Selected' : 'Select Pass'}
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Workshop Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-surface-900 mb-4">
              Select Workshops <span className="text-surface-400 font-normal">(Optional, max 2)</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {workshops.map((workshop) => (
                <Card
                  key={workshop.id}
                  hover
                  onClick={() => handleWorkshopToggle(workshop.id)}
                  className={
                    selectedWorkshops.includes(workshop.id)
                      ? 'ring-2 ring-primary-500 border-primary-200'
                      : ''
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedWorkshops.includes(workshop.id)
                          ? 'bg-primary-100'
                          : 'bg-surface-100'
                      }`}>
                        <BookOpen className={`w-5 h-5 ${
                          selectedWorkshops.includes(workshop.id)
                            ? 'text-primary-600'
                            : 'text-surface-500'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-surface-900">{workshop.name}</p>
                        <p className="text-sm text-surface-500">
                          {workshop.spots - workshop.filled} spots left
                        </p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedWorkshops.includes(workshop.id)
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-surface-300'
                    }`}>
                      {selectedWorkshops.includes(workshop.id) && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>

          <div className="flex justify-end">
            <Button
              size="lg"
              disabled={!selectedTicket}
              onClick={() => setStep(2)}
            >
              Continue to Registration
            </Button>
          </div>
        </>
      )}

      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Registration Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="First Name *"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Enter your first name"
                />
                <Input
                  label="Last Name *"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Enter your last name"
                />
                <Input
                  label="Email *"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                />
                <Input
                  label="Organization"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="Enter your organization"
                />
                <Input
                  label="Dietary Requirements"
                  value={formData.dietary}
                  onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
                  placeholder="e.g., Vegetarian, Vegan, Allergies"
                />
                <Input
                  label="Special Accessibility Needs"
                  value={formData.specialNeeds}
                  onChange={(e) => setFormData({ ...formData, specialNeeds: e.target.value })}
                  placeholder="Let us know how we can help"
                />
              </div>

              {/* Order Summary */}
              <div className="mt-8 p-6 bg-surface-50 rounded-xl">
                <h3 className="font-semibold text-surface-900 mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-surface-600">
                      {ticketTypes.find((t) => t.id === selectedTicket)?.name} Pass
                    </span>
                    <span className="font-medium text-surface-900">
                      ${ticketTypes.find((t) => t.id === selectedTicket)?.price}
                    </span>
                  </div>
                  {selectedWorkshops.map((wsId) => (
                    <div key={wsId} className="flex items-center justify-between">
                      <span className="text-surface-600">
                        {workshops.find((w) => w.id === wsId)?.name}
                      </span>
                      <span className="font-medium text-surface-900">Included</span>
                    </div>
                  ))}
                  <div className="border-t border-surface-200 pt-3 mt-3">
                    <div className="flex items-center justify-between text-lg">
                      <span className="font-semibold text-surface-900">Total</span>
                      <span className="font-bold text-primary-600">
                        ${ticketTypes.find((t) => t.id === selectedTicket)?.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-8">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  size="lg"
                  leftIcon={<CreditCard className="w-4 h-4" />}
                  onClick={handleRegister}
                >
                  Complete Registration
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-surface-900 mb-2">Registration Complete!</h2>
          <p className="text-surface-500 mb-8 max-w-md mx-auto">
            Thank you for registering. A confirmation email has been sent to your email address with all the details.
          </p>
          <Button onClick={() => setStep(1)}>Register Another Attendee</Button>
        </motion.div>
      )}
    </div>
  );
}
