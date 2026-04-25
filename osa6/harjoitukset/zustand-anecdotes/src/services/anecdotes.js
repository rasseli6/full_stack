const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
    const response = await fetch(baseUrl)

    if (!response.ok) {
        throw new Error('Failed to fetch anecdotes')
    }
    return await response.json()
}

const createNew = async (content) => {
    const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, votes: 0 })
    })
    if (!response.ok) {
        throw new Error('Failed to create note')
    }
    return await response.json()
}
const update = async (id, anecdote) => {
    const updateUrl = `${baseUrl}/${id}`
    const response = await fetch(updateUrl, {
        method: 'PUT',
        headers : { 'Content-Type': 'application/json'},
        body: JSON.stringify(anecdote)
    })
    if (!response.ok){
        throw new Error('Failed to update')
    }
    return await response.json()
}

const deleteAnecdote = async (id) => {
    const deleteUrl = `${baseUrl}/${id}`
    const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers : { 'Content-Type': 'application/json'}
    })
    if (!response.ok){
        throw Error('Failed to delete')
    }
    return null
}

export default { getAll, createNew, update, deleteAnecdote }