import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

/** 画面右下に固定表示されるプレイ記録追加ボタン。BottomNavigation の上に重ならないよう bottom-20 に配置 */
export default function FloatingActionButton({
  onClick,
}: FloatingActionButtonProps) {
  return (
    <div className="pointer-events-none fixed bottom-20 left-0 right-0 flex justify-center px-4">
      <div className="flex w-full max-w-[640px] justify-end">
        <button
          type="button"
          onClick={onClick}
          className="pointer-events-auto flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground"
        >
          <Plus className="size-6" />
        </button>
      </div>
    </div>
  );
}
