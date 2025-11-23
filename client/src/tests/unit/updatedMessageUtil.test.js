import { describe, expect, it } from "vitest";
import updatedMessageUtil from "../../utils/updatedMessageUtil";

const now = new Date();

describe("Testing updated status util", () => {
  it("Updated now", () => {
    expect(updatedMessageUtil(now)).toBe("now");
  });

  it("Updated second(s) ago", () => {
    let seconds = Math.ceil(Math.random() * 60);
    // let currentSecond = now.getUTCSeconds();
    let secondsAgo = new Date();
    secondsAgo.setUTCSeconds(now.getUTCSeconds() - seconds);
    if (seconds === 60) {
      expect(updatedMessageUtil(secondsAgo)).toBe("1 minute ago");
    } else {
      expect(updatedMessageUtil(secondsAgo)).toBe(
        `${seconds} second${seconds > 1 ? "s" : ""} ago`
      );
    }
  });

  it("Updated minute(s) ago", () => {
    let minutes = Math.ceil(Math.random() * 60);
    // const currentMinute = now.getUTCMinutes();
    let minutesAgo = new Date();
    minutesAgo.setUTCMinutes(now.getUTCMinutes() - minutes);
    if (minutes === 60) {
      expect(updatedMessageUtil(minutesAgo)).toBe("1 hour ago");
    } else {
      expect(updatedMessageUtil(minutesAgo)).toBe(
        `${minutes} minute${minutes > 1 ? "s" : ""} ago`
      );
    }
  });

  it("Updated hour(s) ago", () => {
    let hours = Math.ceil(Math.random() * 24);
    // const currentHour = now.getUTCHours();
    let hoursAgo = new Date();
    hoursAgo.setUTCHours(now.getUTCHours() - hours);
    if (hours === 24) {
      expect(updatedMessageUtil(hoursAgo)).toBe("1 day ago");
    } else {
      expect(updatedMessageUtil(hoursAgo)).toBe(
        `${hours} hour${hours > 1 ? "s" : ""} ago`
      );
    }
  });

  it("Updated day(s) ago", () => {
    let days = Math.ceil(Math.random() * 31);
    // const currentDate = now.getUTCDate();
    let daysAgo = new Date();
    daysAgo.setUTCDate(now.getUTCDate() - days);
    if (days === 31) {
      expect(updatedMessageUtil(daysAgo)).toBe("1 month ago");
    } else {
      expect(updatedMessageUtil(daysAgo)).toBe(
        `${days} day${days > 1 ? "s" : ""} ago`
      );
    }
  });

  it("Updated month(s) ago", () => {
    let months = Math.ceil(Math.random() * 12);
    // const currentMonth = now.getUTCMonth() + 1;
    let monthsAgo = new Date();
    monthsAgo.setUTCMonth(now.getUTCMonth() - months);
    if (months === 12) {
      expect(updatedMessageUtil(monthsAgo)).toBe("1 year ago");
    } else {
      expect(updatedMessageUtil(monthsAgo)).toBe(
        `${months} month${months > 1 ? "s" : ""} ago`
      );
    }
  });

  it("Updated year(s) ago", () => {
    let years = Math.ceil(Math.random() * 20);
    let yearsAgo = new Date();
    yearsAgo.setUTCFullYear(now.getUTCFullYear() - years);
    if (years === 1) {
      expect(updatedMessageUtil(yearsAgo)).toBe("1 year ago");
    } else {
      expect(updatedMessageUtil(yearsAgo)).toBe(`${years} years ago`);
    }
  });
});
