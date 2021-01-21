class Body {
    constructor({name}) {
        this.node = null;
        this.createNode(name);
    }
    createNode(name) {
        this.node = ElUtils.createBox([`${name}_main`,"main"]);
    }
}