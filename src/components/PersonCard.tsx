import { Person, SCHOLARSHIP_PROGRAM_LABEL } from '../types';
import { motion } from 'motion/react';

interface PersonCardProps {
  key?: string;
  person: Person;
  index: number;
  onOpen: (person: Person) => void;
}

export function PersonCard({ person, index, onOpen }: PersonCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="bg-white p-6 rounded-[32px] border border-[#E6E4D9] hover:shadow-md transition-shadow group shrink-0 cursor-pointer"
      onClick={() => onOpen(person)}
    >
      <div className="flex-1">
        <div className="flex justify-between mb-3 items-start gap-2">
          <div className="min-w-0">
            <h4 className="font-bold text-lg group-hover:text-[#5A5A40] transition-colors leading-tight text-[#2D3027]">
              {person.name}
            </h4>
            <p className="text-[10px] font-semibold text-[#8B8D7A] tracking-wide uppercase mt-1 truncate">
              {SCHOLARSHIP_PROGRAM_LABEL[person.scholarship_program]}
            </p>
          </div>
          <span className="text-[10px] font-bold px-2 py-1 bg-[#F1EFEC] rounded-md text-[#8B8D7A] shrink-0">
            C/O {person.year}
          </span>
        </div>
        <p className="text-xs text-[#5A5A40] font-semibold mb-2">{person.major}</p>
        <p className="text-sm text-[#6B705C] line-clamp-2 mb-4 leading-relaxed">
          {person.bio}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {person.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 bg-[#E9EDC9] text-[#5A5A40] rounded-full text-[10px] font-bold"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-4 text-xs font-medium text-[#8B8D7A]">Click to view full profile</p>
      </div>
    </motion.div>
  );
}
