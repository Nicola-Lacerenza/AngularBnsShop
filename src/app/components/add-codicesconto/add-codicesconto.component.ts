import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CodiceScontoService } from '../../services/codice-sconto.service';
import { ServerResponse } from '../../models/ServerResponse.interface';
import { Codice_Sconto } from '../../models/codice_sconto.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../models/categoria.interface';
import { AuthappService } from '../../services/authapp.service';

@Component({
  selector: 'app-add-codicesconto',
  templateUrl: './add-codicesconto.component.html',
  styleUrls: ['./add-codicesconto.component.css']
})
export class AddCodicescontoComponent implements OnInit {
  codiceScontoForm!: FormGroup;
  codiciSconto: Codice_Sconto[] = [];
  private _categorie: Categoria[] = [];
  isEditing: boolean = false;
  editingId: number | null = null;
  duplicateCodeError: string = '';
  filterText: string = '';

  constructor(
    private fb: FormBuilder,
    private codiceScontoService: CodiceScontoService,
    private categoriaService : CategoriaService,
    private auth: AuthappService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getCodiciSconto();
    this.getCategorie();
  }

  initializeForm(): void {
    this.codiceScontoForm = this.fb.group({
      categoria: [null, Validators.required],  // Nuovo campo per la categoria
      codice: ['', Validators.required],
      valore: [0, [Validators.required, Validators.min(0)]],
      descrizione: [''],
      tipo: ['', Validators.required],
      data_inizio: [''],
      data_fine: [''],
      uso_massimo: [null],
      uso_per_utente: [1, [Validators.required, Validators.min(1)]],
      minimo_acquisto: [0, [Validators.required, Validators.min(0)]],
      attivo: [true]
    });
  }
  get categorie(): Categoria[] {
    return this._categorie;
  }

  private getCodiciSconto(): void {
    this.codiceScontoService.getCodiceSconti().subscribe({
      next: (data: Codice_Sconto[]) => {
        this.codiciSconto = data;
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          console.error(error);
        } else {
          console.error(error);
        }
      }
    });
  }

  get filteredCodiciSconto(): Codice_Sconto[] {
    return this.codiciSconto.filter(c =>
      c.codice.toLowerCase().includes(this.filterText.toLowerCase())
    );
  }

  deleteCodice(codice: Codice_Sconto): void {
    this.codiceScontoService.deleteCodiceSconto(codice.id).subscribe({
      next: (response: ServerResponse) => {
        console.log(response.message);
        this.codiciSconto = this.codiciSconto.filter(item => item.id !== codice.id);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Errore nell\'eliminazione del codice sconto', error);
      }
    });
  }


  private getCategorie(): void {
    this.categoriaService.getCategorie().subscribe({
      next: (data: ServerResponse) => {
        this._categorie = <Categoria[]>data.message;
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          this.auth.doLogout();
        } else {
          console.error(error);
        }
      }
    });
  }


  onSubmit(): void {
    if (this.codiceScontoForm.valid) {
      const formValue = this.codiceScontoForm.value;

      // Gestione campi opzionali
      formValue.descrizione = formValue.descrizione || '';
      formValue.data_inizio = formValue.data_inizio || '';
      formValue.data_fine = formValue.data_fine || '';
      formValue.uso_massimo =
        (formValue.uso_massimo || formValue.uso_massimo === 0) ? formValue.uso_massimo : 0;
      formValue.attivo = formValue.attivo ? 1 : 0;

      // Controllo duplicati se non in modalità modifica
      if (!this.isEditing && this.codiciSconto.some(c => c.codice === formValue.codice)) {
        this.duplicateCodeError = "Il codice inserito esiste già. Inserisci un codice diverso.";
        return;
      } else {
        this.duplicateCodeError = "";
      }

      if (this.isEditing && this.editingId !== null) {
        this.codiceScontoService.updateCodiceSconto(this.editingId, formValue).subscribe({
          next: (response: ServerResponse) => {
            console.log(response.message);
            this.getCodiciSconto();
            this.resetForm();
          },
          error: (error: HttpErrorResponse) => {
            console.error('Errore nell\'aggiornamento del codice sconto', error);
          }
        });
      } else {
        this.codiceScontoService.insertCodiceSconto(formValue).subscribe({
          next: (response: ServerResponse) => {
            console.log(response.message);
            this.getCodiciSconto();
            this.codiceScontoForm.reset();
          },
          error: (error: HttpErrorResponse) => {
            console.error('Errore nell\'inserimento del codice sconto', error);
          }
        });
      }
    }
  }

  editCodice(codice: Codice_Sconto): void {
    this.isEditing = true;
    this.editingId = codice.id;
    let giornoInizioString:string;
    let meseInizioString:string;
    let giornoFineString:string;
    let meseFineString:string;
    let giornoInizio:number = codice.data_inizio.getDate();
    giornoInizioString = (giornoInizio < 10) ? "0" + giornoInizio : "" + giornoInizio;
    let meseInizio:number = codice.data_inizio.getMonth() + 1;
    meseInizioString = (meseInizio < 10) ? "0" + meseInizio : "" + meseInizio;
    let giornoFine:number = codice.data_fine.getDate();
    giornoFineString = (giornoFine < 10) ? "0" + giornoFine : "" + giornoFine;
    let meseFine:number = codice.data_fine.getMonth() + 1;
    meseFineString = (meseFine < 10) ? "0" + meseFine : "" + meseFine;
    this.codiceScontoForm.patchValue({
      codice: codice.codice,
      valore: codice.valore,
      descrizione: codice.descrizione,
      tipo: codice.tipo,
      data_inizio: codice.data_inizio.getFullYear() + "-" + meseInizioString + "-" + giornoInizioString,
      data_fine: codice.data_fine.getFullYear() + "-" + meseFineString + "-" + giornoFineString,
      uso_massimo: codice.uso_massimo,
      uso_per_utente: codice.uso_per_utente,
      minimo_acquisto: codice.minimo_acquisto,
      attivo: codice.attivo === 1
    });
    this.duplicateCodeError = "";
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.codiceScontoForm.reset();
    this.isEditing = false;
    this.editingId = null;
    this.duplicateCodeError = "";
    this.codiceScontoForm.patchValue({
      valore: 0,
      uso_massimo: null,
      uso_per_utente: 1,
      minimo_acquisto: 0,
      attivo: true
    });
  }


}
