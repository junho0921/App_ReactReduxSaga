/**
 * Created by jiajunhe on 2016/12/10.
 */
import React from 'react';
// import {connect} from 'react-redux';
import {connect} from '../Search_flux/searchComponent_redux'; // jun模拟redux的组件
import {
	imagineSinger,
	focusMove,
  onSearchSongs,
	searchSong,
	input,
  initSearchInput
} from './action';

import './main.css';

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
			dispatch = props.dispatch;
    // 接受传参来初始化输入框的内容
    dispatch(initSearchInput(props.searchWord));

		/*=============绑定事件=============*/
		this.onSearchSongs = (keyWord) => (() => {
			dispatch(onSearchSongs(keyWord));
			typeof _this.props.api_onSearchSongs === 'function' && _this.props.api_onSearchSongs(keyWord);
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
					const focusIndex = _this.props.focusIndex;
					const keyWord = focusIndex < 0 ? _this.props.inputValue.trim() : _this.props.imagineList[focusIndex];
          return this.searchSong(keyWord);
      }
		};
		this.searchSong = (searchWord, searchPage, onSearchOut) => {
			dispatch(searchSong(
        searchWord 	|| _this.props.inputValue.trim(),
        searchPage 	|| 1,
        onSearchOut || _this.props.onSearchOut
			));
			_this.refs.searchInput.blur && _this.refs.searchInput.blur();
		};
		this.clickToSearch = (searchWord) => () => this.searchSong(searchWord);
	}

	componentWillReceiveProps(newProps){
		if(newProps.searchPage !== this.props.searchPage){
		  // 不知道合理不
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
      props = this.props,
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

export default connect(
  (state) => {
    const searchCpData = state.Search;
    console.log('_____Search_props______', searchCpData);
    return searchCpData;
  }
)(Search);