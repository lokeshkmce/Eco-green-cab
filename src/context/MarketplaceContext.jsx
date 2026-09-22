import React, { createContext, useContext, useState, useEffect } from 'react';
import { cars as initialCars } from '../data/cars';

const MarketplaceContext = createContext();

export const useMarketplace = () => useContext(MarketplaceContext);

export const MarketplaceProvider = ({ children }) => {
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);

  // Initialize from LocalStorage or default data
  useEffect(() => {
    localStorage.removeItem('eco_cars'); // Force refresh to pick up Tamil Nadu cities
    const savedCars = localStorage.getItem('eco_cars');
    if (savedCars) {
      setCars(JSON.parse(savedCars));
    } else {
      // Add default status 'APPROVED' to existing static cars
      const defaultCars = initialCars.map(car => ({ ...car, status: 'APPROVED' }));
      setCars(defaultCars);
      localStorage.setItem('eco_cars', JSON.stringify(defaultCars));
    }

    const savedBookings = localStorage.getItem('eco_bookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }

    const savedMessages = localStorage.getItem('eco_messages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    if (cars.length > 0) localStorage.setItem('eco_cars', JSON.stringify(cars));
  }, [cars]);

  useEffect(() => {
    if (bookings.length > 0) localStorage.setItem('eco_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    if (messages.length > 0) localStorage.setItem('eco_messages', JSON.stringify(messages));
  }, [messages]);

  // Actions
  const addCar = (newCar) => {
    const carWithId = {
      ...newCar,
      id: Date.now(),
      status: 'PENDING',
      rating: 0,
      reviews: 0
    };
    setCars(prev => [...prev, carWithId]);
  };

  const updateCarStatus = (id, newStatus, finalPrice = null) => {
    setCars(prev => prev.map(c => {
      if (c.id === id) {
        return { 
          ...c, 
          status: newStatus,
          price: finalPrice !== null ? finalPrice : c.price
        };
      }
      return c;
    }));
  };

  const updateOwnerEmail = (oldEmail, newEmail) => {
    setCars(prev => prev.map(c => {
      if (c.ownerEmail === oldEmail) {
        return { ...c, ownerEmail: newEmail };
      }
      return c;
    }));
  };

  const sendCounterOffer = (id, newPrice) => {
    setCars(prev => prev.map(c => 
      c.id === id ? { ...c, status: 'COUNTERED', counterPrice: parseInt(newPrice, 10) } : c
    ));
  };

  const bookCar = (bookingDetails) => {
    const newBooking = {
      ...bookingDetails,
      id: 'BK-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      status: 'CONFIRMED',
      createdAt: new Date().toISOString()
    };
    setBookings(prev => [...prev, newBooking]);
    return newBooking;
  };

  const addMessage = (msg) => {
    setMessages(prev => [{ ...msg, id: Date.now(), date: new Date().toISOString(), status: 'OPEN', reply: null }, ...prev]);
  };

  const replyToMessage = (msgId, replyText) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: 'RESOLVED', reply: replyText, replyDate: new Date().toISOString() } : m));
  };

  return (
    <MarketplaceContext.Provider value={{ 
      cars, 
      addCar, 
      updateCarStatus, 
      sendCounterOffer,
      updateOwnerEmail,
      bookings, 
      bookCar,
      messages,
      addMessage,
      replyToMessage
    }}>
      {children}
    </MarketplaceContext.Provider>
  );
};
