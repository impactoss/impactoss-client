import styled from 'styled-components';
import { palette } from 'styled-theme';

const ScheduleItem = styled.div`
  font-weight: bold;
  color:  ${(props) => props.overdue ? palette('report', 0) : palette('text', 1)};
`;

export default ScheduleItem;
