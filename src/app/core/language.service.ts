import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface TranslationData {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<string>('en-US');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  public readonly availableLanguages: Language[] = [
    { code: 'en-US', name: 'English', flag: '🇺🇸' },
    { code: 'fr-FR', name: 'Français', flag: '🇫🇷' }
  ];

  private translations: { [locale: string]: TranslationData } = {
    'en-US': {
      'nav.home': 'Home',
      'nav.events': 'Events',
      'nav.places': 'Places',
      'nav.login': 'Login',
      'nav.register': 'Register',
      'nav.profile': 'Profile',
      'nav.logout': 'Logout',

      'error.not-found': 'Page not found',
      'error.not-found.description': 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
      'error.unauthorized': 'Access Denied',
      'error.unauthorized.description': 'You don\'t have permission to access this page. If you believe this is an error, please contact the administrator.',
      'error.404': '404',
      'error.403': '403',
      'info.loading': 'Loading...',
      'misc.details': 'Details',
      'misc.view-details': 'View Details',
      'misc.view-more': 'View More',
      'misc.no-data': 'No data available',
      'misc.view-all': 'View All',
      'misc.search': 'Search',
      'misc.filter': 'Filter',
      'misc.sort': 'Sort',
      'misc.clear-filters': 'Clear Filters',
      'misc.reviews': 'Reviews',
      'misc.start': 'Start',
      'misc.end': 'End',
      'misc.cancel': 'Cancel',
      'misc.save': 'Save',
      'misc.location': 'Location',
      'misc.return-to-home': 'Return to Home',

      'auth.login': 'Log In',
      'auth.register': 'Create an Account',
      'auth.username': 'Username',
      'auth.password': 'Password',
      'auth.email': 'Email',
      'auth.first-name': 'First Name',
      'auth.last-name': 'Last Name',
      'auth.logging-in': 'Logging in...',
      'auth.creating-account': 'Creating account...',
      'auth.invalid-credentials': 'Invalid username or password',
      'auth.login-error': 'An error occurred during login. Please try again.',
      'auth.register-error': 'An error occurred during registration. Please try again.',
      'auth.register-success': 'Registration successful!',
      'auth.already-have-account': 'Already have an account?',
      'auth.dont-have-account': 'Don\'t have an account?',
      'auth.sign-up': 'Sign up',
      'auth.log-in-link': 'Log in',
      'auth.to-continue': 'to continue',

      'validation.required': 'This field is required',
      'validation.email': 'Please enter a valid email address',
      'validation.min-length': 'Minimum length is {0} characters',
      'validation.password-min': 'Password must be at least 6 characters',
      'validation.username-required': 'Username is required',
      'validation.email-required': 'Email is required',
      'validation.password-required': 'Password is required',

      'profile.title': 'Your Profile',
      'profile.loading': 'Loading profile...',
      'profile.info': 'Profile Information',
      'profile.account-info': 'Account Information',
      'profile.user-id': 'User ID',
      'profile.roles': 'Roles',
      'profile.your-events': 'Your Events',
      'profile.created-events': 'Events You Created',
      'profile.save-changes': 'Save Changes',
      'profile.saving': 'Saving...',
      'profile.no-events': 'You haven\'t joined any events yet.',
      'profile.no-created-events': 'You haven\'t created any events yet.',
      'profile.browse-events': 'Browse events',
      'profile.create-event': 'Create an event',
      'profile.view-details': 'View details',
      'profile.edit': 'Edit',
      'profile.leave-event': 'Leave event',
      'profile.could-not-load': 'Could not load profile. Please try again later.',

      'home.welcome': 'Welcome to Convivio',
      'home.description': 'Discover events, places and connect with people who share your interests.',
      'footer.description': 'A social platform for events and places.',

      'events.description': 'Discover and join exciting events around you.',
      'events.all': 'All Events',
      'events.upcoming': 'Upcoming Events',
      'events.ongoing': 'Ongoing Events',
      'events.past': 'Past Events',
      'events.popular': 'Popular Events',
      'events.available': 'Available Events',
      'events.browse': 'Browse Events',
      'events.create': 'Create Event',
      'events.edit': 'Edit Event',
      'events.delete': 'Delete Event',
      'events.update': 'Update Event',
      'events.full': 'Full',
      'events.join': 'Join',
      'events.leave': 'Leave',
      'events.title': 'Event Title',
      'events.back-to': 'Back to Events',
      'events.max-participants': 'Maximum Participants',
      'events.dates-and-times': 'Dates and Times',
      'events.participants': 'Current participants',
      'events.description-field': 'Description',
      'events.no-image': 'No image',
      'events.loading-details': 'Loading event details...',
      'events.not-found': 'Event not found.',
      'events.back-to-events': 'Back to Events',
      'events.first-to-join': 'Be the first to join!',
      'events.date': 'Date',

      'places.place': 'Place',
      'places.description': 'Discover great locations around you',
      'places.all': 'All Places',
      'places.top-rated': 'Top Rated Places',
      'places.popular': 'Popular Places',
      'places.most-visited': 'Most Visited Places',
      'places.deactivated': 'Deactivated Places',
      'places.browse': 'Browse Places',
      'places.create': 'Create New Place',
      'places.edit': 'Edit Place',
      'places.update': 'Update Place',
      'places.delete': 'Delete Place',
      'places.address': 'Address',
      'places.category': 'Category',
      'places.average-rating': 'Average Rating',
      'places.photos': 'Photos',
      'places.view-on-gmaps': 'View on Google Maps',
      'places.back-to': 'Back to Places',
      'places.select': 'Select a Place',
      'places.name': 'Place Name',
      'places.description-field': 'Description',
      'places.no-image': 'No image',
      'places.not-rated': 'Not rated yet',
      'places.add-place': 'Add a Place',
      'places.no-places': 'No places found',
      'places.latitude': 'Latitude',
      'places.longitude': 'Longitude',
      'places.category-placeholder': 'What type of place is this? (restaurant, bar, park, etc.)',

      'form.fill-required': 'Please fill out all required fields correctly.',
      'form.valid': 'Form is valid!',
      'form.no-changes': 'No changes made yet.',
      'form.participants': 'participants'
    },
    'fr-FR': {
      'nav.home': 'Accueil',
      'nav.events': 'Événements',
      'nav.places': 'Lieux',
      'nav.login': 'Connexion',
      'nav.register': 'S\'inscrire',
      'nav.profile': 'Profil',
      'nav.logout': 'Déconnexion',

      'error.not-found': 'Page non trouvée',
      'error.not-found.description': 'La page que vous recherchez a pu être supprimée, renommée ou est temporairement indisponible.',
      'error.unauthorized': 'Accès refusé',
      'error.unauthorized.description': 'Vous n\'avez pas la permission d\'accéder à cette page. Si vous pensez qu\'il s\'agit d\'une erreur, contactez l\'administrateur.',
      'error.404': '404',
      'error.403': '403',
      'info.loading': 'Chargement...',
      'misc.details': 'Détails',
      'misc.view-details': 'Voir les détails',
      'misc.view-more': 'Voir plus',
      'misc.view-all': 'Voir tout',
      'misc.no-data': 'Aucune donnée disponible',
      'misc.search': 'Rechercher',
      'misc.filter': 'Filtrer',
      'misc.sort': 'Trier',
      'misc.clear-filters': 'Effacer les filtres',
      'misc.reviews': 'Avis',
      'misc.start': 'Début',
      'misc.end': 'Fin',
      'misc.cancel': 'Annuler',
      'misc.save': 'Enregistrer',
      'misc.location': 'Emplacement',
      'misc.return-to-home': 'Retour à l\'accueil',

      'auth.login': 'Se connecter',
      'auth.register': 'Créer un compte',
      'auth.username': 'Nom d\'utilisateur',
      'auth.password': 'Mot de passe',
      'auth.email': 'Email',
      'auth.first-name': 'Prénom',
      'auth.last-name': 'Nom',
      'auth.logging-in': 'Connexion...',
      'auth.creating-account': 'Création du compte...',
      'auth.invalid-credentials': 'Nom d\'utilisateur ou mot de passe invalide',
      'auth.login-error': 'Une erreur s\'est produite lors de la connexion. Veuillez réessayer.',
      'auth.register-error': 'Une erreur s\'est produite lors de l\'inscription. Veuillez réessayer.',
      'auth.register-success': 'Inscription réussie !',
      'auth.already-have-account': 'Vous avez déjà un compte ?',
      'auth.dont-have-account': 'Vous n\'avez pas de compte ?',
      'auth.sign-up': 'S\'inscrire',
      'auth.log-in-link': 'Se connecter',
      'auth.to-continue': 'pour continuer',

      'validation.required': 'Ce champ est requis',
      'validation.email': 'Veuillez entrer une adresse email valide',
      'validation.min-length': 'La longueur minimale est de {0} caractères',
      'validation.password-min': 'Le mot de passe doit contenir au moins 6 caractères',
      'validation.username-required': 'Le nom d\'utilisateur est requis',
      'validation.email-required': 'L\'email est requis',
      'validation.password-required': 'Le mot de passe est requis',

      'profile.title': 'Votre profil',
      'profile.loading': 'Chargement du profil...',
      'profile.info': 'Informations du profil',
      'profile.account-info': 'Informations du compte',
      'profile.user-id': 'ID utilisateur',
      'profile.roles': 'Rôles',
      'profile.your-events': 'Vos événements',
      'profile.created-events': 'Événements que vous avez créés',
      'profile.save-changes': 'Enregistrer les modifications',
      'profile.saving': 'Enregistrement...',
      'profile.no-events': 'Vous n\'avez participé à aucun événement pour le moment.',
      'profile.no-created-events': 'Vous n\'avez créé aucun événement pour le moment.',
      'profile.browse-events': 'Parcourir les événements',
      'profile.create-event': 'Créer un événement',
      'profile.view-details': 'Voir les détails',
      'profile.edit': 'Modifier',
      'profile.leave-event': 'Quitter l\'événement',
      'profile.could-not-load': 'Impossible de charger le profil. Veuillez réessayer plus tard.',

      'home.welcome': 'Bienvenue sur Convivio',
      'home.description': 'Découvrez des événements, des lieux et retrouvez des personnes partageant vos intérêts.',
      'footer.description': 'Une plateforme sociale pour découvrir événements et lieux.',

      'events.description': 'Découvrez et participez à des événements passionnants près de vous.',
      'events.all': 'Tous les événements',
      'events.upcoming': 'Événements à venir',
      'events.ongoing': 'Événements en cours',
      'events.past': 'Événements passés',
      'events.popular': 'Événements populaires',
      'events.available': 'Événements disponibles',
      'events.browse': 'Parcourir les événements',
      'events.full': 'Complet',
      'events.join': 'Rejoindre',
      'events.leave': 'Quitter',
      'events.title': 'Titre de l\'événement',
      'events.create': 'Créer un événement',
      'events.edit': 'Modifier l\'événement',
      'events.delete': 'Supprimer l\'événement',
      'events.update': 'Mettre à jour l\'événement',
      'events.back-to': 'Retour aux événements',
      'events.max-participants': 'Nombre maximum de participants',
      'events.dates-and-times': 'Dates et heures',
      'events.participants': 'Nombre de participants',
      'events.description-field': 'Description',
      'events.no-image': 'Aucune image',
      'events.loading-details': 'Chargement des détails de l\'événement...',
      'events.not-found': 'Événement non trouvé.',
      'events.back-to-events': 'Retour aux événements',
      'events.first-to-join': 'Soyez le premier à participer !',
      'events.date': 'Date',

      'places.place': 'Lieu',
      'places.description': 'Découvrez des lieux intéressants près de chez vous',
      'places.all': 'Tous les lieux',
      'places.top-rated': 'Mieux notés',
      'places.popular': 'Lieux populaires',
      'places.most-visited': 'Plus visités',
      'places.deactivated': 'Désactivés',
      'places.browse': 'Parcourir les lieux',
      'places.create': 'Créer un nouveau lieu',
      'places.edit': 'Modifier le lieu',
      'places.update': 'Mettre à jour le lieu',
      'places.delete': 'Supprimer le lieu',
      'places.address': 'Adresse',
      'places.category': 'Catégorie',
      'places.average-rating': 'Note moyenne',
      'places.photos': 'Photos',
      'places.view-on-gmaps': 'Voir sur Google Maps',
      'places.back-to': 'Retour aux lieux',
      'places.select': 'Sélectionner un lieu',
      'places.name': 'Nom du lieu',
      'places.description-field': 'Description',
      'places.no-image': 'Aucune image',
      'places.not-rated': 'Pas encore noté',
      'places.add-place': 'Ajouter un lieu',
      'places.no-places': 'Aucun lieu trouvé',
      'places.latitude': 'Latitude',
      'places.longitude': 'Longitude',
      'places.category-placeholder': 'Quel type de lieu est-ce ? (restaurant, bar, parc, etc.)',

      'form.fill-required': 'Veuillez remplir tous les champs requis correctement.',
      'form.valid': 'Le formulaire est valide !',
      'form.no-changes': 'Aucune modification effectuée pour le moment.',
      'form.participants': 'participants'
    }
  };

  constructor() {
    const savedLanguage = this.getSavedLanguage();
    this.currentLanguageSubject.next(savedLanguage);
  }

  getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  setLanguage(languageCode: string): void {
    if (this.availableLanguages.some(lang => lang.code === languageCode)) {
      localStorage.setItem('selectedLanguage', languageCode);
      this.currentLanguageSubject.next(languageCode);
    }
  }

  private getSavedLanguage(): string {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selectedLanguage');
      if (saved && this.availableLanguages.some(lang => lang.code === saved)) {
        return saved;
      }
    }
    return 'en-US';
  }

  getLanguageName(code: string): string {
    const language = this.availableLanguages.find(lang => lang.code === code);
    return language ? language.name : code;
  }

  getLanguageFlag(code: string): string {
    const language = this.availableLanguages.find(lang => lang.code === code);
    return language ? language.flag : '🌐';
  }

  translate(key: string): string {
    const currentLang = this.getCurrentLanguage();
    const translations = this.translations[currentLang];
    return translations && translations[key] ? translations[key] : key;
  }
}
