import { useHistory } from "react-router-dom";

export default function Detail() {
  const history = useHistory()
  return (
    <div style={{ background: '#950826', height: '100%' }}>
      detail
      <button onClick={() => {
        history.push('/')
      }}>to home</button>
    </div>
  );
}
