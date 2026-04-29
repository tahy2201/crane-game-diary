import {
  ChevronRight,
  Database,
  Link,
  LogOut,
  Plus,
  Trash2,
  UserCheck,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '@/components/layout/Modal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/shadcn-ui/alert-dialog';
import { supabase } from '@/lib/supabase';

/** 設定項目の区切りグループ */
function SettingsGroup({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      {label && (
        <p className="mb-1 px-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
      )}
      <div className="overflow-hidden rounded-xl bg-card">{children}</div>
    </section>
  );
}

/** タップで画面遷移するリスト行 */
function SettingsLinkRow({
  icon,
  label,
  destructive = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  destructive?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-muted [&:not(:last-child)]:border-b [&:not(:last-child)]:border-border/60 ${
        destructive ? 'text-destructive' : 'text-foreground'
      }`}
    >
      <span className="shrink-0">{icon}</span>
      <span className="flex-1 text-sm">{label}</span>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
    </button>
  );
}

/** 設定画面。アカウント操作（ログアウト等）を提供する */
export default function Settings() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  // S-03 招待リンク発行モーダルの開閉状態
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-medium">設定</h1>

      <SettingsGroup label="グループ">
        {/* S-02: グループ未所属の場合などに遷移 */}
        <SettingsLinkRow
          icon={<Plus className="size-4" />}
          label="グループを作成"
          onClick={() => navigate('/group/new')}
        />
        {/* S-03: グループへの招待リンクを発行するモーダル */}
        <SettingsLinkRow
          icon={<Link className="size-4" />}
          label="招待リンクを発行"
          onClick={() => setIsInviteModalOpen(true)}
        />
        {/* S-07: owner がアカウント削除する際に他メンバーがいる場合に表示。owner 以上のみ */}
        <SettingsLinkRow
          icon={<UserCheck className="size-4" />}
          label="owner移譲"
          onClick={() => navigate('/owner-transfer')}
        />
      </SettingsGroup>

      <SettingsGroup label="管理">
        {/* S-04: 景品カテゴリ（S-05）とクレーン形式（S-06）の管理モーダルはこの画面から開く */}
        <SettingsLinkRow
          icon={<Database className="size-4" />}
          label="マスタ管理"
          onClick={() => navigate('/master')}
        />
      </SettingsGroup>

      <SettingsGroup label="アカウント">
        {/* S-08: パスワード再入力で本人確認後に論理削除 */}
        <SettingsLinkRow
          icon={<Trash2 className="size-4" />}
          label="アカウント削除"
          destructive
          onClick={() => navigate('/delete-account')}
        />
        <SettingsLinkRow
          icon={<LogOut className="size-4" />}
          label="ログアウト"
          destructive
          onClick={() => setIsLogoutDialogOpen(true)}
        />
        <AlertDialog
          open={isLogoutDialogOpen}
          onOpenChange={setIsLogoutDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>ログアウトしますか？</AlertDialogTitle>
              <AlertDialogDescription>
                ログアウトするとログイン画面に戻ります。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout} disabled={isLoggingOut}>
                {isLoggingOut ? 'ログアウト中...' : 'ログアウト'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SettingsGroup>

      {/* S-03 招待リンク発行モーダル */}
      <Modal
        open={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="招待リンクを発行"
      >
        <p className="text-sm text-muted-foreground">
          招待リンク発行フォームはここに入ります
        </p>
      </Modal>
    </div>
  );
}
