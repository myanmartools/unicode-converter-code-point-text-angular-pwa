/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

// tslint:disable: binary-expression-operand-order no-bitwise

import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

import { MatSnackBar } from '@angular/material/snack-bar';

import { Subject, concat, interval } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';

import { CacheService } from '@dagonmetric/ng-cache';
import { LogService } from '@dagonmetric/ng-log';

import { environment } from '../environments/environment';

import { AppConfig } from './shared/app-config';
import { NavLinkItem } from './shared/nav-link-item';
import { UrlHelper } from './shared/url-helper';

/**
 * The core app component.
 */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
    get appTitle(): string {
        return this._appConfig.appName;
    }

    get appTitleFull(): string {
        return `${this.appTitle} | Myanmar Tools`;
    }

    get appVersion(): string {
        return this._appConfig.appVersion;
    }

    get appDescription(): string {
        return this._appConfig.appDescription;
    }

    get appLogoUrl(): string {
        return environment.production ? this._urlHelper.toAbsoluteUrl(this._appLogoUrl) : this._appLogoUrl;
    }

    get navLinks(): NavLinkItem[] {
        if (this._isAppUsedBefore) {
            return this._appConfig.navLinks;
        } else {
            return this._appConfig.navLinks.filter((navLink) => navLink.expanded === true);
        }
    }

    get aboutFeaturesVisible(): boolean {
        return !this._isAppUsedBefore;
    }

    get aboutContentVisible(): boolean {
        return this._curVerAppUsedCount < 3;
    }

    private readonly _appLogoUrl = 'assets/images/appicons/v1/logo.png';
    private readonly _destroyed = new Subject<void>();
    private readonly _isBrowser: boolean;
    private readonly _appConfig: AppConfig;
    private readonly _curVerAppUsedCount: number = 0;
    private readonly _isAppUsedBefore: boolean = false;
    private readonly _checkInterval = 1000 * 60 * 60 * 6;

    constructor(
        // eslint-disable-next-line @typescript-eslint/ban-types
        @Inject(PLATFORM_ID) platformId: Object,
        private readonly _appRef: ApplicationRef,
        private readonly _swUpdate: SwUpdate,
        private readonly _cacheService: CacheService,
        private readonly _logService: LogService,
        private readonly _urlHelper: UrlHelper,
        private readonly _snackBar: MatSnackBar
    ) {
        this._isBrowser = isPlatformBrowser(platformId);

        this._curVerAppUsedCount = this.getCurVerAppUsedCount();
        this._isAppUsedBefore = this.checkAppUsedBefore();
        this.checkUpdate();
    }

    ngOnInit(): void {
        this.increaseAppUsedCount();
    }

    ngOnDestroy(): void {
        this._destroyed.next();
        this._destroyed.complete();
    }
    //
    private checkUpdate(): void {
        if (!this._isBrowser || !this._swUpdate.isEnabled) {
            return;
        }

        const appIsStable = this._appRef.isStable.pipe(first((isStable) => isStable === true));
        concat(appIsStable, interval(this._checkInterval))
            .pipe(takeUntil(this._destroyed))
            .subscribe(() => {
                void this._swUpdate.checkForUpdate();
            });

        this._swUpdate.available.pipe(takeUntil(this._destroyed)).subscribe((evt) => {
            const snackBarRef = this._snackBar.open('Update available.', 'RELOAD');
            snackBarRef.onAction().subscribe(() => {
                this._logService.trackEvent({
                    name: 'reload_update',
                    properties: {
                        app_version: this._appConfig.appVersion,
                        app_platform: 'web',
                        current_hash: evt.current.hash,
                        available_hash: evt.available.hash
                    }
                });

                void this._swUpdate.activateUpdate().then(() => {
                    document.location.reload();
                });
            });
        });
    }

    private getCurVerAppUsedCount(): number {
        if (!this._isBrowser) {
            return 0;
        }

        const appUsedCountStr = this._cacheService.getItem<string>(`appUsed-v${this._appConfig.appVersion}`);
        if (appUsedCountStr) {
            return parseInt(appUsedCountStr, 10);
        }

        return 0;
    }

    private checkAppUsedBefore(): boolean {
        if (!this._isBrowser) {
            return false;
        }

        if (this._curVerAppUsedCount > 0) {
            return true;
        }

        const appUsed = this._cacheService.getItem<string>('appUsed');

        if (appUsed === 'true') {
            return true;
        }

        return false;
    }

    private increaseAppUsedCount(): void {
        if (!this._isBrowser) {
            return;
        }

        this._cacheService.setItem(`appUsed-v${this._appConfig.appVersion}`, `${this._curVerAppUsedCount + 1}`);

        if (!this._isAppUsedBefore) {
            this._cacheService.setItem('appUsed', 'true');
        }
    }
}
