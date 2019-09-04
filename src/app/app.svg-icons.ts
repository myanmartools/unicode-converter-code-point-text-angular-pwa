/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

// tslint:disable:max-line-length

import { Provider } from '@angular/core';

import { SVG_ICON } from '../mat-extensions';

// These are the hardcoded inline svg sources to be used by the `<mat-icon>` component
export const appSvgIconProviders: Provider[] = [
    {
        provide: SVG_ICON,
        useValue: {
            name: 'facebook',
            svgSource: '<svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" width="100%" height="100%" fit=""> ' +
                '<path d="M22.676 0H1.324C.593 0 0 .593 0 1.324v21.352C0 23.408.593 24 1.324 24h11.494v-9.294H9.689v-3.621h3.129V8.41c0-3.099 1.894-4.785 4.659-4.785 1.325 0 2.464.097 2.796.141v3.24h-1.921c-1.5 0-1.792.721-1.792 1.771v2.311h3.584l-.465 3.63H16.56V24h6.115c.733 0 1.325-.592 1.325-1.324V1.324C24 .593 23.408 0 22.676 0"/> ' +
                '</svg>'
        },
        multi: true
    },
    {
        provide: SVG_ICON,
        useValue: {
            name: 'twitter',
            svgSource: '<svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" width="100%" height="100%" fit=""> ' +
                '<path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"/> ' +
                '</svg>'
        },
        multi: true
    },
    // {
    //     provide: SVG_ICON,
    //     useValue: {
    //         name: 'linkedin',
    //         svgSource: '<svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" width="100%" height="100%" fit=""> ' +
    //             '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/> ' +
    //             '</svg>'
    //     },
    //     multi: true
    // },
    // {
    //     provide: SVG_ICON,
    //     useValue: {
    //         name: 'blogger',
    //         svgSource: '<svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" width="100%" height="100%" fit=""> ' +
    //             '<path d="M21.976 24H2.026C.9 24 0 23.1 0 21.976V2.026C0 .9.9 0 2.025 0H22.05C23.1 0 24 .9 24 2.025v19.95C24 23.1 23.1 24 21.976 24zM12 3.975H9c-2.775 0-5.025 2.25-5.025 5.025v6c0 2.774 2.25 5.024 5.025 5.024h6c2.774 0 5.024-2.25 5.024-5.024v-3.975c0-.6-.45-1.05-1.05-1.05H18c-.524 0-.976-.45-.976-.976 0-2.776-2.25-5.026-5.024-5.026zm3.074 12H9c-.525 0-.975-.45-.975-.975s.45-.976.975-.976h6.074c.526 0 .977.45.977.976s-.45.976-.975.976zm-2.55-7.95c.527 0 .976.45.976.975s-.45.975-.975.975h-3.6c-.525 0-.976-.45-.976-.975s.45-.975.975-.975h3.6z"/> ' +
    //             '</svg>'
    //     },
    //     multi: true
    // },
    {
        provide: SVG_ICON,
        useValue: {
            name: 'medium',
            svgSource: '<svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" width="100%" height="100%" fit=""> ' +
                '<path d="M0 0v24h24V0H0zm19.938 5.686L18.651 6.92a.376.376 0 0 0-.143.362v9.067a.376.376 0 0 0 .143.361l1.257 1.234v.271h-6.322v-.27l1.302-1.265c.128-.128.128-.165.128-.36V8.99l-3.62 9.195h-.49L6.69 8.99v6.163a.85.85 0 0 0 .233.707l1.694 2.054v.271H3.815v-.27L5.51 15.86a.82.82 0 0 0 .218-.707V8.027a.624.624 0 0 0-.203-.527L4.019 5.686v-.27h4.674l3.613 7.923 3.176-7.924h4.456v.271z"/> ' +
                '</svg>'
        },
        multi: true
    }
];
