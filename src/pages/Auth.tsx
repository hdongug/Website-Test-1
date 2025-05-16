import AuthComponent from '../components/Auth';

const Auth = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <AuthComponent />
      </div>
    </div>
  );
};

export default Auth;