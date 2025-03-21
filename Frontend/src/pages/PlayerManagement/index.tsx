import { useEffect } from "react";
import { toast } from "sonner";
import { Axios } from "../../config/axios";

import PlayerTable from "../../components/PlayerTable";
import PriorityList from "../../components/PriorityList";

import { usePlayerStore, Player } from "../../store/player.store";

const PlayerManagement = () => {
  const { loading, setLoading, setPlayers } = usePlayerStore() as {
    loading: boolean,
    setLoading: (state: boolean) => void,
    setPlayers: (players: Player[]) => void
  }

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const res = await Axios.get(`${import.meta.env.VITE_API_URL}/player`);
        if (res.status === 200) {
          setPlayers(res.data);
          setLoading(false);
        }
      } catch (err: any) {
        setLoading(false);
        toast.error(err.response.data.message);
      }
    }

    fetchPlayers();
  }, []);

  return (
    loading ? <div className="fixed top-0 left-0 z-99999 w-screen h-screen bg-white dark:bg-boxdark flex justify-center items-center">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
    </div> :
      <div className="grid grid-cols-10 gap-4">
        <div className="col-span-5 md:col-span-6 xl:col-span-7 overflow-x-auto">
          <PlayerTable />
        </div>
        <div className="col-span-5 md:col-span-4 xl:col-span-3">
          <PriorityList />
        </div>
      </div>
  )
}

export default PlayerManagement;