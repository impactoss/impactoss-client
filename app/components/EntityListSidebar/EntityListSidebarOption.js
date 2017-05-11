/*
 *
 * EntityListSidebarOption
 *
 */

import React, { PropTypes } from 'react';

import styled from 'styled-components';
import { palette } from 'styled-theme';

import Button from 'components/buttons/Button';
import Icon from 'components/Icon';

const Styled = styled(Button)`
  color: ${(props) => props.active ? palette('primary', 4) : palette('greyscaleDark', 1)};
  background-color: ${(props) => props.active ? palette('greyscaleDark', 1) : 'transparent'};
  font-weight: bold;
  padding: 0.75em 2em;
  width: 100%;
  text-align: left;
  border-bottom: 1px solid ${palette('greyscaleLight', 0)};
  &:hover {
    color: ${(props) => props.active ? palette('primary', 4) : palette('greyscaleDark', 3)};
    background-color: ${(props) => props.active ? palette('greyscaleDark', 2) : 'transparent'};
  }
`;
const Label = styled.span`
  vertical-align: middle;
  position: relative;
  top: 2px;
`;
const IconWrapper = styled.span`
  color: ${palette('greyscaleLight', 3)};
  vertical-align: middle;
  float: right;
  padding: 0 5px;
`;
const Dot = styled.div`
  background-color: ${(props) => palette(props.palette, props.pIndex)};
  display: block;
  border-radius: 999px;
  width: 1em;
  height: 1em;
`;
const DotWrapper = styled.div`
  padding: 5px;
  float: right;
`;

class EntityListSidebarOption extends React.Component { // eslint-disable-line react/prefer-stateless-function

  renderDot = (groupId, optionId) => {
    switch (groupId) {
      case 'taxonomies':
      case 'connectedTaxonomies':
        return (<Dot palette="taxonomies" pIndex={parseInt(optionId, 10)} />);
      case 'connections':
        return (<Dot palette={optionId === 'measures' ? 'actions' : optionId} pIndex={0} />);
      default:
        return null;
    }
  }
  render() {
    const { option, onClick, groupId } = this.props;

    return (
      <Styled
        active={option.get('active')}
        onClick={() => onClick({
          group: groupId,
          optionId: option.get('id'),
          path: option.get('path'),
          key: option.get('key'),
          ownKey: option.get('ownKey'),
          active: option.get('active'),
        })}
      >
        <Label>
          {option.get('label')}
        </Label>
        <DotWrapper>
          { this.renderDot(groupId, option.get('id')) }
        </DotWrapper>
        { option.get('icon') &&
          <IconWrapper>
            <Icon name={option.get('icon')} size="24px" />
          </IconWrapper>
        }
      </Styled>
    );
  }
}

EntityListSidebarOption.propTypes = {
  option: PropTypes.object.isRequired,
  groupId: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default EntityListSidebarOption;
