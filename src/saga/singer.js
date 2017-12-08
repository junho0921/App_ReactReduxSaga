/**
 * Created by jiajunhe on 2017/1/9.
 */
import {
  ONCHANGE_SINGER_CLASS,
  ONCHANGE_SINGER_INITIAL,
  ONCHANGE_SINGER_SORT,
  ONCHANGE_SINGER_PAGE,
  ON_PAGE_INIT,

  loadingSingers,
  receiveSingers,
} from '../action/singer';
import { take, put, call, fork, race, cancelled, all } from 'redux-saga/effects';

import {
  _singerRequest
} from '../utils/requestApi';
import { push } from 'react-router-redux';


/*内部的异步action*/
/*获取rankTag的完整信息, 这里主要是获取rankTag的image信息*/
function* getSingers (data){
  // 更新状态为加载状态
  yield put(loadingSingers(data));
  // 请求数据
  const result = yield _singerRequest.get(data);
  // 更新获取到的歌手数据
  yield put(receiveSingers(result, data));
  // yield put(push('singer/')); // 后续开发
}

/*异步操作*/
/*
* 获取默认的歌手列表
* */
function* onSingerPageInit () {
  while(true) {
    const result = yield take(ON_PAGE_INIT);
    yield fork(getSingers, result.data);
  }
}
/*
* 搜索歌手, 通过歌手名称索引字母
* */
function* change_singer_initial () {
  while(true) {
    const result = yield take(ONCHANGE_SINGER_INITIAL);
    yield fork(getSingers, result.data);
  }
}
/*
* 搜索歌手, 通过歌手类别
* */
function* change_singer_class () {
  while(true) {
    const result = yield take(ONCHANGE_SINGER_CLASS);
    yield fork(getSingers, result.data);
  }
}
/*
* 搜索歌手, 通过现有歌手列表的排序变换
* */
function* change_singer_sort () {
  while(true) {
    const result = yield take(ONCHANGE_SINGER_SORT);
    yield fork(getSingers, result.data);
  }
}
/*
* 搜索歌手, 通过现有歌手列表的换页
* */
function* change_singer_page () {
  while(true) {
    const result = yield take(ONCHANGE_SINGER_PAGE);
    yield fork(getSingers, result.data);
  }
}

export default function* singerRoot() {
  yield fork(onSingerPageInit);
  yield fork(change_singer_initial);
  yield fork(change_singer_page);
  yield fork(change_singer_sort);
  yield fork(change_singer_class);
}
