import 'dotenv/config';
import { startServer } from './src/server';

const PORT = process.env.PORT || "4000";

startServer(PORT);

