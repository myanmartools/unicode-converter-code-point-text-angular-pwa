/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppBrowserModule } from './app/app.browser.module';
import { environment } from './environments/environment';

// tslint:disable-next-line: no-any
declare var gtag: any;

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppBrowserModule)
    .catch(err => {
        // tslint:disable-next-line: no-typeof-undefined
        if (environment.production && typeof window !== 'undefined' && gtag) {
            // tslint:disable-next-line: no-unsafe-any
            gtag('event', 'exception', {
                description: `${err}`,
                fatal: true
            });
        } else {
            console.error(err);
        }
    });
