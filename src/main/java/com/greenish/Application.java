package com.greenish;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@SpringBootApplication
@RestController
@RequestMapping("/api")
@CrossOrigin
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    private static Map<String, Map<String, Object>> orders = new ConcurrentHashMap<>();
    private static List<Map<String, Object>> products = new ArrayList<>();

    static {
        addProduct("Money Plant", 299);
        addProduct("Snake Plant", 399);
        addProduct("Aloe Vera", 199);
        addProduct("Peace Lily", 499);
        addProduct("Bamboo Plant", 349);
    }

    private static void addProduct(String name, int price) {
        Map<String, Object> p = new HashMap<>();
        p.put("id", UUID.randomUUID().toString());
        p.put("name", name);
        p.put("price", price);
        products.add(p);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        Map<String, Object> user = new HashMap<>();
        user.put("name", body.get("name"));
        user.put("phone", body.get("phone"));
        user.put("role", body.get("phone").equals("9999999999") ? "ADMIN" : "USER");
        return user;
    }

    @GetMapping("/products")
    public List<Map<String, Object>> getProducts() {
        return products;
    }

    @PostMapping("/order")
    public Map<String, Object> order(@RequestBody Map<String, Object> payload) {
        String id = "GREENISH-" + System.currentTimeMillis();
        payload.put("orderId", id);
        payload.put("status", "PLACED");
        orders.put(id, payload);

        return Map.of("orderId", id, "message", "Order Successful");
    }

    @GetMapping("/orders")
    public Collection<Map<String, Object>> getOrders() {
        return orders.values();
    }

    @PostMapping("/update")
    public Map<String, String> update(@RequestBody Map<String, String> body) {
        if (orders.containsKey(body.get("orderId"))) {
            orders.get(body.get("orderId")).put("status", body.get("status"));
            return Map.of("message", "Updated");
        }
        return Map.of("message", "Not Found");
    }

    @GetMapping("/track/{id}")
    public Map<String, Object> track(@PathVariable String id) {
        return orders.getOrDefault(id, Map.of("error", "Not Found"));
    }
}
