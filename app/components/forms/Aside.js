import styled from 'styled-components';
import { palette } from 'styled-theme';

import Section from './Section';

const Aside = styled(Section)`
  width: 30%;
  border-left: 1px solid ${palette('light', 2)};
`;

export default Aside;
