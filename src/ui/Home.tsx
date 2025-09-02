import CreateUser from "../features/user/CreateUser";

function Home() {
  return (
    <div className="my-10 text-center">
      <h1 className="mb-8 text-xl font-semibold text-stone-700">
        La mejor pizza.
        <br />
        <span className="text-yellow-500">Directo del horno, a tu mesa.</span>
      </h1>

      <CreateUser />
    </div>
  );
}

export default Home;
