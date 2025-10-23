import { useState } from "react"

export default function LocationAutocomplete({ locations, value, onChange, placeholder }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [inputValue, setInputValue] = useState(value || "")

  const filtered = inputValue.trim() === ""
    ? locations
    : locations.filter((loc) => loc.toLowerCase().includes(inputValue.toLowerCase()))

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
    onChange(e.target.value)
    setShowDropdown(true)
  }

  const handleSelect = (loc) => {
    setInputValue(loc)
    onChange(loc)
    setShowDropdown(false)
  }

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded"
        autoComplete="off"
      />
      {showDropdown && filtered.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full mt-1 rounded shadow max-h-48 overflow-auto">
          {filtered.map((loc, idx) => (
            <li
              key={loc + idx}
              onMouseDown={() => handleSelect(loc)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {loc}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
