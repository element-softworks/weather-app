import { AppBar, css, CssBaseline, GlobalStyles, Icon, Toolbar, Typography } from '@mui/material';
import { deepOrange, orange } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/system';
import { createBrowserHistory } from 'history';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useMatch } from 'react-router-dom';
import Helmet from 'react-helmet';
import Home from './Home';
import Location from './Location';
import { LocationProvider } from './locationsContext';
import New from './New';
import { TemperatureProvider } from './temperatureContext';
import ToggleTemp from './ToggleUnit';

const theme = createTheme({
	palette: {
		primary: {
			main: orange[100],
		},
		secondary: {
			main: deepOrange[200],
		},
	},
	components: {
		MuiIcon: {
			defaultProps: {
				baseClassName: 'fas',
			},
			styleOverrides: {
				root: {
					// Match 24px = 3 * 2 + 1.125 * 16
					boxSizing: 'content-box',
					padding: 3,
					fontSize: '90%',
					verticalAlign: 'middle',
				},
			},
		},
	},
});

const App: React.FC = () => {
	const history = createBrowserHistory({ window });

	const routes = [
		{
			path: '/location/:uuid',
			component: Location,
			name: 'Location',
			isActive: !!useMatch('/location/:uuid'),
		},
		{
			path: '/new',
			component: New,
			name: 'New Location',
			isActive: !!useMatch('/new'),
		},
		{
			path: '/',
			component: Home,
			name: 'Home',
			isActive: !!useMatch('/'),
		},
	];

	const activeRoute = routes.find(({ isActive }) => isActive);

	return (
		<>
			<Helmet
				title={!!activeRoute?.name ? `Weather App • ${activeRoute.name}` : 'Weather App'}
			/>

			<LocationProvider>
				<TemperatureProvider>
					<ThemeProvider theme={theme}>
						<CssBaseline />
						<GlobalStyles
							styles={css`
								html,
								body,
								#root {
									height: 100%;
								}
							`}
						/>
						<Box>
							<AppBar position="static">
								<Toolbar sx={{ display: 'flex' }}>
									{activeRoute?.path !== '/' && (
										<Icon
											className="fa-arrow-left"
											sx={{ marginRight: '1rem', cursor: 'pointer' }}
											onClick={() => history.back()}
										/>
									)}
									<Typography sx={{ flex: '1 0 auto' }}>
										{activeRoute?.name ?? 'Weather'}
									</Typography>
									<ToggleTemp></ToggleTemp>
								</Toolbar>
							</AppBar>
						</Box>

						<Routes>
							{routes.map(({ path, component: Component }) => (
								<Route key={path} path={path} element={<Component />} />
							))}
						</Routes>
					</ThemeProvider>
				</TemperatureProvider>
			</LocationProvider>
		</>
	);
};

const Root: React.FC = () => (
	<Router>
		<App />
	</Router>
);

export default Root;
