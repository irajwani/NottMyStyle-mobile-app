import {create} from 'apisauce';
import { Config } from '../Config';

const authApiClient = create({
    baseURL: Config.API_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    // timeout: 10 * 1000,
})

let resultRetrieval = (response) => response;

function isUserRegistered(email) {
    return authApiClient.get(`/isUserRegistered?email=${email}`)
    .then(resultRetrieval)
}

export {
    isUserRegistered
}
