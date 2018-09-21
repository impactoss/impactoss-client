import styled from 'styled-components';
import { palette } from 'styled-theme';

const FieldGroupWrapper = styled.div`
  background-color: ${(props) => props.groupType === 'dark' ? palette('light', 0) : 'transparent'};
  border-bottom: ${(props) => props.groupType === 'smartTaxonomy' ? '1px solid' : 0};
  border-bottom-color: ${palette('light', 1)};
  padding: ${(props) => props.seamless ? '15px 15px 10px 0' : '15px'};
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: ${(props) => props.seamless ? '30px 30px 20px 0' : '30px'};
  }
`;

export default FieldGroupWrapper;
