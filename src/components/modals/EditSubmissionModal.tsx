import { useState, useEffect } from 'react';
import { AbstractSubmission, Author } from '@/types';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Badge from '@/components/ui/Badge';
import { X, Plus } from 'lucide-react';

interface EditSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: AbstractSubmission;
  onSave: (updates: Partial<AbstractSubmission>) => void;
}

export default function EditSubmissionModal({
  isOpen,
  onClose,
  submission,
  onSave,
}: EditSubmissionModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && submission) {
      setTitle(submission.title);
      setDescription(submission.description);
      setCategories([...submission.categories]);
      setKeywords([...submission.keywords]);
      setAuthors([...submission.authors]);
      setErrors({});
    }
  }, [isOpen, submission]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Abstract is required';
    }

    if (categories.length === 0) {
      newErrors.categories = 'At least one category is required';
    }

    if (keywords.length === 0) {
      newErrors.keywords = 'At least one keyword is required';
    }

    if (authors.length === 0) {
      newErrors.authors = 'At least one author is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      return;
    }

    onSave({
      title,
      description,
      categories,
      keywords,
      authors,
      updatedAt: new Date(),
    });

    onClose();
  };

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
      setErrors(prev => ({ ...prev, categories: '' }));
    }
  };

  const removeCategory = (category: string) => {
    setCategories(categories.filter(c => c !== category));
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
      setErrors(prev => ({ ...prev, keywords: '' }));
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const updateAuthor = (index: number, field: keyof Author, value: string | boolean) => {
    const newAuthors = [...authors];
    newAuthors[index] = { ...newAuthors[index], [field]: value };
    setAuthors(newAuthors);
  };

  const addAuthor = () => {
    setAuthors([
      ...authors,
      { name: '', email: '', affiliation: '', isCorresponding: false },
    ]);
  };

  const removeAuthor = (index: number) => {
    setAuthors(authors.filter((_, i) => i !== index));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Submission"
      description="Update the submission details"
      size="lg"
    >
      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors(prev => ({ ...prev, title: '' }));
            }}
            placeholder="Enter paper title"
            error={errors.title}
          />
        </div>

        {/* Abstract */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Abstract <span className="text-red-500">*</span>
          </label>
          <Textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors(prev => ({ ...prev, description: '' }));
            }}
            placeholder="Enter abstract"
            rows={6}
            error={errors.description}
          />
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Categories <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
              placeholder="Add category"
            />
            <Button variant="secondary" onClick={addCategory} leftIcon={<Plus className="w-4 h-4" />}>
              Add
            </Button>
          </div>
          {errors.categories && (
            <p className="text-xs text-red-500 mb-2">{errors.categories}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Badge key={cat} variant="primary" className="flex items-center gap-1">
                {cat}
                <button
                  onClick={() => removeCategory(cat)}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Keywords */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Keywords <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
              placeholder="Add keyword"
            />
            <Button variant="secondary" onClick={addKeyword} leftIcon={<Plus className="w-4 h-4" />}>
              Add
            </Button>
          </div>
          {errors.keywords && (
            <p className="text-xs text-red-500 mb-2">{errors.keywords}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {keywords.map((kw) => (
              <Badge key={kw} variant="surface" className="flex items-center gap-1">
                {kw}
                <button
                  onClick={() => removeKeyword(kw)}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Authors */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-surface-700">
              Authors <span className="text-red-500">*</span>
            </label>
            <Button variant="ghost" size="sm" onClick={addAuthor} leftIcon={<Plus className="w-4 h-4" />}>
              Add Author
            </Button>
          </div>
          {errors.authors && (
            <p className="text-xs text-red-500 mb-2">{errors.authors}</p>
          )}
          <div className="space-y-3">
            {authors.map((author, index) => (
              <div key={index} className="p-4 bg-surface-50 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-surface-700">Author {index + 1}</span>
                  {authors.length > 1 && (
                    <button
                      onClick={() => removeAuthor(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <Input
                  value={author.name}
                  onChange={(e) => updateAuthor(index, 'name', e.target.value)}
                  placeholder="Full name"
                />
                <Input
                  value={author.email}
                  onChange={(e) => updateAuthor(index, 'email', e.target.value)}
                  placeholder="Email"
                  type="email"
                />
                <Input
                  value={author.affiliation}
                  onChange={(e) => updateAuthor(index, 'affiliation', e.target.value)}
                  placeholder="Affiliation"
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={author.isCorresponding}
                    onChange={(e) => updateAuthor(index, 'isCorresponding', e.target.checked)}
                    className="rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-surface-600">Corresponding author</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </ModalFooter>
    </Modal>
  );
}
