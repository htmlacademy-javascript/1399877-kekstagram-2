const validateTimeSlot = (...arrg) => {
  const timeRegex = /^([01]?\d|2[0-3]):[0-5]?\d$/;
  arrg.forEach((element, index) => {
    const isLast = index === arrg.length - 1;

    if (isLast) {
      const isValidNumber = Number.isInteger(Number(element));
      if (!isValidNumber) {
        throw new Error(`Неверный формат продолжительности: ${element}. Ожидалось целое число минут, например "45".`);
      }
    } else {
      if (!timeRegex.test(element)) {
        throw new Error(`Неверный формат времени: ${element}. Ожидался формат "часы:минуты", например "8:30" или "08:05".`);
      }
    }
  });
};

const parseTimeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

const isTimeSlotAvailable = (startDay, endDay, startMeeting, durationMeeting) => {
  validateTimeSlot(startDay, endDay, startMeeting, durationMeeting);
  const startDayMinutes = parseTimeToMinutes(startDay);
  const endDayMinutes = parseTimeToMinutes(endDay);
  const startMeetingMinutes = parseTimeToMinutes(startMeeting);

  if (startMeetingMinutes < startDayMinutes || startMeetingMinutes + durationMeeting > endDayMinutes) {
    return false;
  }

  return true;
};
