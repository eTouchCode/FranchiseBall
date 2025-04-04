import { useEffect, useRef, useState } from "react";
import { Team, useTeamStore } from "../store/team.store";
import { Player, PriorityLists, usePlayerStore } from "../store/player.store";

let autoPickedPlayers: any[] = [];
let addedPlayers = new Set();

function getOrdinalSuffix(num: number) {
  const j = num % 10;
  const k = num % 100;
  
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
}

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
  const countRef = useRef(5); // 5 sec cooldown
  const teamIndexRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const directionRef = useRef(1);
  const updatedTeamsRef = useRef(teams);

  const [_, setShouldRender] = useState(0);
  const [showPickIn, setShowPickIn] = useState(true);
  const [selectedPlayerName, setSelectedPlayerName] = useState<string | null>(null);

  const startCountDown = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => { //this function will auto call in 1 sec
      countRef.current -= 1; //Count Down
      if (countRef.current == 0) { // If the countdown finished, then Pick Player.
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
      if (nextTeam >= teams.length && directionRef.current == 1) { //will be last team...
        teamIndexRef.current = teamIndexRef.current;
        directionRef.current = -1
        countRef.current = 5 //Reset cooldown 5 sec
        return;
      }
      if (directionRef.current == 1) { //Set Up or Down as +1 and -1
        directionRef.current = -1;
      } else if (directionRef.current == -1) { //this will be last of the Round2
        directionRef.current = 0;
        clearInterval(intervalRef.current!);
      }
    }

    teamIndexRef.current = teamIndexRef.current + directionRef.current;
    countRef.current = 5; //Reset cooldown 5 sec
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
        setShowPickIn(false);
        setSelectedPlayerName(selectedPlayer.name);
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
          // toast.success(
          //   `The pick is in! ${currentTeam.name} selected ${selectedPlayer.name}`
          // );
        }
        setTimeout(() => {
          nextTeam();
          setShowPickIn(true);
          setSelectedPlayerName(null);
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
// 1st, 2nd, 3rd, 4th, 5th, 6th, 7th, 8th, 9th, 10th, 11th, 12th, 13th, 14th, 15th, 16th, 17th, 18th, 19th, 20th, 21st, 22nd, 23rd, 24th, 25th, 26th, 27th, 28th, 29th, 30th
  return (
    <div className="flex flex-col absolute w-fit">
      <div className="flex flex-col items-center justify-center">
        <div className="w-1/2 flex flex-col gap-0">
          <div className="h-1/3 overflow-hidden relative bg-bodydark dark:bg-boxdark">
            <div className="text-center text-black dark:text-white text-lg font-medium">
              {showPickIn && directionRef.current != 0 ? "The Pick is In!" : <span className="opacity-0"> ! </span>}
            </div>
          </div>
          <div className="text-center text-black dark:text-white text-lg font-medium bg-bodydark dark:bg-boxdark">
            {`${
              directionRef.current != 0
                ? "With the " 
                  + (directionRef.current * teamIndexRef.current + (19 - directionRef.current * 17) / 2)
                  + getOrdinalSuffix(directionRef.current * teamIndexRef.current + (19 - directionRef.current * 17) / 2)
                  + " pick of the draft, the "
                  + teams[teamIndexRef.current]?.name
                  + " selects..."
                : "The Pick is ended!"
            }`}
          </div>
          <div className="h-8 text-center text-black dark:text-white text-lg font-medium bg-bodydark dark:bg-boxdark">
            {(() => {
              // Find current team in updatedTeamsRef
              const teamIndex = updatedTeamsRef.current.findIndex(
                (team) => team._id === teams[teamIndexRef.current]._id
              );
              const team = teamIndex !== -1 ? updatedTeamsRef.current[teamIndex] : null;
              // Get drafted players or empty array if none
              const draftedPlayers = team?.drafted_players || [];
              const lastDraftedPlayer = draftedPlayers.length > 0 && draftedPlayers.length <= (3 - directionRef.current) / 2.0 
                ? draftedPlayers[(1 - directionRef.current) / 2.0] 
                : null;

              const player = players.find((p) => p._id === lastDraftedPlayer);
              
              // If there's a selected player (being picked now), show that
              if (selectedPlayerName) {
                return selectedPlayerName;
              }
              // Otherwise show last drafted player or timer
              return player?.name || 
                `${Math.floor(countRef.current / 60)
                  .toString()
                  .padStart(2, "0")}:${(countRef.current % 60)
                  .toString()
                  .padStart(2, "0")}`;
            })()}

          </div>
        </div>
      </div>
      <div className="flex items-center justify-center">
          <div className="w-1/2 overflow-y-auto max-h-[calc(100vh-13rem)]">
            <table className="text-[15px] min-w-full autoborder border-stroke dark:border-strokedark">
              <thead>
                <tr className="bg-white dark:bg-boxdark border-b border-stroke dark:border-b-strokedark">
                  <th className="px-2 py-2 text-left text-black dark:text-white">
                    
                  </th>
                  <th className="px-2 py-2 text-left text-black dark:text-white">
                    Name
                  </th>
                  <th className="px-2 py-2 text-left text-black dark:text-white">
                    Position
                  </th>
                  <th className="px-2 py-2 text-left text-black dark:text-white">
                    Age
                  </th>
                  <th className="px-2 py-2 text-left text-black dark:text-white">
                    Power
                  </th>
                  <th className="px-2 py-2 text-left text-black dark:text-white">
                    Contact
                  </th>
                  <th className="px-2 py-2 text-left text-black dark:text-white">
                    Speed
                  </th>
                  <th className="px-2 py-2 text-left text-black dark:text-white">
                    Defense
                  </th>
                  <th className="px-2 py-2 text-left text-black dark:text-white">
                    Control
                  </th>
                  <th className="px-2 py-2 text-left text-black dark:text-white">
                    Movement
                  </th>
                  <th className="px-2 py-2 text-left text-black dark:text-white">
                    Velocity
                  </th>
                  <th className="px-2 py-2 text-left text-black dark:text-white">
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
                  teamIndex !== -1 ? updatedTeamsRef.current[teamIndex] : null;

                let draftedPlayers = team?.drafted_players || [];
                let rounds = Math.max(2, draftedPlayers.length); // Ensure at least 2 rounds

                return Array.from({ length: rounds }).map((_, index) => {
                  const playerId = draftedPlayers[index] || null;
                  const player = players.find((p) => p._id === playerId);

                  if (player?.name && !addedPlayers.has(player.name)) {
                    addedPlayers.add(player.name);
                    autoPickedPlayers.push({
                      name: player.name,
                      position: player.position,
                      team_name: team?.name || "-",
                    });
                  }

                  return (
                    <tr
                      key={index}
                      className={`bg-white dark:bg-boxdark whitespace-nowrap cursor-pointer hover:bg-stroke dark:hover:bg-strokedark ${
                        index < rounds - 1 ? "border-b border-b-stroke dark:border-b-strokedark" : ""
                      }`}
                    >
                      <td className="px-2 py-1">Round {index + 1}</td>
                      <td className="px-2 py-1">{player?.name || "-"}</td>
                      <td className="px-2 py-1">{player?.position || "-"}</td>
                      <td className="px-2 py-1">{player?.age || "-"}</td>
                      <td className="px-2 py-1">{player?.power || "-"}</td>
                      <td className="px-2 py-1">{player?.contact || "-"}</td>
                      <td className="px-2 py-1">{player?.speed || "-"}</td>
                      <td className="px-2 py-1">{player?.defense || "-"}</td>
                      <td className="px-2 py-1">{player?.control || "-"}</td>
                      <td className="px-2 py-1">{player?.movement || "-"}</td>
                      <td className="px-2 py-1">{player?.velocity || "-"}</td>
                      <td className="px-2 py-1">{player?.stamina || "-"}</td>
                    </tr>
                  );
                });
              })()}
              </tbody>
            </table>
          </div>
        </div>
      <div className="flex justify-between mt-2">
        <div className="w-1/4">
          <div className="overflow-y-auto max-h-[calc(100vh-13rem)]">
            <table className="text-[16px] min-w-full autoborder border-stroke dark:border-strokedark">
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
        <div>
          <img src="background.png" alt="Background Image"></img>
        </div>
        <div className="w-1/4">
          <div className="overflow-y-auto max-h-[calc(100vh-13rem)]">
            <table className="text-[16px] min-w-full autoborder border-stroke dark:border-strokedark">
              <thead>
                <tr className="bg-white dark:bg-boxdark border-b border-stroke dark:border-b-strokedark">
                <th className="px-2 py-3 text-left text-black dark:text-white">
                    No
                  </th>
                  <th className="px-2 py-3 text-left text-black dark:text-white">
                    Name
                  </th>
                  <th className="px-2 py-3 text-left text-black dark:text-white">
                    Position
                  </th>
                  <th className="px-2 py-3 text-left text-black dark:text-white">
                    Team
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  Array.from({ length: 18 }).map((_, index) => {
                    const player = autoPickedPlayers[index] || null;
                    return (
                      <tr
                        key={index}
                        className={`bg-white dark:bg-boxdark whitespace-nowrap cursor-pointer hover:bg-stroke dark:hover:bg-strokedark border-b border-b-stroke dark:border-b-strokedark`}
                      >
                        <td className="px-2 py-1">{index + 1}</td>
                        <td className="px-2 py-1">{player?.name || '-'}</td>
                        <td className="px-2 py-1">{player?.position || '-'}</td>
                        <td className="px-2 py-1">{player?.team_name || '-'}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDraftPortal;
