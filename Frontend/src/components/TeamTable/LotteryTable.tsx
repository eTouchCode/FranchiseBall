import { useEffect, useState } from "react";
import { Team, useTeamStore } from "../../store/team.store";

const LotteryTable = () => {
  const { teams, isLotteryStarted, lotteryTeams } = useTeamStore() as {
    teams: Team[];
    isLotteryStarted: boolean;
    lotteryTeams: Team[] | null;
  };
  const blankRows: Team[] = new Array(teams.length).fill({
    name: "",
  } as Team);
  const sortedTeams = [...teams].sort((a, b) => a.name.localeCompare(b.name));
  const [_, setCurrentIndex] = useState<number>(sortedTeams.length);
  const [displayTeams, setDisplayedTeams] = useState<Team[]>(
    lotteryTeams || blankRows
  );

  useEffect(() => {
    if (isLotteryStarted) setDisplayedTeams(blankRows);
  }, [isLotteryStarted]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isLotteryStarted) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = prevIndex - 1;
          if (nextIndex < 0) {
            clearInterval(interval);
            return prevIndex;
          }

          let updatedDisplayTeams = [...displayTeams];
          if (lotteryTeams) {
            updatedDisplayTeams[nextIndex] = lotteryTeams[nextIndex];
          }
          setDisplayedTeams([...updatedDisplayTeams]);
          return nextIndex;
        });
      }, 4000);
    } else {
      setCurrentIndex(teams.length);
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLotteryStarted, lotteryTeams, displayTeams]);

  return (
    <div className="rounded-sm border border-stroke shadow-default dark:border-strokedark">
      <div className="overflow-y-auto max-h-[calc(100vh-8rem)]">
        <table className="min-w-full autoborder border-stroke dark:border-strokedark">
          <thead>
            <tr className="bg-gray dark:bg-boxdark border-b border-stroke dark:border-b-strokedark">
              <th className="px-6 py-4 text-left text-black dark:text-white w-1/12">
                No
              </th>
              <th className="px-6 py-4 text-left text-black dark:text-white w-11/12">
                Name
              </th>
            </tr>
          </thead>
          <tbody>
            {displayTeams.slice().map((team, index) => (
              <tr
                key={index}
                className={` bg-white dark:bg-boxdark whitespace-nowrap cursor-pointer dark:text-white ${
                  index === displayTeams.length - 1
                    ? ""
                    : "border-b border-b-stroke dark:border-b-strokedark"
                }`}
              >
                <td
                  className={`w-1/12 ${
                    team.name === "" ? "py-5" : "px-6 py-2 "
                  }`}
                >
                  {team.name
                    ? lotteryTeams?.findIndex(
                        (item) => item.name === team.name
                      ) !== undefined
                      ? lotteryTeams.findIndex(
                          (item) => item.name === team.name
                        ) + 1
                      : ""
                    : ""}
                </td>
                <td className="px-6 py-2 w-11/12">{team.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LotteryTable;
