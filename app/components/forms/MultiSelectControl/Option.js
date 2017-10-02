import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { FormattedMessage } from 'react-intl';

import ItemStatus from 'components/ItemStatus';
import appMessage from 'utils/app-message';

import messages from './messages';


const Label = styled.div`
  font-weight: ${(props) => props.bold ? 500 : 'normal'};
  position: relative;
`;
const New = styled.span`
  color: ${palette('primary', 4)};
  background-color: ${palette('primary', 0)};
  padding: 1px 5px;
  font-size: 0.8em;
  margin-left: 0.5em;
  border-radius: 4px;
`;
const Id = styled.span`
  font-weight: bold;
  color: ${palette('dark', 4)}
`;
const IdSpacer = styled.span`
  padding-left: 0.5em;
  padding-right: 0.5em;
  color: ${palette('dark', 4)};
`;
// <Label bold={props.bold} italic={props.isNew}>
class Option extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { draft, reference, message, label, isNew } = this.props;

    return (
      <Label bold={false}>
        {draft &&
          <ItemStatus draft />
        }
        {reference &&
          <Id>{reference}</Id>
        }
        {reference &&
          <IdSpacer>|</IdSpacer>
        }
        { message
           ? appMessage(this.context.intl, message)
           : label
        }
        {isNew &&
          <New>
            <FormattedMessage {...messages.new} />
          </New>
        }
      </Label>
    );
  }
}

Option.propTypes = {
  label: PropTypes.string,
  message: PropTypes.string,
  reference: PropTypes.string,
  draft: PropTypes.bool,
  isNew: PropTypes.bool,
};

Option.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default Option;
