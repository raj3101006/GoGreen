package com.greenish;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@SpringBootApplication
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // 🔥 IMPORTANT: Ye frontend ko backend se connect hone dega bina CORS error ke
public class Application {
    
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
        System.out.println("🚀 GREENISH ENTERPRISE SERVER IS LIVE ON PORT 8080!");
    }

    // Live Orders Database (In-Memory Simulation)
    private static List<Map<String, Object>> ordersDatabase = new ArrayList<>();

    // 1. CREATE: Save New Order from Checkout
    @PostMapping("/commitTransaction")
    public Map<String, String> saveOrder(@RequestBody Map<String, Object> orderData) {
        ordersDatabase.add(orderData);
        System.out.println("✅ NEW ORDER RECEIVED: ID - " + orderData.get("id") + " | Amount: ₹" + orderData.get("total"));
        
        Map<String, String> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("message", "Order securely saved in Enterprise Java Server!");
        return response;
    }

    // 2. READ: Fetch All Orders for Dashboards
    @GetMapping("/fetchOrders")
    public List<Map<String, Object>> getOrders() {
        System.out.println("📦 Sending " + ordersDatabase.size() + " live orders to frontend.");
        return ordersDatabase;
    }

    // 3. UPDATE: Change Order Status (Processing -> Shipped -> Delivered)
    @PutMapping("/updateOrder/{id}")
    public Map<String, String> updateOrderStatus(@PathVariable String id, @RequestBody Map<String, String> statusData) {
        String newStatus = statusData.get("status");
        
        for (Map<String, Object> order : ordersDatabase) {
            if (order.get("id").equals(id)) {
                order.put("status", newStatus);
                System.out.println("🔄 STATUS UPDATED: Order " + id + " is now marked as [" + newStatus + "]");
                break;
            }
        }
        
        Map<String, String> response = new HashMap<>();
        response.put("status", "UPDATED");
        return response;
    }

    // 4. DELETE: Admin drops/cancels an order completely
    @DeleteMapping("/deleteOrder/{id}")
    public Map<String, String> deleteOrder(@PathVariable String id) {
        ordersDatabase.removeIf(order -> order.get("id").equals(id));
        System.out.println("❌ ORDER DELETED: Order " + id + " has been permanently dropped by Admin.");
        
        Map<String, String> response = new HashMap<>();
        response.put("status", "DELETED");
        return response;
    }
}
