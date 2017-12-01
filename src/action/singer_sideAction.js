'use strict';
import {_singerRequest} from '../utils/requestApi';

/*常量标记action*/
import {
  receiveSingers,
  loadingSingers,
  receiveSearch,
  clearSearchResult,
  change_search_Page,
  change_singer_displayMode,
} from './singer';

/*异步操作*/
/*
* 请求歌手数据
* */
const getSingers = (data) => ((dispatch, getState) => {
  if(!data){return false}
  const state = getState();
  let requestData = state.Singer.requestData;
  requestData = Object.assign({...requestData}, data);
  // 改变页面状态
  dispatch(loadingSingers(requestData));
  // 请求数据
  return _singerRequest
    .get(requestData)
    .then((result) =>
      dispatch(receiveSingers(result, requestData))
    );
});
/*
* 获取默认的歌手列表
* */
const getDefaultSingers = (data) => (
  getSingers(Object.assign({
    initial: '',
    lang_ids: '',
    sort: 1,
    sex_type: '',
    page: 1,
    pagesize: 60
  }, data || {}))
);
/*
* 搜索歌手, 通过歌手名称索引字母
* */
const change_singer_initial = (initial) => (
  getSingers({
    initial,
    page: 1
  })
);
/*
* 搜索歌手, 通过歌手类别
* */
const change_singer_class = (sex_type, lang_ids) => (
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
const change_singer_sort = (sort) => (
  getSingers({sort})
);
/*
* 搜索歌手, 通过现有歌手列表的换页
* */
const change_singer_page = (page) => (
  getSingers({page})
);


/*测试: 歌手链接*/
function linkToSingerDetail(singerId){
  console.log('linkToSingerDetail', singerId);
}


// 对外输出
module.exports = {
  change_singer_class,
  change_singer_displayMode,
  change_singer_page,
  change_singer_sort,
  change_singer_initial,

  receiveSearch,
  clearSearchResult,
  change_search_Page,

  getDefaultSingers
};