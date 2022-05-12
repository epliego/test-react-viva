import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { QuestionsComponent } from './Questions';

export const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  // console.log(user);

  return (
    isAuthenticated && (
      <div>
        <div>
          <img src={user.picture} alt={user.name} />
          <h2>{user.name}</h2>
          <p>Email: {user.email}</p>
        </div>
        <QuestionsComponent />
      </div>
    )
  );
};
