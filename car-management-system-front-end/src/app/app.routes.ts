import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: 'cars',
        loadComponent: () => import('./components/cars/car-list/car-list.component').then(m => m.CarListComponent)
    },
    {
        path: 'cars/add',
        loadComponent: () => import('./components/cars/car-form/car-form.component').then(m => m.CarFormComponent),
        canActivate: [authGuard]
    },
    {
        path: 'cars/edit/:id',
        loadComponent: () => import('./components/cars/car-form/car-form.component').then(m => m.CarFormComponent),
        canActivate: [authGuard]
    },
    {
        path: 'cars/:id',
        loadComponent: () => import('./components/cars/car-detail/car-detail.component').then(m => m.CarDetailComponent)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path: 'my-rentals',
        loadComponent: () => import('./components/rentals/my-rentals/my-rentals.component').then(m => m.MyRentalsComponent),
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
