import { debounce } from '../../utils/debounce';

describe('debounce function', () => {
  jest.useFakeTimers();
  it('should call the function only once', () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 1000);

    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    jest.runAllTimers();

    expect(func).toHaveBeenCalledTimes(1);
  });
});