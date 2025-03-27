import { useEffect, useState } from "react";
import { Dropdown, Button } from "rizzui";
import { Player, usePlayerStore } from "../store/player.store";
import { FiChevronDown } from "react-icons/fi";
import { toast } from "sonner";
import Axios from "../config/axios";
import { Team, useTeamStore } from "../store/team.store";
import { useAuthStore } from "../store/auth.store";
import PriorityList from "./PriorityList";

const DraftPlayerPortal = () => {
  const { players } = usePlayerStore() as {
    players: Player[];
  };
  const { teams, setTeams, selectedTeam, setSelectedTeam } = useTeamStore() as {
    teams: Team[];
    setTeams: (teams: Team[]) => void;
    selectedTeam: Team | null;
    setSelectedTeam: (team: Team | null) => void;
  };

  const { user } = useAuthStore() as { user: any};
  const [loading, setLoading] = useState<boolean>(false);

  const setPlayerAsDraft = async (id: string) => {
    try {
      setLoading(true);
      const res = await Axios.put(
        `${import.meta.env.VITE_API_URL}/team/draft/${id}`,
        { isDrafted: true, teamId: selectedTeam?._id }
      );
      if (res.status === 200) {
        setLoading(false);
        toast.success(res.data.message);
        setTeams(res.data.teams);
      }
    } catch (err: any) {
      console.log(err);
      toast.error(err.response.data.message);
    }
  };

  const setPlayerAsUnDraft = async (id: string) => {
    try {
      setLoading(true);
      const res = await Axios.put(
        `${import.meta.env.VITE_API_URL}/team/draft/${id}`,
        { isDrafted: false, teamId: selectedTeam?._id }
      );
      if (res.status === 200) {
        setLoading(false);
        toast.success(res.data.message);
        setTeams(res.data.teams);
      }
    } catch (err: any) {
      console.log(err);
      toast.error(err.response.data.message);
    }
  };

  useEffect(() => {
    if (selectedTeam === null || selectedTeam === undefined) {
      setSelectedTeam(teams[0]);
    }
  }, [selectedTeam]);

  useEffect(() => {
    if (teams && (selectedTeam !== null || selectedTeam === undefined)) {
      setSelectedTeam(
        teams.find((team) => team._id === selectedTeam._id) || null
      );
    }
  }, [teams]);

  useEffect(() => {
    if (user?.team_name && teams.length > 0) {
      const matchingTeam = teams.find(team => team.name === user.team_name);

      if (matchingTeam) {
        setSelectedTeam(matchingTeam);
      }
    }
  }, [teams, user, PriorityList]);

  return (
    <div className="sm:flex gap-4 max-h-[calc(100vh-12rem)] mt-5">

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
            {players.map((player, index) => (
              <tr
                key={index}
                className={`bg-white dark:bg-boxdark whitespace-nowrap cursor-pointer ${
                  index === players.length - 1
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
                <td className="px-6 h-12">
                  {selectedTeam?.drafted_players &&
                  selectedTeam?.drafted_players.length > 0
                    ? "Yes"
                    : "No"}
                </td>
                <td className="px-6 h-12 flex justify-center items-center">
                  {selectedTeam?.drafted_players &&
                  selectedTeam?.drafted_players.length > 0 &&
                  !selectedTeam.drafted_players.includes(player._id) ? (
                    <></>
                  ) : (
                    <button
                      disabled={loading}
                      className="flex justify-center items-center gap-2 cursor-pointer disabled:cursor-not-allowed rounded-lg border border-primary bg-primary disabled:bg-bodydark dark:disabled:bg-steel-500/20 disabled:border-none px-3 h-9 text-white disabled:dark:text-slate-400 transition hover:bg-opacity-90 whitespace-nowrap"
                      onClick={() => {
                        if (
                          !selectedTeam?.drafted_players?.includes(player._id)
                        ) {
                          setPlayerAsDraft(player._id);
                        } else {
                          setPlayerAsUnDraft(player._id);
                        }
                      }}
                    >
                      {!selectedTeam?.drafted_players?.includes(player._id)
                        ? "Draft"
                        : "Undraft"}
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
