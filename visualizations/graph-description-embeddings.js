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
exports.GraphDescriptionEmbeddings = void 0;
var d3 = require("d3");
var utils_1 = require("../utils");
var GraphDescriptionEmbeddings = /** @class */ (function () {
    function GraphDescriptionEmbeddings() {
        this.parent = d3.select('#graph-description-embeddings');
        this.svg = this.parent.append('svg');
        this.textHolder = this.parent.append('div').classed('lines', true);
        this.numNodes = 5;
        this.selectedEdgeIdx = 1;
        this.selectedNodeIdx = 1;
        var _a = (0, utils_1.makeGraph)(this.numNodes, this.numNodes * 2), nodes = _a[0], links = _a[1];
        this.nodes = nodes;
        this.links = links;
        var numEdgeEmbed = 8;
        var numNodeEmbed = 6;
        this.nodes.forEach(function (d) {
            d.color = d3.color("hsl(51, 100%, ".concat(Math.random() * 50 + 25, "%)"));
            d.embedding = d3.range(numNodeEmbed).map(function (d) { return .05 + Math.random() * .95; }).map(function (d) { return { h: d }; });
        });
        this.links.forEach(function (d) {
            d.color = d3.color("hsl(207, 50%, ".concat(Math.random() * 50 + 30, "%)"));
            d.embedding = d3.range(numEdgeEmbed).map(function (d) { return .05 + Math.random() * .95; }).map(function (d) { return { h: d }; });
        });
        this.showGraph(nodes, links);
        this.makeText();
    }
    GraphDescriptionEmbeddings.prototype.showGraph = function (nodes, links) {
        var _this = this;
        var localOffset = 0.6;
        var localScale = 200;
        var pos = function (x) { return (x + localOffset) * localScale; };
        var graphHolder = this.svg.append('g');
        // Make global box
        var numGlobEmbed = 5;
        this.global = [{
                color: d3.color('rgb(250, 147, 147)'),
                embedding: d3.range(numGlobEmbed).map(function (d) { return .05 + Math.random() * .95; }).map(function (d) { return { h: d }; })
            }];
        graphHolder.selectAll('rect.global')
            .data(this.global)
            .enter()
            .append('rect.global')
            .attr('width', 250)
            .attr('height', 250)
            .attr('x', 0)
            .attr('y', -10)
            .attr('rx', 20)
            .attr('fill', 'none')
            .attr('stroke', function (d) { return d.color; })
            .style("stroke-width", 8)
            .attr('stroke-dasharray', "4, 4")
            .on('mouseover', function (d, i) { _this.makeText('g'); })
            .on('mouseout', function (d, i) { return _this.makeText(''); });
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
            .style("stroke", "rgba(0, 0, 0, 0)")
            .style("stroke-width", 20)
            .attr("x1", function (d) { return pos(d.a.x); })
            .attr("x2", function (d) { return pos(d.b.x); })
            .attr("y1", function (d) { return pos(d.a.y); })
            .attr("y2", function (d) { return pos(d.b.y); })
            .on('mouseover', function (d, i) { _this.selectedEdgeIdx = i; _this.makeText('l'); })
            .on('mouseout', function (d, i) { return _this.makeText(''); });
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
            .on('mouseover', function (d, i) { _this.selectedNodeIdx = i; _this.makeText('n'); })
            .on('mouseout', function (d, i) { return _this.makeText(''); });
    };
    GraphDescriptionEmbeddings.prototype.makeText = function (lastHovered) {
        var _this = this;
        this.textHolder.selectAll('*').remove();
        var makeLine = function (label, d, key) {
            var selected = lastHovered === key;
            var div = _this.textHolder.append('div')
                .classed('lines', true)
                .classed('selected', selected);
            var height = 20;
            var width = 20;
            div.append('div')
                .text(label);
            div
                .append('svg')
                .style('height', height)
                .selectAll('rect.emb')
                .data(d.embedding)
                .enter()
                .append('rect.emb')
                .attr('height', function (d) { return d.h * height; })
                .attr('width', width)
                .attr('x', function (d, i) { return i * width; })
                .attr('y', function (d, i) { return height - d.h * height; })
                .attr('fill', function (dchild) { return d.color.darker(0.5 - dchild.h * 1.1); })
                .attr('stroke', 'white');
        };
        makeLine('Vertex (or node) embedding', this.nodes[this.selectedNodeIdx], 'n');
        makeLine('Edge (or link) attributes and embedding', this.links[this.selectedEdgeIdx], 'l');
        makeLine('Global (or master node) embedding', this.global[0], 'g');
        this.parent.selectAll('circle')
            .style("stroke-width", function (d, i) { return _this.selectedNodeIdx == i ? 6 : 1; })
            .style("stroke", function (d, i) { return _this.selectedNodeIdx == i ? d.color : '#aaa'; });
        this.parent.selectAll('line.vis')
            .style("stroke-width", function (d, i) { return _this.selectedEdgeIdx == i ? 10 : 1; })
            .style("stroke", function (d, i) { return _this.selectedEdgeIdx == i ? d.color : '#bbb'; });
    };
    return GraphDescriptionEmbeddings;
}());
exports.GraphDescriptionEmbeddings = GraphDescriptionEmbeddings;
