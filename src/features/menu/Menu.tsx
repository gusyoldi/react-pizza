import { useLoaderData } from 'react-router-dom';
import { MenuType } from '../../types/menu';
import MenuItem from './MenuItem';

function Menu() {
  const menu = useLoaderData() as MenuType[];
  return (
    <div className="px-2">
      <h1 className="mt-7 text-xl font-semibold">Menu</h1>

      <ul className="mt-4 divide-y divide-stone-200">
        {menu.map((pizza) => (
          <MenuItem key={pizza.id} pizza={pizza} />
        ))}
      </ul>
    </div>
  );
}

export default Menu;
