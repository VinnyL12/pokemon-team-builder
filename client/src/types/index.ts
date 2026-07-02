export interface Pokemon {
  id: number;
  name: string;
  sprite: string;
  types: string[];
  stats: { name: string; value: number }[];
}

export interface Team {
  id: number;
  name: string;
  slug: string;
  pokemon: Pokemon[];
  createdAt: string;
}