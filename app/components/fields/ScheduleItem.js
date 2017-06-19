import styled from 'styled-components';
import { palette } from 'styled-theme';

const ScheduleItem = styled.div`
  font-weight: bold;
  color:  ${(props) => props.overdue ? palette('primary', 1) : palette('dark', 2)};
`;

export default ScheduleItem;
