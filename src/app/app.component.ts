// tslint:disable: binary-expression-operand-order
// tslint:disable: no-bitwise

import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, takeUntil } from 'rxjs/operators';

import { ZawgyiDetector, ZgUniDetectResult } from '@myanmartools/ng-zawgyi-detector';

import { CdkTextareaSyncSize } from '../cdk-extensions';

import { environment } from '../environments/environment';
import { VERSION } from '../version';

export type FontEncType = 'zg' | 'uni' | null | '';
export type CpOutFormatType = 'js' | 'es6' | 'uPlus';

export interface UnicodeFormatterResult extends ZgUniDetectResult {
    input: string;
    formattedOutput: string;
    inputIsCodePoints: boolean;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'Unicode Code Points Text Converter';
    titleSuffix = ' - Myanmar Tools';

    githubRepoUrl = 'https://github.com/myanmartools/unicode-code-points-text-converter-angular-pwa';
    githubImageAlt = 'Unicode Code Points Text Converter GitHub Repo';
    githubReleaseUrl = 'https://github.com/myanmartools/unicode-code-points-text-converter-angular-pwa/releases';

    sourceFontEnc: FontEncType;
    targetFontEnc: FontEncType;

    @ViewChild('sourceTextareaSyncSize')
    sourceTextareaSyncSize: CdkTextareaSyncSize;

    @ViewChild('outTextareaSyncSize')
    outTextareaSyncSize: CdkTextareaSyncSize;

    get appVersion(): string {
        return VERSION.full;
    }

    get titleWithSuffix(): string {
        return `${this.title}${this.titleSuffix}`;
    }

    get baseUrl(): string {
        return environment.production ? 'https://unicode-code-points-text-converter.myanmartools.org/' : '/';
    }

    get appImageUrl(): string {
        return `${this.baseUrl}assets/images/appicons/v1/logo.png`;
    }

    get githubImageUrl(): string {
        return `${this.baseUrl}assets/images/appicons/v1/github.svg`;
    }

    private readonly _convertSubject = new Subject<string>();
    private readonly _destroyed = new Subject<void>();

    // private readonly _printableASCIIRegExp = /[\x20-\x7E]/;

    private _sourceText = '';
    private _outText = '';

    private _cpOutOptionsVisible = false;
    private _cpOutFormat: CpOutFormatType = 'js';
    private _cpOutFormatEscapse = true;
    private _cpOutConvertNewLineTabToCP = false;
    private _cpOutPreserveASCII = true;

    private _cpInConvertEscapsesToChars = true;

