import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { FormattedMessage } from 'react-intl';
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
const Option = (props) => (
  <Label bold={false}>
    {props.reference &&
      <Id>{props.reference}</Id>
    }
    {props.reference &&
      <IdSpacer>|</IdSpacer>
    }
    {props.label}
    {props.isNew &&
      <New>
        <FormattedMessage {...messages.new} />
      </New>
    }
  </Label>
);

Option.propTypes = {
  label: PropTypes.string.isRequired,
  reference: PropTypes.string,
  // bold: PropTypes.bool,
  isNew: PropTypes.bool,
};

export default Option;
