import React, { PropTypes } from 'react';
import styled from 'styled-components';

const Label = styled.span`
  font-weight: ${(props) => props.bold ? 'bold' : 'normal'};
  padding-left: 10px;
`;
const Reference = styled.span`
  font-weight: bold;
  opacity: 0.5;
  font-size: 0.8em;
  padding-right: 10px;
`;
const Count = styled.span`
  float: right;
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
