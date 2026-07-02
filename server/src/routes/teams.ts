import express from "express";
import prisma from "../lib/prisma";

const router = express.Router();

router.post("/", async (req, res) => {
  const { teamName, pokemon } = req.body;
  const slug = teamName.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();

  try {
    const team = await prisma.team.create({
      data: {
        name: teamName,
        slug,
        pokemon: JSON.stringify(pokemon),
      },
    });

    const parsedTeam = {
      ...team,
      pokemon: JSON.parse(team.pokemon),
    };

    return res.json(parsedTeam);
  } catch (error) {
    console.error("Error creating team:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/", async (_req, res) => {
  try {
    const teams = await prisma.team.findMany();
    return res.json({ teams });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    const team = await prisma.team.findUnique({
      where: { slug },
    });

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    const parsedTeam = {
      ...team,
      pokemon: JSON.parse(team.pokemon),
    };

    return res.json(parsedTeam);
  } catch (error) {
    console.error("Error fetching team:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;