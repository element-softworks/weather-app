import { Card, CardContent, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { v4 } from 'uuid';
import AutocompleteList from './AutocompleteList';
import { useWeatherAutocomplete } from './getWeather';
import { useAddLocation } from './locationsContext';
import React from 'react';

const New: React.FC = () => {
	const [autocomplete, search] = useWeatherAutocomplete();
	const addLocation = useAddLocation();
	const navigate = useNavigate();

	return (
		<Card>
			<CardContent>
				<Typography>Find a new location here:</Typography>
				<TextField
					id="standard-basic"
					label="Location"
					variant="standard"
					fullWidth
					// Search from weather autocomplete service
					onChange={(e) => search(e.target.value)}
				/>

				<AutocompleteList
					autocomplete={autocomplete}
					onSelect={(v) => {
						// Add new location
						addLocation({
							uuid: `${v.id}`,
							place: v.name,
							coordinates: [v.lat, v.lon],
							favourite: false,
						});
						// Go back to home
						navigate('/');
					}}
				/>
			</CardContent>
		</Card>
	);
};

export default New;
