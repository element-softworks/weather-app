import { Switch, Typography } from "@mui/material";
import { useContext } from "react";
import TemperatureContext from "./temperatureContext";

export default function ToggleTemp() {
    const context = useContext(TemperatureContext);

    return (
        <Typography>
            °F
            <Switch
                color="secondary"
                checked={context.prefersCelsius}
                onChange={(e) => context.dispatch(!context.prefersCelsius)}
            />
            °C
        </Typography>
    )
}