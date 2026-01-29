import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Users,
  Check,
  ArrowRight,
  Calendar,
  Coffee,
  Gift,
  BookOpen,
  Award,
  Network,
  Presentation,
  GraduationCap,
  MessageSquare,
  Building2,
  Sparkles,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function RegistrationOptionsPage() {
  const navigate = useNavigate();

  const authorFeatures = [
    { icon: FileText, text: 'Paper submission capability' },
    { icon: Presentation, text: 'Conference presentation slots' },
    { icon: GraduationCap, text: 'Access to author workshops' },
    { icon: Network, text: 'Networking sessions' },
    { icon: BookOpen, text: 'Conference materials' },
    { icon: Award, text: 'Certificate of participation' },
  ];

  const attendeeFeatures = [
    { icon: Calendar, text: 'Full conference access' },
    { icon: Coffee, text: 'Food and snacks throughout the event' },
    { icon: Gift, text: 'Conference merchandise (swag bag, t-shirt)' },
    { icon: GraduationCap, text: 'Workshop participation' },
    { icon: MessageSquare, text: 'Panel discussion access' },
    { icon: Network, text: 'Networking sessions' },
    { icon: Building2, text: 'Social events and exhibitions' },
    { icon: Award, text: 'Certificate of attendance' },
  ];

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-surface-900">
                Confero
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button size="sm" onClick={() => navigate('/register')}>
                Register
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-primary-100 to-accent-100 blur-3xl opacity-50" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-accent-100 to-primary-100 blur-3xl opacity-50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-surface-900 leading-tight mb-4">
              Join the Conference
            </h1>
            <p className="text-xl text-surface-600 max-w-3xl mx-auto mb-2">
              Choose your registration type and secure your spot at the AI & Machine Learning Conference 2024
            </p>
            <p className="text-lg text-surface-500 max-w-2xl mx-auto mb-12">
              San Francisco Convention Center • June 15-17, 2024
            </p>
          </motion.div>
        </div>
      </section>

      {/* Registration Options */}
      <section className="relative pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Author Registration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="relative h-full border-2 border-primary-200 hover:border-primary-300 hover:shadow-glass-lg transition-all">
                {/* Badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-semibold shadow-lg">
                  For Presenters
                </div>

                <div className="p-8 pt-12">
                  {/* Icon and Title */}
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/25">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-surface-900 mb-2">
                      Author Registration
                    </h2>
                    <p className="text-surface-600">
                      Submit your research and present at the conference
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="text-center mb-8 p-6 bg-primary-50 rounded-xl">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-4xl font-bold text-primary-600">$199</span>
                      <span className="text-surface-500">/person</span>
                    </div>
                    <p className="text-sm text-surface-600 mt-2">Early bird pricing available</p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    <p className="text-sm font-semibold text-surface-700 uppercase tracking-wide mb-4">
                      What's Included:
                    </p>
                    {authorFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-primary-600" />
                        </div>
                        <span className="text-surface-700">{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    size="lg"
                    className="w-full"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                    onClick={() => navigate('/register?role=author')}
                  >
                    Register as Author
                  </Button>

                  <p className="text-xs text-surface-500 text-center mt-4">
                    * Includes paper submission platform access
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Attendee Registration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="relative h-full border-2 border-accent-200 hover:border-accent-300 hover:shadow-glass-lg transition-all">
                {/* Badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-gradient-to-r from-accent-500 to-primary-500 text-white text-sm font-semibold shadow-lg">
                  For Participants
                </div>

                <div className="p-8 pt-12">
                  {/* Icon and Title */}
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-primary-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-accent-500/25">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-surface-900 mb-2">
                      Attendee Registration
                    </h2>
                    <p className="text-surface-600">
                      Attend sessions and network with the community
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="text-center mb-8 p-6 bg-accent-50 rounded-xl">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-4xl font-bold text-accent-600">$149</span>
                      <span className="text-surface-500">/person</span>
                    </div>
                    <p className="text-sm text-surface-600 mt-2">Limited seats available</p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    <p className="text-sm font-semibold text-surface-700 uppercase tracking-wide mb-4">
                      What's Included:
                    </p>
                    {attendeeFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-accent-600" />
                        </div>
                        <span className="text-surface-700">{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-accent-500 to-primary-500 hover:from-accent-600 hover:to-primary-600"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                    onClick={() => navigate('/register?role=attendee')}
                  >
                    Register as Attendee
                  </Button>

                  <p className="text-xs text-surface-500 text-center mt-4">
                    * Access to all conference sessions and materials
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <Card className="max-w-4xl mx-auto bg-gradient-to-br from-surface-50 to-white">
              <div className="p-8">
                <h3 className="text-xl font-semibold text-surface-900 mb-4">
                  Why Attend?
                </h3>
                <div className="grid md:grid-cols-3 gap-6 text-left">
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center mb-3">
                      <Users className="w-5 h-5 text-primary-600" />
                    </div>
                    <h4 className="font-semibold text-surface-900 mb-2">Network</h4>
                    <p className="text-sm text-surface-600">
                      Connect with 500+ researchers and industry leaders from around the world
                    </p>
                  </div>
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center mb-3">
                      <BookOpen className="w-5 h-5 text-accent-600" />
                    </div>
                    <h4 className="font-semibold text-surface-900 mb-2">Learn</h4>
                    <p className="text-sm text-surface-600">
                      Gain insights from cutting-edge research and hands-on workshops
                    </p>
                  </div>
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mb-3">
                      <Award className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h4 className="font-semibold text-surface-900 mb-2">Grow</h4>
                    <p className="text-sm text-surface-600">
                      Advance your career with new skills, connections, and opportunities
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-surface-900 text-surface-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">Confero</span>
            </div>
            <p className="text-sm">© 2024 Confero. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
