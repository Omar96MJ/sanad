
export const daysOfWeek = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
];

export const timeSlots = Array.from({ length: 12 }, (_, i) => {
  const hour = i + 8; // Starting from 8 AM
  return `${hour.toString().padStart(2, '0')}:00`;
});
