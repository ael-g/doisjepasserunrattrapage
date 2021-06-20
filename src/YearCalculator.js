import React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

class YearCalculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      year: {'items': []}
    };
  }

  componentDidMount() {
    console.log('Fetching things');
    fetch(`${process.env.PUBLIC_URL}/diploma/nanterre-l1-histoiredelart-ead.json`)
      .then(res => res.json())
      .then(
        (result) => {
          const {itemProcessed} = this.computeBloc(result)
          console.log(itemProcessed)
            this.setState({
              year: itemProcessed
            });
        })
  }

  computeBloc(unit){
    let grade = 0
    let credit = 0
    let creditDisp = 0
    let itemProcessed = {
      'name': unit.name,
      'type': unit.type,
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

    this.setState({
      year
    })
  }

  changeValueInBloc(bloc, path, value) {
    const processedItem = Object.assign({}, bloc)
    if('items' in processedItem) {
      let items = []
      
      for(let item of bloc['items']) {
        const ret = this.changeValueInBloc(item, path['child'], value)
        items.push(ret)
      }

      processedItem['items'] = items
    } else {
      if(processedItem['name'] === path['name']) {
        processedItem['value'] = parseFloat(value)
      }
      // console.log('We should be at EC', processedItem)
      // console.log('We should be at PATH', path)
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
  
  render() {
    const year = this.state.year

    return (
      year['items'].map((semestre) => 
      <div key={semestre['name']}>
        <Typography style={this.styleValidated(semestre['grade'])} variant="h4">{semestre['name']} {semestre['grade']}</Typography>{ 
          semestre['items'].map((ue) => 
          <div key={ue['name']}>
            <Typography style={this.styleValidated(ue['grade'])} variant="h5">{ue['name']} {ue['grade']}</Typography>
            {
              ue['items'].map((ec) =>
              <div key={ec['name']}>
                <Typography style={this.styleValidated(ec['value'])}>
                  {ec['name']} - {ec['credit']}
                  <TextField onChange={(e) => this.onChangeGrade(e, {
                      'name': semestre['name'],
                      'child': {
                        'name': ue['name'],
                        'child': {
                          'name': ec['name'],
                          'child': {
                            'name': ec['name']
                          }
                        } 
                      }  
                    })} defaultValue={ec['value']} variant="outlined" style={{width: "60px"}}/>
                </Typography>
              </div>
              )
            }
          </div>)
        }
      </div>
      )
    )
  }
}

export {YearCalculator}
