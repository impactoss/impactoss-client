import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

const Label = styled.div`
  font-weight: ${(props) => props.bold ? 'bold' : 'normal'};
  padding-left: 1em;
  position: relative;
`;
const Count = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  color: ${palette('dark', 4)};
`;
const Id = styled.span`
  font-weight: bold;
  color: ${palette('dark', 3)}
`;
const IdSpacer = styled.span`
  padding-left: 0.5em;
  padding-right: 0.5em;
  color: ${palette('dark', 1)};
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
    { typeof props.count !== 'undefined' &&
      <Count>
        {props.count}
      </Count>
    }
  </Label>
);

Option.propTypes = {
  label: PropTypes.string.isRequired,
  reference: PropTypes.string,
  count: PropTypes.number,
  bold: PropTypes.bool,
};

export default Option;
