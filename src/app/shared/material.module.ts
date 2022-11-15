
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    exports : [
        MatToolbarModule,
        MatCardModule,
        MatListModule,
        MatDividerModule,
        MatButtonModule
    ]
})
export class MaterialModule{}