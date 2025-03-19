// src/stores/instrumentsStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
	type IInstrument,
	instrumentsService,
} from "@/services/instrumentsService";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface IInstrumentsState {
	instruments: IInstrument[];
	searchResults: IInstrument[];
	loading: boolean;
	error: string | null;
	clearError: () => void;
	fetchInstruments: () => Promise<void>;
	searchInstruments: (query: string) => Promise<void>;
}

const calculateReturnPercentage = (
	instruments: IInstrument[]
): IInstrument[] => {
	return instruments.map((instrument) => ({
		...instrument,
		return_percentage:
			instrument.close_price > 0
				? ((instrument.last_price - instrument.close_price) /
						instrument.close_price) *
				  100
				: 0,
	}));
};

export const useInstrumentsStore = create<IInstrumentsState>()(
	persist(
		(set) => ({
			instruments: [],
			searchResults: [],
			loading: false,
			error: null,
			clearError: () => set({ error: null }),
			fetchInstruments: async () => {
				try {
					set({ loading: true, error: null });

					const data = await instrumentsService.get();
					const instrumentsWithReturn = calculateReturnPercentage(data);

					set({ instruments: instrumentsWithReturn, loading: false });
				} catch (error) {
					set({
						error:
							error instanceof Error
								? error.message
								: "Error loading instruments",
						loading: false,
					});
				}
			},
			searchInstruments: async (query: string) => {
				try {
					set({ loading: true, error: null });

					if (!query.trim()) {
						set({ searchResults: [], loading: false });
						return;
					}

					const data = await instrumentsService.search(query);
					const instrumentsWithReturn = calculateReturnPercentage(data);

					set({ searchResults: instrumentsWithReturn, loading: false });
				} catch (error) {
					set({
						error:
							error instanceof Error
								? error.message
								: "Error searching instruments",
						loading: false,
					});
				}
			},
		}),
		{
			name: "instruments-storage",
			storage: createJSONStorage(() => AsyncStorage),
		}
	)
);
