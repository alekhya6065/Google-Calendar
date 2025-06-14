// App.js
import React, { useState } from "react";
import dayjs from "dayjs";
import "./App.css";

const festivalList = {
  // January
  "2025-01-01": "New Year's Day",
  "2025-01-14": "Makar Sankranti",
  "2025-01-26": "Republic Day",
  // February
  "2025-02-14": "Valentine's Day",
  // March
  "2025-03-08": "Maha Shivratri",
  "2025-03-29": "Holi",
  // April
  "2025-04-14": "Ambedkar Jayanti",
  "2025-04-17": "Ram Navami",
  // May
  "2025-05-01": "Labour Day",
  "2025-05-12": "Buddha Purnima",
  "2025-05-23": "Narasimha Jayanti",
  // June
  "2025-06-04": "Ganga Dussehra",
  "2025-06-06": "Nirjala Ekadashi",
  "2025-06-20": "Jagannath Rath Yatra",
  "2025-06-25": "Eid al-Adha",
  // July
  "2025-07-07": "Devshayani Ekadashi",
  "2025-07-16": "Guru Purnima",
  // August
  "2025-08-15": "Independence Day",
  "2025-08-19": "Raksha Bandhan",
  "2025-08-25": "Krishna Janmashtami",
  "2025-08-28": "Aavani Avittam",
  // September
  "2025-09-06": "Ganesh Chaturthi",
  // October
  "2025-10-02": "Gandhi Jayanti",
  "2025-10-20": "Valmiki Jayanti",
  "2025-10-21": "Karwa Chauth",
  // November
  "2025-11-01": "Kannada Rajyotsava",
  "2025-11-09": "Diwali",
  "2025-11-14": "Children's Day",
  // December
  "2025-12-25": "Christmas"
};

const App = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [note, setNote] = useState("");

  const today = dayjs().format("YYYY-MM-DD");
  const startDay = currentDate.startOf("month").startOf("week");
  const endDay = currentDate.endOf("month").endOf("week");

  const days = [];
  let day = startDay;
  while (day.isBefore(endDay, "day") || day.isSame(endDay, "day")) {
    days.push(day);
    day = day.add(1, "day");
  }

  const handleDateClick = (date) => {
    const formatted = date.format("YYYY-MM-DD");
    setSelectedDate(formatted);
    setNote(events[formatted] || "");
  };

  const saveNote = () => {
    setEvents({ ...events, [selectedDate]: note });
    setSelectedDate(null);
    setNote("");
  };

  const goToPrevMonth = () => {
    setCurrentDate(currentDate.subtract(1, "month"));
  };

  const goToNextMonth = () => {
    setCurrentDate(currentDate.add(1, "month"));
  };

  const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];
  const years = Array.from({ length: 100 }, (_, i) => dayjs().year() - 50 + i);

  const handleMonthChange = (e) => {
    const newMonth = months.indexOf(e.target.value);
    setCurrentDate(currentDate.month(newMonth));
  };

  const handleYearChange = (e) => {
    setCurrentDate(currentDate.year(Number(e.target.value)));
  };

  const upcomingFestivals = Object.entries(festivalList)
    .filter(([date]) => {
      const d = dayjs(date);
      return d.isSame(currentDate, 'month') && d.isSame(currentDate, 'year');
    })
    .sort((a, b) => dayjs(a[0]).diff(dayjs(b[0])));

  return (
    <div className="calendar-container">
      <header>
        <div className="nav-controls">
          <button onClick={goToPrevMonth}>{"<"}</button>
          <select value={months[currentDate.month()]} onChange={handleMonthChange}>
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          <select value={currentDate.year()} onChange={handleYearChange}>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <button onClick={goToNextMonth}>{">"}</button>
        </div>
      </header>

      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="day-name">{d}</div>
        ))}
        {days.map((d, index) => {
          const formatted = d.format("YYYY-MM-DD");
          const isCurrentMonth = d.month() === currentDate.month();
          const isToday = formatted === today;
          const isFestival = festivalList[formatted];

          return (
            <div
              key={index}
              className={`day-box ${isCurrentMonth ? "" : "disabled"} ${isToday ? "today" : ""}`}
              onClick={() => handleDateClick(d)}
            >
              <div className="date-number">{d.date()}</div>
              {isFestival && (
                <div className="festival-badge">{festivalList[formatted]}</div>
              )}
              {events[formatted] && (
                <div className="event-badge">{events[formatted]}</div>
              )}
            </div>
          );
        })}
      </div>

      <div className="festival-sidebar">
        <h4>Festivals This Month</h4>
        <ul>
          {upcomingFestivals.length > 0 ? (
            upcomingFestivals.map(([date, fest]) => (
              <li key={date}><strong>{dayjs(date).format("MMM D")}:</strong> {fest}</li>
            ))
          ) : (
            <li>No festivals this month</li>
          )}
        </ul>
      </div>

      {selectedDate && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{selectedDate}</h3>
            {festivalList[selectedDate] && (
              <p><strong>Festival:</strong> {festivalList[selectedDate]}</p>
            )}
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write your event..."
            />
            <div className="modal-buttons">
              <button onClick={saveNote}>Save</button>
              <button onClick={() => setSelectedDate(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;