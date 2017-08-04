import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import { CONTENT_LIST, CONTENT_SINGLE, CONTENT_PAGE, CONTENT_MODAL } from 'containers/App/constants';

import SupTitle from 'components/SupTitle';
// import Icon from 'components/Icon';

import ButtonFactory from 'components/buttons/ButtonFactory';

const Styled = styled.div`
  padding: ${(props) => props.isModal ? '20px 0 20px 40px' : '3em 0 1em'};
  border-bottom: ${(props) => props.hasBottomBorder ? '1px solid' : 'none'};
  border-color: ${palette('light', 2)};
`;

const TitleLarge = styled.h1`
  line-height: 1;
  margin-top: 10px;
`;
const TitleMedium = styled.h3`
  line-height: 1;
  margin-top: 0;
  display: inline-block;
`;
// const TitleSmall = styled.h4`
//   line-height: 1;
//   margin-top: 0;
//   display: inline-block;
// `;
// const TitleIconWrap = styled.span`
//   color: ${palette('dark', 4)};
// `;
const ButtonWrap = styled.span`
  padding: 0 0.3em;
  &:last-child {
    padding: 0;
  }
`;
const Table = styled.span`
  display: table;
  width: 100%;
`;
const TableCell = styled.span`
  display: table-cell;
  vertical-align: middle;
`;

const ButtonGroup = styled.div`
  vertical-align: middle;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    text-align:right;
  }
`;

class ContentHeader extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  renderTitle = (type, title, icon) => {
    switch (type) {
      case CONTENT_PAGE:
      case CONTENT_LIST:
        return (<TitleLarge>{title}</TitleLarge>);
      case CONTENT_MODAL:
      case CONTENT_SINGLE:
        return (
          <SupTitle icon={icon} title={title} />
          // <TitleIconWrap>
          //   { icon &&
          //     <Icon name={icon} text textLeft />
          //   }
          //   <TitleSmall>{title}</TitleSmall>
          // </TitleIconWrap>
        );
      default:
        return (<TitleMedium>{title}</TitleMedium>);
    }
  }
  render() {
    const { type, icon, supTitle, title, buttons } = this.props;
    return (
      <Styled
        hasBottomBorder={type === CONTENT_PAGE || type === CONTENT_MODAL}
        isModal={type === CONTENT_MODAL}
      >
        { supTitle &&
          <SupTitle icon={icon} title={supTitle} />
        }
        <Table>
          <TableCell>
            {this.renderTitle(type, title, icon)}
          </TableCell>
          { buttons &&
            <TableCell>
              <ButtonGroup>
                {
                  buttons.map((button, i) => (
                    <ButtonWrap key={i}>
                      <ButtonFactory button={button} />
                    </ButtonWrap>
                  ))
                }
              </ButtonGroup>
            </TableCell>
          }
        </Table>
      </Styled>
    );
  }
}

ContentHeader.propTypes = {
  title: PropTypes.string.isRequired,
  buttons: PropTypes.array,
  supTitle: PropTypes.string,
  icon: PropTypes.string,
  type: PropTypes.string,
};

export default ContentHeader;
