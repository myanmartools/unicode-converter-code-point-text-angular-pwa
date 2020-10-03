/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { APP_BASE_HREF, CommonModule, DOCUMENT } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

import { CacheModule, MemoryCacheModule } from '@dagonmetric/ng-cache';
import { LogModule } from '@dagonmetric/ng-log';
import { ConsoleLoggerModule } from '@dagonmetric/ng-log/console';

import { ZawgyiDetectorModule } from '@myanmartools/ng-zawgyi-detector';

import { environment } from '../environments/environment';

import { CdkTextareaSyncSizeModule } from '../modules/cdk-extensions';
import { CustomIconRegistry } from '../modules/mat-extensions';
import { LinkService } from '../modules/seo';

import { UrlHelper } from './shared/url-helper';

import { HomeComponent } from './home';

import { AppComponent } from './app.component';
import { appSvgIconProviders } from './app.svg-icons';

export const appId = 'unicode-code-point-lookup-pwa';

export function baseHrefFactory(doc: Document): string | null | undefined {
    // return document.getElementsByTagName('base')[0].href;

    if (doc && doc.head) {
        const baseEle = doc.head.querySelector('base');

        if (baseEle) {
            return baseEle.getAttribute('href');
        }
    }

    return undefined;
}

export const appRoutes: Routes = [
    {
        path: '',
        component: HomeComponent
        // pathMatch: 'full'
    },
    { path: '**', redirectTo: '' }
];

/**
 * App shared module for server, browser and test platforms.
 */
@NgModule({
    declarations: [AppComponent, HomeComponent],
    imports: [
        CommonModule,
        FormsModule,

        RouterModule.forRoot(appRoutes),

        FlexLayoutModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatSnackBarModule,
        MatToolbarModule,

        CdkTextareaSyncSizeModule,

        // ng-log modules
        LogModule.withConfig({
            minLevel: environment.production ? 'warn' : 'trace'
        }),
        ConsoleLoggerModule.withOptions({
            enableDebug: !environment.production
        }),

        // ng-cache modules
        CacheModule,
        MemoryCacheModule,

        // ng-zawgyi-detector module
        ZawgyiDetectorModule,

        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    ],
    providers: [
        {
            provide: APP_BASE_HREF,
            useFactory: baseHrefFactory,
            deps: [DOCUMENT]
        },
        LinkService,
        UrlHelper,
        {
            provide: MatIconRegistry,
            useClass: CustomIconRegistry
        },
        appSvgIconProviders
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
