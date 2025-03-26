import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Form, Button, Spinner } from 'react-bootstrap';
import { FaTrophy, FaStar, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import api from '../utils/api';
import RatingStars from '../components/common/RatingStars';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [location, setLocation] = useState({
    lat: 20.5937,
    lng: 78.9629
  });
  const [distance, setDistance] = useState(10);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(userPos);
          fetchLeaderboard(userPos.lat, userPos.lng, distance);
        },
        () => {
          console.log('Unable to get location. Using default location.');
          fetchLeaderboard(location.lat, location.lng, distance);
        }
      );
    } else {
      fetchLeaderboard(location.lat, location.lng, distance);
    }
  }, []);

  const fetchLeaderboard = async (lat, lng, dist) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/ratings/leaderboard?lat=${lat}&lng=${lng}&distance=${dist}`);
      setLeaderboard(res.data.data);
    } catch (err) {
      setError('Failed to load leaderboard data');
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const handleDistanceChange = (e) => {
    setDistance(Number(e.target.value));
  };

  const handleSearch = () => {
    setSearching(true);
    fetchLeaderboard(location.lat, location.lng, distance);
  };

  return (
    <Container className="py-4">
      <div className="text-center mb-4">
        <h1><FaTrophy className="text-warning me-2" />Food Givers Leaderboard</h1>
        <p className="lead text-muted">Celebrating our most active food givers in your area</p>
      </div>

      <Row className="mb-4">
        <Col md={8} className="mx-auto">
          <Card className="shadow-sm">
            <Card.Body>
              <h5><FaMapMarkerAlt className="me-2 text-primary" />Search Area</h5>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Distance (km)</Form.Label>
                  <Form.Control
                    type="range"
                    min="1"
                    max="50"
                    value={distance}
                    onChange={handleDistanceChange}
                  />
                  <div className="d-flex justify-content-between">
                    <small>1 km</small>
                    <small>{distance} km</small>
                    <small>50 km</small>
                  </div>
                </Form.Group>
                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    onClick={handleSearch}
                    disabled={searching}
                  >
                    {searching ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <FaSearch className="me-2" /> Update Leaderboard
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading leaderboard...</p>
        </div>
      ) : error ? (
        <Card className="text-center py-5">
          <Card.Body>
            <p className="text-danger">{error}</p>
            <Button variant="primary" onClick={handleSearch}>Try Again</Button>
          </Card.Body>
        </Card>
      ) : (
        <Card className="shadow">
          <Card.Body>
            {leaderboard.length === 0 ? (
              <div className="text-center py-5">
                <p>No ratings data available in this area.</p>
                <p className="text-muted">Be the first to share food and receive ratings!</p>
              </div>
            ) : (
              <Table responsive className="leaderboard-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Giver</th>
                    <th>Rating</th>
                    <th>Total Ratings</th>
                    <th>Badge</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((giver, index) => (
                    <tr key={giver._id} className={index < 3 ? 'table-light' : ''}>
                      <td className="text-center">
                        {index === 0 ? (
                          <FaTrophy className="text-warning" size={24} />
                        ) : index === 1 ? (
                          <FaTrophy className="text-secondary" size={22} />
                        ) : index === 2 ? (
                          <FaTrophy style={{ color: '#cd7f32' }} size={20} />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </td>
                      <td>{giver.name}</td>
                      <td className="align-middle">
                        <RatingStars rating={giver.averageRating} />
                        <span className="ms-2">{giver.averageRating}</span>
                      </td>
                      <td>{giver.totalRatings}</td>
                      <td>
                        {index === 0 ? (
                          <Badge bg="warning" text="dark">Gold Giver</Badge>
                        ) : index === 1 ? (
                          <Badge bg="secondary">Silver Giver</Badge>
                        ) : index === 2 ? (
                          <Badge bg="danger">Bronze Giver</Badge>
                        ) : giver.totalRatings > 10 ? (
                          <Badge bg="info">Star Giver</Badge>
                        ) : (
                          <Badge bg="success">Active Giver</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Leaderboard;