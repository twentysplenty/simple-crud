import 'dotenv/config';
import { startSever } from './src/server';

const PORT = process.env.PORT || "4000";

startSever(PORT);

