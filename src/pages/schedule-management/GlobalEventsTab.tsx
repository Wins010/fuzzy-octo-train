import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar, MapPin, Clock } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { GlobalEvent } from '@/types';
import {
  getAllGlobalEvents,
  saveGlobalEvent,
  updateGlobalEvent,
  deleteGlobalEvent,
} from '@/services/scheduleService';

interface EventFormData {
  title: string;
  time: string;
  location: string;
}

export default function GlobalEventsTab() {
  const [events, setEvents] = useState<GlobalEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<GlobalEvent | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    time: '',
    location: '',
  });
  const [errors, setErrors] = useState<Partial<EventFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    const allEvents = getAllGlobalEvents();
    setEvents(allEvents);
  };

  const openCreateModal = () => {
    setEditingEvent(null);
    setFormData({ title: '', time: '', location: '' });
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (event: GlobalEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      time: event.time,
      location: event.location,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
    setFormData({ title: '', time: '', location: '' });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<EventFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.time.trim()) {
      newErrors.time = 'Time is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (editingEvent) {
        updateGlobalEvent(editingEvent.id, formData);
      } else {
        saveGlobalEvent({
          ...formData,
          eventType: 'Global Event',
          createdBy: 'admin', // TODO: Get from auth context
        });
      }
      loadEvents();
      closeModal();
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteGlobalEvent(id);
      loadEvents();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-surface-900">Global Events</h2>
          <p className="text-sm text-surface-500 mt-1">
            Manage conference-wide events like registration, keynotes, and breaks
          </p>
        </div>
        <Button onClick={openCreateModal} leftIcon={<Plus className="w-4 h-4" />}>
          Add Event
        </Button>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <Card className="text-center py-12">
          <Calendar className="w-12 h-12 text-surface-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">No events yet</h3>
          <p className="text-surface-500 mb-4">
            Get started by creating your first global event
          </p>
          <Button onClick={openCreateModal} variant="secondary">
            Create Event
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-surface-900">{event.title}</h3>
                  </div>
                  <div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-surface-600">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-surface-600">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(event)}
                    leftIcon={<Edit2 className="w-4 h-4" />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(event.id)}
                    leftIcon={<Trash2 className="w-4 h-4 text-red-500" />}
                    className="text-red-500 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingEvent ? 'Edit Global Event' : 'Create Global Event'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Event Title"
              placeholder="e.g., Opening Ceremony"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              error={errors.title}
            />
            <Input
              label="Time"
              placeholder="e.g., 9:00 AM - 10:00 AM"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              error={errors.time}
            />
            <Input
              label="Location"
              placeholder="e.g., Main Auditorium"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              error={errors.location}
            />
          </div>

          <ModalFooter className="-mx-6 -mb-6 mt-6">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {editingEvent ? 'Update Event' : 'Create Event'}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
