import AddIcon from "@mui/icons-material/Add";
import CatchingPokemonIcon from "@mui/icons-material/CatchingPokemon";
import CheckIcon from "@mui/icons-material/Check";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTeam, searchPokemon } from "../api";
import StatBars from "../components/StatBars";
import { getTypeColor } from "../constants/typeColors";
import type { Pokemon } from "../types";

const TEAM_SIZE = 6;

const Home = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState<Pokemon | null>(null);
  const [team, setTeam] = useState<Pokemon[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [teamName, setTeamName] = useState("");
  const [savedTeamInfo, setSavedTeamInfo] = useState<{
    name: string;
    slug: string;
  } | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await searchPokemon(searchInput.toLowerCase());
      setSearchResult(data);
    } catch (err) {
      setError("Pokemon not found");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToTeam = () => {
    if (!searchResult) return;
    if (team.length >= TEAM_SIZE) return;
    if (team.some((p) => p.id === searchResult.id)) {
      setError("This Pokémon is already on your team!");
      return;
    }
    setTeam([...team, searchResult]);
  };

  const handleSaveTeam = async () => {
    if (!teamName) {
      setError("Please enter a team name!");
      return;
    }
    if (team.length === 0) {
      setError("Please add at least one Pokémon to your team!");
      return;
    }

    try {
      const savedTeam = await createTeam(teamName, team);
      console.log("saved team:", savedTeam);

      setSavedTeamInfo({ name: savedTeam.name, slug: savedTeam.slug });
      setTeam([]);
      setTeamName("");
    } catch (err) {
      setError("Failed to save team");
    }
  };

  const handleCopyShareLink = async () => {
    if (!savedTeamInfo) return;
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/team/${savedTeamInfo.slug}`,
      );
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleViewSavedTeam = () => {
    if (!savedTeamInfo) return;
    navigate(`/team/${savedTeamInfo.slug}`);
  };

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
          py: { xs: 3, md: 2.5 },
        }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ alignItems: "center", mb: { xs: 2.5, md: 2 }, flexShrink: 0 }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              flexShrink: 0,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #8b3ce0, #c084fc)",
              boxShadow: "0 6px 16px rgba(139, 60, 224, 0.35)",
            }}
          >
            <CatchingPokemonIcon sx={{ color: "#fff", fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              Pokémon Team Builder
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Search for Pokémon and assemble your dream team of six.
            </Typography>
          </Box>
        </Stack>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2.5,
          }}
        >
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "auto",
              borderColor: "rgba(139, 60, 224, 0.15)",
            }}
          >
            <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0 }}>
              <TextField
                fullWidth
                size="small"
                label="Search for a Pokémon"
                variant="outlined"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={loading || !searchInput}
                sx={{ px: 3, minWidth: 48 }}
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SearchIcon fontSize="small" />
                )}
              </Button>
            </Stack>

            {error && (
              <Alert
                severity="error"
                sx={{ mt: 2, flexShrink: 0 }}
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            )}

            {!loading && searchResult !== null && (
              <Card
                variant="outlined"
                sx={{
                  mt: 2,
                  flex: 1,
                  minHeight: 0,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  borderColor: "rgba(139, 60, 224, 0.15)",
                }}
              >
                <Box
                  sx={{
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 1.5,
                    background: `radial-gradient(circle at 0% 0%, ${getTypeColor(
                      searchResult.types[0] ?? "",
                    )}33, transparent 70%)`,
                  }}
                >
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      flexShrink: 0,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "radial-gradient(circle, #fff 55%, rgba(139, 60, 224, 0.1) 100%)",
                      boxShadow: "inset 0 0 0 1px rgba(139, 60, 224, 0.15)",
                    }}
                  >
                    <Box
                      component="img"
                      src={searchResult.sprite}
                      alt={searchResult.name}
                      sx={{
                        width: 58,
                        height: 58,
                        imageRendering: "pixelated",
                        filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.15))",
                      }}
                    />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="subtitle1"
                      noWrap
                      sx={{ fontWeight: 700, textTransform: "capitalize" }}
                    >
                      {searchResult.name}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={0.5}
                      sx={{ mt: 0.5, flexWrap: "wrap", gap: 0.5 }}
                    >
                      {searchResult.types.map((type) => (
                        <Chip
                          key={type}
                          label={type}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: 11,
                            textTransform: "capitalize",
                            color: "#fff",
                            bgcolor: getTypeColor(type),
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                </Box>

                <Box
                  sx={{
                    flex: 1,
                    minHeight: 0,
                    overflow: "auto",
                    px: 2,
                    pb: 1.75,
                    pt: 0.5,
                  }}
                >
                  <StatBars stats={searchResult.stats} dense />
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddToTeam}
                  disabled={team.length >= TEAM_SIZE}
                  sx={{ borderRadius: 0, py: 1, flexShrink: 0 }}
                >
                  Add to Team
                </Button>
              </Card>
            )}

            {!loading && searchResult === null && (
              <Box
                sx={{
                  flex: 1,
                  minHeight: 0,
                  mt: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "text.secondary",
                  border: "2px dashed rgba(139, 60, 224, 0.15)",
                  borderRadius: 3,
                }}
              >
                <SearchIcon sx={{ fontSize: 32, mb: 1, opacity: 0.5 }} />
                <Typography variant="body2">
                  Search for a Pokémon to see its details here
                </Typography>
              </Box>
            )}
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              borderColor: "rgba(139, 60, 224, 0.15)",
            }}
          >
            <TextField
              fullWidth
              size="small"
              label="Team Name"
              variant="outlined"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              sx={{ mb: 2, flexShrink: 0 }}
            />

            <Stack
              direction="row"
              sx={{
                mb: 1.5,
                flexShrink: 0,
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Your Team
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {team.length} / {TEAM_SIZE}
              </Typography>
            </Stack>

            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gridTemplateRows: "repeat(2, 1fr)",
                gap: 1.5,
              }}
            >
              {Array(TEAM_SIZE)
                .fill(null)
                .map((_, index) => {
                  const pokemon = team[index];
                  return pokemon ? (
                    <Card
                      key={index}
                      variant="outlined"
                      sx={{
                        position: "relative",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 1,
                        borderColor: "rgba(139, 60, 224, 0.2)",
                        "&:hover .remove-btn": { opacity: 1 },
                      }}
                    >
                      <IconButton
                        className="remove-btn"
                        size="small"
                        onClick={() =>
                          setTeam(team.filter((_, i) => i !== index))
                        }
                        sx={{
                          position: "absolute",
                          top: 2,
                          right: 2,
                          p: 0.25,
                          opacity: { xs: 1, md: 0 },
                          transition: "opacity 0.15s",
                          bgcolor: "rgba(255,255,255,0.8)",
                          "&:hover": { bgcolor: "#fee2e2" },
                        }}
                      >
                        <CloseIcon fontSize="inherit" color="error" />
                      </IconButton>
                      <Box
                        component="img"
                        src={pokemon.sprite}
                        alt={pokemon.name}
                        sx={{
                          width: 44,
                          height: 44,
                          imageRendering: "pixelated",
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 600, textTransform: "capitalize" }}
                        noWrap
                      >
                        {pokemon.name}
                      </Typography>
                    </Card>
                  ) : (
                    <Box
                      key={index}
                      sx={{
                        border: "2px dashed rgba(139, 60, 224, 0.25)",
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Empty
                      </Typography>
                    </Box>
                  );
                })}
            </Box>

            <Button
              fullWidth
              variant="contained"
              onClick={handleSaveTeam}
              disabled={team.length === 0 || !teamName}
              sx={{ mt: 2, flexShrink: 0 }}
            >
              Save Team
            </Button>
          </Paper>
        </Box>
      </Container>

      <Dialog
        open={savedTeamInfo !== null}
        onClose={() => setSavedTeamInfo(null)}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 4,
              overflow: "hidden",
              width: 380,
              maxWidth: "90vw",
            },
          },
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            color: "#fff",
            py: 4,
            px: 3,
            background: "linear-gradient(135deg, #8b3ce0, #c084fc)",
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              mx: "auto",
              mb: 1.5,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(255,255,255,0.15)",
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 36 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Team Saved!
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
            "{savedTeamInfo?.name}" is ready to share
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            startIcon={linkCopied ? <CheckIcon /> : <ContentCopyIcon />}
            onClick={handleCopyShareLink}
            sx={{ mb: 2 }}
          >
            {linkCopied ? "Link Copied!" : "Copy Share Link"}
          </Button>

          <Button fullWidth variant="contained" onClick={handleViewSavedTeam}>
            View My Team
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => setSavedTeamInfo(null)}
            sx={{ mt: 1, color: "text.secondary" }}
          >
            Keep Building
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Home;
