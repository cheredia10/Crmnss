import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  forwardRef,
  input,
  output,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Renderer2,
  HostListener,
  SecurityContext,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

interface FontOption {
  name: string;
  value: string;
}

interface FontSizeOption {
  name: string;
  value: string;
}

@Component({
  selector: 'lib-rich-text-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rich-text-editor.component.html',
  styleUrl: './rich-text-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true,
    },
  ],
})
export class RichTextEditorComponent implements AfterViewInit, OnDestroy, OnChanges, ControlValueAccessor {
  @ViewChild('editor', { static: true }) editor!: ElementRef<HTMLDivElement>;

  placeholder = input<string>('Escribe aquí...');
  disabled = input<boolean>(false);
  minHeight = input<number>(200);
  value = input<string>('');

  // i18n: Tooltips configurables desde la app padre
  fontTooltip = input<string>('Fuente');
  fontSizeTooltip = input<string>('Tamaño de fuente');
  boldTooltip = input<string>('Negrita (Ctrl+B)');
  italicTooltip = input<string>('Cursiva (Ctrl+I)');
  underlineTooltip = input<string>('Subrayado (Ctrl+U)');
  textColorTooltip = input<string>('Color de texto');
  orderedListTooltip = input<string>('Lista numerada');
  unorderedListTooltip = input<string>('Lista con viñetas');
  linkTooltip = input<string>('Insertar enlace');
  attachFileTooltip = input<string>('Adjuntar archivo');
  alignLeftTooltip = input<string>('Alinear izquierda');
  alignCenterTooltip = input<string>('Centrar');
  alignRightTooltip = input<string>('Alinear derecha');
  justifyTooltip = input<string>('Justificar');
  linkPrompt = input<string>('Ingrese la URL del enlace:');

  contentChange = output<string>();
  focus = output<void>();
  blur = output<void>();
  attachFile = output<void>();

  private onChange: (value: string) => void = () => { };
  private onTouched: () => void = () => { };
  private internalValue: string = '';

  isBold = false;
  isItalic = false;
  isUnderline = false;
  currentFont = 'Roboto';
  currentSize = '14px';
  currentColor = '#000000';
  currentAlign = 'left';
  showColorPicker = false;

  readonly fontOptions: FontOption[] = [
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Arial', value: 'Arial, Helvetica, sans-serif' },
    { name: 'Times New Roman', value: 'Times New Roman, Times, serif' },
    { name: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Courier New', value: 'Courier New, Courier, monospace' }
  ];

  readonly fontSizeOptions: FontSizeOption[] = [
    { name: '8', value: '8px' },
    { name: '10', value: '10px' },
    { name: '12', value: '12px' },
    { name: '14', value: '14px' },
    { name: '16', value: '16px' },
    { name: '18', value: '18px' },
    { name: '24', value: '24px' },
    { name: '32', value: '32px' }
  ];

  readonly colorOptions = [
    '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
    '#FF0000', '#FF6600', '#FFCC00', '#00FF00', '#0066FF', '#6600FF'
  ];

  constructor(
    private renderer: Renderer2,
    private sanitizer: DomSanitizer
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      const newValue = changes['value'].currentValue;
      if (newValue !== this.internalValue) {
        this.writeValue(newValue);
      }
    }
    if (changes['minHeight'] && this.editor?.nativeElement) {
      this.renderer.setStyle(this.editor.nativeElement, 'min-height', `${this.minHeight()}px`);
    }
  }

  ngAfterViewInit(): void {
    this.renderer.setStyle(this.editor.nativeElement, 'min-height', `${this.minHeight()}px`);
    document.addEventListener('selectionchange', this.onSelectionChange);
    this.writeValue(this.value() || this.internalValue);
  }

