/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import {
    analytics,
    auth,
    database,
    firestore,
    functions,
    installations,
    messaging,
    performance,
    remoteConfig,
    storage
} from 'firebase/app';

export type FirebaseAuth = auth.Auth;
export type FirebaseDatabase = database.Database;
export type FirebaseMessaging = messaging.Messaging;
export type FirebaseStorage = storage.Storage;
export type FirebaseFirestore = firestore.Firestore;
export type FirebaseFunctions = functions.Functions;
export type FirebaseInstallations = installations.Installations;
export type FirebasePerformance = performance.Performance;
export type FirebaseRemoteConfig = remoteConfig.RemoteConfig;
export type FirebaseAnalytics = analytics.Analytics;

export interface FirebaseApp {
    name: string;
    options: Object;

    auth(): FirebaseAuth;
    database(databaseURL?: string): FirebaseDatabase;
    // tslint:disable-next-line: no-any no-reserved-keywords
    delete(): Promise<any>;

    installations(): FirebaseInstallations;
    messaging(): FirebaseMessaging;
    storage(storageBucket?: string): FirebaseStorage;
    firestore(): FirebaseFirestore;
    functions(region?: string): FirebaseFunctions;
    performance(): FirebasePerformance;
    remoteConfig(): FirebaseRemoteConfig;
    analytics(): FirebaseAnalytics;
}
