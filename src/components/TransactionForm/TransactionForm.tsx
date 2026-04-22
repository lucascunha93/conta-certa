import { useState } from 'react';
import {
  IonToast,
} from '@ionic/react';
import {
  Badge,
  Button,
  Group,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconCalendar, IconId, IconUser } from '@tabler/icons-react';
import { Transaction } from '../../types/transaction';
import './TransactionForm.css';


interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  initialData?: Partial<Transaction>;
  isEditMode?: boolean;
  onCancel?: () => void;
}


const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction, initialData, isEditMode, onCancel }) => {
  const [formData, setFormData] = useState({
    type: (initialData?.type as 'entrada' | 'saida') || 'entrada',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    name: initialData?.name || '',
    cpf: initialData?.cpf || '',
    amount: initialData?.amount !== undefined && initialData?.amount !== null
      ? Number(initialData.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      : '',
    observations: initialData?.observations || '',
  });

  const formatBRL = (value: string) => {
    const clean = value.replaceAll(/\D/g, '');
    const number = (Number.parseInt(clean, 10) / 100).toFixed(2);
    return Number.isNaN(Number(number)) ? '' :
      Number(number).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const parseBRL = (value: string) => {
    const clean = value.replaceAll(/\D/g, '');
    return clean ? (Number.parseInt(clean, 10) / 100) : 0;
  };
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);

  const parseISOToDate = (value: string): Date | null => {
    if (!value) return null;
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const formatDateToISO = (value: Date | null): string => {
    if (!value) return new Date().toISOString().split('T')[0];
    const localDate = new Date(value.getTime() - (value.getTimezoneOffset() * 60000));
    return localDate.toISOString().split('T')[0];
  };

  const formatCPF = (value: string): string => {
    const cleanValue = value.replaceAll(/\D/g, '');
    return cleanValue
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNameError(null);
    setAmountError(null);

    if (!formData.name.trim()) {
      setNameError('Informe o nome do cliente');
      setToastMessage('Nome é obrigatório');
      setShowToast(true);
      return;
    }

    const amountNumber = parseBRL(formData.amount);
    if (!formData.amount || amountNumber <= 0) {
      setAmountError('Digite um valor maior que zero');
      setToastMessage('Valor deve ser maior que zero');
      setShowToast(true);
      return;
    }

    onAddTransaction({
      type: formData.type,
      date: formData.date,
      name: formData.name.trim(),
      cpf: formData.cpf.replaceAll(/\D/g, ''),
      amount: amountNumber,
      observations: formData.observations.trim() || undefined,
    });

    if (!isEditMode) {
      setFormData({
        type: 'entrada',
        date: new Date().toISOString().split('T')[0],
        name: '',
        cpf: '',
        amount: '',
        observations: '',
      });
    }

    const transactionTypeLabel = formData.type === 'entrada' ? 'Entrada' : 'Saída';
    const successMessage = isEditMode
      ? 'Movimentação atualizada com sucesso!'
      : `${transactionTypeLabel} adicionada com sucesso!`;
    setToastMessage(successMessage);
    setShowToast(true);
  };

  const submitAction = formData.type === 'entrada' ? 'Entrada' : 'Saída';
  const submitButtonLabel = isEditMode ? 'Salvar Alterações' : `Adicionar ${submitAction}`;

  return (
    <>
      <Paper className="transaction-form-shell" radius="xl" p="lg" withBorder>
        <Group justify="space-between" align="flex-start" className="form-header">
          <div>
            <Title order={3}>{isEditMode ? 'Editar Movimentação' : 'Nova Movimentação'}</Title>
            <Text c="dimmed" size="sm" mt={4}>
              Preencha os dados com cuidado para manter seu fluxo financeiro preciso.
            </Text>
          </div>
          <Badge variant="light" color={formData.type === 'entrada' ? 'green' : 'red'}>
            {formData.type === 'entrada' ? 'Entrada' : 'Saída'}
          </Badge>
        </Group>

        <form onSubmit={handleSubmit}>
          <Stack gap="md" mt="md">
            <SegmentedControl
              fullWidth
              radius="md"
              value={formData.type}
              onChange={(value) => setFormData({ ...formData, type: value as 'entrada' | 'saida' })}
              data={[
                { label: 'Entrada', value: 'entrada' },
                { label: 'Saída', value: 'saida' },
              ]}
            />

            <div className="transaction-form-grid">
              <DateInput
                value={parseISOToDate(formData.date)}
                onChange={(value) => {
                  const nextDate = typeof value === 'string'
                    ? new Date(value)
                    : (value ?? null);
                  setFormData({ ...formData, date: formatDateToISO(nextDate) });
                }}
                label="Data"
                placeholder="Selecione a data"
                leftSection={<IconCalendar size={16} />}
                valueFormat="DD/MM/YYYY"
                clearable={false}
                required
                radius="md"
              />

              <TextInput
                value={formData.name}
                onChange={(e) => {
                  setNameError(null);
                  setFormData({ ...formData, name: e.currentTarget.value });
                }}
                label="Nome"
                placeholder="Nome completo"
                leftSection={<IconUser size={16} />}
                error={nameError}
                required
                radius="md"
              />

              <TextInput
                value={formatCPF(formData.cpf)}
                onChange={(e) => setFormData({ ...formData, cpf: e.currentTarget.value })}
                label="CPF"
                placeholder="000.000.000-00"
                leftSection={<IconId size={16} />}
                maxLength={14}
                radius="md"
              />

              <TextInput
                value={formData.amount}
                onChange={(e) => {
                  setAmountError(null);
                  setFormData({ ...formData, amount: formatBRL(e.currentTarget.value) });
                }}
                label="Valor (R$)"
                placeholder="R$ 0,00"
                inputMode="decimal"
                error={amountError}
                required
                maxLength={20}
                radius="md"
              />
            </div>

            <Textarea
              value={formData.observations}
              onChange={(e) => setFormData({ ...formData, observations: e.currentTarget.value })}
              label="Observações"
              placeholder="Notas opcionais para contexto"
              minRows={2}
              maxRows={4}
              autosize
              radius="md"
            />

            <Group justify="flex-end" gap="sm" className="form-actions">
              {onCancel && (
                <Button variant="default" onClick={onCancel} radius="md">
                  Cancelar
                </Button>
              )}
              <Button type="submit" color={formData.type === 'entrada' ? 'green' : 'red'} radius="md">
                {submitButtonLabel}
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
        position="top"
      />
    </>
  );
};

export default TransactionForm;