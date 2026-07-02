import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CatchingPokemonIcon from "@mui/icons-material/CatchingPokemon";
import CheckIcon from "@mui/icons-material/Check";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTeamsBySlug } from "../api";
import StatBars from "../components/StatBars";
import { getTypeColor } from "../constants/typeColors";
import type { Pokemon, Team } from "../types";

const PokemonShowcaseCard = ({
  pokemon,
  index,
}: {
  pokemon: Pokemon;
  index: number;
}) => {
  const accent = getTypeColor(pokemon.types[0] ?? "");

  return (
    <Card
      variant="outlined"
      sx={{
        position: "relative",
        height: "100%",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderColor: "rgba(139, 60, 224, 0.15)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 16px 32px rgba(139, 60, 224, 0.2)",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 8,
          left: 8,
          width: 22,
          height: 22,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "rgba(255,255,255,0.85)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          fontSize: 11,
          fontWeight: 700,
          color: "primary.dark",
        }}
      >
        {index + 1}
      </Box>

      <Box
        sx={{
          flexShrink: 0,
          textAlign: "center",
          pt: 1.25,
          pb: 0.5,
          px: 1.5,
          background: `radial-gradient(circle at 50% 0%, ${accent}33, transparent 70%)`,
        }}
      >
        <Box
          component="img"
          src={pokemon.sprite}
          alt={pokemon.name}
          sx={{
            width: 48,
            height: 48,
            imageRendering: "pixelated",
            filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.15))",
          }}
        />
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            textTransform: "capitalize",
            lineHeight: 1.15,
          }}
        >
          {pokemon.name}
        </Typography>
        <Stack
          direction="row"
          spacing={0.5}
          sx={{ mt: 0.4, justifyContent: "center", flexWrap: "wrap", gap: 0.5 }}
        >
          {pokemon.types.map((type) => (
            <Chip
              key={type}
              label={type}
              size="small"
              sx={{
                height: 16,
                fontSize: 9,
                textTransform: "capitalize",
                color: "#fff",
                bgcolor: getTypeColor(type),
              }}
            />
          ))}
        </Stack>
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
          px: 1.5,
          pb: 1,
          pt: 0.25,
        }}
      >
        <StatBars stats={pokemon.stats} dense />
      </Box>
    </Card>
  );
};

const TeamPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchTeam = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getTeamsBySlug(slug);
        console.log("team data:", data);
        setTeam(data);
      } catch (err) {
        setError("Team not found");
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [slug]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const renderCenteredState = (content: ReactNode) => (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        textAlign: "center",
        background:
          "radial-gradient(ellipse 900px 500px at 50% -10%, rgba(139, 60, 224, 0.16), transparent), #faf8ff",
      }}
    >
      {content}
    </Box>
  );

  if (loading) {
    return renderCenteredState(
      <>
        <CircularProgress />
        <Typography color="text.secondary">Loading your team...</Typography>
      </>,
    );
  }

  if (error || !team) {
    return renderCenteredState(
      <>
        <SentimentDissatisfiedIcon
          sx={{ fontSize: 48, color: "text.secondary" }}
        />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {error || "Team not found"}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{ mt: 1 }}
        >
          Back to Home
        </Button>
      </>,
    );
  }

  const createdLabel = new Date(team.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const count = team.pokemon.length;
  const smCols = Math.min(count, 2) || 1;
  const mdCols = Math.min(count, 3) || 1;
  const smRows = Math.ceil(count / smCols);
  const mdRows = Math.ceil(count / mdCols);

  return (
    <Box
      sx={{
        height: { xs: "auto", md: "100vh" },
        overflow: { xs: "visible", md: "hidden" },
        textAlign: "initial",
        background:
          "radial-gradient(ellipse 900px 500px at 50% -10%, rgba(139, 60, 224, 0.16), transparent), #faf8ff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          py: { xs: 3, md: 1.5 },
        }}
      >
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            mb: { xs: 2, md: 1 },
            flexShrink: 0,
          }}
        >
          <Button
            size="small"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/")}
            sx={{ color: "text.secondary" }}
          >
            Back
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
            onClick={handleCopyLink}
          >
            {copied ? "Copied!" : "Share Team"}
          </Button>
        </Stack>

        <Stack
          sx={{
            alignItems: "center",
            textAlign: "center",
            mb: { xs: 2.5, md: 1.25 },
            flexShrink: 0,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              fontSize: { xs: "1.75rem", md: "2.1rem" },
              lineHeight: 1.2,
              background: "linear-gradient(135deg, #8b3ce0, #c084fc)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {team.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            <CatchingPokemonIcon
              sx={{
                fontSize: 14,
                verticalAlign: "text-bottom",
                mr: 0.5,
                color: "primary.main",
              }}
            />
            {count} Pokémon · Created {createdLabel}
          </Typography>
        </Stack>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: `repeat(${smCols}, 1fr)`,
              md: `repeat(${mdCols}, 1fr)`,
            },
            gridTemplateRows: {
              xs: `repeat(${count}, minmax(220px, auto))`,
              sm: `repeat(${smRows}, 1fr)`,
              md: `repeat(${mdRows}, 1fr)`,
            },
            gap: { xs: 2, md: 2.5 },
          }}
        >
          {team.pokemon.map((pokemon, index) => (
            <PokemonShowcaseCard
              key={pokemon.id}
              pokemon={pokemon}
              index={index}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default TeamPage;
