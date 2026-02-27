'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Quote Data Types
export interface QuoteData {
    // Step 1: Project Type
    projectType: string;
    projectTypeOther?: string;

    // Step 2: Project Details
    projectName: string;
    projectSummary: string;
    projectDescription: string;
    projectTags: string[]; // For selected keywords/goals
    projectGoal: string;   // Primary goal
    referenceUrl?: string;
    isGovernmentFunded: boolean; // Government funding check
    targetExchanges?: string[];  // For trading projects: specific exchanges

    // Step 3: Requirements (Platforms, Stage, Features)
    platforms: string[];
    currentStage: string;   // 'idea' | 'planning' | 'design_done' => determines allocation
    designLevel: string;    // 'basic' | 'premium' (Keep for quality preference if needed, or infer)
    features: string[];
    techStack: string[];     // Kept for advanced users (optional)

    // Step 4: Budget & Timeline
    budget: string;
    timeline: string;

    // Step 5: Contact Info
    name: string;
    company?: string;
    email: string;
    phone: string;
    preferredContact: string[]; // Changed to array for multiple selection
}

export const initialQuoteData: QuoteData = {
    projectType: '',
    projectTypeOther: '',
    projectName: '',
    projectSummary: '',
    projectDescription: '',
    projectTags: [],
    projectGoal: '',
    referenceUrl: '',
    isGovernmentFunded: false,
    targetExchanges: [],
    platforms: [],
    currentStage: 'idea', // Default to Idea only
    designLevel: 'basic',
    techStack: [],
    features: [],
    budget: '',
    timeline: '',
    name: '',
    company: '',
    email: '',
    phone: '',
    preferredContact: [], // Initialized as empty array
};

interface QuoteContextType {
    data: QuoteData;
    updateData: (updates: Partial<QuoteData>) => void;
    currentStep: number;
    setCurrentStep: (step: number) => void;
    totalSteps: number;
    nextStep: () => void;
    prevStep: () => void;
    isSubmitting: boolean;
    setIsSubmitting: (value: boolean) => void;
    isComplete: boolean;
    setIsComplete: (value: boolean) => void;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export function QuoteProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<QuoteData>(initialQuoteData);
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const totalSteps = 4;

    const updateData = (updates: Partial<QuoteData>) => {
        setData(prev => ({ ...prev, ...updates }));
    };

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    return (
        <QuoteContext.Provider
            value={{
                data,
                updateData,
                currentStep,
                setCurrentStep,
                totalSteps,
                nextStep,
                prevStep,
                isSubmitting,
                setIsSubmitting,
                isComplete,
                setIsComplete,
            }}
        >
            {children}
        </QuoteContext.Provider>
    );
}

export function useQuote() {
    const context = useContext(QuoteContext);
    if (!context) {
        throw new Error('useQuote must be used within a QuoteProvider');
    }
    return context;
}
