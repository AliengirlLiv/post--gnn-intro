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
exports.XAsGraph = exports.XsAsGraphs = void 0;
var d3 = require("d3");
var steelblue = d3.color('steelblue');
var blue = steelblue.darker(-.5);
var blueDark = steelblue.darker(2);
var XsAsGraphs = /** @class */ (function () {
    function XsAsGraphs() {
        this.parent = d3.select('#mols-as-graph');
        this.names = ['caffeine', 'citronellal', 'othello', 'karate'];
        this.names.forEach(function (name) {
            var holder = d3.select('#mols-as-graph-' + name)
                .html('')
                .append('div.mol-holder');
            new XAsGraph(name, holder);
        });
    }
    return XsAsGraphs;
}());
exports.XsAsGraphs = XsAsGraphs;
var XAsGraph = /** @class */ (function () {
    function XAsGraph(name, parent) {
        this.name = name;
        this.parent = parent;
        this.init();
    }
    XAsGraph.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, d3.json("x-to-graph/".concat(this.name, ".json"))];
                    case 1:
                        _a.graph = _b.sent();
                        this.makeImg();
                        this.makeGraph();
                        this.makeAdjMat();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Load the image, including click handlers
     */
    XAsGraph.prototype.makeImg = function () {
        var imgHolder = this.parent
            .append('div')
            .classed('img-holder', true);
        var imgName = this.name + '.png';
        imgHolder
            .append('img')
            .attr('src', "x-to-graph/".concat(imgName));
    };
    XAsGraph.prototype.makeAdjMat = function () {
        var _this = this;
        var svg = this.parent.append('svg');
        var pairs = d3.cross(this.graph.nodes, this.graph.nodes);
        // Determine what pairs are actually edges.
        pairs.forEach(function (pair) {
            _this.graph.links.forEach(function (link, i) {
                if ((link.source.id === pair[0].id && link.target.id === pair[1].id) ||
                    (link.source.id === pair[1].id && link.target.id === pair[0].id)) {
                    pair.isEdge = true;
                    pair.edge = link;
                }
            });
        });
        var w = 300 / this.graph.nodes.length;
        this.adjMat = svg
            .selectAll('rect')
            .data(pairs)
            .enter()
            .append('rect')
            .attr('width', w - .1)
            .attr('height', w - .1)
            .translate(function (d) { return [d[0].index * w + .2, d[1].index * w + .2]; })
            .attr('fill', function (d) { return d.isEdge ? blue : '#fff'; })
            .attr('stroke', '#aaa')
            .attr('stroke-width', .1)
            .on('mouseenter', function (d) { return d.edge ? _this.mouseenterEdge(d.edge) : null; })
            .on('mouseleave', function (d) { return _this.mouseleave(); });
        svg.appendMany('g', this.graph.nodes)
            .translate(function (d) { return [d.index * w + w / 2, -10]; })
            .append('text').at({ transform: 'rotate(-90)', textAnchor: 'start' });
        svg.appendMany('text', this.graph.nodes)
            .translate(function (d) { return [-10, d.index * w + w / 2]; }).at({ textAnchor: 'end' });
        var t = function (d) {
            if (_this.name === 'karate') {
                if (d.id === 0) {
                    return 'Mr. Hi';
                }
                if (d.id === _this.graph.nodes.length - 1) {
                    return 'John H.';
                }
                else {
                    return "student ".concat(d.id);
                }
            }
            return d.club || d.id;
        };
        this.aTextSel = svg.selectAll('text')
            .text(function (d) { return t(d); })
            .at({ fontSize: 6, fill: '#999', dy: '.33em' })
            .on('mouseenter', function (d) { return _this.mouseenterNode(d); })
            .on('mouseleave', function (d) { return _this.mouseleave(); });
        if (this.name == 'othello')
            this.parent.st({ marginTop: 60 });
        // Move graph to the right
        this.parent.select('svg').raise();
    };
    XAsGraph.prototype.addLabel = function (sel, d) {
        d3.select(sel).append("text")
            .text(d.id)
            .attr('stroke', '#fff')
            .attr('stroke-width', '3')
            .attr('x', 5)
            .attr('y', 3);
        d3.select(sel).append("text")
            .text(d.id)
            .attr('x', 5)
            .attr('y', 3);
    };
    XAsGraph.prototype.removeLabel = function (sel) {
        d3.select(sel).selectAll("text").remove();
    };
    XAsGraph.prototype.makeGraph = function () {
        var _this = this;
        this.svg = this.parent.append('svg')
            .at({ fontSize: '12px' });
        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().distance(50).id(function (d) { return d.id.toString(); }).strength(.2))
            .force("charge", d3.forceManyBody().strength(this.name == 'othello' ? -500 : -40))
            .force("center", d3.forceCenter(150, 150));
        simulation
            .nodes(this.graph.nodes);
        simulation.force("link")
            .links(this.graph.links);
        //For performance reasons, don't render the first 300 iterations.
        for (var i = 0; i < 500; i++)
            simulation.tick();
        this.link = this.svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(this.graph.links)
            .enter().append("line")
            .attr("stroke-width", 1)
            .attr("stroke", blue)
            .attr("opacity", '.5')
            .on('mouseenter', function (d) { return _this.mouseenterEdge(d); })
            .on('mouseleave', function (d) { return _this.mouseleave(); });
        var that = this;
        this.node = this.svg.append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(this.graph.nodes)
            .enter().append("g")
            .call(d3.attachTooltip)
            .on('mouseenter', function (d) {
            that.addLabel(this, d);
        })
            .on('mouseleave', function (d) {
            that.removeLabel(this);
        });
        this.node.append("circle")
            .attr("r", 5)
            .attr("fill", '#fff')
            .attr('stroke', '#000')
            .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
            .on('mouseenter', function (d) { return _this.mouseenterNode(d); })
            .on('mouseleave', function (d) { return _this.mouseleave(); });
        simulation.on("tick", function () { return ticked(); });
        var ticked = function () {
            _this.link
                .attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });
            _this.node
                .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
        };
        function dragstarted(d) {
            if (!d3.event.active)
                simulation.alphaTarget(0.2).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }
        function dragended(d) {
            if (!d3.event.active)
                simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
    };
    XAsGraph.prototype.mouseenterEdge = function (datum) {
        // Update the colors of the graph.
        var isEdge = function (d) { return (datum.source == d || datum.target == d); };
        this.node.selectAll('circle')
            .attr('stroke', '#000')
            .attr('stroke-width', function (d) { return isEdge(d) ? 3 : 1; });
        this.link
            .attr('stroke', function (d) { return d == datum ? blueDark : blue; })
            .attr('stroke-width', function (d) { return d == datum ? 3 : 1; })
            .attr("opacity", function (d) { return d == datum ? 1 : .5; });
        this.aTextSel
            .at({ fill: function (d) { return d == datum ? '#000' : '#999'; } });
        // Update the colors of the adj mat.
        this.adjMat
            .attr('fill', function (d) { return !d.isEdge ? '#fff' : (d.edge == datum) ? blueDark : blue; });
    };
    XAsGraph.prototype.mouseenterNode = function (datum) {
        // Update the colors of the graph.
        var isEdge = function (d) { return (d.source == datum || d.target == datum); };
        this.node.selectAll('circle')
            .attr('stroke', '#000')
            .attr('stroke-width', function (d) { return d == datum ? 3 : 1; });
        this.link
            .attr('stroke', function (d) { return isEdge(d) ? blueDark : blue; })
            .attr('stroke-width', function (d) { return isEdge(d) ? 3 : 1; })
            .attr("opacity", function (d) { return isEdge(d) ? 1 : .5; });
        // Update the colors of the adj mat.
        this.adjMat
            .attr('fill', function (d) { return !d.isEdge ? '#fff' : (d[0] === datum || d[1] === datum) ? blueDark : blue; });
    };
    XAsGraph.prototype.mouseleave = function () {
        // Reset the colors of the graph.
        this.node.selectAll('circle')
            .attr('stroke', '#000')
            .attr('stroke-width', 1);
        this.link
            .attr('stroke', blue)
            .attr('stroke-width', 1)
            .attr("opacity", .5);
        this.node.selectAll('text').remove();
        // Reset the colors of the adj mat.
        this.adjMat
            .attr('fill', function (d) { return !d.isEdge ? '#fff' : blue; });
    };
    return XAsGraph;
}());
exports.XAsGraph = XAsGraph;
if (module.hot) {
    new XsAsGraphs();
    module.hot.accept();
}
