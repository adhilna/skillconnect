import React, { useState, useEffect, useRef } from "react";

function CityAutocomplete({ value, onChange, onBlur, errors }) {
    const [input, setInput] = useState(value || '');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
        if (input.length > 1) {
            fetch(`http://localhost:8000/api/v1/profiles/city-autocomplete/?q=${input}`)
                .then(res => res.json())
                .then(data => {
                    // Sort suggestions alphabetically by city name
                    data.sort((a, b) => a.name.localeCompare(b.name));
                    setSuggestions(data);
                    setShowSuggestions(true);
                })
                .catch(() => setSuggestions([]));
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, 300);

    return () => clearTimeout(timer);
}, [input]);


    const handleSelect = (city) => {
        setInput(city.name);
        onChange({ target: { name: 'location', value: city.name } });
        setShowSuggestions(false);
    };

    const handleChange = (e) => {
        setInput(e.target.value);
        onChange(e);
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={inputRef}>
            <input
                type="text"
                name="location"
                value={input}
                onChange={handleChange}
                onBlur={onBlur}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-400 transition-colors"
                placeholder="New York, USA"
                autoComplete="off"
            />
            {errors && errors.location && <p className="text-red-400 text-sm mt-1">{errors.location}</p>}
            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-gray-800 border border-white/20 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((city) => (
                        <li
                            key={city.id}
                            className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white"
                            onClick={() => handleSelect(city)}
                        >
                            {city.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default CityAutocomplete;
