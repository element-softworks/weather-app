import { Card, CardContent, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { v4 } from "uuid";
import AutocompleteList from "./AutocompleteList";
import { useWeatherAutocomplete } from "./getWeather";
import { useAddLocation } from "./locationsContext";

interface INewProps {
    setTitle: (title: string) => any;
}

export default function New({ setTitle }: INewProps) {
    const [autocomplete, search] = useWeatherAutocomplete();
    const addLocation = useAddLocation();
    const navigate = useNavigate();
    
    setTitle("Add location");
    return (
        <Card>
            <CardContent >
                <Typography>
                    Find a new location here:
                </Typography>
                <TextField
                    id="standard-basic"
                    label="Location"
                    variant="standard"
                    fullWidth
                    // Search from weather autocomplete service
                    onChange={(e) => search(e.target.value)}
                />

                <AutocompleteList autocomplete={autocomplete} onSelect={(v) => {
                    // Add new location
                    addLocation({
                        uuid: v4(),
                        place: v.name,
                        favourite: false
                    });
                    // Go back to home
                    navigate("/");
                }}/>
            </CardContent>
        </Card>
    )
}