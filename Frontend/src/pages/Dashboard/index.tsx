import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { FiMinus } from "react-icons/fi";

import Axios from "../../config/axios";
import {
  Player,
  PriorityLists,
  usePlayerStore,
} from "../../store/player.store";
import { Team, useTeamStore } from "../../store/team.store";
import AddPlayerLinkModal from "../../components/AddPlayerLinkModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    loading: playerLoading,
    players,
    setLoading: setPlayerLoading,
    setPlayers,
    setPriorityLists,
  } = usePlayerStore() as {
    loading: boolean;
    players: Player[];
    selectedPlayer: Player;
    setLoading: (state: boolean) => void;
    setPlayers: (players: Player[]) => void;
    setPriorityLists: (priorityLists: PriorityLists) => void;
  };
  const {
    loading: teamLoading,
    setLoading: setTeamLoading,
    setTeams,
    setLotteryTeams,
  } = useTeamStore() as {
    loading: boolean;
    setLoading: (state: boolean) => void;
    setTeams: (teams: Team[]) => void;
    setLotteryTeams: (teams: Team[] | null) => void;
  };
  const [isOpenAddPlayerLinkModal, setIsOpenAddPlayerLinkModal] =
    useState<boolean>(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const handleRemove = async (player: Player) => {
    try {
      const res = await Axios.put(
        `${import.meta.env.VITE_API_URL}/player/change_added_status/${
          player._id
        }`,
        {
          isAdded: false,
        }
      );
      if (res.status === 200) {
        toast.success(res.data.message);
        setPlayers(res.data.players);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setPlayerLoading(true);
        const [playerRes, priorityListRes] = await Promise.all([
          Axios.get(`${import.meta.env.VITE_API_URL}/player`),
          Axios.get(`${import.meta.env.VITE_API_URL}/priority_list`),
        ]);
        if (playerRes.status === 200) {
          setPlayers(playerRes.data);
        }

        if (priorityListRes.status === 200) {
          setPriorityLists(priorityListRes.data.priorityLists);
        }

        setPlayerLoading(false);
      } catch (err: any) {
        setPlayerLoading(false);
        console.log(err);
      }
    };

    const fetchTeams = async () => {
      try {
        setTeamLoading(true);
        const res = await Axios.get(`${import.meta.env.VITE_API_URL}/team`);
        if (res.status === 200) {
          const allTeams = res.data;
          const sortedTeams = allTeams.sort((a: Team, b: Team) => {
            const rankA = a.lottery_rank ?? Infinity;
            const rankB = b.lottery_rank ?? Infinity;
            return rankA - rankB;
          });
          const targetTeam = allTeams.filter(
            (team: Team) => team.name === "Cincinnati Reds"
          );

          const hasLotteryRank = allTeams.every(
            (team: Team) => team.lottery_rank !== undefined
          );
          setTeams(allTeams);
          setLotteryTeams(hasLotteryRank ? sortedTeams : null);
          setSelectedTeam(targetTeam[0]);
          setTeamLoading(false);
        }
      } catch (err: any) {
        setTeamLoading(false);
        toast.error(err.response.data.message);
      }
    };

    fetchPlayers();
    fetchTeams();
  }, []);

  return teamLoading || playerLoading ? (
    <div className="fixed top-0 left-0 z-99999 w-screen h-screen bg-white dark:bg-boxdark flex justify-center items-center">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
    </div>
  ) : (
    <div className="flex flex-col items-center">
      <span className="text-2xl font-semibold text-black dark:text-white">
        {selectedTeam?.name}
      </span>
      <div className="flex items-end gap-20 mt-8">
        <div className="flex flex-col items-end gap-4">
          <div className="flex flex-col items-center">
            <span className="text-lg text-black dark:text-white font-medium">
              Wins
            </span>
            <span>{selectedTeam?.win}</span>
          </div>
          <div className="flex gap-6">
            <div className="flex flex-col items-center">
              <span className="text-lg text-black dark:text-white font-medium">
                AVG
              </span>
              <span>{selectedTeam?.avg}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg text-black dark:text-white font-medium">
                OBP
              </span>
              <span>{selectedTeam?.obp}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg text-black dark:text-white font-medium">
                Era
              </span>
              <span>{selectedTeam?.era}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start gap-4">
          <div className="flex flex-col items-center">
            <span className="text-lg text-black dark:text-white font-medium">
              Losses
            </span>
            <span>{selectedTeam?.loss}</span>
          </div>
          <div className="flex gap-6">
            <div className="flex flex-col items-center">
              <span className="text-lg text-black dark:text-white font-medium">
                Whip
              </span>
              <span>{selectedTeam?.whip}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg text-black dark:text-white font-medium">
                Runs
              </span>
              <span>{selectedTeam?.runs_on}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg text-black dark:text-white font-medium">
                R +/-
              </span>
              <span>{selectedTeam?.runs_differential}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 mt-8">
        <span className="text-lg text-black dark:text-white font-medium">
          World Series:{" "}
        </span>
        <span>{selectedTeam?.world_titles}</span>
      </div>
      <div className="flex items-center gap-6 mt-1">
        <div className="flex items-center gap-1">
          <span className="text-lg text-black dark:text-white font-medium">
            League Titles:{" "}
          </span>
          <span>{selectedTeam?.league_titles}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-lg text-black dark:text-white font-medium">
            Division Titles:{" "}
          </span>
          <span>{selectedTeam?.division_titles}</span>
        </div>
      </div>
      <div className="flex flex-col gap-3 mt-6">
        {Array.from({
          length:
            5 -
            (players.filter((player: Player) => player?.isAdded === true)
              .length || 0),
        }).map((_, index) => (
          <button
            key={index}
            className="flex items-center gap-2 cursor-pointer rounded-lg border border-dashed border-gray-steel-600 dark:border-form-strokedark px-4 py-1.5 text-steel-600 dark:text-gray hover:scale-105 transition whitespace-nowrap"
            onClick={() => {
              setIsOpenAddPlayerLinkModal(true);
            }}
          >
            <FiPlus />
            <span>Add Player Link</span>
          </button>
        ))}
      </div>
      {players.filter((player: Player) => player?.isAdded === true).length >
        0 && (
        <div className="max-w-full overflow-x-auto border border-stroke dark:border-strokedark mt-4">
          <table className="autoborder">
            <thead>
              <tr className="bg-gray dark:bg-boxdark">
                <th className="px-6 py-4 text-left text-black dark:text-white"></th>
                <th className="px-6 py-4 text-left text-black dark:text-white">
                  Link
                </th>
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
              </tr>
            </thead>
            <tbody>
              {players
                .filter((player: Player) => player?.isAdded === true)
                ?.map((player, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 1
                        ? "bg-white dark:bg-bodydark"
                        : "bg-whiter dark:bg-bodydark1"
                    } whitespace-nowrap dark:text-strokedark`}
                  >
                    <td className="px-6 py-2">
                      <div
                        className="cursor-pointer hover:text-black dark:hover:text-white"
                        onClick={() => {
                          handleRemove(player);
                        }}
                      >
                        <FiMinus />
                      </div>
                    </td>
                    <td className="px-6 py-2">{player.link}</td>
                    <td className="px-6 py-2">{player.name}</td>
                    <td className="px-6 py-2">{player.position}</td>
                    <td className="px-6 py-2">{player.age}</td>
                    <td className="px-6 py-2">{player.power}</td>
                    <td className="px-6 py-2">{player.contact}</td>
                    <td className="px-6 py-2">{player.speed}</td>
                    <td className="px-6 py-2">{player.defense}</td>
                    <td className="px-6 py-2">{player.control}</td>
                    <td className="px-6 py-2">{player.movement}</td>
                    <td className="px-6 py-2">{player.velocity}</td>
                    <td className="px-6 py-2">{player.stamina}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex items-center gap-3 mt-6">
        <button
          className="flex items-center gap-2 cursor-pointer rounded-lg border border-primary bg-primary px-4 py-1.5 text-white transition hover:bg-opacity-90 whitespace-nowrap"
          onClick={() => {
            navigate("/players");
          }}
        >
          Player Pool
        </button>
        <button
          className="flex items-center gap-2 cursor-pointer rounded-lg border border-primary bg-primary px-4 py-1.5 text-white transition hover:bg-opacity-90 whitespace-nowrap"
          onClick={() => {
            navigate("/lottery");
          }}
        >
          Lottery
        </button>
        <button
          className="flex items-center gap-2 cursor-pointer rounded-lg border border-primary bg-primary px-4 py-1.5 text-white transition hover:bg-opacity-90 whitespace-nowrap"
          onClick={() => {
            navigate("/draft_player");
          }}
        >
          Draft player
        </button>
        <button
          className="flex items-center gap-2 cursor-pointer rounded-lg border border-primary bg-primary px-4 py-1.5 text-white transition hover:bg-opacity-90 whitespace-nowrap"
          onClick={() => {
            navigate("/view_draft");
          }}
        >
          View Draft
        </button>
      </div>
      <AddPlayerLinkModal
        isOpen={isOpenAddPlayerLinkModal}
        onClose={() => {
          setIsOpenAddPlayerLinkModal(false);
        }}
      />
    </div>
  );
};

export default Dashboard;
