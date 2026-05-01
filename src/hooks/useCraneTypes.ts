import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import type { CraneType } from '@/types';

/** クレーン形式の取得・CRUD を提供するフック */
export function useCraneTypes() {
  const { session } = useAuthStore();
  const [groupId, setGroupId] = useState<string | null>(null);
  const [craneTypes, setCraneTypes] = useState<CraneType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!session?.user) return;
    setIsLoading(true);

    const [craneResult, memberResult] = await Promise.all([
      supabase.from('crane_types').select('*').order('crane_type_id'),
      supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', session.user.id)
        .limit(1)
        .maybeSingle(),
    ]);

    if (craneResult.data) setCraneTypes(craneResult.data as CraneType[]);
    setGroupId(memberResult.data?.group_id ?? null);
    setIsLoading(false);
  }, [session]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const add = async (name: string) => {
    if (!groupId) return;
    await supabase
      .from('crane_types')
      .insert({ group_id: groupId, name, is_system: false });
    await fetchAll();
  };

  const update = async (id: number, name: string) => {
    await supabase.from('crane_types').update({ name }).eq('crane_type_id', id);
    await fetchAll();
  };

  const remove = async (id: number) => {
    await supabase.from('crane_types').delete().eq('crane_type_id', id);
    await fetchAll();
  };

  return { craneTypes, isLoading, add, update, remove };
}
