/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnDestroy, OnInit, Optional, PLATFORM_ID, ViewChild } from '@angular/core';

import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { LogService } from '@dagonmetric/ng-log';

import { DetectedEnc, DetectorResult, ZawgyiDetector } from '@myanmartools/ng-zawgyi-detector';

import { CdkTextareaSyncSize } from '../../modules/cdk-extensions';

import { appSettings } from '../shared/app-settings';

export type CpOutFormatType = 'js' | 'es6' | 'uPlus';

export interface UnicodeFormatterResult extends DetectorResult {
    input: string;
    formattedOutput: string;
    inputIsCodePoints: boolean;
}

/**
 * The core app component.
 */
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnInit, OnDestroy {
    @ViewChild('sourceTextareaSyncSize', { static: false })
    sourceTextareaSyncSize?: CdkTextareaSyncSize;

    @ViewChild('outTextareaSyncSize', { static: false })
    outTextareaSyncSize?: CdkTextareaSyncSize;

    get sourceText(): string {
        return this._sourceText;
    }
    set sourceText(value: string) {
        if (value == null || value.length === 0 || value.trim().length === 0) {
            this._prevSourceFontEnc = null;
            this._prevTargetFontEnc = null;
        }

        this._sourceText = value;
        this.convertNext();
    }

    get sourceFontEnc(): DetectedEnc | undefined {
        return this._sourceFontEnc;
    }
    set sourceFontEnc(value: DetectedEnc | undefined) {
        this._prevSourceFontEnc = value;
        this._prevTargetFontEnc = null;

        this._sourceFontEnc = value;
    }

    get targetFontEnc(): DetectedEnc | undefined {
        return this._targetFontEnc;
    }
    set targetFontEnc(value: DetectedEnc | undefined) {
        this._prevTargetFontEnc = value;
        this._prevSourceFontEnc = null;

        this._targetFontEnc = value;
    }

    get sourceFontCustom(): string | null {
        return this._sourceFontCustom;
    }
    set sourceFontCustom(value: string | null) {
        this._prevSourceFontEnc = null;
        this._prevTargetFontEnc = null;

        this._sourceFontCustom = value;
    }

    get targetFontCustom(): string | null {
        return this._targetFontCustom;
    }
    set targetFontCustom(value: string | null) {
        this._prevSourceFontEnc = null;
        this._prevTargetFontEnc = null;

        this._targetFontCustom = value;
    }

    get cpOutFormat(): CpOutFormatType {
        return this._cpOutFormat;
    }
    set cpOutFormat(value: CpOutFormatType) {
        this._cpOutFormat = value;
        this.convertNext();
    }

    get cpOutFormatEscapse(): boolean {
        return this._cpOutFormatEscapse;
    }
    set cpOutFormatEscapse(value: boolean) {
        this._cpOutFormatEscapse = value;
        this.convertNext();
    }

    get cpOutConvertNewLineTabToCP(): boolean {
        return this._cpOutConvertNewLineTabToCP;
    }
    set cpOutConvertNewLineTabToCP(value: boolean) {
        this._cpOutConvertNewLineTabToCP = value;
        this.convertNext();
    }

    get cpOutPreserveASCII(): boolean {
        return this._cpOutPreserveASCII;
    }
    set cpOutPreserveASCII(value: boolean) {
        this._cpOutPreserveASCII = value;
        this.convertNext();
    }

    get cpInConvertEscapsesToChars(): boolean {
        return this._cpInConvertEscapsesToChars;
    }
    set cpInConvertEscapsesToChars(value: boolean) {
        this._cpInConvertEscapsesToChars = value;
        this.convertNext();
    }

    get outText(): string {
        return this._outText;
    }

    get cpOutOptionsVisible(): boolean {
        return this._cpOutOptionsVisible;
    }

    private readonly _convertSubject = new Subject<string>();
    private readonly _destroyed = new Subject<void>();
    private readonly _isBrowser: boolean;

    private _sourceText = '';
    private _outText = '';
    private _sourceFontEnc?: DetectedEnc;
    private _targetFontEnc?: DetectedEnc;
    private _sourceFontCustom: string | null = null;
    private _targetFontCustom: string | null = null;

    private _prevIsCP: boolean | null = null;
    private _prevSourceFontEnc?: DetectedEnc;
    private _prevTargetFontEnc?: DetectedEnc;

    private _cpOutOptionsVisible = false;
    private _cpOutFormat: CpOutFormatType = 'js';
    private _cpOutFormatEscapse = true;
    private _cpOutConvertNewLineTabToCP = false;
    private _cpOutPreserveASCII = true;
    private _cpInConvertEscapsesToChars = true;

    constructor(
        // eslint-disable-next-line @typescript-eslint/ban-types
        @Inject(PLATFORM_ID) platformId: Object,
        private readonly _logService: LogService,
        private readonly _zawgyiDetector: ZawgyiDetector,
        @Optional() @Inject(DOCUMENT) private readonly _document?: Document
    ) {
        this._isBrowser = isPlatformBrowser(platformId);
    }

    ngOnInit(): void {
        this._convertSubject
            .pipe(
                takeUntil(this._destroyed),
                map(() => {
                    return this.convert(this.sourceText);
                })
            )
            .subscribe((result) => {
                if (result.inputIsCodePoints) {
                    this._cpOutOptionsVisible = false;
                    this._sourceFontEnc = null;

                    if (result.detectedEnc === 'zg') {
                        this._targetFontEnc = 'zg';
                    } else if (result.detectedEnc === 'uni') {
                        this._targetFontEnc = 'uni';
                    } else if (result.detectedEnc === 'mix') {
                        this._targetFontEnc = 'mix';
                    } else {
                        this._targetFontEnc = null;
                    }
                } else {
                    if (result.formattedOutput && result.formattedOutput.length > 0) {
                        this._cpOutOptionsVisible = true;
                    }

                    this._targetFontEnc = null;

                    if (result.detectedEnc === 'zg') {
                        this._sourceFontEnc = 'zg';
                    } else if (result.detectedEnc === 'uni') {
                        this._sourceFontEnc = 'uni';
                    } else if (result.detectedEnc === 'mix') {
                        this._sourceFontEnc = 'mix';
                    } else {
                        this._sourceFontEnc = null;
                    }
                }

                this._outText = result.formattedOutput;

                const eventName = result.inputIsCodePoints ? 'cp2text' : 'text2cp';

                if (this._isBrowser && this._document) {
                    (this._document as HTMLDocument).body.classList.toggle('editing', this._sourceText.length > 0);
                }

                if (this._isBrowser && this._sourceText.length) {
                    this._logService.trackEvent({
                        name: `convert_${eventName}`,
                        properties: {
                            input_length: this._sourceText.length,
                            duration_msec: result.duration,
                            app_version: appSettings.appVersion,
                            app_platform: 'web'
                        }
                    });
                }
            });
    }

    ngAfterViewInit(): void {
        if (this.sourceTextareaSyncSize) {
            this.sourceTextareaSyncSize.secondCdkTextareaSyncSize = this.outTextareaSyncSize;
        }
        if (this.outTextareaSyncSize) {
            this.outTextareaSyncSize.secondCdkTextareaSyncSize = this.sourceTextareaSyncSize;
        }
    }

    ngOnDestroy(): void {
        this._destroyed.next();
        this._destroyed.complete();
    }

    private convertNext(): void {
        const formattedInput = `
        ${this.sourceFontEnc},
        ${this.targetFontEnc},
        ${this.cpOutFormat},
        ${this.cpOutFormatEscapse},
        ${this.cpOutConvertNewLineTabToCP},
        ${this.cpInConvertEscapsesToChars},
        ${this.cpOutPreserveASCII}|${this._sourceText}`;

        this._convertSubject.next(formattedInput);
    }

    private convert(input: string): UnicodeFormatterResult {
        const result: UnicodeFormatterResult = {
            detectedEnc: null,
            input,
            inputIsCodePoints: false,
            formattedOutput: '',
            duration: 0,
            matches: []
        };

        if (this.inputContainsCodePoints(input)) {
            const formattedOutput = this.convertToChars(input);
            result.formattedOutput = formattedOutput;
            result.inputIsCodePoints = true;

            if (this._targetFontEnc === 'mix') {
                this._prevSourceFontEnc = null;
                this._prevTargetFontEnc = null;

                return {
                    ...result,
                    detectedEnc: 'mix'
                };
            }

            this._prevSourceFontEnc = null;

            if (this._prevIsCP != null && !this._prevIsCP && this._prevTargetFontEnc) {
                this._prevTargetFontEnc = null;
            }
            this._prevIsCP = true;

            if (this._prevTargetFontEnc) {
                return {
                    ...result,
                    detectedEnc: this._prevTargetFontEnc
                };
            }

            const zgDetectorResult = this._zawgyiDetector.detect(formattedOutput);

            return {
                ...result,
                ...zgDetectorResult
            };
        } else {
            const formattedOutput = this.convertToCodePoints(input);
            result.formattedOutput = formattedOutput;

            if (this._sourceFontEnc === 'mix') {
                this._prevSourceFontEnc = null;
                this._prevTargetFontEnc = null;

                return {
                    ...result,
                    detectedEnc: 'mix'
                };
            }

            this._prevTargetFontEnc = null;

            if (this._prevIsCP != null && this._prevIsCP && this._prevSourceFontEnc) {
                this._prevSourceFontEnc = null;
            }
            this._prevIsCP = false;

            if (this._prevSourceFontEnc) {
                return {
                    ...result,
                    detectedEnc: this._prevSourceFontEnc
                };
            }

            const zgDetectorResult = this._zawgyiDetector.detect(input);

            return {
                ...result,
                ...zgDetectorResult
            };
        }
    }

    private inputContainsCodePoints(input: string): boolean {
        if (
            /[Uu]\+10([A-Fa-f0-9]{4})/g.test(input) ||
            /[Uu]\+([A-Fa-f0-9]{1,5})/g.test(input) ||
            /0x([A-Fa-f0-9]{1,6})/g.test(input) ||
            /\\[u]\{([A-Fa-f0-9 ]{1,})\}/g.test(input) ||
            /\\[x]\{([A-Fa-f0-9]{1,})\}/g.test(input) ||
            /\\x([A-Fa-f0-9]{2})/g.test(input) ||
            /\\U([A-Fa-f0-9]{6,8})/g.test(input) ||
            /\\u([A-Fa-f0-9]{4})/g.test(input)
        ) {
            return true;
        }

        return false;
    }

    private convertToCodePoints(input: string): string {
        if (this.cpOutFormat === 'uPlus') {
            return this.convertToUPlusCodePoints(input);
        } else {
            return this.convertToJSES6CodePoints(input);
        }
    }

    private convertToUPlusCodePoints(input: string): string {
        const cpArray: string[] = [];

        for (const c of input) {
            const cp = c.codePointAt(0);

            if (cp == null) {
                cpArray.push(c);

                continue;
            }

            if (cp === 9 || cp === 10 || cp === 13) {
                if (!this.cpOutConvertNewLineTabToCP) {
                    cpArray.push(c);

                    continue;
                }
            } else if (this.cpOutPreserveASCII && cp <= 127) {
                cpArray.push(c);

                continue;
            }

            let n = cp.toString(16).toUpperCase();

            while (n.length < 4) {
                n = `0${n}`;
            }

            cpArray.push(`U+${n}`);
        }

        return cpArray.join('');
    }

    private convertToJSES6CodePoints(input: string): string {
        const cpArray: string[] = [];
        let highSurrogate = 0;

        for (const c of input) {
            const cp = c.codePointAt(0);
            if (!cp || cp < 0 || cp > 0xffff) {
                cpArray.push(c);

                continue;
            }

            if (highSurrogate !== 0) {
                // this is a surrogate upper char, and code point contains the lower surrogate
                if (cp >= 0xdc00 && cp <= 0xdfff) {
                    // eslint-disable-next-line no-bitwise
                    let upperSurrogateCp = 0x10000 + ((highSurrogate - 0xd800) << 10) + (cp - 0xdc00);

                    if (this.cpOutFormat === 'es6') {
                        const pad = upperSurrogateCp.toString(16).toUpperCase();
                        cpArray.push(`\\u{${pad}}`);
                    } else {
                        upperSurrogateCp -= 0x10000;
                        // eslint-disable-next-line no-bitwise
                        const pair1 = this.dec2hex4(0xd800 | (upperSurrogateCp >> 10));
                        // eslint-disable-next-line no-bitwise
                        const pair2 = this.dec2hex4(0xdc00 | (upperSurrogateCp & 0x3ff));
                        cpArray.push(`\\u${pair1}\\u${pair2}`);
                    }

                    highSurrogate = 0;
                } else {
                    cpArray.push(c);
                    highSurrogate = 0;
                }

                continue;
            }

            if (cp >= 0xd800 && cp <= 0xdbff) {
                // Start of supplementary character
                highSurrogate = cp;

                continue;
            }

            // BMP character
            switch (cp) {
                case 0: {
                    cpArray.push('\\0');
                    break;
                }
                case 8: {
                    cpArray.push('\\b');
                    break;
                }
                case 9: {
                    if (!this.cpOutFormatEscapse) {
                        cpArray.push('\t');
                    } else {
                        cpArray.push('\\t');
                    }
                    break;
                }
                case 10: {
                    if (!this.cpOutFormatEscapse) {
                        cpArray.push('\n');
                    } else {
                        cpArray.push('\\n');
                    }
                    break;
                }
                case 13: {
                    if (!this.cpOutFormatEscapse) {
                        cpArray.push('\r');
                    } else {
                        cpArray.push('\\r');
                    }
                    break;
                }
                case 11: {
                    if (!this.cpOutFormatEscapse) {
                        // In IE < 9, '\v' == 'v', this normalizes the input
                        cpArray.push('\x0B');
                    } else {
                        cpArray.push('\\v');
                    }
                    break;
                }
                case 12: {
                    cpArray.push('\\f');
                    break;
                }
                case 34: {
                    if (!this.cpOutFormatEscapse) {
                        cpArray.push('"');
                    } else {
                        cpArray.push('\\"');
                    }
                    break;
                }
                case 39: {
                    if (!this.cpOutFormatEscapse) {
                        cpArray.push("'");
                    } else {
                        cpArray.push("\\'");
                    }
                    break;
                }
                case 92: {
                    cpArray.push('\\\\');
                    break;
                }
                default: {
                    // If ASCII
                    if (cp > 0x1f && cp < 0x7f && this.cpOutPreserveASCII) {
                        cpArray.push(String.fromCharCode(cp));
                    } else if (this.cpOutFormat === 'es6') {
                        const hex = cp.toString(16).toUpperCase();
                        cpArray.push(`\\u{${hex}}`);
                    } else {
                        let hex = cp.toString(16).toUpperCase();
                        while (hex.length < 4) {
                            hex = `0${hex}`;
                        }
                        // Or
                        // hex = '0000'.substring(0, 4 - hex.length) + hex;
                        cpArray.push(`\\u${hex}`);
                    }
                }
            }
        }

        return cpArray.join('');
    }

    private convertToChars(input: string): string {
        let str = input;

        // Convert U+... 6 digits to a string of characters
        str = this.replaceHexToChar(/[Uu]\+10([A-Fa-f0-9]{4})/g, str);

        // Convert U+... up to 5 digits to a string of characters
        str = this.replaceHexToChar(/[Uu]\+([A-Fa-f0-9]{1,5})/g, str);

        // Convert 0x... to a string of characters
        // First replace 0x to �� to avoid things like 0x1F4680x200D as being interpreted as too big a number
        str = str.replace(/0x/g, '��');
        str = this.replaceHexToChar(/��([A-Fa-f0-9]{1,6})/g, str);

        // Convert \u{...} to a string of characters
        str = this.replaceHexToChar(/\\u\{([A-Fa-f0-9]{1,})\}/g, str);

        // Convert \u{... ... ...} to a string of characters
        str = this.replaceHexToChar(/\\u\{([A-Fa-f0-9 ]{1,})\}/g, str, true);

        // Convert  \x{...} to a string of characters
        str = this.replaceHexToChar(/\\x\{([A-Fa-f0-9]{1,})\}/g, str);

        // Convert  \x + 2 digits to a string of characters
        str = this.replaceHexToChar(/\\x([A-Fa-f0-9]{2})/g, str);

        // Convert  \U + 6 to 8 digits to a string of characters
        str = this.replaceHexToChar(/\\U([A-Fa-f0-9]{6,8})/g, str);

        // Convert  \u + 4 digits to a string of characters
        str = this.replaceHexToChar(/\\u([A-Fa-f0-9]{4})/g, str);

        if (this.cpInConvertEscapsesToChars) {
            str = this.convertEscapseCharsToChars(str);
        }

        return str;
    }

    private replaceHexToChar(regex: RegExp, str: string, checkSpace = false): string {
        return str.replace(regex, (matchstr, p1: string) => {
            // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
            if (checkSpace && p1.match(' ')) {
                let out = '';
                const chars = p1.split(' ');

                for (const c of chars) {
                    const cp = parseInt(c, 16);

                    if (cp > 0x10ffff) {
                        return matchstr;
                    }

                    out += String.fromCodePoint(cp);
                }

                return out;
            } else {
                const cp = parseInt(p1, 16);

                if (cp <= 0x10ffff) {
                    return String.fromCodePoint(cp);
                }

                // Code point out of range
                return matchstr;
            }
        });
    }

    private convertEscapseCharsToChars(str: string): string {
        // str = str.replace(/\\0/g, '\0');
        str = str.replace(/\\b/g, '\b');
        str = str.replace(/\\t/g, '\t');
        str = str.replace(/\\n/g, '\n');
        str = str.replace(/\\v/g, '\v');
        str = str.replace(/\\f/g, '\f');
        str = str.replace(/\\r/g, '\r');
        str = str.replace(/\\'/g, "'");
        str = str.replace(/\\"/g, '"');
        str = str.replace(/\\\\/g, '\\');

        return str;
    }

    private dec2hex4(d: number): string {
        const hexequiv = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

        // eslint-disable-next-line no-bitwise
        return hexequiv[(d >> 12) & 0xf] + hexequiv[(d >> 8) & 0xf] + hexequiv[(d >> 4) & 0xf] + hexequiv[d & 0xf];
    }
}
