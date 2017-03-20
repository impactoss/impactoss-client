/**
*
* EntityView
*
*/

import React from 'react';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

class EntityView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { type, title, description, draft, updatedAt, targetDate } = this.props;
    return (
      <span>
        <h1>{type}</h1>
        <FormattedMessage {...messages.title} />
        <h3>{title}</h3>
        <FormattedMessage {...messages.description} />
        <p>{description}</p>
        <FormattedMessage {...messages.draft} />
        <p>{draft === false ? 'YES' : 'NO'}</p>
        <FormattedMessage {...messages.updatedAt} />
        <p>{updatedAt}</p>

        {targetDate &&
          <span>
            <FormattedMessage {...messages.targetDate} />
            <p>{targetDate}</p>
          </span>
        }
      </span>
    );
  }
}

EntityView.propTypes = {
  type: React.PropTypes.string,
  title: React.PropTypes.string.isRequired,
  description: React.PropTypes.string,
  draft: React.PropTypes.bool,
  updatedAt: React.PropTypes.string,
  targetDate: React.PropTypes.string,
};

export default EntityView;
