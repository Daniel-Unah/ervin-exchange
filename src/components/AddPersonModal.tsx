import React, { useState } from 'react';
import { Person } from '../types';
import { X } from 'lucide-react';
import { motion } from 'motion/react';

interface AddPersonModalProps {
  onClose: () => void;
  onAdd: (person: Person) => void;
}

export function AddPersonModal({ onClose, onAdd }: AddPersonModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    major: '',
    year: '',
    tags: '',
    bio: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPerson: Person = {
      id: Date.now().toString(),
      name: formData.name,
      major: formData.major,
      year: formData.year,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      bio: formData.bio
    };

    onAdd(newPerson);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D3027]/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-[#FDFCF9] rounded-3xl shadow-xl w-full max-w-md overflow-hidden relative border border-[#E6E4D9]"
      >
        <div className="flex justify-between items-center p-6 border-b border-[#E6E4D9]">
          <h2 className="font-serif text-xl text-[#5A5A40]">Join the Network</h2>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-[#8B8D7A] hover:text-[#5A5A40] transition-colors p-1 rounded-full hover:bg-[#F1EFEC]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold opacity-50 block mb-1 text-[#2D3027]">Full Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#FDFCF9] border border-[#E6E4D9] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/30 transition-shadow" placeholder="e.g. Jane Doe" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider font-bold opacity-50 block mb-1 text-[#2D3027]">Major</label>
              <input required type="text" value={formData.major} onChange={e => setFormData({...formData, major: e.target.value})} className="w-full bg-[#FDFCF9] border border-[#E6E4D9] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/30 transition-shadow" placeholder="Computer Science" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider font-bold opacity-50 block mb-1 text-[#2D3027]">Year</label>
              <select required value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full bg-[#FDFCF9] border border-[#E6E4D9] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/30 transition-shadow">
                <option value="" disabled>Select Year</option>
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Graduate">Graduate</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold opacity-50 block mb-1 text-[#2D3027]">Tags (comma-separated)</label>
            <input required type="text" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="w-full bg-[#FDFCF9] border border-[#E6E4D9] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/30 transition-shadow" placeholder="e.g. React, UI/UX, Pre-Med" />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold opacity-50 block mb-1 text-[#2D3027]">Short Bio</label>
            <textarea required rows={3} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full bg-[#FDFCF9] border border-[#E6E4D9] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/30 transition-shadow resize-none" placeholder="What are you currently working on?" />
          </div>

          <div className="pt-6 flex justify-end gap-3 font-sans">
            <button type="button" onClick={onClose} className="px-4 py-2 flex-1 text-sm font-medium text-[#5A5A40] hover:bg-[#F1EFEC] border border-[#E6E4D9] rounded-xl transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 flex-1 text-sm font-medium text-white bg-[#5A5A40] rounded-xl hover:bg-[#4A4A35] shadow-sm transition-colors">
              Add Profile
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
