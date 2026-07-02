import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import type { Pokemon } from "../types";

const STAT_MAX = 255;
const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

export const formatStatName = (name: string) =>
  STAT_LABELS[name.toLowerCase()] ??
  name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const StatBars = ({
  stats,
  dense = false,
}: {
  stats: Pokemon["stats"];
  dense?: boolean;
}) => (
  <Stack spacing={dense ? 0.4 : 1} sx={{ height: "100%", justifyContent: "space-between" }}>
    {stats.map((stat) => (
      <Box key={stat.name}>
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={dense ? { fontSize: 10, lineHeight: 1.1 } : undefined}
          >
            {formatStatName(stat.name)}
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, ...(dense ? { fontSize: 10, lineHeight: 1.1 } : {}) }}
          >
            {stat.value}
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={Math.min((stat.value / STAT_MAX) * 100, 100)}
          sx={{
            height: dense ? 3 : 6,
            borderRadius: 3,
            mt: dense ? 0.25 : 0.5,
            bgcolor: "rgba(139, 60, 224, 0.08)",
            "& .MuiLinearProgress-bar": {
              borderRadius: 3,
              background: "linear-gradient(90deg, #8b3ce0, #c084fc)",
            },
          }}
        />
      </Box>
    ))}
  </Stack>
);

export default StatBars;
