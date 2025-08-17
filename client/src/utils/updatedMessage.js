export default function updatedMessage(update) {
  let now = new Date();
  const updatedYear = update.getUTCFullYear();
  const currentYear = now.getUTCFullYear();
  if (updatedYear < currentYear) {
    let difference = currentYear - updatedYear;
    return `Updated ${difference} year${difference > 1 ? "s" : ""} ago`;
  } else if (updatedYear === currentYear) {
    const updatedMonth = update.getUTCMonth();
    const currentMonth = now.getUTCMonth();
    if (updatedMonth < currentMonth) {
      let difference = currentMonth - updatedMonth;
      return `Updated ${difference} month${difference > 1 ? "s" : ""} ago`;
    } else if (updatedMonth === currentMonth) {
      const updatedDate = update.getUTCDate();
      const currentDate = now.getUTCDate();
      if (updatedDate < currentDate) {
        let difference = currentDate - updatedDate;
        return `Updated ${difference} day${difference > 1 ? "s" : ""} ago`;
      } else if (updatedDate === currentDate) {
        const updatedHour = update.getUTCHours();
        const currentHour = now.getUTCHours();
        if (updatedHour < currentHour) {
          let difference = currentHour - updatedHour;
          return `Updated ${difference} hour${difference > 1 ? "s" : ""} ago`;
        } else if (updatedHour === currentHour) {
          const updatedMinute = update.getUTCMinutes();
          const currentMinute = now.getUTCMinutes();
          if (updatedMinute < currentMinute) {
            let difference = currentMinute - updatedMinute;
            return `Updated ${difference} minute${
              difference > 1 ? "s" : ""
            } ago`;
          } else if (updatedMinute === currentMinute) {
            const updatedSecond = update.getUTCSeconds();
            const currentSecond = now.getUTCSeconds();
            if (updatedSecond < currentSecond) {
              let difference = currentSecond - updatedSecond;
              return `Updated ${difference} second${
                difference > 1 ? "s" : ""
              } ago`;
            } else {
              return "Updated now";
            }
          }
        }
      }
    }
  }
}
