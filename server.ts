import app from './server-app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`[Damico Backend] Server running on http://localhost:${PORT}`);
});
