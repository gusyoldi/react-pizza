import { useRouteError } from 'react-router-dom';
import LinkButton from './LinkButton';

const NotFound = () => {
  const error = useRouteError();

  // Type guard
  const errorMessage =
    error && typeof error === 'object' && 'message' in error
      ? (error as { message: string }).message
      : 'Error desconocido';

  return (
    <div>
      <h1>Algo salió mal 😢</h1>
      <p>{errorMessage}</p>
      <LinkButton to="-1">&larr; Volver</LinkButton>
    </div>
  );
};

export default NotFound;
