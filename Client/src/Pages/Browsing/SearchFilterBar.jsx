export function SearchFilterBar({
  adventure,
  setAdventure,
  loc,
  setLoc,
  date,
  setDate,
  clearFilter,
  handleDateChange,
  wrapperStyle,
  onSearch, // <-- new prop
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">Adventure</label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search adventures..."
            value={adventure}
            onChange={(e) => {
              setAdventure(e.target.value);
              // updateParam("adventure", e.target.value); // removed auto param update
            }}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {adventure && (
            <button
              onClick={() => {
                clearFilter("adventure");
                // updateParam("adventure", ""); // removed auto param update
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Required: Enter location..."
            value={loc.charAt(0).toUpperCase() + loc.slice(1)}
            onChange={(e) => {
              const value = e.target.value.toLowerCase();
              setLoc(value);
            }}
            className={`w-full px-4 py-2 rounded-lg border ${!loc ? "border-red-300 bg-red-50" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            required
          />
          {loc && (
            <button
              onClick={() => {
                clearFilter("location");
                // updateParam("location", ""); // removed auto param update
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <div className="relative">
          <input
            type="date"
            value={date ? date.toISOString().split("T")[0] : ""}
            onChange={(e) => {
              const selectedDate = e.target.value ? new Date(e.target.value) : undefined;
              setDate(selectedDate);
              // updateParam("date", e.target.value); // removed auto param update
            }}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {date && (
            <button
              onClick={() => {
                clearFilter("date");
                // updateParam("date", ""); // removed auto param update
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 flex-shrink-0 self-end">
        <button
          onClick={() => {
            if (onSearch) onSearch();
          }}
          className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
        >
          Search
        </button>
        <button
          onClick={() => {
            clearFilter("all");
            setSearchParams({}, { replace: true });
          }}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
