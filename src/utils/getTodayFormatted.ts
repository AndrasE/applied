// This function is used to display job application date in a user-friendly format dd/mm/yy
export function getTodayFormatted(): string {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yy = String(today.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
}
