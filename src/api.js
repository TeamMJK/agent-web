import axios from 'axios';

const api = axios.create({
  baseURL: "https://www.mjk.o-r.kr",
});

export default api;
