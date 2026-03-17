
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

interface FileUploadModel {
  file: File;
  preview?: string;
  progress: number;
  estimatedTime?: string;
  error?: string;
  state: 'pending' | 'uploading' | 'done' | 'error';
}

@Component({
  selector: 'lib-upload-documents',
  imports: [],
  templateUrl: './upload-documents.component.html',
  styleUrl: './upload-documents.component.scss'
})
export class UploadDocumentsComponent {
  uploads: FileUploadModel[] = [];

  constructor(private http: HttpClient) { }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      const uploadModel: FileUploadModel = {
        file,
        progress: 0,
        state: 'pending'
      };

      this.uploads.push(uploadModel);

      if (file.type.startsWith('image/')) {
        this.generatePreview(file).subscribe((preview: string) => {
          uploadModel.preview = preview;
        });
      }

      this.uploadFile(uploadModel);
    }

    // Reset input
    input.value = '';
  }

  generatePreview(file: File): Observable<string> {
    return new Observable(observer => {
      const reader = new FileReader();
      reader.onload = () => {
        observer.next(reader.result as string);
        observer.complete();
      };
      reader.onerror = () => observer.error('Error leyendo el archivo');
      reader.readAsDataURL(file);
    });
  }

  uploadFile(upload: FileUploadModel): void {
    const formData = new FormData();
    formData.append('file', upload.file);
    const startTime = Date.now();

    this.http.post('http://localhost:3000/api/upload', formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const percent = Math.round((event.loaded / (event.total || 1)) * 100);
          const elapsed = (Date.now() - startTime) / 1000;
          const speed = event.loaded / elapsed;
          const remaining = event.total ? (event.total - event.loaded) / speed : 0;

          upload.progress = percent;
          upload.estimatedTime = `${remaining.toFixed(1)}s`;
          upload.state = 'uploading';
        } else if (event.type === HttpEventType.Response) {
          upload.progress = 100;
          upload.estimatedTime = '0s';
          upload.state = 'done';
        }
      }),
      catchError(err => {
        upload.error = 'Error al subir archivo';
        upload.state = 'error';
        return of(); // continue the observable
      })
    ).subscribe();
  }
}
