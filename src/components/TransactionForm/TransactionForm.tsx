import { useState } from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonToast,
} from '@ionic/react';
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

  const formatCPF = (value: string): string => {
    const cleanValue = value.replaceAll(/\D/g, '');
    return cleanValue
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setToastMessage('Nome é obrigatório');
      setShowToast(true);
      return;
    }

    const amountNumber = parseBRL(formData.amount);
    if (!formData.amount || amountNumber <= 0) {
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
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>{isEditMode ? 'Editar Movimentação' : 'Nova Movimentação'}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <form onSubmit={handleSubmit}>
            <IonGrid>
              <IonRow>
                <IonCol size="12" sizeMd="6">
                  <IonItem>
                    <IonLabel position="stacked">Tipo</IonLabel>
                    <IonSelect
                      value={formData.type}
                      onIonChange={(e) => setFormData({ ...formData, type: e.detail.value })}
                    >
                      <IonSelectOption value="entrada">Entrada</IonSelectOption>
                      <IonSelectOption value="saida">Saída</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </IonCol>
                <IonCol size="12" sizeMd="6">
                  <IonItem>
                    <IonLabel position="stacked">Data</IonLabel>
                    <IonInput
                      type="date"
                      value={formData.date}
                      onIonInput={(e) => setFormData({ ...formData, date: e.detail.value! })}
                      required
                    />
                  </IonItem>
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol size="12" sizeMd="6">
                  <IonItem>
                    <IonLabel position="stacked">Nome</IonLabel>
                    <IonInput
                      value={formData.name}
                      onIonInput={(e) => setFormData({ ...formData, name: e.detail.value! })}
                      placeholder="Nome completo"
                      required
                    />
                  </IonItem>
                </IonCol>
                <IonCol size="12" sizeMd="6">
                  <IonItem>
                    <IonLabel position="stacked">CPF</IonLabel>
                    <IonInput
                      value={formatCPF(formData.cpf)}
                      onIonInput={(e) => setFormData({ ...formData, cpf: e.detail.value! })}
                      placeholder="000.000.000-00"
                      maxlength={14}
                    />
                  </IonItem>
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol size="12" sizeMd="6">
                  <IonItem>
                    <IonLabel position="stacked">Valor (R$)</IonLabel>
                    <IonInput
                      type="text"
                      inputmode="decimal"
                      value={formData.amount}
                      onIonInput={(e) => {
                        const raw = e.detail.value ?? '';
                        setFormData({ ...formData, amount: formatBRL(raw) });
                      }}
                      placeholder="R$ 0,00"
                      required
                      maxlength={20}
                    />
                  </IonItem>
                </IonCol>
                <IonCol size="12" sizeMd="6">
                  <IonItem>
                    <IonLabel position="stacked">Observações</IonLabel>
                    <IonTextarea
                      value={formData.observations}
                      onIonInput={(e) => setFormData({ ...formData, observations: e.detail.value! })}
                      placeholder="Observações opcionais"
                      rows={1}
                    />
                  </IonItem>
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol>
                  <IonButton 
                    type="submit" 
                    expand="block" 
                    className={`transaction-button ${formData.type}`}
                  >
                    {submitButtonLabel}
                  </IonButton>
                  {onCancel && (
                    <IonButton expand="block" color="medium" onClick={onCancel} className="u-mt-8">
                      Cancelar
                    </IonButton>
                  )}
                </IonCol>
              </IonRow>
            </IonGrid>
          </form>
        </IonCardContent>
      </IonCard>

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