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
exports.getKeyByValue = exports.setDataInitPos = exports.copy = exports.sleep = void 0;
var d3 = require("d3");
function sleep(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}
exports.sleep = sleep;
function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}
exports.copy = copy;
function setDataInitPos(data) {
    var _loop_1 = function (i) {
        var svg = d3.select("svg");
        var width = +svg.attr("width");
        var height = +svg.attr("height");
        data[i].nodes.forEach(function (d, j) {
            if (!d.processed) {
                if (d.initX) {
                    d.initX = Math.floor(parseFloat(d.initX) * 40 + width / 2);
                    d.initY = Math.floor(parseFloat(d.initY) * 40 + height / 2);
                }
                else {
                    var _a = getCircXY(j, data[i].nodes.length, width, height), x = _a[0], y = _a[1];
                    d.initX = x;
                    d.initY = y;
                }
                d.x = d.initX;
                d.y = d.initY;
                d.id = j;
                d.processed = true;
            }
        });
    };
    for (var i = 0; i < data.length; i++) {
        _loop_1(i);
    }
}
exports.setDataInitPos = setDataInitPos;
function getCircXY(i, length, w, h) {
    var x = Math.floor(Math.cos(i / length * 2 * Math.PI) * 100 + w / 2);
    var y = Math.floor(Math.sin(i / length * 2 * Math.PI) * 100 + h / 2);
    return [x, y];
}
function getKeyByValue(object, value) {
    return Object.keys(object).find(function (key) { return object[key] === value; });
}
exports.getKeyByValue = getKeyByValue;
