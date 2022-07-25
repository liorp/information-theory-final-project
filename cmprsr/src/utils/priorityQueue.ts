/* eslint-disable unicorn/no-abusive-eslint-disable */
/* eslint-disable */

export class BinaryHeapStrategy<T> implements QueueStrategy<T> {
	private readonly comparator: Comparator<T>

	public data: T[]

	constructor(options: Options<T>) {
		this.comparator = options.comparator
		this.data = options.initialValues ? [...options.initialValues] : []
		this._heapify()
	}

	private _heapify() {
		if (this.data.length > 0) {
			for (let index = 0; index < this.data.length; index++) {
				this._bubbleUp(index)
			}
		}
	}

	public queue(value: T) {
		this.data.push(value)
		this._bubbleUp(this.data.length - 1)
	}

	public dequeue(): T {
		const returnValue = this.data[0]
		const last = this.data.pop()
		if (this.data.length > 0 && last !== undefined) {
			this.data[0] = last
			this._bubbleDown(0)
		}
		return returnValue
	}

	public peek(): T {
		return this.data[0]
	}

	public clear() {
		this.data.length = 0
	}

	public _bubbleUp(pos: number): any {
		while (pos > 0) {
			const parent = (pos - 1) >>> 1
			if (this.comparator(this.data[pos], this.data[parent]) < 0) {
				const x = this.data[parent]
				this.data[parent] = this.data[pos]
				this.data[pos] = x
				pos = parent
			} else {
				break
			}
		}
	}

	public _bubbleDown(pos: number) {
		const last = this.data.length - 1
		while (true) {
			const left = (pos << 1) + 1
			const right = left + 1
			let minIndex = pos
			if (
				left <= last &&
				this.comparator(this.data[left], this.data[minIndex]) < 0
			) {
				minIndex = left
			}
			if (
				right <= last &&
				this.comparator(this.data[right], this.data[minIndex]) < 0
			) {
				minIndex = right
			}
			if (minIndex !== pos) {
				const x = this.data[minIndex]
				this.data[minIndex] = this.data[pos]
				this.data[pos] = x
				pos = minIndex
			} else {
				break
			}
		}
		return void 0
	}
}

export type Comparator<T> = (a: T, b: T) => number

export interface Options<T> {
	comparator: Comparator<T>
	initialValues?: T[]
}

export interface QueueStrategy<T> {
	data: T[]
	queue: (value: T) => void
	dequeue: () => T
	peek: () => T
	clear: () => void
}

export class PriorityQueue<T> {
	private _length = 0

	public get length() {
		return this._length
	}

	public readonly strategy: QueueStrategy<T>

	public constructor(options: Options<T>) {
		this._length = options.initialValues ? options.initialValues.length : 0
		this.strategy = new BinaryHeapStrategy(options)
	}

	public queue(value: T) {
		this._length++
		this.strategy.queue(value)
	}

	public dequeue() {
		if (!this._length) throw new Error('Empty queue')
		this._length--
		return this.strategy.dequeue()
	}

	public peek() {
		if (!this._length) throw new Error('Empty queue')
		return this.strategy.peek()
	}

	public clear() {
		this._length = 0
		this.strategy.clear()
	}
}
