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
				<p className="cur-weather--temp">{weather.temp} °C</p>
				<p className="cur-weather--condition">{weather.condition}</p>
			</div>
		</div>
	);
}

function WeatherToday({ weatherToday }) {
	return (
		<div className="today-weather">
			{weatherToday.map(
				(item, index) =>
					index % 6 === 0 && (
						<div className="today-weather--info">
							<img src={item.condition.icon} />
							<p className="today-weather--time">
								<span>🕛</span>
								{item.time.split(" ")[1]}
							</p>
							<p className="today-weather--temp">
								<span>🌡️</span>
								{item.temp_c} °C
							</p>
							<p className="today-weather--condition">
								<span>🌿</span>
								{item.condition.text}
							</p>
						</div>
					)
			)}
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
	const [weatherToday, setWeatherToday] = useState([]);

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

	useEffect(
		function () {
			async function fetchToday() {
				const res =
					await fetch(`http://api.weatherapi.com/v1/forecast.json?key=1fd51841a8d24db6936171053252106&q=${query}&days=1&aqi=no&alerts=no
        `);
				const data = await res.json();
				setWeatherToday(data.forecast.forecastday[0].hour);
			}
			if (query.length < 3) {
				setWeatherToday([]);
				return;
			}
			fetchToday();
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
						<WeatherToday weatherToday={weatherToday} />
					</Box>
				)}
				{error && <ErrorMessage message={error} />}
			</Main>
		</>
	);
}
