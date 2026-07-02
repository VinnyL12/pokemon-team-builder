import express from "express";

const router = express.Router();

router.get("/search/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

    if (!response.ok) {
      res.status(404).json({ error: "Pokemon not found" });
      return;
    }

    const data = await response.json();

    const formattedData = {
      id: data.id,
      name: data.name,
      sprite: data.sprites.front_default,
      types: data.types.map((t: any) => t.type.name),
      stats: data.stats.map((s: any) => ({
        name: s.stat.name,
        value: s.base_stat,
      })),
    };

    res.json(formattedData);
  } catch (error) {
    console.error("Error fetching Pokemon data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
