import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { Apollo, QueryRef } from 'apollo-angular';
// import * as Apollo from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

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

const ADD_TASK = gql`
  mutation AddTask($title: String!) {
    insert_tasks(objects: { title: $title }) {
      returning {
        title
        uuid
      }
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
  form: FormGroup;
  queryRef: QueryRef<Response>;

  constructor(private apollo: Apollo, private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      title: new FormControl('', Validators.required),
    });

    this.queryRef = this.apollo.watchQuery<Response>({
      query: GET_TASK,
    });

    this.tasks$ = this.queryRef.valueChanges.pipe(
      map((result) => result.data.tasks)
    );
  }

  onAddTask() {
    this.apollo
      .mutate({
        mutation: ADD_TASK,
        variables: this.form.value,
      })
      .subscribe(({ data }) => {
        this.queryRef.refetch();
        console.log('AppComponent -> onAddTask -> data', data);
      });
  }
}
