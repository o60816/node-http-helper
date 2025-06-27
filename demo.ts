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
