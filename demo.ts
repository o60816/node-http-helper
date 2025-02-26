import { HttpHelper } from './http-helper';

async function demo() {
  const httpService = new HttpHelper();

  try {
    // Example usage of getUserDetails API
    const userId = 1;
    const userDetails = await httpService.getUserDetails({
      headers: { 'Content-Type': 'application/json' },
      pathParams: { userId: userId.toString() },
      loggerTag: ['getUserDetails'],
    });
    console.log('User Details:', userDetails);

    // Example usage of createUser API
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
