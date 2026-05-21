const { addDays, format, isWeekend } = require('date-fns');

const cycle = ['ABCD', 'EFGH', 'BCDA', 'FGHE', 'CDAB', 'GHEF', 'DABC', 'HEFG'];
let cycleIndex = 0;

const breaks = [
  { start: '2026-08-31', end: '2026-09-02', label: 'National Holiday' },
  { start: '2026-09-25', end: '2026-09-25', label: 'PD Day' },
  { start: '2026-10-08', end: '2026-10-09', label: 'Conferences' },
  { start: '2026-10-10', end: '2026-10-18', label: 'Fall Break' },
  { start: '2026-11-24', end: '2026-11-24', label: 'Culture Day' },
  { start: '2026-11-27', end: '2026-11-27', label: 'PD Day' },
  { start: '2026-12-19', end: '2027-01-03', label: 'Winter Break' },
  { start: '2027-01-04', end: '2027-01-04', label: 'PD Day' },
  { start: '2027-02-03', end: '2027-02-14', label: 'Tet Holiday' },
  { start: '2027-03-26', end: '2027-03-26', label: 'Conferences' },
  { start: '2027-03-27', end: '2027-04-04', label: 'Spring Break' },
  { start: '2027-04-16', end: '2027-04-16', label: 'Kings Day' },
  { start: '2027-04-29', end: '2027-04-30', label: 'Reunification Day' },
  { start: '2027-05-21', end: '2027-05-21', label: 'PD Day' }
];

const results = {};
let currentDate = new Date('2026-08-10T00:00:00'); 
const endDate = new Date('2027-06-11T00:00:00');

while (currentDate <= endDate) {
  const dStr = format(currentDate, 'yyyy-MM-dd');
  
  if (!isWeekend(currentDate)) {
    let isBreak = false;
    for (const b of breaks) {
      if (currentDate >= new Date(b.start + 'T00:00:00') && currentDate <= new Date(b.end + 'T00:00:00')) {
        results[dStr] = b.label;
        isBreak = true;
        break;
      }
    }
    
    if (!isBreak) {
      if (dStr === '2026-08-10') {
         results[dStr] = 'Orientation';
      } else {
        if (dStr === '2027-01-05') cycleIndex = 0; // reset
        results[dStr] = cycle[cycleIndex % 8];
        cycleIndex++;
      }
    }
  }
  
  currentDate = addDays(currentDate, 1);
}

const fs = require('fs');
fs.writeFileSync('./src/lib/schedule.ts', `export const schoolSchedule: Record<string, string> = ${JSON.stringify(results, null, 2)};\n`);
console.log('Done!');
