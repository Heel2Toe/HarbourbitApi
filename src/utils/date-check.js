
const isConsecutive = (prevDate, currentDate) => {
  let prev = new Date(prevDate);
  let current = new Date(currentDate);
  current.setHours(0, 0, 0, 0);
  prev.setHours(0, 0, 0, 0);
  if (prev.getTime() == current.getTime()) {
    return;
  }
  prev.setDate(prev.getDate() + 1);
  return prev.getTime() === current.getTime();
};

export default isConsecutive;
