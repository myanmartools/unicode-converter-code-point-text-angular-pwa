import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, takeUntil } from 'rxjs/operators';

import { ZawgyiDetector, ZgUniDetectResult } from '@myanmartools/ng-zawgyi-detector';

import { CdkTextareaSyncSize } from '../cdk-extensions';

import { environment } from '../environments/environment';
import { VERSION } from '../version';

export type FontEnc = 'zg' | 'uni' | null | '';

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
    title = 'Unicode Converter';
    titleSuffix = ' - Covert UTF-16 Code Points and Text';

    githubRepoUrl = 'https://github.com/myanmartools/unicode-code-points-text-converter-angular-pwa';
    githubImageAlt = 'Unicode (UTF-16) Code Points Text Converter GitHub Repo';

    sourceFontEnc: FontEnc;
    targetFontEnc: FontEnc;

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

    private readonly _inputCpTestRegExp1 = /\\u\{[0-9A-Fa-f]{1,6}\}/;
    private readonly _inputCpTestRegExp2 = /\\u[0-9A-Fa-f]{4,6}/;
    private readonly _inputCpTestRegExp3 = /\\x[0-9A-Fa-f]{2,6}/;

    private readonly _escapseCharsRegExp = /[\b\f\n\r\t\v]/;
    private readonly _convertSubject = new Subject<string>();
    private readonly _destroyed = new Subject<void>();

    private readonly _printableASCIIRegExp = /[\x20-\x7E]/;

    private _sourceText = '';
    private _outText = '';
    private _formatEscapseChars = true;

    get sourceText(): string {
        return this._sourceText;
    }
    set sourceText(value: string) {
        this._sourceText = value;
        this.convert(this._sourceText, this._formatEscapseChars);
    }

    get formatEscapseChars(): boolean {
        return this._formatEscapseChars;
    }
    set formatEscapseChars(value: boolean) {
        this._formatEscapseChars = value;
        this.convert(this._sourceText, this._formatEscapseChars);
    }

    get outText(): string {
        return this._outText;
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
                const formatEscapseCharsStr = formattedInput.substr(0, formattedInput.indexOf('|'));
                const formatEscapseChars = formatEscapseCharsStr === 'true' ? true : false;
                let input = formattedInput.substr(formattedInput.indexOf('|'));
                input = input.length === 1 ? '' : input.substr(1);

                return this.formatAndConvert(input, formatEscapseChars);
            })
        ).subscribe(result => {
            if (result.inputIsCodePoints) {
                this.sourceFontEnc = null;

                if (result.detectedEnc === 'zg') {
                    this.targetFontEnc = 'zg';
                } else if (result.detectedEnc === 'uni') {
                    this.targetFontEnc = 'uni';
                } else {
                    this.targetFontEnc = null;
                }
            } else {
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

    private formatAndConvert(input: string, formatEscapseChars: boolean): Observable<UnicodeFormatterResult> {
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

        if (this._inputCpTestRegExp1.test(input) || this._inputCpTestRegExp2.test(input) || this._inputCpTestRegExp3.test(input)) {
            const formattedOutput = this.formatToText(input, formatEscapseChars);
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
            const formattedOutput = this.formatToCodePoints(input, formatEscapseChars);
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

    private formatToText(input: string, formatEscapseChars: boolean): string {
        const obj = {
            input: input
        };

        let str = JSON.stringify(obj);

        str = str.replace(/(\\\\u)(\{[0-9A-Fa-f]{1,6}\})/g, '\\u$2');
        str = str.replace(/(\\\\u)([0-9A-Fa-f]{4,6})/g, '\\u$2');
        str = str.replace(/(\\\\x)([0-9A-Fa-f]{2,6})/g, '\\x$2');
        if (!formatEscapseChars) {
            str = str.replace(/(\\\\)([nrtfvb])/g, '\\$2');
        }
        const newObj = JSON.parse(str) as { input: string };

        return newObj.input;
    }

    private formatToCodePoints(str: string, formatEscapseChars: boolean): string {
        const cpArray: string[] = [];
        for (const c of str) {
            if (this._escapseCharsRegExp.test(c)) {
                if (formatEscapseChars) {
                    if (c === '\n') {
                        cpArray.push('\\n');
                    } else if (c === '\r') {
                        cpArray.push('\\r');
                    } else if (c === '\t') {
                        cpArray.push('\\t');
                    } else if (c === '\f') {
                        cpArray.push('\\f');
                    } else if (c === '\v') {
                        cpArray.push('\\v');
                    } else if (c === '\b') {
                        cpArray.push('\\b');
                    } else {
                        cpArray.push(c);
                    }
                } else {
                    cpArray.push(c);
                }

            } else {
                const cp = c.codePointAt(0);
                if (cp != null && !this._printableASCIIRegExp.test(c)) {
                    cpArray.push(`\\u${cp.toString(16)}`);
                } else {
                    cpArray.push(c);
                }
            }
        }

        return cpArray.join('');
    }

    private convert(input: string, formatEscapseChars: boolean): void {
        const formattedInput = `${formatEscapseChars}|${input}`;
        this._convertSubject.next(formattedInput);
    }
}
