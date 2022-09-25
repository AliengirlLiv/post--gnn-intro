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
exports.GraphDescription = void 0;
var d3 = require("d3");
var utils_1 = require("../utils");
var GraphDescription = /** @class */ (function () {
    function GraphDescription() {
        this.parent = d3.select('#graph-description');
        this.svg = this.parent.append('svg');
        this.numNodes = 5;
        var _a = (0, utils_1.makeGraph)(this.numNodes, this.numNodes * 2), nodes = _a[0], links = _a[1];
        this.showGraph(nodes, links);
        this.showText();
    }
    GraphDescription.prototype.showGraph = function (nodes, links) {
        var _this = this;
        var localOffset = 0.6;
        var localScale = 200;
        var pos = function (x) { return (x + localOffset) * localScale; };
        var graphHolder = this.svg.append('g');
        // Make global box
        graphHolder.append('rect')
            .attr('width', 250)
            .attr('height', 250)
            .attr('x', 0)
            .attr('y', -10)
            .attr('rx', 20)
            .attr('fill', '#fff')
            .attr('stroke', '#ddd')
            .style("stroke-width", 2)
            .attr('stroke-dasharray', "4, 4")
            .on('mouseover', function () { return _this.highlightGlobal(); })
            .on('mouseout', function () { return _this.unhighlightAll(); });
        // Make edges 
        graphHolder.selectAll('line.vis')
            .data(links)
            .enter()
            .append('line')
            .classed('vis', true)
            .style("stroke", "#bbb")
            .style("stroke-width", 1)
            .attr("x1", function (d) { return pos(d.a.x); })
            .attr("x2", function (d) { return pos(d.b.x); })
            .attr("y1", function (d) { return pos(d.a.y); })
            .attr("y2", function (d) { return pos(d.b.y); });
        graphHolder.selectAll('line.target')
            .data(links)
            .enter()
            .append('line')
            .classed('target', true)
            .style("stroke", "rgba(0, 0, 0, 0")
            .style("stroke-width", 20)
            .attr("x1", function (d) { return pos(d.a.x); })
            .attr("x2", function (d) { return pos(d.b.x); })
            .attr("y1", function (d) { return pos(d.a.y); })
            .attr("y2", function (d) { return pos(d.b.y); })
            .on('mouseover', function () { return _this.highlightEdges(); })
            .on('mouseout', function () { return _this.unhighlightAll(); });
        // Make nodes
        graphHolder.selectAll('circle')
            .data(nodes)
            .enter()
            .append('circle')
            .attr('r', 10)
            .attr('cx', function (d) { return pos(d.x); })
            .attr('cy', function (d) { return pos(d.y); })
            .style('fill', '#fff')
            .style("stroke-width", '1px')
            .style("stroke", '#bbb')
            .on('mouseover', function () { return _this.highlightNodes(); })
            .on('mouseout', function () { return _this.unhighlightAll(); });
    };
    GraphDescription.prototype.showText = function () {
        var _this = this;
        var textHolder = this.parent.append('div').classed('line-holder', true);
        var makeLine = function (letter, desc, eg, mouseover) {
            var div = textHolder.append('div')
                .classed('line-holder', true)
                .attr('id', letter);
            div.append('div').text(letter).classed('letter', true);
            div.append('div').text(desc).classed('desc', true);
            div.append('div').text(eg).classed('eg', true);
            div.on('mouseover', mouseover);
            div.on('mouseout', function () { return _this.unhighlightAll(); });
        };
        makeLine('V', 'Vertex (or node) attributes', 'e.g., node identity, number of neighbors', function () { return _this.highlightNodes(); });
        makeLine('E', 'Edge (or link) attributes and directions', 'e.g., edge identity, edge weight', function () { return _this.highlightEdges(); });
        makeLine('U', 'Global (or master node) attributes', 'e.g., number of nodes, longest path', function () { return _this.highlightGlobal(); });
    };
    GraphDescription.prototype.highlightEdges = function () {
        this.parent.select('#E').classed('selected', true);
        this.parent.selectAll('line.vis')
            .style("stroke", "#000")
            .style("stroke-width", 10);
    };
    GraphDescription.prototype.highlightNodes = function () {
        this.parent.select('#V').classed('selected', true);
        this.parent.selectAll('circle')
            .style("stroke-width", 6)
            .style("stroke", '#000')
            .attr("r", 11);
    };
    GraphDescription.prototype.highlightGlobal = function () {
        this.parent.select('#U').classed('selected', true);
        this.parent.selectAll('rect')
            .style("stroke", '#000')
            .style("stroke-width", 8);
    };
    GraphDescription.prototype.unhighlightAll = function () {
        this.parent.selectAll('*').classed('selected', false);
        this.parent.selectAll('line.vis')
            .style("stroke", "#bbb")
            .style("stroke-width", '1px');
        this.parent.selectAll('circle')
            .style("stroke-width", '1px')
            .style("stroke", '#aaa')
            .attr("r", 10);
        this.parent.selectAll('rect')
            .style("stroke-width", 2)
            .style("stroke", '#ddd');
    };
    return GraphDescription;
}());
exports.GraphDescription = GraphDescription;
