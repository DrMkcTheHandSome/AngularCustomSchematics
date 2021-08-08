import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { <%= classify(name) %>Component } from './<%= dasherize(name) %>.component';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserModule } from '@angular/platform-browser';
import { LayoutModule } from '@angular/cdk/layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {  MatDatepickerModule  } from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
  declarations: [<%= classify(name) %>Component],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    CommonModule,
    FlexLayoutModule,
    MatCardModule,
    MatMenuModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ]
})
export class <%= classify(name) %>Module { }
