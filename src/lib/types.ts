export type Spot = {
  isSpot: boolean;
  originalName: string;
  name: string;
  minPersons?: number;
  owner?: string;
  hash: string;
  hours: ReadonlyArray<number>;
};

export type Person = {
  email: string;
  name: string;
  phone?: string;
};

export type Volunteer = Person & {
  hours: ReadonlyArray<string>;
};
