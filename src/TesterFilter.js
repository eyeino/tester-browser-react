const bugs = require('./json/bugs.json');
const testerDevice = require('./json/tester_device.json');

export default function TesterFilter(testers, selectedCountries, selectedDevices) {
  
  return testers.filter((tester) => { // all testers
    return selectedCountries.includes(tester.country)
  })
  .map((tester) => { // testers who are in a selected country
    const selectDevicesTesterHas = testerDevice.filter((device) => { // all devices
      return tester.testerId === device.testerId
    })
    .filter((testersDevice) => { // devices that the tester has
      return selectedDevices.includes(testersDevice.deviceId)
    })
    return {
      tester: tester,
      devices: selectDevicesTesterHas
    }
  })
  .filter((tester) => (tester.devices.length > 0)) // eliminate testers with no sel devices
  .map((suitableCandidate) => { // testers in sel country and have sel devices
    const tester = suitableCandidate.tester;
    const testersDevices = suitableCandidate.devices.map((device) => (device.deviceId))
    
    tester.bugCount = bugs.reduce((acc, bug) => { // add up all bugs for sel devices for testers
      if (testersDevices.includes(bug.deviceId) && (bug.testerId === tester.testerId)) {
        acc += 1
      }
      return acc
    }, 0)

    return tester
  })
  .sort((a, b) => (b.bugCount - a.bugCount)) // sort desc so those with more experience appear first
}