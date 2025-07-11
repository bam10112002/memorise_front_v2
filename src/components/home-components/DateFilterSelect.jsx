import React from "react";

const DateFilterSelect = () => {
  return (
    <select
      id="date-filter"
      className={`p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
      aria-label="Фильтр по дате"
    >
      <option value="recent">Недавние</option>
      <option value="older">Старые</option>
    </select>
  );
};

export default DateFilterSelect;
