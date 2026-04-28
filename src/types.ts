export interface Person {
  id: string;
  name: string;
  major: string;
  year: string;
  tags: string[];
  bio: string;
}

export type NewPerson = Omit<Person, 'id'>;
