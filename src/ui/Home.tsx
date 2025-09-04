import CreateUser from '../features/user/CreateUser';

const Home = () => {
  return (
    <div className="my-10 px-4 text-center sm:my-16">
      <h1 className="mb-8 text-xl font-semibold text-stone-700 md:text-3xl">
        La mejor pizza.
        <br />
        <span className="text-yellow-500">Directo del horno, a tu mesa.</span>
      </h1>

      <CreateUser />
    </div>
  );
};

export default Home;
