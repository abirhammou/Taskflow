import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../models/task.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ],
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss']
})
export class TaskDialogComponent {
  taskForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task | null
  ) {
    this.taskForm = this.fb.group({
      title: [data?.title || '', [Validators.required, Validators.minLength(3)]],
      description: [data?.description || '', Validators.required],
      dueDate: [data?.dueDate ? new Date(data.dueDate) : '', Validators.required],
      completed: [data?.completed || false]
    });
  }

  save(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const payload = {
        title: formValue.title,
        description: formValue.description,
        dueDate: formValue.dueDate.toISOString().split('T')[0],
        completed: formValue.completed
      };
      this.dialogRef.close(payload);
    }
  }
}