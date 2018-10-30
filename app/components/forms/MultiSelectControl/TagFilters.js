import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { fromJS } from 'immutable';

import Icon from 'components/Icon';
import Button from 'components/buttons/Button';
import OptionList from './OptionList';

import { sortOptions } from './utils';

const Styled = styled.div`
  background-color: ${palette('light', 0)};
  padding: 0 0.25em 0.5em;
  position: relative;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: 0 0.5em 0.5em;
  }
`;

// padding: 0.75em 2em;
const Group = styled(Button)`
  padding: 0 0.5em;
`;

const GroupWrapper = styled.span`
  display: inline-block;
`;
const Dropdown = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 2;
  background-color: ${palette('background', 0)};
  box-shadow: 0 8px 8px 0 rgba(0,0,0,0.2);
  overflow-y: auto;
  max-height: 200px;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    max-height: 320px;
  }
`;
// box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.2);

const DotWrapper = styled.div`
  padding: 5px 5px 5px 0;
  display: inline-block;
  vertical-align: middle;
`;

const Dot = styled.div`
  background-color: ${(props) => palette(props.palette, props.pIndex)};
  border-radius: ${(props) => props.round ? 999 : 3}px;
  width: 0.9em;
  height: 0.9em;
`;

const Label = styled.div`
  display: inline-block;
  vertical-align: middle;
  position: relative;
  top: 1px;
  font-size: 0.9em;
  font-weight: bold;
`;

class TagFilters extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      active: null,
    };
  }

  toggleGroup = (groupId) => {
    this.setState({
      active: this.state.active === groupId
        ? null
        : groupId,
    });
  };

  prepareOptions = (options, queryTags) =>
    sortOptions(
      fromJS(options).map((option) => option.withMutations((o) =>
        o.set('checked', queryTags.includes(option.get('value')))
      ))
    );

  render() {
    return this.props.tagFilterGroups.length === 0
      ? null
      : (
        <Styled>
          { this.props.tagFilterGroups.map((group, key) =>
            group.options && group.options.length > 0
            ? (<GroupWrapper key={key}>
              <Group
                onClick={(evt) => {
                  if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                  this.toggleGroup(key);
                }}
                active={key === this.state.active}
              >
                <DotWrapper>
                  <Dot palette={group.palette[0]} pIndex={parseInt(group.palette[1], 10)} />
                </DotWrapper>
                <Label>
                  {group.title}
                </Label>
                <Icon name={this.state.active === key ? 'dropdownClose' : 'dropdownOpen'} text textRight />
              </Group>
              { key === this.state.active &&
                <Dropdown>
                  <OptionList
                    secondary
                    options={this.prepareOptions(group.options, this.props.queryTags)}
                    onCheckboxChange={(active, tagOption) => {
                      this.setState({ active: null });
                      this.props.onTagSelected(active, tagOption);
                    }}
                  />
                </Dropdown>
              }
            </GroupWrapper>)
            : null
          )}
        </Styled>
    );
  }
}

TagFilters.propTypes = {
  tagFilterGroups: PropTypes.array,
  queryTags: PropTypes.array,
  onTagSelected: PropTypes.func,
};

export default TagFilters;
