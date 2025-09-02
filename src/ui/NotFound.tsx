import { useNavigate, useRouteError } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();
  const error = useRouteError();

  // Type guard
  const errorMessage =
    error && typeof error === 'object' && 'message' in error
      ? (error as { message: string }).message
      : 'Unknown error';

  return (
    <div>
      <h1>Algo salió mal 😢</h1>
      <p>{errorMessage}</p>
      <button onClick={() => navigate(-1)}>&larr; Go back</button>
    </div>
  );
}

export default NotFound;
