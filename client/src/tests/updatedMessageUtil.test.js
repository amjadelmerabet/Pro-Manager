import { describe, expect, it } from "vitest";
import updatedMessageUtil from "../utils/updatedMessageUtil";

let now = new Date();

let oneYearAgo = new Date();
oneYearAgo.setMonth(now.getMonth() - 12);

let twoYearsAgo = new Date();
twoYearsAgo.setMonth(now.getMonth() - 24);

let oneMonthAgo = new Date();
oneMonthAgo.setMonth(now.getMonth() - 1);

let twoMonthsAgo = new Date();
twoMonthsAgo.setMonth(now.getMonth() - 2);

let oneDayAgo = new Date();
oneDayAgo.setDate(now.getDate() - 1);

let twoDaysAgo = new Date();
twoDaysAgo.setDate(now.getDate() - 2);

let oneHourAgo = new Date();
oneHourAgo.setHours(now.getHours() - 1);

let twoHoursAgo = new Date();
twoHoursAgo.setHours(now.getHours() - 2);

let oneMinuteAgo = new Date();
oneMinuteAgo.setMinutes(now.getMinutes() - 1);

let twoMinutesAgo = new Date();
twoMinutesAgo.setMinutes(now.getMinutes() - 2);

let oneSecondAgo = new Date();
oneSecondAgo.setSeconds(now.getSeconds() - 1);

let twoSecondsAgo = new Date();
twoSecondsAgo.setSeconds(now.getSeconds() - 2);

describe("Compare the updated date and time with now and generate a last updated status message", () => {
  it("Generate an updated status for 1 year ago", () => {
    expect(updatedMessageUtil(oneYearAgo)).toBe("1 year ago");
  });

  it("Generate an updated status for 2 years ago", () => {
    expect(updatedMessageUtil(twoYearsAgo)).toBe("2 years ago");
  });

  it("Generate an updated status for 1 month ago", () => {
    expect(updatedMessageUtil(oneMonthAgo)).toBe("1 month ago");
  });
  
  it("Generate an updated status for 2 months ago", () => {
    expect(updatedMessageUtil(twoMonthsAgo)).toBe("2 months ago");
  });
  
  it("Generate an updated status for 1 day ago", () => {
    expect(updatedMessageUtil(oneDayAgo)).toBe("1 day ago");
  });
  
  it("Generate an updated status for 2 days ago", () => {
    expect(updatedMessageUtil(twoDaysAgo)).toBe("2 days ago");
  });

  it("Generate an updated status for 1 hour ago", () => {
    expect(updatedMessageUtil(oneHourAgo)).toBe("1 hour ago");
  });
  
  it("Generate an updated status for 2 hours ago", () => {
    expect(updatedMessageUtil(twoHoursAgo)).toBe("2 hours ago");
  });

  it("Generate an updated status for 1 minute ago", () => {
    expect(updatedMessageUtil(oneMinuteAgo)).toBe("1 minute ago");
  });

  it("Generate an updated status for 2 minutes ago", () => {
    expect(updatedMessageUtil(twoMinutesAgo)).toBe("2 minutes ago");
  });

  it("Generate an updated status for 1 second ago", () => {
    expect(updatedMessageUtil(oneSecondAgo)).toBe("1 second ago");
  });

  it("Generate an updated status for 2 seconds ago", () => {
    expect(updatedMessageUtil(twoSecondsAgo)).toBe("2 seconds ago");
  });

  it("Generate an updated status for now", () => {
    expect(updatedMessageUtil(now)).toBe("now");
  });

});
