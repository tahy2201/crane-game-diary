import {
  boolean,
  doublePrecision,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

// ---------- Enums ----------

export const groupRoleEnum = pgEnum('group_role', ['owner', 'member']);
export const playResultEnum = pgEnum('play_result', ['got', 'failed']);
export const freshnessEnum = pgEnum('freshness', ['new', 'mid', 'old']);

// ---------- Users ----------

export const users = pgTable('users', {
  user_id: uuid('user_id').primaryKey(),
  email: text('email').notNull().unique(),
  display_name: text('display_name').notNull(),
  is_deleted: boolean('is_deleted').notNull().default(false),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------- Groups ----------

export const groups = pgTable('groups', {
  group_id: uuid('group_id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  created_at: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------- GroupMembers ----------

export const groupMembers = pgTable(
  'group_members',
  {
    group_id: uuid('group_id')
      .notNull()
      .references(() => groups.group_id),
    user_id: uuid('user_id')
      .notNull()
      .references(() => users.user_id),
    role: groupRoleEnum('role').notNull().default('member'),
    joined_at: timestamp('joined_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.group_id, table.user_id] })],
);

// ---------- InviteTokens ----------

export const inviteTokens = pgTable('invite_tokens', {
  token_id: uuid('token_id').primaryKey().defaultRandom(),
  group_id: uuid('group_id')
    .notNull()
    .references(() => groups.group_id),
  token: text('token').notNull().unique(),
  expires_at: timestamp('expires_at', { withTimezone: true }).notNull(),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------- Arcades ----------

export const arcades = pgTable('arcades', {
  arcade_id: serial('arcade_id').primaryKey(),
  group_id: uuid('group_id')
    .notNull()
    .references(() => groups.group_id),
  name: text('name').notNull(),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
  memo: text('memo'),
  is_favorite: boolean('is_favorite').notNull().default(false),
  created_at: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------- PrizeCategories ----------

export const prizeCategories = pgTable('prize_categories', {
  prize_category_id: serial('prize_category_id').primaryKey(),
  group_id: uuid('group_id').references(() => groups.group_id),
  name: text('name').notNull(),
  is_system: boolean('is_system').notNull().default(false),
});

// ---------- CraneTypes ----------

export const craneTypes = pgTable('crane_types', {
  crane_type_id: serial('crane_type_id').primaryKey(),
  group_id: uuid('group_id').references(() => groups.group_id),
  name: text('name').notNull(),
  is_system: boolean('is_system').notNull().default(false),
});

// ---------- Prizes ----------

export const prizes = pgTable('prizes', {
  prize_id: uuid('prize_id').primaryKey().defaultRandom(),
  group_id: uuid('group_id')
    .notNull()
    .references(() => groups.group_id),
  name: text('name').notNull(),
  prize_category_id: integer('prize_category_id')
    .notNull()
    .references(() => prizeCategories.prize_category_id),
  crane_type_id: integer('crane_type_id')
    .notNull()
    .references(() => craneTypes.crane_type_id),
  freshness: freshnessEnum('freshness').notNull(),
  photo_url: text('photo_url'),
  estimated_value: integer('estimated_value'),
  memo: text('memo'),
  created_at: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------- Plays ----------

export const plays = pgTable('plays', {
  play_id: uuid('play_id').primaryKey().defaultRandom(),
  group_id: uuid('group_id')
    .notNull()
    .references(() => groups.group_id),
  arcade_id: integer('arcade_id')
    .notNull()
    .references(() => arcades.arcade_id),
  user_id: uuid('user_id')
    .notNull()
    .references(() => users.user_id),
  prize_id: uuid('prize_id').references(() => prizes.prize_id),
  date: timestamp('date', { withTimezone: true }).notNull(),
  result: playResultEnum('result').notNull(),
  play_count: integer('play_count').notNull(),
  rate_per_play: integer('rate_per_play').notNull(),
  memo: text('memo'),
  created_at: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
