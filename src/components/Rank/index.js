/**
 * Created by jiajunhe on 2016/12/9.
 */
'use strict';
/*工具*/
import React from 'react'; // 引用react模块才可以有jsx语法
import './main.css';
import {connect} from 'react-redux'; // 需要使用redux的组件才能有触发状态修改的方法dispatch
import { push } from 'react-router-redux'; // 因有路由器的修改路由触发状态修改的方法push
/*组件*/
import RankTags from './RankTags';
import AllCtrlBtn from '../common/AllCtrlBtn';
import SongList from '../common/SongList';
import PageIndex from '../common/PageIndex';
import RankDate from '../common/RankDate/index';
/*信号*/
import {toggleDatePanel} from '../../action/rank';
import * as signalAction from '../../action/rank';
import * as thunkAction from '../../action/rank_sideAction';
/*模式: 异步管理模式还是状态管理器*/
const {changeSongsOfPage, changeSongsOfDate, initialContent, changeSongsOfRank} =
	(window.actionMode === 'sagaMode'? signalAction: thunkAction);
/*创建组件*/
class Rank extends React.Component {
	constructor(props){
		super(props);
		const _this = this, dispatch = props.dispatch; // 注意: dispatch方法是redux模块提供的
		// 初始化页面内容: 请求推荐rankTag与songs
		dispatch(initialContent(props.params.rank_id, props.params.pageIndex));

		this.setPageIndex = (pageIndex) => (
			dispatch(changeSongsOfPage(_this.props.params.rank_id, pageIndex))
		);
		this.onSelectDate = (rank_id) => {
			dispatch(changeSongsOfDate(rank_id));
			if(_this.props.params.pageIndex != 1){ // 特殊的路由处理
				dispatch(push('Rank/'+_this.props.params.rank_id+'/1'));
			}
		};
		this.onSelectTag = (rank_id) => (
			dispatch(changeSongsOfRank(rank_id))
		);

		this.hideRankDatePanelIfBlur = (e) => {
			if(e.target && !_this.refs.RankDate.contains(e.target)){ _this.hideDatePanel(); }
		};

		this.toggleDatePanel = (boolean) => {dispatch(toggleDatePanel(boolean));};

		this.hideDatePanel = () => {dispatch(toggleDatePanel(false));};

	}
	render() {
		const props = this.props;
		console.log('渲染组件 Rank');
		return (
			<div id="rankPage"
				 className={props.loadingSongs?'wrap loadingSongs':'wrap'}
				/*以RankDate的显示状态来选择性绑定事件*/
				 onClick={props.displayDatePanel && this.hideRankDatePanelIfBlur}>
				<div className="l hoverScrollBar fl">
					<RankTags activeTagId={props.params.rank_id} onSelectTag={this.onSelectTag}/>
				</div>
				<div className="r contentScrollBar fr"
					/*以RankDate的显示状态来选择性绑定事件*/
					 onScroll={props.displayDatePanel && this.hideDatePanel}>
					<div className="top" ref='RankDate'>
						<h3 id="rankTitle">{props.currentRankTitle}</h3>
						{props.dates && props.dates.length && (<RankDate
							/*注意: 选择性的渲染组件优化性能*/
							onSelectDate={this.onSelectDate}
							dates={props.dates}
							/*注意: key是组件重新渲染的重要依据*/
							key={props.params.rank_id}
							displayDatePanel={props.displayDatePanel}
							toggleDatePanel={this.toggleDatePanel}
							currentRankDateId={props.currentRankDateId}/>) || ''}
					</div>
					{props.maxPageIndex && (<PageIndex
						maxPageIndex={props.maxPageIndex}
						pageIndex={props.pageIndex}
						onClick={this.setPageIndex}/>) || ''}
					<AllCtrlBtn />
					{props.songs && props.songs.length && (<SongList
						songs={props.songs}
						preIndex={props.preIndex}/>) || ''}
				</div>
			</div>
		);
	}
}

export default connect(
	(state, props) => {
		const current = state.Rank.current,
			currentRankTag = props.params.rank_id && state.Rank.rankTags[props.params.rank_id],
			pageIndex = props.params.pageIndex || 1,
			preIndex = (pageIndex - 1) * 30 + 1;

		const result = {
			// 页码
			pageIndex,
			maxPageIndex: current.maxPageIndex,
			// 当前排行榜名称
			currentRankTitle: currentRankTag && currentRankTag.rank_name || '',
			// 歌曲列表
			songs: state.Rank.songs,
			preIndex,
			// 加载歌曲的状态
			loadingSongs : current.loadingSongs,
			// 展示日历组件
			displayDatePanel: current.displayDatePanel,
			// 日历组件数据
			dates : state.Rank.dates,
			currentRankDateId : current.rankDateId
		};
		console.log('_____rank_props______', result);
		return result;
	}
)(Rank);
