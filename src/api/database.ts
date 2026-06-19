import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.87.169.89'
});

export default api;