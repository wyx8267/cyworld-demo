import { useHistory } from "react-router-dom";
import Earth from "./earth";
import './index.scss'
import { Transition } from "./transition";

export default function Home() {
  const history = useHistory();
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* <button
        onClick={() => {
          history.push("/detail");
        }}
      >
        to detail
      </button> */}
      <Earth />
      <Transition />
    </div>
  );
}
