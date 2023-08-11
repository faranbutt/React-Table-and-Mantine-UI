import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, serial } from 'drizzle-orm/pg-core';
import { PgTable,varchar,text,integer } from 'drizzle-orm/pg-core';
import { InferModel } from 'drizzle-orm';


neonConfig.fetchConnectionCache = true;
const sql = neon(process.env.DRIZZLE_DATABASE_URL!);

export const userTable = pgTable('users',{
    id: serial('id').primaryKey(),
    name:text('name').notNull(),
    email:text('email').notNull().unique(),
    city: text('city', { enum: ["ISLAMABAD", "NEWYORK","LONDON"] }).notNull()

}) 

export type User = InferModel<typeof userTable>
export type CreateUser = InferModel<typeof userTable,'insert'>



export const db = drizzle(sql);