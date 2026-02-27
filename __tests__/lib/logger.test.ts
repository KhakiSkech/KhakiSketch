import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('logger', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it('logger.error always logs', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { logger } = await import('@/lib/logger');
    logger.error('test error');
    expect(spy).toHaveBeenCalledWith('test error');
  });

  it('logger.info calls console.log in development', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { logger } = await import('@/lib/logger');
    logger.info('test info');
    expect(spy).toHaveBeenCalledWith('test info');
    vi.unstubAllEnvs();
  });

  it('logger.warn calls console.warn in development', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { logger } = await import('@/lib/logger');
    logger.warn('test warn');
    expect(spy).toHaveBeenCalledWith('test warn');
    vi.unstubAllEnvs();
  });

  it('logger.info does NOT log in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { logger } = await import('@/lib/logger');
    logger.info('should not appear');
    expect(spy).not.toHaveBeenCalled();
    vi.unstubAllEnvs();
  });
});
