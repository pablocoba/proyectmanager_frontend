
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import Noir from '../noirpreset';
import { provideHttpClient } from '@angular/common/http';


export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(),
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: Noir
            }
        })
    ]
};


