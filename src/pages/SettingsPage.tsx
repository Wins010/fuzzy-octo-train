import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Palette,
  Shield,
  Globe,
  Mail,
  Camera,
  Save,
  Upload,
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input, { Textarea } from '@/components/ui/Input';
import { useStore } from '@/store/useStore';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'branding', label: 'Branding', icon: Palette },
  { id: 'security', label: 'Security', icon: Shield },
];

export default function SettingsPage() {
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    organization: user?.organization || '',
    bio: user?.bio || '',
  });
  const [brandingData, setBrandingData] = useState({
    conferenceName: 'AI & Machine Learning Conference 2024',
    primaryColor: '#636cf1',
    accentColor: '#d946ef',
  });
  const [notifications, setNotifications] = useState({
    emailSubmissions: true,
    emailReviews: true,
    emailDeadlines: true,
    pushNotifications: false,
    weeklyDigest: true,
  });

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-display font-bold text-surface-900"
        >
          Settings
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-surface-500 mt-1"
        >
          Manage your account and conference settings
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <Card padding="sm">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </Card>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3"
        >
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-24 h-24 rounded-2xl object-cover"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-3xl font-bold">
                          {user?.name.charAt(0)}
                        </div>
                      )}
                      <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-primary-500 text-white flex items-center justify-center shadow-lg hover:bg-primary-600 transition-colors">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <h3 className="font-semibold text-surface-900">{user?.name}</h3>
                      <p className="text-sm text-surface-500">{user?.role}</p>
                      <Button variant="ghost" size="sm" className="mt-2">
                        Change Photo
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Full Name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                    <Input
                      label="Organization"
                      value={profileData.organization}
                      onChange={(e) => setProfileData({ ...profileData, organization: e.target.value })}
                    />
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">Role</label>
                      <div className="px-4 py-3 rounded-xl bg-surface-50 border border-surface-200 text-surface-600 capitalize">
                        {user?.role}
                      </div>
                    </div>
                  </div>

                  <Textarea
                    label="Bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />

                  <div className="flex justify-end">
                    <Button leftIcon={<Save className="w-4 h-4" />} onClick={handleSave}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    {[
                      { key: 'emailSubmissions', label: 'Submission Updates', desc: 'Get notified when your submission status changes' },
                      { key: 'emailReviews', label: 'Review Assignments', desc: 'Receive alerts for new review assignments' },
                      { key: 'emailDeadlines', label: 'Deadline Reminders', desc: 'Get reminded about upcoming deadlines' },
                      { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive browser push notifications' },
                      { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Get a weekly summary of conference activity' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-surface-50 rounded-xl">
                        <div>
                          <p className="font-medium text-surface-900">{item.label}</p>
                          <p className="text-sm text-surface-500">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            notifications[item.key as keyof typeof notifications]
                              ? 'bg-primary-500'
                              : 'bg-surface-300'
                          }`}
                        >
                          <div
                            className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                              notifications[item.key as keyof typeof notifications]
                                ? 'translate-x-7'
                                : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <Button leftIcon={<Save className="w-4 h-4" />} onClick={handleSave}>
                      Save Preferences
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Branding Settings */}
          {activeTab === 'branding' && (
            <Card>
              <CardHeader>
                <CardTitle>Conference Branding</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Input
                    label="Conference Name"
                    value={brandingData.conferenceName}
                    onChange={(e) => setBrandingData({ ...brandingData, conferenceName: e.target.value })}
                  />

                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Conference Logo
                    </label>
                    <div className="border-2 border-dashed border-surface-200 rounded-xl p-6 text-center hover:border-primary-300 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-surface-400 mx-auto mb-2" />
                      <p className="text-sm text-surface-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-surface-400 mt-1">PNG, JPG up to 2MB</p>
                    </div>
                  </div>

                  {/* Color Picker */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Primary Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={brandingData.primaryColor}
                          onChange={(e) => setBrandingData({ ...brandingData, primaryColor: e.target.value })}
                          className="w-12 h-12 rounded-lg cursor-pointer border-0"
                        />
                        <Input
                          value={brandingData.primaryColor}
                          onChange={(e) => setBrandingData({ ...brandingData, primaryColor: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Accent Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={brandingData.accentColor}
                          onChange={(e) => setBrandingData({ ...brandingData, accentColor: e.target.value })}
                          className="w-12 h-12 rounded-lg cursor-pointer border-0"
                        />
                        <Input
                          value={brandingData.accentColor}
                          onChange={(e) => setBrandingData({ ...brandingData, accentColor: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preview */}
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Preview
                    </label>
                    <div className="p-6 rounded-xl" style={{ background: `linear-gradient(135deg, ${brandingData.primaryColor}, ${brandingData.accentColor})` }}>
                      <h3 className="text-white text-xl font-bold">{brandingData.conferenceName}</h3>
                      <p className="text-white/80 mt-2">June 15-17, 2024 • San Francisco, CA</p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button leftIcon={<Save className="w-4 h-4" />} onClick={handleSave}>
                      Save Branding
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-surface-900 mb-4">Change Password</h3>
                    <div className="space-y-4 max-w-md">
                      <Input type="password" label="Current Password" placeholder="Enter current password" />
                      <Input type="password" label="New Password" placeholder="Enter new password" />
                      <Input type="password" label="Confirm New Password" placeholder="Confirm new password" />
                    </div>
                  </div>

                  <div className="border-t border-surface-100 pt-6">
                    <h3 className="font-medium text-surface-900 mb-4">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between p-4 bg-surface-50 rounded-xl">
                      <div>
                        <p className="font-medium text-surface-900">Enable 2FA</p>
                        <p className="text-sm text-surface-500">Add an extra layer of security to your account</p>
                      </div>
                      <Button variant="secondary">Setup 2FA</Button>
                    </div>
                  </div>

                  <div className="border-t border-surface-100 pt-6">
                    <h3 className="font-medium text-surface-900 mb-4">Active Sessions</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-surface-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-surface-400" />
                          <div>
                            <p className="font-medium text-surface-900">Chrome on MacOS</p>
                            <p className="text-sm text-surface-500">San Francisco, CA • Current session</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">Active</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button leftIcon={<Save className="w-4 h-4" />} onClick={handleSave}>
                      Update Security
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
