// dateUtils.js
import { format, addDays, isSaturday, isSunday } from 'date-fns';

export function formatDateRO(date) {
  // Returnează data în format DD.MM.YYYY
  return format(date, 'dd.MM.yyyy');
}

export function getWeekdayRO(date) {
  // Returnează ziua săptămânii în română
  const zile = ['duminică', 'luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă'];
  return zile[date.getDay()];
}

export function isHoliday(date, holidays) {
  // Verifică dacă data este sărbătoare legală (date: Date, holidays: array YYYY-MM-DD)
  const iso = format(date, 'yyyy-MM-dd');
  return holidays.includes(iso);
}

export function isWorkingDay(date, holidays) {
  // O zi lucrătoare = nu e sâmbătă/duminică și nu e sărbătoare legală
  return !isSaturday(date) && !isSunday(date) && !isHoliday(date, holidays);
}

export function nextWorkingDay(date, holidays) {
  // Returnează prima zi lucrătoare după data dată
  let d = addDays(date, 1);
  while (!isWorkingDay(d, holidays)) {
    d = addDays(d, 1);
  }
  return d;
}

export function prevWorkingDay(date, holidays) {
  // Returnează ultima zi lucrătoare înainte de data dată
  let d = addDays(date, -1);
  while (!isWorkingDay(d, holidays)) {
    d = addDays(d, -1);
  }
  return d;
} 