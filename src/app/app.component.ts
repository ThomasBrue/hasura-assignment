import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

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

interface Response {
  payments: Payment[];
}

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

const ADD_PAYMENT = gql`
  mutation insertPayment($name: String, $amount: Int) {
    insert_PaymentTable_one(object: { name: $name, amount: $amount }) {
      name
    }
  }
`;

const SUBSCRIBE_PAYMENT = gql`
  subscription get_payments {
    PaymentTable {
      name
      amount
    }
  }
`;

interface User {
  id: number;
  user: {
    name: string;
  };
}
interface GetOnlineUsersSub {
  online_users: User[];
}

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

  loading = true;
  constructor(private apollo: Apollo, private fb: FormBuilder) {}

  paymentsArray = [];

  ngOnInit() {
    this.apollo
      .subscribe<Payment>({
        query: SUBSCRIBE_PAYMENT,
      })
      .subscribe(
        ({ data, errors }) => {
          console.log('DATA::: ', data);
          console.log('Error::: ', errors);
          console.log('got data ', data);
        },
        (error) => {
          console.log('there was an error sending the query', error);
        }
      );

    this.form = this.fb.group({
      name: new FormControl(),
      amount: new FormControl(),
    });

    this.queryRef = this.apollo.watchQuery<Response>({
      query: GET_PAYMENT,
    });

    this.payments$ = this.queryRef.valueChanges.pipe(
      map((result) => {
        return result.data['PaymentTable'];
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
}
