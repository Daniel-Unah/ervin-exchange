import React, { useState } from 'react';
import { NewPerson, ScholarshipProgram } from '../types';
import { X } from 'lucide-react';
import { motion } from 'motion/react';

type AddPersonFormState = {
  name: string;
  scholarship_program: ScholarshipProgram;
  major: string;
  year: string;
  tags: string;
  courses: string;
  bio: string;
  linkedin: string;
  email: string;
  instagram: string;
};

interface AddPersonModalProps {
  onClose: () => void;
  onAdd: (person: NewPerson) => Promise<void>;
  initialPerson?: NewPerson;
  title?: string;
  submitLabel?: string;
}

export function AddPersonModal({
  onClose,
  onAdd,
  initialPerson,
  title = 'Join the Network',
  submitLabel = 'Add Profile'
}: AddPersonModalProps) {
  const [formData, setFormData] = useState<AddPersonFormState>({
    name: initialPerson?.name ?? '',
    scholarship_program: initialPerson?.scholarship_program ?? 'Ervin',
    major: initialPerson?.major ?? '',
    year: initialPerson?.year ?? '',
    tags: initialPerson?.tags.join(', ') ?? '',
    courses: initialPerson?.courses.join(', ') ?? '',
    bio: initialPerson?.bio ?? '',
    linkedin: initialPerson?.linkedin ?? '',
    email: initialPerson?.email ?? '',
    instagram: initialPerson?.instagram ?? ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedName = formData.name.trim();
    const normalizedMajor = formData.major.trim();
    const normalizedBio = formData.bio.trim();
    const normalizedEmail = formData.email.trim().toLowerCase();
    const normalizedLinkedin = formData.linkedin.trim();
    const normalizedInstagram = formData.instagram.trim();

    const newPerson: NewPerson = {
      name: normalizedName,
      scholarship_program: formData.scholarship_program,
      major: normalizedMajor,
      year: formData.year.trim(),
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      courses: formData.courses.split(',').map(t => t.trim()).filter(Boolean),
      bio: normalizedBio,
      linkedin: normalizedLinkedin,
      email: normalizedEmail,
      instagram: normalizedInstagram
    };

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await onAdd(newPerson);
      onClose();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to add profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D3027]/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-[#FDFCF9] rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden relative border border-[#E6E4D9] flex flex-col"
      >
        <div className="flex justify-between items-center p-5 border-b border-[#E6E4D9]">
          <h2 className="font-serif text-xl text-[#5A5A40]">{title}</h2>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-[#8B8D7A] hover:text-[#5A5A40] transition-colors p-1 rounded-full hover:bg-[#F1EFEC]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-3 overflow-y-auto">
          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold opacity-50 block mb-1 text-[#2D3027]">Full Name</label>
            <input required type="text" maxLength={80} autoComplete="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#FDFCF9] border border-[#E6E4D9] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/30 transition-shadow" placeholder="e.g. Jane Doe" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-wider font-bold opacity-50 block mb-1 text-[#2D3027]">Major</label>
              <input required type="text" maxLength={80} value={formData.major} onChange={e => setFormData({...formData, major: e.target.value})} className="w-full bg-[#FDFCF9] border border-[#E6E4D9] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/30 transition-shadow" placeholder="Computer Science" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider font-bold opacity-50 block mb-1 text-[#2D3027]">Graduation Year</label>
              <input required type="number" min="2020" max="2100" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full bg-[#FDFCF9] border border-[#E6E4D9] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/30 transition-shadow" placeholder="2026" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider font-bold opacity-50 block mb-1 text-[#2D3027]">Scholarship program</label>
              <select
                required
                value={formData.scholarship_program}
                onChange={e =>
                  setFormData({ ...formData, scholarship_program: e.target.value as ScholarshipProgram })
                }
                className="w-full bg-[#FDFCF9] border border-[#E6E4D9] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/30 transition-shadow"
              >
                <option value="Ervin">Ervin</option>
                <option value="Rodriguez">Rodriguez</option>
                <option value="Danforth">Danforth</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold opacity-50 block mb-1 text-[#2D3027]">Tags (comma-separated)</label>
            <input required type="text" maxLength={300} value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="w-full bg-[#FDFCF9] border border-[#E6E4D9] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/30 transition-shadow" placeholder="e.g. React, UI/UX, Pre-Med" />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold opacity-50 block mb-1 text-[#2D3027]">Courses I can help with (comma-separated)</label>
            <input required type="text" maxLength={400} value={formData.courses} onChange={e => setFormData({...formData, courses: e.target.value})} className="w-full bg-[#FDFCF9] border border-[#E6E4D9] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/30 transition-shadow" placeholder="e.g. Intro to Computer Science, Intro to Psychology, General Chemistry" />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold opacity-50 block mb-1 text-[#2D3027]">Short Bio</label>
            <textarea required rows={3} maxLength={500} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full bg-[#FDFCF9] border border-[#E6E4D9] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/30 transition-shadow resize-none" placeholder="What are you currently working on?" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
            <label className="text-[10px] uppercase tracking-wider font-bold opacity-50 block mb-1 text-[#2D3027]">Email</label>
            <input required type="email" autoComplete="email" maxLength={120} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-[#FDFCF9] border border-[#E6E4D9] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/30 transition-shadow" placeholder="name@example.com" />
          </div>

            <div>
            <label className="text-[10px] uppercase tracking-wider font-bold opacity-50 block mb-1 text-[#2D3027]">LinkedIn</label>
            <input type="url" autoComplete="url" maxLength={200} value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} className="w-full bg-[#FDFCF9] border border-[#E6E4D9] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/30 transition-shadow" placeholder="https://linkedin.com/in/username (optional)" />
          </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold opacity-50 block mb-1 text-[#2D3027]">Instagram</label>
            <input type="url" autoComplete="url" maxLength={200} value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} className="w-full bg-[#FDFCF9] border border-[#E6E4D9] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/30 transition-shadow" placeholder="https://instagram.com/username (optional)" />
          </div>

          {submitError && (
            <p className="text-xs text-red-600">{submitError}</p>
          )}

          <div className="pt-3 flex justify-end gap-3 font-sans sticky bottom-0 bg-[#FDFCF9]">
            <button type="button" disabled={isSubmitting} onClick={onClose} className="px-4 py-2 flex-1 text-sm font-medium text-[#5A5A40] hover:bg-[#F1EFEC] border border-[#E6E4D9] rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 flex-1 text-sm font-medium text-white bg-[#5A5A40] rounded-xl hover:bg-[#4A4A35] shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? 'Saving...' : submitLabel}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
