import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { User } from '@supabase/supabase-js';
import { supabase, supabaseConfigError } from './lib/supabase';
import { NewPerson, Person } from './types';
import { SearchBar } from './components/SearchBar';
import { PersonCard } from './components/PersonCard';
import { AddPersonModal } from './components/AddPersonModal';
import { ProfileModal } from './components/ProfileModal';

export default function App() {
  const [people, setPeople] = useState<Person[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;

    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUser(data.user ?? null);
    };

    void loadUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const loadStudents = async () => {
      setIsLoading(true);
      setLoadError(null);

      if (supabaseConfigError) {
        setLoadError(supabaseConfigError);
        setIsLoading(false);
        return;
      }

      if (!supabase) {
        setLoadError('Supabase client is not initialized.');
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('students')
        .select('id, user_id, name, major, year, tags, courses, bio, linkedin, email, instagram')
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
      const matchCourses = person.courses.some(course => course.toLowerCase().includes(query));
      const matchName = person.name.toLowerCase().includes(query);
      const matchMajor = person.major.toLowerCase().includes(query);
      
      return matchTags || matchCourses || matchName || matchMajor;
    });
  }, [people, searchQuery]);

  const handleAddPerson = async (newPerson: NewPerson) => {
    if (supabaseConfigError || !supabase) {
      throw new Error(supabaseConfigError ?? 'Supabase client is not initialized.');
    }
    if (!currentUser) {
      throw new Error('Please sign in first so your profile is editable only by you.');
    }

    const { data, error } = await supabase
      .from('students')
      .insert({
        user_id: currentUser.id,
        name: newPerson.name,
        major: newPerson.major,
        year: newPerson.year,
        tags: newPerson.tags,
        courses: newPerson.courses,
        bio: newPerson.bio,
        linkedin: newPerson.linkedin,
        email: newPerson.email,
        instagram: newPerson.instagram
      })
      .select('id, user_id, name, major, year, tags, courses, bio, linkedin, email, instagram')
      .single();

    if (error) {
      throw error;
    }

    setPeople(prev => [data, ...prev]);
  };

  const handleUpdatePerson = async (updatedPerson: NewPerson) => {
    if (supabaseConfigError || !supabase) {
      throw new Error(supabaseConfigError ?? 'Supabase client is not initialized.');
    }
    if (!currentUser || !selectedPerson) {
      throw new Error('Please sign in to edit your profile.');
    }

    const { data, error } = await supabase
      .from('students')
      .update({
        name: updatedPerson.name,
        major: updatedPerson.major,
        year: updatedPerson.year,
        tags: updatedPerson.tags,
        courses: updatedPerson.courses,
        bio: updatedPerson.bio,
        linkedin: updatedPerson.linkedin,
        email: updatedPerson.email,
        instagram: updatedPerson.instagram
      })
      .eq('id', selectedPerson.id)
      .select('id, user_id, name, major, year, tags, courses, bio, linkedin, email, instagram')
      .single();

    if (error) {
      throw error;
    }

    setPeople(prev => prev.map((person) => (person.id === data.id ? data : person)));
    setSelectedPerson(data);
    setIsEditModalOpen(false);
  };

  const handleSignIn = async () => {
    if (!supabase || !authEmail.trim()) return;
    setIsAuthLoading(true);
    setAuthMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email: authEmail.trim(),
      options: {
        emailRedirectTo: window.location.origin
      }
    });

    if (error) {
      setAuthMessage(error.message);
    } else {
      setAuthMessage('Check your email for a sign-in link.');
    }

    setIsAuthLoading(false);
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setAuthMessage('Signed out.');
  };

  const selectedPersonDraft: NewPerson | null = selectedPerson
    ? {
        name: selectedPerson.name,
        major: selectedPerson.major,
        year: selectedPerson.year,
        tags: selectedPerson.tags,
        courses: selectedPerson.courses,
        bio: selectedPerson.bio,
        linkedin: selectedPerson.linkedin,
        email: selectedPerson.email,
        instagram: selectedPerson.instagram
      }
    : null;

  return (
    <div className="min-h-screen bg-[#FDFCF9] text-[#2D3027] font-sans flex flex-col overflow-x-hidden">
      {/* Header Section */}
      <header className="pt-8 pb-4 px-4 md:px-12 flex justify-between items-end border-b border-[#E6E4D9]">
        <div>
          <h1 className="text-3xl font-serif italic text-[#5A5A40] leading-tight flex items-center">
            Ervin Exchange
          </h1>
          <p className="text-xs tracking-widest uppercase opacity-60 font-semibold mt-1">
            Academic Knowledge Network
          </p>
        </div>
        <div className="text-right text-xs text-[#8B8D7A] hidden sm:block">
          <span className="block mb-0.5">Cohort 2025–26</span>
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

          <div className="bg-white p-6 rounded-3xl border border-[#E6E4D9] shadow-sm">
            <h3 className="font-serif text-lg text-[#5A5A40] mb-3">My Account</h3>
            {currentUser ? (
              <div className="space-y-2">
                <p className="text-xs text-[#6B705C] break-all">{currentUser.email}</p>
                <button
                  onClick={handleSignOut}
                  className="w-full bg-[#F1EFEC] text-[#5A5A40] py-2 rounded-xl text-sm font-medium hover:bg-[#E6E4D9] transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-[#FDFCF9] border border-[#E6E4D9] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/30 transition-shadow"
                  placeholder="your-email@wustl.edu"
                />
                <button
                  onClick={handleSignIn}
                  disabled={isAuthLoading || !authEmail.trim()}
                  className="w-full bg-[#5A5A40] text-white py-2 rounded-xl text-sm font-medium hover:bg-[#4A4A35] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isAuthLoading ? 'Sending...' : 'Send Sign-In Link'}
                </button>
              </div>
            )}
            {authMessage && <p className="text-xs text-[#8B8D7A] mt-2">{authMessage}</p>}
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
                  <PersonCard key={person.id} person={person} index={index} onOpen={setSelectedPerson} />
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
      <footer className="h-12 bg-[#5A5A40] flex items-center px-4 md:px-12 justify-end text-[10px] text-[#DEDCCA] uppercase tracking-[0.2em] font-medium shrink-0 mt-auto">
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
        {selectedPerson && !isEditModalOpen && (
          <ProfileModal
            person={selectedPerson}
            onClose={() => {
              setSelectedPerson(null);
              setIsEditModalOpen(false);
            }}
            canEdit={selectedPerson.user_id === currentUser?.id}
            onEdit={() => setIsEditModalOpen(true)}
          />
        )}
        {isEditModalOpen && selectedPersonDraft && (
          <AddPersonModal
            title="Edit My Profile"
            submitLabel="Save Changes"
            initialPerson={selectedPersonDraft}
            onClose={() => setIsEditModalOpen(false)}
            onAdd={handleUpdatePerson}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
