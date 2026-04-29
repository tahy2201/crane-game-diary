import { ChevronRight, GitFork, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * S-04 マスタ管理画面。
 * 景品カテゴリ・クレーン形式それぞれの管理ページへのナビゲーションを提供する。
 */
export default function Master() {
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h1 className="text-xl font-medium">マスタ管理</h1>

      <div className="mt-6 overflow-hidden rounded-xl bg-card">
        <button
          type="button"
          onClick={() => navigate('/master/prize-categories')}
          className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-muted border-b border-border/60"
        >
          <Tag className="size-4 shrink-0 text-muted-foreground" />
          <span className="flex-1 text-sm">景品カテゴリ</span>
          <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
        </button>
        <button
          type="button"
          onClick={() => navigate('/master/crane-types')}
          className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-muted"
        >
          <GitFork className="size-4 shrink-0 text-muted-foreground" />
          <span className="flex-1 text-sm">クレーン形式</span>
          <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
