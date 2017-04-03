/**
*
* EntityView
*
*/
import React from 'react';
import { Link } from 'react-router';

import ViewWrapper from 'components/basic/ViewWrapper';
import Grid from 'grid-styled';

import Row from 'components/basic/Row';
import ViewHeader from '../ViewHeader';
import ViewBody from '../ViewBody';
// import ViewFooter from './ViewFooter';


class EntityView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
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
              <Grid sm={1 / 4}>
                { fields.body.aside &&
                  this.renderSection(fields.body.aside)
                }
              </Grid>
            </Row>
          </ViewBody>
        }
      </ViewWrapper>
    );
  }
}

EntityView.propTypes = {
  fields: React.PropTypes.object,
};

export default EntityView;
