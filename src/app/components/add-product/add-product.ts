import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.html',
  styleUrls: ['./add-product.css']
})
export class AddProductComponent implements OnInit {
  productForm!: FormGroup;
  submitted = false;
  imageFiles: File[] = [];
  imagePreviews: string[] = [];
  mainImagePreview: string = '';
  availableSizes: number[] = [];
  selectedSize: number | null = null;
  quantities: number[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    // Inizializza le taglie disponibili
    for (let size = 35.5; size <= 46; size += 0.5) {
      this.availableSizes.push(Math.round(size * 10) / 10);
      this.quantities.push(0);
    }

    // Inizializza il modulo
    this.productForm = this.fb.group({
      images: [null, Validators.required],
      modelName: ['', Validators.required],
      modelDescription: [''],
      brandName: ['', Validators.required],
      brandDescription: [''],
      category: ['', Validators.required],
      color: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      publishStatus: [false],
      sizes: this.fb.array([]) // Rimuove il precedente FormArray
    });
  }

  onImageChange(event: any): void {
    if (event.target.files && event.target.files.length) {
      this.imageFiles = Array.from(event.target.files);
      this.imagePreviews = this.imageFiles.map((file) => URL.createObjectURL(file));
      this.mainImagePreview = this.imagePreviews[0]; // Imposta la prima immagine come principale
      this.productForm.patchValue({ images: this.imageFiles }); // Aggiorna il modulo con le immagini
    }
  }

  onThumbnailHover(index: number): void {
    this.mainImagePreview = this.imagePreviews[index]; // Cambia l'immagine principale al passaggio del mouse
  }

  removeMainImage(): void {
    if (this.imageFiles.length > 1) {
      this.imageFiles.splice(0, 1); // Rimuove l'immagine principale
      this.imagePreviews.splice(0, 1); // Rimuove il preview dell'immagine principale
      this.mainImagePreview = this.imagePreviews[0]; // Imposta una nuova immagine principale
    } else {
      this.imageFiles = []; // Rimuove tutte le immagini se c'è solo una
      this.imagePreviews = [];
      this.mainImagePreview = '';
    }
    this.productForm.patchValue({ images: this.imageFiles }); // Aggiorna il modulo
  }

  increaseQuantity(index: number): void {
    this.quantities[index] += 1; // Incrementa la quantità per la taglia selezionata
  }

  decreaseQuantity(index: number): void {
    if (this.quantities[index] > 0) {
      this.quantities[index] -= 1; // Decrementa la quantità per la taglia selezionata
    }
  }

  onSubmit(): void {
    this.submitted = true; // Imposta il flag di submit
    if (this.productForm.invalid) {
      return; // Se il modulo è invalido, non eseguire ulteriori operazioni
    }

    // Logica per l'invio del modulo e delle immagini al server
    const formData = new FormData();
    this.imageFiles.forEach((file) => {
      formData.append('images', file); // Aggiungi ciascuna immagine a formData
    });
    formData.append('modelName', this.productForm.get('modelName')?.value);
    formData.append('modelDescription', this.productForm.get('modelDescription')?.value);
    formData.append('brandName', this.productForm.get('brandName')?.value);
    formData.append('brandDescription', this.productForm.get('brandDescription')?.value);
    formData.append('category', this.productForm.get('category')?.value);
    formData.append('color', this.productForm.get('color')?.value);
    formData.append('price', this.productForm.get('price')?.value);
    formData.append('publishStatus', this.productForm.get('publishStatus')?.value);
    this.quantities.forEach((quantity, index) => {
      formData.append(`quantities[${index}]`, quantity.toString()); // Aggiungi ciascuna quantità a formData
    });

    // Invia i dati al server (implementa il tuo endpoint)
    this.http.post('/api/products', formData).subscribe(response => {
      console.log('Prodotto inserito con successo:', response);
      // Aggiungi logica per il messaggio di successo o reindirizzamento
    }, error => {
      console.error('Errore nell\'inserimento del prodotto:', error);
      // Aggiungi logica per gestire l'errore
    });
  }
}