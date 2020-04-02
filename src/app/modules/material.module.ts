import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule, MAT_EXPANSION_PANEL_DEFAULT_OPTIONS } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatIconModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatDialogModule,
    MatBottomSheetModule
  ],
  exports: [
    MatIconModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatDialogModule,
    MatBottomSheetModule
  ],
  providers: [
    {
      provide: MAT_EXPANSION_PANEL_DEFAULT_OPTIONS,
      useValue: {
        hideToggle: true,
        expandedHeight: 'auto',
        collapsedHeight: 'auto'
      }
    }
  ]
})
export class MaterialModule { }
