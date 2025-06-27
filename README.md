# Node HTTP Helper
This project provides a helper class `HttpHelper` to interact with HTTP APIs.\
Instead of doing repeated work to implement the APIs individually, define them in api-definitions.ts and the APIs will be generated automatically with Typesafe.

## Setup

1. Ensure you have Node.js installed on your machine.
2. Navigate to the project directory:
   ```sh
   cd /Users/scott.tsao/source_code/node-http-helper
   ```
3. Install the necessary dependencies:
   ```sh
   npm install axios qs pino typescript
   ```

## Running the Demo

1. Compile the TypeScript files to JavaScript:
   ```sh
   npx tsc
   ```
2. Run the compiled `demo.js` file using Node.js:
   ```sh
   node dist/demo.js
   ```

## API Definitions

Please find the sample of the API definitions below:

```typescript
class GetUserResponseDto {
  id: number;
  name: string;
  email: string;
  username: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    }
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  }
}

class CreateUserReqDto {
  name: string;
  email: string;
  username: string;
}

class CreateUserResponseDto {
  id: number;
  name: string;
  email: string;
  username: string;
}

export const API_DEFINITIONS = {
  getUser: {
    method: 'get',
    url: `https://jsonplaceholder.typicode.com/users/{userId}`,
    request: undefined,
    response: new GetUserResponseDto(),
  },
  getUsers: {
    method: 'get',
    url: `https://jsonplaceholder.typicode.com/users`,
    request: undefined,
    response: [new GetUserResponseDto()],
  },
  createUser: {
    method: 'post',
    url: `https://jsonplaceholder.typicode.com/users`,
    request: new CreateUserReqDto(),
    response: new CreateUserResponseDto(),
  }
} as const;

```

## HttpHelper Class

The `HttpHelper` class is defined in `http-helper.ts` and provides methods to interact with the APIs defined in `api-definitions.ts`.

## Demo

The `demo.ts` file demonstrates how to use the `HttpHelper` class:

```typescript
import { HttpHelper } from './http-helper';

async function demo() {
  const httpService = new HttpHelper();

  try {
    const userId = 1;
    const user = await httpService.getUser({
      headers: { 'Content-Type': 'application/json' },
      pathParams: { userId: userId.toString() },
      loggerTag: ['user'],
    });
    console.log('User1:', user);

    const users = await httpService.getUsers({
      headers: { 'Content-Type': 'application/json' },
      loggerTag: ['users'],
    });
    console.log('Users:', users);

    const newUser = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      username: 'janedoe'
    };
    const createdUser = await httpService.createUser({
      headers: { 'Content-Type': 'application/json' },
      payload: newUser,
      loggerTag: ['createUser']
    });
    console.log('Created User:', createdUser);
  } catch (error) {
    console.error('Error:', error);
  }
}

demo();
```
