import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getAllGlobalEvents, getAllTechnicalSessions } from '@/services/scheduleService';
import { GlobalEvent, TechnicalSession } from '@/types';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
  Clock,
  MapPin,
  Users,
  Search,
  Filter,
  Edit,
  FileText,
  Printer,
  Globe,
  Presentation,
} from 'lucide-react';

type AgendaItem = {
  id: string;
  type: 'global' | 'technical';
  title: string;
  time: string;
  location: string;
  sessionChairs?: string;
  papers?: Array<{
    id: string;
    paperId: string;
    paperTitle: string;
    authors: string;
  }>;
  parsedTime: Date;
};

type SortOption = 'time' | 'title' | 'location';

export default function ConferenceAgendaPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('time');
  const [showFilters, setShowFilters] = useState(false);

  // Load data
  const globalEvents = useMemo(() => getAllGlobalEvents(), []);
  const technicalSessions = useMemo(() => getAllTechnicalSessions(), []);

  // Parse time string to Date for sorting
  const parseTime = (timeStr: string): Date => {
    try {
      // Handle various time formats: "09:00-10:30", "9:00 AM - 10:30 AM", etc.
      const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/);
      if (timeMatch) {
        const hour = parseInt(timeMatch[1]);
        const minute = parseInt(timeMatch[2]);
        const date = new Date();
        date.setHours(hour, minute, 0, 0);
        return date;
      }
    } catch (e) {
      console.error('Error parsing time:', e);
    }
    return new Date(0);
  };

  // Combine and transform data
  const allAgendaItems: AgendaItem[] = useMemo(() => {
    const items: AgendaItem[] = [];

    // Add global events
    globalEvents.forEach((event: GlobalEvent) => {
      items.push({
        id: event.id,
        type: 'global',
        title: event.title,
        time: event.time,
        location: event.location,
        parsedTime: parseTime(event.time),
      });
    });

    // Add technical sessions
    technicalSessions.forEach((session: TechnicalSession) => {
      items.push({
        id: session.id,
        type: 'technical',
        title: session.sessionTitle,
        time: session.timeSlot,
        location: session.roomLocation,
        sessionChairs: session.sessionChairs,
        papers: session.papers.map((paper) => ({
          id: paper.id,
          paperId: paper.paperId,
          paperTitle: paper.paperTitle,
          authors: paper.authors,
        })),
        parsedTime: parseTime(session.timeSlot),
      });
    });

    return items;
  }, [globalEvents, technicalSessions]);

  // Filter and sort agenda items
  const filteredAndSortedItems = useMemo(() => {
    let items = [...allAgendaItems];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter((item) => {
        // Search in title
        if (item.title.toLowerCase().includes(query)) return true;
        
        // Search in location
        if (item.location.toLowerCase().includes(query)) return true;
        
        // Search in time
        if (item.time.toLowerCase().includes(query)) return true;
        
        // Search in session chairs
        if (item.sessionChairs?.toLowerCase().includes(query)) return true;
        
        // Search in papers
        if (item.papers) {
          return item.papers.some(
            (paper) =>
              paper.paperId.toLowerCase().includes(query) ||
              paper.paperTitle.toLowerCase().includes(query) ||
              paper.authors.toLowerCase().includes(query)
          );
        }
        
        return false;
      });
    }

    // Apply sorting
    items.sort((a, b) => {
      switch (sortBy) {
        case 'time':
          return a.parsedTime.getTime() - b.parsedTime.getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'location':
          return a.location.localeCompare(b.location);
        default:
          return 0;
      }
    });

    return items;
  }, [allAgendaItems, searchQuery, sortBy]);

  const handlePrint = () => {
    window.print();
  };

  const handleEdit = () => {
    navigate('/schedule-management');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-surface-900 mb-2">
                Conference Agenda
              </h1>
              <p className="text-surface-600">
                Complete schedule of global events and technical sessions
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={handlePrint}
                className="print:hidden"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              {isAdmin && (
                <Button onClick={handleEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Schedule
                </Button>
              )}
            </div>
          </div>

          {/* Search and Filter Bar */}
          <Card className="print:hidden">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by session, paper title, author, paper ID, or time..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  />
                </div>

                {/* Sort Dropdown */}
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white"
                  >
                    <option value="time">Sort by Time</option>
                    <option value="title">Sort by Title</option>
                    <option value="location">Sort by Room</option>
                  </select>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </div>

              {/* Filter Stats */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-surface-200"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600">
                        {allAgendaItems.length}
                      </div>
                      <div className="text-sm text-surface-600">Total Items</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {globalEvents.length}
                      </div>
                      <div className="text-sm text-surface-600">Global Events</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {technicalSessions.length}
                      </div>
                      <div className="text-sm text-surface-600">Technical Sessions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">
                        {technicalSessions.reduce((acc, s) => acc + s.papers.length, 0)}
                      </div>
                      <div className="text-sm text-surface-600">Total Papers</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Count */}
        <div className="mb-4 text-surface-600 print:hidden">
          Showing {filteredAndSortedItems.length} of {allAgendaItems.length} items
          {searchQuery && (
            <span className="ml-2">
              for "<span className="font-semibold text-surface-900">{searchQuery}</span>"
            </span>
          )}
        </div>

        {/* Agenda Items Grid */}
        {filteredAndSortedItems.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-surface-300" />
              <h3 className="text-xl font-semibold text-surface-900 mb-2">
                No items found
              </h3>
              <p className="text-surface-600">
                {searchQuery
                  ? 'Try adjusting your search criteria'
                  : 'No agenda items have been scheduled yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAndSortedItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="break-inside-avoid"
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {item.type === 'global' ? (
                            <Badge variant="primary" className="bg-blue-100 text-blue-700">
                              <Globe className="w-3 h-3 mr-1" />
                              Global Event
                            </Badge>
                          ) : (
                            <Badge variant="primary" className="bg-purple-100 text-purple-700">
                              <Presentation className="w-3 h-3 mr-1" />
                              Technical Session
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl">{item.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Time and Location */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
                        <div className="flex items-center text-surface-600">
                          <Clock className="w-4 h-4 mr-2 text-primary-500" />
                          <span className="font-medium">{item.time}</span>
                        </div>
                        <div className="flex items-center text-surface-600">
                          <MapPin className="w-4 h-4 mr-2 text-primary-500" />
                          <span>{item.location}</span>
                        </div>
                      </div>

                      {/* Session Chairs */}
                      {item.sessionChairs && (
                        <div className="flex items-start text-sm">
                          <Users className="w-4 h-4 mr-2 text-primary-500 mt-0.5" />
                          <div>
                            <span className="font-medium text-surface-700">
                              Session Chairs:
                            </span>
                            <span className="ml-2 text-surface-600">
                              {item.sessionChairs}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Papers */}
                      {item.papers && item.papers.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-surface-200">
                          <h4 className="text-sm font-semibold text-surface-700 mb-3 flex items-center">
                            <FileText className="w-4 h-4 mr-2" />
                            Papers ({item.papers.length})
                          </h4>
                          <div className="space-y-3">
                            {item.papers.map((paper) => (
                              <div
                                key={paper.id}
                                className="bg-surface-50 rounded-lg p-3 hover:bg-surface-100 transition-colors"
                              >
                                <div className="flex items-start gap-3">
                                  <Badge
                                    variant="surface"
                                    className="text-xs font-mono shrink-0"
                                  >
                                    {paper.paperId}
                                  </Badge>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-medium text-surface-900 mb-1 text-sm">
                                      {paper.paperTitle}
                                    </h5>
                                    <p className="text-xs text-surface-600">
                                      {paper.authors}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .container {
            max-width: 100% !important;
            padding: 0 !important;
          }
          .grid {
            grid-template-columns: 1fr !important;
          }
          .shadow-lg {
            box-shadow: none !important;
          }
          .hover\\:shadow-lg {
            box-shadow: none !important;
          }
          .break-inside-avoid {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          h1 {
            font-size: 24pt !important;
            margin-bottom: 12pt !important;
          }
          h2, h3 {
            font-size: 16pt !important;
          }
          .card {
            border: 1px solid #e5e7eb !important;
            margin-bottom: 16pt !important;
          }
        }
      `}</style>
    </div>
  );
}
