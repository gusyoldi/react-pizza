import { useLoaderData } from 'react-router-dom';
import { PizzaType } from '../../types/pizza';
import MenuItem from './MenuItem';

function Menu() {
  const menu = useLoaderData() as PizzaType[];
  return (
    <>
      <h1>Menu</h1>

      <ul>
        {menu.map((pizza) => (
          <MenuItem key={pizza.id} pizza={pizza} />
        ))}
      </ul>
    </>
  );
}

export default Menu;
