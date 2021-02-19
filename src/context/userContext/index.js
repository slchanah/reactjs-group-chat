import { createContext } from 'react';

const UserContext = createContext({
  username: '',
  updateUsername: () => {},
});

export default UserContext;
