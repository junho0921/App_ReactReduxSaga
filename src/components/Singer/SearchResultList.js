/**
 * Created by jiajunhe on 2016/12/22.
 */


export default function SearchResultList (props) {
  console.log('渲染组件 SearchResultList');
  const list = props.searchResult.data.lists;
  return (
		<div id="searchResultList">
			<div onClick={props.onClearResult}>返回</div>

			<span>
				搜索:
				<p id="searchWord">{props.searchWord}</p>
				, 共
				<em id="resultLen">{list.length}</em>
				条记录
			</span>

			<ul id="list1">
        {list.map((item) => (
					<li
						key={item.hashKey}
						onClick={props.onSelectResult.bind({}, item)}>
						<span className="ran">{item.index}</span>
            { item.songName } - { item.singerName }
					</li>
        ))}
			</ul>
		</div>
  )
}