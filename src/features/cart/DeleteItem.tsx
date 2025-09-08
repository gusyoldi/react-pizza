import { useAppDispatch } from '../../store/hooks';
import Button from '../../ui/Button';
import { deleteItem } from './cartSlice';

const DeleteItem = ({ itemId }: { itemId: number }) => {
  const dispatch = useAppDispatch();
  return (
    <Button onClick={() => dispatch(deleteItem(itemId))} type="small">
      Borrar
    </Button>
  );
};

export default DeleteItem;
