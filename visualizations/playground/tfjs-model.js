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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.Model = void 0;
var tf = require("@tensorflow/tfjs");
var d3 = require("d3");
tf.setBackend('cpu');
console.log(tf.version);
var Model = /** @class */ (function () {
    function Model() {
        /** for debugging (only log outputs once) */
        this.logged = true;
        registerOps();
    }
    Model.prototype.initModel = function (modelId) {
        return __awaiter(this, void 0, void 0, function () {
            var root, _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (this.model) {
                            this.model.dispose();
                        }
                        root = "https://storage.googleapis.com/gnn-distill/hparams/".concat(modelId, "/");
                        _a = this;
                        return [4 /*yield*/, d3.json(root + 'emb_pca_test.json')];
                    case 1:
                        _a.pca = (_e.sent())[0].value;
                        _b = this;
                        return [4 /*yield*/, d3.json(root + 'pred_test.json')];
                    case 2:
                        _b.preds = (_e.sent())[0].value;
                        _c = this;
                        return [4 /*yield*/, tf.loadGraphModel(root + 'tfjs/model.json')];
                    case 3:
                        _c.model = _e.sent();
                        _d = this;
                        return [4 /*yield*/, d3.csv(root + 'stats.csv')];
                    case 4:
                        _d.stats = (_e.sent());
                        return [2 /*return*/];
                }
            });
        });
    };
    Model.prototype.runModel = function (inputs, tensorName) {
        if (tensorName === void 0) { tensorName = null; }
        return __awaiter(this, void 0, void 0, function () {
            var output, out;
            return __generator(this, function (_a) {
                // Fix the tensor order.
                inputs = this.fixInputsOrder(inputs);
                this.logAllOpShapes(inputs);
                output = tensorName ? this.model.execute(inputs, tensorName) : this.model.predict(inputs);
                out = output.length ? output.map(function (out) { return out.arraySync(); }) : output.arraySync();
                return [2 /*return*/, out];
            });
        });
    };
    /**
     * Due to esoteric dict ordering inconsistencies, reorder the input tensors based
     * on the order of the graph's inputs (which are called, e.g., "input_0")
     */
    Model.prototype.fixInputsOrder = function (tensors) {
        var inputs = new Array(tensors.length);
        var inputNames = this.model.executor._inputs.map(function (x) { return x.name; });
        var sortedInputNames = __spreadArray([], inputNames, true).sort();
        for (var i = 0; i < inputNames.length; i++) {
            var idx = sortedInputNames.indexOf(inputNames[i]);
            var t = tensors[idx];
            inputs[i] = tf.tensor(t.value, undefined, t.dtype);
        }
        return inputs;
    };
    /**
     * Log the output shapes of all ops in the graph. For debugging purposes.
     */
    Model.prototype.logAllOpShapes = function (tensors) {
        var _this = this;
        if (!this.logged) {
            this.model.artifacts.modelTopology.node.forEach(function (node) {
                var res = _this.model.execute(tensors, node.name);
                console.log(node.name, res.shape);
            });
            this.logged = true;
        }
    };
    return Model;
}());
exports.Model = Model;
function registerOps() {
    var cumsum = function (node) {
        var x = node.inputs[0];
        var axis = node.inputs[1];
        var exclusive = node.attrs['exclusive'];
        var reverse = node.attrs['reverse'];
        return tf.cumsum(x, axis, exclusive, reverse);
    };
    var UnsortedSegmentSum = function (node) {
        var x = node.inputs[0];
        var segmentIds = node.inputs[1].asType('int32');
        var numSegments = node.inputs[2].asType('int32');
        return tf.unsortedSegmentSum(x, segmentIds, numSegments.arraySync());
    };
    tf.registerOp('Cumsum', cumsum);
    tf.registerOp('UnsortedSegmentSum', UnsortedSegmentSum);
}
