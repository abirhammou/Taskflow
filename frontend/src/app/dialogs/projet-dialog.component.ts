import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {
  Projet, ProjetDTO, PROJET_STATUTS, PRIORITES, STATUT_META, PRIORITE_META,
  ProjetStatut, Priorite,
} from '../models/projet.model';

@Component({
  selector: 'app-projet-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './projet-dialog.component.html',
  styleUrls: ['./projet-dialog.component.scss'],
})
export class ProjetDialogComponent {
  form: FormGroup;
  isEdit = false;

  statuts = PROJET_STATUTS;
  priorites = PRIORITES;
  statutMeta = STATUT_META;
  prioriteMeta = PRIORITE_META;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProjetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Projet | null,
  ) {
    this.isEdit = !!data;
    this.form = this.fb.group({
      nom:          [data?.nom || '', [Validators.required, Validators.minLength(3)]],
      description:  [data?.description || ''],
      dateDebut:    [data?.dateDebut ? new Date(data.dateDebut) : null, Validators.required],
      dateFinPrevue:[data?.dateFinPrevue ? new Date(data.dateFinPrevue) : null, Validators.required],
      dateFinReelle:[data?.dateFinReelle ? new Date(data.dateFinReelle) : null],
      statut:       [(data?.statut || 'PLANIFIE') as ProjetStatut, Validators.required],
      priorite:     [(data?.priorite || 'MOYENNE') as Priorite, Validators.required],
      budget:       [data?.budget ?? null],
      chefProjetId: [data?.chefProjetId ?? null],
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
    const payload: ProjetDTO = {
      nom: v.nom,
      description: v.description || undefined,
      dateDebut: this.toIso(v.dateDebut)!,
      dateFinPrevue: this.toIso(v.dateFinPrevue)!,
      dateFinReelle: this.toIso(v.dateFinReelle),
      statut: v.statut,
      priorite: v.priorite,
      budget: v.budget != null && v.budget !== '' ? Number(v.budget) : null,
      chefProjetId: v.chefProjetId != null && v.chefProjetId !== '' ? Number(v.chefProjetId) : null,
    };
    this.dialogRef.close(payload);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
