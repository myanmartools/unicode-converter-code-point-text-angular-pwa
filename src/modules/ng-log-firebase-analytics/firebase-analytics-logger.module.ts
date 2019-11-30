/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';

import { LOGGER_PROVIDER } from '@dagonmetric/ng-log';

import { FIREBASE_ANALYTICS_LOGGER_OPTIONS_TOKEN, FirebaseAnalyticsLoggerOptions } from './firebase-analytics-logger-options';
import { FirebaseAnalyticsLoggerProvider } from './firebase-analytics-logger-provider';

import { firebaseAppFactory } from './firebase-app-factory';

// tslint:disable-next-line: no-import-side-effect
// import 'firebase/analytics';

export function analyticsAppInitializerFactory(options: FirebaseAnalyticsLoggerOptions): () => Promise<void> {
    let res: () => Promise<void | undefined>;

    // tslint:disable-next-line: no-typeof-undefined
    if (options.enabled !== false && options.firebase && options.firebase.measurementId) {
        // tslint:disable-next-line: no-typeof-undefined
        if (typeof window !== 'undefined' && 'indexedDB' in window) {
            firebaseAppFactory(options);
            res = async () => import('firebase/analytics');

            return res;
        }

        const errMsg = "Firebase Analytics could not be initialized because 'indexedDB' is not available.";
        options.logger ? options.logger.error(errMsg) : console.error(errMsg);
        options.enabled = false;
    }

    res = async () => Promise.resolve(undefined);

    return res;
}

/**
 * The `NGMODULE` for providing `LOGGER_PROVIDER` with `FirebaseAnalyticsLoggerProvider`.
 */
@NgModule({
    providers: [
        {
            provide: LOGGER_PROVIDER,
            useClass: FirebaseAnalyticsLoggerProvider,
            multi: true
        }
    ]
})
export class FirebaseAnalyticsLoggerModule {
    static config(options: FirebaseAnalyticsLoggerOptions): ModuleWithProviders {
        return {
            ngModule: FirebaseAnalyticsLoggerModule,
            providers: [
                {
                    provide: FIREBASE_ANALYTICS_LOGGER_OPTIONS_TOKEN,
                    useValue: options
                },
                {
                    provide: APP_INITIALIZER,
                    useFactory: analyticsAppInitializerFactory,
                    deps: [
                        FIREBASE_ANALYTICS_LOGGER_OPTIONS_TOKEN
                    ],
                    multi: true
                }
            ]
        };
    }
}
