import { logger } from '@/lib/logger';
const BASE_URL = 'https://khakisketch-bf356.web.app';

async function checkUrl(path: string, expectedText?: string) {
    const url = `${BASE_URL}${path}`;
    logger.info(`Checking ${url}...`);

    try {
        const res = await fetch(url);
        if (!res.ok) {
            logger.error(`❌ Failed: ${res.status} ${res.statusText}`);
            return false;
        }

        // 리다이렉트 확인
        if (res.redirected) {
            logger.info(`ℹ️ Redirected to: ${res.url}`);
        }

        if (expectedText) {
            const text = await res.text();
            // HTML 엔티티 등 고려하여 간단히 정규화하거나 포함 여부 확인
            if (text.includes(expectedText)) {
                logger.info(`✅ Success: Found "${expectedText}"`);
                return true;
            } else {
                logger.error(`❌ Failed: Expected text "${expectedText}" not found`);
                logger.info('--- Response Preview (First 500 chars) ---');
                logger.info(text.substring(0, 500));
                logger.info('------------------------------------------');
                return false;
            }
        } else {
            logger.info(`✅ Success: Status ${res.status}`);
            return true;
        }
    } catch (err) {
        logger.error(`❌ Error fetching ${url}:`, err);
        return false;
    }
}

async function verify() {
    logger.info('🚀 Starting Deployment Verification...');
    logger.info(`Target: ${BASE_URL}\n`);

    let successCount = 0;
    // 검증할 항목들
    const checks = [
        // 1. 메인 페이지: 타이틀 또는 대표 텍스트
        { path: '/', text: 'KhakiSketch' },

        // 2. 포트폴리오 목록: placeholder 텍스트 확인
        { path: '/portfolio', text: '기술 스택' },

        // 3. 상세 페이지: 프로젝트 타이틀 확인
        { path: '/portfolio/quant-forge-pro', text: 'QuantForge' }
    ];

    for (const check of checks) {
        const passed = await checkUrl(check.path, check.text);
        if (passed) successCount++;
    }

    logger.info(`\n✨ Verification Complete: ${successCount}/${checks.length} checks passed.`);

    if (successCount === checks.length) {
        process.exit(0);
    } else {
        process.exit(1);
    }
}

verify();
