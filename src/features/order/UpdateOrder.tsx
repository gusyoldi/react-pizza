import { useFetcher } from 'react-router-dom';
import Button from '../../ui/Button';

const UpdateOrder = () => {
  const fetcher = useFetcher();
  return (
    <fetcher.Form method="PATCH" className="text-right">
      <Button type="primary">Dar prioridad</Button>
    </fetcher.Form>
  );
};

export default UpdateOrder;
