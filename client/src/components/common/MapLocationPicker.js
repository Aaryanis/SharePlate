import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { Spinner, Button, Alert, Form, Row, Col } from 'react-bootstrap';
import { FaMapMarkedAlt, FaCrosshairs, FaMapPin } from 'react-icons/fa';

const libraries = ['places'];

const MapLocationPicker = ({ 
  setLocation, 
  initialLocation = { coordinates: [0, 0], address: '' },
  height = '400px' 
}) => {
  const [marker, setMarker] = useState({
    lat: initialLocation.coordinates[1] || 20.5937,
    lng: initialLocation.coordinates[0] || 78.9629
  });
  
  const [manualCoords, setManualCoords] = useState({
    lat: initialLocation.coordinates[1] || 20.5937,
    lng: initialLocation.coordinates[0] || 78.9629
  });
  
  const [manualAddress, setManualAddress] = useState(initialLocation.address || '');
  const [useManualEntry, setUseManualEntry] = useState(false);
  const [locationSet, setLocationSet] = useState(false);

  // Try to load Google Maps - will fail without API key
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  useEffect(() => {
    if (initialLocation.coordinates[0] !== 0 && initialLocation.coordinates[1] !== 0) {
      setMarker({
        lat: initialLocation.coordinates[1],
        lng: initialLocation.coordinates[0]
      });
      setLocationSet(true);
    }
  }, [initialLocation]);

  const onMapClick = useCallback((event) => {
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();
    
    setMarker({
      lat: newLat,
      lng: newLng
    });
    
    // Set location with coordinates and a default address
    setLocation({
      coordinates: [newLng, newLat],
      address: `Lat: ${newLat.toFixed(6)}, Lng: ${newLng.toFixed(6)}`
    });
    
    setLocationSet(true);
  }, [setLocation]);

  // Get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          setMarker({ lat: latitude, lng: longitude });
          setManualCoords({ lat: latitude, lng: longitude });
          
          // Set location with coordinates and a default address
          setLocation({
            coordinates: [longitude, latitude],
            address: `Location detected at Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`
          });
          
          setLocationSet(true);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enter it manually.');
          setUseManualEntry(true);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser. Please enter your location manually.');
      setUseManualEntry(true);
    }
  };

  // Use manual coordinates
  const handleManualSubmit = (e) => {
    e.preventDefault();
    
    setMarker({
      lat: parseFloat(manualCoords.lat),
      lng: parseFloat(manualCoords.lng)
    });
    
    setLocation({
      coordinates: [parseFloat(manualCoords.lng), parseFloat(manualCoords.lat)],
      address: manualAddress || `Lat: ${manualCoords.lat}, Lng: ${manualCoords.lng}`
    });
    
    setLocationSet(true);
  };

  // Use default location (center of India)
  const useDefaultLocation = () => {
    const defaultLat = 20.5937;
    const defaultLng = 78.9629;
    
    setMarker({ lat: defaultLat, lng: defaultLng });
    setManualCoords({ lat: defaultLat, lng: defaultLng });
    
    setLocation({
      coordinates: [defaultLng, defaultLat],
      address: 'Default location: India'
    });
    
    setLocationSet(true);
  };

  return (
    <div className="map-container">
      {locationSet && (
        <Alert variant="success" className="mb-3">
          <FaMapPin className="me-2" /> Location set successfully!
        </Alert>
      )}
      
      {loadError || !isLoaded ? (
        <div className="map-fallback">
          <Alert variant="warning" className="mb-3">
            Map could not be loaded. Please use one of the options below to set your location.
          </Alert>
          
          <div className="d-grid gap-2 mb-4">
            <Button 
              variant="primary" 
              onClick={getCurrentLocation}
              className="d-flex align-items-center justify-content-center"
            >
              <FaCrosshairs className="me-2" /> Use My Current Location
            </Button>
            
            <Button 
              variant="secondary" 
              onClick={useDefaultLocation}
              className="d-flex align-items-center justify-content-center"
            >
              <FaMapMarkedAlt className="me-2" /> Use Default Location
            </Button>
            
            <Button 
              variant="outline-primary" 
              onClick={() => setUseManualEntry(!useManualEntry)}
              className="d-flex align-items-center justify-content-center"
            >
              {useManualEntry ? 'Hide Manual Entry' : 'Enter Location Manually'}
            </Button>
          </div>
          
          {useManualEntry && (
            <Form onSubmit={handleManualSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Latitude</Form.Label>
                    <Form.Control 
                      type="number" 
                      step="0.000001"
                      value={manualCoords.lat}
                      onChange={(e) => setManualCoords({...manualCoords, lat: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Longitude</Form.Label>
                    <Form.Control 
                      type="number" 
                      step="0.000001"
                      value={manualCoords.lng}
                      onChange={(e) => setManualCoords({...manualCoords, lng: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>Address (optional)</Form.Label>
                <Form.Control 
                  type="text"
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  placeholder="e.g., 123 Main St, City, Country"
                />
              </Form.Group>
              
              <div className="d-grid">
                <Button variant="success" type="submit">
                  Set Location
                </Button>
              </div>
            </Form>
          )}
        </div>
      ) : (
        <>
          <GoogleMap
            mapContainerStyle={{
              width: '100%',
              height: height,
            }}
            center={marker}
            zoom={13}
            onClick={onMapClick}
          >
            <Marker 
              position={marker} 
              draggable={true}
              onDragEnd={(e) => onMapClick(e)}
            />
          </GoogleMap>
          
          <div className="mt-3 mb-2 d-flex gap-2">
            <Button 
              variant="primary" 
              size="sm"
              onClick={getCurrentLocation}
              className="d-flex align-items-center"
            >
              <FaCrosshairs className="me-1" /> Use My Current Location
            </Button>
            
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={useDefaultLocation}
              className="d-flex align-items-center"
            >
              <FaMapMarkedAlt className="me-1" /> Use Default Location
            </Button>
          </div>
          
          <small className="text-muted d-block">
            Click on the map to set your location or drag the marker to adjust
          </small>
        </>
      )}
    </div>
  );
};

export default MapLocationPicker;