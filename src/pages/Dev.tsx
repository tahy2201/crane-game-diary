import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

export default function Dev() {
  return (
    <div className="p-6 space-y-8">
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">Input</h2>
        <Input placeholder="ゲームセンター名を入力" />
        <Input placeholder="無効" disabled />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">Textarea</h2>
        <Textarea placeholder="メモを入力" rows={3} />
        <Textarea placeholder="無効" disabled rows={3} />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">Badge</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>獲得</Badge>
          <Badge variant="secondary">失敗</Badge>
          <Badge variant="destructive">削除</Badge>
          <Badge>new</Badge>
          <Badge variant="secondary">mid</Badge>
          <Badge variant="secondary">old</Badge>
          <Badge>owner</Badge>
          <Badge variant="secondary">member</Badge>
        </div>
      </section>
    </div>
  );
}