    get sourceText(): string {
        return this._sourceText;
    }
    set sourceText(value: string) {
        this._sourceText = value;
        this.convertNext();
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

    constructor(private readonly _zawgyiDetector: ZawgyiDetector) { }

    ngOnInit(): void {
        this.sourceTextareaSyncSize.secondCdkTextareaSyncSize = this.outTextareaSyncSize;
        this.outTextareaSyncSize.secondCdkTextareaSyncSize = this.sourceTextareaSyncSize;

        this._convertSubject.pipe(
            distinctUntilChanged(),
            filter(formattedInput => formattedInput && formattedInput.indexOf('|') > 1 ? true : false),
            takeUntil(this._destroyed),
            switchMap(formattedInput => {
                let input = formattedInput.substr(formattedInput.indexOf('|'));
                input = input.length === 1 ? '' : input.substr(1);

                return this.convert(input);
            })
        ).subscribe(result => {
            if (result.inputIsCodePoints) {
                this._cpOutOptionsVisible = false;
                this.sourceFontEnc = null;

                if (result.detectedEnc === 'zg') {
                    this.targetFontEnc = 'zg';
                } else if (result.detectedEnc === 'uni') {
                    this.targetFontEnc = 'uni';
                } else {
                    this.targetFontEnc = null;
                }
            } else {
                if (result.formattedOutput && result.formattedOutput.length > 0) {
                    this._cpOutOptionsVisible = true;
                }

                this.targetFontEnc = null;

                if (result.detectedEnc === 'zg') {
                    this.sourceFontEnc = 'zg';
                } else if (result.detectedEnc === 'uni') {
                    this.sourceFontEnc = 'uni';
                } else {
                    this.sourceFontEnc = null;
                }
            }

            this._outText = result.formattedOutput;
        });
    }

    ngOnDestroy(): void {
        this._destroyed.next();
        this._destroyed.complete();
    }

    private convertNext(): void {
        const formattedInput = `${this.cpOutFormat},
        ${this.cpOutFormatEscapse},
        ${this.cpOutConvertNewLineTabToCP},
        ${this.cpInConvertEscapsesToChars},
        ${this.cpOutPreserveASCII}|${this._sourceText}`;

        this._convertSubject.next(formattedInput);
    }

    private convert(input: string): Observable<UnicodeFormatterResult> {
        const result: UnicodeFormatterResult = {
            detectedEnc: null,
            probability: 0,
            containsUnicodeBlocks: false,
            stdCodePointsMatchedCount: 0,
            extCodePointsMatchedCount: 0,
            zgMatches: [],
            uniMatches: [],

            input: input,
            inputIsCodePoints: false,
            formattedOutput: ''
        };

        if (this.inputContainsCodePoints(input)) {
            const formattedOutput = this.convertToChars(input);
            result.formattedOutput = formattedOutput;
            result.inputIsCodePoints = true;

            return this._zawgyiDetector.detect(formattedOutput).pipe(
                map(zgDetectorResult => {
                    return {
                        ...result,
                        ...zgDetectorResult
                    };
                })
            );
        } else {
            const formattedOutput = this.convertToCodePoints(input);
            result.formattedOutput = formattedOutput;

            return this._zawgyiDetector.detect(input).pipe(
                map(zgDetectorResult => {
                    return {
                        ...result,
                        ...zgDetectorResult
                    };
                })
            );
        }
    }

    private inputContainsCodePoints(input: string): boolean {
        if (/[Uu]\+10([A-Fa-f0-9]{4})/g.test(input) ||
            /[Uu]\+([A-Fa-f0-9]{1,5})/g.test(input) ||
            /\\[ux]\{([A-Fa-f0-9 ]{1,})\}/g.test(input) ||
            /\\x([A-Fa-f0-9]{2})/g.test(input) ||
            /\\U([A-Fa-f0-9]{6})/g.test(input) ||
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

    // tslint:disable-next-line: max-func-body-length
    private convertToJSES6CodePoints(input: string): string {
        const cpArray: string[] = [];
        let highSurrogate = 0;

        for (const c of input) {
            const cp = c.codePointAt(0);
            if (!cp || cp < 0 || cp > 0xFFFF) {
                cpArray.push(c);

                continue;
            }

            if (highSurrogate !== 0) {
                // this is a surrogate upper char, and code point contains the lower surrogate
                if (cp >= 0xDC00 && cp <= 0xDFFF) {
                    let upperSurrogateCp = 0x10000 + ((highSurrogate - 0xD800) << 10) + (cp - 0xDC00);

                    if (this.cpOutFormat === 'es6') {
                        const pad = upperSurrogateCp.toString(16).toUpperCase();
                        cpArray.push(`\\u{${pad}}`);
                    } else {
                        upperSurrogateCp -= 0x10000;
                        const pair1 = this.dec2hex4(0xD800 | (upperSurrogateCp >> 10));
                        const pair2 = this.dec2hex4(0xDC00 | (upperSurrogateCp & 0x3FF));
                        cpArray.push(`\\u${pair1}\\u${pair2}`);
                    }

                    highSurrogate = 0;
                } else {
                    cpArray.push(c);
                    highSurrogate = 0;
                }

                continue;
            }

            if (cp >= 0xD800 && cp <= 0xDBFF) {
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
                        cpArray.push('\\\"');
                    }
                    break;
                }
                case 39: {
                    if (!this.cpOutFormatEscapse) {
                        cpArray.push("'");
                    } else {
                        cpArray.push("\\\'");
                    }
                    break;
                }
                case 92: {
                    cpArray.push('\\\\');
                    break;
                }
                default: {
                    // If ASCII
                    if (cp > 0x1F && cp < 0x7F && this.cpOutPreserveASCII) {
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

        // Convert  \U + 6 digits to a string of characters
        str = this.replaceHexToChar(/\\U([A-Fa-f0-9]{6})/g, str);

        // Convert  \u + 4 digits to a string of characters
        str = this.replaceHexToChar(/\\u([A-Fa-f0-9]{4})/g, str);

        if (this.cpInConvertEscapsesToChars) {
            str = this.convertEscapseCharsToChars(str);
        }

        return str;
    }

    private replaceHexToChar(regex: RegExp, str: string, checkSpace: boolean = false): string {
        return str.replace(regex, (matchstr, p1: string) => {
            if (checkSpace && p1.match(' ')) {
                let out = '';
                const chars = p1.split(' ');

                for (const c of chars) {
                    const cp = parseInt(c, 16);

                    if (cp > 0x10FFFF) {
                        return matchstr;
                    }

                    out += String.fromCodePoint(cp);
                }

                return out;
            } else {
                const cp = parseInt(p1, 16);

                if (cp <= 0x10FFFF) {
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
        str = str.replace(/\\\'/g, '\'');
        str = str.replace(/\\\"/g, '\"');
        str = str.replace(/\\\\/g, '\\');

        return str;
    }

    private dec2hex4(d: number): string {
        const hexequiv = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

        return hexequiv[(d >> 12) & 0xF] + hexequiv[(d >> 8) & 0xF] + hexequiv[(d >> 4) & 0xF] + hexequiv[d & 0xF];
    }
}
