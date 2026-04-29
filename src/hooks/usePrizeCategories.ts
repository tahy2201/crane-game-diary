import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import type { PrizeCategory } from '@/types';

/** 景品カテゴリの取得・CRUD を提供するフック */
export function usePrizeCategories() {
  const { session } = useAuthStore();
  const [groupId, setGroupId] = useState<string | null>(null);
  const [prizeCategories, setPrizeCategories] = useState<PrizeCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!session?.user) return;
    setIsLoading(true);

    const [catResult, memberResult] = await Promise.all([
      supabase.from('prize_categories').select('*').order('prize_category_id'),
      supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', session.user.id)
        .limit(1)
        .maybeSingle(),
    ]);

    if (catResult.data) setPrizeCategories(catResult.data as PrizeCategory[]);
    setGroupId(memberResult.data?.group_id ?? null);
    setIsLoading(false);
  }, [session]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const add = async (name: string) => {
    if (!groupId) return;
    await supabase
      .from('prize_categories')
      .insert({ group_id: groupId, name, is_system: false });
    await fetchAll();
  };

  const update = async (id: number, name: string) => {
    await supabase
      .from('prize_categories')
      .update({ name })
      .eq('prize_category_id', id);
    await fetchAll();
  };

  const remove = async (id: number) => {
    await supabase
      .from('prize_categories')
      .delete()
      .eq('prize_category_id', id);
    await fetchAll();
  };

  return { prizeCategories, isLoading, add, update, remove };
}
