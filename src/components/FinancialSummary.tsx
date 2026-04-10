import {
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
} from '@ionic/react';
import { arrowUpCircle, arrowDownCircle, wallet } from 'ionicons/icons';
import { TransactionSummary } from '../types/transaction';
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
    <IonCard>
      <IonCardContent>
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="4">
              <div className="summary-item entrada">
                <div className="summary-icon">
                  <IonIcon icon={arrowUpCircle} />
                </div>
                <div className="summary-content">
                  <div className="summary-label">Total de Entradas</div>
                  <div className="summary-value">{formatCurrency(summary.totalEntradas)}</div>
                </div>
              </div>
            </IonCol>

            <IonCol size="12" sizeMd="4">
              <div className="summary-item saida">
                <div className="summary-icon">
                  <IonIcon icon={arrowDownCircle} />
                </div>
                <div className="summary-content">
                  <div className="summary-label">Total de Saídas</div>
                  <div className="summary-value">{formatCurrency(summary.totalSaidas)}</div>
                </div>
              </div>
            </IonCol>

            <IonCol size="12" sizeMd="4">
              <div className={`summary-item saldo ${summary.saldo >= 0 ? 'positive' : 'negative'}`}>
                <div className="summary-icon">
                  <IonIcon icon={wallet} />
                </div>
                <div className="summary-content">
                  <div className="summary-label">Saldo</div>
                  <div className="summary-value">{formatCurrency(summary.saldo)}</div>
                </div>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
};

export default FinancialSummary;