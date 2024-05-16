import {Planet} from "./planet";
import {StartFlightResponse} from "./flight";

export enum ClientMessageType {
    SEND_PLANES = "SEND_PLANES",
    //...
}

export enum ServerMessageType {
    PLANES_START_FLIGHT = "PLANES_START_FLIGHT",
    PLANES_REACH_OWN_PLANET = "PLANES_REACH_OWN_PLANET",
    UNEXPECTED_ERROR = "UNEXPECTED_ERROR",
    //...
}

export type ClientMessage = {
    type: ClientMessageType,
    //TODO: add other needed (possible) values
    value: {
        startPlanet?: Planet,
        destinationPlanet?: Planet,
        percentage?: number
    }
}

export type ServerMessage = {
    type: ServerMessageType,
    //TODO: add other needed (possible) values
    value: {
        startFlightData?: StartFlightResponse,
        destinationPlanet?: Planet,
        message?: string
    }
}
