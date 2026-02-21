import axios from "axios";
import { handleMockRoutes } from "./mockApi";

export const api = axios.create({
	baseURL: "http://localhost:3000",
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("vulkan_token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

api.defaults.adapter = async (config) => {
	await new Promise((resolve) => setTimeout(resolve, 800));
	return handleMockRoutes(config);
};
