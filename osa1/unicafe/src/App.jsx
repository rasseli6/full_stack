import { useState } from 'react'

const Header = ({text}) => <h1>{text}</h1>
const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const StatisticLine = ({text, value}) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>)

const Statistics = ({good, neutral, bad}) => {
  const total = good + neutral + bad
  if (total === 0){
    return <p>No feedback given</p>
  }
  const average = total === 0 ? 0 : (good - bad) / total
  const positive = total === 0 ? 0 : (good / total) * 100

  return(
    <table>
      <tbody>
        <StatisticLine text='Good' value={good}/>
        <StatisticLine text='Neutral' value={neutral}/>
        <StatisticLine text='Bad' value={bad}/>
        <StatisticLine text='all' value={total}/>
        <StatisticLine text='average' value={average} />
        <StatisticLine text='positive' value={`${positive} %`}/>
      </tbody>
    </table>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  
  const handleGood = () => setGood(good + 1)
  const handleNeutral = () => setNeutral(neutral + 1)
  const handleBad = () => setBad(bad + 1)

  return (
    <div>
      <Header text='give feedback'/>
      <Button onClick={handleGood} text='good'/>
      <Button onClick={handleNeutral} text='neutral'/>
      <Button onClick={handleBad} text='bad'/>

      <Header text='Statistics'/>
      <Statistics good={good} neutral={neutral} bad={bad}/>
      
    </div>
  )
}

export default App
