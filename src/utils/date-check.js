
const isConsecutive = (prevDate, currentDate) => {

    let prev = new Date(prevDate);
    let current = new Date(currentDate);
    current.setDate(current.getDate() - 1);
    prev.setHours(0, 0, 0, 0);
    current.setHours(0, 0, 0, 0);
    
    return prev.getTime() === current.getTime() - (24 * 60 * 60 * 1000);
}

export default isConsecutive

