import { Plus } from 'lucide-react';

interface FABProps {
  onClick: () => void;
}

export default function FAB({ onClick }: FABProps) {
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
