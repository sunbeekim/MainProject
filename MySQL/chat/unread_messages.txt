CREATE TABLE `unread_messages` (
   `id` int(11) NOT NULL AUTO_INCREMENT,
   `chatroomId` int(11) NOT NULL,
   `userEmail` varchar(255) NOT NULL,      -- 사용자 이메일
   `unreadCount` int(11) DEFAULT '0',      -- 읽지 않은 메시지 수
   `lastReadMessageId` int(11) DEFAULT NULL, -- 마지막으로 읽은 메시지 ID
   PRIMARY KEY (`id`),
   UNIQUE KEY `unique_chatroom_user` (`chatroomId`, `userEmail`),
   KEY `idx_user` (`userEmail`),
   CONSTRAINT `fk_unread_chatroom` FOREIGN KEY (`chatroomId`) REFERENCES `chatrooms` (`chatroomId`) ON DELETE CASCADE,
   CONSTRAINT `fk_unread_user` FOREIGN KEY (`userEmail`) REFERENCES `Users` (`email`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;