import { pgTable, text, timestamp, varchar, serial, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: varchar("id").primaryKey(), // Clerk user ID
  email: varchar("email").notNull(),
  name: varchar("name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const comparisons = pgTable("comparisons", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  title: varchar("title").notNull(),
  items: jsonb("items").notNull(),
  result: jsonb("result").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userRelations = relations(users, ({ many }) => ({
  comparisons: many(comparisons),
}));

export const comparisonRelations = relations(comparisons, ({ one }) => ({
  user: one(users, {
    fields: [comparisons.userId],
    references: [users.id],
  }),
}));

export const Newsletter = pgTable('newsletter', {
  id: serial('id').primaryKey(),
  newName: varchar('newName'),
  newEmail: varchar('newEmail'),
  newMessage: text('newMessage'),
  createdAt: timestamp('createdAt').defaultNow()
});