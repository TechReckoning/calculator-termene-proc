// holidays.js
// Returnează array cu datele sărbătorilor legale pentru un an dat (format YYYY-MM-DD)

// Algoritm pentru Paștele ortodox (Meeus/Jones/Butcher)
function getOrthodoxEaster(year) {
  const a = year % 19;
  const b = year % 4;
  const c = year % 7;
  const d = (19 * a + 16) % 30;
  const e = (2 * b + 4 * c + 6 * d) % 7;
  const f = d + e;
  let day = f + 3;
  let month = 4; // Aprilie
  if (day > 30) {
    day -= 30;
    month = 5; // Mai
  }
  return new Date(year, month - 1, day);
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

export function getLegalHolidays(year) {
  const easter = getOrthodoxEaster(year);
  const pentecost = new Date(easter);
  pentecost.setDate(easter.getDate() + 49); // Rusalii (49 zile după Paște)
  const pentecostMonday = new Date(pentecost);
  pentecostMonday.setDate(pentecost.getDate() + 1);

  return [
    `${year}-01-01`, // Anul Nou
    `${year}-01-02`,
    `${year}-01-24`, // Unirea Principatelor
    `${year}-05-01`, // Ziua Muncii
    formatDate(easter), // Paște (duminică)
    formatDate(new Date(easter.getFullYear(), easter.getMonth(), easter.getDate() + 1)), // Paște (luni)
    `${year}-06-01`, // Ziua Copilului
    formatDate(pentecost), // Rusalii (duminică)
    formatDate(pentecostMonday), // Rusalii (luni)
    `${year}-08-15`, // Adormirea Maicii Domnului
    `${year}-11-30`, // Sf. Andrei
    `${year}-12-01`, // Ziua Națională
    `${year}-12-25`, // Crăciun
    `${year}-12-26`, // Crăciun
  ];
} 