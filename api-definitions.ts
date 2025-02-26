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
  getUserDetails: {
    method: 'get' as const,
    url: `https://jsonplaceholder.typicode.com/users/{userId}` as const,
    request: undefined,
    response: new GetUserResponseDto(),
  },
  createUser: {
    method: 'post' as const,
    url: `https://jsonplaceholder.typicode.com/users` as const,
    request: new CreateUserReqDto(),
    response: new CreateUserResponseDto(),
  }
};
