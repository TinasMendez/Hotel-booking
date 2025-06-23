package com.miapp.reservashotel.controller;

import com.miapp.reservashotel.model.Product;
import com.miapp.reservashotel.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para manejar peticiones relacionadas con productos.
 */
@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*") // permite peticiones desde el frontend
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping
    public ResponseEntity<Product> crearProducto(@RequestBody Product product) {
        return ResponseEntity.ok(productService.crearProducto(product));
    }

    @GetMapping
    public ResponseEntity<List<Product>> listarProductos() {
        return ResponseEntity.ok(productService.listarProductos());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        productService.eliminarProducto(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
public ResponseEntity<Product> actualizarProducto(@PathVariable Long id, @RequestBody Product producto) {
    return ResponseEntity.ok(productService.actualizarProducto(id, producto));
}

}

