import axios from 'axios';
window.axios = axios;

window.axios.defaults.baseURL = '/';
window.axios.defaults.withCredentials = true; // send cookies for Sanctum
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

export function setAuthToken(token) {
    if (token) {
        window.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete window.axios.defaults.headers.common['Authorization'];
    }
}
