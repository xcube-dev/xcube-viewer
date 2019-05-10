import { Dataset, } from '../model/dataset';
import { Place, PlaceGroup, } from '../model/place';
import { TimeSeriesGroup } from '../model/timeSeries';
import { ColorBars } from '../model/colorBar';
import { Server } from "../model/server";
import { VIEWER_API_SERVERS } from "../config";
import { getLocalStorage } from "../util/storage";


export interface DataState {
    datasets: Dataset[];
    colorBars: ColorBars | null;
    timeSeriesGroups: TimeSeriesGroup[];
    userPlaces: PlaceGroup;
    userServers: Server[];
}

export function newDataState(): DataState {
    const extraUserServers = loadUserServers();
    const userServers = [...VIEWER_API_SERVERS];
    extraUserServers.forEach(extraUserServer => {
        if (!userServers.find(userServer => userServer.id === extraUserServer.id)) {
            userServers.push(extraUserServer);
        }
    });
    return {
        datasets: [],
        colorBars: null,
        timeSeriesGroups: [],
        userPlaces: {id: 'user', title: 'My places', type: "FeatureCollection", features: [] as Array<Place>},
        userServers,
    };
}

export function storeUserServers(userServers: Server[]) {
    const storage = getLocalStorage();
    if (storage) {
        let userServersJson = JSON.stringify(userServers);
        try {
            storage.setItem("xcube.userServers", userServersJson);
        } catch (e) {
            console.warn(`failed to store user servers: ${e}`);
        }
    }
}

export function loadUserServers(): Server[] {
    const storage = getLocalStorage();
    if (storage) {
        let userServersJson;
        try {
            userServersJson = storage.getItem("xcube.userServers");
        } catch (e) {
            console.warn(`failed to store user servers: ${e}`);
        }
        if (userServersJson) {
            return JSON.parse(userServersJson) as Server[];
        }
    }
    return [];
}



