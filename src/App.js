import React, { useState } from 'react';
import { getLegalHolidays } from './holidays';
import { formatDateRO, getWeekdayRO, isWorkingDay, nextWorkingDay } from './dateUtils';

function App() {
  const [startDate, setStartDate] = useState(null);
  const [duration, setDuration] = useState('');
  const [unit, setUnit] = useState('zile');
  const [system, setSystem] = useState('zile_libere');
  const [result, setResult] = useState(null);
  const [explanation, setExplanation] = useState('');
  const [calculated, setCalculated] = useState(false);

  const selectedYear = startDate ? startDate.getFullYear() : '';
  const isFormValid = startDate && duration && Number(duration) > 0 && unit && (unit !== 'zile' || system);

  // Resetare rezultat la modificarea inputurilor
  React.useEffect(() => {
    setResult(null);
    setExplanation('');
    setCalculated(false);
  }, [startDate, duration, unit, system]);

  function handleCalculate() {
    if (!isFormValid) return;
    
    let resultDate = null;
    let logic = '';
    const n = Number(duration);

    if (unit === 'zile') {
      // Sistemul zilelor libere (Cod procedură civilă)
      if (system === 'zile_libere') {
        let d = new Date(startDate);
        d.setDate(d.getDate() + 1); // ziua de început nu se ia în calcul
        d.setDate(d.getDate() + n); // adaug n zile calendaristice
        
        // dacă nu e lucrătoare, mergem la prima zi lucrătoare
        while (!isWorkingDay(d, getLegalHolidays(d.getFullYear()))) {
          d = nextWorkingDay(d, getLegalHolidays(d.getFullYear()));
        }
        resultDate = d;
        logic = `Termenul de ${n} zile calculat conform Codului de procedură civilă, fără a include ziua de început și ultima zi a termenului, expiră la ora 24:00 în data de ${formatDateRO(resultDate)} (${getWeekdayRO(resultDate)}).`;
      }
      // Sistemul intermediar (Legea 101/2016)
      else if (system === 'intermediar') {
        let d = new Date(startDate);
        d.setDate(d.getDate() + 1); // ziua comunicării nu se ia în calcul
        d.setDate(d.getDate() + n); // numărăm n zile calendaristice
        d.setDate(d.getDate() - 1); // ne întoarcem pe ultima zi
        
        // dacă nu e lucrătoare, mergem la prima zi lucrătoare
        while (!isWorkingDay(d, getLegalHolidays(d.getFullYear()))) {
          d = nextWorkingDay(d, getLegalHolidays(d.getFullYear()));
        }
        resultDate = d;
        logic = `Termenul de ${n} zile calculat conform Legii 101/2016, fără a include ziua de comunicare și prelungit din cauza zilelor nelucrătoare, expiră la ora 24:00 în data de ${formatDateRO(resultDate)} (${getWeekdayRO(resultDate)}).`;
      }
      // Sistemul zilelor pline (sistem brut)
      else if (system === 'zile_pline') {
        let d = new Date(startDate);
        d.setDate(d.getDate() + n - 1);
        
        // dacă nu e lucrătoare, mergem la prima zi lucrătoare
        while (!isWorkingDay(d, getLegalHolidays(d.getFullYear()))) {
          d = nextWorkingDay(d, getLegalHolidays(d.getFullYear()));
        }
        resultDate = d;
        logic = `Termenul de ${n} zile calculat în sistem brut (zile pline), incluzând ziua de început și prelungit dacă expiră într-o zi nelucrătoare, expiră la ora 24:00 în data de ${formatDateRO(resultDate)} (${getWeekdayRO(resultDate)}).`;
      }
    }
    else if (unit === 'ore') {
      let d = new Date(startDate);
      d.setDate(d.getDate() + 1); // începe de la 00:00 a zilei următoare
      d.setHours(0, 0, 0, 0);
      d = new Date(d.getTime() + n * 60 * 60 * 1000); // adaug n ore
      
      // dacă se termină într-o zi nelucrătoare, mergem la prima zi lucrătoare
      while (!isWorkingDay(d, getLegalHolidays(d.getFullYear()))) {
        d = nextWorkingDay(d, getLegalHolidays(d.getFullYear()));
        d.setHours(0, 0, 0, 0);
      }
      resultDate = d;
      logic = `Termenul de ${n} ore începe la ora 00:00 a zilei următoare (${formatDateRO(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 1))}) și expiră la ora 0:00 în data de ${formatDateRO(resultDate)} (${getWeekdayRO(resultDate)}), prelungit dacă expiră într-o zi nelucrătoare.`;
    }
    else if (unit === 'săptămâni') {
      let d = new Date(startDate);
      d.setDate(d.getDate() + n * 7);
      
      // dacă nu e lucrătoare, mergem la prima zi lucrătoare
      while (!isWorkingDay(d, getLegalHolidays(d.getFullYear()))) {
        d = nextWorkingDay(d, getLegalHolidays(d.getFullYear()));
      }
      resultDate = d;
      logic = `Termenul de ${n} săptămână${n > 1 ? 'i' : 'ă'} se încheie în ziua corespunzătoare, iar dacă expiră într-o zi nelucrătoare se prelungește la prima zi lucrătoare. Termenul expiră la ora 24:00 în data de ${formatDateRO(resultDate)} (${getWeekdayRO(resultDate)}).`;
    }
    else if (unit === 'luni') {
      let d = new Date(startDate);
      let zi = d.getDate();
      d.setMonth(d.getMonth() + n);
      
      // dacă luna nu are ziua respectivă, se ia ultima zi a lunii
      if (d.getDate() < zi) {
        d.setDate(0); // ultima zi a lunii anterioare
      } else {
        d.setDate(zi);
      }
      
      // dacă nu e lucrătoare, mergem la prima zi lucrătoare
      while (!isWorkingDay(d, getLegalHolidays(d.getFullYear()))) {
        d = nextWorkingDay(d, getLegalHolidays(d.getFullYear()));
      }
      resultDate = d;
      logic = `Termenul de ${n} lun${n > 1 ? 'i' : 'ă'} se încheie în ziua corespunzătoare, iar dacă luna nu are ziua respectivă se ia ultima zi a lunii. Dacă expiră într-o zi nelucrătoare, se prelungește la prima zi lucrătoare. Termenul expiră la ora 24:00 în data de ${formatDateRO(resultDate)} (${getWeekdayRO(resultDate)}).`;
    }
    else if (unit === 'ani') {
      let d = new Date(startDate);
      let zi = d.getDate();
      let luna = d.getMonth();
      d.setFullYear(d.getFullYear() + n);
      
      // dacă luna nu are ziua respectivă, se ia ultima zi a lunii
      if (d.getMonth() !== luna) {
        d.setDate(0); // ultima zi a lunii anterioare
      } else {
        d.setDate(zi);
      }
      
      // dacă nu e lucrătoare, mergem la prima zi lucrătoare
      while (!isWorkingDay(d, getLegalHolidays(d.getFullYear()))) {
        d = nextWorkingDay(d, getLegalHolidays(d.getFullYear()));
      }
      resultDate = d;
      logic = `Termenul de ${n} an${n > 1 ? 'i' : ''} se încheie în ziua corespunzătoare, iar dacă nu există ziua respectivă se ia ultima zi a lunii. Dacă expiră într-o zi nelucrătoare, se prelungește la prima zi lucrătoare. Termenul expiră la ora 24:00 în data de ${formatDateRO(resultDate)} (${getWeekdayRO(resultDate)}).`;
    }
    
    setResult(resultDate ? formatDateRO(resultDate) : '');
    setExplanation(logic);
    setCalculated(true);
  }

  function handleReset() {
    setStartDate(null);
    setDuration('');
    setUnit('zile');
    setSystem('zile_libere');
    setResult(null);
    setExplanation('');
    setCalculated(false);
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col items-center px-2 py-6">
      {/* Intro */}
      <section className="max-w-xl w-full mb-8">
        <h1 className="text-2xl font-bold mb-2">Calculator termene procedurale</h1>
        <p className="mb-4 text-base">
          Acest calculator te ajută să stabilești rapid data la care expiră un termen procedural, conform legislației românești, ținând cont de sărbători legale și reguli specifice fiecărui sistem de calcul.
        </p>
      </section>

      {/* Data de început */}
      <section className="max-w-xl w-full mb-6">
        <h2 className="text-lg font-semibold mb-1">1. Data de început</h2>
        <p className="mb-2 text-sm text-gray-700">Selectează data de la care începe termenul procedural.</p>
        <div className="border rounded p-4 bg-gray-50 text-gray-900 text-center flex justify-center">
          <input
            type="date"
            value={startDate ? startDate.toISOString().slice(0, 10) : ''}
            onChange={e => setStartDate(e.target.value ? new Date(e.target.value) : null)}
            className="w-full max-w-xs px-3 py-2 border rounded focus:outline-none focus:ring focus:border-black text-center"
          />
        </div>
      </section>

      {/* Durata termenului */}
      <section className="max-w-xl w-full mb-6">
        <h2 className="text-lg font-semibold mb-1">2. Durata termenului</h2>
        <p className="mb-2 text-sm text-gray-700">Introdu numărul de zile, ore, săptămâni, luni sau ani pentru termenul procedural.</p>
        <div className="border rounded p-4 bg-gray-50 text-gray-900 text-center flex justify-center">
          <input
            type="number"
            min="1"
            value={duration}
            onChange={e => setDuration(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="Ex: 10"
            className="w-full max-w-xs px-3 py-2 border rounded focus:outline-none focus:ring focus:border-black text-center"
          />
        </div>
      </section>

      {/* Unitate de măsură */}
      <section className="max-w-xl w-full mb-6">
        <h2 className="text-lg font-semibold mb-1">3. Unitate de măsură</h2>
        <p className="mb-2 text-sm text-gray-700">Alege unitatea de măsură pentru termen: zile, ore, săptămâni, luni sau ani.</p>
        <div className="border rounded p-4 bg-gray-50 text-gray-900 text-center flex justify-center">
          <select
            value={unit}
            onChange={e => setUnit(e.target.value)}
            className="w-full max-w-xs px-3 py-2 border rounded focus:outline-none focus:ring focus:border-black text-center"
          >
            <option value="zile">zile</option>
            <option value="ore">ore</option>
            <option value="săptămâni">săptămâni</option>
            <option value="luni">luni</option>
            <option value="ani">ani</option>
          </select>
        </div>
      </section>

      {/* Sistem de calcul */}
      {unit === 'zile' && (
        <section className="max-w-xl w-full mb-6">
          <h2 className="text-lg font-semibold mb-1">4. Sistem de calcul aplicabil</h2>
          <p className="mb-2 text-sm text-gray-700">Alege sistemul de calcul pentru termenele pe zile:</p>
          <div className="border rounded p-4 bg-gray-50 text-gray-900 text-center flex justify-center">
            <select
              value={system}
              onChange={e => setSystem(e.target.value)}
              className="w-full max-w-xs px-3 py-2 border rounded focus:outline-none focus:ring focus:border-black text-center"
            >
              <option value="zile_libere">Zile libere (Cod procedură civilă)</option>
              <option value="intermediar">Intermediar (Legea 101/2016)</option>
              <option value="zile_pline">Zile pline (sistem brut)</option>
            </select>
          </div>
        </section>
      )}

      {/* An sărbători legale */}
      <section className="max-w-xl w-full mb-6">
        <h2 className="text-lg font-semibold mb-1">5. Anul de referință pentru sărbători legale</h2>
        <p className="mb-2 text-sm text-gray-700">Anul este selectat automat în funcție de data de început.</p>
        <div className="border rounded p-4 bg-gray-50 text-gray-900 text-center flex justify-center">
          <select
            value={selectedYear}
            disabled
            className="w-full max-w-xs px-3 py-2 border rounded bg-gray-100 text-gray-500 text-center cursor-not-allowed"
          >
            <option value="">Alege data de început</option>
            {selectedYear && <option value={selectedYear}>{selectedYear}</option>}
          </select>
        </div>
      </section>

      {/* Buton de calcul și output */}
      <section className="max-w-xl w-full mb-6">
        <div className="flex justify-center gap-4">
          <button
            className={`bg-black text-white px-6 py-2 rounded font-medium transition ${!isFormValid ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`}
            disabled={!isFormValid}
            onClick={handleCalculate}
          >
            Calculează
          </button>
          <button
            className="bg-gray-200 text-black px-6 py-2 rounded font-medium border border-gray-300 hover:bg-gray-300 transition"
            onClick={handleReset}
            type="button"
          >
            Resetează
          </button>
        </div>
        <div className={`mt-6 border rounded p-4 bg-gray-50 text-center min-h-[60px] transition ${calculated ? 'ring-2 ring-green-400' : ''}`}>
          {result && (
            <>
              <div className="text-xl font-bold mb-2">{result}</div>
              <div className="text-base text-gray-700">{explanation}</div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
