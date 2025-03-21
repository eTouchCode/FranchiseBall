import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Team, useTeamStore } from "../store/team.store";
import { Player, PriorityLists, usePlayerStore } from "../store/player.store";

const ViewDraftPortal = () => {
  const { teams: initialTeams, lotteryTeams } = useTeamStore() as {
    teams: Team[];
    lotteryTeams: Team[];
  };
  const { players, priorityLists } = usePlayerStore() as {
    players: Player[];
    priorityLists: PriorityLists;
  };
  const initialDraftPlayers = players.filter(
    (player: Player) => player?.isDrafted === true
  );
  const [disabled, setDisabled] = useState<boolean>(false);
  const [draftedPlayers, setDraftedPlayers] =
    useState<Player[]>(initialDraftPlayers);
  const [pickedPlayers, setPickedPlayers] = useState<PriorityLists>({});
  const teams = lotteryTeams ? lotteryTeams : initialTeams;
  const [selectedTeam, setSelectedTeam] = useState<Team>(teams[0]);
  const [countDown, setCountDown] = useState<number>(180);
  const teamIndexRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startCountDown = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCountDown((prev) => {
        if (prev <= 0) {
          clearInterval(intervalRef.current!);
          autoPickPlayer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const nextTeam = () => {
    teamIndexRef.current = (teamIndexRef.current + 1) % teams.length;
    setSelectedTeam(teams[teamIndexRef.current]);
    setCountDown(180);
    startCountDown();
  };

  const autoPickPlayer = () => {
    const currentTeam = selectedTeam;
    const availablePlayers = players.filter((player) => !player.isDrafted);

    let selectedPlayer: Player | null = null;
    if (priorityLists[currentTeam._id]?.length > 0) {
      for (const player of priorityLists[currentTeam._id]) {
        if (!player.isDrafted) {
          selectedPlayer = player;
          break;
        }
      }
    }

    if (!selectedPlayer) {
      selectedPlayer =
        availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
    }

    if (selectedPlayer) {
      setDisabled(true);
      setPickedPlayers((prev) => ({
        ...prev,
        [currentTeam._id]: [...(prev[currentTeam._id] || []), selectedPlayer],
      }));
      toast.success(
        `The pick is in! ${selectedTeam.name} selected ${selectedPlayer.name}`
      );
    }

    setTimeout(() => {
      setDisabled(true);
      nextTeam();
    }, 10000);
  };

  const handlePickPlayer = (player: Player) => {
    setDisabled(true);
    setDraftedPlayers((prev) => prev.filter((p) => p._id !== player._id));
    setPickedPlayers((prev) => ({
      ...prev,
      [selectedTeam._id]: [...(prev[selectedTeam._id] || []), player],
    }));
    toast.success(
      `The pick is in! ${selectedTeam.name} selected ${player.name}`
    );
    setTimeout(() => {
      nextTeam();
      setDisabled(false);
    }, 10000);
  };

  useEffect(() => {
    startCountDown();
    return () => clearInterval(intervalRef.current!);
  }, []);

  return (
    <div className="flex flex-col mt-5">
      <div className="flex justify-center bg-bodydark dark:bg-boxdark py-2.5">
        <span className="text-black dark:text-white text-lg font-medium">
          Status Bar - this shows current status like "{selectedTeam?.name}" :{" "}
          {`${Math.floor(countDown / 60)
            .toString()
            .padStart(2, "0")}:${(countDown % 60).toString().padStart(2, "0")}`}
        </span>
      </div>
      <div className="flex gap-2 mt-2">
        <div className="w-1/4">
          <div className="overflow-y-auto max-h-[calc(100vh-13rem)]">
            <table className="min-w-full autoborder border-stroke dark:border-strokedark">
              <thead>
                <tr className="bg-white dark:bg-boxdark border-b border-stroke dark:border-b-strokedark">
                  <th className="px-6 py-4 text-left text-black dark:text-white w-1/12">
                    No
                  </th>
                  <th className="px-6 py-4 text-left text-black dark:text-white w-11/12">
                    Name
                  </th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team, index) => (
                  <tr
                    key={index}
                    className={`${
                      team._id === selectedTeam._id
                        ? "text-yellow-300 dark:text-yellow-300"
                        : ""
                    } bg-white dark:bg-boxdark whitespace-nowrap ${
                      index === teams.length - 1
                        ? ""
                        : "border-b border-b-stroke dark:border-b-strokedark"
                    }`}
                  >
                    <td className="px-6 py-2 w-1/12">{index + 1}</td>
                    <td className="px-6 py-2 w-11/12">{team.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-1/2">
          <div className="overflow-y-auto max-h-[calc(100vh-13rem)]">
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
                </tr>
              </thead>
              <tbody>
                {pickedPlayers[selectedTeam._id]?.length > 0 ? (
                  pickedPlayers[selectedTeam._id]?.map((player, index) => (
                    <tr
                      key={index}
                      className={`bg-white dark:bg-boxdark whitespace-nowrap cursor-pointer hover:bg-stroke dark:hover:bg-strokedark ${
                        index === players.length - 1
                          ? ""
                          : "border-b border-b-stroke dark:border-b-strokedark"
                      }`}
                    >
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
                  ))
                ) : (
                  <tr className="bg-white dark:bg-boxdark border-t border-t-stroke dark:border-t-strokedark">
                    <td colSpan={11} className="text-center py-2 text-lg">
                      No picked player
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-1/4">
          <div className="overflow-y-auto max-h-[calc(100vh-13rem)]">
            <table className="min-w-full autoborder border-stroke dark:border-strokedark">
              <thead>
                <tr className="bg-white dark:bg-boxdark border-b border-stroke dark:border-b-strokedark">
                  <th className="px-6 py-4 text-left text-black dark:text-white">
                    No
                  </th>
                  <th className="px-6 py-4 text-left text-black dark:text-white">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-black dark:text-white">
                    Position
                  </th>
                  <th className="px-6 py-4 text-left text-black dark:text-white"></th>
                </tr>
              </thead>
              <tbody>
                {draftedPlayers.map((player, index) => (
                  <tr
                    key={index}
                    className={` bg-white dark:bg-boxdark whitespace-nowrap cursor-pointer ${
                      index === teams.length - 1
                        ? ""
                        : "border-b border-b-stroke dark:border-b-strokedark"
                    }`}
                  >
                    <td className="px-6 h-12">{index + 1}</td>
                    <td className="px-6 h-12">{player.name}</td>
                    <td className="px-6 h-12">{player.position}</td>
                    <td className="px-6 h-12">
                      <button
                        disabled={disabled}
                        className="flex justify-center items-center gap-2 cursor-pointer disabled:cursor-not-allowed rounded-lg border border-primary bg-primary disabled:bg-bodydark dark:disabled:bg-steel-500/20 disabled:border-none w-16 h-9 text-white disabled:dark:text-slate-400 transition hover:bg-opacity-90"
                        onClick={() => {
                          handlePickPlayer(player);
                        }}
                      >
                        Pick
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDraftPortal;
