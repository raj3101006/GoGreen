package com.greenish;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@SpringBootApplication
@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins="*")
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    private static List<Map<String,Object>> products = new ArrayList<>();
    private static Map<String,Map<String,Object>> orders = new ConcurrentHashMap<>();

    static{
        addProduct(1,"AI Smart Plant","Indoor",2499,4.8);
        addProduct(2,"Premium Monstera","Premium",3999,4.9);
        addProduct(3,"Snake Plant Pro","Eco",1999,4.7);
        addProduct(4,"Ficus Enterprise","Luxury",5999,5.0);
    }

    private static void addProduct(int id,String name,String cat,double price,double rating){
        Map<String,Object> p=new HashMap<>();
        p.put("id",id);
        p.put("name",name);
        p.put("category",cat);
        p.put("price",price);
        p.put("rating",rating);
        products.add(p);
    }

    @GetMapping("/products")
    public List<Map<String,Object>> getProducts(){
        return products;
    }

    @PostMapping("/checkout")
    public Map<String,Object> checkout(@RequestBody Map<String,Object> payload){
        String orderId="NAVYA-"+System.currentTimeMillis();
        payload.put("orderId",orderId);
        payload.put("status","PLACED");
        orders.put(orderId,payload);

        return Map.of("success",true,"orderId",orderId);
    }

    @GetMapping("/orders")
    public Collection<Map<String,Object>> getOrders(){
        return orders.values();
    }

    @PostMapping("/update-status/{id}")
    public Map<String,String> updateStatus(@PathVariable String id,@RequestParam String status){
        if(orders.containsKey(id)){
            orders.get(id).put("status",status);
        }
        return Map.of("message","Updated");
    }

    @GetMapping("/track/{id}")
    public Map<String,Object> track(@PathVariable String id){
        return orders.getOrDefault(id,Map.of("error","Not Found"));
    }

    @GetMapping("/admin")
    public Map<String,Object> analytics(){
        double revenue=orders.values().stream()
                .mapToDouble(o->Double.parseDouble(o.get("total").toString()))
                .sum();

        return Map.of(
                "totalOrders",orders.size(),
                "revenue",revenue,
                "products",products.size()
        );
    }
}
