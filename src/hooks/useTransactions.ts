import { useState, useEffect } from 'react';
import { Transaction } from '../types/transaction';

const STORAGE_KEY = 'conta-certa-transactions';


export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Carregar transações do localStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem(STORAGE_KEY);
    console.log('[Conta Certa] Lendo do localStorage:', savedTransactions);
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    setLoaded(true);
  }, []);

  // Salvar no localStorage quando transações mudarem, mas só depois do carregamento inicial
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    console.log('[Conta Certa] Salvando no localStorage:', transactions);
  }, [transactions, loaded]);


  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const updateTransaction = (updated: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updated.id ? { ...t, ...updated } : t));
  };

  const removeTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return {
    transactions,
    addTransaction,
    updateTransaction,
    removeTransaction,
  };
};