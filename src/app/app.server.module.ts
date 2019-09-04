/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';

import { FlexLayoutServerModule } from '@angular/flex-layout/server';

import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';

/**
 * App server module for node platform.
 */
@NgModule({
    imports: [
        AppModule,
        ServerModule,
        ServerTransferStateModule,
        ModuleMapLoaderModule,
        NoopAnimationsModule,
        FlexLayoutServerModule
    ],
    bootstrap: [AppComponent]
})
export class AppServerModule { }
