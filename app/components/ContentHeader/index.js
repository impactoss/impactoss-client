import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import {
  CONTENT_LIST, CONTENT_SINGLE, CONTENT_PAGE, CONTENT_MODAL,
} from 'containers/App/constants';

import SupTitle from 'components/SupTitle';
// import Icon from 'components/Icon';

import ButtonFactory from 'components/buttons/ButtonFactory';

const Styled = styled.div`
  padding: ${(props) => props.isModal ? '0 0 10px' : '1em 0 0.5em'};
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: ${(props) => props.isModal ? '20px 0 20px 40px' : '3em 0 1em'};
  }
  border-bottom: ${(props) => props.hasBottomBorder ? '1px solid' : 'none'};
  border-color: ${palette('light', 1)};
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
const ButtonWrap = styled.span`
  padding: 0 0.3em;
  &:last-child {
    padding: 0;
  }
  @media print {
    display: none;
  }
`;
const Table = styled.span`
  display: block;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    display: table;
    width: 100%;
    min-height: 62px;
  }
`;
const TableCell = styled.span`
  display: ${(props) => {
    if (props.hiddenMobile) {
      return 'none';
    }
    return 'block';
  }};
  clear: both;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    display: table-cell;
    vertical-align: middle;
  }
`;

const TableCellInner = styled(TableCell)`
  display: table-cell;
  vertical-align: middle;
`;

const ButtonGroup = styled.div`
  float: right;
  display: table;
  text-align: right;
  margin-bottom: 10px;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    margin-bottom: 0;
  }
`;

const SubTitle = styled.p`
  font-size: 1.1em;
  @media print {
    display: none;
  }
`;
const TitleWrap = styled.div`
  clear: both;
`;
const VisibleMobile = styled.span`
  display: block;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    display: none;
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
    const {
      type,
      icon,
      supTitle,
      title,
      buttons,
      subTitle,
    } = this.props;

    return (
      <Styled
        hasBottomBorder={type === CONTENT_PAGE || type === CONTENT_MODAL}
        isModal={type === CONTENT_MODAL}
      >
        {buttons && (
          <VisibleMobile>
            <ButtonGroup>
              {
                buttons.map((button, i) => button && (
                  <TableCellInner key={i}>
                    <ButtonWrap>
                      <ButtonFactory button={button} />
                    </ButtonWrap>
                  </TableCellInner>
                ))
              }
            </ButtonGroup>
          </VisibleMobile>
        )}
        <TitleWrap>
          {supTitle && <SupTitle icon={icon} title={supTitle} />}
          <Table>
            <TableCell>
              {this.renderTitle(type, title, icon)}
            </TableCell>
            {buttons && (
              <TableCell hiddenMobile>
                <ButtonGroup>
                  {
                    buttons.map((button, i) => (
                      <TableCellInner key={i}>
                        <ButtonWrap>
                          <ButtonFactory button={button} />
                        </ButtonWrap>
                      </TableCellInner>
                    ))
                  }
                </ButtonGroup>
              </TableCell>
            )}
          </Table>
          {subTitle && <SubTitle>{subTitle}</SubTitle>}
        </TitleWrap>
      </Styled>
    );
  }
}

ContentHeader.propTypes = {
  title: PropTypes.string.isRequired,
  buttons: PropTypes.array,
  supTitle: PropTypes.string,
  subTitle: PropTypes.string,
  icon: PropTypes.string,
  type: PropTypes.string,
};

export default ContentHeader;
