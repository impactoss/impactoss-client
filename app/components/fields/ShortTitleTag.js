import styled from 'styled-components';
import { palette } from 'styled-theme';

const ShortTitleTag = styled.span`
  display: inline-block;
  color: ${(props) => props.inverse
    ? palette('taxonomies', parseInt(props.pIndex, 10) || 0)
    : palette('text', 2)
  };
  background-color: ${(props) => props.inverse
    ? palette('background', 0)
    : palette('taxonomies', parseInt(props.pIndex, 10) || 0)
  };
  padding: 1px 6px;
  margin-right: 2px;
  border-radius: 3px;
  font-size: 0.85em;
  border: 1px solid;
  line-height: normal;
`;

export default ShortTitleTag;
