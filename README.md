# Calculator Termene Procedurale

Aplicație web pentru calcularea datei finale a unui termen procedural, conform legislației românești, ținând cont de sărbători legale și reguli specifice fiecărui sistem de calcul.

## Scop
Calculatorul determină data la care expiră un termen procedural, pornind de la o dată de început, durata și unitatea de timp (zile, ore, săptămâni, luni, ani), sistemul juridic aplicabil și sărbătorile legale.

## Funcționalități principale
- Selectare dată de început (calendar interactiv)
- Introducere durată și unitate de măsură
- Alegere sistem de calcul (pentru termene pe zile)
- Calcul automat al sărbătorilor legale (inclusiv Paște și Rusalii ortodox)
- Explicație logică pentru fiecare calcul
- Responsive (mobil/tabletă)

## Tehnologii folosite
- React
- Tailwind CSS
- Font: Montserrat (Google Fonts)

## Instalare și rulare locală
```bash
npm install
npm start
```

## Build pentru producție (ex: GitHub Pages)
```bash
npm run build
```

## Notă
Nu se salvează istoric. Aplicația este doar în limba română.

## Exemple de cazuri de testare
- Termen de 10 zile, sistem zile libere - începe pe 11.07.2025, se împlinește pe 22.07.2025
- Termen de 10 zile, sistem intermediar - începe pe 11.07.2025, se împlinește pe 21.07.2025
- Termen de 10 zile, sistem zile pline - începe pe 11.07.2025, se împlinește pe 21.07.2025 (s-ar împlini pe 20.07.2025, dar e duminică, deci zi nelucrătoare, și se împlinește astfel în prima zi lucrătoare următoare, luni, 21.07.2025)
- Termen de 48 de ore - începe pe 14.07.2025, se împlinește pe 17.07.2025, ora 0:00
- Termen de 1 săptămână, început la 14.07.2025 se împlinește pe 21.07.2025
- Termen de 1 an, început la 14.07.2025 se împlinește pe 14.07.2026 