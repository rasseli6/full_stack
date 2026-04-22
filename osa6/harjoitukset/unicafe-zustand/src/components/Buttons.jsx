import useStore from '../Store'

const Buttons = () => {
  const incrementGood = useStore((state) => state.actions.incrementGood)
  const incrementNeutral = useStore((state) => state.actions.incrementNeutral)
  const incrementBad = useStore((state) => state.actions.incrementBad)
  return (
    <div>
      <h2>give feedback</h2>
      <button onClick = { incrementGood }>good</button>
      <button onClick = { incrementNeutral }>neutral</button>
      <button onClick = { incrementBad }>bad</button>
    </div>
  )
}

export default Buttons
