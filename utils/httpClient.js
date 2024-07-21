import axios from 'axios';

const httpClient = axios.create({
  headers: {
	'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use(
  (config) => {
    if (process.env.RIOT_API_KEY) {
        config.headers['X-Riot-Token'] = `${process.env.RIOT_API_KEY}`;
    }
	return config;
  },
  (error) => {
	return Promise.reject(error);
  }
);

httpClient.interceptors.response.use(
  (response) => {
	return response;
  },
  (error) => {
	return Promise.reject(error);
  }
);

export default httpClient;
