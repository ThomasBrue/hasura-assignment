import { async } from '@angular/core/testing';
import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
// import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { take } from 'rxjs/operators';
import { ApolloLink } from 'apollo-link';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const uri = 'http://localhost:8081/v1/graphql'; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink): any {
  return {
    link: httpLink.create({ uri }),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  // imports: [FormsModule, ReactiveFormsModule],
  // exports: [FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
