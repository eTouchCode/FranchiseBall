import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import AlphabeticalTeamTable from "../../components/TeamTable/AlphabeticalTeamTable";
import LotteryTable from "../../components/TeamTable/LotteryTable";
import { Team, useTeamStore } from "../../store/team.store";

const Lottery = () => {
  const navigate = useNavigate();
  const countRef = useRef(0);
  const { teams, isLotteryStarted, setLotteryStarted, setLotteryTeams } =
    useTeamStore() as {
      teams: Team[];
      isLotteryStarted: boolean;
      setLotteryStarted: (value: boolean) => void;
      setLotteryTeams: (teams: Team[] | null) => void;
    };

  const handleStart = async () => {
    countRef.current = 0;
    setLotteryTeams(null);

    const sortedTeams = [...teams].sort(
      (a, b) => b.weighted_score - a.weighted_score
    );
    const first20Percent = sortedTeams.slice(0, 2);
    let temp: Team[] = [];

    while (countRef.current < sortedTeams.length) {
      if (countRef.current < first20Percent.length) {
        if (countRef.current % 2 === 0) {
          const lowestWeightedTeam = first20Percent[0];
          first20Percent.splice(first20Percent.indexOf(lowestWeightedTeam), 1);
          temp.push(lowestWeightedTeam);
          countRef.current += 1;
        } else {
          const randomIndex = Math.ceil(Math.random() * first20Percent.length);
          const randomTeam = first20Percent[randomIndex];
          first20Percent.splice(randomIndex, 1);
          sortedTeams.splice(sortedTeams.indexOf(randomTeam), 1);
          temp.push(randomTeam);
          countRef.current += 1;
        }
      } else {
        const selectedTeam = sortedTeams[countRef.current];
        temp.push(selectedTeam);
        countRef.current += 1;
      }
    }
    setLotteryTeams(temp);
    setLotteryStarted(true);
  };

  useEffect(() => {
    setLotteryStarted(false);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <button
        className="flex items-center gap-2 cursor-pointer px-3 hover:text-black hover:dark:text-white"
        onClick={() => {
          navigate("/");
        }}
      >
        <IoArrowBackOutline className="w-5 h-5" />
        <span className="text-lg font-medium">Back</span>
      </button>
      <div className="grid grid-cols-10 gap-4 max-h-[calc(100vh-14rem)]">
        <div className="col-span-5 overflow-x-auto">
          <AlphabeticalTeamTable />
        </div>
        <div className="col-span-5 overflow-x-auto">
          <LotteryTable />
        </div>
      </div>
      <div className="flex justify-center">
        <button
          disabled={isLotteryStarted}
          className="flex justify-center items-center gap-2 rounded-lg border border-primary bg-primary w-25 h-10 text-white transition hover:bg-opacity-90 font-medium whitespace-nowrap disabled:border-none disabled:bg-slate-400"
          onClick={handleStart}
        >
          {!isLotteryStarted ? (
            "Start"
          ) : (
            <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent"></div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Lottery;
