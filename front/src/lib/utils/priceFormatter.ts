export function formatKoreanPrice(priceWon: number): string {
  if (!Number.isFinite(priceWon) || priceWon <= 0) return "-";

  const EOK = 100_000_000;
  const MAN = 10_000;

  //만 단위로 절삭
  const totalMan = Math.floor(priceWon / MAN);

  //1억 미만
  if (priceWon < EOK) {
    return `${totalMan.toLocaleString()}만`;
  }

  //1억 이상
  const eok = Math.floor(priceWon / EOK);
  const remainMan = totalMan - eok * 10_000;

  if (remainMan === 0) {
    return `${eok}억`;
  }

  return `${eok}억 ${remainMan.toLocaleString()}만`;
}
