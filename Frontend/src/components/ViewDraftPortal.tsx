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
  const teams = lotteryTeams ? lotteryTeams : initialTeams;

  const hasRendered = useRef(false);
  const countRef = useRef(5);
  const teamIndexRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const directionRef = useRef(1);
  const updatedTeamsRef = useRef(teams);
  const [_, setShouldRender] = useState(0);

  const startCountDown = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      countRef.current -= 1;
      if (countRef.current == 0) {
        autoPickPlayer();
      }
      if (countRef.current >= 0) {
        setShouldRender(Math.random());
      }
    }, 1000);
  };

  const nextTeam = () => {
    const nextTeam = teamIndexRef.current + directionRef.current;
    if (nextTeam < 0 || nextTeam >= teams.length) {
      if (directionRef.current == 1) {
        directionRef.current = -1;
      } else if (directionRef.current == -1) {
        directionRef.current = 0;
        clearInterval(intervalRef.current!);
      }
    }

    teamIndexRef.current = teamIndexRef.current + directionRef.current;
    countRef.current = 5;
  };

  const autoPickPlayer = () => {
    const currentTeam = teams[teamIndexRef.current];
    if (
      currentTeam &&
      currentTeam.drafted_players &&
      currentTeam.drafted_players.length > 0 &&
      directionRef.current === 1
    ) {
      nextTeam();
    } else {
      const all_drafted_players = updatedTeamsRef.current.flatMap(
        (team) => team?.drafted_players
      );
      const availablePlayers = players.filter(
        (player) => !all_drafted_players?.includes(player._id)
      );
      let selectedPlayer: Player | null = null;
      if (priorityLists[currentTeam._id]?.length > 0) {
        for (const player of priorityLists[currentTeam._id]) {
          if (availablePlayers.includes(player)) {
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
        const teamToUpdate = updatedTeamsRef.current.find(
          (team) => team._id === currentTeam._id
        );
        if (teamToUpdate) {
          const updatedTeam = {
            ...teamToUpdate,
            drafted_players: teamToUpdate.drafted_players
              ? [...teamToUpdate.drafted_players, selectedPlayer._id]
              : [selectedPlayer._id],
          };
          updatedTeamsRef.current = updatedTeamsRef.current.map((team) =>
            team._id === currentTeam._id ? updatedTeam : team
          );
          toast.success(
            `The pick is in! ${currentTeam.name} selected ${selectedPlayer.name}`
          );
        }
        setTimeout(() => {
          nextTeam();
        }, 2000);
      }
    }
  };

  useEffect(() => {
    if (!hasRendered.current) {
      startCountDown();
      hasRendered.current = true;
    }
  }, []);

  return (
    <div className="flex flex-col mt-5">
      <div className="flex justify-center bg-bodydark dark:bg-boxdark py-2.5">
        <span className="text-black dark:text-white text-lg font-medium">
          Status Bar - this shows current status like "
          {teams[teamIndexRef.current]?.name}" :{" "}
          {`${Math.floor(countRef.current / 60)
            .toString()
            .padStart(2, "0")}:${(countRef.current % 60)
            .toString()
            .padStart(2, "0")}`}
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
                      team._id === teams[teamIndexRef.current]._id
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
        <div className="w-3/4">
          <div className="overflow-y-auto max-h-[calc(100vh-13rem)]">
            <table className="min-w-full autoborder border-stroke dark:border-strokedark">
              <thead>
                <tr className="bg-white dark:bg-boxdark border-b border-stroke dark:border-b-strokedark">
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
                {(() => {
                  const teamIndex = updatedTeamsRef.current.findIndex(
                    (team) => team._id === teams[teamIndexRef.current]._id
                  );

                  const team =
                    teamIndex !== -1
                      ? updatedTeamsRef.current[teamIndex]
                      : null;

                  if (
                    team &&
                    team.drafted_players &&
                    team.drafted_players.length > 0
                  ) {
                    return team.drafted_players.map((drafted_player, index) => {
                      const player = players.find(
                        (player) => player._id === drafted_player
                      );
                      return (
                        <tr
                          key={index}
                          className={`bg-white dark:bg-boxdark whitespace-nowrap cursor-pointer hover:bg-stroke dark:hover:bg-strokedark ${
                            team.drafted_players &&
                            index === team.drafted_players.length - 1
                              ? ""
                              : "border-b border-b-stroke dark:border-b-strokedark"
                          }`}
                        >
                          <td className="px-6 py-2">{player?.name}</td>
                          <td className="px-6 py-2">{player?.position}</td>
                          <td className="px-6 py-2">{player?.age}</td>
                          <td className="px-6 py-2">{player?.power}</td>
                          <td className="px-6 py-2">{player?.contact}</td>
                          <td className="px-6 py-2">{player?.speed}</td>
                          <td className="px-6 py-2">{player?.defense}</td>
                          <td className="px-6 py-2">{player?.control}</td>
                          <td className="px-6 py-2">{player?.movement}</td>
                          <td className="px-6 py-2">{player?.velocity}</td>
                          <td className="px-6 py-2">{player?.stamina}</td>
                        </tr>
                      );
                    });
                  } else {
                    return (
                      <tr className="bg-white dark:bg-boxdark border-t border-t-stroke dark:border-t-strokedark">
                        <td colSpan={11} className="text-center py-2 text-lg">
                          No picked player
                        </td>
                      </tr>
                    );
                  }
                })()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDraftPortal;
