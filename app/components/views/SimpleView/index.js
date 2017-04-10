/**
*
* SimpleView
*
*/

import React from 'react';
import { Link } from 'react-router';

import ViewWrapper from 'components/basic/ViewWrapper';
import Grid from 'grid-styled';

import Row from 'components/basic/Row';
import ViewBody from '../ViewBody';


class SimpleView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  renderList = (field, index) => (
    <span key={index}>
      {field.heading &&
        <h3>{field.heading}</h3>
      }
      {field.values.map((value, i) => (
        <div key={i}>
          {value.linkTo
            ? <Link key={i} to={value.linkTo}>{value.label}</Link>
            : <p>{value.label}</p>
          }
        </div>
      ))}
    </span>
  )

  renderField = (field, index) => (
    <div key={index}>
      {field.heading &&
        <h3>{field.heading}</h3>
      }
      <p>{field.value}</p>
    </div>
  )

  renderSection = (fields) => fields.map((field, index) => {
    if (field.type === 'list') {
      return this.renderList(field, index);
    }
    return this.renderField(field, index);
  })

  render() {
    const { fields } = this.props;
    return (
      <span>
        <ViewWrapper>
          { fields &&
            <ViewBody>
              <Row>
                <Grid sm={1 / 4}></Grid>
                <Grid sm={1 / 2}>
                  { this.renderSection(fields) }
                </Grid>
              </Row>
            </ViewBody>
          }
        </ViewWrapper>
      </span>
    );
  }
}

SimpleView.propTypes = {
  fields: React.PropTypes.array,
};

export default SimpleView;
