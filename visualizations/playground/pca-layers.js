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
exports.pcaLayers = void 0;
var d3 = require("d3");
var d3_jp = require("d3-jetpack");
var c0 = "#8ab0b5";
var c1 = "#f15555";
var pcaLayers = /** @class */ (function () {
    function pcaLayers(parent, scatterData, clickCallback, selIdx) {
        this.parent = parent;
        this.scatterData = scatterData;
        this.clickCallback = clickCallback;
        this.selIdx = selIdx;
        this.r = 5;
        this.currLayerIdx = 0;
        this.xScales = [];
        this.yScales = [];
        this.init();
    }
    // Initialize scatter plot, with PCA transformed embeddings 
    pcaLayers.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sel, leftSel, w, lastLayer;
            var _this = this;
            return __generator(this, function (_a) {
                sel = this.parent.html('');
                leftSel = sel.append('div.left');
                w = Math.min(d3.select('#model-outputs').node().getBoundingClientRect().width, 525);
                this.s = d3_jp.conventions({
                    sel: leftSel.append('div'),
                    width: w,
                    height: 525,
                    margin: { left: this.r, top: this.r, right: this.r, bottom: this.r }
                });
                // Add the legend
                this.addLegend();
                // Get the ranges for each layer.
                this.currLayerIdx = this.lastLayer();
                lastLayer = this.scatterData[this.currLayerIdx];
                this.scatterData.forEach(function (layerData) {
                    var xScale = d3.scaleLinear().domain(d3.extent(layerData.map(function (d) { return d.pos[0]; })));
                    var yScale = d3.scaleLinear().domain(d3.extent(layerData.map(function (d) { return d.pos[1]; })));
                    _this.xScales.push(xScale);
                    _this.yScales.push(yScale);
                });
                this.color = d3.scaleLinear()
                    .domain([0, 1])
                    .range([c0, c1]);
                // Make the actual node selections.
                this.sNodeSel = this.s.svg.appendMany('circle.node', lastLayer)
                    .translate(function (d) { return _this.scalePos(d.pos); })
                    .call(function (d) { return _this.styleNode(d); });
                this.nodeSel = sel.selectAll('.node');
                this.setLayer(this.currLayerIdx);
                return [2 /*return*/];
            });
        });
    };
    pcaLayers.prototype.addLegend = function () {
        // Add the prediction and label legend
        this.s.sel
            .append('div')
            .classed('model-pred-holder', true)
            .html("\n      <div class='simple-title flex'> \n        Model Prediction &nbsp \n        <div class='legend-circ'></div>\n      </div>\n      <div class='simple-title flex'>\n        Ground Truth &nbsp \n        <div class='legend-circ outline'></div>\n      </div>\n      <div class='simple-title'>Pungent</div>\n      <div class='legend-range-holder simple-title'>\n        <div class='legend-range-labels'> <div> 0% </div> <div>100%</div> </div>\n        <div class='legend-range' style='background:linear-gradient(".concat(c0, ", ").concat(c1, ")'></div>\n      </div>\n      "));
    };
    pcaLayers.prototype.scalePos = function (initPos) {
        var x = this.xScales[this.currLayerIdx](initPos[0]) * this.s.width;
        var y = this.yScales[this.currLayerIdx](initPos[1]) * this.s.width;
        return [x, y];
    };
    pcaLayers.prototype.lastLayer = function () {
        return this.scatterData.length - 1;
    };
    // Layer selection callback. Set initial layer to last.
    pcaLayers.prototype.setLayer = function (layerIndex, dur) {
        if (dur === void 0) { dur = 0; }
        this.currLayerIdx = layerIndex;
        this.updateNodes(dur);
        d3.select('#epoch-slider').node().value = layerIndex.toString();
        d3.select('#epoch').html(layerIndex);
    };
    // Update the node selection.
    pcaLayers.prototype.updateNodes = function (dur) {
        var _this = this;
        this.sNodeSel.data(this.scatterData[this.currLayerIdx]);
        this.sNodeSel
            .transition().ease(d3.easeCubicOut).duration(dur)
            .translate(function (d) { return _this.scalePos(d.pos); })
            .at({
            fill: function (d, i) { return _this.selIdx == i ? d3.color(_this.color(d.pred)).darker() : _this.color(d.pred); },
            stroke: function (d, i) { return _this.selIdx == i ? d3.color(_this.color(d.label)).darker() : _this.color(d.label); },
            opacity: function (d, i) { return _this.selIdx == i ? 1 : 0.75; },
            r: function (d, i) { return _this.selIdx == i ? _this.r * 2 : _this.r; }
        });
        this.sNodeSel.filter(function (d) { return d.label; }).raise();
        this.sNodeSel.filter(function (d, i) { return _this.selIdx == i; }).raise();
    };
    pcaLayers.prototype.styleNode = function (sel) {
        var _this = this;
        var that = this;
        sel
            .at({
            fill: function (d) { return _this.color(d.pred); },
            stroke: function (d) { return _this.color(d.label); },
            'stroke-width': 1.5,
            fillOpacity: .7
        })
            .on('click', function (d, i) {
            _this.selIdx = i;
            _this.clickCallback(_this.selIdx);
            _this.updateNodes(250);
        })
            .on('mouseover', function (d) { d3.select(this).at({ fillOpacity: 1 }); })
            .on('mouseout', function (d, i) {
            d3.select(this).at({ fillOpacity: that.selIdx == i ? 1 : 0.7 });
        });
    };
    // Update a datapoint's value in the vis.
    pcaLayers.prototype.updateDatapoint = function (pca, pred, dataIdx, epochChangeCallback) {
        if (this.currLayerIdx != this.lastLayer()) {
            epochChangeCallback();
        }
        this.setLayer(this.lastLayer());
        this.scatterData[this.currLayerIdx][dataIdx].pos = pca;
        this.scatterData[this.currLayerIdx][dataIdx].pred = pred;
        this.updateNodes(250);
    };
    return pcaLayers;
}());
exports.pcaLayers = pcaLayers;
