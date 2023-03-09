import { Icon, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { IWeatherAutocompleteEntry } from "./getWeather";

interface IAutocompleteListProps {
    autocomplete: IWeatherAutocompleteEntry[] | undefined | null,
    onSelect: (location: IWeatherAutocompleteEntry) => any
}

export default function AutocompleteList({ autocomplete, onSelect }: IAutocompleteListProps) {
    return (
        <List>
            {
                // Provide list of autocomplete
                autocomplete?.map(v =>
                    <ListItem onClick={() => onSelect(v)} key={v.id}>
                        <ListItemButton>
                            <ListItemIcon>
                                <Icon className="fa-map-marker"></Icon>
                            </ListItemIcon>
                            <ListItemText primary={v.name} secondary={v.region} />
                        </ListItemButton>
                    </ListItem>
                )
            }
        </List>
    )
}