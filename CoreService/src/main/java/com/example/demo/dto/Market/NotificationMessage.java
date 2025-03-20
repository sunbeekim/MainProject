package com.example.demo.dto.Market;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationMessage {
    private String receiverEmail;
    private String message;
    
    @Override
    public String toString() {
        return "NotificationMessage{" +
                "receiverEmail='" + receiverEmail + '\'' +
                ", message='" + message + '\'' +
                '}';
    }
}
