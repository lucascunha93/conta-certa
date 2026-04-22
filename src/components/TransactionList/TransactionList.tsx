import { useState, useMemo, useCallback } from 'react';
import {
  IonActionSheet,
  IonModal,
  IonButton,
} from '@ionic/react';
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Paper,
  ScrollArea,
  SegmentedControl,
  Stack,
  Table,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconChevronLeft,
  IconChevronRight,
  IconDownload,
  IconEdit,
  IconFileText,
  IconTrash,
} from '@tabler/icons-react';
import { Transaction } from '../../types/transaction';
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

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const formatCurrency = (value: number): string => currencyFormatter.format(value);

const formatCPF = (cpf: string): string => {
  if (!cpf || cpf.replaceAll(/\D/g, '').length === 0) {
    return 'Não informado';
  }
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const formatDate = (dateString: string): string =>
  new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');

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

  const handlePrevMonth = useCallback(() => {
    if (selectedMonth === 0) {
      onMonthChange(11, selectedYear - 1);
    } else {
      onMonthChange(selectedMonth - 1, selectedYear);
    }
  }, [selectedMonth, selectedYear, onMonthChange]);

  const handleNextMonth = useCallback(() => {
    if (selectedMonth === 11) {
      onMonthChange(0, selectedYear + 1);
    } else {
      onMonthChange(selectedMonth + 1, selectedYear);
    }
  }, [selectedMonth, selectedYear, onMonthChange]);

  const filteredTransactions = useMemo(() =>
    [...transactions]
      .filter(t => typeFilter === 'todos' || t.type === typeFilter)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  , [transactions, typeFilter]);

  const exportRows = useMemo(() => filteredTransactions.map((transaction) => ({
    Cliente: transaction.name,
    Data: formatDate(transaction.date),
    CPF: formatCPF(transaction.cpf),
    Valor: `${transaction.type === 'entrada' ? '+' : '-'} ${formatCurrency(transaction.amount)}`,
    Tipo: transaction.type === 'entrada' ? 'Entrada' : 'Saida',
    Observacoes: transaction.observations || '-',
  })), [filteredTransactions]);

  const fileDateSuffix = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;

  const warmupExportLibraries = useCallback(() => {
    void Promise.all([
      import('xlsx'),
      import('jspdf'),
      import('jspdf-autotable'),
    ]);
  }, []);

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
    <Paper className="transaction-list-card" radius="xl" p="lg" withBorder>
      <Group justify="center" className="month-navigator">
        <ActionIcon variant="subtle" radius="xl" size="lg" onClick={handlePrevMonth}>
          <IconChevronLeft size={18} />
        </ActionIcon>
        <Text className="month-label">{MONTH_NAMES[selectedMonth]} {selectedYear}</Text>
        <ActionIcon variant="subtle" radius="xl" size="lg" onClick={handleNextMonth}>
          <IconChevronRight size={18} />
        </ActionIcon>
      </Group>

      <Group justify="space-between" align="center" className="list-header-row">
        <Group gap="xs">
          <Title order={4}>Movimentações</Title>
          <Badge variant="light" color="blue" className="transaction-count">
            {filteredTransactions.length}
          </Badge>
        </Group>

        <Button
          variant="light"
          color="blue"
          radius="md"
          leftSection={<IconDownload size={16} />}
          onClick={() => {
            warmupExportLibraries();
            setShowExportOptions(true);
          }}
          disabled={filteredTransactions.length === 0 || isExporting}
          className="export-button"
        >
          {isExporting ? 'Exportando...' : 'Exportar'}
        </Button>
      </Group>

      <SegmentedControl
        fullWidth
        radius="md"
        value={typeFilter}
        onChange={(value) => setTypeFilter(value as TypeFilter)}
        data={[
          { label: 'Todos', value: 'todos' },
          { label: 'Entradas', value: 'entrada' },
          { label: 'Saídas', value: 'saida' },
        ]}
      />

      {filteredTransactions.length === 0 ? (
        <Paper className="empty-state" radius="lg" mt="md">
          <Stack align="center" gap="xs">
            <ThemeIcon variant="light" color="gray" radius="xl" size={44}>
              <IconFileText size={22} />
            </ThemeIcon>
            <Text fw={600}>Nenhuma movimentação em {MONTH_NAMES[selectedMonth]} {selectedYear}</Text>
            <Text c="dimmed" size="sm">
              {typeFilter === 'todos'
                ? 'Adicione uma movimentação usando o botão +'
                : `Nenhuma ${typeFilter} neste mês`
              }
            </Text>
          </Stack>
        </Paper>
      ) : (
        <div className="transaction-table-wrapper">
          <ScrollArea>
            <Table
              className="transaction-table"
              highlightOnHover
              withTableBorder
              horizontalSpacing="md"
              verticalSpacing="sm"
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Cliente</Table.Th>
                  <Table.Th>Data</Table.Th>
                  <Table.Th>CPF</Table.Th>
                  <Table.Th>Valor</Table.Th>
                  <Table.Th>Tipo</Table.Th>
                  <Table.Th>Observações</Table.Th>
                  <Table.Th>Ações</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredTransactions.map((transaction) => (
                  <Table.Tr key={transaction.id} className={`transaction-row ${transaction.type}`}>
                    <Table.Td className="td-client">
                      <span className="transaction-name">{transaction.name}</span>
                    </Table.Td>
                    <Table.Td>{formatDate(transaction.date)}</Table.Td>
                    <Table.Td>{formatCPF(transaction.cpf)}</Table.Td>
                    <Table.Td className={`transaction-amount ${transaction.type}`}>
                      {transaction.type === 'entrada' ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color={transaction.type === 'entrada' ? 'green' : 'red'}>
                        {transaction.type === 'entrada' ? 'Entrada' : 'Saída'}
                      </Badge>
                    </Table.Td>
                    <Table.Td className="observation-cell">
                      {transaction.observations ? (
                        <Text size="sm" c="dimmed">{transaction.observations}</Text>
                      ) : (
                        <Text size="sm" c="dimmed">-</Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4}>
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          onClick={() => onEditTransaction?.(transaction)}
                          title="Editar"
                        >
                          <IconEdit size={18} />
                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() => setTransactionToDelete(transaction)}
                          title="Excluir"
                        >
                          <IconTrash size={18} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </div>
      )}

      <IonActionSheet
        isOpen={showExportOptions}
        onDidDismiss={() => setShowExportOptions(false)}
        cssClass="export-actionsheet"
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
    </Paper>
  );
};

export default TransactionList;
