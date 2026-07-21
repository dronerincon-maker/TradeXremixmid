import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

export const foundingConfig = pgTable("founding_config", {
  key: text("key").primaryKey(),
  valueInt: integer("value_int").notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
})

export const foundingMembers = pgTable("founding_members", {
  id: serial("id").primaryKey(),
  fullName: text("fullName").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  propFirms: text("propFirms").notNull().default(""),
  fundedAccounts: text("fundedAccounts").notNull().default(""),
  capitalType: text("capitalType").notNull().default(""),
  whyNow: text("whyNow").notNull().default(""),
  status: text("status").notNull().default("applied"),
  seatNumber: integer("seatNumber"),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
})
