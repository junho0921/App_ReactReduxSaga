/**
 * Created by jiajunhe on 2016/12/10.
 */
import React from 'react';
import {connect} from 'react-redux';
import {
  imagineSinger,
  focusMove,
  onSearchSongs,
  searchSong,
  input,
  initSearchInput
} from '../Search/action';

import reducer from '../Search/reducer';
import '../Search/main.css';

/*
* Search组件是用于搜索功能的组件.
* 注意:
* 这个组件是测试组件, 放弃redux工具但沿用redux的理念, 实现的flux渲染模式
* 特点:
* 1, 是独立的组件, 有自己的请求方法与数据渲染, 可以不依赖外部数据
* 2, 提供给外部组件数据:
* props = {
* 	searchWord, 	// 搜索字符串
* 	searchPage,		// 搜索字符串的页码, 可以动态传参来搜索下一页
* 	onSearchOut,	// 搜索返回结果后的callback, 传参searchWord, searchPage, result, maxPageIndex数据
* 	onSearchSongs, // 点击联想歌手后的callback
* }
*
* */
class Search extends React.Component {
  constructor(props){
    super(props);
    const _this = this,
      getState = () => ({Search: _this.state}),
      dispatch = (action) => {
        if(typeof action === 'function'){
          action(dispatch, getState);
        } else {
          const newStateContent = reducer(_this.state, action);
          if(newStateContent){_this.setState(newStateContent);}
        }
      };
    // 初始化组件属性
    this.state = reducer(undefined, {});
    // 这个测试模式下获取传递的属性是通过这样的方法
    this.getProps = () => _this.state;
    // 接受传参来初始化输入框的内容
    dispatch(initSearchInput(props.searchWord));

    /*=============绑定事件=============*/
    this.onSearchSongs = (keyWord) => (() => {
      dispatch(onSearchSongs(keyWord));
      typeof props.api_onSearchSongs === 'function' && props.api_onSearchSongs(keyWord);
    });
    this.inputChangeHandler = () => {
      dispatch(imagineSinger);
    };
    this.keyPressHandler = (e) => {
      if(e.key && e.key.length < 2) {
        dispatch(input(e.key))
      }
    };
    this.keyDownHandler = (e) => {
      switch (e.keyCode) {
        // 对非输入的操作键进行对应处理
        case 38: return dispatch(focusMove('up'));
        case 40: return dispatch(focusMove('down'));
        case 8:  return dispatch(input('deleteWord'));
        case 13:
          const
            props = this.getProps(),
            focusIndex = props.focusIndex;
          const keyWord = focusIndex < 0 ? props.inputValue.trim() : props.imagineList[focusIndex];
          return this.searchSong(keyWord);
      }
    };
    this.searchSong = (searchWord, searchPage, onSearchOut) => {
      dispatch(searchSong(
        searchWord 	|| _this.getProps().inputValue.trim(),
        searchPage 	|| 1,
        onSearchOut || _this.props.onSearchOut
      ));
      _this.refs.searchInput.blur && _this.refs.searchInput.blur();
    };
    this.clickToSearch = (searchWord) => () => this.searchSong(searchWord);
  }

  componentWillReceiveProps(newProps){
    if(newProps.searchPage !== this.props.searchPage){
      console.warn('页面更新了searchSinger', newProps.searchPage , this.props.searchPage);
      this.searchSong(
        newProps.searchWord,
        newProps.searchPage,
        newProps.onSearchOut
      );
    }
  }

  render() {
    console.log('渲染组件 Search');
    const
      props = this.getProps(), // 从state对象里获取属性
      imagineList = props.imagineList,
      focusIndex = props.focusIndex,
      clickToSearch = this.clickToSearch;

    return (
      <div
        id="SearchInput"
        className={props.inputValue && 'canSearch'}>
        <input
          key='searchInput'
          ref='searchInput'
          type="text"
          placeholder="搜索歌手"
          onKeyDown={this.keyDownHandler}
          onChange={this.inputChangeHandler}
          onKeyPress={this.keyPressHandler}
          value={props.inputValue}/>
        {imagineList.length &&
        /*联想歌手的弹层*/
        (<ul id="poplist">
          {imagineList.map((singerName, i) => (
            <li
              key={singerName}
              title={singerName}
              className={focusIndex === i ? 'active' : ''}
              onClick={clickToSearch(singerName)}>
              {singerName}
            </li>)
          )}
        </ul>) || ''}
        <span id='searchBtn' title="搜索歌曲" onClick={clickToSearch()}>
					<i className="optSongBtn searchBtn" />
				</span>
      </div>
    );
  }
}

export default Search;