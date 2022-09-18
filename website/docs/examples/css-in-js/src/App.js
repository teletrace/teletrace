import StudentList from './StudentList'
 
const App = () => {
  return (
    <div>
      <StudentList
        name='Samir'
        classNo='Xi'
        roll='09'
        addr='Jalpaiguri, West Bengal'
      />
      <StudentList
        name='Karishma'
        classNo='ix'
        roll='08'
        addr='Mednipur, West Bengal'
      />
    </div>
  )
}
 
export default App