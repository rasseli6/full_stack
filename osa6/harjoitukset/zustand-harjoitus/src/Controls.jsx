import { useCounterControls } from './Store'

const Controls = () => {
  const { increment, decrement, zero } = useCounterControls()

  return (
    <div>
      <button onClick={() => { console.log('plus clicked'); increment(); }}>plus</button>
      <button onClick={() => { console.log('minus clicked'); decrement(); }}>minus</button>
      <button onClick={() => { console.log('zero clicked'); zero(); }}>zero</button>
    </div>
  )
}

export default Controls