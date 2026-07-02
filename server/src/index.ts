import express from 'express';
import cors from 'cors';
import pokemonRoutes from './routes/pokemon';
import teamRoutes from './routes/teams';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use('/api/pokemon', pokemonRoutes);
app.use('/api/teams', teamRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
