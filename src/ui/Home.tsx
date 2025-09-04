import CreateUser from '../features/user/CreateUser';
import { useAppSelector } from '../store/hooks';
import Button from './Button';

const Home = () => {
  const username = useAppSelector((state) => state.user.username);

  return (
    <div className="my-10 px-4 text-center sm:my-16">
      <h1 className="mb-8 text-xl font-semibold text-stone-700 md:text-3xl">
        La mejor pizza.
        <br />
        <span className="text-yellow-500">Recién hecha, directo a tu mesa</span>
      </h1>

      {username === '' ? (
        <CreateUser />
      ) : (
        <Button to="/menu" type="primary">
          Continúa con tu pedido, {username}
        </Button>
      )}
    </div>
  );
};

export default Home;
