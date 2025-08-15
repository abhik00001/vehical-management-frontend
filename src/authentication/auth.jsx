import api from "../Api"

export const isAuthenticated = () => {
    const token = localStorage.getItem('access')
    const expiryTime = localStorage.getItem('access_expiry')
    // console.log(expiryTime);
    if (token) {
        const currentTime = Date.now()
        if (currentTime > parseInt(expiryTime)) {
            localStorage.removeItem('access')
            localStorage.removeItem('access_expiry')
            localStorage.removeItem('refresh')
            localStorage.removeItem('user')
            return false
        }
        return true
    }
    return false
}


export const RefreshAccessToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refresh')
        const response = await api.post('api/token/refresh/', {
            'refresh': refreshToken
        })
        const access = response.data.access
        localStorage.setItem('access', access)
        return access;

    } catch (error) {
        console.error("Refresh failed", error);
        return null;
    }
}