import { ApiService } from "./apiService";

export interface IPortfolio {
	instrument_id: number;
	ticker: string;
	quantity: number;
	last_price: number;
	close_price: number;
	avg_cost_price: number;
}

class PortfolioService {
	async get(): Promise<IPortfolio[]> {
		try {
			return await ApiService.get<IPortfolio[]>("/portfolio");
		} catch (error) {
			console.error("Error fetching portfolios:", error);
			throw error;
		}
	}
}

export const portfolioService = new PortfolioService();
