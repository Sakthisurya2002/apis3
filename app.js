const express = require('express')
const {open} = require('sqlite')
const path = require('path')
const sqlite3 = require('sqlite3')
const app = express()
app.use(express.json())
const convert = dbobject => {
  return {
    playerId: dbobject.player_id,
    playerName: dbobject.player_name,
    jerseyNumber: dbobject.jersey_number,
    role: dbobject.role,
  }
}

let db = null
let dbpath = path.join(__dirname, 'cricketTeam.db')
const intializeandstart = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('server started')
    })
  } catch (e) {
    console.log(`${e.message}`)
    process.exit(1)
  }
}
intializeandstart()
app.get('/players/', async (request, response) => {
  const dbquery = `
    select * from cricket_team;
    `
  const result = await db.all(dbquery)
  response.send(result.map(eachmember => convert(eachmember)))
})
app.post('/players/', async (request, response) => {
  const body = request.body
  const {playerName, jerseyNumber, role} = body
  const dbquery2 = `
    insert into cricket_team (player_name, jersey_number,role) values
    (
      "${playerName}",
      "${jerseyNumber}",
      "${role}"
    );
    `
  const result2 = await db.run(dbquery2)
  response.send(`Player Added to Team`)
})
app.get('/players/:playerId/', async (request, response) => {
  const playerid = request.params
  const {playerId} = playerid
  const dbquery3 = `
    select * from cricket_team where player_id=${playerId} ;
    `
  const result3 = await db.get(dbquery3)
  response.send(convert(result3))
})
app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const body4 = request.body
  const {playerName, jerseyNumber, role} = body4
  const db10 = `update cricket_team set player_name="${playerName}",
  jersey_number="${jerseyNumber}",
  role="${role}" where player_id=${playerId};
  `
  const result8 = await db.run(db10)
  response.send(`Player Details Updated`)
})
app.delete('/players/:playerId/', async (request, response) => {
  const playerid2 = request.params
  const {playerId} = playerid2
  const dbquery5 = `
    delete from cricket_team where player_id=${playerId} ;
    `
  const result3 = await db.run(dbquery5)
  response.send(`Player Removed`)
})
module.exports = app
