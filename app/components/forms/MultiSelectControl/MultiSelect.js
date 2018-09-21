import React from 'react';
import PropTypes from 'prop-types';
import { without } from 'lodash/array';
import { filter, find } from 'lodash/collection';
import { List, fromJS } from 'immutable';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { FormattedMessage } from 'react-intl';

import ButtonFactory from 'components/buttons/ButtonFactory';
import TagSearch from 'components/TagSearch';

import IndeterminateCheckbox, { STATES as CHECKBOX_STATES } from 'components/forms/IndeterminateCheckbox';

import {
  sortOptions,
  filterOptionsByTags,
  filterOptionsByKeywords,
} from './utils';

import TagFilters from './TagFilters';
import OptionList from './OptionList';
import Header from './Header';

import messages from './messages';

const ButtonGroup = styled.div`
  float: ${(props) => props.left ? 'left' : 'right'}
`;
// const ControlWrapper = styled.div``;

const ChangeHint = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: ${(props) => props.hasFooter ? '30px' : '0px'};
  color: ${palette('text', 1)};
  background-color: ${palette('background', 1)};
  padding: 0.5em 1em;
  box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.2);
  text-align: right;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    bottom: ${(props) => props.hasFooter ? '50px' : '0px'};
  }
`;

const ChangeHintHighlighted = styled.span`
  color: ${palette('buttonDefault', 1)};
`;

const ControlMain = styled.div`
  position: absolute;
  top: 40px;
  bottom: ${(props) => props.hasFooter ? '50px' : '0px'};
  left: 0;
  right: 0;
  overflow-y: auto;
  padding:0;
  padding-bottom: ${(props) => props.hasChangeNote ? '50px' : '0px'};
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    top: 60px;
  }
`;
const ControlFooter = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${palette('background', 1)};
  box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.2);
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    height: 50px;
  }
`;

const Search = styled.div`
  padding: 0.75em;
  background-color: ${palette('background', 1)};
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: 0.75em 1em;
  }
`;

const SelectAll = styled.div`
  padding: 0.5em 1em 0.5em 0;
  background-color: ${palette('background', 1)};
  display: table;
  width: 100%;
  line-height: 1.1;
`;

const LabelWrap = styled.div`
  display: table-cell;
  padding-left: 0.5em;
  padding-right: 1em;
  font-size: 0.8em;
  vertical-align: middle;
`;
const CheckboxWrap = styled.div`
  text-align: center;
  display: table-cell;
  width: 10px;
  vertical-align: middle;
  padding-left: 0.75em;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding-right: 0.5em;
    padding-left: 1em;
  }

`;
const Checkbox = styled(IndeterminateCheckbox)`
  vertical-align: middle;
`;
const Label = styled.label``;


