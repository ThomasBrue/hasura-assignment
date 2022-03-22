import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';

import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    GraphQLModule,
    HttpClientModule,
    ApolloModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [FormsModule, ReactiveFormsModule],
  providers: [
    ApolloModule,
    HttpLink,
    // {
    //   provide: APOLLO_OPTIONS,
    //   useFactory: (httpLink: HttpLink) => {
    //     return {
    //       cache: new InMemoryCache(),
    //       link: httpLink.create({
    //         uri: 'http://localhost:8081/v1/graphql',
    //       }),
    //     };
    //   },
    //   deps: [HttpLink],
    // },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

// import {HttpClientModule} from '@angular/common/http';

// import {HttpLink} from 'apollo-angular/http';
// import {InMemoryCache} from '@apollo/client/core';

// @NgModule({
//   imports: [BrowserModule, ApolloModule, HttpClientModule],
//   providers: [
//     {
//       provide: APOLLO_OPTIONS,
//       useFactory: (httpLink: HttpLink) => {
//         return {
//           cache: new InMemoryCache(),
//           link: httpLink.create({
//             uri: 'https://48p1r2roz4.sse.codesandbox.io',
//           }),
//         };
//       },
//       deps: [HttpLink],
//     },
//   ],
// })
// export class AppModule {}
