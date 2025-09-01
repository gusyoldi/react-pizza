import { Link } from "react-router-dom";
import SearchOrder from "../features/order/SearchOrder";
import Username from "../features/user/Username";

const Header = () => {
  return (
    <header className="border-b border-stone-300 bg-yellow-500 px-4 py-3 uppercase">
      <Link className="tracking-widest" to="/">
        Fatz react Pizza Co.
      </Link>

      <SearchOrder />
      <Username />
    </header>
  );
};

export default Header;