  ngOnDestroy(): void {
    document.removeEventListener('selectionchange', this.onSelectionChange);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.color-picker-wrapper')) {
      this.showColorPicker = false;
    }
  }

  writeValue(value: string | null): void {
    const sanitizedValue = this.sanitizer.sanitize(SecurityContext.HTML, value || '') || '';
    if (this.editor?.nativeElement && sanitizedValue !== this.internalValue) {
      this.internalValue = sanitizedValue;
      this.renderer.setProperty(this.editor.nativeElement, 'innerHTML', this.internalValue);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.editor?.nativeElement) {
      this.renderer.setProperty(this.editor.nativeElement, 'contentEditable', !isDisabled);
    }
  }

  onContentChange(): void {
    const content = this.editor.nativeElement.innerHTML;
    if (content !== this.internalValue) {
      this.internalValue = content;
      this.onChange(content);
      this.contentChange.emit(content);
    }
  }

  onEditorBlur(): void {
    this.onTouched();
    this.blur.emit();
  }

  onEditorFocus(): void {
    this.focus.emit();
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();

    // Try to get HTML first, then fallback to plain text
    let content = event.clipboardData?.getData('text/html') || '';

    if (!content) {
      // Fallback to plain text
      content = event.clipboardData?.getData('text/plain') || '';
      // Convert line breaks to <br> tags and escape HTML
      content = content
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');
    } else {
      // Sanitize HTML content - remove potentially dangerous tags and attributes
      content = this.sanitizeHtml(content);
    }

    if (content) {
      this.insertHtmlAtCursor(content);
      this.onContentChange();
    }
  }

  private sanitizeHtml(html: string): string {
    // Create a temporary element to parse HTML
    const temp = document.createElement('div');
    temp.innerHTML = html;

    // Remove potentially dangerous elements and attributes
    const allowedTags = ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'a', 'span', 'div', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre'];
    const allowedAttributes = ['style', 'href', 'title', 'start', 'type'];

    this.cleanElement(temp, allowedTags, allowedAttributes);

    return temp.innerHTML;
  }

  private cleanElement(element: Element, allowedTags: string[], allowedAttributes: string[]): void {
    const children = Array.from(element.children);

    children.forEach(child => {
      if (!allowedTags.includes(child.tagName.toLowerCase())) {
        // Replace disallowed tag with its content
        const span = document.createElement('span');
        span.innerHTML = child.innerHTML;
        child.parentNode?.replaceChild(span, child);
        this.cleanElement(span, allowedTags, allowedAttributes);
      } else {
        // Clean attributes
        const attributes = Array.from(child.attributes);
        attributes.forEach(attr => {
          if (!allowedAttributes.includes(attr.name.toLowerCase())) {
            child.removeAttribute(attr.name);
          }
        });

        // Recursively clean child elements
        this.cleanElement(child, allowedTags, allowedAttributes);
      }
    });
  }

  private insertHtmlAtCursor(html: string): void {
    if (document.execCommand && document.execCommand('insertHTML', false, html)) {
      return; // Success with execCommand
    }

    // Fallback for browsers that don't support execCommand
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();

    const div = document.createElement('div');
    div.innerHTML = html;

    const fragment = document.createDocumentFragment();
    let child;
    while ((child = div.firstChild)) {
      fragment.appendChild(child);
    }

    range.insertNode(fragment);

    // Move cursor to end of inserted content
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  executeCommand(command: string): void {
    if (this.disabled()) return;

    // Try execCommand first, then fallback
    if (document.execCommand) {
      try {
        document.execCommand(command, false);
      } catch (error) {
        console.warn(`execCommand failed for ${command}, using fallback:`, error);
        this.executeCommandFallback(command);
      }
    } else {
      this.executeCommandFallback(command);
    }

    this.updateFormattingState();
    this.onContentChange();
    this.editor.nativeElement.focus();
  }

  private executeCommandFallback(command: string): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    switch (command) {
      case 'bold':
        this.toggleInlineStyle(range, 'font-weight', 'bold', 'strong');
        break;
      case 'italic':
        this.toggleInlineStyle(range, 'font-style', 'italic', 'em');
        break;
      case 'underline':
        this.toggleInlineStyle(range, 'text-decoration', 'underline', 'u');
        break;
      case 'insertOrderedList':
        this.createList(range, 'ol');
        break;
      case 'insertUnorderedList':
        this.createList(range, 'ul');
        break;
      default:
        console.warn(`No fallback available for command: ${command}`);
    }
  }

  private createList(range: Range, listType: 'ol' | 'ul'): void {
    const list = document.createElement(listType);
    const listItem = document.createElement('li');

    if (range.collapsed) {
      listItem.appendChild(document.createTextNode(''));
    } else {
      listItem.appendChild(range.extractContents());
    }

    list.appendChild(listItem);
    range.insertNode(list);

    // Position cursor inside the list item
    const newRange = document.createRange();
    newRange.selectNodeContents(listItem);
    newRange.collapse(false);

    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(newRange);
  }

  private toggleInlineStyle(range: Range, styleProperty: string, styleValue: string, tagName: string): void {
    if (range.collapsed) {
      // No selection, create element for future typing
      const element = document.createElement(tagName);
      element.appendChild(document.createTextNode('​')); // Zero-width space
      range.insertNode(element);

      const newRange = document.createRange();
      newRange.selectNodeContents(element);
      newRange.collapse(false);

      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(newRange);
    } else {
      // Has selection, wrap it
      const element = document.createElement(tagName);
      element.appendChild(range.extractContents());
      range.insertNode(element);
    }
  }

  applyFontFamily(font: string): void {
    if (this.disabled()) return;
    document.execCommand('fontName', false, font);
    this.onContentChange();
    this.editor.nativeElement.focus();
  }

  applyFontSize(size: string): void {
    if (this.disabled()) return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) {
      const span = this.renderer.createElement('span');
      this.renderer.setStyle(span, 'font-size', size);
      this.renderer.setProperty(span, 'innerHTML', '​');
      range.insertNode(span);

      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      newRange.collapse(false);
      selection.removeAllRanges();
      selection.addRange(newRange);

    } else {
      const span = this.renderer.createElement('span');
      this.renderer.setStyle(span, 'font-size', size);
      span.appendChild(range.extractContents());
      range.insertNode(span);
    }

    this.onContentChange();
    this.editor.nativeElement.focus();
  }

  applyColor(color: string): void {
    if (this.disabled()) return;
    document.execCommand('foreColor', false, color);
    this.currentColor = color;
    this.showColorPicker = false;
    this.onContentChange();
    this.editor.nativeElement.focus();
  }

  insertLink(): void {
    if (this.disabled()) return;
    const url = prompt(this.linkPrompt());
    if (url) {
      const prefixedUrl = /^(https?:\/\/|mailto:)/.test(url) ? url : `https://${url}`;
      document.execCommand('createLink', false, prefixedUrl);
      this.onContentChange();
    }
    this.editor.nativeElement.focus();
  }

  setAlignment(align: string): void {
    if (this.disabled()) return;
    const commandMap: { [key: string]: string } = {
      left: 'justifyLeft',
      center: 'justifyCenter',
      right: 'justifyRight',
      justify: 'justifyFull',
    };
    document.execCommand(commandMap[align], false);
    this.onContentChange();
    this.editor.nativeElement.focus();
  }

  toggleColorPicker(): void {
    if (this.disabled()) return;
    this.showColorPicker = !this.showColorPicker;
  }

  private onSelectionChange = (): void => {
    if (document.activeElement === this.editor.nativeElement) {
      this.updateFormattingState();
    }
  };

  private updateFormattingState(): void {
    try {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      let node = selection.getRangeAt(0).commonAncestorContainer;

      if (node.nodeType === Node.TEXT_NODE) {
        node = node.parentElement!;
      }

      // Reset states
      this.isBold = false;
      this.isItalic = false;
      this.isUnderline = false;

      // Traverse up the DOM to find formatting
      while (node && node !== this.editor.nativeElement && node instanceof Element) {
        const nodeName = node.nodeName.toUpperCase();
        const element = node as HTMLElement;

        // Check for formatting tags
        if (nodeName === 'B' || nodeName === 'STRONG') this.isBold = true;
        if (nodeName === 'I' || nodeName === 'EM') this.isItalic = true;
        if (nodeName === 'U') this.isUnderline = true;

        // Check computed styles
        const style = window.getComputedStyle(element);

        // Font weight check (for bold)
        if (parseInt(style.fontWeight) >= 600) this.isBold = true;

        // Font style check (for italic)
        if (style.fontStyle === 'italic') this.isItalic = true;

        // Text decoration check (for underline)
        if (style.textDecoration.includes('underline')) this.isUnderline = true;

        // Update other properties only if not set
        if (this.currentFont === 'Roboto' && style.fontFamily) {
          this.currentFont = style.fontFamily.replace(/["']/g, '').split(',')[0].trim();
        }

        if (this.currentSize === '14px' && style.fontSize) {
          this.currentSize = style.fontSize;
        }

        if (this.currentColor === '#000000' && style.color) {
          this.currentColor = this.rgbToHex(style.color);
        }

        if (style.textAlign && style.textAlign !== 'start') {
          this.currentAlign = style.textAlign;
        }

        node = node.parentElement!;
      }

      // Fallback alignment detection
      if (!this.currentAlign || this.currentAlign === 'start') {
        this.currentAlign = 'left';
      }

    } catch (error) {
      console.warn('Error updating formatting state:', error);
    }
  }

  private rgbToHex(rgb: string): string {
    if (rgb.startsWith('#')) return rgb;

    const result = rgb.match(/\d+/g);
    if (!result || result.length < 3) return '#000000';

    const r = parseInt(result[0]);
    const g = parseInt(result[1]);
    const b = parseInt(result[2]);

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
  }
}