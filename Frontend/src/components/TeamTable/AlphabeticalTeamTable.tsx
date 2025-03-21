import { useEffect, useState } from "react";
import { Team, useTeamStore } from "../../store/team.store";
import Axios from "../../config/axios";
import { toast } from "sonner";

const AlphabeticalTeamTable = () => {
  const { teams, lotteryTeams, isLotteryStarted, setLotteryStarted } =
    useTeamStore() as {
      teams: Team[];
      lotteryTeams: Team[];
      isLotteryStarted: boolean;
      setLotteryStarted: (value: boolean) => void;
    };

  const sortedTeams = [...teams].sort((a, b) => a.name.localeCompare(b.name));

  const [currentIndex, setCurrentIndex] = useState(teams.length);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);

  const handleSaveLotteryTeams = async () => {
    try {
      const res = await Axios.put(
        `${import.meta.env.VITE_API_URL}/team/update-lottery-ranks`,
        {
          teams: lotteryTeams,
        }
      );
      if (res.status === 200) {
        toast.success(res.data.message);
        setLotteryStarted(false);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLotteryStarted(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isLotteryStarted) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = prevIndex - 1;
          if (nextIndex < 0) {
            return teams.length;
          }

          const alphabeticalIndex =
            sortedTeams.findIndex(
              (team) => team.name === lotteryTeams[nextIndex].name
            ) ?? -1;

          if (alphabeticalIndex !== -1) {
            setTargetIndex(alphabeticalIndex);
          }

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
  }, [isLotteryStarted, targetIndex]);

  useEffect(() => {
    if (currentIndex < 1) {
      handleSaveLotteryTeams();
    }
  }, [currentIndex, setLotteryStarted]);

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
            {sortedTeams.map((team, index) => (
              <tr
                key={index}
                className={`${
                  index === targetIndex
                    ? "text-yellow-300 dark:text-yellow-300"
                    : "dark:text-white"
                } bg-white dark:bg-boxdark whitespace-nowrap cursor-pointer dark:text-strokedark ${
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
  );
};

export default AlphabeticalTeamTable;
