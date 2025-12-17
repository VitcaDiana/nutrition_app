import 'dotenv/config';
import { PrismaClient } from '../../prisma/generated/prisma/client.js';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';


const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST || 'localhost',
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: Number(process.env.DATABASE_PORT) || 3306,
    connectionLimit: 5
});
export const prisma = new PrismaClient({
    adapter,
    log: ['query', 'error', 'warn'],
});