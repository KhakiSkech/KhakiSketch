'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ANIMATION } from '@/lib/animation-config';

// Floating animation for visual element
const floatingVariants = {
    animate: {
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: [0.45, 0, 0.55, 1] as const // easeInOut cubic bezier
        }
    }
};

export default function NotFound() {
    return (
        <div className="min-h-[80vh] w-full flex flex-col lg:flex-row items-center justify-center px-6 text-center lg:text-left relative overflow-hidden">

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: ANIMATION.easing }}
                className="flex flex-col items-center lg:items-start gap-8 z-10 max-w-xl"
            >
                <div className="relative">
                    {/* Floating Element */}
                    <motion.div
                        className="text-8xl mb-6"
                        variants={floatingVariants}
                        animate="animate"
                    >
                        🔍
                    </motion.div>

                    <motion.h1
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            type: "spring",
                            damping: 15,
                            stiffness: 100,
                            delay: 0.2
                        }}
                        className="text-8xl lg:text-9xl font-black bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent select-none"
                    >
                        404
                    </motion.h1>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-2xl lg:text-3xl font-bold text-brand-primary tracking-tight mt-4"
                    >
                        Page Not Found
                    </motion.h2>
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg text-brand-muted max-w-md leading-relaxed break-keep"
                >
                    요청하신 페이지를 찾을 수 없습니다.<br />
                    주소가 변경되었거나 삭제되었을 수 있습니다.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <Link
                        href="/"
                        className="px-8 py-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-secondary transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                    >
                        홈으로 돌아가기
                    </Link>
                    <Link
                        href="/quote"
                        className="px-8 py-4 bg-white text-brand-primary border-2 border-brand-primary/20 font-bold rounded-xl hover:bg-brand-bg hover:border-brand-primary/40 transition-all"
                    >
                        견적 문의하기
                    </Link>
                </motion.div>
            </motion.div>

            {/* Background decoration */}
            <div className="fixed inset-0 -z-10 bg-dot-pattern opacity-30 pointer-events-none" />

            {/* Gradient overlay */}
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-brand-bg via-transparent to-brand-secondary/5 pointer-events-none" />
        </div>
    );
}

