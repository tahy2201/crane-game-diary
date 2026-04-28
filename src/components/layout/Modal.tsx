import { Dialog } from '@base-ui/react/dialog';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

/** 画面下部からスライドアップするボトムシートモーダル。@base-ui/react の Dialog をラップ */
export default function Modal({ open, onClose, title, children }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/30 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 transition-opacity" />
        <Dialog.Popup className="fixed bottom-0 left-1/2 w-full max-w-[640px] -translate-x-1/2 rounded-t-2xl bg-card px-6 pb-8 pt-5 data-[ending-style]:translate-y-full data-[starting-style]:translate-y-full transition-transform">
          <div className="mb-4 flex items-center justify-between">
            {title ? (
              <Dialog.Title className="text-base font-medium text-foreground">
                {title}
              </Dialog.Title>
            ) : (
              <div />
            )}
            <Dialog.Close
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-full text-muted-foreground"
            >
              <X className="size-4" />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
