import {timestamp, pgTable, varchar, uuid, boolean} from 'drizzle-orm/pg-core'
import {relations} from 'drizzle-orm'

export const usersTable = pgTable('users',{
    userId: uuid('userId').primaryKey().defaultRandom(),
    username: varchar('username', {length: 100}).unique().notNull(),
    password: varchar('password', {length: 100}).notNull(),
    refreshToken: varchar('refreshToken', {length: 500}),
    createdAt: timestamp('createdAt').defaultNow()
});

export const userRelations = relations(usersTable, ({many}) => ({
    journals: many(journalsTable)
}))

export const journalsTable = pgTable('journals',{
    journalId: uuid('journalId').primaryKey().defaultRandom(),
    authorId: uuid('authorId').notNull().references(()=>usersTable.userId, {onDelete: 'cascade'}),
    title: varchar('title', {length: 256}).notNull(),
    content: varchar('content',{length: 2000}).notNull(),
    mode: boolean('mode').default(false),
    sentiment: varchar('sentiment', {length: 10}).notNull(),
    createdAt: timestamp('createdAt').defaultNow(),
})

export const journalRelations = relations(journalsTable,({one})=>({
   author: one(usersTable,{
     fields: [journalsTable.authorId],
     references: [usersTable.userId]
   }),
}))