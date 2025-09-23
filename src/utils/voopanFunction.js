// export function checkExpirationStatus(givenDate) {
//   // Split the given date string into year, month, and day
//   const [year, month, day] = givenDate?.split("-");

//   // Convert the given date string to a Date object
//   const dateToCheck = new Date(
//     parseInt(year),
//     parseInt(month) - 1,
//     parseInt(day)
//   );

//   // Get the current date
//   const currentDate = new Date();

//   // Calculate the difference in milliseconds
//   const timeDifference = dateToCheck.getTime() - currentDate.getTime();

//   // Calculate the difference in days
//   const daysDifference = timeDifference / (1000 * 3600 * 24);

//   if (daysDifference < 0) {
//     return false;
//   } else if (daysDifference <= 7) {
//     return true;
//   } else {
//     return false;
//   }
// }
//

export function checkExpirationStatus(givenDate) {
  // Add a check to ensure givenDate is not null or undefined
  if (!givenDate) {
    console.error("Error: givenDate is null, undefined, or an empty string.");
    return false; // Or handle the error as appropriate for your application
  }

  // Split the given date string into year, month, and day
  const [year, month, day] = givenDate.split("-");

  // Convert the given date string to a Date object
  const dateToCheck = new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day)
  );

  // Get the current date
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const timeDifference = dateToCheck.getTime() - currentDate.getTime();

  // Calculate the difference in days
  const daysDifference = timeDifference / (1000 * 3600 * 24);

  if (daysDifference < 0) {
    return false;
  } else if (daysDifference <= 7) {
    return true;
  } else {
    return false;
  }
}

export function filterByVoopanDistance(list, from, to) {
  const filteredList = list.filter((item) => {
    const distance = item.voopan_away_distance;
    return distance !== undefined && distance >= from && distance <= to;
  });

  return filteredList;
}

export function filterVoopansByDateRange(date1, date2, objectsList) {
  const startDate = new Date(date1);
  const endDate = new Date(date2);

  // Ensure that the dates are valid
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error("Invalid date format");
  }

  return objectsList.filter((obj) => {
    const objDate = new Date(obj.voopons_date);
    return objDate >= startDate && objDate <= endDate;
  });
}
