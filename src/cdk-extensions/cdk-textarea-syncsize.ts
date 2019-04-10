// tslint:disable: directive-class-suffix
// tslint:disable: directive-selector
// tslint:disable: no-host-metadata-property

import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import {
    AfterViewInit,
    Directive,
    DoCheck,
    ElementRef,
    Input,
    NgZone,
    OnDestroy
} from '@angular/core';

import { fromEvent, Subject } from 'rxjs';
import { auditTime, takeUntil } from 'rxjs/operators';

@Directive({
    selector: 'textarea[cdkTextareaSyncSize]',
    exportAs: 'cdkTextareaSyncSize',
    host: {
        class: 'cdk-textarea-autosize cdk-textarea-syncsize',
        rows: '1',
        '(input)': '_noopInputHandler()'
    }
})
export class CdkTextareaSyncSize implements AfterViewInit, DoCheck, OnDestroy {
    _cachedHeight = -1;

    private _previousValue?: string;
    private _initialHeight: string | null;
    private readonly _destroyed = new Subject<void>();

    private _minRows: number;
    private _maxRows: number;
    private _enabled = true;

    private _previousMinRows = -1;

    private readonly _textareaElement: HTMLTextAreaElement;

    // tslint:disable-next-line: no-unsafe-any
    @Input('cdkAutosizeMinRows')
    get minRows(): number { return this._minRows; }
    set minRows(value: number) {
        this._minRows = value;
        this.setMinHeight();
    }

    // tslint:disable-next-line: no-unsafe-any
    @Input('cdkAutosizeMaxRows')
    get maxRows(): number { return this._maxRows; }
    set maxRows(value: number) {
        this._maxRows = value;
        this.setMaxHeight();
    }

    // tslint:disable-next-line: no-unsafe-any
    @Input('cdkTextareaSyncSize')
    get enabled(): boolean {
        return this._enabled;
    }
    set enabled(value: boolean) {
        value = coerceBooleanProperty(value);

        if (this._enabled !== value) {
            this._enabled = value;
            if (this._enabled) {
                if (this._platform.isBrowser) {
                    this.resizeToFitContent(true);
                } else {
                    this.cacheTextareaLineHeightNonBrowser();
                }

            } else {
                this.reset();
            }
        }
    }

    // tslint:disable-next-line: no-unsafe-any
    @Input('secondCdkTextareaSyncSize')
    get secondCdkTextareaSyncSize(): CdkTextareaSyncSize | undefined {
        return this._secondCdkTextareaSyncSize;
    }
    set secondCdkTextareaSyncSize(value: CdkTextareaSyncSize | undefined) {
        this._secondCdkTextareaSyncSize = value;
    }

    private _cachedLineHeight: number;
    private _secondCdkTextareaSyncSize: CdkTextareaSyncSize | undefined;

    constructor(
        private readonly _elementRef: ElementRef<HTMLElement>,
        private readonly _platform: Platform,
        private readonly _ngZone: NgZone) {
        this._textareaElement = this._elementRef.nativeElement as HTMLTextAreaElement;
    }

    ngAfterViewInit(): void {
        if (this._platform.isBrowser) {
            // Remember the height which we started with in case autosizing is disabled
            this._initialHeight = this._textareaElement.style.height;

            this.resizeToFitContent();

            this._ngZone.runOutsideAngular(() => {
                fromEvent(window, 'resize')
                    .pipe(auditTime(16), takeUntil(this._destroyed))
                    .subscribe(() => {
                        this.resizeToFitContent(true);
                    });
            });
        } else {
            this.cacheTextareaLineHeightNonBrowser();
        }
    }

    ngOnDestroy(): void {
        this._destroyed.next();
        this._destroyed.complete();
    }

    ngDoCheck(): void {
        if (this._platform.isBrowser) {
            this.resizeToFitContent();
        }
    }

