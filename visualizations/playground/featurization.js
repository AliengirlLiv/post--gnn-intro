"use strict";
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
exports.__esModule = true;
exports.tensorsToGraph = exports.graphToTensors = exports.makeTestConfig = void 0;
function makeTestConfig() {
    var config = {
        nodeDefaultProps: { 'prop_0': 1, 'prop_2': 0, 'prop_3': 0, 'prop_4': 0 },
        edgeDefaultProps: { 'prop_0': 1, 'prop_2': 0, 'prop_3': 0, 'prop_4': 0 }
    };
    return config;
}
exports.makeTestConfig = makeTestConfig;
function wrapVal(name, dtype, value) {
    return {
        name: name,
        dtype: dtype,
        value: value
    };
}
function graphToTensors(graph) {
    var gNodes = graph.nodes;
    var gEdges = graph.edges;
    var tNodesValue = gNodes.map(function (node) { return Object.values(node.properties); });
    var tNodes = wrapVal('nodes', 'float32', tNodesValue);
    var tEdgesValue = gEdges.map(function (edge) { return Object.values(edge.properties); });
    var tEdges = wrapVal('edges', 'float32', tEdgesValue);
    var tReceiversValue = gEdges.map(function (edge) { return edge.target.index; });
    var tReceivers = wrapVal('receivers', 'int32', tReceiversValue);
    var tSendersValue = gEdges.map(function (edge) { return edge.source.index; });
    var tSenders = wrapVal('senders', 'int32', tSendersValue);
    var tGlobalsValue = [[0]]; //Input globals are 0, for now.
    var tGlobals = wrapVal('globals', 'float32', tGlobalsValue);
    var tNumNodesValue = [gNodes.length];
    var tNumNodes = wrapVal('n_node', 'int32', tNumNodesValue);
    var tNumEdgesValue = [gEdges.length];
    var tNumEdges = wrapVal('n_edge', 'int32', tNumEdgesValue);
    return [tNodes, tEdges, tReceivers, tSenders, tGlobals, tNumNodes, tNumEdges];
}
exports.graphToTensors = graphToTensors;
function tensorsToGraph(tensors) {
    var tNodes = tensors[0], tEdges = tensors[1], tReceivers = tensors[2], tSenders = tensors[3], tGlobals = tensors[4], tNumNodes = tensors[5], tNumEdges = tensors[6];
    var graph = {
        'nodes': [],
        'edges': []
    };
    // Add node properties.
    tNodes.value.forEach(function (node) {
        var properties = {};
        node.forEach(function (j, prop) { properties["prop_".concat(prop)] = j; });
        graph.nodes.push({ properties: properties });
    });
    var _loop_1 = function (i) {
        var source = tSenders.value[i];
        var target = tReceivers.value[i];
        var properties = {};
        tEdges.value[i].forEach(function (j, prop) { properties["prop_".concat(prop)] = j; });
        graph.edges.push({
            properties: properties,
            source: source,
            target: target
        });
    };
    // Add edge properties and values.
    for (var i = 0; i < tNumEdges.value; i++) {
        _loop_1(i);
    }
    return graph;
}
exports.tensorsToGraph = tensorsToGraph;
