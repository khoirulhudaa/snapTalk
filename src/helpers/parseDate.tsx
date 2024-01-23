const parseDate = (dateString: string | undefined): Date => {
    if (!dateString) {
        throw new Error("Invalid date string: cannot parse undefined");
    }

    const dateRegex = /^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2})$/;
    const match = dateString.match(dateRegex);

    if (!match) {
        throw new Error("Invalid date string format");
    }

    const [, day, month, year, hour, minute] = match.map(Number);

    // Months in JavaScript are 0-indexed, so subtract 1 from the month
    return new Date(year, month - 1, day, hour, minute);
};

export default parseDate;
