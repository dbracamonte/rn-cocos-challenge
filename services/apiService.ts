// src/services/apiService.ts
const API_BASE_URL = "https://dummy-api-topaz.vercel.app";

export class ApiService {
	static async get<T>(endpoint: string): Promise<T> {
		return this.request<T>(endpoint, "GET");
	}

	static async post<T>(endpoint: string, data: any): Promise<T> {
		return this.request<T>(endpoint, "POST", data);
	}

	private static async request<T>(
		endpoint: string,
		method: string,
		data?: any
	): Promise<T> {
		const options: RequestInit = {
			method,
			headers: {
				"Content-Type": "application/json",
			},
		};

		if (data) {
			options.body = JSON.stringify(data);
		}

		const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		return await response.json();
	}
}
