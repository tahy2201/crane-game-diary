import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import type {
  users,
  groups,
  groupMembers,
  inviteTokens,
  arcades,
  prizeCategories,
  craneTypes,
  prizes,
  plays,
} from '@/db/schema';

// ---------- Users ----------
export type User = InferSelectModel<typeof users>;
export type NewUser = Omit<InferInsertModel<typeof users>, 'user_id' | 'created_at'>;

// ---------- Groups ----------
export type Group = InferSelectModel<typeof groups>;
export type NewGroup = Omit<InferInsertModel<typeof groups>, 'group_id' | 'created_at'>;

// ---------- GroupMembers ----------
export type GroupMember = InferSelectModel<typeof groupMembers>;
export type NewGroupMember = InferInsertModel<typeof groupMembers>;

// ---------- InviteTokens ----------
export type InviteToken = InferSelectModel<typeof inviteTokens>;
export type NewInviteToken = Omit<InferInsertModel<typeof inviteTokens>, 'token_id' | 'created_at'>;

// ---------- Arcades ----------
export type Arcade = InferSelectModel<typeof arcades>;
export type NewArcade = Omit<InferInsertModel<typeof arcades>, 'arcade_id' | 'created_at'>;

// ---------- PrizeCategories ----------
export type PrizeCategory = InferSelectModel<typeof prizeCategories>;
export type NewPrizeCategory = Omit<InferInsertModel<typeof prizeCategories>, 'prize_category_id'>;

// ---------- CraneTypes ----------
export type CraneType = InferSelectModel<typeof craneTypes>;
export type NewCraneType = Omit<InferInsertModel<typeof craneTypes>, 'crane_type_id'>;

// ---------- Prizes ----------
export type Prize = InferSelectModel<typeof prizes>;
export type NewPrize = Omit<InferInsertModel<typeof prizes>, 'prize_id' | 'created_at'>;

// ---------- Plays ----------
export type Play = InferSelectModel<typeof plays>;
export type NewPlay = Omit<InferInsertModel<typeof plays>, 'play_id' | 'created_at'>;
