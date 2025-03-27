import { useNavigate } from "react-router-dom";
import DraftPlayerPortal from "../../components/DraftPlayerPortal";
import { IoArrowBackOutline } from "react-icons/io5";

const DraftPlayer = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <button
        className="z-50 w-fit flex items-center gap-2 cursor-pointer px-4 py-1.5 rounded-md text-white bg-primary hover:bg-primary/90"
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
