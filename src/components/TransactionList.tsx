import { useState } from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon,
  IonChip,
  IonNote,
  IonText,
  IonButton,
  IonActionSheet,
  IonModal,
} from '@ionic/react';
import { trash, create, person, document, chevronBack, chevronForward, downloadOutline } from 'ionicons/icons';
import { Transaction } from '../types/transaction';
import './TransactionList.css';

type TypeFilter = 'todos' | 'entrada' | 'saida';

interface TransactionListProps {
  transactions: Transaction[];
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number, year: number) => void;
  onRemoveTransaction: (id: string) => void;
  onEditTransaction?: (transaction: Transaction) => void;
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  selectedMonth,
  selectedYear,
  onMonthChange,
  onRemoveTransaction,
  onEditTransaction,
}) => {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('todos');
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatCPF = (cpf: string): string => {
    if (!cpf || cpf.replaceAll(/\D/g, '').length === 0) {
      return 'Não informado';
    }
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      onMonthChange(11, selectedYear - 1);
    } else {
      onMonthChange(selectedMonth - 1, selectedYear);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      onMonthChange(0, selectedYear + 1);
    } else {
      onMonthChange(selectedMonth + 1, selectedYear);
    }
  };

  const filteredTransactions = [...transactions]
    .filter(t => typeFilter === 'todos' || t.type === typeFilter)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const exportRows = filteredTransactions.map((transaction) => ({
    Cliente: transaction.name,
    Data: formatDate(transaction.date),
    CPF: formatCPF(transaction.cpf),
    Valor: `${transaction.type === 'entrada' ? '+' : '-'} ${formatCurrency(transaction.amount)}`,
    Tipo: transaction.type === 'entrada' ? 'Entrada' : 'Saida',
    Observacoes: transaction.observations || '-',
  }));

  const fileDateSuffix = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;

  const handleExportExcel = async () => {
    if (exportRows.length === 0) return;

    setIsExporting(true);
    try {
      const XLSX = await import('xlsx');
      const worksheet = XLSX.utils.json_to_sheet(exportRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Movimentacoes');
      XLSX.writeFile(workbook, `movimentacoes-${fileDateSuffix}.xlsx`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdf = async () => {
    if (exportRows.length === 0) return;

    setIsExporting(true);
    try {
      const [{ jsPDF }, autoTableModule] = await Promise.all([
        import('jspdf'),
        import('jspdf-autotable'),
      ]);
      const autoTable = autoTableModule.default;

      const doc = new jsPDF({ orientation: 'landscape' });
      doc.setFontSize(14);
      doc.text(`Movimentacoes - ${MONTH_NAMES[selectedMonth]} ${selectedYear}`, 14, 16);

      autoTable(doc, {
        startY: 22,
        head: [['Cliente', 'Data', 'CPF', 'Valor', 'Tipo', 'Observacoes']],
        body: exportRows.map((row) => [
          row.Cliente,
          row.Data,
          row.CPF,
          row.Valor,
          row.Tipo,
          row.Observacoes,
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [40, 40, 40] },
      });

      doc.save(`movimentacoes-${fileDateSuffix}.pdf`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <IonCard className="transaction-list-card">
      <IonCardHeader>
        <div className="month-navigator">
          <IonButton fill="clear" size="small" onClick={handlePrevMonth}>
            <IonIcon slot="icon-only" icon={chevronBack} />
          </IonButton>
          <span className="month-label">{MONTH_NAMES[selectedMonth]} {selectedYear}</span>
          <IonButton fill="clear" size="small" onClick={handleNextMonth}>
            <IonIcon slot="icon-only" icon={chevronForward} />
          </IonButton>
        </div>

        <div className="list-header-row">
          <IonCardTitle>
            Movimentações
            <IonChip color="primary" className="transaction-count">
              {filteredTransactions.length}
            </IonChip>
          </IonCardTitle>
          <IonButton
            fill="outline"
            size="small"
            onClick={() => setShowExportOptions(true)}
            disabled={filteredTransactions.length === 0 || isExporting}
            className="export-button"
          >
            <IonIcon slot="start" icon={downloadOutline} />
            {isExporting ? 'Exportando...' : 'Exportar'}
          </IonButton>
        </div>

        <IonSegment
          value={typeFilter}
          onIonChange={(e) => setTypeFilter(e.detail.value as TypeFilter)}
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
        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <IonIcon icon={document} size="large" />
            <p>Nenhuma movimentação em {MONTH_NAMES[selectedMonth]} {selectedYear}</p>
            <IonText color="medium">
              <small>
                {typeFilter === 'todos'
                  ? 'Adicione uma movimentação usando o botão +'
                  : `Nenhuma ${typeFilter} neste mês`
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
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className={`transaction-row ${transaction.type}`}>
                    <td className="td-client">
                      <IonIcon icon={person} className="info-icon" />
                      <span className="transaction-name">{transaction.name}</span>
                    </td>
                    <td>{formatDate(transaction.date)}</td>
                    <td>{formatCPF(transaction.cpf)}</td>
                    <td className={`transaction-amount ${transaction.type}`}>
                      {transaction.type === 'entrada' ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </td>
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
                        onClick={() => onEditTransaction?.(transaction)}
                        title="Editar"
                      />
                      <IonIcon
                        icon={trash}
                        className="delete-icon"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setTransactionToDelete(transaction)}
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

      <IonActionSheet
        isOpen={showExportOptions}
        onDidDismiss={() => setShowExportOptions(false)}
        header="Exportar movimentações"
        buttons={[
          {
            text: 'Exportar PDF',
            handler: handleExportPdf,
          },
          {
            text: 'Exportar Excel (.xlsx)',
            handler: handleExportExcel,
          },
          {
            text: 'Cancelar',
            role: 'cancel',
          },
        ]}
      />

      <IonModal
        isOpen={transactionToDelete !== null}
        onDidDismiss={() => setTransactionToDelete(null)}
        className="confirm-delete-modal"
        backdropDismiss={true}
      >
        <div className="confirm-delete-content">
          <h2>Confirmar exclusão</h2>
          <p>
            Você está prestes a excluir a movimentação de
            {' '}
            <strong>{transactionToDelete?.name}</strong>.
          </p>
          <p className="confirm-delete-warning">
            Essa ação não pode ser desfeita.
          </p>

          <div className="confirm-delete-actions">
            <IonButton
              fill="outline"
              color="medium"
              onClick={() => setTransactionToDelete(null)}
            >
              Cancelar
            </IonButton>
            <IonButton
              color="danger"
              onClick={() => {
                if (transactionToDelete) {
                  onRemoveTransaction(transactionToDelete.id);
                  setTransactionToDelete(null);
                }
              }}
            >
              Excluir
            </IonButton>
          </div>
        </div>
      </IonModal>
    </IonCard>
  );
};

export default TransactionList;
