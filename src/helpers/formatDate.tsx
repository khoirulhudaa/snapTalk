const getHourFromDateString = (dateString?: any) => {
  let dateParts = dateString.split(" ");
  let timePart = dateParts[1];


  return timePart;
}

export default getHourFromDateString

