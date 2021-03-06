/**
 * Created by jiajunhe on 2016/12/9.
 */
/*actionType*/
import {
  RECEIVE_RECOMMEND_TAG,
  RECEIVE_RANK_DETAIL,
  RECEIVE_RANK_DATE,
  RECEIVE_RANK_SONGS,

  TOGGLE_DATE_PANEL,
  CHANGE_RANK_DATE_ID,

  CLEAR_DATES,
  CLEAR_SONGS,
  ON_LOADING_STATUS,
  CLEAR_PAGE_INDEX
} from "../../action/rank";

import {songPrivilege, by} from '../../utils/index';

const initialState = {
  /*
   * 路由参数: rank_id, pageIndex
   * */
  rankTags:{
    // [id]: {
    // 		rank_name, rank_id, intro, publish_date, update_frequency, icon
    // } ,...
  },
  rankClass:{
    // [rankClass]: [rankId1, rankId2] ,...
  },
  songs: [],
  date: [],
  current: {
    rankDateId: null,	// (object) 日历控件的激活标签Id
    totalSongsLen: null,
    maxPageIndex: 0,
    loadingSongs: false,
    displayDatePanel: false // 控制日历控件的展示 可能需要优化
  }
};

export function _tagsReducer (result, filter) {
  // 推荐标签返回数据的处理与过滤
  let renderDatas = [],
    models = {},
    sortList;

  Object.keys(result.data).forEach(function (key) {
    const value = result.data[key];
    // 过滤榜单标签
    if(+value[filter]){
      value.sort = +value.sort;
      const rank_id = value.cid;
      models[rank_id] = {
        rank_name: value.rankname,
        rank_id: rank_id
      };
      renderDatas.push(value);
    }
  });
  renderDatas.sort(by('sort'));
  sortList = renderDatas.map((item) => (item.cid));
  return {models, sortList};
}

export default (state = initialState, action) => {
  const data = action.data;

  switch (action.type){
    case RECEIVE_RECOMMEND_TAG:
      return Object.assign({...state}, {
        rankTags: 	Object.assign({...state.rankTags}, data.rankTags),
        rankClass: 	Object.assign({...state.rankClass}, data.rankClass)
      });

    case RECEIVE_RANK_DETAIL:
      let newRankTags = {};
      data.forEach((item) => {
        newRankTags[item.rank_id] = item;
      });
      return Object.assign({...state}, {
        rankTags: Object.assign({...state.rankTags}, newRankTags)
      });

    case RECEIVE_RANK_DATE:
      const dateDate = (data.data && data.data[0]) || [];
      return Object.assign({...state}, {
        dates: dateDate,
        current: Object.assign({...state.current}, {
          rankDateId: data.rank_id // todo 这里肯定事没有的, bug
        })
      });

    case RECEIVE_RANK_SONGS:
      let songs = data.data = data.data || [];
      songs.forEach(songPrivilege);
      return Object.assign({...state}, {
        songs,
        current: Object.assign({...state.current}, {
          maxPageIndex : +data.total ? Math.ceil(data.total / 30) : 0,
          loadingSongs: false
        })
      });

    case CHANGE_RANK_DATE_ID:
      return Object.assign({...state}, {
        current: Object.assign({...state.current}, {rankDateId: data})
      });

    /*用户操作系列*/
    case TOGGLE_DATE_PANEL:
      let boolean = data;
      if(boolean === undefined){
        boolean = !state.current.displayDatePanel;
      }
      return Object.assign({...state}, {
        current: Object.assign({...state.current}, {displayDatePanel: boolean})
      });
    case CLEAR_DATES:
      return Object.assign({...state}, {dates: []});
    case CLEAR_PAGE_INDEX:
      return Object.assign({...state}, {
        current: Object.assign({...state.current}, {
          maxPageIndex : 0
        })
      });
    case CLEAR_SONGS:
      return Object.assign({...state}, {songs: []});
    case ON_LOADING_STATUS:
      return Object.assign({...state}, {
        current: Object.assign({...state.current}, {
          loadingSongs: true
        })
      });

    default:
      return state;
  }
}