import { render, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';

interface TestComponentProps<T> {
  value: T;
  delay: number;
  onDebounced: (val: T) => void;
}

const TestComponent = ({ value, delay, onDebounced }: TestComponentProps<string>) => {
  const debouncedValue = useDebounce(value, delay);
  onDebounced(debouncedValue);
  return null;
};

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  test('should debounce value', () => {
    const onDebounced = vi.fn();

    const { rerender } = render(<TestComponent value="initial" delay={500} onDebounced={onDebounced} />);

    rerender(<TestComponent value="updated" delay={500} onDebounced={onDebounced} />);
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onDebounced).toHaveBeenLastCalledWith('initial');

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(onDebounced).toHaveBeenLastCalledWith('updated');
  });

  test('should cancel previous timeout on rapid changes', () => {
    const onDebounced = vi.fn();

    const { rerender } = render(<TestComponent value="a" delay={300} onDebounced={onDebounced} />);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender(<TestComponent value="b" delay={300} onDebounced={onDebounced} />);
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender(<TestComponent value="c" delay={300} onDebounced={onDebounced} />);
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onDebounced).toHaveBeenLastCalledWith('c');
  });
});
