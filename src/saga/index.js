
import singerRoot from './singer';
import rankRoot from './rank';
import {fork} from 'redux-saga/effects';

export default function* rootSaga() {
  yield fork(singerRoot);
  yield fork(rankRoot);
}
