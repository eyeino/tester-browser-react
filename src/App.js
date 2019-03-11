import React, { Component } from 'react';
import Select from 'react-select';
import Table from 'react-bootstrap/Table';
import './style.css'

const bugs = require('./json/bugs.json');
const devices = require('./json/devices.json');
const testerDevice = require('./json/tester_device.json');
const testers = require('./json/testers.json');
// unique country values from testers data
const countries = [...new Set(testers.map(tester => tester.country))];
class App extends Component {
  componentWillMount() {
    // find unique country values amongst testers to use in multiselect component
    
    this.setState({
      selectedCountries: [],
      selectedDevices: []
    });
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
        <h1>APPLAUSE</h1>
        <h2>Tester Browser</h2>
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
            {testers.filter((tester) => { // all testers
              return this.state.selectedCountries.includes(tester.country)
            }).map((tester) => { // testers who are in a selected country
              const selectDevicesTesterHas = testerDevice.filter((device) => { // all devices
                return tester.testerId === device.testerId
              }).filter((testersDevice) => { // devices that the tester has
                return this.state.selectedDevices.includes(testersDevice.deviceId)
              })
              return {
                tester: tester,
                devices: selectDevicesTesterHas
              }
            }).filter((tester) => (tester.devices.length > 0)).map((suitableCandidate) => { // testers in sel country and have sel devices
              const tester = suitableCandidate.tester;
              const testersDevices = suitableCandidate.devices.map((device) => (device.deviceId))
              tester.bugCount = bugs.reduce((acc, bug) => { // add up all bugs for sel devices for testers
                if (testersDevices.includes(bug.deviceId) && (bug.testerId === tester.testerId)) {
                  acc += 1
                }
                return acc
              }, 0)
              return tester
            }).sort((a, b) => (b.bugCount - a.bugCount)).map((tester) => {
              return (
                <tr key={tester.testerId}>
                  <td>{tester.bugCount}</td>
                  <td>{tester.country}</td>
                  <td>{tester.firstName + " " + tester.lastName}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default App;
