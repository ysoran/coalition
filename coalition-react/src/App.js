import React, { useState } from 'react';
import './App.css';
import SignUp from './components/sign-up/sign-up';
import Brokers from './components/brokers/brokers';
import { Tabs, Tab, Box } from '@material-ui/core';
import styled from 'styled-components';

const StyledHeader = styled.div`
  text-align: left;
  padding-top: 20px;
  padding-bottom: 20px;  
  padding-left: 30px;
  width: 100%;
  border-bottom: 1px solid #a44;
  text-transform: uppercase;
  font-weight: bold;
  background: #aaa;
`;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <span>{children}</span>
        </Box>
      )}
    </div>
  );
}

function App() {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="App">
      <StyledHeader>Coalition project</StyledHeader>
      <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
        <Tab label="Sign up" />
        <Tab label="Brokers" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <SignUp changeTab={setValue} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Brokers />
      </TabPanel>



    </div>
  );
}

export default App;
