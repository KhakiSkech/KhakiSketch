import { describe, it, expect, vi } from 'vitest';
import { withTimeout, generateSlug } from '@/lib/utils';

describe('withTimeout', () => {
  it('resolves when promise completes before timeout', async () => {
    const result = await withTimeout(Promise.resolve('ok'), 1000);
    expect(result).toBe('ok');
  });

  it('rejects when promise exceeds timeout', async () => {
    const slow = new Promise((resolve) => setTimeout(resolve, 5000));
    await expect(withTimeout(slow, 50)).rejects.toThrow('Timeout');
  });

  it('clears timeout after promise resolves (no leak)', async () => {
    const clearSpy = vi.spyOn(global, 'clearTimeout');
    await withTimeout(Promise.resolve('done'), 1000);
    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });

  it('clears timeout after promise rejects', async () => {
    const clearSpy = vi.spyOn(global, 'clearTimeout');
    await withTimeout(Promise.reject(new Error('fail')), 1000).catch(() => {});
    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });
});

describe('generateSlug', () => {
  it('converts title to lowercase slug', () => {
    expect(generateSlug('Hello World')).toBe('hello-world');
  });

  it('removes special characters', () => {
    expect(generateSlug('Hello! @World#')).toBe('hello-world');
  });

  it('preserves Korean characters', () => {
    const slug = generateSlug('한글 제목 테스트');
    expect(slug).toBe('한글-제목-테스트');
  });

  it('collapses multiple hyphens', () => {
    expect(generateSlug('Hello   World---Test')).toBe('hello-world-test');
  });

  it('respects maxLength parameter', () => {
    const long = 'a'.repeat(100);
    expect(generateSlug(long, 10).length).toBeLessThanOrEqual(10);
  });

  it('uses default maxLength of 80', () => {
    const long = 'a'.repeat(100);
    expect(generateSlug(long).length).toBeLessThanOrEqual(80);
  });
});
