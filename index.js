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
// exports.__esModule = true;
var d3 = require("d3");
var d3_jp = require("d3-jetpack");
d3.keys(d3_jp).forEach(function (key) {
    try {
        d3[key] = d3_jp[key];
    }
    catch (e) {
    }
});
var graph_level_1 = require("./visualizations/graph-level");
var graph_to_tensor_1 = require("./visualizations/graph-to-tensor");
var image_as_graph_1 = require("./visualizations/image-as-graph");
var layerwise_trace_1 = require("./visualizations/layerwise_trace");
var mols_as_graph_1 = require("./visualizations/mols-as-graph");
var node_level_1 = require("./visualizations/node-level");
var pca_layers_1 = require("./visualizations/pca-layers");
var node_step_1 = require("./visualizations/node-step");
var node_step_small_1 = require("./visualizations/node-step-small");
var shuffle_sm_1 = require("./visualizations/shuffle-sm");
var pooling_table_1 = require("./visualizations/pooling-table");
var text_as_graph_1 = require("./visualizations/text-as-graph");
var index_1 = require("./visualizations/playground/index");
var graph_description_1 = require("./visualizations/graph-description");
var table_1 = require("./visualizations/table");
var graph_description_embeddings_1 = require("./visualizations/graph-description-embeddings");
window.onload = function () {
    (0, pca_layers_1.pcaLayers)();
    (0, node_step_small_1.nodeStepSmall)();
    (0, pooling_table_1.poolingTable)();
    (0, node_level_1.nodeLevel)();
    (0, graph_level_1.graphLevel)();
    (0, graph_to_tensor_1.graphToTensor)();
    (0, node_step_1.nodeStep)();
    (0, shuffle_sm_1.shuffleSm)();
    new layerwise_trace_1.LayerwiseTrace();
    new text_as_graph_1.TextAsGraph();
    new mols_as_graph_1.XsAsGraphs();
    new index_1.Playground();
    new graph_description_1.GraphDescription();
    new graph_description_embeddings_1.GraphDescriptionEmbeddings();
    (0, image_as_graph_1.imageAsGraph)();
    new table_1.Table();
};
