 import axios from 'axios';
 
 axios.defaults.baseURL ='/api/';
 axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
 axios.defaults.withCredentials = true;

export const axiosReq = axios.create({
    baseURL: '/api/',
    withCredentials: true,
});
export const axiosRes = axios.create({
    baseURL: '/api/',
    withCredentials: true,
});