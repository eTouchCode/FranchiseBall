import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Dropdown } from "rizzui";
import { RiSave3Fill } from "react-icons/ri";
import { FiChevronDown } from "react-icons/fi";
import { IoPrintOutline } from "react-icons/io5";
import * as XLSX from "xlsx";

import { Player, PriorityLists, usePlayerStore } from "../store/player.store";
import { Team, useTeamStore } from "../store/team.store";
import Axios from "../config/axios";

const PriorityList = () => {
  const {
    selectedPlayer,
    setSelectedPlayer,
    priorityLists: priorityPlayerLists,
    setPriorityLists: setPriorityPlayerLists,
  } = usePlayerStore() as {
    selectedPlayer: Player;
    setSelectedPlayer: (player: Player | null) => void;
    priorityLists: PriorityLists;
    setPriorityLists: (priorityLists: PriorityLists) => void;
  };

  const { teams } = useTeamStore() as {
    teams: Team[];
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [position, setPosition] = useState<number | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [priorityLists, setPriorityLists] = useState(priorityPlayerLists);

  const addPlayerToList = () => {
    if (!selectedPlayer || position === null) return;

    if (
      selectedTeam &&
      priorityLists[selectedTeam._id] &&
      priorityLists[selectedTeam._id].length >= 22
    ) {
      toast.error("You can only add up to 22 players.");
      return;
    }

    if (selectedTeam) {
      const updatedPriorityLists = { ...priorityLists };
      if (!updatedPriorityLists[selectedTeam._id]) {
        updatedPriorityLists[selectedTeam._id] = [];
      }
      updatedPriorityLists[selectedTeam._id].splice(
        position - 1,
        0,
        selectedPlayer
      );
      setPriorityLists(updatedPriorityLists);
      setPosition(null);
      setSelectedPlayer(null);
    }
  };

  const removePlayerFromList = (index: number) => {
    if (selectedTeam) {
      const updatedPriorityLists = { ...priorityLists };
      if (!updatedPriorityLists[selectedTeam._id]) {
        updatedPriorityLists[selectedTeam._id] = [];
      }
      updatedPriorityLists[selectedTeam._id].splice(index, 1);
      setPriorityLists(updatedPriorityLists);
    }
  };

  const handleSelectRow = (index: number) => {
    const newSelectedRows = new Set(selectedRows);

    if (newSelectedRows.has(index)) {
      newSelectedRows.delete(index);
    } else {
      newSelectedRows.add(index);
    }

    setSelectedRows(newSelectedRows);

    if (newSelectedRows.size === 2 && selectedTeam) {
      const selectedIndices = Array.from(newSelectedRows);
      const updatedPriorityLists = { ...priorityLists };
      const [firstIndex, secondIndex] = selectedIndices;

      const temp = updatedPriorityLists[selectedTeam._id][firstIndex];
      updatedPriorityLists[selectedTeam._id][firstIndex] =
        updatedPriorityLists[selectedTeam._id][secondIndex];
      updatedPriorityLists[selectedTeam._id][secondIndex] = temp;

      setPriorityLists(updatedPriorityLists);
      setSelectedRows(new Set());

      toast.success(
        `Players at positions ${firstIndex + 1} and ${
          secondIndex + 1
        } have been swapped.`
      );
    }
  };

  const handleSavePriorityList = async () => {
    try {
      setLoading(true);
      const res = await Axios.post(
        `${import.meta.env.VITE_API_URL}/priority_list`,
        {
          priorityLists: priorityLists,
        }
      );
      if (res.status === 200) {
        toast.success(res.data.message);
        setPriorityPlayerLists(res.data.priorityLists);
      }
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const finalizePriorityList = () => {
    if (
      selectedTeam &&
      (priorityLists[selectedTeam._id]?.length === 0 ||
        priorityLists[selectedTeam._id]?.length === undefined)
    ) {
      toast.error("No players in the priority list.");
      return;
    }

    if (selectedTeam) {
      const playerData = priorityLists[selectedTeam._id].map(
        (player, index) => ({
          Round: index + 1,
          Link: player.link,
          Name: player.name,
          Position: player.position,
          Age: player.age,
          Power: player.power,
          Contact: player.contact,
          Speed: player.speed,
          Defense: player.defense,
          Control: player.control,
          Movement: player.movement,
          Velocity: player.velocity,
          Stamina: player.stamina,
        })
      );

      const ws = XLSX.utils.json_to_sheet(playerData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Priority List");
      XLSX.writeFile(wb, "priority_list.xlsx");
    }
  };

  useEffect(() => {
    setSelectedPlayer(null);
  }, []);

  return (
    <div className="min-h-full max-h-[calc(100vh-8rem)] overflow-y-auto p-4 bg-transparent border border-stroke dark:bg-boxdark dark:border-strokedark">
      <div className="flex justify-between items-center gap-4">
        <span className="text-2xl text-black dark:text-white font-medium">
          Priority List
        </span>
        <div className="flex gap-2">
          <button
            disabled={loading}
            className="flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed border border-primary bg-primary px-4 py-1.5 text-white transition hover:bg-opacity-90 whitespace-nowrap disabled:bg-bodydark dark:disabled:bg-steel-500/20 disabled:border-none disabled:dark:text-slate-400"
            onClick={handleSavePriorityList}
          >
            <RiSave3Fill />
            Save
          </button>
          <button
            className="flex items-center gap-2 cursor-pointer border border-primary bg-primary px-4 py-1.5 text-white transition hover:bg-opacity-90 whitespace-nowrap"
            onClick={finalizePriorityList}
          >
            <IoPrintOutline />
            Finalize
          </button>
        </div>
      </div>
      <Dropdown as="button" className="w-full mt-4">
        <Dropdown.Trigger className="w-full">
          <Button
            variant="outline"
            className="w-full flex justify-between border text-lg font-normal border-stroke hover:border-primary dark:border-strokedark dark:hover:border-primary"
          >
            {selectedTeam === null ? "Select Team" : selectedTeam.name}
            <FiChevronDown className="ml-2 w-5" />
          </Button>
        </Dropdown.Trigger>
        <Dropdown.Menu className="w-56 border border-stroke dark:border-strokedark drop-shadow-none bg-white dark:text-gray">
          {teams.map((team, index) => (
            <Dropdown.Item
              key={index}
              className="hover:bg-stroke dark:hover:bg-strokedark"
              onClick={() => setSelectedTeam(team)}
            >
              {team.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      {selectedTeam && selectedPlayer && (
        <div className="mt-4">
          <span className="text-lg px-2">
            Selected Player: {selectedPlayer?.name}
          </span>
          <div className="flex items-center mt-4 gap-2">
            <input
              type="number"
              min={1}
              max={22}
              value={position || ""}
              onChange={(e) => setPosition(Number(e.target.value))}
              placeholder="Select Position (1-22)"
              className="w-full px-4 py-1.5 rounded-md border border-stroke bg-transparent outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            <button
              disabled={priorityLists[selectedTeam._id]?.includes(
                selectedPlayer
              )}
              className="cursor-pointer disabled:cursor-not-allowed rounded-lg border disabled:border-none border-primary bg-primary disabled:bg-bodydark dark:disabled:bg-steel-500/20 px-4 py-1.5 text-white disabled:dark:text-slate-400 transition hover:bg-opacity-90 whitespace-nowrap"
              onClick={addPlayerToList}
            >
              Add to Priority List
            </button>
          </div>
        </div>
      )}
      {selectedTeam && (
        <table className="min-w-full table-auto bg-white dark:bg-bodydark border border-stroke dark:border-strokedark rounded-md mt-4">
          <thead className="bg-gray dark:bg-boxdark">
            <tr className="bg-gray-200 dark:bg-boxdark">
              <th />
              <th className="px-6 py-3 text-left text-black dark:text-white">
                Round
              </th>
              <th className="px-6 py-3 text-left text-black dark:text-white">
                Player Name
              </th>
              <th className="px-6 py-3 text-left text-black dark:text-white"></th>
            </tr>
          </thead>
          <tbody>
            {priorityLists[selectedTeam._id]?.length > 0 ? (
              priorityLists[selectedTeam._id]?.map((player, index) => (
                <tr
                  key={index}
                  className={`bg-white dark:bg-boxdark whitespace-nowrap cursor-pointer hover:bg-stroke dark:hover:bg-strokedark border-t border-t-stroke dark:border-t-strokedark`}
                  onClick={() => {
                    handleSelectRow(index);
                  }}
                >
                  <td className="px-6 py-2">
                    <input type="checkbox" checked={selectedRows.has(index)} />
                  </td>
                  <td className="px-6 py-2">{index + 1}</td>
                  <td className="px-6 py-2">{player.name}</td>
                  <td className="px-6 py-1">
                    <button
                      className="flex justify-center items-center gap-2 cursor-pointer disabled:cursor-not-allowed rounded-lg border border-primary bg-primary disabled:bg-bodydark dark:disabled:bg-steel-500/20 disabled:border-none w-20 h-9 text-white disabled:dark:text-slate-400 transition hover:bg-opacity-90"
                      onClick={() => removePlayerFromList(index)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-white dark:bg-boxdark border-t border-t-stroke dark:border-t-strokedark">
                <td colSpan={4} className="text-center py-2 text-lg">
                  No priority list
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PriorityList;
