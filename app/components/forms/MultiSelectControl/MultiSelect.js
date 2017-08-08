import React from 'react';
import PropTypes from 'prop-types';
import { without } from 'lodash/array';
import { filter, find } from 'lodash/collection';
import { List, fromJS } from 'immutable';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import ButtonFactory from 'components/buttons/ButtonFactory';
import TagSearch from 'components/TagSearch';

import { STATES as CHECKBOX_STATES } from 'components/forms/IndeterminateCheckbox';

import {
  sortOptions,
  filterOptionsByTags,
  filterOptionsByKeywords,
} from './utils';

import TagFilters from './TagFilters';
import OptionList from './OptionList';
import Header from './Header';

const ButtonGroup = styled.div`
  float: ${(props) => props.left ? 'left' : 'right'}
`;
const ControlWrapper = styled.div``;

const ChangeHint = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: ${(props) => props.hasFooter ? '50px' : '0px'};
  background-color: ${palette('light', 0)};
  font-style: italic;
  padding: 0.5em 1em;
  box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.2);
  text-align: right;
`;

const ControlMain = styled.div`
  position: absolute;
  top: 60px;
  bottom: ${(props) => props.hasFooter ? '50px' : '0px'};
  left: 0;
  right: 0;
  overflow-y: auto;
  padding:0;
  padding-bottom: ${(props) => props.showChangeHint ? '50px' : '0px'};
`;
const ControlFooter = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${palette('light', 0)};
  height: 50px;
  box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.2);
`;

const Search = styled.div`
  padding: 1em;
  background-color: ${palette('light', 0)};
`;


class MultiSelect extends React.Component {
  constructor() {
    super();
    this.state = {
      query: null,
      optionsInitial: null,
      panelId: null,
      queryTags: [],
    };
  }

