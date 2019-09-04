/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';

/**
 * App module for web platform.
 */
@NgModule({
    bootstrap: [AppComponent],
    imports: [
        AppModule,
        BrowserAnimationsModule
    ]
})
export class AppBrowserModule { }
