import { formatInTimeZone } from "date-fns-tz";

export const getTodayKST = () => {
  // KST 날짜를 구하되, DB @db.Date가 UTC 자정으로 저장하므로 UTC 자정으로 반환
  const dateStr = formatInTimeZone(new Date(), "Asia/Seoul", "yyyy-MM-dd");
  return new Date(`${dateStr}T00:00:00.000Z`);
};
