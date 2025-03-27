import { useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import ViewDraftPortal from "../../components/ViewDraftPortal";

const ViewDraft = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col">
       <button
        className="m-4 md:m-6 z-50 w-fit flex items-center gap-2 cursor-pointer px-4 py-1.5 rounded-md text-white bg-primary hover:bg-primary/90"
        onClick={() => {
          navigate("/");
        }}
      >
        <IoArrowBackOutline className="w-5 h-5" />
        <span className="text-lg font-medium">Back</span>
      </button>
      <ViewDraftPortal/>
    </div>
  );
};

export default ViewDraft;
