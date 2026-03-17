import { Injectable, signal } from '@angular/core';

export interface Attachment {
  file: File;
}

@Injectable({
  providedIn: 'any'
})
export class AttachmentService {
  private readonly attachmentsState = signal<Attachment[]>([]);

  readonly attachments = this.attachmentsState.asReadonly();

  addFiles(files: FileList): void {
    const newAttachments: Attachment[] = Array.from(files).map(file => ({ file }));
    this.attachmentsState.update(current => [...current, ...newAttachments]);
  }

  removeAttachment(attachmentToRemove: Attachment): void {
    this.attachmentsState.update(current =>
      current.filter(att => att !== attachmentToRemove)
    );
  }

  clearAttachments(): void {
    this.attachmentsState.set([]);
  }

  getFiles(): File[] {
    return this.attachmentsState().map(att => att.file);
  }
}