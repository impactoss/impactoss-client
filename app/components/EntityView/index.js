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
  renderMain = (fieldGroups, aside) => (
    <Main aside={aside}>
      {
        asArray(fieldGroups).map((fieldGroup, i, list) => fieldGroup && fieldGroup.fields && (
          <ViewPanel key={i} borderRight={aside} borderBottom={i < (list.length - 1)}>
            <FieldGroup group={fieldGroup} />
          </ViewPanel>
        ))
      }
    </Main>
  );
  renderAside = (fieldGroups) => (
    <Aside>
      {
        asArray(fieldGroups).map((fieldGroup, i, list) => fieldGroup && (
          <ViewPanel key={i} borderBottom={i < (list.length - 1)}>
            <FieldGroup group={fieldGroup} />
          </ViewPanel>
        ))
      }
    </Aside>
  );
  render() {
    const { fields } = this.props;

    return (
      <ViewWrapper>
        { fields.header &&
          <ViewPanel borderBottom>
            { fields.header.main && this.renderMain(fields.header.main, !!fields.header.aside) }
            { fields.header.aside && this.renderAside(fields.header.aside) }
          </ViewPanel>
        }
        { fields.body &&
          <ViewPanel>
            { fields.body.main && this.renderMain(fields.body.main, true) }
            { fields.body.aside && this.renderAside(fields.body.aside) }
          </ViewPanel>
        }
      </ViewWrapper>
    );
  }
}

EntityView.propTypes = {
  fields: PropTypes.object,
};
EntityView.contextTypes = {
  intl: PropTypes.object.isRequired,
};
export default EntityView;
