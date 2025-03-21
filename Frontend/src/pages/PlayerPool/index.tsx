import { useNavigate } from "react-router-dom";
import PlayerTable from "../../components/PlayerTable";
import PriorityList from "../../components/PriorityList";
import { IoArrowBackOutline } from "react-icons/io5";

const PlayerPool = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3">
      <button
        className="flex items-center gap-2 cursor-pointer px-3 hover:text-black hover:dark:text-white"
        onClick={() => {
          navigate("/");
        }}
      >
        <IoArrowBackOutline className="w-5 h-5" />
        <span className="text-lg font-medium">Back</span>
      </button>
      <div className="grid grid-cols-10 gap-4 h-[calc(100vh-10rem)]">
        <div className="col-span-5 md:col-span-6 xl:col-span-7 overflow-x-auto">
          <PlayerTable />
        </div>
        <div className="col-span-5 md:col-span-4 xl:col-span-3">
          <PriorityList />
        </div>
      </div>
    </div>
  );
};

export default PlayerPool;
