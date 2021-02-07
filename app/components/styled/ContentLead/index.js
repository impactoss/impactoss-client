import styled from 'styled-components';

const ContentLead = styled.p`
  font-size: 1.25em;
  padding-bottom: 3em;
  @media print {
    font-size: ${(props) => props.theme.sizes.print.large};
  }
`;

export default ContentLead;
