import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { Person, SCHOLARSHIP_PROGRAM_LABEL } from '../types';

interface ProfileModalProps {
  person: Person;
  onClose: () => void;
  canEdit: boolean;
  onEdit: () => void;
}

export function ProfileModal({ person, onClose, canEdit, onEdit }: ProfileModalProps) {
  const normalizedEmail = person.email.trim();
  const hasEmail = normalizedEmail.length > 0;
  const hasLinkedin = person.linkedin.trim().length > 0;
  const hasInstagram = person.instagram.trim().length > 0;
  const emailHref = hasEmail ? `mailto:${encodeURIComponent(normalizedEmail)}` : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D3027]/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-[#FDFCF9] rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden relative border border-[#E6E4D9]"
      >
        <div className="flex justify-between items-center p-6 border-b border-[#E6E4D9]">
          <div>
            <h2 className="font-serif text-2xl text-[#5A5A40]">{person.name}</h2>
            <p className="text-sm text-[#6B705C] mt-1">
              {SCHOLARSHIP_PROGRAM_LABEL[person.scholarship_program]} • {person.major} • C/O{' '}
              {person.year}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {canEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="text-xs font-medium px-3 py-1.5 border border-[#E6E4D9] rounded-lg text-[#5A5A40] hover:bg-[#F1EFEC] transition-colors"
              >
                Edit Profile
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-[#8B8D7A] hover:text-[#5A5A40] transition-colors p-1 rounded-full hover:bg-[#F1EFEC]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-[#6B705C] leading-relaxed">{person.bio}</p>

          <div className="flex flex-wrap gap-2">
            {person.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-[#E9EDC9] text-[#5A5A40] rounded-full text-xs font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#8B8D7A] mb-2">Courses I can assist with</p>
            <div className="flex flex-wrap gap-2">
              {person.courses.map((course) => (
                <span
                  key={course}
                  className="px-3 py-1 bg-white border border-[#E6E4D9] text-[#5A5A40] rounded-full text-xs font-semibold"
                >
                  {course}
                </span>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            {hasEmail ? (
              <a
                href={emailHref}
                className="px-3 py-2 bg-white border border-[#E6E4D9] rounded-xl hover:bg-[#F1EFEC] transition-colors block"
              >
                <p className="text-[10px] uppercase tracking-wider text-[#8B8D7A] mb-1">Email</p>
                <p className="text-sm text-[#2D3027] break-all">{normalizedEmail}</p>
              </a>
            ) : (
              <span className="text-sm text-center px-3 py-2 bg-[#F1EFEC] border border-[#E6E4D9] rounded-xl text-[#8B8D7A]">
                Email unavailable
              </span>
            )}
            {hasLinkedin ? (
              <a
                href={person.linkedin}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 bg-white border border-[#E6E4D9] rounded-xl hover:bg-[#F1EFEC] transition-colors block"
              >
                <p className="text-[10px] uppercase tracking-wider text-[#8B8D7A] mb-1">LinkedIn</p>
                <p className="text-sm text-[#2D3027]">View Profile</p>
              </a>
            ) : (
              <span className="text-sm text-center px-3 py-2 bg-[#F1EFEC] border border-[#E6E4D9] rounded-xl text-[#8B8D7A]">
                LinkedIn unavailable
              </span>
            )}
            {hasInstagram ? (
              <a
                href={person.instagram}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 bg-white border border-[#E6E4D9] rounded-xl hover:bg-[#F1EFEC] transition-colors block"
              >
                <p className="text-[10px] uppercase tracking-wider text-[#8B8D7A] mb-1">Instagram</p>
                <p className="text-sm text-[#2D3027]">Open Profile</p>
              </a>
            ) : (
              <span className="text-sm text-center px-3 py-2 bg-[#F1EFEC] border border-[#E6E4D9] rounded-xl text-[#8B8D7A]">
                Instagram unavailable
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
