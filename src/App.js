import { useEffect, useState } from "react";

const key = "1fd51841a8d24db6936171053252106";

function NavBar({ query, setQuery }) {
	return (
		<nav className="nav-bar">
			<input
				className="search"
				type="text"
				placeholder="Enter your city"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
			></input>
		</nav>
	);
}

// function SearchButton({ onSearchWeather }) {
// 	return (
// 		<button className="search-button" onClick={onSearchWeather}>
// 			Search
// 		</button>
// 	);
// }

function Main({ children }) {
	return <main className="main">{children}</main>;
}

function Box({ children }) {
	return <div className="box">{children}</div>;
}

function WeatherNow({ weather }) {
	return (
		<div className="cur-weather">
			<img src={weather.icon} />
			<div className="cur-weather--info">
				<h3 className="cur-weather--location">{weather.location}</h3>
				<p className="cur-weather--temp">{weather.temp}</p>
				<p className="cur-weather--condition">{weather.condition}</p>
			</div>
		</div>
	);
}

function ErrorMessage({ message }) {
	return (
		<p className="error">
			<span>‼️</span> {message} <span>‼️</span>
		</p>
	);
}

export default function App() {
	const [query, setQuery] = useState("");
	const [error, setError] = useState("");
	const [weatherNow, setWeatherNow] = useState({});

	useEffect(
		function () {
			async function fetchNow() {
				try {
					setError("");
					const res = await fetch(
						`http://api.weatherapi.com/v1/current.json?key=1fd51841a8d24db6936171053252106&q=${query}&aqi=no`
					);
					if (res.status === 400) throw new Error("There is no such city");
					if (!res.ok)
						throw new Error("Something went wrong while fetching forecast");
					const data = await res.json();
					if (data.Response === "False") throw new Error(data.Error);
					const wNow = {
						location: data.location.name,
						temp: data.current.temp_c,
						icon: data.current.condition.icon,
						condition: data.current.condition.text,
					};
					setWeatherNow(wNow);
					setError("");
				} catch (err) {
					if (err.name !== "AbortError") {
						setError(err.message);
					}
				}
			}
			if (query.length < 3) {
				setWeatherNow({});
				return;
			}
			fetchNow();
		},
		[query]
	);
	return (
		<>
			<NavBar query={query} setQuery={setQuery} />

			<Main>
				{!error && (
					<Box>
						<WeatherNow weather={weatherNow} />
					</Box>
				)}
				{error && <ErrorMessage message={error} />}
			</Main>
		</>
	);
}
