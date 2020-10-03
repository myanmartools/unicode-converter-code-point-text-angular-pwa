/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { Provider } from '@angular/core';

import { SVG_ICON } from '../modules/mat-extensions';

// These are the hardcoded inline svg sources to be used by the `<mat-icon>` component
export const appSvgIconProviders: Provider[] = [
    {
        provide: SVG_ICON,
        useValue: {
            name: 'logo-myanmartools',
            svgSource:
                '<svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" width="100%" height="100%" fit=""> ' +
                '<path d="M13.5,12.7c-0.1,0.4-0.2,0.8-0.1,1.3c0.1,0.1,0.7,1.3,0.7,1.3s0.1,0.2,0.2,0.3c0,0.1,0,0.3-0.2,0.6c0,0-0.5,0.6-0.3,1.2' +
                'l0.7,0.7c0,0,0.2,1,0.4,1.5c0,0,0.4,0.8,0.3,0.9c0,0-0.4,1-0.7,1.5h4.3l2.7-4.6l-2.7-4.6h-5.3V12.7z" /> ' +
                '<path d="M14.1,20.4c0.2-0.2,0.1-1.4-0.2-1.6l-0.2-0.6l-0.3-0.1L13.1,17L13,15.3l-0.8-0.6l-1.5,2.6l2.7,4.6h0.7' +
                'C14.1,21.5,14,20.6,14.1,20.4z" /> ' +
                '<path d="M9.1,15.6c0,0,0.7-1.9-0.3-3.2c0,0-0.4,0-0.6-0.4c0,0,0.1-0.1,0.2-0.3c0,0-0.3-0.7-1.6-1.5V9.7c0-0.1,0.1-0.3,0.3-0.3h0.1' +
                'V9.1c0-0.2,0.1-0.3,0.3-0.3h0.2V8.1c0-0.2,0.2-0.3,0.3-0.3V7.6H5l-2.7,4.6L5,16.9h5.3l0.8-1.3L10.5,16C10.5,16,9.5,15.8,9.1,15.6z" /> ' +
                '<path d="M14,2.5c0,0,0.4,1,0,2.2c0,0-1.2,1.1-0.9,2c0,0,1.1-0.6,1.2-0.2l0.3,0.8c0,0,0.4,0.1,0.6,0.3c0,0-0.1,0.9-0.2,0.9' +
                'c0.1,0,0.5-0.2,0.6,0c0,0,0.5,0.6,0.4,0.7h0.7c0,0,0.7-0.3,0.2,0.3c0,0-0.5,0.7-1.2,1.2c0,0-0.3,0.3-0.6,0.5H19l2.7-4.6L19,2h-5.3' +
                'c0.1,0.1,0.2,0.3,0.2,0.6H14V2.5z" /> ' +
                '</svg>'
        },
        multi: true
    },
    {
        provide: SVG_ICON,
        useValue: {
            name: 'logo-facebook',
            svgSource:
                '<svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" width="100%" height="100%" fit=""> ' +
                '<path d="M22,12.1c0-5.5-4.5-10-10-10c-5.5,0-10,4.5-10,10c0,5,3.7,9.1,8.4,9.9v-7H7.9v-2.9h2.5V9.9c0-2.5,1.5-3.9,3.8-3.9' +
                'c1.1,0,2.2,0.2,2.2,0.2v2.5h-1.3c-1.2,0-1.6,0.8-1.6,1.6v1.9h2.8L15.9,15h-2.3v7C18.3,21.2,22,17.1,22,12.1z"/> ' +
                '</svg>'
        },
        multi: true
    },
    {
        provide: SVG_ICON,
        useValue: {
            name: 'logo-twitter',
            svgSource:
                '<svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" width="100%" height="100%" fit=""> ' +
                '<path d="M 23.954 4.569 c -0.885 0.389 -1.83 0.654 -2.825 0.775 c 1.014 -0.611 1.794 -1.574 2.163 -2.723 c -0.951 0.555 -2.005 0.959 -3.127 1.184 c -0.896 -0.959 -2.173 -1.559 -3.591 -1.559 c -2.717 0 -4.92 2.203 -4.92 4.917 c 0 0.39 0.045 0.765 0.127 1.124 C 7.691 8.094 4.066 6.13 1.64 3.161 c -0.427 0.722 -0.666 1.561 -0.666 2.475 c 0 1.71 0.87 3.213 2.188 4.096 c -0.807 -0.026 -1.566 -0.248 -2.228 -0.616 v 0.061 c 0 2.385 1.693 4.374 3.946 4.827 c -0.413 0.111 -0.849 0.171 -1.296 0.171 c -0.314 0 -0.615 -0.03 -0.916 -0.086 c 0.631 1.953 2.445 3.377 4.604 3.417 c -1.68 1.319 -3.809 2.105 -6.102 2.105 c -0.39 0 -0.779 -0.023 -1.17 -0.067 c 2.189 1.394 4.768 2.209 7.557 2.209 c 9.054 0 13.999 -7.496 13.999 -13.986 c 0 -0.209 0 -0.42 -0.015 -0.63 c 0.961 -0.689 1.8 -1.56 2.46 -2.548 l -0.047 -0.02 Z"/>' +
                '</svg>'
        },
        multi: true
    },
    {
        provide: SVG_ICON,
        useValue: {
            name: 'logo-youtube',
            svgSource:
                '<svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" width="100%" height="100%" fit=""> ' +
                '<path d="M21.6,7.2c-0.2-0.8-0.9-1.5-1.7-1.7C18.3,5,12,5,12,5S5.8,5,4.2,5.4C3.3,5.7,2.7,6.3,2.4,7.2C2.1,8.8,2,10.4,2,12' +
                'c0,1.6,0.1,3.2,0.4,4.8c0.2,0.8,0.9,1.5,1.7,1.7C5.7,19,12,19,12,19s6.3,0,7.8-0.4c0.8-0.2,1.5-0.9,1.7-1.7c0.3-1.6,0.4-3.2,0.4-4.8' +
                'C22,10.4,21.9,8.8,21.6,7.2z M10,15V9l5.2,3L10,15z"/> ' +
                '</svg>'
        },
        multi: true
    },
    {
        provide: SVG_ICON,
        useValue: {
            name: 'logo-medium',
            svgSource:
                '<svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" width="100%" height="100%" fit=""> ' +
                '<path d="M2,2v20h20V2H2z M18.6,6.7l-1.1,1c-0.1,0.1-0.1,0.2-0.1,0.3v7.6c0,0.1,0,0.2,0.1,0.3l1,1v0.2h-5.3V17l1.1-1.1' +
                'c0.1-0.1,0.1-0.1,0.1-0.3V9.5l-3,7.7h-0.4L7.6,9.5v5.1c0,0.2,0,0.4,0.2,0.6l1.4,1.7v0.2h-4v-0.2l1.4-1.7c0.2-0.2,0.2-0.4,0.2-0.6' +
                'V8.7c0-0.2,0-0.3-0.2-0.4L5.3,6.7V6.5h3.9l3,6.6l2.6-6.6h3.7V6.7z"/> ' +
                '</svg>'
        },
        multi: true
    },
    {
        provide: SVG_ICON,
        useValue: {
            name: 'logo-github',
            svgSource:
                '<svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" width="100%" height="100%" fit=""> ' +
                '<path d="M12,2.2c-5.5,0-10,4.5-10,10c0,4.4,2.9,8.2,6.8,9.5c0.5,0.1,0.7-0.2,0.7-0.5c0-0.2,0-0.9,0-1.7c-2.8,0.6-3.4-1.3-3.4-1.3' +
                'C5.7,17.1,5,16.7,5,16.7c-0.9-0.6,0.1-0.6,0.1-0.6c1,0.1,1.5,1,1.5,1C7.5,18.7,9,18.3,9.5,18c0.1-0.6,0.3-1.1,0.6-1.3' +
                'c-2.2-0.3-4.6-1.1-4.6-4.9c0-1.1,0.4-2,1-2.7C6.5,8.8,6.2,7.8,6.7,6.4c0,0,0.8-0.3,2.7,1c0.8-0.2,1.7-0.3,2.5-0.3' +
                'c0.8,0,1.7,0.1,2.5,0.3c1.9-1.3,2.7-1,2.7-1c0.5,1.4,0.2,2.4,0.1,2.6c0.6,0.7,1,1.6,1,2.7c0,3.8-2.3,4.7-4.6,4.9' +
                'c0.3,0.3,0.7,0.9,0.7,1.8c0,1.3,0,2.4,0,2.7c0,0.3,0.2,0.6,0.7,0.5c4-1.3,6.9-5.1,6.9-9.5C22,6.7,17.5,2.2,12,2.2"/> ' +
                '</svg>'
        },
        multi: true
    }
];
