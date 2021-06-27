/**
*
* EntityView
*
*/
import React from 'react';
import PropTypes from 'prop-types';
import { reduce } from 'lodash/collection';

import asArray from 'utils/as-array';

import FieldGroup from 'components/fields/FieldGroup';

import Main from './Main';
import Aside from './Aside';
import ViewWrapper from './ViewWrapper';
import ViewPanel from './ViewPanel';
import ViewPanelInside from './ViewPanelInside';

const hasFields = (fieldGroup) => fieldGroup.fields && reduce(fieldGroup.fields, (memo, field) => memo || field, false);

class EntityView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  renderMain = (fieldGroups, hasAside = true, bottom = false, seamless = false) => (
    <Main hasAside={hasAside} bottom={bottom}>
      {
        asArray(fieldGroups).map((fieldGroup, i) => fieldGroup && hasFields(fieldGroup) && (
          <FieldGroup
            key={i}
            group={fieldGroup}
            seamless={seamless}
            bottom={bottom}
          />
        ))
      }
    </Main>
  );

  renderAside = (fieldGroups, bottom = false, seamless) => (
    <Aside bottom={bottom}>
      {
        asArray(fieldGroups).map((fieldGroup, i) => fieldGroup && (
          <FieldGroup
            key={i}
            group={fieldGroup}
            seamless={seamless}
            bottom={bottom}
            aside
          />
        ))
      }
    </Aside>
  );

  render() {
    const { fields, seamless } = this.props;
    const hasBodyFields = fields.body
      && (
        (
          fields.body.main
          && fields.body.main[0]
          && fields.body.main[0].fields
        )
        || (
          fields.body.aside
          && fields.body.aside[0]
          && fields.body.aside[0].fields
        )
      );
    return (
      <ViewWrapper seamless={seamless}>
        {fields.header && (
          <ViewPanel>
            <ViewPanelInside>
              {fields.header.main
                && this.renderMain(
                  fields.header.main,
                  !!fields.header.aside,
                  false,
                  seamless,
                )
              }
              {fields.header.aside
                && this.renderAside(fields.header.aside, false)
              }
            </ViewPanelInside>
          </ViewPanel>
        )}
        {hasBodyFields && (
          <ViewPanel>
            <ViewPanelInside>
              {fields.body.main
                && this.renderMain(
                  fields.body.main,
                  !!fields.body.aside,
                  true,
                  seamless,
                )
              }
              {fields.body.aside
                && this.renderAside(fields.body.aside, true)
              }
            </ViewPanelInside>
          </ViewPanel>
        )}
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
