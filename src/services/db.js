import { collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export const fetchProperties = async (filters, fetchAll = false) => {
  try {
    const q = query(collection(db, 'properties'));
    
    const querySnapshot = await getDocs(q);
    let properties = [];
    querySnapshot.forEach((doc) => {
      properties.push({ id: doc.id, ...doc.data() });
    });

    if (filters) {
      if (filters.city) {
        properties = properties.filter(p => p.city.toLowerCase().includes(filters.city.toLowerCase()));
      }
      if (filters.street) {
        properties = properties.filter(p => p.street.toLowerCase().includes(filters.street.toLowerCase()));
      }
      if (filters.rooms) {
        properties = properties.filter(p => p.rooms >= parseInt(filters.rooms));
      }
    }
    
    // Sort logic can be added here if you want latest first based on createdAt
    properties.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return properties;
  } catch (err) {
    console.error("Fetch Error:", err);
    return [];
  }
};

export const getPropertyById = async (id) => {
  try {
    const docRef = doc(db, 'properties', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (err) {
    console.error("Get Property Error:", err);
    return null;
  }
}

export const addProperty = async (property) => {
  try {
    const docRef = await addDoc(collection(db, 'properties'), {
      ...property,
      isBooked: false,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...property, isBooked: false };
  } catch (err) {
    console.error("Add Property Error:", err);
    throw err;
  }
};

export const setPropertyBookedStatus = async (id, status) => {
  try {
    const docRef = doc(db, 'properties', id);
    await updateDoc(docRef, { isBooked: status });
    return true;
  } catch (err) {
    console.error("Update Property Error:", err);
    return false;
  }
};

export const createBookingRequest = async (bookingData) => {
  try {
    const docRef = await addDoc(collection(db, 'bookings'), {
      ...bookingData,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...bookingData };
  } catch (err) {
    console.error("Create Booking Error:", err);
    throw err;
  }
};

export const fetchUserBookings = async (userId) => {
  if (!userId) return [];
  try {
    const q = query(collection(db, 'bookings'), where('userId', '==', String(userId)));
    const querySnapshot = await getDocs(q);
    const bookings = [];
    
    for (const d of querySnapshot.docs) {
      const bData = d.data();
      // Fetch property details as well
      const prop = await getPropertyById(bData.propertyId);
      bookings.push({ id: d.id, ...bData, property: prop });
    }
    
    return bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (err) {
    console.error("Fetch User Bookings Error:", err);
    return [];
  }
};

export const fetchPropertyBookings = async (propertyId) => {
  if (!propertyId) return [];
  try {
    const q = query(
      collection(db, 'bookings'),
      where('propertyId', '==', String(propertyId)),
      where('status', '==', 'approved')
    );
    const querySnapshot = await getDocs(q);
    const bookings = [];
    querySnapshot.forEach((doc) => {
      bookings.push({ id: doc.id, ...doc.data() });
    });
    return bookings;
  } catch (err) {
    console.error("Fetch Property Bookings Error:", err);
    return [];
  }
};
