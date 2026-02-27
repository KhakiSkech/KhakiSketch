import React from 'react';

interface PatternProps {
    className?: string;
}

export const Pattern1 = ({ className = '' }: PatternProps) => (
    <div className={`absolute inset-0 w-full h-full bg-brand-bg relative overflow-hidden ${className}`}>
        <svg className="absolute w-full h-full opacity-[0.1]" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="none" stroke="#263122" strokeWidth="0.5" />
            <path d="M0 100 C 20 20 50 20 100 100 Z" fill="none" stroke="#749965" strokeWidth="0.5" />
            <path d="M0 100 C 20 40 50 40 100 100 Z" fill="none" stroke="#263122" strokeWidth="0.5" />
            <path d="M0 100 C 20 60 50 60 100 100 Z" fill="none" stroke="#749965" strokeWidth="0.5" />
        </svg>
        <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, #263122 1px, transparent 1px)', backgroundSize: '20px 20px' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
    </div>
);

export const Pattern2 = ({ className = '' }: PatternProps) => (
    <div className={`absolute inset-0 w-full h-full bg-[#f0f0f0] relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 opacity-[0.07]"
            style={{
                backgroundImage: `linear-gradient(30deg, #263122 12%, transparent 12.5%, transparent 87%, #263122 87.5%, #263122), 
                linear-gradient(150deg, #263122 12%, transparent 12.5%, transparent 87%, #263122 87.5%, #263122), 
                linear-gradient(30deg, #263122 12%, transparent 12.5%, transparent 87%, #263122 87.5%, #263122), 
                linear-gradient(150deg, #263122 12%, transparent 12.5%, transparent 87%, #263122 87.5%, #263122), 
                linear-gradient(60deg, #74996577 25%, transparent 25.5%, transparent 75%, #74996577 75%, #74996577), 
                linear-gradient(60deg, #74996577 25%, transparent 25.5%, transparent 75%, #74996577 75%, #74996577)`,
                backgroundSize: '40px 70px',
                backgroundPosition: '0 0, 0 0, 20px 35px, 20px 35px, 0 0, 20px 35px'
            }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/80 via-transparent to-white/50" />
    </div>
);

export const Pattern3 = ({ className = '' }: PatternProps) => (
    <div className={`absolute inset-0 w-full h-full bg-[#263122] relative overflow-hidden ${className}`}>
        <svg className="absolute w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Data Stream Lines */}
            <line x1="10" y1="0" x2="10" y2="100" stroke="#749965" strokeWidth="0.5" strokeDasharray="5,5" />
            <line x1="30" y1="0" x2="30" y2="100" stroke="#fff" strokeWidth="0.2" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="#749965" strokeWidth="0.5" strokeDasharray="2,2" />
            <line x1="70" y1="0" x2="70" y2="100" stroke="#fff" strokeWidth="0.2" />
            <line x1="90" y1="0" x2="90" y2="100" stroke="#749965" strokeWidth="0.5" strokeDasharray="5,5" />

            {/* Chart Line */}
            <path d="M0 80 Q 20 80 30 60 T 60 40 T 100 20" fill="none" stroke="#749965" strokeWidth="1" />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#263122]/90" />
    </div>
);
