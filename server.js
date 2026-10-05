import { Socket } from 'node:dgram';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {WebSocketServer} from 'ws';
import { publishRedis, subscribeRedis } from './connection.js';

const PORT = process.env.PORT || 3000;
const httpServer = http.createServer(async function (req, res) {
    const indexFile = await fs.readFile(path.resolve('./index.html'));
    res.setHeader('Content-Type', 'text/html');
    return res.end(indexFile);
});
const redisChannel = 'Ws-message';
const wsServer = new WebSocketServer({server: httpServer});

subscribeRedis.subscribe(redisChannel);
subscribeRedis.on('message', (channel, message)=>{
    if(channel === redisChannel){
        wsServer.clients.forEach((client)=>{
            client.send(message.toString());
        })
    }
})

wsServer.on('connection', (WebSocket)=>{
    console.log(`WebSocket connection established`);

    WebSocket.on('message',async(data)=>{
        console.log('Websocket message received:', data.toString());
        // Publish the message to Redis
        console.log('Publishing message to Redis:');
        await publishRedis.publish(redisChannel,data.toString());
    });
});

httpServer.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})