import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Phase, PhaseDTO } from '../models/projet.model';

@Component({
  selector: 'app-phase-dialog',
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
  ],
  templateUrl: './phase-dialog.component.html',
  styleUrls: ['./phase-dialog.component.scss'],
})
export class PhaseDialogComponent {
  form: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PhaseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Phase | null,
  ) {
    this.isEdit = !!data;
    this.form = this.fb.group({
      nom:                   [data?.nom || '', [Validators.required, Validators.minLength(2)]],
      ordre:                 [data?.ordre ?? null],
      dateDebut:             [data?.dateDebut ? new Date(data.dateDebut) : null],
      dateFin:               [data?.dateFin ? new Date(data.dateFin) : null],
      pourcentageAvancement: [data?.pourcentageAvancement ?? 0,
                               [Validators.min(0), Validators.max(100)]],
    });
  }

  private toIso(d: Date | null): string | null {
    return d ? new Date(d).toISOString().split('T')[0] : null;
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.value;
    const payload: PhaseDTO = {
      nom: v.nom,
      ordre: v.ordre != null && v.ordre !== '' ? Number(v.ordre) : null,
      dateDebut: this.toIso(v.dateDebut),
      dateFin: this.toIso(v.dateFin),
      pourcentageAvancement: v.pourcentageAvancement != null && v.pourcentageAvancement !== ''
        ? Number(v.pourcentageAvancement) : 0,
    };
    this.dialogRef.close(payload);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
