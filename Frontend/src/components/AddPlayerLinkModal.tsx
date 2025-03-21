import { useState } from "react";
import { toast } from "sonner";
import { Modal } from "rizzui/modal";
import { Player, usePlayerStore } from "../store/player.store";
import Axios from "../config/axios";

const AddPlayerLinkModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [link, setLink] = useState<string>("");
  const { players, setPlayers } = usePlayerStore() as {
    players: Player[];
    setPlayers: (players: Player[]) => void;
  };

  const handleAddLink = async () => {
    if (link.length === 0) {
      toast.error("Input player link");
    } else if (
      players?.some(
        (player: Player) => player.isAdded === true && player.link === link
      )
    ) {
      toast.error("This user is already added");
    } else {
      const player = players.find((player: Player) => player.link === link);
      if (player) {
        setLoading(true);
        try {
          const res = await Axios.put(
            `${import.meta.env.VITE_API_URL}/player/change_added_status/${
              player._id
            }`,
            {
              isAdded: true,
            }
          );
          if (res.status === 200) {
            toast.success(res.data.message);
            setPlayers(res.data.players);
            onClose();
            setLink("");
          }
        } catch (err: any) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        toast.error("No matched player. Input another link.");
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      containerClassName="bg-white dark:bg-boxdark p-4 w-[450px]"
    >
      <span className="font-semibold text-black dark:text-white">
        Add Player Link
      </span>
      <input
        name="link"
        type="text"
        placeholder="Enter new player link"
        value={link}
        onChange={(e) => {
          setLink(e.target.value);
        }}
        className="w-full rounded-lg border border-stroke bg-transparent dark:bg-transparent py-1.5 px-3 mt-3 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
      />
      <div className="flex justify-end mt-3">
        <button
          disabled={loading}
          className="flex justify-center items-center gap-2 cursor-pointer disabled:cursor-not-allowed rounded-lg border border-primary bg-primary disabled:bg-bodydark dark:disabled:bg-steel-500/20 disabled:border-none w-22 h-10 text-white disabled:dark:text-slate-400 transition hover:bg-opacity-90 whitespace"
          onClick={handleAddLink}
        >
          <span>Add Link</span>
        </button>
      </div>
    </Modal>
  );
};

export default AddPlayerLinkModal;
