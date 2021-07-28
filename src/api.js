import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: 'https://api.castr.io/',
	timeout: 30 * 1000,
	// withCredentials: true,
	config: {
		headers: {
            'content-type': 'application/json'
		}
	}
});

// Request interceptor:
axiosInstance.interceptors.request.use((request) => {
	return request;
}, (error) => {
	console.log('err', error)
	throw error;
});

export default axiosInstance;
