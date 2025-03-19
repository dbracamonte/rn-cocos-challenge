import { ApiService } from '../../services/apiService';

describe('ApiService', () => {
  it('should fetch instruments data from the API', async () => {
    const data = await ApiService.get('/instruments');
    expect(data).toBeDefined();
  });

  it('should fetch portfolio data from the API', async () => {
    const data = await ApiService.get('/portfolio');
    expect(data).toBeDefined();
  });

  it('should fetch search data from the API', async () => {
    const data = await ApiService.get('/search?query=DYC');
    expect(data).toBeDefined();
  });

  it('should post data to the API', async () => {
    const data = await ApiService.post('/orders', {
      instrument_id: 1,
      side: 'BUY',
      type: 'MARKET',
      quantity: 1234
    });
    expect(data).toBeDefined();
  });
});