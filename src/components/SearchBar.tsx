import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="py-8 flex justify-center bg-[#F9F8F3]">
      <div className="relative w-full max-w-[600px] px-4 md:px-0">
        <input
          type="text"
          className="w-full px-6 py-4 bg-white border border-[#DEDCCA] rounded-full shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 placeholder:text-[#B0AE9D] transition-shadow"
          placeholder="Search a skill, major, or topic (e.g. 'React', 'Internships')"
          value={value}
          onChange={onChange}
        />
        <div className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 bg-[#5A5A40] text-white px-4 py-2 rounded-full text-sm font-medium items-center pointer-events-none">
          Search
        </div>
      </div>
    </div>
  );
}
