package com.miapp.reservashotel.service;

import com.miapp.reservashotel.model.Booking;
import com.miapp.reservashotel.model.Product;
import com.miapp.reservashotel.model.User;

public interface BookingMailService {

    void sendBookingConfirmation(User user, Product product, Booking booking);
}
