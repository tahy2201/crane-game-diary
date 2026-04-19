import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Play } from '@/types';

export default function Timeline() {
  const [plays, setPlays] = useState<Play[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlays = async () => {
      const { data, error } = await supabase
        .from('plays')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setPlays(data);
      }
      setLoading(false);
    };

    fetchPlays();
  }, []);

  if (loading) return <p className="p-4">読み込み中...</p>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">タイムライン</h1>

      {plays.length === 0 ? (
        <p className="text-muted-foreground">まだ記録がありません</p>
      ) : (
        <ul className="space-y-3">
          {plays.map((play) => (
            <li key={play.play_id} className="border rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {play.result === 'got' ? '✅ 獲得' : '❌ 失敗'}
                </span>
                <span className="text-sm text-muted-foreground">
                  {new Date(play.date).toLocaleDateString('ja-JP')}
                </span>
              </div>
              <p className="text-sm mt-1">
                {play.play_count * play.rate_per_play}円
              </p>
              {play.memo && (
                <p className="text-sm text-muted-foreground mt-1">
                  {play.memo}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
