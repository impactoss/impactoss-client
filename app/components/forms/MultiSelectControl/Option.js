import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

const Label = styled.div`
  font-weight: ${(props) => props.bold ? 'bold' : 'normal'};
  position: relative;
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
const Option = (props) => (
  <Label bold={props.bold}>
    {props.reference &&
      <Id>{props.reference}</Id>
    }
    {props.reference &&
      <IdSpacer>|</IdSpacer>
    }
    {props.label}
  </Label>
);

Option.propTypes = {
  label: PropTypes.string.isRequired,
  reference: PropTypes.string,
  bold: PropTypes.bool,
};

export default Option;
