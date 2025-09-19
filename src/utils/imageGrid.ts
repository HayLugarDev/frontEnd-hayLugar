export const imageGridPosition = (index: number) => {
  const positions = [
    'col-start-5 row-start-1',
    'col-start-7 row-start-1',
    'col-start-5 row-start-5',
    'col-start-7 row-start-5'
  ];
  return `col-span-4 md:col-span-2 row-span-4 ${positions[index] || ''}`;
};