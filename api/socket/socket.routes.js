module.exports = connectSockets

function connectSockets(io) {
    console.log('sockettttttttttt')
    io.on('connection', socket => {
        socket.on('treats newTreat', (pet) => {
            console.log('pet', pet)
            // console.log('treat', treat)
            // io.emit('treats addTreat', treat)
            // console.log(pet, 'petid')
            io.to(socket.myTopic).emit('treats addTreat', pet)
        })
        socket.on('treats topic', topic => {
            console.log('topic', topic)
            if (socket.myTopic) {
                socket.leave(socket.myTopic)
            }
            socket.join(topic)
            socket.myTopic = topic;
        })

        socket.on('chat newMsg', (msg)=> {
            console.log('msg', msg)
            io.to(socket.myTopic).emit('chat addMsg', msg)
            console.log(socket.myTopic)
            console.log('chat addmsg', msg)
        })
        socket.on('chat topic', topic => {
            console.log('topic', topic)
            if (socket.myTopic) {
                socket.leave(socket.myTopic)
            }
            socket.join(topic)
            socket.myTopic = topic;
        })

        
    })



}