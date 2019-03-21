import React, { Component } from 'react';
import Select from 'react-select';
import Table from 'react-bootstrap/Table';
import TesterRow from './TesterRow.js'
import './style.css'
import TesterFilter from './TesterFilter.js';

const devices = require('./json/devices.json');
const testers = require('./json/testers.json');
// unique country values from testers data
const countries = [...new Set(testers.map(tester => tester.country))];
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCountries: [],
      selectedDevices: []
    }
  }

  handleCountryChange = (selectedCountries) => {
    this.setState({ selectedCountries: selectedCountries.map((selectedCountry) => (selectedCountry.value)) });
  }

  handleDeviceChange = (selectedDevices) => {
    this.setState({ selectedDevices: selectedDevices.map((selectedDevice) => (selectedDevice.value)) });
  }
  
  render() {
    return (
      <div className='center'>
        <h1>TestCo® Tester Browser</h1>
        <h2>Find testers perfect for your app!</h2>
        <p>Country:</p>
        <Select
          isMulti
          options={countries.map((country) => {
            return {
              value: country,
              label: country
            }
          })}
          onChange={this.handleCountryChange}>
        </Select>
        <p>Device:</p>
        <Select
          isMulti
          options={devices.map((device) => {
            return {
              value: device.deviceId,
              label: device.description
            }
          })}
          onChange={this.handleDeviceChange}>
        </Select>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Experience</th>
              <th>Country</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {TesterFilter(testers, this.state.selectedCountries, this.state.selectedDevices)
              .map((qualifiedTester) => (<TesterRow key={qualifiedTester.testerId} tester={qualifiedTester} />))
            }
          </tbody>
        </Table>
      </div>
    );
  }
}

export default App;
