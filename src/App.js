import logo from './logo.svg';
import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';

import './App.css';

function App(props) {
  const [year, setYear] = useState(0);
  // setYear({
  //   semestres: []
  // });

  useEffect(() => {
    console.log('Fetching things');
    fetch("/diploma/nanterre-l1-histoiredelart-ead.json")
      .then(res => res.json())
      .then(
        (result) => {
            setYear(result);
        })
  }, []);

  return (
    <div className="App">
      {year ? 
        year['semestres'].map((semestre) => <div>{
            semestre['name']
          }{ 
            semestre['ue'].map((ue) => 
            <div>
              {ue['name']}
              {
                ue['ec'].map((ec) =>
                <div>
                  {ec['name']} - {ec['credit']} <TextField id="outlined-basic" variant="outlined" />
                </div>
                )
              }
            </div>)
          }
        </div>)
      :<></> }
    </div>
  );
}

// {
//   
//   }
export default App;
