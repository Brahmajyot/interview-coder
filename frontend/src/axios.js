const axiosInstance = axios.create({
  // If frontend and backend are on the same Netlify domain, use relative path:
  baseURL: "/api" 
});