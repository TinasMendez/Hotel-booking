package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.exception.ResourceNotFoundException;
import com.miapp.reservashotel.model.Customer;
import com.miapp.reservashotel.repository.CustomerRepository;
import com.miapp.reservashotel.service.CustomerService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Customer service without Lombok annotations; simple CRUD.
 */
@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    // Manual constructor injection
    public CustomerServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Override
    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
    }

    @Override
    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    @Override
    public Customer updateCustomer(Long id, Customer updatedCustomer) {
        Customer existing = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));

        existing.setName(updatedCustomer.getName());
        existing.setEmail(updatedCustomer.getEmail());
        existing.setPhone(updatedCustomer.getPhone());

        return customerRepository.save(existing);
    }

    @Override
    public void deleteCustomer(Long id) {
        Customer existing = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        customerRepository.delete(existing);
    }
}

