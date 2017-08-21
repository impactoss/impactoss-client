import { List } from 'immutable';

export default function asList(v) {
  return List.isList(v) ? v : List([v]);
}
