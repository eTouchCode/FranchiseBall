import { Player, usePlayerStore } from "../store/player.store";

const PlayerTable = () => {
  const { players, setSelectedPlayer } = usePlayerStore() as {
    players: Player[];
    setSelectedPlayer: (player: Player) => void;
  };

  const handleSelectPlayer = (player: Player) => {
    setSelectedPlayer(player);
  };

  return (
    <div className="h-full border border-stroke shadow-default dark:border-strokedark">
      <div className="">
        <table className="min-w-full autoborder border-stroke dark:border-strokedark">
          <thead>
            <tr className="bg-gray dark:bg-boxdark border-b border-stroke dark:border-b-strokedark">
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
            {players.map((player, index) => (
              <tr
                key={index}
                className={`bg-white dark:bg-boxdark whitespace-nowrap cursor-pointer hover:bg-stroke dark:hover:bg-strokedark ${
                  index === players.length - 1
                    ? ""
                    : "border-b border-b-stroke dark:border-b-strokedark"
                }`}
                onClick={() => {
                  handleSelectPlayer(player);
                }}
              >
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
    </div>
  );
};

export default PlayerTable;
