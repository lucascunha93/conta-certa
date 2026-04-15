
import { useState, useMemo, useCallback } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonModal, IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { add } from 'ionicons/icons';
import TransactionForm from '../components/TransactionForm';
import FinancialSummary from '../components/FinancialSummary';
import TransactionList from '../components/TransactionList';
import { useTransactions } from '../hooks/useTransactions';
import { Transaction, TransactionSummary } from '../types/transaction';
import './Home.css';


const Home: React.FC = () => {
  const {
    transactions,
    addTransaction,
    updateTransaction,
    removeTransaction,
  } = useTransactions();

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const handleMonthChange = useCallback((month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  }, []);

  const monthTransactions = useMemo(() =>
    transactions.filter(t => {
      const d = new Date(t.date + 'T00:00:00');
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    })
  , [transactions, selectedMonth, selectedYear]);

  const monthlySummary = useMemo<TransactionSummary>(() => {
    const totalEntradas = monthTransactions
      .filter(t => t.type === 'entrada')
      .reduce((s, t) => s + t.amount, 0);
    const totalSaidas = monthTransactions
      .filter(t => t.type === 'saida')
      .reduce((s, t) => s + t.amount, 0);
    return { totalEntradas, totalSaidas, saldo: totalEntradas - totalSaidas };
  }, [monthTransactions]);

  const handleAddTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    addTransaction(transaction);
    setAddModalOpen(false);
  }, [addTransaction]);

  const handleEditTransaction = useCallback((transaction: Transaction) => {
    setTransactionToEdit(transaction);
    setEditModalOpen(true);
  }, []);

  const handleUpdateTransaction = useCallback((updated: Omit<Transaction, 'id' | 'createdAt'>) => {
    if (transactionToEdit) {
      updateTransaction({ ...transactionToEdit, ...updated });
      setEditModalOpen(false);
      setTransactionToEdit(null);
    }
  }, [transactionToEdit, updateTransaction]);

  const handleCloseModal = useCallback(() => {
    setEditModalOpen(false);
    setTransactionToEdit(null);
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Conta Certa</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Conta Certa</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="home-container">
          <div className="transactions-section">
            <TransactionList
              transactions={monthTransactions}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onMonthChange={handleMonthChange}
              onRemoveTransaction={removeTransaction}
              onEditTransaction={handleEditTransaction}
            />
          </div>
          <FinancialSummary summary={monthlySummary} />
        </div>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setAddModalOpen(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonModal isOpen={addModalOpen} onDidDismiss={() => setAddModalOpen(false)} backdropDismiss={true}>
          <div className="u-modal-content-padding">
            <TransactionForm
              onAddTransaction={handleAddTransaction}
              onCancel={() => setAddModalOpen(false)}
            />
          </div>
        </IonModal>

        <IonModal isOpen={editModalOpen} onDidDismiss={handleCloseModal} backdropDismiss={true}>
          {transactionToEdit && (
            <div className="u-modal-content-padding">
              <TransactionForm
                onAddTransaction={handleUpdateTransaction}
                initialData={transactionToEdit}
                isEditMode
                onCancel={handleCloseModal}
              />
            </div>
          )}
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Home;
