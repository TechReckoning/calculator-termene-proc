// dateUtils.js - Utilitare pentru date și zile lucrătoare

import { format, addDays, isSaturday, isSunday } from 'date-fns';
import { isLegalHoliday } from './holidays';

// Formatează data în format DD.MM.YYYY
export function formatDateRO(date) {
  return format(date, 'dd.MM.yyyy');
}

// Returnează ziua săptămânii în română
export function getWeekdayRO(date) {
  const zile = ['duminică', 'luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă'];
  return zile[date.getDay()];
}

// Verifică dacă o dată este sărbătoare legală
export function isHoliday(date, holidays) {
  const iso = format(date, 'yyyy-MM-dd');
  return holidays.includes(iso);
}

// Verifică dacă o dată este zi nelucrătoare (sâmbătă, duminică sau sărbătoare)
export function isNonWorkingDay(date) {
  return isSaturday(date) || isSunday(date) || isLegalHoliday(date);
}

// Verifică dacă o dată este zi lucrătoare
export function isWorkingDay(date, holidays) {
  return !isSaturday(date) && !isSunday(date) && !isHoliday(date, holidays);
}

// Returnează prima zi lucrătoare după data dată
export function nextWorkingDay(date, holidays) {
  let d = addDays(date, 1);
  while (!isWorkingDay(d, holidays)) {
    d = addDays(d, 1);
  }
  return d;
}

// Returnează ultima zi lucrătoare înainte de data dată
export function prevWorkingDay(date, holidays) {
  let d = addDays(date, -1);
  while (!isWorkingDay(d, holidays)) {
    d = addDays(d, -1);
  }
  return d;
} 