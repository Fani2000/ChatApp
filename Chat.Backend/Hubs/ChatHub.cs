using Chat.Backend.DataService;
using Chat.Backend.Models;
using Microsoft.AspNetCore.SignalR;

namespace Chat.Backend.Hubs
{
    public class ChatHub : Hub
    {
        private readonly SharedDB _shared;

        public ChatHub(SharedDB shared) => _shared = shared;

        public async Task JoinChat(UserConnection conn)
        {
            await Clients.All.SendAsync("ReceiveMessage", "admin", $"{conn.Username} has Joined.");
        }

        public async Task JoinSpecificChatRoom(UserConnection conn)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, conn.ChatRoom);

            System.Console.WriteLine("COnnections🎉🎉🎉");
            Console.WriteLine(conn);

            _shared.connections[Context.ConnectionId] = conn;

            await Clients.Group(conn.ChatRoom).SendAsync("JoinSpecificChatRoomMessage", "admin", $"{conn.Username} has joined {conn.ChatRoom}.");
        }

        public async Task SendMessage(string msg)
        {
            if (_shared.connections.TryGetValue(Context.ConnectionId, out var conn))
            {
                await Clients.Group(conn.ChatRoom)
                    .SendAsync("ReceiveSpecificMessage", conn.Username, msg);
            }
        }

    }
}