  componentWillMount() {
    // remember initial options
    this.setState({
      optionsInitial: this.props.options,
      panelId: this.props.panelId,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.panelId && (nextProps.panelId !== this.state.panelId)) {
      this.setState({
        optionsInitial: nextProps.options,
        panelId: nextProps.panelId,
        query: null,
        queryTags: [],
      });
    }
  }

  onSearch = (value) => {
    this.setState({
      query: value,
    });
  }
  onTagSelected = (active, tagOption) => {
    this.setState({
      queryTags: active
        ? this.state.queryTags.concat([tagOption.get('value')])
        : without(this.state.queryTags, tagOption.get('value')),
    });
  }

  getNextValues = (checked, option) => {
    const { multiple, required, values } = this.props;
    // do not update if required and change would result in empty list
    if (!checked && required) {
      const otherCheckedValues = values.find((v) =>
        v.get('checked') && !(v.get('value') === option.get('value') && v.get('query') === option.get('query'))
      );
      if (!otherCheckedValues) {
        return values;
      }
    }

    // uncheck all others if single mode (!multiple)
    let nextValues = values;
    const existingValueIndex = values.findIndex((v) =>
      v.get('value') === option.get('value') && v.get('query') === option.get('query')
    );
    if (!multiple && checked) {
      // uncheck all other options
      nextValues = nextValues.map((value, index) =>
        existingValueIndex !== index ? value.set('checked', false).set('hasChanged', true) : value
      );
    }
    // set new value
    const newValue = option.set('checked', checked).set('hasChanged', true);
    // set current value, add if not present
    return existingValueIndex > -1 ? nextValues.set(existingValueIndex, newValue) : nextValues.push(newValue);
  }

  isOptionIndeterminate = (option) => option.get('checked') === CHECKBOX_STATES.INDETERMINATE;

  // props, state
  // map options
  prepareOptions = ({ options, values, threeState }, { optionsInitial }) => options.map((option) => {
    const value = values.find((v) => option.get('value') === v.get('value') && option.get('query') === v.get('query'));
    const isNew = !optionsInitial.includes(option);
    const isIndeterminate = threeState && this.isOptionIndeterminate(option);

    return option.withMutations((o) =>
      o.set('checked', value && value.get('checked'))
      .set('isNew', isNew)
      .set('changedToChecked', value.get('checked') && !option.get('checked'))
      .set('changedToUnchecked', !value.get('checked') && !this.isOptionIndeterminate(value) && (option.get('checked') || isIndeterminate))
      .set('initialChecked', option.get('checked'))
      .set('isIndeterminate', isIndeterminate)
    );
  });

  filterOptions = (options, { search, advanced }, { query, queryTags }) => { // filter options
    let checkboxOptions = options;
    if (search && query) {
      checkboxOptions = filterOptionsByKeywords(checkboxOptions, query);
    }
    if (advanced && queryTags) {
      checkboxOptions = filterOptionsByTags(checkboxOptions, queryTags);
    }
    // sort options
    return sortOptions(checkboxOptions);
  };

  currentTagFilterGroups = (tagFilterGroups, options) => {
    // get all actually connected categories from connections
    const optionTagIds = options
    .map((option) => option.get('tags'))
    .flatten()
    .toSet()
    .toList();

    // filter multiselect options
    return optionTagIds.size > 0
      && !(optionTagIds.size === 1 && !optionTagIds.first())
      ? tagFilterGroups.map((group) => ({
        title: group.title,
        palette: group.palette,
        options: filter(group.options, (groupOption) => optionTagIds.includes(parseInt(groupOption.value, 10))),
      }))
      : [];
  };

  currentFilters = (queryTags, filterGroups) =>
    queryTags.map((tagValue) =>
      filterGroups.reduce((memo, group) => {
        const option = find(group.options, (groupOption) => groupOption.value === tagValue);
        return option
        ? ({
          label: option.filterLabel,
          type: group.palette[0],
          id: group.palette[1],
          onClick: (evt) => {
            if (evt && evt.preventDefault) evt.preventDefault();
            this.onTagSelected(false, fromJS(option));
          },
        })
        : memo;
      }, null)
    );

  renderButton = (action, i) => (
    <ButtonFactory
      key={i}
      button={{
        type: action.type === 'primary' ? 'textPrimary' : (action.type || 'text'),
        title: action.title,
        onClick: action.onClick && (() => action.onClick()),
        submit: action.submit,
      }}
    />
  );

  render() {
    let options = this.prepareOptions(this.props, this.state);

    const optionsChangedToChecked = options.filter((option) => option.get('changedToChecked'));
    const optionsChangedToUnchecked = options.filter((option) => option.get('changedToUnchecked'));
    const showChangeHint = this.props.advanced && (optionsChangedToChecked.size > 0 || optionsChangedToUnchecked.size > 0);

    options = this.filterOptions(options, this.props, this.state);

    return (
      <ControlWrapper>
        <Header
          title={this.props.title}
          onCancel={this.props.onCancel}
        />
        <ControlMain
          search={this.props.search}
          hasFooter={this.props.buttons}
          hasChangeNote={showChangeHint}
        >
          { this.props.search &&
            <Search>
              <TagSearch
                onSearch={this.onSearch}
                filters={this.currentFilters(this.state.queryTags, this.props.tagFilterGroups)}
                searchQuery={this.state.query || ''}
                multiselect
              />
            </Search>
          }
          { this.props.advanced && this.props.tagFilterGroups &&
            <TagFilters
              queryTags={this.state.queryTags}
              tagFilterGroups={this.currentTagFilterGroups(this.props.tagFilterGroups, options)}
              onTagSelected={this.onTagSelected}
            />
          }
          <OptionList
            options={options}
            onCheckboxChange={(checkedState, option) => {
              this.props.onChange(this.getNextValues(checkedState, option));
            }}
          />
        </ControlMain>
        { showChangeHint &&
          <ChangeHint hasFooter={this.props.buttons}>
            {'Your changes: '}
            {optionsChangedToChecked.size > 0 &&
              <span>
                {`${optionsChangedToChecked.size} selected. `}
              </span>
            }
            {optionsChangedToUnchecked.size > 0 &&
              <span>
                {`${optionsChangedToUnchecked.size} unselected. `}
              </span>
            }
          </ChangeHint>
        }
        { this.props.buttons &&
          <ControlFooter>
            <ButtonGroup>
              {
                this.props.buttons.map((action, i) =>
                  action && action.position !== 'left' && this.renderButton(action, i))
              }
            </ButtonGroup>
            <ButtonGroup left>
              {
                this.props.buttons.map((action, i) => (
                  action && action.position === 'left' && this.renderButton(action, i)
                ))
              }
            </ButtonGroup>
          </ControlFooter>
        }
      </ControlWrapper>
    );
  }
}


MultiSelect.propTypes = {
  options: PropTypes.instanceOf(List),
  values: PropTypes.instanceOf(List),
  onChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  multiple: PropTypes.bool,
  required: PropTypes.bool,
  title: PropTypes.string,
  buttons: PropTypes.array,
  search: PropTypes.bool,
  advanced: PropTypes.bool,
  panelId: PropTypes.string,
  tagFilterGroups: PropTypes.array,
};

MultiSelect.defaultProps = {
  values: new List(),
  threeState: false,
  multiple: true,
  required: false,
  search: true,
  advanced: false,
};

export default MultiSelect;
