import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { supabase } from './lib/supabase';
import { NewPerson, Person } from './types';
import { SearchBar } from './components/SearchBar';
import { PersonCard } from './components/PersonCard';
import { AddPersonModal } from './components/AddPersonModal';

export default function App() {
  const [people, setPeople] = useState<Person[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadStudents = async () => {
      setIsLoading(true);
      setLoadError(null);

      const { data, error } = await supabase
        .from('students')
        .select('id, name, major, year, tags, bio')
        .order('created_at', { ascending: false });

      if (error) {
        setLoadError(error.message);
        setIsLoading(false);
        return;
      }

      setPeople(data ?? []);
      setIsLoading(false);
    };

    void loadStudents();
  }, []);

  // Derive filtered people dynamically based on the current search query
  const filteredPeople = useMemo(() => {
    if (!searchQuery.trim()) return people;
    
    const query = searchQuery.toLowerCase();
    
    return people.filter(person => {
      // Allow partial matching on tags, name, or major
      const matchTags = person.tags.some(tag => tag.toLowerCase().includes(query));
      const matchName = person.name.toLowerCase().includes(query);
      const matchMajor = person.major.toLowerCase().includes(query);
      
      return matchTags || matchName || matchMajor;
    });
  }, [people, searchQuery]);

  const handleAddPerson = async (newPerson: NewPerson) => {
    const { data, error } = await supabase
      .from('students')
      .insert({
        name: newPerson.name,
        major: newPerson.major,
        year: newPerson.year,
        tags: newPerson.tags,
        bio: newPerson.bio
      })
      .select('id, name, major, year, tags, bio')
      .single();

    if (error) {
      throw error;
    }

    setPeople(prev => [data, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] text-[#2D3027] font-sans flex flex-col overflow-x-hidden">
      {/* Header Section */}
      <header className="pt-8 pb-4 px-4 md:px-12 flex justify-between items-end border-b border-[#E6E4D9]">
        <div>
          <h1 className="text-3xl font-serif italic text-[#5A5A40] leading-tight flex items-center">
            Ervin Skill Match
          </h1>
          <p className="text-xs tracking-widest uppercase opacity-60 font-semibold mt-1">
            Academic Knowledge Network
          </p>
        </div>
        <div className="text-right text-xs text-[#8B8D7A] hidden sm:block">
          <span className="block mb-0.5">Cohort 2024–25</span>
          <span className="block font-medium">Living Directory • {people.length} Members Active</span>
        </div>
      </header>

      {/* Search Bar Section */}
      <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:flex-row px-4 md:px-12 py-8 gap-8">
        {/* Sidebar / Join Module */}
        <aside className="w-full md:w-72 flex flex-col gap-6 shrink-0 z-10">
          <div className="bg-white p-6 rounded-3xl border border-[#E6E4D9] shadow-sm">
            <h3 className="font-serif text-lg text-[#5A5A40] mb-4">Join the Network</h3>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full bg-[#5A5A40] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#4A4A35] transition-colors shadow-sm"
            >
              Add My Profile
            </button>
          </div>
          
          <div className="bg-[#F1EFEC] p-6 rounded-3xl hidden md:block">
            <p className="text-xs italic text-[#7C7E6A] leading-relaxed">
              "Legacy is about enabling access to knowledge. Share what you know, learn what you don't."
            </p>
          </div>
        </aside>

        {/* Results Grid */}
        <section className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-[#5A5A40] flex items-baseline">
              Matching Scholars 
              <span className="text-sm text-[#A5A58D] font-normal ml-2">
                ({filteredPeople.length} results)
              </span>
            </h2>
            <div className="hidden sm:flex gap-2">
              <span className="px-3 py-1 bg-white border border-[#DEDCCA] rounded-full text-xs text-[#8B8D7A]">All Majors</span>
              <span className="px-3 py-1 bg-white border border-[#DEDCCA] rounded-full text-xs text-[#8B8D7A]">All Years</span>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#E6E4D9] shadow-sm text-[#8B8D7A]">
              Loading students...
            </div>
          ) : loadError ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#E6E4D9] shadow-sm">
              <h3 className="text-lg font-medium text-[#5A5A40] mb-1">Unable to load students</h3>
              <p className="text-[#8B8D7A] text-sm">{loadError}</p>
            </div>
          ) : filteredPeople.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max"
            >
              <AnimatePresence mode="popLayout">
                {filteredPeople.map((person, index) => (
                  <PersonCard key={person.id} person={person} index={index} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#E6E4D9] shadow-sm"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F1EFEC] mb-4">
                <Search className="w-8 h-8 text-[#A5A58D]" />
              </div>
              <h3 className="text-lg font-medium text-[#5A5A40] mb-1">No matches found</h3>
              <p className="text-[#8B8D7A] text-sm">
                Try searching for a different skill, topic, or major.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 text-[#5A5A40] font-medium hover:text-[#2D3027] bg-[#E9EDC9] hover:bg-[#DEDCCA] rounded-lg transition-colors text-sm"
              >
                Clear search
              </button>
            </motion.div>
          )}
        </section>
      </main>

      {/* Sticky Footer */}
      <footer className="h-12 bg-[#5A5A40] flex items-center px-4 md:px-12 justify-between text-[10px] text-[#DEDCCA] uppercase tracking-[0.2em] font-medium shrink-0 mt-auto">
        <span className="hidden sm:inline">A Distributed Expertise Interface</span>
        <span>© {new Date().getFullYear()} Ervin Scholars Program</span>
      </footer>

      {/* Floating Add Person Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <AddPersonModal 
            onClose={() => setIsAddModalOpen(false)} 
            onAdd={handleAddPerson} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
