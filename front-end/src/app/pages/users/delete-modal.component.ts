import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'delete-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-modal.component.html',
})
export class DeleteModalComponent {
  @Input({ required: true }) userName!: string;

  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  // Fecha o modal ao clicar fora do conteúdo
  onBackdropClick(): void {
    this.cancel.emit();
  }

  // Evita que o clique dentro do modal propague o evento para o backdrop
  onDialogClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  onCancelClick(): void {
    this.cancel.emit();
  }

  onConfirmClick(): void {
    this.confirm.emit();
  }
}

