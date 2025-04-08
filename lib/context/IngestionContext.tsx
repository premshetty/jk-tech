'use client';
import { createContext, useContext, useState } from 'react';

type IngestionContextType = {
    progress: number;
    status: string;
    setProgress: (p: number) => void;
    setStatus: (s: string) => void;
};

const IngestionContext = createContext<IngestionContextType | null>(null);

export const IngestionProvider = ({ children }: { children: React.ReactNode }) => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('idle');

    return (
        <IngestionContext.Provider value={{ progress, setProgress, status, setStatus }}>
            {children}
        </IngestionContext.Provider>
    );
};

export const useIngestion = () => {
    const ctx = useContext(IngestionContext);
    if (!ctx) throw new Error('Context not found');
    return ctx;
};
