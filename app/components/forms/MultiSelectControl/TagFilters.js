import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { fromJS } from 'immutable';

import Button from 'components/buttons/Button';
import OptionList from './OptionList';

import { sortOptions } from './utils';

const Styled = styled.div`
  background-color: ${palette('light', 0)};
`;

// padding: 0.75em 2em;
const Group = styled(Button)`
`;

const GroupWrapper = styled.span`
  position: relative;
  display: inline-block;
`;
const Dropdown = styled.div`
  position: absolute;
  left: 0;
  top: 100%;
  z-index: 2;
  background-color: ${palette('primary', 4)};
  box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.2);
  overflow-y: auto;
  max-height: 320px;
  width: 300px;
`;

const DotWrapper = styled.div`
  padding: 5px;
  display: inline-block;
  vertical-align: middle;
`;

const Dot = styled.div`
  background-color: ${(props) => palette(props.palette, props.pIndex)};
  border-radius: ${(props) => props.round ? 999 : 3}px;
  width: 1em;
  height: 1em;
`;

const Label = styled.div`
  display: inline-block;
  vertical-align: middle;
  position: relative;
  top: 2px;
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
    return (
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
            </Group>
            { key === this.state.active &&
              <Dropdown>
                <OptionList
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
