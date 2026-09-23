import React, { createContext, useContext, useState, useEffect } from 'react';
import { cars as initialCars } from '../data/cars';

const MarketplaceContext = createContext();

export const useMarketplace = () => useContext(MarketplaceContext);

export const MarketplaceProvider = ({ children }) => {
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);

  // Initialize — always ensure all static cars are APPROVED, with safe error recovery
  useEffect(() => {
    try {
      // Safely parse saved cars — if corrupt, fall back to empty
      let parsed = [];
      try {
        const raw = localStorage.getItem('eco_cars');
        if (raw) {
          const parsedRaw = JSON.parse(raw);
          if (Array.isArray(parsedRaw)) {
            parsed = parsedRaw.filter(c => c && c.id); // Bulletproof against null/invalid objects
          }
        }
      } catch (e) {
        console.warn('eco_cars localStorage was corrupt, resetting.', e);
        localStorage.removeItem('eco_cars');
        parsed = [];
      }

      // Static car IDs — always authoritative
      const staticIds = new Set(initialCars.map(c => c.id));

      // Rebuild static cars as APPROVED, preserving any admin price overrides
      const staticApproved = initialCars.map(car => {
        const saved = parsed.find(s => s.id === car.id);
        return saved ? { ...car, ...saved, status: 'APPROVED' } : { ...car, status: 'APPROVED' };
      });

      // Keep user-submitted cars that aren't in static data
      const userSubmitted = parsed.filter(c => !staticIds.has(c.id));

      const merged = [...staticApproved, ...userSubmitted];
      setCars(merged);
      localStorage.setItem('eco_cars', JSON.stringify(merged));
    } catch (e) {
      // Nuclear fallback — if anything fails, load static cars fresh
      console.error('MarketplaceContext init error, falling back to static data:', e);
      localStorage.removeItem('eco_cars');
      const fallback = initialCars.map(car => ({ ...car, status: 'APPROVED' }));
      setCars(fallback);
      localStorage.setItem('eco_cars', JSON.stringify(fallback));
    }

    try {
      const savedBookings = localStorage.getItem('eco_bookings');
      if (savedBookings) setBookings(JSON.parse(savedBookings));
    } catch (e) {
      localStorage.removeItem('eco_bookings');
    }

    try {
      const savedMessages = localStorage.getItem('eco_messages');
      if (savedMessages) setMessages(JSON.parse(savedMessages));
    } catch (e) {
      localStorage.removeItem('eco_messages');
    }

    // Sync across tabs
    const handleStorage = (e) => {
      if (e.key === 'eco_cars' && e.newValue) {
        setCars(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    
    return () => window.removeEventListener('storage', handleStorage);
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
