export type ScholarshipProgram = 'Ervin' | 'Rodriguez' | 'Danforth';

export const SCHOLARSHIP_PROGRAM_LABEL: Record<ScholarshipProgram, string> = {
  Ervin: 'Ervin Scholar',
  Rodriguez: 'Rodriguez Scholar',
  Danforth: 'Danforth Scholar'
};

export interface Person {
  id: string;
  user_id: string | null;
  name: string;
  scholarship_program: ScholarshipProgram;
  major: string;
  year: string;
  tags: string[];
  courses: string[];
  bio: string;
  linkedin: string;
  email: string;
  instagram: string;
}

export type NewPerson = Omit<Person, 'id' | 'user_id'>;
