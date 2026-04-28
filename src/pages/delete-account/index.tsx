/**
 * S-08 アカウント削除確認画面
 * パスワード再入力で本人確認後、論理削除を実行してログアウト。
 * 自分が記録した Play データは削除されない。
 */
export default function DeleteAccount() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-medium">アカウント削除</h1>
    </div>
  );
}
