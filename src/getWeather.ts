import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ILocation } from './locationsContext';

const KEY = process.env.REACT_APP_WEATHER_API_KEY;
const API_BASE_URI = 'https://api.weatherapi.com/v1/';
const API_FORECAST_BASE_URI = `${API_BASE_URI}forecast.json?key=${KEY}&days=10&q=`;
const API_AUTOCOMPLETE_BASE_URI = `${API_BASE_URI}search.json?key=${KEY}&q=`;

// Using top-level cache goes against React design principles, but for this
// example, it's acceptable.
const locationCache: {
	[id: string]: { data: any; date: number };
} = {};

const searchCache: {
	[place: string]: { data: any; date: number };
} = {};

interface IWeatherOptions {
	/**
	 * Amount of time it takes for requests to expire
	 */
	expireTime?: number;
}

interface Location {
	name: string;
	region: string;
	country: string;
	lat: number;
	lon: number;
	tz_id: string;
	localtime_epoch: number;
	localtime: string;
}

interface Condition {
	text: string;
	icon: string;
	code: number;
}

interface Current {
	last_updated_epoch: number;
	last_updated: string;
	temp_c: number;
	temp_f: number;
	is_day: number;
	condition: Condition;
	wind_mph: number;
	wind_kph: number;
	wind_degree: number;
	wind_dir: string;
	pressure_mb: number;
	pressure_in: number;
	precip_mm: number;
	precip_in: number;
	humidity: number;
	cloud: number;
	feelslike_c: number;
	feelslike_f: number;
	vis_km: number;
	vis_miles: number;
	uv: number;
	gust_mph: number;
	gust_kph: number;
}

interface Day {
	maxtemp_c: number;
	maxtemp_f: number;
	mintemp_c: number;
	mintemp_f: number;
	avgtemp_c: number;
	avgtemp_f: number;
	maxwind_mph: number;
	maxwind_kph: number;
	totalprecip_mm: number;
	totalprecip_in: number;
	avgvis_km: number;
	avgvis_miles: number;
	avghumidity: number;
	daily_will_it_rain: number;
	daily_chance_of_rain: number;
	daily_will_it_snow: number;
	daily_chance_of_snow: number;
	condition: Condition;
	uv: number;
}

interface Astro {
	sunrise: string;
	sunset: string;
	moonrise: string;
	moonset: string;
	moon_phase: string;
	moon_illumination: string;
}

interface Hour {
	time_epoch: number;
	time: string;
	temp_c: number;
	temp_f: number;
	is_day: number;
	condition: Condition;
	wind_mph: number;
	wind_kph: number;
	wind_degree: number;
	wind_dir: string;
	pressure_mb: number;
	pressure_in: number;
	precip_mm: number;
	precip_in: number;
	humidity: number;
	cloud: number;
	feelslike_c: number;
	feelslike_f: number;
	windchill_c: number;
	windchill_f: number;
	heatindex_c: number;
	heatindex_f: number;
	dewpoint_c: number;
	dewpoint_f: number;
	will_it_rain: number;
	chance_of_rain: number;
	will_it_snow: number;
	chance_of_snow: number;
	vis_km: number;
	vis_miles: number;
	gust_mph: number;
	gust_kph: number;
	uv: number;
}

interface Forecastday {
	date: string;
	date_epoch: number;
	day: Day;
	astro: Astro;
	hour: Hour[];
}

interface Forecast {
	forecastday: Forecastday[];
}

export interface IWeatherForecastReturnData {
	location: Location;
	current: Current;
	forecast: Forecast;
}

export function useWeatherData(location?: ILocation): IWeatherForecastReturnData | null {
	const [data, setData] = useState<IWeatherForecastReturnData | null>(null);

	useEffect(() => {
		const run = async () => {
			if (!location) return;

			const data = await getWeatherForecast(location);
			setData(data);
		};

		run();
	}, [location]);

	return data;
}

/**
 * Get forecast data either from cache or direct request for a specific location
 * @param place Place name
 * @param options Options on caching
 * @returns Weather forecast data promise
 */
export default function getWeatherForecast(
	location?: ILocation,
	options?: IWeatherOptions
): Promise<IWeatherForecastReturnData> {
	return new Promise((resolve, reject) => {
		const expiryTime = options?.expireTime ?? 10 * 1000 * 60; // 10 minutes expiry
		const data = locationCache[location?.uuid ?? ''];

		if (data && Date.now() - data.date < expiryTime) {
			resolve(data.data);
		} else {
			axios
				.get(
					API_FORECAST_BASE_URI +
						encodeURIComponent(location?.coordinates?.join(',') ?? '')
				)
				.then((res) => {
					locationCache[location?.uuid ?? ''] = {
						data: res.data,
						date: Date.now(),
					};
					resolve(res.data);
				})
				.catch(reject);
		}
	});
}

export interface IWeatherAutocompleteEntry {
	id: number;
	name: string;
	region: string;
	country: string;
	lat: number;
	lon: number;
	url: string;
}
export type IWeatherAutocompleteResponseData = IWeatherAutocompleteEntry[];

/**
 * Get forecast data either from cache or direct request for a specific location
 * @param place Place name
 * @param options Options on caching
 * @returns Weather forecast data promise
 */
export function getWeatherAutocomplete(
	place: string,
	options?: IWeatherOptions
): Promise<IWeatherAutocompleteResponseData> {
	return new Promise((resolve, reject) => {
		const expiryTime = options?.expireTime ?? 10 * 1000 * 60; // 10 minutes expiry
		const data = searchCache[place];

		if (data && Date.now() - data.date < expiryTime) {
			resolve(data.data);
		} else {
			axios
				.get(API_AUTOCOMPLETE_BASE_URI + encodeURIComponent(place))
				.then((res) => {
					searchCache[place] = {
						data: res.data,
						date: Date.now(),
					};
					resolve(res.data);
				})
				.catch(reject);
		}
	});
}

export function useWeatherAutocomplete(): [
	IWeatherAutocompleteResponseData | null,
	React.Dispatch<React.SetStateAction<string>>
] {
	const [place, setPlace] = useState('');
	const [data, setData] = useState<IWeatherAutocompleteResponseData | null>(null);

	useEffect(() => {
		const run = async () => {
			// Avoid issues with too short queries
			if (place.length < 3) return;

			const data = await getWeatherAutocomplete(place);

			setData(data);
		};

		run();
	}, [place]);

	return [data, setPlace];
}
