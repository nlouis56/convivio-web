import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { PlaceService } from '../../core/place.service';
import { PlaceDto } from '../../models/place.model';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-place-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <label *ngIf="label" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>

    <select
      [disabled]="isDisabled"
      [ngModel]="value"
      (ngModelChange)="onSelect($event)"
      class="block w-full p-2 border border-gray-300 rounded-md
             focus:ring-green-500 focus:border-green-500
             disabled:bg-gray-100 disabled:cursor-not-allowed"
    >
      <option value="" disabled>Select a place…</option>
      <option *ngFor="let p of places$ | async" [value]="p.id">
        {{ p.name }}
      </option>
    </select>

    <p *ngIf="helper" class="mt-1 text-sm text-gray-500">{{ helper }}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PlaceSelectorComponent),
      multi: true
    }
  ]
})
export class PlaceSelectorComponent implements OnInit, ControlValueAccessor {
  /** Label text shown above the select */
  @Input() label = 'Place';

  /** Helper text shown below the select */
  @Input() helper = '';

  /**
   * If you want one of the places to be selected by default,
   * pass its id here.
   */
  @Input() defaultPlaceId: string | null = null;

  /** Emits the full PlaceDto whenever a place is selected (or default applied) */
  @Output() placeSelected = new EventEmitter<PlaceDto | null>();

  places$!: Observable<PlaceDto[]>;
  value: string | null = null;
  isDisabled = false;

  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private placeService: PlaceService) { }

  ngOnInit(): void {
    // load the list once
    this.places$ = this.placeService.getAll();

    // if a defaultPlaceId was provided, wait until we have the list
    if (this.defaultPlaceId) {
      this.places$
        .pipe(take(1))
        .subscribe(list => {
          const exists = list.some(p => p.id === this.defaultPlaceId);
          if (!exists) {
            // id not in list, ignore
            return;
          }

          // set the internal value and notify Angular forms
          this.writeValue(this.defaultPlaceId);
          this.onChange(this.defaultPlaceId);
          this.onTouched();

          // emit the full dto
          const fullPlace = list.find(p => p.id === this.defaultPlaceId) ?? null;
          this.placeSelected.emit(fullPlace);
        });
    }
  }

  onSelect(placeId: string | null) {
    this.value = placeId;
    this.onChange(placeId);
    this.onTouched();

    // emit the corresponding PlaceDto
    this.places$
      .pipe(take(1))
      .subscribe(list => {
        const fullPlace = list.find(p => p.id === placeId) ?? null;
        this.placeSelected.emit(fullPlace);
      });
  }

  // ControlValueAccessor methods
  writeValue(val: string | null): void {
    this.value = val;
  }
  registerOnChange(fn: (_: string | null) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
