import React from 'react';
import { GoogleLogin } from 'react-google-login';

const GoogleSignInButton = ({ onSuccess, onFailure }) => {
  const responseGoogle = (response) => {
    console.log(response);
    // Handle successful login
    onSuccess(response);
  };

  const responseError = (error) => {
    console.error(error);
    // Handle login failure
    onFailure(error);
  };

  return (
    <GoogleLogin
      clientId="484011380831-p4d1tupugg26qs2jjqba0o5u9a0ul0n6.apps.googleusercontent.com"
      buttonText="Login with Google"
      onSuccess={responseGoogle}
      onFailure={responseError}
      cookiePolicy={'single_host_origin'}
    />
  );
};

export default GoogleSignInButton;
