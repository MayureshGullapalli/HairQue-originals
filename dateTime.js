import moment from 'moment';

// date, day, month for an app

// day, date, year and month's real time data fetched from js date time module
var day = new Date().getDay();
const dayInWord = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var date = new Date().getDate(); //To get the Current Date

var month = new Date().getMonth();
const monthsInWord = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

var year = new Date().getFullYear();
//end here

// Time feature for an app
const times = [];
let i = 0
for (i = 0; i <= 10; i++) {
    const time = i + 7;
    const formattedTime = `${time}:00`;

    if (i !== 10) {
        times.push({ id: i, roundOffTime: formattedTime, thirtyMinutesTime: `${time}:30` });
        // times.push();
    }
}

//date feature for an app
// const days = [];
// const startDate = moment();

// for (let i = 0; i < 8; i++) {
//     const day = moment(startDate).add(i, 'days');
//     days.push({
//         id: i,
//         date: day.format('DD'),
//         dayOfWeek: day.format('ddd')
//     });
// }


const days = [];
const startDate = moment();

for (let i = 0; i < 7; i++) {
  const day = moment(startDate).add(i, 'days');
  const month = day.format('MMM');

  if (i > 0 && month !== days[i - 1].month) {
    // If the current month is different from the previous day's month
    const nextMonth = moment(startDate).add(i, 'days').startOf('month');
    days.push({
      id: i,
      date: nextMonth.format('DD'),
      dayOfWeek: nextMonth.format('ddd'),
      month: nextMonth.format('MMM')
    });
  } else {
    days.push({
      id: i,
      date: day.format('DD'),
      dayOfWeek: day.format('ddd'),
      month: month
    });
  }
}

export { day, dayInWord, date, month, monthsInWord, year, times, days }; 