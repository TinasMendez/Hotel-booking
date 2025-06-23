package com.miapp.reservashotel.service;

import com.miapp.reservashotel.model.Customer;
import java.util.List;

/*** Defines the business logic for customers.*/

public interface CustomerService {
    Customer createCustomer(Customer customer);
    List<Customer> listCustomers();
    void deleteCustomer(Long id);
    Customer getCustomerById(Long id);
    Customer updateCustomer(Long id, Customer updatedCustomer);



}
