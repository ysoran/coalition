import axios from 'axios';

const apiKey = process.env.REACT_APP_GEO_KEY;

const degreesToRadians = (degrees: number) => {
    var pi = Math.PI;
    return degrees * (pi / 180);
}

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    let x = degreesToRadians(lon1 - lon2) * Math.cos(degreesToRadians((lat1 + lat2) / 2));
    let y = degreesToRadians(lat1 - lat2);
    let dist = Math.sqrt(x * x + y * y);  //* 6371000.0 earth radius to calculate real distance
    return dist;
}

export const findClosestAgency = async (address: any, agencyData: any): Promise<string> => {
    let position: any = {};
    let currentPosition: any;
    let distance: any = {};
    await axios.get("https://geocode.search.hereapi.com/v1/geocode?q=" + address + "&apiKey=" + apiKey).then((result) => {
        if (result.data.items && result.data.items.length > 0) {
            currentPosition = result.data.items[0].position;
        }
    });

    let closestId: any = 1;
    if (currentPosition) {
        for (let i = 0; i < agencyData.data.length; i++) {
            await axios.get("https://geocode.search.hereapi.com/v1/geocode?q=" + agencyData.data[i].agency_address + "&apiKey=" + apiKey).then((result) => {
                if (result.data.items && result.data.items.length > 0) {
                    position[agencyData.data[i].id] = result.data.items[0].position;
                }
            });
        }

        Object.keys(position).forEach((each: string) => {
            if (position[each] && position[each].lat && position[each].lng) {
                distance[each] = calculateDistance(currentPosition.lat, currentPosition.lng, position[each].lat, position[each].lng);
            }
        });

        let closest = Number.MAX_SAFE_INTEGER;
        Object.keys(distance).forEach((each: string) => {
            if (distance[each] < closest) {
                closest = distance[each];
                closestId = each;
            }
        });
    }

    return closestId;
}