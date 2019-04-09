// tslint:disable: no-unnecessary-class

import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { StateTransferInitializerModule } from '@nguniversal/common';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';

@NgModule({
    bootstrap: [AppComponent],
    imports: [
        AppModule,

        // broken for the time-being with ASP.NET
        // StateTransferInitializerModule,

        BrowserAnimationsModule
    ]
})
export class AppBrowserModule { }
