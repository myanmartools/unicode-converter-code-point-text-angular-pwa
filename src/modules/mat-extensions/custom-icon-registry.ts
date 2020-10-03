/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ErrorHandler, Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { MatIconRegistry } from '@angular/material/icon';

import { Observable, of } from 'rxjs';

export interface SvgIconInfo {
    name: string;
    svgSource: string;
    namespace?: string;
}

export const SVG_ICON = new InjectionToken<SvgIconInfo[]>('SVG_ICON');

interface SvgIconMap {
    [namespace: string]: {
        [iconName: string]: SVGElement;
    };
}

const DEFAULT_NS = '$$default';

/**
 * A custom replacement for Angular Material's `MdIconRegistry`, which allows
 * us to provide preloaded icon SVG sources.
 */
@Injectable({
    providedIn: 'root'
})
export class CustomIconRegistry extends MatIconRegistry {
    private cachedSvgElements: SvgIconMap = { [DEFAULT_NS]: {} };

    constructor(
        httpClient: HttpClient,
        sanitizer: DomSanitizer,
        errorHandler: ErrorHandler,
        @Inject(SVG_ICON) private readonly svgIcons: SvgIconInfo[],
        @Optional() @Inject(DOCUMENT) readonly document?: Document
    ) {
        super(httpClient, sanitizer, document, errorHandler);
    }

    getNamedSvgIcon(iconName: string, namespace?: string): Observable<SVGElement> {
        const nsIconMap = this.cachedSvgElements[namespace || DEFAULT_NS];
        let preloadedElement: SVGElement | undefined = nsIconMap && nsIconMap[iconName];
        if (!preloadedElement) {
            preloadedElement = this.loadSvgElement(iconName, namespace);
        }

        return preloadedElement
            ? of(preloadedElement.cloneNode(true) as SVGElement)
            : super.getNamedSvgIcon(iconName, namespace);
    }

    private loadSvgElement(iconName: string, namespace?: string): SVGElement | undefined {
        const svgIcon = this.svgIcons.find((icon) => {
            return namespace ? icon.name === iconName && icon.namespace === namespace : icon.name === iconName;
        });

        if (!svgIcon) {
            return undefined;
        }

        if (this.document || typeof document === 'object') {
            const ns = svgIcon.namespace || DEFAULT_NS;
            const nsIconMap = this.cachedSvgElements[ns] || (this.cachedSvgElements[ns] = {});

            // Creating a new `<div>` per icon is necessary for the SVGs to work correctly in IE11.
            const div = (this.document || document).createElement('DIV');

            // SECURITY: the source for the SVG icons is provided in code by trusted developers
            div.innerHTML = svgIcon.svgSource;

            const svgElement = div.querySelector('svg');
            nsIconMap[svgIcon.name] = svgElement;

            return svgElement;
        } else {
            throw new Error('CustomIconRegistry could not resolve document.');
        }
    }
}
