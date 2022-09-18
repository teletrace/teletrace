import React, { Component } from 'react'
import {createUseStyles} from 'react-jss'
 
const styles = createUseStyles({
  student : {
    border : '2px solid green',
    width: '40%',
    listStyleType:'none'
  },
 
  studentDetails : {
    color : 'blue',
    fontSize : '23px'
  }
})
 
const StudentList = (props) => {
  const classes = styles()
  const {name, classNo, roll, addr} = props
  return(
    <ul className={classes.student}>
      <li className={classes.studentDetails}>Name : {name}</li>
      <li className={classes.studentDetails}>Class: {classNo}</li>
      <li className={classes.studentDetails}>Roll: {roll}</li>
      <li className={classes.studentDetails}>Address : {addr}</li>
    </ul>
  )
}
 
export default StudentList