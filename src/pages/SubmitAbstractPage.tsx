import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import {
  FileText,
  Plus,
  X,
  Check,
  ArrowLeft,
  ArrowRight,
  User,
  Mail,
  Building,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input, { Textarea } from '@/components/ui/Input';
import FileUpload from '@/components/ui/FileUpload';
import Badge from '@/components/ui/Badge';
import { categories } from '@/data/mockData';
import toast from 'react-hot-toast';

interface Author {
  name: string;
  email: string;
  affiliation: string;
  isCorresponding: boolean;
}

export default function SubmitAbstractPage() {
  const navigate = useNavigate();
  const { addSubmission } = useStore();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [authors, setAuthors] = useState<Author[]>([
    { name: '', email: '', affiliation: '', isCorresponding: true },
  ]);
  const [files, setFiles] = useState<File[]>([]);

  const steps = [
    { number: 1, title: 'Basic Info' },
    { number: 2, title: 'Authors' },
    { number: 3, title: 'Categories' },
    { number: 4, title: 'Files & Submit' },
  ];

  const addAuthor = () => {
    setAuthors([...authors, { name: '', email: '', affiliation: '', isCorresponding: false }]);
  };

  const removeAuthor = (index: number) => {
    if (authors.length > 1) {
      setAuthors(authors.filter((_, i) => i !== index));
    }
  };

  const updateAuthor = (index: number, field: keyof Author, value: string | boolean) => {
    const newAuthors = [...authors];
    if (field === 'isCorresponding' && value === true) {
      newAuthors.forEach((a) => (a.isCorresponding = false));
    }
    newAuthors[index] = { ...newAuthors[index], [field]: value };
    setAuthors(newAuthors);
  };

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else if (selectedCategories.length < 3) {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim() && keywords.length < 5) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (kw: string) => {
    setKeywords(keywords.filter((k) => k !== kw));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return title.trim() !== '' && description.trim().length >= 100;
      case 2:
        return authors.every((a) => a.name && a.email && a.affiliation);
      case 3:
        return selectedCategories.length > 0;
      case 4:
        return files.length > 0;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newSubmission = {
      id: `sub-${Date.now()}`,
      title,
      description,
      authors,
      categories: selectedCategories,
      keywords,
      files: files.map((f, i) => ({
        id: `file-${i}`,
        name: f.name,
        type: f.type,
        size: f.size,
        url: '#',
        uploadedAt: new Date(),
      })),
      status: 'pending' as const,
      submittedBy: 'user-1',
      submittedAt: new Date(),
      updatedAt: new Date(),
    };

    addSubmission(newSubmission);
    toast.success('Abstract submitted successfully!');
    navigate('/submissions');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-display font-bold text-surface-900"
        >
          Submit Abstract
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-surface-500 mt-1"
        >
          Share your research with the conference community
        </motion.p>
      </div>

      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between">
          {steps.map((s, index) => (
            <div key={s.number} className="flex items-center flex-1">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step > s.number
                      ? 'bg-primary-500 text-white'
                      : step === s.number
                      ? 'bg-primary-100 text-primary-600 ring-2 ring-primary-500'
                      : 'bg-surface-100 text-surface-400'
                  }`}
                >
                  {step > s.number ? <Check className="w-5 h-5" /> : s.number}
                </div>
                <span
                  className={`ml-3 font-medium hidden sm:block ${
                    step >= s.number ? 'text-surface-900' : 'text-surface-400'
                  }`}
                >
                  {s.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    step > s.number ? 'bg-primary-500' : 'bg-surface-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Form Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-surface-900 mb-4">
                  Basic Information
                </h2>
                <p className="text-surface-500 text-sm">
                  Provide the title and abstract of your submission
                </p>
              </div>

              <Input
                label="Title *"
                placeholder="Enter the title of your submission"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <Textarea
                label="Abstract *"
                placeholder="Enter your abstract (minimum 100 characters)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={8}
                hint={`${description.length} characters (minimum 100)`}
              />
            </div>
          )}

          {/* Step 2: Authors */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-surface-900 mb-4">Authors</h2>
                <p className="text-surface-500 text-sm">
                  Add all authors and their affiliations
                </p>
              </div>

              <div className="space-y-4">
                {authors.map((author, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-surface-50 rounded-xl space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-surface-700">
                        Author {index + 1}
                      </span>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={author.isCorresponding}
                            onChange={(e) =>
                              updateAuthor(index, 'isCorresponding', e.target.checked)
                            }
                            className="w-4 h-4 rounded border-surface-300 text-primary-500 focus:ring-primary-500"
                          />
                          <span className="text-xs text-surface-600">
                            Corresponding Author
                          </span>
                        </label>
                        {authors.length > 1 && (
                          <button
                            onClick={() => removeAuthor(index)}
                            className="p-1.5 rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <Input
                        placeholder="Full Name"
                        value={author.name}
                        onChange={(e) => updateAuthor(index, 'name', e.target.value)}
                        leftIcon={<User className="w-4 h-4" />}
                      />
                      <Input
                        placeholder="Email"
                        type="email"
                        value={author.email}
                        onChange={(e) => updateAuthor(index, 'email', e.target.value)}
                        leftIcon={<Mail className="w-4 h-4" />}
                      />
                      <Input
                        placeholder="Affiliation"
                        value={author.affiliation}
                        onChange={(e) => updateAuthor(index, 'affiliation', e.target.value)}
                        leftIcon={<Building className="w-4 h-4" />}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button
                variant="secondary"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={addAuthor}
              >
                Add Author
              </Button>
            </div>
          )}

          {/* Step 3: Categories */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-surface-900 mb-4">
                  Categories & Keywords
                </h2>
                <p className="text-surface-500 text-sm">
                  Select up to 3 categories and add relevant keywords
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-3">
                  Categories * (Select up to 3)
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedCategories.includes(cat)
                          ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                          : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-3">
                  Keywords (up to 5)
                </label>
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Add a keyword"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  />
                  <Button variant="secondary" onClick={addKeyword}>
                    Add
                  </Button>
                </div>
                {keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((kw) => (
                      <Badge key={kw} variant="surface">
                        {kw}
                        <button
                          onClick={() => removeKeyword(kw)}
                          className="ml-1.5 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Files & Submit */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-surface-900 mb-4">
                  Upload Files & Submit
                </h2>
                <p className="text-surface-500 text-sm">
                  Upload your paper and any supporting documents
                </p>
              </div>

              <FileUpload
                label="Upload Files *"
                onFilesChange={setFiles}
                hint="Supported formats: PDF, DOC, DOCX, PPT, PPTX (max 10MB)"
              />

              {/* Summary */}
              <div className="bg-surface-50 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-surface-900">Submission Summary</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-surface-500">Title:</span>
                    <p className="text-surface-900 font-medium truncate">{title}</p>
                  </div>
                  <div>
                    <span className="text-surface-500">Authors:</span>
                    <p className="text-surface-900 font-medium">
                      {authors.filter((a) => a.name).map((a) => a.name).join(', ')}
                    </p>
                  </div>
                  <div>
                    <span className="text-surface-500">Categories:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedCategories.map((cat) => (
                        <Badge key={cat} variant="primary" size="sm">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-surface-500">Files:</span>
                    <p className="text-surface-900 font-medium">{files.length} file(s)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-surface-100">
            <Button
              variant="ghost"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => (step > 1 ? setStep(step - 1) : navigate('/submissions'))}
            >
              {step > 1 ? 'Previous' : 'Cancel'}
            </Button>

            {step < 4 ? (
              <Button
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
              >
                Continue
              </Button>
            ) : (
              <Button
                leftIcon={<Check className="w-4 h-4" />}
                onClick={handleSubmit}
                disabled={!canProceed()}
                isLoading={isSubmitting}
              >
                Submit Abstract
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
