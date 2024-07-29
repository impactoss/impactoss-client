import styled from 'styled-components';
import { palette } from 'styled-theme';

const ScheduleItemStatus = styled.div`
  display: inline-block;
  padding-left: 1em;
  color: ${(props) => props.overdue ? palette('reports', 0) : 'inherit'}
`;

export default ScheduleItemStatus;
