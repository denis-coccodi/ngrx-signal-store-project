interface TableHeaderSelectorButton<T> {
	id: T;
	btnLabel: string;
}

export interface TableHeaderSelector<T> {
	title: string,
	selected?: T,
	onClickFunction: (e: T) => void;
	selectors: TableHeaderSelectorButton<T>[]
}
