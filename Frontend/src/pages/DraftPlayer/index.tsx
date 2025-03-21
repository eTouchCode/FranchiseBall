import { useNavigate } from "react-router-dom";
import DraftPlayerPortal from "../../components/DraftPlayerPortal";
import { IoArrowBackOutline } from "react-icons/io5";

const DraftPlayer = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <button
        className="flex items-center gap-2 cursor-pointer px-3 hover:text-black hover:dark:text-white"
        onClick={() => {
          navigate("/");
        }}
      >
        <IoArrowBackOutline className="w-5 h-5" />
        <span className="text-lg font-medium">Back</span>
      </button>
      <DraftPlayerPortal />
    </div>
  );
};

export default DraftPlayer;
