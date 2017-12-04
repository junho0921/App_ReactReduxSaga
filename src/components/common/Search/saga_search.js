/**
 * Created by jiajunhe on 2017/12/9.
 */
import {
  RECEIVE_IMAGINE_SINGER,
  FOCUS_MOVE,
  RECEIVE_SINGERS,
  CLEAR_UI,

  resetUI,
  receiveSingerNames,

  IMAGINE_SINGER,
  SEARCH_SONG,

} from './action';
import { take, put, call, fork, race, cancelled, all } from 'redux-saga/effects';
import {ajax} from '../../../utils/jquery.min';
import {singerDataReducer} from './reducer';
const SEARCH_SONG_URL = 'http://songsearch.kugou.com/accsong_search_v2';

/*异步操作*/
// 请求歌手
const getSinger = (config) => {
  if(config.word){
    // 优先读取缓存
    if(
      config.word === getSinger.lastConfig.word &&
      config.page === getSinger.lastConfig.page
    ){
      return getSinger.lastResult;
    }
    var p = new Promise((resolve, reject) =>
      ajax({
        url: SEARCH_SONG_URL + '?platform=WebFilter&PrivilegeFilter=0&pagesize=30&keyword='+config.word+'&page=' + config.page,
        dataType: 'jsonp',
        timeout: 2000,
        success: resolve,
        error: reject,
        jsonp: 'callback'
      })
    );
    p.then((result) => {
      getSinger.lastConfig = config.lastConfig;
      getSinger.lastResult = result;
      return result;
    });
    return p;
  }else{
    getSinger.lastConfig = {};
    getSinger.lastResult = {};
    return false;
  }
};

/*异步操作*/
/*
 * 幻想歌手名称
 * */
function* imagineSinger () {
  const res = yield take(IMAGINE_SINGER);
  var searchWord = res.data;
  searchWord = searchWord && searchWord.trim() || '';
  // 重置ui
  put(resetUI());
  // 触发状态更新
  const result = yield fork(getSinger, {
    word: searchWord,
    page: 1
  });
  // 若有返回值, 更新列表
  result && yield put(receiveSingerNames(result));
}
/*
 * 搜索歌曲
 * */
function* searchSong () {
  const res = yield take(SEARCH_SONG);
  // 重置ui
  put(resetUI());
  // 触发状态更新
  const result = yield fork(getSinger, {
    word: res.data.searchWord,
    page: res.data.searchPage
  });
  res.data.onSearchOut && res.data.onSearchOut({
    data: singerDataReducer(result),
    searchWord: res.data.searchWord,
    searchPage: res.data.searchPage
  });
}

export default function* root() {
  yield fork(imagineSinger);
  yield fork(searchSong);
}
