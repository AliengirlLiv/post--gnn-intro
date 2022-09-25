"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Graph = exports.Mode = void 0;
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
var util_1 = require("./util");
var d3 = require("d3");
var Mode;
(function (Mode) {
    Mode[Mode["Add"] = 0] = "Add";
    Mode[Mode["Remove"] = 1] = "Remove";
})(Mode = exports.Mode || (exports.Mode = {}));
var Graph = /** @class */ (function () {
    function Graph(data, config, molEditedCallback) {
        this.data = data;
        this.config = config;
        this.molEditedCallback = molEditedCallback;
        this.mode = Mode.Add;
        this.origData = (0, util_1.copy)(this.data);
        var idsToName = ['Carbon', 'Nitrogen', 'Oxygen', 'Sulphur'];
        this.nodeColors = ["#60c4a0", "#355ca1", "#e34242", "#e3d642"];
        this.init();
    }
    Graph.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var svg, bb;
            var _this = this;
            return __generator(this, function (_a) {
                svg = d3.select("#playground svg");
                // Creat holders for nodes and edges (to deal with layers) 
                this.edgesHolder = svg.append('g');
                this.nodesHolder = svg.append('g');
                bb = svg.node().getBoundingClientRect();
                this.simulation = d3.forceSimulation()
                    .force("link", d3.forceLink().id(function (d) { return d.id; }).distance(50).strength(1))
                    .force("charge", d3.forceManyBody().strength(-10))
                    .force('center', d3.forceCenter(bb.width / 2, bb.height / 2))
                    .on("tick", function () { return _this.render(); });
                this.restart();
                this.render();
                return [2 /*return*/];
            });
        });
    };
    Graph.prototype.restart = function () {
        this.simulation.stop();
        this.updateSelectionsToMatchData();
        // Start the simulation.
        this.simulation.nodes(this.data.nodes);
        this.simulation.force("link").links(this.data.edges);
        this.simulation.alpha(1).restart();
    };
    Graph.prototype.updateSelectionsToMatchData = function () {
        var _this = this;
        if (this.edges && this.nodes) {
            this.edges.remove();
            this.nodes.remove();
        }
        var that = this;
        // Create or add edges based on this.data.edges.
        this.edges = this.edgesHolder.selectAll('g.edges')
            .data(this.data.edges)
            .enter()
            .append("g")
            .classed("edges", true)
            .classed("hidden", function (d) { return d.source.id > d.target.id; })
            .on("mouseenter", function (d) { that.mouseoverEdge(this, d); })
            .on("mouseleave", function (d) { that.mouseoutEdge(this, d); })
            .on("click", function (d) { return _this.clickEdge(d); });
        this.edges.append('line').classed('clickTarget', true);
        this.edges.append('line').classed('dashed', true);
        this.edges.append('line').classed('outline', true);
        this.edges.append('line').classed('white', true);
        this.edges.append('line').classed('middle', true);
        // Create or add nodes based on this.data.edges.
        this.nodes = this.nodesHolder.selectAll('g.nodes')
            .data(this.data.nodes)
            .enter()
            .append('g')
            .attr("class", "nodes")
            .call(d3.drag()
            .on("start", function (d) { return _this.dragstartedNode(d); })
            .on("drag", function (d) { return _this.draggedNode(d); })
            .on("end", function (d) { return _this.dragendedNode(d); }))
            .on("mouseover", function (d) { that.mouseoverNode(this, d); })
            .on("mouseleave", function (d) { that.mouseoutNode(this, d); })
            .on("click", function () { return d3.event.stopPropagation(); });
        this.nodes
            .append("circle")
            .attr("fill", function (d) { return _this.nodeColors[_this.oneHotIdx(d)]; });
        this.render();
    };
    // Set the current interaction mode.
    Graph.prototype.setMode = function (mode) {
        this.mode = mode;
    };
    // What happens at every simulation tick. Note that the x and y 
    //updates of this.data.nodes are being updated behind the scenes.
    Graph.prototype.render = function () {
        var _this = this;
        var tripleW = 10;
        var dblW = 6;
        var lineW = 2;
        var selectLines = function (classStr) {
            return _this.edges
                .selectAll("line.".concat(classStr))
                .attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; })
                .attr('stroke', function (d) { return d.highlighted ? '#000' : '#999'; });
        };
        selectLines('clickTarget')
            .attr("stroke", 'rgba(0, 0, 0, 0)')
            .attr("stroke-width", 15);
        selectLines('dashed')
            .attr("stroke-width", function (d) { return [0, 0, 0, lineW * 4][_this.oneHotIdx(d)]; })
            .attr('stroke-dasharray', "2, 2");
        selectLines('outline')
            .attr("stroke-width", function (d) { return [0, dblW, tripleW, 0][_this.oneHotIdx(d)]; });
        selectLines('white')
            .attr('stroke', 'white')
            .attr("stroke-width", function (d) { return [0, dblW - lineW * 2, tripleW - lineW * 2, 0][_this.oneHotIdx(d)]; });
        selectLines('middle')
            .attr("stroke-width", function (d) {
            return [lineW, 0, lineW, 0][_this.oneHotIdx(d)];
        })
            .attr('stroke-dasharray', function (d) { return d.dotted ? "2, 2" : undefined; });
        this.nodes
            .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
            .select('circle')
            .attr("r", 7)
            .attr("opacity", function (d) { return d.hidden ? 0 : (d.adding ? .5 : 1); })
            .attr('stroke-dasharray', function (d) { return d.adding ? "2, 2" : undefined; })
            .attr("stroke", '#000')
            .attr("stroke-width", function (d) { return d.outline ? '2' : '1'; })
            .attr("pointer-events", function (d) { return d.pointer_events; });
    };
    /** Util method to get the last node. */
    Graph.prototype.lastNode = function () {
        return this.data.nodes[this.data.nodes.length - 1];
    };
    /** Util method to get the last edge. */
    Graph.prototype.lastEdge = function () {
        return this.data.edges[this.data.edges.length - 1];
    };
    Graph.prototype.secondToLastEdge = function () {
        return this.data.edges[this.data.edges.length - 2];
    };
    ////////////////////////////////////////////////////////////////////
    // Manipulation handlers
    ////////////////////////////////////////////////////////////////////
    Graph.prototype.dragstartedNode = function (d) {
        this.simulation.stop();
        // If we are in add mode, create a new node and edge, and start dragging it.
        if (this.mode === Mode.Add) {
            d.outline = true;
            var lastId = this.data.nodes.length;
            var newNode = {
                id: lastId,
                x: d3.event.x,
                y: d3.event.y,
                initX: d3.event.x,
                initY: d3.event.y,
                pointer_events: 'none',
                outline: true,
                adding: true,
                hidden: true,
                properties: (0, util_1.copy)(this.config.nodeDefaultProps)
            };
            this.data.nodes.push(newNode);
            this.data.edges.push({
                source: newNode,
                target: d,
                properties: (0, util_1.copy)(this.config.edgeDefaultProps),
                dotted: true
            });
            this.data.edges.push({
                source: d,
                target: newNode,
                properties: (0, util_1.copy)(this.config.edgeDefaultProps),
                dotted: true
            });
            this.updateSelectionsToMatchData();
            this.simulation.stop();
        }
    };
    Graph.prototype.draggedNode = function (d) {
        // If we're adding, move the new node around.
        if (this.mode === Mode.Add) {
            var addedNode = this.lastNode();
            addedNode.x = d3.event.x;
            addedNode.y = d3.event.y;
            this.updateSelectionsToMatchData();
        }
    };
    Graph.prototype.dragendedNode = function (d) {
        // If we are adding a node, check if we should keep the new node or just the new edge.
        if (this.mode === Mode.Add) {
            // If this is really just a click, change the value of the node.
            var wasClick = Math.abs(d.x - d3.event.x) < 20 && Math.abs(d.y - d3.event.y) < 20;
            if (wasClick) {
                this.progressOneHotIdx(d);
                this.data.nodes.pop();
                this.data.edges.pop();
                this.data.edges.pop();
                this.updateSelectionsToMatchData();
            }
            else {
                // If we ended up hovering over a different node, connect to that one instead.
                if (this.hoverNode && (this.hoverNode !== d)) {
                    this.lastEdge().target = this.hoverNode;
                    this.secondToLastEdge().source = this.lastEdge().target;
                    this.secondToLastEdge().target = this.lastEdge().source;
                    this.data.nodes.pop();
                }
                else {
                    this.lastNode().initX = d3.event.x;
                    this.lastNode().initY = d3.event.y;
                }
                d.outline = undefined;
                this.lastNode().adding = false;
                this.lastEdge().dotted = false;
                this.secondToLastEdge().dotted = false;
                // Remove the pointer events hack.
                this.lastNode().pointer_events = null;
                this.restart();
            }
        }
        // Remove the 'close' before running the model.
        this.molEditedCallback(this.data);
    };
    Graph.prototype.mouseoverNode = function (sel, d) {
        d.outline = true;
        this.hoverNode = d;
        if (this.lastNode().adding) {
            this.lastNode().hidden = true;
        }
        if (!d.hasClose) {
            this.addX(sel, d);
        }
        this.render();
    };
    Graph.prototype.mouseoutNode = function (sel, d) {
        this.removeX(sel, d);
        d.outline = undefined;
        this.lastNode().hidden = false;
        this.render();
        this.hoverNode = undefined;
    };
    Graph.prototype.clickEdge = function (d) {
        d3.event.stopPropagation();
        this.progressOneHotIdx(d);
    };
    Graph.prototype.mouseoverEdge = function (sel, d) {
        this.addX(sel, d, true);
        d.highlighted = true;
        this.render();
    };
    Graph.prototype.mouseoutEdge = function (sel, d) {
        this.removeX(sel, d);
        d.highlighted = undefined;
        this.render();
    };
    Graph.prototype.addX = function (sel, d, edge) {
        var _this = this;
        if (edge === void 0) { edge = false; }
        d.hasClose = true;
        var removeNode = function () {
            _this.simulation.stop();
            _this.data.edges = _this.data.edges.filter(function (e) { return (e.source != d) && (e.target != d); });
            _this.data.nodes.splice(_this.data.nodes.indexOf(d), 1);
            _this.updateSelectionsToMatchData();
            _this.restart();
            _this.molEditedCallback(_this.data);
        };
        var removeEdge = function () {
            _this.simulation.stop();
            _this.data.edges.splice(_this.data.edges.indexOf(d), 1);
            var reverseEdge = _this.reverseEdge(d);
            _this.data.edges.splice(_this.data.edges.indexOf(reverseEdge), 1);
            _this.updateSelectionsToMatchData();
            _this.restart();
            _this.molEditedCallback(_this.data);
        };
        var close = d3.select(sel)
            .append('g')
            .style('cursor', 'default');
        var x = edge ? (d.source.x + d.target.x) / 2 + Math.abs(d.source.y - d.target.y) / 4 : 7;
        var y = edge ? (d.source.y + d.target.y) / 2 + Math.abs(d.source.x - d.target.x) / 4 : -7;
        // Make the hover target easier.
        close.append('rect')
            .attr('width', 30)
            .attr('height', 30)
            .attr('x', -15)
            .attr('y', -15)
            .attr('fill', 'rgba(0, 0, 0, 0)')
            .attr('transform', edge ? "translate(" + x + "," + y + ")" : null);
        close.append('text')
            .text('x')
            .attr('transform', "translate(" + x + "," + y + ")")
            .attr('fill', '#aaa')
            .on('mousedown', function () { return d3.event.stopPropagation(); })
            .on('mouseup', function () {
            d3.event.stopPropagation();
            edge ? removeEdge() : removeNode();
        });
    };
    // Remove the 'x' to close;
    Graph.prototype.removeX = function (sel, d) {
        if (d.hasClose) {
            d3.select(sel).select('g').remove();
            d.hasClose = undefined;
        }
    };
    Graph.prototype.updateData = function (data) {
        this.simulation.stop();
        this.data = data;
        this.origData = (0, util_1.copy)(this.data);
        this.restart();
    };
    Graph.prototype.oneHotIdx = function (elt) {
        var keys = Object.keys(elt.properties);
        var idx = keys.indexOf(keys.find(function (k) { return elt.properties[k] == 1; }));
        return idx;
    };
    Graph.prototype.progressOneHotIdx = function (elt) {
        var progress = function (elt) {
            var props = elt.properties;
            var keys = Object.keys(props);
            var idx = keys.indexOf(keys.find(function (k) { return props[k] == 1; }));
            var nextIdx = (idx + 1) % keys.length;
            keys.forEach(function (key) { return props[key] = 0; });
            props[keys[nextIdx]] = 1;
        };
        progress(elt);
        // The graph contains two way edges; progress both.
        if (elt.source) {
            progress(this.reverseEdge(elt));
        }
        this.updateSelectionsToMatchData();
    };
    Graph.prototype.reverseEdge = function (elt) {
        return this.data.edges.find(function (e) { return ((e.source == elt.target) && (e.target == elt.source)); });
    };
    Graph.prototype.resetData = function () {
        this.updateData(this.origData);
    };
    return Graph;
}());
exports.Graph = Graph;
