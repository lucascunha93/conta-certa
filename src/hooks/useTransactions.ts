import { useState, useEffect, useCallback, useRef } from 'react';
import { Transaction } from '../types/transaction';

const STORAGE_KEY = 'conta-certa-transactions';
const DEBOUNCE_MS = 300;

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loaded, setLoaded] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setTransactions(JSON.parse(saved) as Transaction[]);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
      } catch {
        // Storage quota exceeded or unavailable — silently ignore
      }
    }, DEBOUNCE_MS);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [transactions, loaded]);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTransactions(prev => [...prev, newTransaction]);
  }, []);

  const updateTransaction = useCallback((updated: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updated.id ? { ...t, ...updated } : t));
  }, []);

  const removeTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  return {
    transactions,
    addTransaction,
    updateTransaction,
    removeTransaction,
  };
};