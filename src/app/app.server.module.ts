// tslint:disable: no-unnecessary-class

import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';

import { FlexLayoutServerModule } from '@angular/flex-layout/server';

import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';

@NgModule({
    imports: [
        AppModule,
        ServerModule,
        ServerTransferStateModule,

        // Important* to have lazy-loaded routes work
        ModuleMapLoaderModule,
        NoopAnimationsModule,

        FlexLayoutServerModule
    ],
    // Since the bootstrapped component is not inherited from your
    // imported AppModule, it needs to be repeated here.
    bootstrap: [AppComponent]
})
export class AppServerModule { }
