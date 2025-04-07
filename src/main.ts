import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideApollo } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { HttpLink } from 'apollo-angular/http';
import { inject } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideApollo(() => {
      const httpLink = inject(HttpLink); 
      return {
        link: httpLink.create({
          uri: 'https://one01462077-comp3133-assignment2-frontend.onrender.com/graphql', 
        }),
        cache: new InMemoryCache(), 
      };
    }),
    provideHttpClient(),
    provideRouter(routes),
  ],
}).catch((err) => console.error(err));
