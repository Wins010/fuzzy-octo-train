import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, ArrowRight, Eye, EyeOff, Github, Chrome } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
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
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-surface-500 mt-2">
              {isLogin
                ? 'Sign in to access your conference dashboard'
                : 'Get started with managing your research conferences'}
            </p>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button variant="secondary" className="w-full">
              <Chrome className="w-5 h-5" />
              Google
            </Button>
            <Button variant="secondary" className="w-full">
              <Github className="w-5 h-5" />
              GitHub
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-surface-50 text-surface-500">or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}

            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-surface-400 hover:text-surface-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-surface-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm text-surface-600">Remember me</span>
                </label>
                <button type="button" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  Forgot password?
                </button>
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" rightIcon={<ArrowRight className="w-5 h-5" />}>
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          {/* Toggle */}
          <p className="text-center text-surface-500 mt-6">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          {/* Demo notice */}
          <div className="mt-8 p-4 bg-primary-50 rounded-xl border border-primary-100">
            <p className="text-sm text-primary-700">
              <strong>Demo Mode:</strong> Click sign in to explore the dashboard with sample data.
            </p>
          </div>
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
              Manage conferences with confidence
            </h2>
            <p className="text-white/80 text-lg mb-12">
              Join thousands of researchers and organizers who trust Confero 
              for seamless abstract submissions, peer reviews, and event management.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 text-left">
              {[
                'Abstract Submission',
                'Peer Review System',
                'Schedule Management',
                'Analytics Dashboard',
              ].map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <span className="text-sm">{feature}</span>
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
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute bottom-20 right-32 w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm"
          />
        </div>
      </div>
    </div>
  );
}
