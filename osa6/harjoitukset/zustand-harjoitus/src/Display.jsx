import { useCounter } from './Store'

const Display = () => {
    const counter = useCounter()
    return (
        <div>{ counter }</div>
    )
}
export default Display