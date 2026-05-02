from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.rooms = {}

    async def connect(self, room_id: str, websocket: WebSocket):
        await websocket.accept()
        self.rooms.setdefault(room_id, []).append(websocket)

    def disconnect(self, room_id: str, websocket: WebSocket):
        self.rooms[room_id].remove(websocket)

    async def broadcast(self, room_id: str, data: dict):
        for connection in self.rooms.get(room_id, []):
            await connection.send_json(data)

manager = ConnectionManager()