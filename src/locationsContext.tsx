import React, { Context, Reducer, useContext, useEffect, useReducer } from "react";

export interface ILocation {
    place: string,
    favourite: boolean,
    uuid: string
}

// Grab from local storage
const initialState = JSON.parse(localStorage.getItem("data") as string)?.locations || []

type Action = 
    | { type: "ADD_LOCATION", location: ILocation }
    | { type: "REMOVE_LOCATION", uuid: string }
    | { type: "TOGGLE_FAVOURITE", uuid: string }
    | { type: "CHANGE_LOCATION", uuid: string, place: string }

// Reduce dispatched events
const locationReducer: Reducer<ILocation[], Action> = (state: ILocation[], action: Action) => {
    switch (action.type) {
        case "ADD_LOCATION":
            return state.concat(action.location)
        
        case "REMOVE_LOCATION":
            return state.filter(v => v.uuid !== action.uuid)
        
        case "TOGGLE_FAVOURITE":
            return state.filter(v => (v.uuid === action.uuid && (v.favourite = !v.favourite)) || true)
        
        case "CHANGE_LOCATION":
            return state.filter(v => (v.uuid === action.uuid && (v.place = action.place)) || true)
    }
}


interface ILocationContext {
    locations: ILocation[];
    dispatch: React.Dispatch<Action>;
}
/**
 * Location context
 */
const LocationContext: Context<ILocationContext> = React.createContext({} as ILocationContext);


/**
 * Provider for location context
 */
export const LocationProvider: React.FC = ({ children }) => {
    const [locations, dispatch] = useReducer(locationReducer, initialState);

    useEffect(() => {
        localStorage.setItem("data", JSON.stringify({ locations }));
    }, [locations])

    return (
        <LocationContext.Provider value={{locations, dispatch}}>
            {children}
        </LocationContext.Provider>
    )
}

// Helper functions
/**
 * React hook to add location
 * @returns Hook to add location
 */
export function useAddLocation() {
    const context = useContext(LocationContext);

    return (location: ILocation) => {
        context.dispatch({
            type: "ADD_LOCATION",
            location
        })
    }
}

/**
 * React hook to remove location
 * @returns Hook to remove location
 */
export function useRemoveLocation() {
    const context = useContext(LocationContext);

    return (uuid: string) => {
        context.dispatch({
            type: "REMOVE_LOCATION",
            uuid
        });
    }
}

/**
 * React hook to toggle location favourites
 * @returns Hook to toggle favourite location
 */
export function useToggleFavouriteLocation() {
    const context = useContext(LocationContext);

    return (uuid: string) => {
        context.dispatch({
            type: "TOGGLE_FAVOURITE",
            uuid
        });
    }
}

/**
 * React hook to change location
 * @returns Hook to change location
 */
 export function useChangeLocation() {
    const context = useContext(LocationContext);

    return (uuid: string, place: string) => {
        context.dispatch({
            type: "CHANGE_LOCATION",
            uuid,
            place
        });
    }
}

/**
 * Get favourite locations from context
 * @returns Favourite locations
 */
export function useFavouriteLocations() {
    const context = useContext(LocationContext);

    return context.locations.filter(v => v.favourite);
}

/**
 * Get non favourite locations from context
 * @returns Non favourite locations
 */
export function useNonFavouriteLocations() {
    const context = useContext(LocationContext);

    return context.locations.filter(v => !v.favourite);
}

/**
 * Get location data for UUID
 * @param uuid UUID of place
 * @returns Location data
 */
export function useLocationData(uuid: string): ILocation | undefined {
    const context = useContext(LocationContext);

    return context.locations.filter(v => v.uuid === uuid)[0];
}

// Set default export to context
export default LocationContext;