import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import type { plays } from '@/db/schema';

export type Play = InferSelectModel<typeof plays>;
export type NewPlay = Omit<InferInsertModel<typeof plays>, 'id' | 'created_at'>;
