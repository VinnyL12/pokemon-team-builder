import type { Pokemon, Team } from "../types";

export const searchPokemon = async (name: string): Promise<Pokemon> => {
  try {
    const response = await fetch(`/api/pokemon/search/${name}`);

    if (!response.ok) {
      throw new Error("Pokemon not found");
    }

    const data = await response.json();
    return data as Pokemon;
  } catch (error) {
    console.error("Error searching for Pokemon:", error);
    throw new Error("Failed to search for Pokemon");
  }
};

export const getAllTeams = async (): Promise<Team[]> => {
  try {
    const response = await fetch("/api/teams");

    if (!response.ok) {
      throw new Error("Failed to fetch teams");
    }

    const data = await response.json();
    return data as Team[];
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw new Error("Failed to fetch teams");
  }
};

export const getTeamsBySlug = async (slug: string): Promise<Team> => {
  try {
    const response = await fetch(`/api/teams/${slug}`);

    if (!response.ok) {
      throw new Error("Failed to fetch teams by slug");
    }

    const data = await response.json();
    return data as Team;
  } catch (error) {
    console.error("Error fetching teams by slug:", error);
    throw new Error("Failed to fetch teams by slug");
  }
};

export const createTeam = async (
  teamName: string,
  pokemon: Pokemon[],
): Promise<Team> => {
  try {
    const response = await fetch("/api/teams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ teamName, pokemon }),
    });

    if (!response.ok) {
      throw new Error("Failed to create team");
    }

    const data = await response.json();
    return data as Team;
  } catch (error) {
    console.error("Error creating team:", error);
    throw new Error("Failed to create team");
  }
};
