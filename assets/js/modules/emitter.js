// import Rx from 'rx'

// const Subject = Rx.Subject

const createName = (name) => {
    return 'app:' + name
}

const Emitter = {
    // subjects: {},
    // emit(name, data) {
    //     let fnName = createName(name)
    //     this.subjects[fnName] || (this.subjects[fnName] = new Subject())
    //     this.subjects[fnName].onNext(data)
    // },

    // listen(name, handler) {
    //     let fnName = createName(name)
    //     this.subjects[fnName] || (this.subjects[fnName] = new Subject())
    //     return this.subjects[fnName].subscribe(handler)
    // },

    // dispose() {
    //     let subjects = this.subjects
    //     for (let prop in subjects) {
    //         if ({}.hasOwnProperty.call(subjects, prop)) {
    //             subjects[prop].dispose()
    //         }
    //     }

    //     this.subjects = {}
    // }
}

export default Emitter