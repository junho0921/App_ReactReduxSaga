/**
 * Created by jiajunhe on 2017/1/9.
 */
import {
  ONCHANGE_SINGER_CLASS,
  ONCHANGE_SINGER_INITIAL,
  ONCHANGE_SINGER_SORT,
  ONCHANGE_SINGER_PAGE,
  ON_PAGE_INIT,
} from '../action/singer';
import { take, put, call, fork, race, cancelled, all } from 'redux-saga/effects';

import {
  _singerRequest
} from '../utils/requestApi';
import { push } from 'react-router-redux';

var defaultRequestData = { // todo 优化位置
  initial: '',
  sort: 1,
  lang_ids: '',
  sex_type: '',
  page:  1,
  pagesize: 60,
};
/*内部的异步action*/
/*获取rankTag的完整信息, 这里主要是获取rankTag的image信息*/
function* getSingers (data){
  // 补充默认的请求数据
  data = Object.assign({...defaultRequestData}, data);
  // 更新状态为加载状态
  yield put(loadingSingers(data));
  // 请求数据
  const result = yield _singerRequest.get(data);
  // 更新获取到的歌手数据
  yield put(receiveRankDetail(result.data));
  yield put(push('singer/'));
}

/*异步操作*/
/*
* 获取默认的歌手列表
* */
function* onSingerPageInit () {
  const data = yield take(ON_PAGE_INIT);
  const requestData = Object.assign({...defaultRequestData}, data);
  yield fork(getSingers, requestData);

}
/*
* 搜索歌手, 通过歌手名称索引字母
* */
function* change_singer_initial () {
  const result = yield take(ONCHANGE_SINGER_INITIAL);
  yield fork(getSingers, {initial: result.initial, page: 1});
}
/*
* 搜索歌手, 通过歌手类别
* */
function* change_singer_class () {
  const result = yield take(ONCHANGE_SINGER_CLASS);
  yield fork(getSingers, {
    initial: '',
    page: 1,
    sex_type: result.sex_type,
    lang_ids: result.lang_ids
  });
}
/*
* 搜索歌手, 通过现有歌手列表的排序变换
* */
function* change_singer_sort () {
  const result = yield take(ONCHANGE_SINGER_SORT);
  yield fork(getSingers, {sort: result.sort});
}
/*
* 搜索歌手, 通过现有歌手列表的换页
* */
function* change_singer_page () {
  const result = yield take(ONCHANGE_SINGER_PAGE);
  yield fork(getSingers, {page: result.page});
}

export default function* root() {
  yield fork(onSingerPageInit);
  yield fork(change_singer_initial);
  yield fork(change_singer_page);
  yield fork(change_singer_sort);
  yield fork(change_singer_class);
}
