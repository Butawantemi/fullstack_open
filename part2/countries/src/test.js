import axios from "axios";
import { useEffect, useState } from "react";

const api_key = import.meta.env.VITE_SOME_KEY;
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/all";

const CountryDetails = ({ country }) => {
  const [weather, setWeather] = useState(null);
  const capital = country.capital?.[0];

  useEffect(() => {
    if (!capital) return;

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`,
      )
      .then((response) => setWeather(response.data))
      .catch((err) => console.error("Failed to fetch weather data", err));
  }, [capital]);

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital ? country.capital.join(", ") : "N/A"}</p>
      <p>Area: {country.area}</p>

      <h2>Languages:</h2>
      <ul>
        {country.languages &&
          Object.entries(country.languages).map(([code, name]) => (
            <li key={code}>{name}</li>
          ))}
      </ul>

      <div>
        <img
          src={country.flags.png}
          alt={country.flags.alt || `Flag of ${country.name.common}`}
          width="150"
        />
      </div>

      {capital && (
        <>
          <h2>Weather in {capital}</h2>
          {weather ? (
            <div>
              <p>Temperature {weather.main.temp.toFixed(1)} Celsius</p>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
              />
              <p>Wind {weather.wind.speed} m/s</p>
            </div>
          ) : (
            <p>Loading weather...</p>
          )}
        </>
      )}
    </div>
  );
};

const CountryList = ({ countries, handleShow }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter.</p>;
  }

  if (countries.length === 1) {
    return <CountryDetails country={countries[0]} />;
  }

  return (
    <div>
      {countries.map((c) => (
        <div key={c.cca3 || c.name.common}>
          {c.name.common} <button onClick={() => handleShow(c)}>Show</button>
        </div>
      ))}
    </div>
  );
};

function App() {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    axios
      .get(baseUrl)
      .then((response) => setCountries(response.data))
      .catch((err) => console.error("Error fetching countries", err));
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setSelectedCountry(null); // Reset manually selected country when query changes
  };

  const filteredCountries = search.trim()
    ? countries.filter((c) =>
        c.name.common.toLowerCase().includes(search.toLowerCase()),
      )
    : [];

  return (
    <div>
      <div>
        find countries: <input value={search} onChange={handleSearchChange} />
      </div>

      {selectedCountry ? (
        <CountryDetails country={selectedCountry} />
      ) : (
        <CountryList
          countries={filteredCountries}
          handleShow={(c) => setSelectedCountry(c)}
        />
      )}
    </div>
  );
}

export default App;
