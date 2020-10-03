/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

async function _renderUniversal() {
    const routes = ['/', '/about', '/support', '/privacy'];

    const serverBundlePath = './app/server/main';
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { AppServerModule, AppServerModuleNgFactory, renderModule, renderModuleFactory } = await import(
        serverBundlePath
    );

    let renderModuleFn: (module: unknown, options: unknown) => Promise<string>;
    let AppServerModuleDef: unknown;

    if (renderModuleFactory && AppServerModuleNgFactory) {
        // Happens when in ViewEngine mode.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        renderModuleFn = renderModuleFactory;
        AppServerModuleDef = AppServerModuleNgFactory;
    } else if (renderModule && AppServerModule) {
        // Happens when in Ivy mode.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        renderModuleFn = renderModule;
        AppServerModuleDef = AppServerModule;
    } else {
        throw new Error(`renderModule method and/or AppServerModule were not exported from: './server/main'.`);
    }

    const browserOutputPath = join(__dirname, 'app/browser');
    const browserIndexOutputPath = join(browserOutputPath, 'index.html');

    const indexHtml = readFileSync(browserIndexOutputPath, 'utf8');

    for (const route of routes) {
        const renderOpts = {
            document: indexHtml,
            url: route
        };

        const html = await renderModuleFn(AppServerModuleDef, renderOpts);

        const outputFolderPath = join(browserOutputPath, route);
        const outputIndexPath = join(outputFolderPath, 'index.html');

        // This case happens when we are prerendering "/".
        if (browserIndexOutputPath === outputIndexPath) {
            const browserIndexOutputPathOriginal = join(browserOutputPath, 'index.original.html');
            writeFileSync(browserIndexOutputPathOriginal, indexHtml);
        }

        // Make sure the directory structure is there
        mkdirSync(outputFolderPath, { recursive: true });

        writeFileSync(outputIndexPath, html);
    }
}

void _renderUniversal();
