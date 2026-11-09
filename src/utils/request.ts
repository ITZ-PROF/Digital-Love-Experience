import axios from "axios";
import environment from "../constants/environment";

export const api = axios.create({
    baseURL: `${environment.api.url}`
});
