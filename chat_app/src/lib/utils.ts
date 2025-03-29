export const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

// 他のユーティリティ関数をここに追加 