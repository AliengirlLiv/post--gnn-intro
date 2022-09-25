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
exports.Playground = void 0;
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
var d3 = require("d3");
var graph_1 = require("./graph");
var util_1 = require("./util");
var featurization = require("./featurization");
var tfjs_model_1 = require("./tfjs-model");
var pca_layers_1 = require("./pca-layers");
var PRED_LABEL = 'pungent';
var Playground = /** @class */ (function () {
    function Playground() {
        this.model = new tfjs_model_1.Model();
        this.currGraphIdx = 0;
        this.init();
    }
    Playground.prototype.data = function () {
        var root = 'https://storage.googleapis.com/gnn-distill/';
        return {
            x_test: root + 'x_test.json',
            y_test: root + 'y_test.json',
            labelid_to_name: root + 'labelid_to_name.json',
            nodeid_to_name: root + 'nodeid_to_name.json',
            edgeid_to_name: root + 'edgeid_to_name.json',
            hparam_map: root + 'hparam_map.csv',
            testConfig: featurization.makeTestConfig(),
            description: 'For this <b>graph level prediction task</b>, each graph is a molecule. The task is to predict whether or not a molecule will smell pungent. In the scatter plot, each point represents a graph.'
        };
    };
    Playground.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        d3.select('#playground').html("\n    <div id='container'>\n      <div id='model-opts'>\n\n        <div class='opts-col' id='opts-col-desc'>\n          <div class='model-info-title'> Task </div>\n          <div>\n            <div class='model-param' id='description'></div>\n          </div>\n        </div>\n\n        <div class='opts-col'>\n          <div class='model-info-title'> Model Options </div>\n\n          <div class='model-params'>\n            <div class='model-param'>Depth\n              <select id='depth-select' class='param'>\n                <option value=\"1\">1 layer</option>\n                <option value=\"2\">2 layers</option>\n                <option value=\"3\" selected>3 layers</option>\n                <option value=\"4\">4 layers</option>\n              </select>\n            </div>\n\n            <div class='model-param'> Aggregation function\n              <select id='aggregation-select' class='param'>\n                <option value=\"mean\">Mean</option>\n                <option value=\"sum\" selected>Sum</option>\n                <option value=\"max\">Max</option>\n              </select>\n            </div>\n\n            <div class='model-param'> \n              <div>\n                <input type=\"checkbox\" id=\"node-emb-checkbox\" class='param' checked>\n                <label for=\"node-emb-checkbox\">Node embedding size</label>\n              </div>\n              <select id='node-emb-select' class='param'>\n                <option value=\"12\">25</option>\n                <option value=\"25\" selected>50</option>\n                <option value=\"50\">100</option>\n              </select>\n            </div>\n\n            <div class='model-param'> \n              <div>\n                <input type=\"checkbox\" id=\"edge-emb-checkbox\" class='param' checked>\n                <label for=\"edge-emb-checkbox\">Edge embedding size</label>\n              </div>\n              <select id='edge-emb-select' class='param'>\n                <option value=\"5\">5</option>\n                <option value=\"10\" selected>10</option>\n                <option value=\"20\">20</option>\n              </select>\n            </div>\n\n            <div class='model-param'> \n              <div>\n                <input type=\"checkbox\" id=\"global-emb-checkbox\" checked class='param'>\n                <label for=\"global-emb-checkbox\">Global embedding size</label>\n              </div>\n              <select id='global-emb-select' class='param'>\n                <option value=\"25\">25</option>\n                <option value=\"50\" selected>50</option>\n                <option value=\"100\">100</option>\n              </select>\n            </div>\n          </div>\n        </div>\n        \n        <div class='opts-col'>\n          <div class='model-info-title'> Model AUC </div>\n          <div id='acc'> </div>\n        </div>\n      </div>\n\n      <div id='svgs'>\n        <div id='loader'></div>\n        <div id='svg-holder' class='hidden'>\n          <svg width=\"100%\" height=\"500\"></svg>\n          <div id='warning' class='hidden'></div>\n          <div id='button-holder'>\n            <div class='button disabled' id='reset'>Reset</div>\n          </div>\n\n          <div class='model-pred-holder'>\n            <div class='simple-title'>Model Prediction</div>\n            <div class='output' id='model-pred'></div>\n            <div class='simple-title'>Ground Truth</div>\n            <div class='output' id='ground-truth'></div>\n          </div>\n        </div>\n\n        <div id='model-outputs'>\n          <div id='scatter-holder'></div>\n          <div id='epoch-slider-holder'> \n            <div>epoch: <span id='epoch'></span></div>\n            <input type=\"range\" min=\"0\" max=\"101\" value=\"10\" step='1' id=\"epoch-slider\"> \n          </div>\n        </div>\n        </div>\n      </div>");
                        this.initModelButtonClickhandlers();
                        this.initEpochsSliderHandlers();
                        this.initCheckboxHandlers();
                        return [4 /*yield*/, this.loadData()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.createGraph()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.findMatchingParam()];
                    case 3:
                        _a.sent();
                        this.addLegend();
                        this.molEditedCallback(this.graph.data, true);
                        this.toggleLoading(false);
                        return [2 /*return*/];
                }
            });
        });
    };
    Playground.prototype.modelUpdated = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.toggleLoading(true, true);
                        return [4 /*yield*/, this.model.initModel(id)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.createScatter()];
                    case 2:
                        _a.sent();
                        this.molEditedCallback(this.graph.data, true);
                        this.toggleLoading(false);
                        return [2 /*return*/];
                }
            });
        });
    };
    Playground.prototype.loadData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, d3.json(this.data().x_test)];
                    case 1:
                        _a.tensors = _e.sent();
                        _b = this;
                        return [4 /*yield*/, d3.json(this.data().y_test)];
                    case 2:
                        _b.y = (_e.sent())[0].value;
                        _c = this;
                        return [4 /*yield*/, d3.json(this.data().labelid_to_name)];
                    case 3:
                        _c.allPredLabels = _e.sent();
                        this.predLabelIdx = (0, util_1.getKeyByValue)(this.allPredLabels, PRED_LABEL);
                        _d = this;
                        return [4 /*yield*/, d3.csv(this.data().hparam_map)];
                    case 4:
                        _d.hparamMap = (_e.sent());
                        return [2 /*return*/];
                }
            });
        });
    };
    Playground.prototype.createGraph = function () {
        return __awaiter(this, void 0, void 0, function () {
            var newGraph;
            var _this = this;
            return __generator(this, function (_a) {
                newGraph = featurization.tensorsToGraph(this.tensors[this.currGraphIdx]);
                (0, util_1.setDataInitPos)([newGraph]);
                this.graph = new graph_1.Graph((0, util_1.copy)(newGraph), this.data().testConfig, function (data) { return _this.molEditedCallback(data); });
                return [2 /*return*/];
            });
        });
    };
    Playground.prototype.molEditedCallback = function (data, showGroundTruth) {
        if (showGroundTruth === void 0) { showGroundTruth = false; }
        return __awaiter(this, void 0, void 0, function () {
            var tensors, predAndPCA, pred, pca, epochChangeCallback;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.resetButton.classed('disabled', showGroundTruth);
                        tensors = featurization.graphToTensors(data);
                        return [4 /*yield*/, this.model.runModel(tensors)];
                    case 1:
                        predAndPCA = _a.sent();
                        if (predAndPCA[0][0].length === 2) {
                            pca = predAndPCA[0], pred = predAndPCA[1];
                        }
                        else {
                            pred = predAndPCA[0], pca = predAndPCA[1];
                        }
                        epochChangeCallback = function () { return _this.setWarningMsg(true); };
                        this.scatter.updateDatapoint(pca[0], pred[0], this.currGraphIdx, epochChangeCallback);
                        this.setPred(pred[0][0]);
                        this.setGT(showGroundTruth);
                        return [2 /*return*/];
                }
            });
        });
    };
    Playground.prototype.setGT = function (showGroundTruth) {
        var rawGroundTruth = this.y[this.currGraphIdx][this.predLabelIdx];
        var groundTruth = showGroundTruth ? (rawGroundTruth ? PRED_LABEL : "not ".concat(PRED_LABEL)) : 'unknown';
        var color = showGroundTruth ? this.scatter.color(rawGroundTruth) : '#777';
        d3.select('#ground-truth')
            .html(groundTruth)
            .style('color', color);
    };
    // Update the visualization to use a different graph.
    Playground.prototype.updateGraph = function (i) {
        this.currGraphIdx = i;
        var newGraph = featurization.tensorsToGraph(this.tensors[this.currGraphIdx]);
        (0, util_1.setDataInitPos)([newGraph]);
        this.graph.updateData(newGraph);
        var epoch = d3.select('#epoch-slider').node().value;
        this.setPred(this.model.preds[this.currGraphIdx][0][epoch]);
        this.setGT(true);
    };
    // Create the scatterplot.
    Playground.prototype.createScatter = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pca, num_datapoints, scatterData, epoch_idx, epochData, datapoint_idx, xPos, yPos, datapoint, clickCallback;
            var _this = this;
            return __generator(this, function (_a) {
                pca = this.model.pca;
                num_datapoints = pca.length;
                scatterData = [];
                for (epoch_idx = 0; epoch_idx < pca[0][0].length; epoch_idx++) {
                    epochData = [];
                    for (datapoint_idx = 0; datapoint_idx < num_datapoints; datapoint_idx++) {
                        xPos = pca[datapoint_idx][0][epoch_idx];
                        yPos = pca[datapoint_idx][1][epoch_idx];
                        datapoint = {
                            pos: [xPos, yPos],
                            pred: this.model.preds[datapoint_idx][0][epoch_idx],
                            label: this.y[datapoint_idx][this.predLabelIdx]
                        };
                        epochData.push(datapoint);
                    }
                    scatterData.push(epochData);
                }
                this.updateUIWithModelInfo(scatterData);
                this.setAcc(scatterData.length - 1);
                clickCallback = function (i) { return _this.updateGraph(i); };
                this.scatter = new pca_layers_1.pcaLayers(d3.select('#scatter-holder'), scatterData, clickCallback, this.currGraphIdx);
                return [2 /*return*/];
            });
        });
    };
    Playground.prototype.setAcc = function (epoch) {
        d3.select('#acc').html((1 * this.model.stats[epoch].test_auc).toFixed(2));
    };
    Playground.prototype.pct = function (val, decimalPlaces) {
        if (decimalPlaces === void 0) { decimalPlaces = 1; }
        return (val * 100).toFixed(decimalPlaces) + '%';
    };
    Playground.prototype.initModelButtonClickhandlers = function () {
        var _this = this;
        this.resetButton = d3.select('#reset');
        this.resetButton.on('click', function () { return _this.reset(); });
        // Add buttons and handlers.
        d3.select('#add').on('click', function () { return _this.graph.setMode(graph_1.Mode.Add); });
        d3.select('#remove').on('click', function () { return _this.graph.setMode(graph_1.Mode.Remove); });
    };
    Playground.prototype.initEpochsSliderHandlers = function () {
        var _this = this;
        var slider = d3.select('#epoch-slider');
        var epochDiv = d3.select('#epoch');
        slider.on('input', function () {
            console.log('INPUT');
            var epoch = slider.node().value;
            _this.scatter.setLayer(epoch, 250);
            _this.setAcc(epoch);
            epochDiv.html(epoch);
            _this.setPred(_this.model.preds[_this.currGraphIdx][0][epoch]);
            // If the molecule has been edited, show warning and revert it.
            if (!_this.resetButton.classed('disabled')) {
                _this.setWarningMsg(false);
                _this.reset();
            }
        });
    };
    Playground.prototype.setPred = function (rawPred) {
        var pred = this.pct(rawPred, 0);
        d3.select('#model-pred').html("".concat(pred, " ").concat(PRED_LABEL)).style('color', this.scatter.color(rawPred));
    };
    Playground.prototype.initCheckboxHandlers = function () {
        var _this = this;
        d3.selectAll('.param').on('change', function () { return _this.findMatchingParam(); });
    };
    Playground.prototype.findMatchingParam = function () {
        return __awaiter(this, void 0, void 0, function () {
            var nodeCheckVal, edgeCheckVal, globalCheckVal, nodeSelVal, edgeSelVal, globalSelValue, depthVal, aggVal, v, modelId;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nodeCheckVal = d3.select('#node-emb-checkbox').node().checked;
                        edgeCheckVal = d3.select('#edge-emb-checkbox').node().checked;
                        globalCheckVal = d3.select('#global-emb-checkbox').node().checked;
                        nodeSelVal = d3.select('#node-emb-select').node().value;
                        edgeSelVal = d3.select('#edge-emb-select').node().value;
                        globalSelValue = d3.select('#global-emb-select').node().value;
                        depthVal = d3.select('#depth-select').node().value;
                        aggVal = d3.select('#aggregation-select').node().value;
                        v = function (i, val) { return _this.hparamMap[i][val]; };
                        modelId = Object.keys(this.hparamMap).find(function (key) {
                            return (nodeCheckVal === (v(key, 'learn_nodes') == 'True')) &&
                                (edgeCheckVal === (v(key, 'learn_edges') == 'True')) &&
                                (globalCheckVal === (v(key, 'learn_globals') == 'True')) &&
                                (nodeSelVal === v(key, 'node_dim')) &&
                                (edgeSelVal === v(key, 'edge_dim')) &&
                                (globalSelValue === v(key, 'globals_dim')) &&
                                (depthVal === v(key, 'n_layers')) &&
                                (aggVal === v(key, 'aggregation_type'));
                        });
                        return [4 /*yield*/, this.modelUpdated(modelId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Playground.prototype.updateUIWithModelInfo = function (data) {
        // Set the max slider value
        var slider = d3.select('#epoch-slider');
        var dLength = data.length - 1;
        slider.attr('max', dLength);
        d3.select('#epoch').html(dLength);
        // Set the description
        d3.select('#description').html(this.data().description);
    };
    Playground.prototype.toggleLoading = function (hide, halfscreen) {
        if (hide === void 0) { hide = false; }
        if (halfscreen === void 0) { halfscreen = false; }
        d3.select('#svg-holder').classed('hidden', hide && !halfscreen);
        d3.select('#model-outputs').classed('hidden', hide);
        d3.select('#loader').classed('hidden', !hide).classed('halfscreen', halfscreen);
    };
    Playground.prototype.addLegend = function () {
        return __awaiter(this, void 0, void 0, function () {
            var idsToName, edgeLegendInfo;
            return __generator(this, function (_a) {
                idsToName = ['Carbon', 'Nitrogen', 'Oxygen', 'Sulphur'];
                d3.select('#svg-holder')
                    .append('div')
                    .classed('legend', true)
                    .html("\n        ".concat(this.graph.nodeColors.map(function (color, i) { return "\n        <div class='legend-line'>\n          <div style='color:".concat(color, "'>").concat(idsToName[i], "</div>\n        </div>\n        "); }).join(''), "\n      "));
                edgeLegendInfo = [
                    ['&nbsp&nbsp Single Bond', ['–'], 'scale(2.5, 1)'],
                    ['&nbsp&nbsp Double Bond', ['='], 'scale(2.5, 1)'],
                    ['&nbsp Triple Bond', ['≡'], 'scale(2.5, 1)'],
                    ['Aromatic Bond', ['≡', '≡'], 'rotate(90deg) translateY(3px) scale(1, 1.3)']
                ];
                d3.select('#svg-holder')
                    .append('div')
                    .classed('legend', true)
                    .attr('id', 'edge-legend')
                    .html("\n        ".concat(edgeLegendInfo.map(function (i) { return "\n        <div class='legend-line' >\n            ".concat(i[1].map(function (symb) { return "<div style='transform: ".concat(i[2], "'> ").concat(symb, "</div>"); }).join(''), " \n           ").concat(i[0], "\n        </div>\n        "); }).join(''), "\n      "));
                return [2 /*return*/];
            });
        });
    };
    Playground.prototype.setWarningMsg = function (molEdited) {
        var text = 'Model predictions for edited molecules are only available for the fully trained model. ';
        text += molEdited ?
            'Displaying predictions from the last epoch.' :
            'Reseting molecule.';
        var warning = d3.select('#warning');
        warning.html('<b>Warning: </b>' + text)
            .classed('hidden', false);
        setTimeout(function () { return warning.classed('hidden', true); }, 7000);
    };
    Playground.prototype.reset = function () {
        this.graph.resetData();
        this.updateGraph(this.currGraphIdx);
        this.resetButton.classed('disabled', true);
    };
    return Playground;
}());
exports.Playground = Playground;