class MultiSelect extends React.Component {
  constructor() {
    super();
    this.state = {
      query: null,
      optionsInitial: null,
      panelId: null,
      queryTags: [],
    };

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentWillMount() {
    // remember initial options
    this.setState({
      optionsInitial: this.props.options,
      panelId: this.props.panelId,
    });
    document.addEventListener('mousedown', this.handleClickOutside);
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

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  onSearch = (value) => {
    this.setState({
      query: value,
    });
  }
  onResetFilters = () => {
    this.setState({
      query: null,
      queryTags: [],
    });
  }
  onTagSelected = (active, tagOption) => {
    this.setState({
      queryTags: active
        ? this.state.queryTags.concat([tagOption.get('value')])
        : without(this.state.queryTags, tagOption.get('value')),
    });
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  getNextValues = (checked, option) => {
    const { multiple, required, values } = this.props;
    // do not update if required and change would result in empty list
    if (!checked && required) {
      const otherCheckedValues = values.find((v) =>
        v.get('checked')
          && v.get('value') !== option.get('value')
          && (option.get('query') ? v.get('query') === option.get('query') : true)
      );
      if (!otherCheckedValues) {
        return values;
      }
    }

    // uncheck all others if single mode (!multiple)
    let nextValues = values;
    const existingValueIndex = values.findIndex((v) =>
      v.get('value') === option.get('value')
        && (option.get('query') ? v.get('query') === option.get('query') : true)
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

  getAllSelectedValues = (checked, options) => {
    const { values } = this.props;
    // TODO consider how to deal with required variant
    // uncheck all others if single mode (!multiple)
    let nextValues = values;
    options.forEach((option) => {
      const existingValueIndex = values.findIndex((v) =>
        v.get('value') === option.get('value')
          && (option.get('query') ? v.get('query') === option.get('query') : true)
      );
      const newValue = option.set('checked', checked).set('hasChanged', true);
      // set new value
      // set current value, add if not present
      nextValues = existingValueIndex > -1
        ? nextValues.set(existingValueIndex, newValue)
        : nextValues.push(newValue);
    });
    return nextValues;
  }

  getSelectedState = (selectedTotal, allSelected) => {
    if (selectedTotal === 0) {
      return CHECKBOX_STATES.UNCHECKED;
    }
    if (selectedTotal > 0 && allSelected) {
      return CHECKBOX_STATES.CHECKED;
    }
    return CHECKBOX_STATES.INDETERMINATE;
  }

  handleClickOutside(event) {
    if (this.props.closeOnClickOutside && this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.onCancel();
    }
  }

  // props, state
  // map options
  prepareOptions = ({ options, values, threeState }, { optionsInitial }) => options.map((option) => {
    const value = values.find((v) => option.get('value') === v.get('value'));// && option.get('query') === v.get('query'));
    const isNew = !optionsInitial.includes(option);
    const isIndeterminateInitial = threeState && this.isOptionIndeterminate(option);
    const isCheckedIntitial = option.get('checked');
    const optionUpdated = option.withMutations((o) =>
      o.set('isNew', isNew)
      .set('initialChecked', isCheckedIntitial)
      .set('isIndeterminate', isIndeterminateInitial)
    );
    return value
    ? optionUpdated.withMutations((o) =>
      o.set('checked', value.get('checked'))
      .set('changedToChecked', value.get('checked') && !isCheckedIntitial)
      .set('changedToUnchecked', !value.get('checked') && !this.isOptionIndeterminate(value) && (isCheckedIntitial || isIndeterminateInitial))
    )
    : optionUpdated;
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

  isOptionIndeterminate = (option) => option.get('checked') === CHECKBOX_STATES.INDETERMINATE;

  renderButton = (action, i, hasChanges) => (
    <ButtonFactory
      key={i}
      button={{
        type: action.type === 'primary' ? 'formPrimary' : (action.type || 'text'),
        title: action.title,
        onClick: action.onClick && (() => action.onClick()),
        submit: action.submit,
        disabled: action.submit && !hasChanges,
      }}
    />
  );

  render() {
    let options = this.prepareOptions(this.props, this.state);

    const optionsChangedToChecked = options.filter((option) => option.get('changedToChecked'));
    const optionsChangedToUnchecked = options.filter((option) => option.get('changedToUnchecked'));
    const hasChanges = optionsChangedToChecked.size > 0 || optionsChangedToUnchecked.size > 0;
    const showChangeHint = this.props.advanced && hasChanges;

    options = this.filterOptions(options, this.props, this.state);
    const filteredOptionsSelected = options.filter((option) => option.get('checked') || this.isOptionIndeterminate(option));

    return (
      <div ref={this.setWrapperRef}>
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
                onClear={this.onResetFilters}
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
          { this.props.selectAll &&
            <SelectAll>
              <CheckboxWrap>
                <Checkbox
                  id="select-all-multiselect"
                  checked={this.getSelectedState(filteredOptionsSelected.size, filteredOptionsSelected.size === options.size)}
                  onChange={(checkedState) =>
                    this.props.onChange(this.getAllSelectedValues(checkedState, options))
                  }
                />
              </CheckboxWrap>
              <LabelWrap>
                <Label htmlFor="select-all-multiselect">
                  {filteredOptionsSelected.size > 0
                    ? `${filteredOptionsSelected.size} option(s) selected`
                    : 'Options'
                  }
                </Label>
              </LabelWrap>
            </SelectAll>
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
            <FormattedMessage {...messages.changeHint} />
            {optionsChangedToChecked.size > 0 &&
              <ChangeHintHighlighted>
                <FormattedMessage {...messages.changeHintSelected} values={{ no: optionsChangedToChecked.size }} />
                .
              </ChangeHintHighlighted>
            }
            {optionsChangedToUnchecked.size > 0 &&
              <ChangeHintHighlighted>
                <FormattedMessage {...messages.changeHintUnselected} values={{ no: optionsChangedToUnchecked.size }} />
                .
              </ChangeHintHighlighted>
            }
          </ChangeHint>
        }
        { this.props.buttons &&
          <ControlFooter>
            <ButtonGroup>
              {
                this.props.buttons.map((action, i) =>
                  action && action.position !== 'left' && this.renderButton(action, i, hasChanges))
              }
            </ButtonGroup>
            <ButtonGroup left>
              {
                this.props.buttons.map((action, i) => (
                  action && action.position === 'left' && this.renderButton(action, i, hasChanges)
                ))
              }
            </ButtonGroup>
          </ControlFooter>
        }
      </div>
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
  selectAll: PropTypes.bool,
  closeOnClickOutside: PropTypes.bool,
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
  closeOnClickOutside: true,
};

export default MultiSelect;
