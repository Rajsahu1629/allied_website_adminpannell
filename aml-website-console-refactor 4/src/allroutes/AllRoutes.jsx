import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import PublicRoute from '../privateRoute/PublicRoute';
import Login from '../pages/Login';
import PrivateRoute from '../privateRoute/PrivateRoute';
import Dashboard from '../pages/Dashboard';
import AwardsPage from '../pages/AwardsPage';
import EventPages from '../pages/EventPages';
import BlogPage from '../pages/BlogPage';
import ProductsPage from '../pages/ProductsPage';
import CompanyProfilePage from '../pages/CompanyProfilePage';
import CompanyMilestonePage from '../pages/CompanyMilestonePage';
import PublicationsPage from '../pages/PublicationsPage';
import UpcommingEvents from '../pages/UpcommingEvents';
import TrustCircle from '../pages/TrustCircle';
import CommonContact from '../pages/CommonContact';
import FormerParticipant from '../pages/FormerParticipation';
import ChairmanMessagePage from '../pages/ChairmanMessagePage';
import LeadershipPage from '../pages/LeadershipPage';


const AllRoutes = () => {
  return (
    <Routes>
      {/* Public login route */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* All other routes are private */}
      <Route
        path="/admin-dashboard"
        element={
          <PrivateRoute>
            <Dashboard/>
          </PrivateRoute>
        }
      />
      <Route
        path="/awards-section"
        element={
          <PrivateRoute>
            <AwardsPage />
          </PrivateRoute>
        }
      />
       <Route
        path="/company-milestones-section"
        element={
          <PrivateRoute>
            <CompanyMilestonePage />
          </PrivateRoute>
        }
      />
       <Route
        path="/company-profile"
        element={
          <PrivateRoute>
            <CompanyProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/events"
        element={
          <PrivateRoute>
            <EventPages />
          </PrivateRoute>
        }
      />
      <Route
        path="/blogs-section"
        element={
          <PrivateRoute>
            <BlogPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/products-section"
        element={
          <PrivateRoute>
            <ProductsPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/publications"
        element={
          <PrivateRoute>
            <PublicationsPage />
          </PrivateRoute>
        }
      />

    

      {/* Fallback: redirect unknown routes to dashboard if logged in, else to login */}
      <Route
        path="*"
        element={
          <PrivateRoute>
            <Navigate to="/admin-dashboard" />
          </PrivateRoute>
        }
      />
      
          <Route
              path="/upcommingevents"
              element={
                <PrivateRoute>
                  <UpcommingEvents />
                </PrivateRoute>
              }
            />

            <Route
        path="/trustcircle"
        element={
          <PrivateRoute>
            <TrustCircle />
          </PrivateRoute>
        }
      />

        <Route
        path="/commoncontact"
        element={
          <PrivateRoute>
            <CommonContact  />
          </PrivateRoute>
        }
      />
      

      <Route
        path="/formerparticipant"
        element={
          <PrivateRoute>
            <FormerParticipant  />
          </PrivateRoute>
        }
      />

      <Route path="/chairman-message" element={<ChairmanMessagePage />} />
      <Route path="/leadership" element={<LeadershipPage />} />

    </Routes>
  );
};

export default AllRoutes;
