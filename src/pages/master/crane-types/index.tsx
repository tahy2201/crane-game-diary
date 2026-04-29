import { Pencil, Plus } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CraneTypeModal from '@/components/master/CraneTypeModal';
import { Badge } from '@/components/shadcn-ui/badge';
import { useCraneTypes } from '@/hooks/useCraneTypes';
import type { CraneType } from '@/types';

/** S-04 クレーン形式管理ページ。共通マスタの一覧表示とグループ独自クレーン形式の追加・編集・削除を行う */
export default function CraneTypes() {
  const navigate = useNavigate();
  const { craneTypes, isLoading, add, update, remove } = useCraneTypes();
  const [modal, setModal] = useState<{ open: boolean; item?: CraneType }>({
    open: false,
  });

  const systemItems = craneTypes.filter((c) => c.is_system);
  const groupItems = craneTypes.filter((c) => !c.is_system);

  const handleSave = useCallback(
    async (name: string) => {
      if (modal.item) {
        await update(modal.item.crane_type_id, name);
      } else {
        await add(name);
      }
    },
    [modal.item, update, add],
  );

  const handleDelete = useCallback(async () => {
    if (modal.item) await remove(modal.item.crane_type_id);
  }, [modal.item, remove]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <button
        type="button"
        onClick={() => navigate('/master')}
        className="mb-4 text-sm text-muted-foreground"
      >
        ← マスタ管理
      </button>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">クレーン形式</h1>
        <button
          type="button"
          onClick={() => setModal({ open: true })}
          className="flex items-center gap-1 text-xs text-primary"
        >
          <Plus className="size-3" />
          追加
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl bg-card">
        {systemItems.map((item, i) => (
          <MasterRow
            key={item.crane_type_id}
            name={item.name}
            isSystem
            isLast={i === systemItems.length - 1 && groupItems.length === 0}
          />
        ))}
        {groupItems.map((item, i) => (
          <MasterRow
            key={item.crane_type_id}
            name={item.name}
            isLast={i === groupItems.length - 1}
            onEdit={() => setModal({ open: true, item })}
          />
        ))}
        {groupItems.length === 0 && (
          <p className="px-4 py-3 text-xs text-muted-foreground">
            グループ独自のクレーン形式はまだありません
          </p>
        )}
      </div>

      {/* S-06 クレーン形式編集モーダル */}
      <CraneTypeModal
        open={modal.open}
        item={modal.item}
        onClose={() => setModal({ open: false })}
        onSave={handleSave}
        onDelete={modal.item ? handleDelete : undefined}
      />
    </div>
  );
}

/** マスタ一覧の1行 */
function MasterRow({
  name,
  isSystem = false,
  isLast = false,
  onEdit,
}: {
  name: string;
  isSystem?: boolean;
  isLast?: boolean;
  onEdit?: () => void;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 ${
        !isLast ? 'border-b border-border/60' : ''
      }`}
    >
      <span className="flex-1 text-sm">{name}</span>
      {isSystem ? (
        <Badge variant="secondary" className="text-xs">
          共通
        </Badge>
      ) : (
        <button
          type="button"
          onClick={onEdit}
          className="text-muted-foreground"
        >
          <Pencil className="size-4" />
        </button>
      )}
    </div>
  );
}
