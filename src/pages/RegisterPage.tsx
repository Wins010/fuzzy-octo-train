import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, User, ArrowRight, Eye, EyeOff, UserCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { UserRole } from '@/types';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [searchParams] = useSearchParams();
  const roleFromUrl = searchParams.get('role');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Determine initial role based on URL parameter
  const getInitialRole = (): UserRole => {
    if (roleFromUrl === 'author') return 'Author';
    if (roleFromUrl === 'attendee') return 'Attendee';
    return 'Author'; // Default to Author if no valid role specified
  };
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: getInitialRole(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await register(formData);
      toast.success('Registration successful! Redirecting...');
      setTimeout(() => {
        navigate('/registration');
      }, 500);
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-surface-900">
              Confero
            </span>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-surface-900">
              Create an account
            </h1>
            <p className="text-surface-500 mt-2">
              Get started with managing your research conferences
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              leftIcon={<User className="w-4 h-4" />}
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['Author', 'Attendee'] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData({ ...formData, role })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.role === role
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-surface-200 hover:border-surface-300'
                    }`}
                  >
                    <UserCircle className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-sm font-medium">{role}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-surface-400 hover:text-surface-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-surface-400 hover:text-surface-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full" 
              rightIcon={<ArrowRight className="w-5 h-5" />}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Toggle */}
          <p className="text-center text-surface-500 mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 relative overflow-hidden">
        {/* Pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center max-w-lg"
          >
            <h2 className="text-4xl font-display font-bold mb-6">
              Join the conference community
            </h2>
            <p className="text-white/80 text-lg mb-12">
              Select your role and get access to powerful tools for managing
              research conferences and collaborating with peers.
            </p>

            {/* Role descriptions */}
            <div className="space-y-4 text-left">
              {[
                { role: 'Author', desc: 'Submit papers and present at the conference' },
                { role: 'Attendee', desc: 'Attend sessions and network with peers' },
              ].map((item, i) => (
                <motion.div
                  key={item.role}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <UserCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold">{item.role}</div>
                    <div className="text-sm text-white/70">{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Floating elements */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-20 right-20 w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm"
          />
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-32 left-16 w-16 h-16 rounded-xl bg-white/10 backdrop-blur-sm"
          />
        </div>
      </div>
    </div>
  );
}
