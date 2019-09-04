/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatToolbarModule } from '@angular/material/toolbar';

import { ConfigModule } from '@dagonmetric/ng-config';
import { StaticConfigLoaderModule } from '@dagonmetric/ng-config/static-loader';
import { LogModule } from '@dagonmetric/ng-log';
import { GTagLoggerModule } from '@dagonmetric/ng-log-gtag';

import { ZawgyiDetectorModule } from '@myanmartools/ng-zawgyi-detector';

import { environment } from '../environments/environment';

import { CdkTextareaSyncSizeModule } from '../cdk-extensions';
import { CustomIconRegistry } from '../mat-extensions';

import { AppComponent } from './app.component';
import { appSvgIconProviders } from './app.svg-icons';

/**
 * App module for both node and web platforms.
 */
@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'unicode-code-points-lookup-angular-pwa' }),
        CommonModule,
        HttpClientModule,
        FormsModule,

        BrowserTransferStateModule,

        FlexLayoutModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatToolbarModule,

        CdkTextareaSyncSizeModule,

        // ng-zawgyi-detector module
        ZawgyiDetectorModule.withOptions({ detectMixType: false }),

        // ng-log modules
        LogModule,
        GTagLoggerModule.withOptions({
            measurementId: 'UA-138062361-1'
        }),

        // ng-config modules
        ConfigModule.init(),
        StaticConfigLoaderModule.withSettings({
            appVersion: '1.0.0',
            title: 'Unicode Code Points Lookup',
            titleSuffix: ' - Myanmar Tools',
            githubRepoUrl: 'https://github.com/myanmartools/unicode-code-points-lookup-angular-pwa',
            githubImageAlt: 'Unicode Code Points Lookup GitHub Repo',
            baseUrl: 'https://unicode-code-points-lookup.myanmartools.org/',
            appImageUrl: 'assets/images/appicons/v1/logo.png',
            githubImageUrl: 'assets/images/appicons/v1/github.svg',
            githubReleaseUrl: 'https://github.com/myanmartools/unicode-code-points-lookup-angular-pwa/releases',
            socialLinks: [
                {
                    url: 'https://www.facebook.com/DagonMetric',
                    label: 'Follow Myanmar Tools on Facebook',
                    svgIconName: 'facebook'
                },
                {
                    url: 'https://twitter.com/myanmartools',
                    label: 'Follow Myanmar Tools on Twitter',
                    svgIconName: 'twitter'
                },
                {
                    url: 'https://medium.com/myanmartools',
                    label: 'Myanmar Tools Blog on Medium',
                    svgIconName: 'medium'
                }
            ]
        }),

        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    ],
    providers: [
        {
            provide: MatIconRegistry,
            useClass: CustomIconRegistry
        },
        appSvgIconProviders
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
