export let WorkerIterator = {
    workers: [],
    [Symbol.iterator]() {
        return this;
    },
    next() {
        if (this.current === undefined) {
            this.current = 0
        } else {
            this.current++;
        }
        if (this.current < this.workers.length) {
            return {
                done: false,
                value: this.workers[this.current]
            };
        } else {
            delete this.current;
            return {
                done: true
            };
        }
    }
};