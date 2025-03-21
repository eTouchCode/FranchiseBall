import { useEffect, useState } from "react";
import { Dropdown, Button } from "rizzui";
import { Player, usePlayerStore } from "../store/player.store";
import { FiChevronDown } from "react-icons/fi";
import { toast } from "sonner";
import Axios from "../config/axios";

const DraftPlayerPortal = () => {
  const { players, setPlayers } = usePlayerStore() as {
    players: Player[];
    setPlayers: (players: Player[]) => void;
  };
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const [positions, setPositions] = useState<string[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [isExistsDraftedPlayer, setIsExistsDraftedPlayer] =
    useState<boolean>(false);

  const setPlayerAsDraft = async (id: string) => {
    try {
      setLoading(true);
      const res = await Axios.put(
        `${import.meta.env.VITE_API_URL}/player/draft/${id}`,
        { isDrafted: true }
      );
      if (res.status === 200) {
        setLoading(false);
        toast.success(res.data.message);
        setPlayers(res.data.players);
        setFilteredPlayers(
          res.data.players.filter(
            (player: Player) => player.position === selectedPosition
          )
        );
        setIsExistsDraftedPlayer(true);
      }
    } catch (err: any) {
      toast.error(err.response.data.message);
    }
  };

  const setPlayerAsUnDraft = async (id: string) => {
    try {
      setLoading(true);
      const res = await Axios.put(
        `${import.meta.env.VITE_API_URL}/player/draft/${id}`,
        { isDrafted: false }
      );
      if (res.status === 200) {
        setLoading(false);
        toast.success(res.data.message);
        setPlayers(res.data.players);
        setFilteredPlayers(
          res.data.players.filter(
            (player: Player) => player.position === selectedPosition
          )
        );
        setIsExistsDraftedPlayer(false);
      }
    } catch (err: any) {
      toast.error(err.response.data.message);
    }
  };

  useEffect(() => {
    const uniquePositions = Array.from(
      new Set(players.map((player) => player.position))
    );
    setPositions(uniquePositions);
    setSelectedPosition(uniquePositions[0]);
    const filteredPlayers = players.filter(
      (player: Player) => player.position === uniquePositions[0]
    );
    const isExists = filteredPlayers.some((player) => player?.isDrafted);
    setIsExistsDraftedPlayer(isExists);
    setFilteredPlayers(filteredPlayers);
  }, []);

  return (
    <div className="sm:flex gap-4 max-h-[calc(100vh-12rem)] mt-5">
      <div className="min-w-[200px] mb-2 sm:mb-0">
        <Dropdown as="button" className="w-full">
          <Dropdown.Trigger className="w-full">
            <Button
              variant="outline"
              className="w-full flex justify-between border border-stroke hover:border-primary dark:border-strokedark dark:hover:border-primary"
            >
              {selectedPosition} <FiChevronDown className="ml-2 w-5" />
            </Button>
          </Dropdown.Trigger>
          <Dropdown.Menu className="border border-stroke dark:border-strokedark drop-shadow-none">
            {positions.map((position, index) => (
              <Dropdown.Item
                key={index}
                className="hover:bg-stroke dark:hover:bg-strokedark"
                onClick={() => {
                  setSelectedPosition(position);
                  const filteredPlayers = players.filter(
                    (player: Player) => player.position === position
                  );
                  setFilteredPlayers(filteredPlayers);
                  const isExists = filteredPlayers.some(
                    (player) => player?.isDrafted
                  );
                  setIsExistsDraftedPlayer(isExists);
                }}
              >
                {position}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="w-full max-h-full overflow-auto border border-stroke shadow-default dark:border-strokedark">
        <table className="min-w-full autoborder border-stroke dark:border-strokedark">
          <thead>
            <tr className="bg-gray dark:bg-boxdark border-b border-stroke dark:border-b-strokedark">
              <th className="px-6 py-4 text-left text-black dark:text-white">
                Name
              </th>
              <th className="px-6 py-4 text-left text-black dark:text-white">
                Position
              </th>
              <th className="px-6 py-4 text-left text-black dark:text-white">
                Age
              </th>
              <th className="px-6 py-4 text-left text-black dark:text-white">
                Power
              </th>
              <th className="px-6 py-4 text-left text-black dark:text-white">
                Contact
              </th>
              <th className="px-6 py-4 text-left text-black dark:text-white">
                Speed
              </th>
              <th className="px-6 py-4 text-left text-black dark:text-white">
                Defense
              </th>
              <th className="px-6 py-4 text-left text-black dark:text-white">
                Control
              </th>
              <th className="px-6 py-4 text-left text-black dark:text-white">
                Movement
              </th>
              <th className="px-6 py-4 text-left text-black dark:text-white">
                Velocity
              </th>
              <th className="px-6 py-4 text-left text-black dark:text-white">
                Stamina
              </th>
              <th className="px-6 py-4 text-left text-black dark:text-white">
                Draft
              </th>
              <th className="px-6 py-4 text-left text-black dark:text-white"></th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.map((player, index) => (
              <tr
                key={index}
                className={`bg-white dark:bg-boxdark whitespace-nowrap cursor-pointer ${
                  index === filteredPlayers.length - 1
                    ? ""
                    : "border-b border-b-stroke dark:border-b-strokedark"
                }`}
              >
                <td className="px-6 h-12">{player.name}</td>
                <td className="px-6 h-12">{player.position}</td>
                <td className="px-6 h-12">{player.age}</td>
                <td className="px-6 h-12">{player.power}</td>
                <td className="px-6 h-12">{player.contact}</td>
                <td className="px-6 h-12">{player.speed}</td>
                <td className="px-6 h-12">{player.defense}</td>
                <td className="px-6 h-12">{player.control}</td>
                <td className="px-6 h-12">{player.movement}</td>
                <td className="px-6 h-12">{player.velocity}</td>
                <td className="px-6 h-12">{player.stamina}</td>
                <td className="px-6 h-12">{player.isDrafted ? "Yes" : "No"}</td>
                <td className="px-6 h-12 flex justify-center items-center">
                  {isExistsDraftedPlayer && !player?.isDrafted ? (
                    <></>
                  ) : (
                    <button
                      disabled={loading}
                      className="flex justify-center items-center gap-2 cursor-pointer disabled:cursor-not-allowed rounded-lg border border-primary bg-primary disabled:bg-bodydark dark:disabled:bg-steel-500/20 disabled:border-none px-3 h-9 text-white disabled:dark:text-slate-400 transition hover:bg-opacity-90 whitespace-nowrap"
                      onClick={() => {
                        if (player?.isDrafted) {
                          setPlayerAsUnDraft(player._id);
                        } else {
                          setPlayerAsDraft(player._id);
                        }
                      }}
                    >
                      {player?.isDrafted ? "Undraft" : "Draft"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DraftPlayerPortal;
