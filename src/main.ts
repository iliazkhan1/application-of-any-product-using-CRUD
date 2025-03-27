import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ProductManagementComponent } from './app/product-management/product-management.component';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideHttpClient(),
    provideRouter([
      { path: 'products', component: ProductManagementComponent },
      { path: '', redirectTo: '/products', pathMatch: 'full' },
    ]),
  ],
}).catch((err) => console.error(err));