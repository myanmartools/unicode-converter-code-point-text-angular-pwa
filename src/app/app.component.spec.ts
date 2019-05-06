// tslint:disable: no-floating-promises

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { FlexLayoutModule } from '@angular/flex-layout';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatToolbarModule } from '@angular/material/toolbar';

import { NoopZgUniRuleLoaderModule, ZawgyiDetectorModule } from '@myanmartools/ng-zawgyi-detector';

import { CdkTextareaSyncSizeModule } from '../cdk-extensions';
import { CustomIconRegistry } from '../mat-extensions';

import { AppComponent } from './app.component';
import { appSvgIconProviders } from './app.svg-icons';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent
            ],
            imports: [
                NoopAnimationsModule,
                CommonModule,
                HttpClientTestingModule,
                FormsModule,

                FlexLayoutModule,
                MatButtonModule,
                MatCheckboxModule,
                MatIconModule,
                MatInputModule,
                MatRadioModule,
                MatToolbarModule,

                CdkTextareaSyncSizeModule,

                ZawgyiDetectorModule,
                NoopZgUniRuleLoaderModule
            ],
            providers: [
                {
                    provide: MatIconRegistry,
                    useClass: CustomIconRegistry
                },
                appSvgIconProviders
            ]
        }).compileComponents();
    }));

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });

    it("should have as title 'Unicode Code Points Lookup'", () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance  as AppComponent;
        expect(app.title).toEqual('Unicode Code Points Lookup');
    });

    it("should have as title 'Unicode Code Points Lookup' in app-header tag", () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement as HTMLElement;
        const ele = compiled.querySelector('.app-header a.nav-brand span');
        expect(ele && ele.textContent).toContain('Unicode Code Points Lookup');
    });

    it("'sourceText' : 'ကခ' should be converted to 'outText' : '\\u1000\\u1001'", () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance as AppComponent;
        app.ngOnInit();
        app.sourceText = 'ကခ';
        expect(app.outText).toEqual('\\u1000\\u1001');
    });

    it("'sourceText' : '❤️‍' should be converted to 'outText' : '\\u2764\\uFE0F\\u200D'", () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance as AppComponent;
        app.ngOnInit();
        app.sourceText = '❤️‍';
        expect(app.outText).toEqual('\\u2764\\uFE0F\\u200D');
    });

    it("'sourceText' : '\\u1000\\u1001' should be converted to 'outText' : 'ကခ'", () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance as AppComponent;
        app.ngOnInit();
        app.sourceText = '\\u1000\\u1001';
        expect(app.outText).toEqual('ကခ');
    });

    it("'sourceText' : 'e\\u0301' should be converted to 'outText' : 'é'", () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance as AppComponent;
        app.ngOnInit();
        app.sourceText = 'e\\u0301';
        expect(app.outText).toEqual('é');
    });

    it("'sourceText' : '\\u{D83D}\\u{DC36}' should be converted to 'outText' : '🐶'", () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance as AppComponent;
        app.ngOnInit();
        app.sourceText = '\\u{D83D}\\u{DC36}';
        expect(app.outText).toEqual('🐶');
    });

    it("'sourceText' : '\\u{1F436}' should be converted to 'outText' : '🐶'", () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance as AppComponent;
        app.ngOnInit();
        app.sourceText = '\\u{1F436}';
        expect(app.outText).toEqual('🐶');
    });

    it("'sourceText' : '\\u{1000 1001}' should be converted to 'outText' : 'ကခ'", () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance as AppComponent;
        app.ngOnInit();
        app.sourceText = '\\u{1000 1001}';
        expect(app.outText).toEqual('ကခ');
    });

    it("'sourceText' : 'U+1F1F2U+1F1F2' should be converted to 'outText' : '🇲🇲'", () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance as AppComponent;
        app.ngOnInit();
        app.sourceText = 'U+1F1F2U+1F1F2';
        expect(app.outText).toEqual('🇲🇲');
    });

    it("'sourceText' : 'U+1F436' should be converted to 'outText' : '🐶'", () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance as AppComponent;
        app.ngOnInit();
        app.sourceText = 'U+1F436';
        expect(app.outText).toEqual('🐶');
    });

    it("'sourceText' : '\\U01F436' should be converted to 'outText' : '🐶'", () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance as AppComponent;
        app.ngOnInit();
        app.sourceText = '\\U01F436';
        expect(app.outText).toEqual('🐶');
    });

    it("'sourceText' : '0x75' should be converted to 'outText' : 'u'", () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance as AppComponent;
        app.ngOnInit();
        app.sourceText = '0x75';
        expect(app.outText).toEqual('u');
    });

    it("'sourceText' : '\\x75' should be converted to 'outText' : 'u'", () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance as AppComponent;
        app.ngOnInit();
        app.sourceText = '\\x75';
        expect(app.outText).toEqual('u');
    });

    it("'sourceText' : '\\x{1000}' should be converted to 'outText' : 'က'", () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance as AppComponent;
        app.ngOnInit();
        app.sourceText = '\\x{1000}';
        expect(app.outText).toEqual('က');
    });
});
