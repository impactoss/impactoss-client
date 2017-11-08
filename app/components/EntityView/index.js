/**
*
* EntityView
*
*/
import React from 'react';
import PropTypes from 'prop-types';
import asArray from 'utils/as-array';

import FieldGroup from 'components/fields/FieldGroup';

import Main from './Main';
import Aside from './Aside';
import ViewWrapper from './ViewWrapper';
import ViewPanel from './ViewPanel';


class EntityView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  renderMain = (fieldGroups, aside = true, seamless = false) => (
    <Main aside={aside}>
      {
        asArray(fieldGroups).map((fieldGroup, i, list) => fieldGroup && fieldGroup.fields && (
          <ViewPanel key={i} borderRight={aside} borderBottom={i < (list.length - 1)}>
            <FieldGroup group={fieldGroup} seamless={seamless} />
          </ViewPanel>
        ))
      }
    </Main>
  );
  renderAside = (fieldGroups, seamless) => (
    <Aside>
      {
        asArray(fieldGroups).map((fieldGroup, i, list) => fieldGroup && (
          <ViewPanel key={i} borderBottom={i < (list.length - 1)}>
            <FieldGroup group={fieldGroup} seamless={seamless} aside />
          </ViewPanel>
        ))
      }
    </Aside>
  );
  render() {
    const { fields, seamless } = this.props;

    return (
      <ViewWrapper seamless={seamless}>
        { fields.header &&
          <ViewPanel borderBottom>
            { fields.header.main && this.renderMain(fields.header.main, !!fields.header.aside, seamless) }
            { fields.header.aside && this.renderAside(fields.header.aside) }
          </ViewPanel>
        }
        { fields.body &&
          <ViewPanel>
            { fields.body.main && this.renderMain(fields.body.main, !!fields.body.aside, seamless) }
            { fields.body.aside && this.renderAside(fields.body.aside) }
          </ViewPanel>
        }
      </ViewWrapper>
    );
  }
}

EntityView.propTypes = {
  fields: PropTypes.object,
  seamless: PropTypes.bool,
};
EntityView.contextTypes = {
  intl: PropTypes.object.isRequired,
};
export default EntityView;
