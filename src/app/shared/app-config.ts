/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { NavLinkItem } from './nav-link-item';

export interface AppConfig {
    appName: string;
    appVersion: string;
    releaseDateUtc: string;
    appDescription: string;
    baseUrl: string;
    navLinks: NavLinkItem[];
}
