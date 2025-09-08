import { useAppDispatch } from '../../store/hooks';
import Button from '../../ui/Button';
import { decreaseItemQuantity, increaseItemQuantity } from './cartSlice';

interface UpdateItemQuantityProps {
  itemId: number;
  currentQuantity: number;
}

const UpdateItemQuantity = ({
  itemId,
  currentQuantity,
}: UpdateItemQuantityProps) => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex items-center gap-2 md:gap-3">
      <Button
        onClick={() => dispatch(increaseItemQuantity(itemId))}
        type="round"
      >
        +
      </Button>
      <span className="text-sm font-medium">{currentQuantity}</span>
      <Button
        onClick={() => dispatch(decreaseItemQuantity(itemId))}
        type="round"
      >
        -
      </Button>
    </div>
  );
};

export default UpdateItemQuantity;
