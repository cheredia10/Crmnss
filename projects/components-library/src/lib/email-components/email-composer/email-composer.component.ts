import { Component, signal, Inject, OnInit, ChangeDetectionStrategy, OnDestroy, inject, ViewChild, ElementRef, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TextInputComponent } from '../text-input/text-input.component';
import { RichTextEditorComponent } from '../rich-text-editor/rich-text-editor.component';
import { FileChipComponent } from '../file-chip/file-chip.component';
import { Attachment, AttachmentService } from '../services/attachment.service';
import { EmailComposerData, EmailData } from '../models/email.interfaces';
import { Header1Component } from '../../headers/header-1/header-1.component';

@Component({
  selector: 'lib-email-composer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    TextInputComponent,
    RichTextEditorComponent,
    ReactiveFormsModule,
    FileChipComponent,
    Header1Component
  ],
  templateUrl: './email-composer.component.html',
  styleUrl: './email-composer.component.scss',
  providers: [AttachmentService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailComposerComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  public readonly attachmentService = inject(AttachmentService);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  emailForm: FormGroup;
  isLoading = signal(false);
  attachments = this.attachmentService.attachments;

  // Inputs para uso como standalone component
  initialData = input<EmailComposerData>();

  // i18n: Textos configurables - signals mutables para permitir actualizaciones desde MAT_DIALOG_DATA
  headerText = signal<string>('Envío de Correo');
  labelTo = signal<string>('Para');
  placeholderTo = signal<string>('Ingrese el destinatario');
  labelCc = signal<string>('C.C');
  placeholderCc = signal<string>('Correos separados por coma');
  labelSubject = signal<string>('Asunto');
  placeholderSubject = signal<string>('Asunto del correo');
  placeholderContent = signal<string>('Escribe tu mensaje aquí...');
  sendButtonText = signal<string>('Enviar');
  defaultSubject = signal<string>('Solicitud de Documentación');

  // Outputs para comunicar con el padre
  emailSent = output<EmailData>();
  cancelled = output<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EmailComposerData | null = null
  ) {
    this.emailForm = this.fb.group({
      para: ['', [Validators.required, Validators.email]],
      cc: [''],
      asunto: ['', [Validators.required]],
      contenido: [''],
    });
  }

  ngOnInit(): void {
    const dataToUse = this.data || this.initialData();
    if (dataToUse) {
      this.emailForm.patchValue({
        para: dataToUse.para,
        cc: dataToUse.cc || '',
        asunto: dataToUse.asunto || this.defaultSubject(),
        contenido: dataToUse.contenido || '',
      });

      // Sobrescribir los textos con los valores traducidos si existen
      if (dataToUse.headerText) this.headerText.set(dataToUse.headerText);
      if (dataToUse.labelTo) this.labelTo.set(dataToUse.labelTo);
      if (dataToUse.placeholderTo) this.placeholderTo.set(dataToUse.placeholderTo);
      if (dataToUse.labelCc) this.labelCc.set(dataToUse.labelCc);
      if (dataToUse.placeholderCc) this.placeholderCc.set(dataToUse.placeholderCc);
      if (dataToUse.labelSubject) this.labelSubject.set(dataToUse.labelSubject);
      if (dataToUse.placeholderSubject) this.placeholderSubject.set(dataToUse.placeholderSubject);
      if (dataToUse.placeholderContent) this.placeholderContent.set(dataToUse.placeholderContent);
      if (dataToUse.sendButtonText) this.sendButtonText.set(dataToUse.sendButtonText);
    }
  }

  ngOnDestroy(): void {
    this.attachmentService.clearAttachments();
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.attachmentService.addFiles(input.files);
    }
    input.value = '';
  }

  removeAttachment(attachment: Attachment): void {
    this.attachmentService.removeAttachment(attachment);
  }

  enviarCorreo(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    const formValues = this.emailForm.value;
    const adjuntos = this.attachmentService.getFiles();

    const emailData: EmailData = {
      para: formValues.para,
      cc: formValues.cc,
      asunto: formValues.asunto,
      contenido: formValues.contenido,
      attachments: adjuntos
    };

    // Emitir el evento para que el componente padre maneje el envío
    this.emailSent.emit(emailData);

    // Si estamos en un dialog y hay callback, lo ejecutamos
    if (this.data?.onSend) {
      this.data.onSend(emailData);
    }
  }

  cancelar(): void {
    this.cancelled.emit();

    if (this.data?.onCancel) {
      this.data.onCancel();
    }
  }
}