import { Fab, Icon } from '@mui/material';
import { useNavigate } from 'react-router';
import LocationCard from './LocationCard';
import { useFavouriteLocations, useNonFavouriteLocations } from './locationsContext';
import React from 'react';

const Home: React.FC = () => {
	const favouriteLocations = useFavouriteLocations();
	const nonFavouriteLocations = useNonFavouriteLocations();
	const navigate = useNavigate();

	console.log({ nonFavouriteLocations });

	return (
		<>
			{[...favouriteLocations, ...nonFavouriteLocations].map((v) => (
				<LocationCard location={v} key={v.uuid} />
			))}

			<Fab
				color="secondary"
				sx={{ position: 'absolute', bottom: 16, right: 16 }}
				onClick={() => {
					navigate('/new');
				}}
			>
				<Icon className="fa-plus"></Icon>
			</Fab>
		</>
	);
};

export default Home;
