// tslint:disable: no-unnecessary-class

import { NgModule } from '@angular/core';

import { PlatformModule } from '@angular/cdk/platform';
import { CdkTextareaSyncSize } from './cdk-textarea-syncsize';

@NgModule({
    declarations: [
        CdkTextareaSyncSize
    ],
    imports: [PlatformModule],
    exports: [CdkTextareaSyncSize],
})
export class CdkTextareaSyncSizeModule { }
