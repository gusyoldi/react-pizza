import { useAppSelector } from '../../store/hooks';
import { getUsername } from './userSlice';

const Username = () => {
  const username = useAppSelector(getUsername);

  if (!username) return null;

  return (
    <div className="hidden text-sm font-semibold md:block">{username}</div>
  );
};

export default Username;
