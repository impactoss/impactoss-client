import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { kebabCase } from 'lodash/string';
import { FormattedMessage } from 'react-intl';

import A from 'components/styled/A';
import IndeterminateCheckbox from 'components/forms/IndeterminateCheckbox';

import Option from './Option';

import messages from './messages';

const Styled = styled.div`
  width: 100%;
`;
const ListWrapper = styled.div`
  width: 100%;
  border-top: 1px solid ${palette('light', 1)};
`;

const OptionsWrapper = styled.div`
  display: table;
  width: 100%;
`;
const OptionWrapper = styled.div`
  display: table-row;
  width: 100%;
  line-height: 1.3;
  font-size: 0.8em;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    font-size: 1em;
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.default};
  }
`;
// background-color: ${(props) => {
//   if (props.changedToChecked) {
//     return '#e8ffe8';
//   }
//   if (props.changedToUnchecked) {
//     return '#e8ffe8';
//   }
//   return 'transparent';
// }}
const CheckboxWrapper = styled.div`
  display: table-cell;
  vertical-align: middle;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  padding-left: 16px;
  width: 10px;
  border-bottom: 1px solid ${palette('light', 1)};
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding-right: 0.5em;
    padding-left: 1em;
  }
`;

const OPTION_PADDING = '1em';
const OPTION_PADDING_SECONDARY = '0.5em';

const OptionLabel = styled.label`
  display: table-cell;
  vertical-align: middle;
  cursor: pointer;
  padding-top: ${OPTION_PADDING_SECONDARY};
  padding-bottom: ${OPTION_PADDING_SECONDARY};
  padding-left: 8px;
  padding-right: 8px;
  border-bottom: 1px solid ${palette('light', 1)};
  border-right: ${(props) => (props.changedToChecked || props.changedToUnchecked)
    ? '0.5em solid'
    : 'none'
};
  border-right-color: ${palette('buttonDefault', 1)};
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding-top: ${(props) => props.secondary ? OPTION_PADDING_SECONDARY : OPTION_PADDING};
    padding-bottom: ${(props) => props.secondary ? OPTION_PADDING_SECONDARY : OPTION_PADDING};
  }
`;

const OptionCount = styled.span`
  display: table-cell;
  vertical-align: middle;
  color: ${palette('text', 1)};
  font-size: 0.9em;
  padding-top: ${(props) => props.secondary ? OPTION_PADDING_SECONDARY : OPTION_PADDING};
  padding-bottom: ${(props) => props.secondary ? OPTION_PADDING_SECONDARY : OPTION_PADDING};
  padding-right: 1em;
  text-align: right;
  border-bottom: 1px solid ${palette('light', 1)};
  white-space: nowrap;
  @media print {
    font-size: ${(props) => props.theme.sizes.print.small};
  }
`;

const GroupWrapper = styled.div`
  width: 100%;
`;
const GroupTitle = styled.div`
  border-bottom: 1px solid ${palette('light', 1)};
  width: 100%;
  line-height: 1.3;
  font-size: 0.6em;
  font-weight: 500;
  padding: 0.8em 8px 0.4em 16px;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    font-size: 0.7em;
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.smallest};
  }
`;

const Empty = styled.div`
  padding: 1em;
  color: ${palette('text', 1)};
`;

const More = styled.div`
  display: block;
  width: 100%;
  padding: 0.5em 1em;
  text-align: center;
  font-size: 0.85em;
  @media print {
    font-size: ${(props) => props.theme.sizes.print.smaller};
  }
`;
const MoreLink = styled(A)`
  font-weight: bold;
`;

const SHOW_INCREMENT = 20;

class OptionList extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      show: SHOW_INCREMENT,
    };
  }

  showMore = () => {
    this.setState(
      (prevState) => ({
        show: prevState.show + SHOW_INCREMENT,
      })
    );
  }

  render() {
    // do groups not slice
    const options = this.props.groups
      ? this.props.options
      : (this.props.options && this.props.options.slice(0, this.state.show));
    const groups = options && options
      .groupBy((option) => option.get('group') || 1)
      .map((group, key) => this.props.groups
        ? Map()
          .set('options', group)
          .set('title', this.props.groups.get(key))
        : Map().set('options', group));

    const hasMore = options.size < this.props.options.size;

    return (
      <Styled>
        <ListWrapper>
          { groups && groups.toList().map((group, gid) => (
            <GroupWrapper key={gid}>
              { group.get('title') && (
                <GroupTitle>
                  { group.get('title') }
                </GroupTitle>
              )}
              <OptionsWrapper>
                { group.get('options') && group.get('options').map((option, i) => {
                  const checked = option.get('checked');
                  const isIndeterminate = option.get('isIndeterminate');
                  const id = `${i}-${kebabCase(option.get('value'))}`;
                  return (
                    <OptionWrapper
                      key={id}
                      changedToChecked={option.get('changedToChecked')}
                      changedToUnchecked={option.get('changedToUnchecked')}
                      secondary={this.props.secondary}
                    >
                      <CheckboxWrapper>
                        { isIndeterminate
                          && (
                            <IndeterminateCheckbox
                              id={id}
                              checked={checked}
                              onChange={(checkedState) => {
                                this.props.onCheckboxChange(checkedState, option);
                              }}
                            />
                          )
                        }
                        { !isIndeterminate
                          && (
                            <input
                              id={id}
                              type="checkbox"
                              checked={checked}
                              onChange={(evt) => {
                                evt.stopPropagation();
                                this.props.onCheckboxChange(evt.target.checked, option);
                              }}
                            />
                          )
                        }
                      </CheckboxWrapper>
                      <OptionLabel
                        htmlFor={id}
                        changedToChecked={option.get('changedToChecked')}
                        changedToUnchecked={option.get('changedToUnchecked')}
                        secondary={this.props.secondary}
                      >
                        <Option
                          bold={option.get('labelBold') || checked}
                          reference={typeof option.get('reference') !== 'undefined' && option.get('reference') !== null ? option.get('reference').toString() : ''}
                          label={option.get('label')}
                          messagePrefix={option.get('messagePrefix')}
                          message={option.get('message')}
                          isNew={option.get('isNew')}
                          draft={option.get('draft')}
                        />
                      </OptionLabel>
                      { option.get('showCount') && typeof option.get('count') !== 'undefined'
                        && (
                          <OptionCount secondary={this.props.secondary}>
                            {option.get('count')}
                          </OptionCount>
                        )
                      }
                    </OptionWrapper>
                  );
                })}
              </OptionsWrapper>
            </GroupWrapper>
          ))}
          { (!this.props.options || this.props.options.size === 0)
            && (
              <Empty>
                <FormattedMessage {...messages.empty} />
              </Empty>
            )
          }
        </ListWrapper>
        { hasMore
          && (
            <More>
              <FormattedMessage
                {...messages.showingOptions}
                values={{
                  no: options.size,
                  total: this.props.options.size,
                }}
              />
              <MoreLink
                href="/"
                onClick={(evt) => {
                  if (evt && evt.preventDefault) evt.preventDefault();
                  this.showMore();
                }}
              >
                <FormattedMessage {...messages.showMore} />
              </MoreLink>
            </More>
          )
        }
      </Styled>
    );
  }
}


OptionList.propTypes = {
  options: PropTypes.object,
  groups: PropTypes.object,
  onCheckboxChange: PropTypes.func,
  secondary: PropTypes.bool,
};

export default OptionList;
