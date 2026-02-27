'use client';

import React from 'react';
import { QuoteProvider, useQuote } from './QuoteContext';
import QuoteProgress from './QuoteProgress';
import ProjectTypeStep from './steps/ProjectTypeStep';
import ProjectDetailsStep from './steps/ProjectDetailsStep';
import TechStackStep from './steps/TechStackStep';
import ContactInfoStep from './steps/ContactInfoStep';

function QuoteWizardContent() {
    const { currentStep, isComplete } = useQuote();

    // Simple step rendering without complex animation
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <ProjectTypeStep />;
            case 2:
                return <ProjectDetailsStep />;
            case 3:
                return <TechStackStep />;
            case 4:
                return <ContactInfoStep />; // Merged Step (Budget + Contact)
            default:
                return <ProjectTypeStep />;
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg">
            {/* Progress Bar - Hide when complete */}
            {!isComplete && <QuoteProgress />}

            {/* Step Content - Simple fade transition via CSS */}
            <div className="py-8 lg:py-12">
                <div
                    key={currentStep}
                    className="animate-fadeIn"
                >
                    {renderStep()}
                </div>
            </div>
        </div>
    );
}

export default function QuoteWizard() {
    return (
        <QuoteProvider>
            <QuoteWizardContent />
        </QuoteProvider>
    );
}
