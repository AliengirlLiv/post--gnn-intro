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
exports.LayerwiseTrace = void 0;
var d3 = require("d3");
var utils_1 = require("../utils");
var hexColor = ["#f2b200", "#c69700", "#ffeaa9", "#ffd255", "#d19f00", "#edc949", "#f2b200", "#c69700", "#ffeaa9", "#ffd255", "#d19f00", "#edc949", "#f2b200", "#c69700", "#ffeaa9", "#ffd255", "#d19f00", "#edc949"];
var color = hexColor.map(function (c) { return d3.color(c); });
var LayerwiseTrace = /** @class */ (function () {
    function LayerwiseTrace() {
        this.parent = d3.select('#layerwise-trace');
        this.numLayers = 4;
        this.numNodes = 5;
        this.highlightCancelled = false;
        this.zIdxCounter = 0;
        var _a = (0, utils_1.makeGraph)(this.numNodes, this.numNodes * 2), nodes = _a[0], links = _a[1];
        for (var layer = this.numLayers - 1; layer > -1; layer--) {
            this.showGraph(nodes, links, layer);
        }
        for (var layer = 0; layer < this.numLayers; layer++) {
            this.addLayerLines(links, layer);
        }
        this.showLines(false);
    }
    LayerwiseTrace.prototype.showGraph = function (nodes, links, layer) {
        var _this = this;
        var localOffset = .75;
        var localScale = 200;
        var pos = function (x) { return (x + localOffset) * localScale; };
        var layerGap = 170;
        var fullWidth = 700;
        var leftPad = fullWidth - layerGap * this.numLayers + 50;
        var layerDiv = this.parent;
        layerDiv
            .append('div')
            .classed('lines-holder-div', true)
            .style('z-index', this.zIdxCounter++)
            .append('svg')
            .attr('id', "layer_".concat(layer));
        layerDiv.append('text')
            .text('Layer ' + layer)
            .style('font-size', '16px')
            .style('font-weight', '600')
            .attr('x', leftPad - 200)
            .attr('y', 50);
        var graphDiv = layerDiv.append('div')
            .classed('graph-div', true)
            .style('left', layer * 200 + 'px')
            .style('z-index', this.zIdxCounter++);
        var holder = graphDiv.append('svg').classed('holderAll', true);
        var graphHolder = holder
            .append('g')
            .classed('holder', true);
        // Make the edges
        graphHolder.selectAll('line')
            .data(links)
            .enter()
            .append('line')
            .style("stroke", "#ccc")
            .style("stroke-width", 1)
            .attr("x1", function (d) { return pos(d.a.x); })
            .attr("x2", function (d) { return pos(d.b.x); })
            .attr("y1", function (d) { return pos(d.a.y); })
            .attr("y2", function (d) { return pos(d.b.y); });
        // Make nodes
        var darker = layer / 2;
        graphHolder.selectAll('circle')
            .data(nodes)
            .enter()
            .append('circle')
            .attr('r', 15)
            .attr('id', function (d) { return _this.id(layer, d.i); })
            .attr('cx', function (d) { return pos(d.x); })
            .attr('cy', function (d) { return pos(d.y); })
            .style('fill', function (d) { return color[d.i].darker(darker); })
            .style("stroke", function (d) { return color[d.i].darker(darker).darker(1); })
            .on('mouseenter', function (d) {
            _this.highlightCancelled = false;
            _this.selectHeirarchy(layer, d, true);
        })
            .on('mouseout', function (d) {
            _this.highlightCancelled = true;
            _this.deselectAll();
        })
            .on('click', function (d) {
            _this.highlightCancelled = false;
            _this.selectHeirarchy(layer, d, false);
        });
    };
    LayerwiseTrace.prototype.addLayerLines = function (links, layer) {
        var _this = this;
        if (layer < this.numLayers - 1) {
            d3.select("#layer_".concat(layer)).selectAll('line.link')
                .data(links)
                .enter()
                .append('line')
                .style("stroke", '#000')
                .style('stroke-opacity', 0)
                .style("stroke-width", 1)
                .attr('stroke-dasharray', "2, 2")
                .attr("class", function (d) { return _this.id(layer, d.a.i); })
                .classed('link', true);
        }
    };
    LayerwiseTrace.prototype.bbox = function (l, i) {
        return d3.select('#' + this.id(l, i)).node().getBoundingClientRect();
    };
    ;
    LayerwiseTrace.prototype.id = function (layer, i) {
        return "layer".concat(layer, "_id_").concat(i);
    };
    ;
    LayerwiseTrace.prototype.selectHeirarchy = function (layer, d, count) {
        return __awaiter(this, void 0, void 0, function () {
            var setSel;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.highlightCancelled) {
                            return [2 /*return*/, this.deselectAll()];
                        }
                        if (count > this.numLayers) {
                            return [2 /*return*/];
                        }
                        setSel = function (l, i) { return d3.select('#' + _this.id(l, i)).classed('selected', true); };
                        // Select yourself.
                        setSel(layer, d.i);
                        return [4 /*yield*/, (0, utils_1.sleep)(500)];
                    case 1:
                        _a.sent();
                        if (this.highlightCancelled) {
                            return [2 /*return*/, this.deselectAll()];
                        }
                        this.showLines(true, layer, d.i);
                        // Select all neighbors in the previous layer (and back and back.)
                        return [4 /*yield*/, (0, utils_1.sleep)(500)];
                    case 2:
                        // Select all neighbors in the previous layer (and back and back.)
                        _a.sent();
                        d.neighbors.forEach(function (n) {
                            _this.selectHeirarchy(layer + 1, n, count + 1);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    LayerwiseTrace.prototype.showLines = function (selected, layer, i) {
        var _this = this;
        var offset = this.parent.node().getBoundingClientRect();
        var leftOffset = offset.left - 15;
        var topOffset = offset.top - 15;
        if (selected && i !== undefined) {
            d3.selectAll('.' + this.id(layer, i))
                .classed('selected', true)
                .transition()
                .duration(1000)
                .attr("x1", function (d) { return _this.bbox(layer, d.a.i).left - leftOffset; })
                .attr("x2", function (d) { return _this.bbox(layer + 1, d.b.i).left - leftOffset; })
                .attr("y1", function (d) { return _this.bbox(layer, d.a.i).top - topOffset; })
                .attr("y2", function (d) { return _this.bbox(layer + 1, d.b.i).top - topOffset; });
        }
        else {
            var _loop_1 = function (layer_1) {
                d3.select("#layer_".concat(layer_1)).selectAll('line.link')
                    .attr("x1", function (d) { return _this.bbox(layer_1, d.a.i).left - leftOffset; })
                    .attr("x2", function (d) { return _this.bbox(layer_1, d.a.i).left - leftOffset; })
                    .attr("y1", function (d) { return _this.bbox(layer_1, d.a.i).top - topOffset; })
                    .attr("y2", function (d) { return _this.bbox(layer_1, d.a.i).top - topOffset; });
            };
            for (var layer_1 = 0; layer_1 < this.numLayers; layer_1++) {
                _loop_1(layer_1);
            }
        }
    };
    LayerwiseTrace.prototype.deselectAll = function () {
        this.parent.selectAll('.selected')
            .classed('selected', false);
        this.showLines(false);
    };
    return LayerwiseTrace;
}());
exports.LayerwiseTrace = LayerwiseTrace;
