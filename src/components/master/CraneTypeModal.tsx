import { useEffect, useState } from 'react';
import Modal from '@/components/layout/Modal';
import { Button } from '@/components/shadcn-ui/button';
import { Input } from '@/components/shadcn-ui/input';
import type { CraneType } from '@/types';

type Props = {
  open: boolean;
  onClose: () => void;
  /** 渡した場合は編集モード、undefined の場合は追加モード */
  item?: CraneType;
  onSave: (name: string) => Promise<void>;
  onDelete?: () => Promise<void>;
};

/**
 * S-06 クレーン形式編集モーダル。
 * 追加・編集・削除を1つのモーダルで完結する。
 * item が undefined のときは追加モード、渡されたときは編集モード。
 */
export default function CraneTypeModal({
  open,
  onClose,
  item,
  onSave,
  onDelete,
}: Props) {
  const isEdit = item !== undefined;
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // モーダルを開くたびに入力値を初期化
  useEffect(() => {
    if (open) {
      setName(item?.name ?? '');
      setIsConfirmingDelete(false);
    }
  }, [open, item]);

  const handleSave = async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    await onSave(name.trim());
    setIsSaving(false);
    onClose();
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsSaving(true);
    await onDelete();
    setIsSaving(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'クレーン形式を編集' : 'クレーン形式を追加'}
    >
      {isConfirmingDelete ? (
        <div className="space-y-4">
          <p className="text-sm text-foreground">
            「{item?.name}」を削除しますか？
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsConfirmingDelete(false)}
            >
              キャンセル
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleDelete}
              disabled={isSaving}
            >
              削除
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Input
            placeholder="クレーン形式名"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            className="w-full"
            onClick={handleSave}
            disabled={!name.trim() || isSaving}
          >
            保存
          </Button>
          {isEdit && onDelete && (
            <Button
              variant="ghost"
              className="w-full text-destructive hover:text-destructive"
              onClick={() => setIsConfirmingDelete(true)}
            >
              削除
            </Button>
          )}
        </div>
      )}
    </Modal>
  );
}
