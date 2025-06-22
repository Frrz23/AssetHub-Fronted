import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:44378/api/', // 🔁 Change to your actual backend URL
  withCredentials: true, // ⚠️ Needed if backend uses cookies/auth
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default api;
