import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Navigator Locks API を使うとローカル環境で初期化時にデッドロックが発生するため
// ロック機構をバイパスして直接 fn() を実行するカスタム実装に差し替える。
// ロックの本来の用途は「複数タブが同時にトークンを更新しないための排他制御」だが、
// このアプリは複数タブでの同時使用を想定しないため、バイパスしても実用上問題ない。
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    lock: <R>(
      _name: string,
      _acquireTimeout: number,
      fn: () => Promise<R>,
    ): Promise<R> => fn(),
  },
});
