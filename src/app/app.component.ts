import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { Apollo } from 'apollo-angular';
// import * as Apollo from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

interface Task {
  uuid: string;
  title: string;
  description: string;
}

interface Response {
  tasks: Task[];
}

const GET_TASK = gql`
  query MyQuery {
    tasks {
      uuid
      title
    }
  }
`;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'hasura-tutorial';

  tasks$: Observable<Task[]> = <any>[];

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.tasks$ = this.apollo
      .watchQuery<Response>({
        query: GET_TASK,
      })
      .valueChanges.pipe(map((result) => result.data.tasks));
  }
}
