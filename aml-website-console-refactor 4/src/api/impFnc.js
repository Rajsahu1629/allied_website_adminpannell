export const formatDate = (date) => {
  if (!(date instanceof Date) || isNaN(date)) {
    return "Invalid Date"; // Handle invalid date inputs
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};


export const formatDate12 = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Convert 24-hour time to 12-hour format
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert hour '0' to '12'
  const formattedHours = String(hours).padStart(2, "0");

  return `${day}-${month}-${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
};

export const  NewformatDate=(timestamp)=> {
  const date = new Date(timestamp);
  const month = date.toLocaleString('en-US', { month: 'long' });
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${month} ${day}, ${year} ${hours}:${minutes}:${seconds}`;


}


// for trends

export const formatTrendsDate=(dateString)=>{
  const date = new Date(dateString);
  // Get date components
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
  const year = date.getFullYear();

  // Get time components
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Format date and time into "DD-MM-YYYY HH:mm:ss"
  const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;

  return formattedDate;
}
// Example usage:
// const result = formatTrendsDate("2024-09-24T11:33:02.797Z");
// console.log(result); // Output: "24-09-2024 11:33:2"

export const DateFormat=(timestamp)=>{
  const date = new Date(timestamp);

  // Extract date components
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  
  // Extract time components
  const hours24 = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  // Format for 24-hour clock
  const date24HourFormat = `${day}-${month}-${year} ${hours24}:${minutes}:${seconds}`;

  // Format for 12-hour clock
  let hours12 = date.getHours() % 12 || 12; // Convert 24-hour time to 12-hour time
  const period = date.getHours() < 12 ? 'AM' : 'PM';
  hours12 = String(hours12).padStart(2, '0');
  
  const date12HourFormat = `${day}-${month}-${year} ${hours12}:${minutes}:${seconds} ${period}`;

  return {
    '12HourFormat': date12HourFormat,
    '24HourFormat': date24HourFormat
  };
}
// Example usage
// const timestamp = Date.now();
// console.log(formatDate(timestamp));






















































































// const getCurrentDateTimeInIndia = () => {
//   const now = new Date();
//   const options = { timeZone: 'Asia/Kolkata' };
//   const formattedDate = now.toLocaleString(undefined, options);

//   return formattedDate;
// };

// // Usage Example
// const currentDateTimeInIndia = getCurrentDateTimeInIndia();
// // console.log(currentDateTimeInIndia);
