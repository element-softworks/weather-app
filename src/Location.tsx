import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Button,
	Card,
	CardContent,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Icon,
	IconButton,
	TextField,
	Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import AutocompleteList from './AutocompleteList';
import { useWeatherAutocomplete, useWeatherData } from './getWeather';
import { useChangeLocation, useLocationData } from './locationsContext';
import { useTemperaturePreference } from './temperatureContext';

const Location: React.FC = () => {
	const { uuid } = useParams();
	const location = useLocationData(uuid as string);

	const data = useWeatherData(location);
	const localTime = new Date(data?.location?.localtime as string);
	const temperature = useTemperaturePreference();
	const [editingLocation, setEditingLocation] = useState(false);
	const [autocomplete, search] = useWeatherAutocomplete();
	const changeLocation = useChangeLocation();

	// Build following days accordion
	const accordionDays = data?.forecast?.forecastday?.slice(0, 10).map((v) => (
		<Accordion key={v.date}>
			<AccordionSummary>
				<Typography sx={{ width: '33%' }}>
					{!!v.date_epoch ? new Date(v.date_epoch * 1000).toLocaleDateString() : null}
				</Typography>
				<Typography sx={{ color: 'text.secondary' }}>{v.day.condition.text}</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<Box sx={{ display: 'flex' }}>
					<Box sx={{ width: '33%' }}>
						<img src={v.day.condition.icon} alt="" />
					</Box>
					<Box>
						<Typography fontSize="larger">
							{temperature(v.day.avgtemp_c, v.day.avgtemp_f)}
						</Typography>
						<Typography fontSize="smaller">
							<Icon className="fa-temperature-low"></Icon>
							{temperature(v.day.mintemp_c, v.day.mintemp_f)}
							<Icon className="fa-temperature-high"></Icon>
							{temperature(v.day.maxtemp_c, v.day.maxtemp_f)}
						</Typography>
						<Typography fontSize="smaller">
							<Icon className="fa-tint"></Icon>
							{v.day.avghumidity} humid
						</Typography>
						<Typography fontSize="smaller">
							<Icon className="fa-cloud-rain"></Icon>
							{v.day.daily_chance_of_rain}%<Icon className="fa-snowflake"></Icon>
							{v.day.daily_chance_of_snow}%
						</Typography>
						<Typography fontSize="smaller">
							<Icon className="fa-sun"></Icon>
							{v.day.uv} UV
						</Typography>
					</Box>
				</Box>
			</AccordionDetails>
		</Accordion>
	));

	// Create list of elements to add to DOM
	// Days
	// Get current hour to start accordion
	const currentHour = localTime.getHours();

	// Seperate start hour if less than ten entries available
	let startHour = currentHour;

	if (24 - startHour < 10) {
		startHour = 14;
	}

	const hours = data?.forecast?.forecastday[0]?.hour.slice(startHour, startHour + 10).map((v) => {
		const date = new Date(v.time);

		return (
			<Box
				sx={{
					display: 'flex',
					flex: '1 0 auto',
					flexDirection: 'column',
					alignItems: 'center',
					padding: '1rem',
					// Highlight current hour
					backgroundColor: date.getHours() === currentHour ? 'lightgray' : 'initial',
				}}
				key={v.time}
			>
				<img src={v.condition.icon} alt="" />
				<Typography fontSize="smaller" color="text.secondary">
					{date.toLocaleTimeString()}
				</Typography>
				<Typography>{temperature(v.temp_c, v.temp_f)}</Typography>
				<Typography>{v.wind_dir}</Typography>
			</Box>
		);
	});

	if (!data) {
		return (
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					height: '100%',
					width: '100%',
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<>
			<Card>
				<CardContent>
					<Box sx={{ display: 'flex', marginBottom: '1rem' }}>
						<Box sx={{ flex: '1 0 auto' }}>
							<Typography>
								{data?.location?.name}, local time {localTime.toLocaleTimeString()}
								<IconButton
									className="fas fa-pen"
									size="small"
									onClick={(e) => {
										setEditingLocation(true);
									}}
								/>
							</Typography>
							<Typography fontSize="2rem">
								{temperature(data?.current.temp_c, data?.current.temp_f)}
							</Typography>
							<Typography fontSize="smaller" color="text.secondary">
								Feels like{' '}
								{temperature(data?.current.feelslike_c, data?.current.feelslike_f)}
							</Typography>
							<Typography>
								<Icon className="fa-wind"></Icon> {data?.current?.gust_kph}kph{' '}
								{data?.current?.wind_dir}
							</Typography>
							<Typography>
								<Icon className="fa-tint"></Icon> {data?.current?.humidity} humidity
							</Typography>
							<Typography>
								<Icon className="fa-cloud-rain"></Icon> {data?.current.precip_mm}mm
							</Typography>
						</Box>
						<Box sx={{ display: 'flex', flexDirection: 'column' }}>
							<img src={data?.current?.condition?.icon} alt="" />
						</Box>
					</Box>
					<Box sx={{ display: 'flex', overflow: 'auto', paddingBottom: '1rem' }}>
						{hours}
					</Box>
				</CardContent>
			</Card>
			{accordionDays}
			<Dialog open={editingLocation}>
				<DialogTitle>Edit location</DialogTitle>
				<DialogContent>
					<DialogContentText>
						To edit the location for this entry, type your new location below
					</DialogContentText>
					<TextField
						autoFocus
						fullWidth
						variant="standard"
						onChange={(v) => search(v.target.value)}
					/>
					<AutocompleteList
						autocomplete={autocomplete?.slice(0, 3)}
						onSelect={(v) => {
							// Add new location
							changeLocation(location?.uuid as string, v.name);
							setEditingLocation(false);
						}}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setEditingLocation(false)}>Cancel</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default Location;
