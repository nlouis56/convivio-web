import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'events',
    loadComponent: () => import('./pages/events/event-list/event-list.component').then(m => m.EventListComponent)
  },
  {
    path: 'events/create',
    loadComponent: () => import('./pages/events/event-create/event-create.component').then(m => m.EventCreateComponent),
    canActivate: [authGuard],
    data: { role: 'EVENT_CREATOR' }
  },
  {
    path: 'events/:id',
    loadComponent: () => import('./pages/events/event-detail/event-detail.component').then(m => m.EventDetailComponent)
  },
  {
    path: 'events/:id/edit',
    loadComponent: () => import('./pages/events/event-edit/event-edit.component').then(m => m.EventEditComponent),
    canActivate: [authGuard],
    data: { role: 'EVENT_CREATOR' }
  },
  {
    path: 'places',
    loadComponent: () => import('./pages/places/place-list/place-list.component').then(m => m.PlaceListComponent)
  },
  {
    path: 'places/create',
    loadComponent: () => import('./pages/places/place-create/place-create.component').then(m => m.PlaceCreateComponent),
    canActivate: [authGuard],
    data: { role: 'EVENT_CREATOR' }
  },
  {
    path: 'places/:id',
    loadComponent: () => import('./pages/places/place-detail/place-detail.component').then(m => m.PlaceDetailComponent)
  },
  {
    path: 'places/:id/edit',
    loadComponent: () => import('./pages/places/place-edit/place-edit.component').then(m => m.PlaceEditComponent),
    canActivate: [authGuard],
    data: { role: 'EVENT_CREATOR' }
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./pages/error/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./pages/error/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
