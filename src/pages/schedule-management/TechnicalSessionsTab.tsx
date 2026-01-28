import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Users, Clock, MapPin, FileText, Upload, ChevronDown, ChevronRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import Input, { Textarea } from '@/components/ui/Input';
import { TechnicalSession, Paper } from '@/types';
import {
  getAllTechnicalSessions,
  saveTechnicalSession,
  updateTechnicalSession,
  deleteTechnicalSession,
  addPaperToSession,
  updatePaper,
  deletePaper,
} from '@/services/scheduleService';
import CSVImportModal from './CSVImportModal';

interface SessionFormData {
  sessionTitle: string;
  timeSlot: string;
  roomLocation: string;
  sessionChairs: string;
}

interface PaperFormData {
  paperId: string;
  paperTitle: string;
  authors: string;
}

export default function TechnicalSessionsTab() {
  const [sessions, setSessions] = useState<TechnicalSession[]>([]);
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isPaperModalOpen, setIsPaperModalOpen] = useState(false);
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<TechnicalSession | null>(null);
  const [editingPaper, setEditingPaper] = useState<Paper | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [sessionFormData, setSessionFormData] = useState<SessionFormData>({
    sessionTitle: '',
    timeSlot: '',
    roomLocation: '',
    sessionChairs: '',
  });
  const [paperFormData, setPaperFormData] = useState<PaperFormData>({
    paperId: '',
    paperTitle: '',
    authors: '',
  });
  const [sessionErrors, setSessionErrors] = useState<Partial<SessionFormData>>({});
  const [paperErrors, setPaperErrors] = useState<Partial<PaperFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    const allSessions = getAllTechnicalSessions();
    setSessions(allSessions);
  };

  const toggleSession = (sessionId: string) => {
    setExpandedSessions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sessionId)) {
        newSet.delete(sessionId);
      } else {
        newSet.add(sessionId);
      }
      return newSet;
    });
  };

  // Session Management
  const openCreateSessionModal = () => {
    setEditingSession(null);
    setSessionFormData({
      sessionTitle: '',
      timeSlot: '',
      roomLocation: '',
      sessionChairs: '',
    });
    setSessionErrors({});
    setIsSessionModalOpen(true);
  };

  const openEditSessionModal = (session: TechnicalSession) => {
    setEditingSession(session);
    setSessionFormData({
      sessionTitle: session.sessionTitle,
      timeSlot: session.timeSlot,
      roomLocation: session.roomLocation,
      sessionChairs: session.sessionChairs,
    });
    setSessionErrors({});
    setIsSessionModalOpen(true);
  };

  const closeSessionModal = () => {
    setIsSessionModalOpen(false);
    setEditingSession(null);
    setSessionFormData({
      sessionTitle: '',
      timeSlot: '',
      roomLocation: '',
      sessionChairs: '',
    });
    setSessionErrors({});
  };

  const validateSessionForm = (): boolean => {
    const newErrors: Partial<SessionFormData> = {};

    if (!sessionFormData.sessionTitle.trim()) {
      newErrors.sessionTitle = 'Session title is required';
    }
    if (!sessionFormData.timeSlot.trim()) {
      newErrors.timeSlot = 'Time slot is required';
    }
    if (!sessionFormData.roomLocation.trim()) {
      newErrors.roomLocation = 'Room location is required';
    }
    if (!sessionFormData.sessionChairs.trim()) {
      newErrors.sessionChairs = 'Session chairs are required';
    }

    setSessionErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSessionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSessionForm()) return;

    setIsLoading(true);
    try {
      if (editingSession) {
        updateTechnicalSession(editingSession.id, sessionFormData);
      } else {
        saveTechnicalSession({
          ...sessionFormData,
          createdBy: 'admin', // TODO: Get from auth context
        });
      }
      loadSessions();
      closeSessionModal();
    } catch (error) {
      console.error('Error saving session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSessionDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this session? All papers in this session will also be deleted.')) {
      deleteTechnicalSession(id);
      loadSessions();
    }
  };

  // Paper Management
  const openAddPaperModal = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setEditingPaper(null);
    setPaperFormData({
      paperId: '',
      paperTitle: '',
      authors: '',
    });
    setPaperErrors({});
    setIsPaperModalOpen(true);
  };

  const openEditPaperModal = (paper: Paper) => {
    setCurrentSessionId(paper.sessionId);
    setEditingPaper(paper);
    setPaperFormData({
      paperId: paper.paperId,
      paperTitle: paper.paperTitle,
      authors: paper.authors,
    });
    setPaperErrors({});
    setIsPaperModalOpen(true);
  };

  const closePaperModal = () => {
    setIsPaperModalOpen(false);
    setEditingPaper(null);
    setCurrentSessionId('');
    setPaperFormData({
      paperId: '',
      paperTitle: '',
      authors: '',
    });
    setPaperErrors({});
  };

  const validatePaperForm = (): boolean => {
    const newErrors: Partial<PaperFormData> = {};

    if (!paperFormData.paperId.trim()) {
      newErrors.paperId = 'Paper ID is required';
    }
    if (!paperFormData.paperTitle.trim()) {
      newErrors.paperTitle = 'Paper title is required';
    }
    if (!paperFormData.authors.trim()) {
      newErrors.authors = 'Authors are required';
    }

    setPaperErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaperSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePaperForm()) return;

    setIsLoading(true);
    try {
      if (editingPaper) {
        updatePaper(editingPaper.id, paperFormData);
      } else {
        const session = sessions.find(s => s.id === currentSessionId);
        addPaperToSession(currentSessionId, {
          ...paperFormData,
          displayOrder: session?.papers.length || 0,
        });
      }
      loadSessions();
      closePaperModal();
    } catch (error: any) {
      setPaperErrors({ paperId: error.message || 'Error adding paper' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaperDelete = (paperId: string) => {
    if (window.confirm('Are you sure you want to delete this paper?')) {
      deletePaper(paperId);
      loadSessions();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-surface-900">Technical Sessions</h2>
          <p className="text-sm text-surface-500 mt-1">
            Manage technical sessions and their associated papers
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setIsCSVModalOpen(true)}
            variant="secondary"
            leftIcon={<Upload className="w-4 h-4" />}
          >
            Import Papers
          </Button>
          <Button
            onClick={openCreateSessionModal}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Session
          </Button>
        </div>
      </div>

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <Card className="text-center py-12">
          <Users className="w-12 h-12 text-surface-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">No sessions yet</h3>
          <p className="text-surface-500 mb-4">
            Get started by creating your first technical session
          </p>
          <Button onClick={openCreateSessionModal} variant="secondary">
            Create Session
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => {
            const isExpanded = expandedSessions.has(session.id);
            return (
              <Card key={session.id} padding="none">
                {/* Session Header */}
                <div className="p-6 border-b border-surface-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleSession(session.id)}
                          className="p-1 hover:bg-surface-100 rounded transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-surface-600" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-surface-600" />
                          )}
                        </button>
                        <div>
                          <h3 className="text-lg font-semibold text-surface-900">
                            {session.sessionTitle}
                          </h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-surface-600">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{session.timeSlot}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{session.roomLocation}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{session.sessionChairs}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditSessionModal(session)}
                        leftIcon={<Edit2 className="w-4 h-4" />}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSessionDelete(session.id)}
                        leftIcon={<Trash2 className="w-4 h-4 text-red-500" />}
                        className="text-red-500 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Papers List */}
                {isExpanded && (
                  <div className="p-6 bg-surface-50/50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-medium text-surface-700">
                        Papers ({session.papers.length})
                      </h4>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => openAddPaperModal(session.id)}
                        leftIcon={<Plus className="w-3 h-3" />}
                      >
                        Add Paper
                      </Button>
                    </div>

                    {session.papers.length === 0 ? (
                      <div className="text-center py-8 bg-white rounded-xl border border-surface-100">
                        <FileText className="w-8 h-8 text-surface-300 mx-auto mb-2" />
                        <p className="text-sm text-surface-500">No papers in this session</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {session.papers
                          .sort((a, b) => a.displayOrder - b.displayOrder)
                          .map((paper) => (
                            <div
                              key={paper.id}
                              className="bg-white rounded-lg border border-surface-100 p-4 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                                      {paper.paperId}
                                    </span>
                                  </div>
                                  <h5 className="font-medium text-surface-900 mb-1">
                                    {paper.paperTitle}
                                  </h5>
                                  <p className="text-sm text-surface-600">{paper.authors}</p>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEditPaperModal(paper)}
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handlePaperDelete(paper.id)}
                                    className="text-red-500 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Session Create/Edit Modal */}
      <Modal
        isOpen={isSessionModalOpen}
        onClose={closeSessionModal}
        title={editingSession ? 'Edit Technical Session' : 'Create Technical Session'}
        size="lg"
      >
        <form onSubmit={handleSessionSubmit}>
          <div className="space-y-4">
            <Input
              label="Session Title"
              placeholder="e.g., Machine Learning Applications"
              value={sessionFormData.sessionTitle}
              onChange={(e) =>
                setSessionFormData({ ...sessionFormData, sessionTitle: e.target.value })
              }
              error={sessionErrors.sessionTitle}
            />
            <Input
              label="Time Slot"
              placeholder="e.g., 2:00 PM - 4:00 PM"
              value={sessionFormData.timeSlot}
              onChange={(e) =>
                setSessionFormData({ ...sessionFormData, timeSlot: e.target.value })
              }
              error={sessionErrors.timeSlot}
            />
            <Input
              label="Room Location"
              placeholder="e.g., Room A-101"
              value={sessionFormData.roomLocation}
              onChange={(e) =>
                setSessionFormData({ ...sessionFormData, roomLocation: e.target.value })
              }
              error={sessionErrors.roomLocation}
            />
            <Input
              label="Session Chairs"
              placeholder="e.g., Dr. John Smith, Prof. Jane Doe"
              value={sessionFormData.sessionChairs}
              onChange={(e) =>
                setSessionFormData({ ...sessionFormData, sessionChairs: e.target.value })
              }
              error={sessionErrors.sessionChairs}
            />
          </div>

          <ModalFooter className="-mx-6 -mb-6 mt-6">
            <Button type="button" variant="secondary" onClick={closeSessionModal}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {editingSession ? 'Update Session' : 'Create Session'}
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Paper Add/Edit Modal */}
      <Modal
        isOpen={isPaperModalOpen}
        onClose={closePaperModal}
        title={editingPaper ? 'Edit Paper' : 'Add Paper'}
        size="lg"
      >
        <form onSubmit={handlePaperSubmit}>
          <div className="space-y-4">
            <Input
              label="Paper ID"
              placeholder="e.g., P-001"
              value={paperFormData.paperId}
              onChange={(e) =>
                setPaperFormData({ ...paperFormData, paperId: e.target.value })
              }
              error={paperErrors.paperId}
              disabled={!!editingPaper}
            />
            <Input
              label="Paper Title"
              placeholder="Enter paper title"
              value={paperFormData.paperTitle}
              onChange={(e) =>
                setPaperFormData({ ...paperFormData, paperTitle: e.target.value })
              }
              error={paperErrors.paperTitle}
            />
            <Textarea
              label="Authors"
              placeholder="Enter authors (comma-separated)"
              value={paperFormData.authors}
              onChange={(e) =>
                setPaperFormData({ ...paperFormData, authors: e.target.value })
              }
              error={paperErrors.authors}
              rows={3}
            />
          </div>

          <ModalFooter className="-mx-6 -mb-6 mt-6">
            <Button type="button" variant="secondary" onClick={closePaperModal}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {editingPaper ? 'Update Paper' : 'Add Paper'}
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* CSV Import Modal */}
      <CSVImportModal
        isOpen={isCSVModalOpen}
        onClose={() => setIsCSVModalOpen(false)}
        onImportComplete={loadSessions}
      />
    </div>
  );
}
