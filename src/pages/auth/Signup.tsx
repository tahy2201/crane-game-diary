import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/shadcn-ui/button';
import { Input } from '@/components/shadcn-ui/input';
import { Label } from '@/components/shadcn-ui/label';
import { supabase } from '@/lib/supabase';

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError || !data.user) {
      setError(signUpError?.message ?? '登録に失敗しました');
      setIsLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from('users').insert({
      user_id: data.user.id,
      email,
      display_name: displayName,
    });

    if (insertError) {
      // Auth ユーザーは作成済みだが users テーブルへの挿入が失敗した場合、
      // 孤立したセッションが残らないようにサインアウトする
      await supabase.auth.signOut();
      setError('ユーザー情報の保存に失敗しました。もう一度お試しください');
      setIsLoading(false);
      return;
    }

    navigate('/');
  };

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold">新規登録</h1>
          <p className="text-sm text-muted-foreground">クレーンゲーム記録帳</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="displayName">表示名</Label>
            <Input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              autoComplete="nickname"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">パスワード（6文字以上）</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? '登録中...' : 'アカウント作成'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          すでにアカウントをお持ちの方は{' '}
          <Link to="/login" className="underline">
            ログイン
          </Link>
        </p>
      </div>
    </div>
  );
}
