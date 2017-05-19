import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { palette } from 'styled-theme';

const Label = styled.div`
  font-weight: ${(props) => props.bold ? 'bold' : 'normal'};
  padding-left: 1em;
  position: relative;
`;
const Reference = styled.span`
  font-weight: bold;
  opacity: 0.5;
  font-size: 0.8em;
  padding-right: 10px;
`;
const Count = styled.span`
  position: absolute;
  top: 0;
  right: 0
  color: ${palette('dark', 4)}
`;

const Option = (props) => (
  <Label bold={props.bold}>
    { props.reference &&
      <Reference>
        {props.reference}
      </Reference>
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
