
module.exports = connectSockets
function connectSockets(io) {
    console.log('socket')
    io.on('connection', socket => {
        console.log('socket connected')
        socket.on('treats newTreat',() => {
            // console.log('treat', treat)
            // io.emit('treats addTreat', treat)
            io.to(socket.myTopic).emit('treats addTreat')
        })
        socket.on('treats topic', topic=>{
            console.log('topic', topic)
                if (socket.myTopic) {
                    socket.leave(socket.myTopic)
                }
                socket.join(topic)
                socket.myTopic = topic;
            })
    })
}