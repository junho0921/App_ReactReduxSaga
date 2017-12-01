'use strict';
import {_singerRequest} from '../utils/requestApi';
import {superRequest} from '../utils/index';

// 常量: 服务器返回信息
export const RECEIVE_SINGERS = 'RECEIVE_SINGERS';
// 常量: 用户操作
export const CHANGE_DISPLAY_MODE = 'CHANGE_DISPLAY_MODE';
// 常量: 状态
export const LOADING_SINGERS = 'LOADING_SINGERS';
// 常量: 搜索
export const RECEIVE_SEARCH = 'RECEIVE_SEARCH';
export const CHANGE_SEARCH_PAGE = 'CHANGE_SEARCH_PAGE';

/*常量标记action*/
// action - 加载歌手状态
export const loadingSingers = (requestData) => ({
  type: LOADING_SINGERS,
  data: {config: requestData}
});
// action - 更新歌手数据
export const receiveSingers = (result, requestData) => ({
  type: RECEIVE_SINGERS,
  data:{
    result,
    config: requestData
  }
});
// action - 更新搜索结果
export const receiveSearch = (data) => ({
  type: RECEIVE_SEARCH,
  data : data || {}
});
// action - 清空搜索结果
export const clearSearchResult = () => ({
  type: RECEIVE_SEARCH,
  data : {}
});
// action - 更新搜索页面index
export const change_search_Page = (pageIndex) => ({
  type: CHANGE_SEARCH_PAGE,
  data: pageIndex
});
// action - 更新歌手列表的显示方式
export const change_singer_displayMode = (displayMode) => ({
  type: CHANGE_DISPLAY_MODE,
  data: displayMode
});

/*异步操作-常量action*/
// 常量: 服务器返回信息
export const ONCHANGE_SINGER_CLASS = 'ONCHANGE_SINGER_CLASS';
// 常量: 用户操作
export const ONCHANGE_SINGER_INITIAL = 'ONCHANGE_SINGER_INITIAL';
// 常量: 状态
export const ONCHANGE_SINGER_SORT = 'ONCHANGE_SINGER_SORT';
// 常量: 搜索
export const ONCHANGE_SINGER_PAGE = 'ONCHANGE_SINGER_PAGE';
export const ON_PAGE_INIT = 'CHANGE_SEARCH_PAGE';

/*
* 获取默认的歌手列表
* */
export const getDefaultSingers = (data) => ({
  type: ON_PAGE_INIT
});
/*
* 搜索歌手, 通过歌手名称索引字母
* */
export const change_singer_initial = (initial) => ({
  type: ONCHANGE_SINGER_INITIAL,
  data:{initial, page: 1}
});
/*
* 搜索歌手, 通过歌手类别
* */
export const change_singer_class = (sex_type, lang_ids) => ({
  type: ONCHANGE_SINGER_CLASS,
  data: {
    initial: '',
    page: 1, // todo 删除, 通过默认的请求数据填充就好了
    sex_type,
    lang_ids
  }
});
/*
* 搜索歌手, 通过现有歌手列表的排序变换
* */
export const change_singer_sort = (sort) => ({
  type: ONCHANGE_SINGER_SORT,
  data: {sort}
});
/*
* 搜索歌手, 通过现有歌手列表的换页
* */
export const change_singer_page = (page) => ({
  type: ONCHANGE_SINGER_PAGE,
  data: {page}
});
