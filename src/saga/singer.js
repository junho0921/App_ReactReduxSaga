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
  const result = yield _rankDetailRequest.get({data: idArrays});
  yield put(receiveRankDetail(result.data));

  const requestData = Object.assign({...defaultRequestData}, data);

  yield put(loadingSingers(requestData));

  const result = yield _singerRequest.get(data)
  // 请求数据
  return superRequest({
    url: _singerRequest.URL,
    data: Object.assign({..._singerRequest.data}, requestData),
    success: (result) => dispatch(receiveSingers(result, requestData))
  });
}

/*异步操作*/
/*
* 获取默认的歌手列表
* */
function* getDefaultSingers () {
  const data = yield take(ON_PAGE_INIT);
  yield fork(getSingers);
}
/*
* 搜索歌手, 通过歌手名称索引字母
* */
export const change_singer_initial = (initial) => (
  getSingers({
    initial,
    page: 1
  })
);
/*
* 搜索歌手, 通过歌手类别
* */
export const change_singer_class = (sex_type, lang_ids) => (
  getSingers({
    initial: '',
    page: 1,
    sex_type,
    lang_ids
  })
);
/*
* 搜索歌手, 通过现有歌手列表的排序变换
* */
export const change_singer_sort = (sort) => (
  getSingers({sort})
);
/*
* 搜索歌手, 通过现有歌手列表的换页
* */
export const change_singer_page = (page) => (
  getSingers({page})
);


/*测试: 歌手链接*/
function linkToSingerDetail(singerId){
  console.log('linkToSingerDetail', singerId);
}


export default function* root() {
  yield fork(listen_initialContent);
  yield fork(listen_changeSongsOfRank);
  yield fork(listen_changeSongsOfDate);
  yield fork(listen_changeSongsOfPage);
}
