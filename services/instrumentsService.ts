import { ApiService } from "./apiService";

export interface IInstrument {
	id: number;
	ticker: string;
	name: string;
	type: string;
	last_price: number;
	close_price: number;
	return_percentage?: number;
}

class InstrumentsService {
	async get(): Promise<IInstrument[]> {
		try {
			return await ApiService.get<IInstrument[]>("/instruments");
		} catch (error) {
			console.error("Error fetching instruments:", error);
			throw error;
		}
	}

	async search(query: string): Promise<IInstrument[]> {
		try {
			return await ApiService.get<IInstrument[]>(
				`/search?query=${encodeURIComponent(query)}`
			);
		} catch (error) {
			console.error("Error searching instruments:", error);
			throw error;
		}
	}
}

export const instrumentsService = new InstrumentsService();
