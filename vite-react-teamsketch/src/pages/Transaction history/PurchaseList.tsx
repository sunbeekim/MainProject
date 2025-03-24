import IList from "../../components/features/list/IList";


const PurchaseList = () => {

  return (
    <div className="flex flex-col p-4">

      <div className="flex flex-col gap-2 mt-8 w-full">
        <IList />
      </div>
    </div>
  );
}

export default PurchaseList;