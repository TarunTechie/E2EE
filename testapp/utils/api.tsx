import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // your backend base URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // optional — include cookies if needed
});

export default api