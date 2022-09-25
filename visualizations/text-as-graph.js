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
exports.TextAsGraph = void 0;
var d3 = require("d3");
var padding = 30;
var wordSpacing = 30;
var fontSize = 30;
var charWidth = calcCharWidth();
var steelblue = d3.color('steelblue');
var blue = steelblue.darker(-.5);
var blueDark = steelblue.darker(2);
var TextAsGraph = /** @class */ (function () {
    function TextAsGraph() {
        var _this = this;
        this.sel = d3.select('#text-as-graph');
        this.wordsHolder = this.sel.append('div');
        this.coords = [null, null];
        // Make the z index lower to make overflow go behind words.
        this.sel.parent().style('z-index', '-1');
        var c = d3.conventions({ sel: this.wordsHolder, margin: { left: 0 }, layers: 'sd', height: 250 });
        var _a = c.layers, svgSel = _a[0], divSel = _a[1];
        divSel.st({ left: padding, top: 20 + padding, height: 30 });
        var that = this;
        var inputSel = divSel.append('input')
            .st({ 'word-spacing': wordSpacing + 'px', fontSize: fontSize })
            .at({ maxlength: 30 })
            .on('input', function () { return _this.render(); })
            .on('mousemove', function () {
            // Calculate what word we're on by figuring out how much space they each take up.
            var x = d3.mouse(this)[0];
            var offset = 0;
            var wordIdx = 0;
            for (var _i = 0, _a = __spreadArray([], this.value, true); _i < _a.length; _i++) {
                var l = _a[_i];
                var isSpace = l == ' ';
                offset += isSpace ? charWidth + wordSpacing : charWidth;
                wordIdx += isSpace ? 1 : 0;
                if (offset > x) {
                    that.hover(wordIdx, isSpace ? wordIdx - 1 : wordIdx);
                    return;
                }
                ;
            }
            ;
        })
            .on('mouseout', function (d) { return _this.hover(); });
        this.inputNode = inputSel.node();
        this.inputNode.value = 'Graphs are all around us';
        var height = 100; // height of input node
        this.rectData = d3.range(20).map(function (i) { return ({ i: i }); });
        this.rectSel = svgSel.appendMany('rect', this.rectData)
            .at({ stroke: '#000', fill: function (d) { return "hsl(51, 100%, ".concat(Math.random() * 75 + 25, "%)"); }, height: height / 2, y: height / 4, 'rx': height / 6, 'ry': height / 6 })
            .translate(padding, 0)
            .each(function (d) { d.rectSel = d3.select(this); });
        this.textSel = svgSel.appendMany('text', this.rectData)
            .text('→')
            .at({ y: height / 2, dy: '.33em', textAnchor: 'middle', fill: blue })
            .st({ fontSize: 30 })
            .translate(padding, 0)
            .each(function (d) { d.textSel = d3.select(this); });
        this.adjMatSel = this.sel.append('svg')
            .st({ position: 'absolute', top: 150, left: 50 });
        this.render();
    }
    TextAsGraph.prototype.render = function () {
        var _this = this;
        this.rectSel.at({ opacity: 0 });
        this.textSel.at({ opacity: 0 });
        var words = this.inputNode.value.split(' ').map(function (word, i) { return ({ word: word, i: i }); });
        var x = 0;
        var pad = 5;
        var spaceWidth = charWidth + wordSpacing;
        words.forEach(function (d) {
            var width = d.word.length * charWidth;
            _this.rectData[d.i].rectSel
                .at({ opacity: 1, x: x - pad, width: width + pad * 2 });
            x += width + spaceWidth;
            if (!words[d.i + 1])
                return; // skip arrow for last word
            _this.rectData[d.i].textSel
                .at({ opacity: 1, x: x - spaceWidth / 2 });
        });
        // Center the words
        var width = this.wordsHolder.node().getBoundingClientRect().width;
        this.wordsHolder.st({ left: (width - x) / 2 });
        this.makeAdjMat(words);
    };
    TextAsGraph.prototype.makeAdjMat = function (words) {
        var _this = this;
        this.adjMatSel.selectAll('*').remove();
        this.adjMatSel
            .attr('font-size', 12)
            .attr('fill', 'gray');
        var pairs = d3.cross(words, words);
        var w = 20;
        this.adjMatSel
            .selectAll('rect')
            .data(pairs)
            .enter()
            .append('rect')
            .attr('width', w)
            .attr('height', w)
            .attr('transform', function (d) { return "translate(".concat(d[0].i * w, ", ").concat(d[1].i * w, ")"); })
            .attr('fill', function (d) { return _this.isEdge(d) ? blue : 'white'; })
            .attr('stroke', '#aaa')
            .attr('stroke-width', .2)
            .on('mouseover', function (d) { return _this.hover(d[0].i, d[1].i); })
            .on('mouseout', function (d) { return _this.hover(); });
        // center adj matrix
        var width = this.wordsHolder.node().getBoundingClientRect().width;
        this.adjMatSel.st({ left: (width - w * words.length) / 2 });
        // Add top words
        this.adjMatSel.selectAll('text.top')
            .data(words)
            .enter()
            .append('text.top')
            .attr('transform', function (d) { return "translate(".concat(d.i * w + w / 2, ", -5) rotate(-90)"); })
            .text(function (d) { return d.word; });
        // Add side words
        this.adjMatSel.selectAll('text.side')
            .data(words)
            .enter()
            .append('text.side')
            .attr('transform', function (d) { return "translate(-5, ".concat((d.i + .75) * w, ")"); })
            .attr('text-anchor', 'end')
            .text(function (d) { return d.word; });
    };
    TextAsGraph.prototype.isEdge = function (d) {
        return d[0].i - d[1].i === 1;
    };
    TextAsGraph.prototype.hover = function (i, j) {
        var _this = this;
        if (this.coords[0] == i && this.coords[1] == j) {
            return;
        }
        this.coords = [i, j];
        // Update the adj mat square color
        this.adjMatSel.selectAll('rect')
            .attr('fill', function (d) { return !_this.isEdge(d) ? 'white' : (d[0].i === i && d[1].i === j ? blueDark : blue); });
        // highlight the text on the adj mat
        var highlightColor = '#000';
        this.adjMatSel.selectAll('text.top')
            .attr('fill', function (d) { return d.i === i ? highlightColor : 'gray'; })
            .style('font-weight', function (d) { return d.i === i ? 'bold' : ''; });
        this.adjMatSel.selectAll('text.side')
            .attr('fill', function (d) { return d.i === j ? highlightColor : 'gray'; });
        this.rectSel.each(function (dRectSel) {
            dRectSel.rectSel.at({
                stroke: function (d) { return (d.i === i || d.i === j) ? highlightColor : '#000'; },
                strokeWidth: function (d) { return (d.i === i || d.i === j) ? 3 : 1; }
            });
            dRectSel.textSel.at({
                stroke: function (d) { return (d.i === j && j === i - 1) ? blueDark : blue; },
                strokeWidth: function (d) { return (d.i === j && j === i - 1) ? 4 : 0; },
                fill: function (d) { return (d.i === j && j === i - 1) ? blueDark : blue; }
            });
        });
    };
    return TextAsGraph;
}());
exports.TextAsGraph = TextAsGraph;
function calcCharWidth() {
    var spanSel = d3.select('body').append('span').text('x')
        .st({ fontFamily: 'monospace', fontSize: fontSize });
    var w = spanSel.node().offsetWidth;
    spanSel.remove();
    return w;
}
