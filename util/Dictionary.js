class Dictionary {
    constructor() {
        this.dictionary = {}
    }

    find(key="") { return this.dictionary[key] || null }

    set(key="", val) {
        this.dictionary[key] = val
        return this.dictionary[key]
    }

    spread(key="", newval) {
        if(!this.dictionary[key])
            this.dictionary[key] = {}
        this.dictionary[key] = {...(this.dictionary[key]), ...newval}
        return this.dictionary[key]
    }

    delete(key="") {
        if(this.dictionary[key])
            delete this.dictionary[key]
    }

    get flat() {
        return Object.values(this.dictionary)
    }
}

module.exports = Dictionary
