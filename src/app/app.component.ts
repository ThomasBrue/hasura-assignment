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

interface Payment {
  uuid: string;
  name: string;
  amount: number;
  status: boolean;
}

// interface Response {
//   tasks: Task[];
// }

interface Response {
  payments: Payment[];
}

const GET_TASK = gql`
  query MyQuery {
    tasks {
      uuid
      title
    }
  }
`;

const GET_PAYMENT = gql`
  query MyQuery {
    PaymentTable {
      amount
      name
      status
      uuid
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

const ADD_PAYMENT = gql`
  mutation insertPayment($name: String, $amount: Int) {
    insert_PaymentTable_one(object: { name: $name, amount: $amount }) {
      name
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
  payments$: Observable<Payment[]> = <any>[];
  form: FormGroup;
  queryRef: QueryRef<Response>;

  constructor(private apollo: Apollo, private fb: FormBuilder) {}

  ngOnInit() {
    /*     this.form = this.fb.group({
      title: new FormControl('', Validators.required),
    });

    this.queryRef = this.apollo.watchQuery<Response>({
      query: GET_TASK,
    });

    this.tasks$ = this.queryRef.valueChanges.pipe(
      map((result) => result.data.tasks)
    ); */

    this.form = this.fb.group({
      name: new FormControl(),
      amount: new FormControl(),
    });

    this.queryRef = this.apollo.watchQuery<Response>({
      query: GET_PAYMENT,
    });

    this.payments$ = this.queryRef.valueChanges.pipe(
      map((result) => {
        // console.log(result.data['PaymentTable']);
        return result.data['PaymentTable'];

        // return result.data.payments
      })
    );
  }

  onAddPayment() {
    this.apollo
      .mutate({
        mutation: ADD_PAYMENT,
        variables: this.form.value,
      })
      .subscribe(({ data }) => {
        this.queryRef.refetch();
        console.log('AppComponent -> onAddPayment -> data', data);
      });
  }

  /*   onAddTask() {
    this.apollo
      .mutate({
        mutation: ADD_TASK,
        variables: this.form.value,
      })
      .subscribe(({ data }) => {
        this.queryRef.refetch();
        console.log('AppComponent -> onAddTask -> data', data);
      });
  } */
}
