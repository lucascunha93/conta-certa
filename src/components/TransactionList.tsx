import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonIcon,
  IonChip,
  IonNote,
  IonText,
} from '@ionic/react';
import { trash, create, person, calendar, document } from 'ionicons/icons';

import './TransactionList.css';

interface TransactionListProps {
  transactions: Transaction[];
  filter: TransactionFilter;
  onFilterChange: (filter: TransactionFilter) => void;
  onRemoveTransaction: (id: string) => void;
  onEditTransaction?: (transaction: Transaction) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  filter,
  onFilterChange,
  onRemoveTransaction,
  onEditTransaction,
}) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatCPF = (cpf: string): string => {
    if (!cpf || cpf.replace(/\D/g, '').length === 0) {
      return 'Não informado';
    }
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          Movimentações
          <IonChip color="primary" className="transaction-count">
            {transactions.length}
          </IonChip>
        </IonCardTitle>
        
        <IonSegment 
          value={filter} 
          onIonChange={(e) => onFilterChange(e.detail.value as TransactionFilter)}
        >
          <IonSegmentButton value="todos">
            <IonLabel>Todos</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="entrada">
            <IonLabel>Entradas</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="saida">
            <IonLabel>Saídas</IonLabel>
          </IonSegmentButton>
        </IonSegment>
      </IonCardHeader>

      <IonCardContent>
        {sortedTransactions.length === 0 ? (
          <div className="empty-state">
            <IonIcon icon={document} size="large" />
            <p>Nenhuma movimentação encontrada</p>
            <IonText color="medium">
              <small>
                {filter === 'todos' 
                  ? 'Adicione sua primeira movimentação usando o formulário acima'
                  : `Nenhuma ${filter} cadastrada`
                }
              </small>
            </IonText>
          </div>
        ) : (
          <div className="transaction-table-wrapper">
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Data</th>
                  <th>CPF</th>
                  <th>Valor</th>
                  <th>Tipo</th>
                  <th>Observações</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {sortedTransactions.map((transaction) => (
                  <tr key={transaction.id} className={`transaction-row ${transaction.type}`}>
                    <td className="td-client">
                      <IonIcon icon={person} className="info-icon" />
                      <span className="transaction-name">{transaction.name}</span>
                    </td>
                    <td>{formatDate(transaction.date)}</td>
                    <td>{formatCPF(transaction.cpf)}</td>
                    <td className={`transaction-amount ${transaction.type}`}>{transaction.type === 'entrada' ? '+' : '-'} {formatCurrency(transaction.amount)}</td>
                    <td>
                      <IonChip color={transaction.type === 'entrada' ? 'success' : 'danger'}>
                        {transaction.type === 'entrada' ? 'Entrada' : 'Saída'}
                      </IonChip>
                    </td>
                    <td>
                      {transaction.observations && (
                        <IonNote color="medium">{transaction.observations}</IonNote>
                      )}
                    </td>
                    <td style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <IonIcon
                        icon={create}
                        className="edit-icon"
                        style={{ cursor: 'pointer' }}
                        onClick={() => onEditTransaction && onEditTransaction(transaction)}
                        title="Editar"
                      />
                      <IonIcon 
                        icon={trash} 
                        className="delete-icon"
                        style={{ cursor: 'pointer' }}
                        onClick={() => onRemoveTransaction(transaction.id)}
                        title="Excluir"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default TransactionList;