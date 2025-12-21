export default function updatedMessageUtil(update) {
  let now = new Date();
  const updatedYear = update.getUTCFullYear();
  const currentYear = now.getUTCFullYear();
  const updatedMonth = update.getUTCMonth();
  const currentMonth = now.getUTCMonth();
  const updatedDate = update.getUTCDate();
  const currentDate = now.getUTCDate();
  const updatedHour = update.getUTCHours();
  const currentHour = now.getUTCHours();
  const updatedMinute = update.getUTCMinutes();
  const currentMinute = now.getUTCMinutes();
  const updatedSecond = update.getUTCSeconds();
  const currentSecond = now.getUTCSeconds();
  let yearDifference = currentYear - updatedYear;
  if (yearDifference > 0) {
    if (yearDifference === 1) {
      let monthDifference = currentMonth - updatedMonth;
      if (monthDifference >= 0) {
        return "1 year ago";
      } else {
        return `${12 + monthDifference} month${12 + monthDifference > 1 ? "s" : ""} ago`;
      }
    } else {
      return `${yearDifference} years ago`;
    }
  } else {
    let monthDifference = currentMonth - updatedMonth;
    if (monthDifference > 0) {
      if (monthDifference === 1) {
        let dateDifference = currentDate - updatedDate;
        if (dateDifference >= 0) {
          return "1 month ago";
        } else {
          let daysOfMonth = new Date(
            updatedYear,
            updatedMonth + 1,
            0
          ).getDate();
          return `${daysOfMonth + dateDifference} day${daysOfMonth + dateDifference > 1 ? "s" : ""} ago`;
        }
      } else {
        return `${monthDifference} month${monthDifference > 1 ? "s" : ""} ago`;
      }
    } else {
      let dateDifference = currentDate - updatedDate;
      if (dateDifference > 0) {
        if (dateDifference === 1) {
          let hourDifference = currentHour - updatedHour;
          if (hourDifference >= 0) {
            return "1 day ago";
          } else {
            return `${24 + hourDifference} hour${24 + hourDifference > 1 ? "s" : ""} ago`;
          }
        } else {
          return `${dateDifference} days ago`;
        }
      } else {
        let hourDifference = currentHour - updatedHour;
        if (hourDifference > 0) {
          if (hourDifference === 1) {
            let minuteDifference = currentMinute - updatedMinute;
            if (minuteDifference >= 0) {
              return "1 hour ago";
            } else {
              return `${60 + minuteDifference} minute${60 + minuteDifference > 1 ? "s" : ""} ago`;
            }
          } else {
            return `${hourDifference} hours ago`;
          }
        } else {
          let minuteDifference = currentMinute - updatedMinute;
          if (minuteDifference > 0) {
            if (minuteDifference === 1) {
              let secondDifference = currentSecond - updatedSecond;
              if (secondDifference >= 0) {
                return "1 minute ago";
              } else {
                return `${60 + secondDifference} second${60 + secondDifference > 1 ? "s" : ""} ago`;
              }
            } else {
              return `${minuteDifference} minutes ago`;
            }
          } else {
            let secondDifference = currentSecond - updatedSecond;
            if (secondDifference > 0) {
              return `${secondDifference} second${secondDifference > 1 ? "s" : ""} ago`;
            } else {
              return "now";
            }
          }
        }
      }
    }
  }
}
