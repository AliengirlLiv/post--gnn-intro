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
exports.pcaLayers = void 0;
var d3 = require("d3");
var d3_jp = require("d3-jetpack");
function pcaLayers() {
    d3_jp.loadData('./graph.json', './pca.json', function (err, res) {
        var graph = res[0], pcaLayers = res[1];
        var fillColors = ["rgb(179, 201, 204)", "rgb(241, 85, 85)"];
        var strokeColors = ["rgb(63, 70, 71)", "rgb(84, 30, 30)"];
        var sel = d3.select('#pca-layer').html('');
        var leftSel = sel.append('div.left');
        var nodeR = 5;
        var s = d3_jp.conventions({
            sel: leftSel.append('div'),
            width: 450,
            height: 450,
            margin: { left: nodeR, top: nodeR, right: nodeR, bottom: nodeR }
        });
        s.svg.parent().classed('chart-yellow-bg', 1);
        pcaLayers.forEach(function (layer, layerIndex) {
            var xScale = d3.scaleLinear().domain(d3.extent(layer.pca_locs.map(function (d) { return d[0]; })));
            var yScale = d3.scaleLinear().domain(d3.extent(layer.pca_locs.map(function (d) { return d[1]; })));
            layer.nodes = layer.pca_locs.map(function (_a, i) {
                var x = _a[0], y = _a[1];
                var pos = [s.x(xScale(x)), s.y(yScale(y))];
                var label = layer.labels[i][0];
                var pred = layer.pred_labels[i];
                return { i: i, pos: pos, label: label, pred: pred };
            });
        });
        var sLinkSel = s.svg.append('g').appendMany('path.scatter-link.link', graph.links);
        var sNodeSel = s.svg.appendMany('circle.node', pcaLayers[0].nodes)
            .translate(function (d) { return d.pos; })
            .call(styleNode);
        var layerBoxSel = leftSel.append('div.layer-container')
            .append('div').text('Epoch ').st({ marginRight: 10 })
            .parent()
            .appendMany('div.layer-box', d3.range(0, 200, 20))
            .text(function (d) { return d3.format('03')(d); })
            .on('click', function (d) {
            setLayer(d, 250);
        });
        function setLayer(layerIndex, dur, ease) {
            if (dur === void 0) { dur = 0; }
            if (ease === void 0) { ease = d3.easeCubicOut; }
            layerBoxSel.classed('active', function (d) { return d == layerIndex; });
            sNodeSel.data(pcaLayers[layerIndex].nodes);
            sNodeSel
                .transition().ease(d3.easeCubicOut).duration(dur)
                .translate(function (d) { return d.pos; });
            sLinkSel
                .transition().ease(d3.easeCubicOut).duration(dur)
                .at({
                d: function (d) {
                    var n0 = pcaLayers[layerIndex].nodes[d.source.index];
                    var n1 = pcaLayers[layerIndex].nodes[d.target.index];
                    return 'M' + n0.pos + 'L' + n1.pos;
                }
            });
        }
        var rightSel = sel.append('div.right');
        var g = d3_jp.conventions({
            sel: rightSel.append('div#layer-graph'),
            width: 450,
            height: 450,
            margin: { left: nodeR, top: nodeR, right: nodeR, bottom: nodeR }
        });
        var simulation = d3.forceSimulation()
            .nodes(graph.nodes)
            .force('charge', d3.forceManyBody().strength(-300))
            .force('link', d3.forceLink().distance(40).links(graph.links))
            .force('x', d3.forceX(g.width / 2))
            .force('y', d3.forceY(g.height / 2))
            .stop();
        for (var i = 0; i < 300; ++i)
            simulation.tick();
        graph.nodes.forEach(function (d) {
            d.i = d.index;
            d.label = d.club == 'Mr. Hi' ? 1 : 0;
            d.neighbours = {};
        });
        graph.links.forEach(function (d) {
            var n0 = graph.nodes[d.source.index];
            var n1 = graph.nodes[d.target.index];
            n0.neighbours[n1.i] = n1;
            n1.neighbours[n0.i] = n0;
        });
        g.svg.append('g').appendMany('path.graph-link.link', graph.links)
            .at({
            stroke: '#ccc',
            d: function (d) { return ['M', d.source.x, d.source.y, 'L', d.target.x, d.target.y].join(' '); }
        });
        g.svg.appendMany('circle.node', graph.nodes)
            .call(styleNode)
            .translate(function (d) { return [d.x, d.y]; });
        var nodeSel = sel.selectAll('.node');
        var linkSel = sel.selectAll('.link');
        function styleNode(sel) {
            sel
                .at({ r: nodeR, fill: function (d) { return fillColors[d.label]; }, stroke: function (d) { return strokeColors[d.label]; } })
                .on('mouseover', function (d) {
                nodeSel.classed('active', function (e) { return d.i == e.i; });
                linkSel
                    .classed('active', 0)
                    .filter(function (e) { return e.source.index == d.i || e.target.index == d.i; })
                    .classed('active', 1)
                    .raise();
            });
        }
        setLayer(0);
    });
}
exports.pcaLayers = pcaLayers;
