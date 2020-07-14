import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();

  // let disFunc = () => 'console has been disabled in production mode';

  // console.log = disFunc
  // console.error = disFunc
  // console.warn = disFunc

  // Object.freeze(console);
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
