// src/stores/portfoliosStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type IPortfolio, portfolioService } from "@/services/portfolioService";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface IPortfoliosState {
	portfolios: IPortfolio[];
	loading: boolean;
	error: string | null;
	clearError: () => void;
	fetchPortfolios: () => Promise<void>;
}

export const usePortfoliosStore = create<IPortfoliosState>()(
	persist(
		(set) => ({
			portfolios: [],
			loading: false,
			error: null,
			clearError: () => set({ error: null }),
			fetchPortfolios: async () => {
				try {
					set({ loading: true, error: null });

					const data = await portfolioService.get();

					set({ portfolios: data, loading: false });
				} catch (error) {
					set({
						error:
							error instanceof Error
								? error.message
								: "Error loading portfolios",
						loading: false,
					});
				}
			},
		}),
		{
			name: "portfolios-storage",
			storage: createJSONStorage(() => AsyncStorage),
		}
	)
);
