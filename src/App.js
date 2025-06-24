import { useEffect, useState } from "react";

const key = "1fd51841a8d24db6936171053252106";

function NavBar({ children }) {
	return (
		<nav className="nav-bar">
			<input className="search" type="text" placeholder="Enter your city"></input>
			{children}
		</nav>
	);
}

function SearchButton() {
	return <button className="search-button">Search</button>;
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
				<p className="cur-weather--temp">{weather.temp}</p>
				<p className="cur-weather--condition">{weather.condition}</p>
			</div>
		</div>
	);
}

export default function App() {
	const [weatherNow, setWeatherNow] = useState({});

	useEffect(function () {
		async function fetchNow() {
			const res = await fetch(
				`http://api.weatherapi.com/v1/current.json?key=1fd51841a8d24db6936171053252106&q=Kyiv&aqi=no`
			);
			const data = await res.json();
			const wNow = {
				location: data.location.name,
				temp: data.current.temp_c,
				icon: data.current.condition.icon,
				condition: data.current.condition.text,
			};
			setWeatherNow(wNow);
		}
		fetchNow();
	}, []);
	return (
		<>
			<NavBar>
				<SearchButton />
			</NavBar>

			<Main>
				<Box>
					<WeatherNow weather={weatherNow} />
				</Box>
			</Main>
		</>
	);
}
