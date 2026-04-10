
import { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonModal } from '@ionic/react';
import TransactionForm from '../components/TransactionForm';
import FinancialSummary from '../components/FinancialSummary';
import TransactionList from '../components/TransactionList';
import { useTransactions } from '../hooks/useTransactions';
import { Transaction } from '../types/transaction';
import './Home.css';


const Home: React.FC = () => {
  const {
    transactions,
    addTransaction,
    updateTransaction,
    removeTransaction,
    filter,
    setFilter,
    summary,
  } = useTransactions();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);

  const handleEditTransaction = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
    setEditModalOpen(true);
  };

  const handleUpdateTransaction = (updated: Omit<Transaction, 'id' | 'createdAt'>) => {
    if (transactionToEdit) {
      updateTransaction({ ...transactionToEdit, ...updated });
      setEditModalOpen(false);
      setTransactionToEdit(null);
    }
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
    setTransactionToEdit(null);
  };

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
          <FinancialSummary summary={summary} />
          <TransactionForm onAddTransaction={addTransaction} />
          <TransactionList
            transactions={transactions}
            filter={filter}
            onFilterChange={setFilter}
            onRemoveTransaction={removeTransaction}
            onEditTransaction={handleEditTransaction}
          />
        </div>

        <IonModal isOpen={editModalOpen} onDidDismiss={handleCloseModal} backdropDismiss={true}>
          {transactionToEdit && (
            <div style={{ padding: 16 }}>
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
