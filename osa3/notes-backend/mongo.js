const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = 
`mongodb+srv://rasmusharmanen_db_user:${password}@cluster0.9wdh3zv.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const notes = [
  { content: 'HTML is easy', important: true },
  { content: 'CSS is hard', important: true },
  { content: 'Mongoose makes things easy', important: true }
]


//Note.find({}).then(result => {
//    result.forEach(note => {
//        console.log(note)
//    })
//    mongoose.connection.close()
//})
Note.insertMany(notes)
  .then(result => {
    console.log(`${result.length} notes saved!`)
    mongoose.connection.close()
  })
  .catch(error => {
    console.log(error)
    mongoose.connection.close()
  })

//notes.save().then(result => {
//  console.log('note saved!')
 // mongoose.connection.close()
// })