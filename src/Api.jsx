import axios from "axios"

// export const myBaseURL = "http://localhost:8000/"
const isDevelopment = import.meta.env.MODE === "development"
export const myBaseURL = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_DEPLOY

const api = axios.create({
    baseURL: myBaseURL
})

export default api
