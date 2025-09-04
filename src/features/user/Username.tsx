import { useAppSelector } from '../../store/hooks';

const Username = () => {
  const username = useAppSelector((state) => state.user.username);

  if (!username) return null;

  return (
    <div className="hidden text-sm font-semibold md:block">{username}</div>
  );
};

export default Username;
