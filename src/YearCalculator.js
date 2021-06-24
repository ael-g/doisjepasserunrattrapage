import React from 'react';
import {TextField, Typography, List, ListItem, Divider} from '@material-ui/core/';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

class YearCalculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      year: {'items': []},
      rattrapage: []
    };
  }

  componentDidMount() {
    fetch(`${process.env.PUBLIC_URL}/diploma/nanterre-l1-histoiredelart-ead.json`)
      .then(res => res.json())
      .then(
        (result) => {
          const {itemProcessed} = this.computeBloc(result)
            this.setState({
              year: itemProcessed
            });
            this.computeRattrapage(itemProcessed)
        })
  }

  computeBloc(unit){
    let grade = 0
    let credit = 0
    let creditDisp = 0
    let itemProcessed = {
      'name': unit.name,
      'type': unit.type,
      'isFondamentale': unit.isFondamentale,
      'items': []
    }

    for(const item of unit['items']) {
      if('items' in item) {
        // Node
        const ret = this.computeBloc(item)
        itemProcessed['items'].push(ret['itemProcessed'])

        if(! isNaN(ret.grade)) {
          grade += ret.grade * ret.credit
          credit += ret.credit
        } else {
          creditDisp += ret.credit
        }
      } else {
        // Leaf
        itemProcessed['items'].push(item)

        if(item['disp']) {
          creditDisp += item['credit']
        } else {
          grade += item['value'] * item['credit']
          credit += item['credit']
        }
      }
    }

    grade = Math.round((grade / credit) * 1000) / 1000
    credit += creditDisp
      
    itemProcessed['grade'] = grade
    itemProcessed['credit'] = credit

    return {itemProcessed, grade, credit}
  }

  onChangeGrade(event, path) {
    const value = event.target.value
    let year = this.changeValueInBloc(this.state.year, path, value)
    year = this.computeBloc(year)
    year = year.itemProcessed
    this.computeRattrapage(year)

    this.setState({
      year
    })
  }

  changeValueInBloc(bloc, path, value) {
    const processedItem = Object.assign({}, bloc)
    if('items' in processedItem) {
      let items = []
      
      for(let item of bloc['items']) {
        const ret = this.changeValueInBloc(item, path, value)
        items.push(ret)
      }

      processedItem['items'] = items
    } else {
      if(processedItem['name'] === path) {
        processedItem['value'] = parseFloat(value)
      }
    }

    return processedItem
  }

  styleValidated(grade) {
    if(grade >= 10) {
      return {color: 'green'}
    }else{
      return {color: 'red'}
    }
  }

  computeRattrapage(year){
    let rattrapage = []
    if (year.grade >= 0 && this.computeMeanUeFondamentales(year) >= 10){
      // Year validated!
      // nothing to do
    } else {
      // Year raté :/
      // Computing EC to resit
      rattrapage = this.computeECUnderGrade(year, 10)
    }

    this.setState({
      rattrapage
    })
  }

  computeECUnderGrade(year, grade) {
    let ecList = []

    for(const sem of year['items']) {
      for(const ue of sem['items']) {
        for(const ec of ue['items']) {
          if(!ec['disp']) {
            if (ec['value'] < grade) {
              ecList.push(ec['name'])
            }
          }
        }
      }
    }
    return ecList   
  }

  computeMeanUeFondamentales(year) {
    let grade = 0
    let credit = 0

    for(const sem of year['items']) {
      for(const ue of sem['items']) {
        if(ue['isFondamentale']) {
          grade += ue['grade'] * ue['credit']
          credit += ue['credit']
        }
      }
    }
    return grade / credit
  }
  
  render() {
    const {year, rattrapage} = this.state

    const yearGrade = year['grade']
    const meanUeFondamentales = this.computeMeanUeFondamentales(year)

    return (
      <div>
        <Typography variant="h3" style={this.styleValidated(year['grade'])}>{year['name']} - {year['credit']} crédits - {year['grade']}</Typography>
        <Divider  style={{"marginTop": "30px"}}/>
        <Typography>Moyenne sur l'année {yearGrade} <span>{yearGrade >= 10? <CheckIcon/>:<ClearIcon/>}</span></Typography>
        <Typography>Moyenne des UE fondamentales {meanUeFondamentales}<span>{meanUeFondamentales >= 10? <CheckIcon/>: <ClearIcon/>}</span></Typography>
        <Typography>Mes rattrapages:</Typography>

        {rattrapage.length ? (
            rattrapage.map((ec) => <Typography> - {ec}</Typography>)
          ):(
            <Typography>Rien ! Vous avez validé votre année :)</Typography>
          )
        }
        <Divider />
        {year['items'].map((semestre) => 
        <div key={semestre['name']} style={{"paddingTop": "30px"}}>
          <Typography style={this.styleValidated(semestre['grade'])} variant="h4">{semestre['name']} {semestre['grade'] ? semestre['grade']:''}</Typography>{ 
            semestre['items'].map((ue) => 
            <div key={ue['name']}>
              <Typography style={this.styleValidated(ue['grade'])} variant="h5">{ue['name']} {ue['grade']? ue['grade']:''}</Typography>
              <List>
              {
                ue['items'].map((ec) =>
                  <ListItem key={ec['name']}>
                      <Typography style={this.styleValidated(ec['value'])}>
                        {ec['name']} - {ec['credit']}
                        <TextField disabled={ec['disp']} onChange={(e) => this.onChangeGrade(e, ec['name'])} defaultValue={ec['disp'] ? 'disp':ec['value']} variant="outlined" style={{"marginLeft": "50px", width: "60px"}}/>
                      </Typography>
                  </ListItem>
                )
              }
              </List>
            </div>)
          }
        </div>
        )}
    </div>
    )
  }
}

export {YearCalculator}
