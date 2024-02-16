import isConsecutive from "./date-check.js";


const statsForUser = (data) => {
  
  let date = new Date();
  let initial = {
    pieData: [
      { name: "Positive", value: 0 },
      { name: "Negative", value: 0 },
      { name: "Neutral", value: 0 },
    ],
    monthTotal: 0,
    streak: 0,
  };

  let prevDate = null;

  const result = data.reduce((accumulator, item) => {
    if (
      item.createdAt.getMonth() == date.getMonth() &&
      item.createdAt.getFullYear() == date.getFullYear()
    ) {
      accumulator.monthTotal += 1;
    }


    switch (item.sentiment) {
      case "positive":
        accumulator.pieData[0].value += 1;
        break;
      case "negative":
        accumulator.pieData[1].value += 1;
        break;
      case "neutral":
        accumulator.pieData[2].value += 1;
        break;

      default: break;
    }

    if (prevDate != null) {
      const consecutiveResult = isConsecutive(prevDate, item.createdAt);
      if (consecutiveResult === true) {
          accumulator.streak += 1;
      } else if (consecutiveResult === false) {
          accumulator.streak = 0;
      }
  }
  else{
    accumulator.streak += 1;
  }
    prevDate = item.createdAt;

    return accumulator;
  }, initial);

  return result;
};

export default statsForUser;