    resizeToFitContent(force: boolean = false, suggestedMinHeight: number = -1): void {
        if (!this._enabled) {
            return;
        }

        this.cacheTextareaLineHeight();

        if (!this._cachedLineHeight) {
            return;
        }

        const textarea = this._elementRef.nativeElement as HTMLTextAreaElement;
        const value = textarea.value;

        if (!force && this._minRows === this._previousMinRows && value === this._previousValue) {
            return;
        }

        const placeholderText = textarea.placeholder;
        textarea.classList.add('cdk-textarea-syncsize-measuring');
        textarea.placeholder = '';

        let height = textarea.scrollHeight - 4;
        if (height < suggestedMinHeight) {
            height = suggestedMinHeight;
        }

        let heightChanged = false;
        if (height !== this._cachedHeight) {
            textarea.style.height = `${height}px`;
            this._cachedHeight = height;
            heightChanged = true;
        }

        textarea.classList.remove('cdk-textarea-syncsize-measuring');
        textarea.placeholder = placeholderText;

        if (heightChanged && this.secondCdkTextareaSyncSize && suggestedMinHeight <= 0) {
            this.secondCdkTextareaSyncSize.resizeToFitContent(true, height);

            if (this.secondCdkTextareaSyncSize._cachedHeight > 0 &&
                this.secondCdkTextareaSyncSize._cachedHeight > height) {
                const newHeight = this.secondCdkTextareaSyncSize._cachedHeight;
                textarea.style.height = `${newHeight}px`;
                this._cachedHeight = newHeight;
            }
        }

        if (heightChanged) {
            this._ngZone.runOutsideAngular(() => {
                if (requestAnimationFrame != null) {
                    requestAnimationFrame(() => {
                        this.scrollToCaretPosition(textarea);
                    });
                } else {
                    setTimeout(() => {
                        this.scrollToCaretPosition(textarea);
                    });
                }
            });
        }

        this._previousValue = value;
        this._previousMinRows = this._minRows;
    }

    reset(): void {
        if (this._initialHeight === undefined) {
            return;
        }
        this._textareaElement.style.height = this._initialHeight;
    }

    _noopInputHandler(): void {
        // Do nothing
    }

    private scrollToCaretPosition(textarea: HTMLTextAreaElement): void {
        const { selectionStart, selectionEnd } = textarea;

        if (!this._destroyed.isStopped && document.activeElement === textarea) {
            textarea.setSelectionRange(selectionStart, selectionEnd);
        }
    }

    // TODO: fix not working when setting height values in css class
    private cacheTextareaLineHeight(): void {
        if (this._cachedLineHeight) {
            return;
        }

        const textareaClone = this._textareaElement.cloneNode(false) as HTMLTextAreaElement;
        textareaClone.rows = 1;

        textareaClone.style.position = 'absolute';
        textareaClone.style.visibility = 'hidden';
        textareaClone.style.border = 'none';
        textareaClone.style.padding = '0';
        textareaClone.style.height = '';
        textareaClone.style.minHeight = '';
        textareaClone.style.maxHeight = '';

        textareaClone.style.overflow = 'hidden';

        if (this._textareaElement.parentNode) {
            this._textareaElement.parentNode.appendChild(textareaClone);
            textareaClone.classList.add('cdk-textarea-syncsize-lineheight-measuring');
        }

        this._cachedLineHeight = textareaClone.clientHeight;
        textareaClone.classList.remove('cdk-textarea-syncsize-lineheight-measuring');

        if (this._textareaElement.parentNode) {
            this._textareaElement.parentNode.removeChild(textareaClone);
        }

        this.setMinHeight();
        this.setMaxHeight();
    }

    private cacheTextareaLineHeightNonBrowser(): void {
        if (this._cachedLineHeight) {
            return;
        }

        // TODO: use input property
        this._cachedLineHeight = 22;

        this.setMinHeight();
        this.setMaxHeight();
    }

    private setMinHeight(): void {
        const minHeight = this.minRows && this._cachedLineHeight ?
            `${this.minRows * this._cachedLineHeight}px` : null;

        if (minHeight) {
            this._textareaElement.style.minHeight = minHeight;
        }
    }

    private setMaxHeight(): void {
        const maxHeight = this.maxRows && this._cachedLineHeight ?
            `${this.maxRows * this._cachedLineHeight}px` : null;

        if (maxHeight) {
            this._textareaElement.style.maxHeight = maxHeight;
        }
    }
}
