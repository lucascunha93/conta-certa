import {
  Card,
  Group,
  SimpleGrid,
  Text,
  ThemeIcon,
} from '@mantine/core';
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconWallet,
} from '@tabler/icons-react';
import { TransactionSummary } from '../../types/transaction';
import './FinancialSummary.css';

interface FinancialSummaryProps {
  summary: TransactionSummary;
}

const FinancialSummary: React.FC<FinancialSummaryProps> = ({ summary }) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="summary-wrapper">
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        <Card withBorder radius="lg" className="summary-card summary-card-entrada">
          <Group justify="space-between" align="flex-start">
            <div>
              <Text size="sm" c="dimmed">Total de Entradas</Text>
              <Text fw={800} size="xl" className="summary-value-text">{formatCurrency(summary.totalEntradas)}</Text>
            </div>
            <ThemeIcon size={42} radius="xl" variant="light" color="green">
              <IconArrowUpRight size={24} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card withBorder radius="lg" className="summary-card summary-card-saida">
          <Group justify="space-between" align="flex-start">
            <div>
              <Text size="sm" c="dimmed">Total de Saídas</Text>
              <Text fw={800} size="xl" className="summary-value-text">{formatCurrency(summary.totalSaidas)}</Text>
            </div>
            <ThemeIcon size={42} radius="xl" variant="light" color="red">
              <IconArrowDownRight size={24} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card withBorder radius="lg" className={`summary-card ${summary.saldo >= 0 ? 'summary-card-saldo-positive' : 'summary-card-saldo-negative'}`}>
          <Group justify="space-between" align="flex-start">
            <div>
              <Text size="sm" c="dimmed">Saldo</Text>
              <Text fw={800} size="xl" className="summary-value-text">{formatCurrency(summary.saldo)}</Text>
            </div>
            <ThemeIcon
              size={42}
              radius="xl"
              variant="light"
              color={summary.saldo >= 0 ? 'teal' : 'red'}
            >
              <IconWallet size={24} />
            </ThemeIcon>
          </Group>
        </Card>
      </SimpleGrid>
    </div>
  );
};

export default FinancialSummary;