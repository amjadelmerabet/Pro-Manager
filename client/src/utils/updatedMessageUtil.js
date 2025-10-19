export default function updatedMessageUtil(update) {
  let now = new Date();
  const updatedYear = update.getUTCFullYear();
  const currentYear = now.getUTCFullYear();
  if (updatedYear < currentYear) {
    let difference = currentYear - updatedYear;
    return `${difference} year${difference > 1 ? "s" : ""} ago`;
  } else if (updatedYear === currentYear) {
    const updatedMonth = update.getUTCMonth();
    const currentMonth = now.getUTCMonth();
    if (updatedMonth < currentMonth) {
      let difference = currentMonth - updatedMonth;
      return `${difference} month${difference > 1 ? "s" : ""} ago`;
    } else if (updatedMonth === currentMonth) {
      const updatedDate = update.getUTCDate();
      const currentDate = now.getUTCDate();
      if (updatedDate < currentDate) {
        let difference = currentDate - updatedDate;
        return `${difference} day${difference > 1 ? "s" : ""} ago`;
      } else if (updatedDate === currentDate) {
        const updatedHour = update.getUTCHours();
        const currentHour = now.getUTCHours();
        if (updatedHour < currentHour) {
          let difference = currentHour - updatedHour;
          return `${difference} hour${difference > 1 ? "s" : ""} ago`;
        } else if (updatedHour === currentHour) {
          const updatedMinute = update.getUTCMinutes();
          const currentMinute = now.getUTCMinutes();
          if (updatedMinute < currentMinute) {
            let difference = currentMinute - updatedMinute;
            return `${difference} minute${difference > 1 ? "s" : ""} ago`;
          } else if (updatedMinute === currentMinute) {
            const updatedSecond = update.getUTCSeconds();
            const currentSecond = now.getUTCSeconds();
            if (updatedSecond < currentSecond) {
              let difference = currentSecond - updatedSecond;
              return `${difference} second${difference > 1 ? "s" : ""} ago`;
            } else {
              return "now";
            }
          }
        }
      }
    }
  }
}
