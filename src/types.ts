export interface Person {
  id: string;
  user_id: string | null;
  name: string;
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
