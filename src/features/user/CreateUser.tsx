import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import Button from '../../ui/Button';
import { updateName } from './userSlice';

const CreateUser = () => {
  const [username, setUsername] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username) return;

    dispatch(updateName(username));
    navigate('/menu');
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="mb-4 text-sm text-stone-600 md:text-base">
        👋 Bienvenido! Por favor introduce tu nombre:
      </p>

      <input
        className="input mb-8 w-72"
        type="text"
        placeholder="Nombre completo"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      {username !== '' && (
        <div>
          <Button type="primary">Hacer pedido</Button>
        </div>
      )}
    </form>
  );
};

export default CreateUser;
