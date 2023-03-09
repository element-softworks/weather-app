# Weather app

## Prerequisites

### Packages

The project officially uses Yarn, however you can use whichever package manager you like. Install as follows:

#### NPM

```
npm i
```

#### Yarn

```
yarn
```

### Weather API

1. Sign up to the [Weather API](https://www.weatherapi.com/)
2. Verify email address
3. Login
4. Copy API key at top of authenticated home page

### Environment

-   You need a `.env` file containing configuration, as follows:
    ```env
    REACT_APP_WEATHER_API_KEY = {{YOUR_WEATHER_KEY}}
    ```
    where `{{YOUR_WEATHER_KEY}}` is your api key for [WeatherAPI](https://www.weatherapi.com/).
-   Alternatively, just set the environment variable when needed.

## Starting the application locally

### NPM

```
npm run start
```

### Yarn

```
yarn start
```

### Credit

Built by Jacob (jacob@and-element.com)

Minor amendments by Joe (joe@and-element.com)
