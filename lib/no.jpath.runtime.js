//  ---------------------------------------------------------------------------------------------------------------  //

var empty = new JNodeset();

//  ---------------------------------------------------------------------------------------------------------------  //

/**
    @constructor
    @param {Object} data
*/
function JNode(data) {
    this.data = data;
};

//  ---------------------------------------------------------------------------------------------------------------  //

/**
    @return {boolean}
*/
JNode.prototype.isEmpty = function() {
    return false;
};

/**
    @param {string} name
    @param {JNodeset=} result
    @return {(JNode|JNodeset)}
*/
JNode.prototype.nametest = function(name, result) {
    var data = this.data;
    if (!data) {
        return empty;
    }

    var r = data[name];
    if (r === undefined) {
        return empty;
    }

    if ( Array.isArray(data) ) {
        result || (( result = new JNodeset() ));
        for (var i = 0; i < data.length; i++) {
            ( new JNode( data[i] ) ).nametest(name, result);
        }
        return result;
    }

    var node = new JNode(r);
    if (result) {
        return result.push(node);
    }

    return node;
};

/**
    @param {JNodeset=} result
    @return {JNodeset}
*/
JNode.prototype.startest = function(result) {
    result || (( result = new JNodeset() ));

    var data = this.data;
    if ( Array.isArray(data) ) {
        var root = this.root;
        for (var i = 0; i < data.length; i++) {
            result.push( new JNode( data[i], root ) );
        }
    } else {
        for (var key in data) {
            this.nametest(key, result)
        }
    }

    return result;
};

/**
    @param {function(JNode): boolean} filter
    @return {(JNode|JNodeset)}
*/
JNode.prototype.filter = function(filter) {
    return ( filter(this) ) ? this : empty;
};

/**
    @param {number} index
    @return {JNodeset}
*/
JNode.prototype.index = function(index) {
    var data = this.data;

    if ( Array.isArray(data) ) {
        var r = data[index];
        return (r !== undefined) ? ( new JNode(r) ).toNodeset() : empty;
    }

    return (index === 0) ? this : empty;
};

/**
    @return {Array}
*/
JNode.prototype.toArray = function() {
    return [ this.data ];
};

/**
    @return {JNodeset}
*/
JNode.prototype.toNodeset = function() {
    return ( new JNodeset() ).push(this);
};

JNode.prototype.scalar = function() {
    var data = this.data;
    return (typeof data === 'object') ? '' : data;
};

/**
    @return {boolean}
*/
JNode.prototype.boolean = function() {
    return !!this.data;
};

//  ---------------------------------------------------------------------------------------------------------------  //

/**
    @constructor
*/
function JNodeset() {
    this.nodes = [];
};

//  ---------------------------------------------------------------------------------------------------------------  //

/**
    @return {boolean}
*/
JNodeset.prototype.isEmpty = function() {
    return !this.nodes.length;
};

/**
    @param {JNode} node
    @return {JNodeset}
*/
JNodeset.prototype.push = function(node) {
    this.nodes.push(node);

    return this;
};

/**
    @param {string} name
    @param {JNodeset=} result
    @return {JNodeset}
*/
JNodeset.prototype.nametest = function(name, result) {
    var nodes = this.nodes;
    result || (( result = new JNodeset() ));
    for (var i = 0; i < nodes.length; i++) {
        nodes[i].nametest(name, result);
    }
    return result;
};

/**
    @param {JNodeset=} result
    @return {JNodeset}
*/
JNodeset.prototype.startest = function(result) {
    var nodes = this.nodes;
    result || (( result = new JNodeset() ));
    for (var i = 0; i < nodes.length; i++) {
        nodes[i].startest(result);
    }
    return result;
};

/**
    @param {function(JNode): boolean} filter
    @param {JNodeset=} result
    @return {JNodeset}
*/
JNodeset.prototype.filter = function(filter, result) {
    var nodes = this.nodes;
    result || (( result = new JNodeset() ));
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if ( filter(node) ) {
            result.push(node);
        }
    }
    return result;
};

/**
    @param {number} index
    @return {JNodeset}
*/
JNodeset.prototype.index = function(index) {
    var node = this.nodes[index];

    if (node !== undefined) {
        return ( new JNodeset() ).push(node);
    }

    return empty;
};

/**
    @return {Array}
*/
JNodeset.prototype.toArray = function() {
    var r = [];
    var nodes = this.nodes;
    for (var i = 0; i < nodes.length; i++) {
        r.push( nodes[i].data );
    }
    return r;
};

JNodeset.prototype.scalar = function() {
    var nodes = this.nodes;
    return (nodes.length) ? nodes[0].scalar() : '';
};

/**
    @return {boolean}
*/
JNodeset.prototype.boolean = function() {
    var nodes = this.nodes;
    return (nodes.length) ? nodes[0].boolean() : false;
};

//  ---------------------------------------------------------------------------------------------------------------  //
