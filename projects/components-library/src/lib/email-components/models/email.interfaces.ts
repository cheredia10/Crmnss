export interface EmailComposerData {
  para: string;
  cc?: string;
  asunto?: string;
  contenido?: string;
  // Propiedades opcionales para integración futura
  onSend?: (emailData: EmailData) => void;
  onCancel?: () => void;
  // i18n: Textos traducidos opcionales
  headerText?: string;
  labelTo?: string;
  placeholderTo?: string;
  labelCc?: string;
  placeholderCc?: string;
  labelSubject?: string;
  placeholderSubject?: string;
  placeholderContent?: string;
  sendButtonText?: string;
}

export interface EmailData {
  para: string;
  cc?: string;
  asunto: string;
  contenido: string;
  attachments: File[];
}