import { async } from '@angular/core/testing';
import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { take } from 'rxjs/operators';
import { ApolloLink } from 'apollo-link';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WebSocketLink } from '../../node_modules/apollo-link-ws';

const uri = 'http://localhost:8080/v1/graphql';
export function createApollo(httpLink: HttpLink): any {
  return {
    link: httpLink.create({ uri }),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
