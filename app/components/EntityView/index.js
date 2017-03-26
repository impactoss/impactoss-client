/**
*
* EntityView
*
*/

import React from 'react';
// import styled from 'styled-components';

import ViewWrapper from 'components/basic/ViewWrapper';
import Grid from 'grid-styled';

import Row from 'components/basic/Row';
import ViewHeader from './ViewHeader';
import ViewBody from './ViewBody';
import ViewFooter from './ViewFooter';


class EntityView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  renderList = (field, index) => (
    <span key={index}>
      {field.heading &&
        <h3>{field.heading}</h3>
      }
      {field.values.map((value, i) => (
        <div key={i}>
          <p>{value.label} - {value.value}</p>
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
    if (field.value) {
      return this.renderField(field, index);
    } else if (field.values) {
      return this.renderList(field, index);
    }
    return null;
  })

  render() {
    const { fields } = this.props;
    return (
      <span>
        <ViewWrapper>
          { fields.header &&
            <ViewHeader>
              <Row>
                <Grid sm={3 / 4}>
                  { fields.header.main &&
                    this.renderSection(fields.header.main)
                  }
                </Grid>
                <Grid sm={1 / 4}>
                  { fields.header.aside &&
                    this.renderSection(fields.header.aside)
                  }
                </Grid>
              </Row>
            </ViewHeader>
          }
          { fields.body &&
            <ViewBody>
              <Row>
                <Grid sm={3 / 4}>
                  { fields.body.main &&
                    this.renderSection(fields.body.main)
                  }
                </Grid>
              </Row>
              <Row>
                <Grid sm={1 / 4}>
                  { fields.body.aside &&
                    this.renderSection(fields.body.aside)
                  }
                </Grid>
              </Row>
            </ViewBody>
          }
          <ViewFooter>
            <button onClick={this.props.handleCancel}>Cancel</button>
            <button onClick={this.props.handleEdit}>Edit</button>
          </ViewFooter>
        </ViewWrapper>
      </span>
    );
  }
}

EntityView.propTypes = {
  handleEdit: React.PropTypes.func,
  handleCancel: React.PropTypes.func,
  fields: React.PropTypes.object,
};

export default EntityView;
