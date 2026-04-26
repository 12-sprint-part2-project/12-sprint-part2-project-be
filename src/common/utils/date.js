import { formatInTimeZone } from "date-fns-tz";

export const getTodayKST = () => {
  const dateStr = formatInTimeZone(new Date(), "Asia/Seoul", "yyyy-MM-dd");
  return new Date(`${dateStr}T00:00:00.000Z`);
};
