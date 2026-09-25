// =====================================================
// CONSTANTS
// =====================================================
const TIME_ZONE = "Africa/Lagos";
const DAY_NAMES = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];
const MINUTES_PER_DAY = 24 * 60;
const MINUTES_PER_WEEK = 7 * MINUTES_PER_DAY;
// =====================================================
// TIME HELPERS
// =====================================================
function timeToMinutes(time) {
    const [hours, minutes] = time
        .split(":")
        .map(Number);
    return (hours * 60 +
        minutes);
}
// =====================================================
// FORMAT 24-HOUR TIME FOR BUYERS
// =====================================================
export function formatBusinessTime(time) {
    if (!time) {
        return null;
    }
    const [hours, minutes] = time.split(":").map(Number);
    const suffix = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 || 12;
    // Times are already stored as Africa/Lagos wall-clock values. Formatting
    // them directly avoids shifting the displayed time on a server in another zone.
    return `${displayHour}:${String(minutes).padStart(2, "0")} ${suffix}`;
}
// =====================================================
// GET CURRENT NIGERIAN DATE/TIME INFORMATION
// =====================================================
function getCurrentTimeInfo(date) {
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: TIME_ZONE,
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23"
    });
    const parts = formatter
        .formatToParts(date);
    const weekday = parts.find(part => part.type === "weekday")?.value;
    const hour = Number(parts.find(part => part.type === "hour")?.value ?? 0);
    const minute = Number(parts.find(part => part.type === "minute")?.value ?? 0);
    const weekdayMap = {
        Sun: 0,
        Mon: 1,
        Tue: 2,
        Wed: 3,
        Thu: 4,
        Fri: 5,
        Sat: 6
    };
    return {
        dayOfWeek: weekdayMap[weekday ?? "Sun"] ?? 0,
        minutes: hour * 60 + minute
    };
}
// =====================================================
// NORMALIZE HOURS
// =====================================================
function normalizeHours(hours) {
    return Array.from({ length: 7 }, (_, dayOfWeek) => hours.find(hour => hour.dayOfWeek === dayOfWeek) ?? {
        id: `default-${dayOfWeek}`,
        userId: "",
        dayOfWeek,
        isOpen: false,
        openingTime: null,
        closingTime: null,
        createdAt: new Date(),
        updatedAt: new Date()
    });
}
// =====================================================
// CALCULATE SELLER STATUS
// =====================================================
export function calculateSellerBusinessStatus(hours, date = new Date()) {
    const normalizedHours = normalizeHours(hours);
    const { dayOfWeek, minutes: currentMinutes } = getCurrentTimeInfo(date);
    // =================================================
    // CHECK CURRENT DAY
    // =================================================
    const today = normalizedHours[dayOfWeek];
    // =================================================
    // 24-HOUR BUSINESS
    //
    // 00:00 → 00:00
    // =================================================
    if (today.isOpen &&
        today.openingTime === "00:00" &&
        today.closingTime === "00:00") {
        return {
            isOpen: true,
            status: "OPEN",
            message: "Open 24 hours",
            openingTime: "00:00",
            closingTime: "00:00",
            dayOfWeek,
            nextOpeningTime: null
        };
    }
    // =================================================
    // CURRENT DAY NORMAL HOURS
    // =================================================
    if (today.isOpen &&
        today.openingTime &&
        today.closingTime) {
        const opening = timeToMinutes(today.openingTime);
        const closing = timeToMinutes(today.closingTime);
        // ---------------------------------------------
        // NORMAL SAME-DAY HOURS
        // ---------------------------------------------
        if (opening < closing) {
            if (currentMinutes >= opening &&
                currentMinutes < closing) {
                return {
                    isOpen: true,
                    status: "OPEN",
                    message: `Closes at ${formatBusinessTime(today.closingTime)}`,
                    openingTime: today.openingTime,
                    closingTime: today.closingTime,
                    dayOfWeek,
                    nextOpeningTime: null
                };
            }
        }
        // ---------------------------------------------
        // OVERNIGHT HOURS
        //
        // Example:
        // 20:00 → 02:00
        // ---------------------------------------------
        if (opening > closing &&
            currentMinutes >= opening) {
            return {
                isOpen: true,
                status: "OPEN",
                message: `Closes at ${formatBusinessTime(today.closingTime)}`,
                openingTime: today.openingTime,
                closingTime: today.closingTime,
                dayOfWeek,
                nextOpeningTime: null
            };
        }
    }
    // =================================================
    // CHECK PREVIOUS DAY OVERNIGHT HOURS
    // =================================================
    const previousDayIndex = (dayOfWeek + 6) % 7;
    const previousDay = normalizedHours[previousDayIndex];
    if (previousDay.isOpen &&
        previousDay.openingTime &&
        previousDay.closingTime) {
        const previousOpening = timeToMinutes(previousDay.openingTime);
        const previousClosing = timeToMinutes(previousDay.closingTime);
        // Previous day was an overnight business.
        if (previousOpening >
            previousClosing) {
            if (currentMinutes <
                previousClosing) {
                return {
                    isOpen: true,
                    status: "OPEN",
                    message: `Closes at ${formatBusinessTime(previousDay.closingTime)}`,
                    openingTime: previousDay.openingTime,
                    closingTime: previousDay.closingTime,
                    dayOfWeek: previousDayIndex,
                    nextOpeningTime: null
                };
            }
        }
    }
    // =================================================
    // FIND NEXT OPENING
    // =================================================
    for (let offset = 0; offset < 7; offset++) {
        const candidateDayIndex = (dayOfWeek + offset) % 7;
        const candidate = normalizedHours[candidateDayIndex];
        if (!candidate.isOpen ||
            !candidate.openingTime ||
            !candidate.closingTime) {
            continue;
        }
        // 24-hour business
        if (candidate.openingTime === "00:00" &&
            candidate.closingTime === "00:00") {
            if (offset > 0 ||
                currentMinutes === 0) {
                return {
                    isOpen: false,
                    status: "CLOSED",
                    message: `Opens at ${formatBusinessTime(candidate.openingTime)}`,
                    openingTime: null,
                    closingTime: null,
                    dayOfWeek,
                    nextOpeningTime: candidate.openingTime
                };
            }
        }
        const candidateOpening = timeToMinutes(candidate.openingTime);
        // Today: only accept an opening
        // that is still ahead.
        if (offset === 0 &&
            candidateOpening <= currentMinutes) {
            continue;
        }
        const dayName = DAY_NAMES[candidateDayIndex];
        const openingDisplay = formatBusinessTime(candidate.openingTime);
        return {
            isOpen: false,
            status: "CLOSED",
            message: offset === 0
                ? `Opens at ${openingDisplay}`
                : `Opens ${dayName} at ${openingDisplay}`,
            openingTime: candidate.openingTime,
            closingTime: candidate.closingTime,
            dayOfWeek,
            nextOpeningTime: candidate.openingTime
        };
    }
    // =================================================
    // NO UPCOMING OPENING FOUND
    // =================================================
    return {
        isOpen: false,
        status: "CLOSED",
        message: "Closed",
        openingTime: null,
        closingTime: null,
        dayOfWeek,
        nextOpeningTime: null
    };
}
