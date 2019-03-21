import React from 'react';

export default function Rows(props) {

  const { testerId, bugCount, country, firstName, lastName } = props.tester;

  return (
    <>
      <tr key={testerId}>
        <td>{bugCount}</td>
        <td>{country}</td>
        <td>{firstName + " " + lastName}</td>
      </tr>
    </>
  )
}