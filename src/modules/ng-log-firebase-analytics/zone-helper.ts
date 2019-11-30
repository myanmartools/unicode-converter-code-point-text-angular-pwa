import { NgZone } from '@angular/core';

import { Observable } from 'rxjs';

export const runOutsideAngular = (zone: NgZone) => <T>(obs$: Observable<T>): Observable<T> => {
    return new Observable<T>(subscriber => {
        return zone.runOutsideAngular(() => {
            return obs$.subscribe(
                value => { zone.run(() => { subscriber.next(value); }); },
                error => { zone.run(() => { subscriber.error(error); }); },
                () => { zone.run(() => { subscriber.complete(); }); }
            );
        });
    });
};
