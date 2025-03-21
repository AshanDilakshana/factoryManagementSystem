import React, { useState,useContext } from 'react';
import { Nav, Container, Row, Col, Tab } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { AuthContext } from '../TEST/context/AuthContext';
//import '../workoderManager/';
// import FactoryLogo from './assets/factory-logo.png';

import Workoder from './workOders';
import Dashboard from './dashboard';



const AdminProfile = () => {
  const { user } = useContext(AuthContext);
 const [activeTab, setActiveTab] = useState('dashboard');

  return (
 <Container fluid className="mt-6" class="m-0" >  
 <Row className="min-vh-100">
      <Col md={2} lg={2} className="bg-light text-black p-0 m-0 ">

        <Nav variant="pills" className="flex-column">
          <h4 className='d-flex align-items-center py-3 px-'>FACTORY MANAGEMENT</h4>
          
          {/* Logo placeholder - replace with your actual logo */}
          <div className="p-3">
            <div className="bg-secondary" style={{ height: "160px", width: "100%" }}></div>
            {/* Uncomment when you have a logo */}
            {/* <img src={FactoryLogo} className="img-thumbnail" alt="Factory Logo"/> */}
          </div>
          
          <Nav.Item>
            <Nav.Link
              eventKey="dashboard"
              active={activeTab === 'dashboard'}
              onClick={() => setActiveTab('dashboard')}
              className="d-flex align-items-center py-3 px-3 text-black">
              <i className="fas fa-tachometer-alt me-2"></i>
              dashboard
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link
              eventKey="orders"
              active={activeTab === 'orders'}
              onClick={() => setActiveTab('orders')}
              className="d-flex align-items-center py-3 px-3 text-black">
              <i className="fas fa-shopping-cart me-2"></i>
              orders
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link
              eventKey="workOrders"
              active={activeTab === 'workOrders'}
              onClick={() => setActiveTab('workOrders')}
              className="d-flex align-items-center py-3 px-3 text-black">
              <i className="fas fa-tasks me-2"></i>
              work Orders
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link
              eventKey="button"
              active={activeTab === 'button'}
              onClick={() => setActiveTab('button')}
              className="d-flex align-items-center py-3 px-3 text-black">
              <i className="fas fa-cog me-2"></i>
              Button
            </Nav.Link>
          </Nav.Item>
          
          {/* Logout button at bottom */}
          <div className="mt-auto" style={{ position: 'absolute', bottom: '-150px', left: '150px' }}>
            <Nav.Link className="d-flex align-items-center py-2 px-3 text-black">
              <span className="me-2">logout</span>
              <i className="fas fa-sign-out-alt"></i>
            </Nav.Link>
          </div>
        </Nav>
        <Nav.Item>
                <Nav.Link
                  eventKey=" customerMessage"
                  active={activeTab === 'customerMessage'}
                  onClick={() => setActiveTab('customerMessage')}
                  className="d-flex align-items-center py-3 px-3 text-black hover-bg-primary" >
                  <i className="fas fa-calendar-alt me-2"></i>
                  customer Message
                </Nav.Link>
              </Nav.Item>
            
        </Col>
              
        <Col md={1} lg={10} className="bg-light ">
            <Tab.Content className="p-4">

              <Tab.Pane active={activeTab === 'customerMessage'} >
              <Workoder /></Tab.Pane>

              <Tab.Pane active={activeTab === 'dashboard'} >
              <Dashboard /></Tab.Pane>

              <Tab.Pane active={activeTab === 'workOrders'} >
              <Workoder /></Tab.Pane>



            </Tab.Content>
          </Col>  
      </Row>
    </Container>
  );
};

export default AdminProfile;