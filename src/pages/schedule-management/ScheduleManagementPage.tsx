import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users } from 'lucide-react';
import Card from '@/components/ui/Card';
import GlobalEventsTab from './GlobalEventsTab';
import TechnicalSessionsTab from './TechnicalSessionsTab';

type TabType = 'global' | 'technical';

export default function ScheduleManagementPage() {
  const [activeTab, setActiveTab] = useState<TabType>('global');

  const tabs = [
    { id: 'global' as TabType, label: 'Global Events', icon: Calendar },
    { id: 'technical' as TabType, label: 'Technical Sessions', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-primary-50/20 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-surface-900 mb-2">
            Schedule Management
          </h1>
          <p className="text-surface-600">
            Manage global events and technical sessions for the conference
          </p>
        </div>

        {/* Tabs */}
        <Card className="mb-6" padding="none">
          <div className="flex border-b border-surface-100">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative flex items-center gap-2 px-6 py-4 font-medium transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'global' && <GlobalEventsTab />}
          {activeTab === 'technical' && <TechnicalSessionsTab />}
        </motion.div>
      </div>
    </div>
  );
}
