
module.exports = connectSockets
function connectSockets(io) {
    console.log('socket')
    io.on('connection', socket => {
        socket.on('treats newTreat',(pet) => {
            // console.log('treat', treat)
            // io.emit('treats addTreat', treat)
            console.log(pet, 'petid')
            io.to(socket.myTopic).emit('treats addTreat', pet)
        })
        socket.on('treats topic', topic=>{
            // console.log('topic', topic)
                if (socket.myTopic) {
                    socket.leave(socket.myTopic)
                }
                socket.join(topic)
                socket.myTopic = topic;
            })
    })
}