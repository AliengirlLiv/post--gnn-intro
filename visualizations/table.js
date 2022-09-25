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
exports.Table = void 0;
var Table = /** @class */ (function () {
    function Table() {
        document.getElementById('table').innerHTML =
            "\n      <div class=table-holder>\n\n        <div class='row'>\n          <div class='spacer'></div>\n          <div class='degree'>\n            Edges per node (degree)\n          </div>\n        </div>\n      \n        <div class='row header'>\n          <div> Dataset </div>\n          <div> Domain </div>\n          <div> graphs </div>\n          <div> nodes </div>\n          <div> edges </div>\n          <div> min </div>\n          <div> mean </div>\n          <div> max </div>\n        </div>\n\n        <div class='row'>\n          <div> karate club</div>\n          <div> Social network </div>\n          <div> 1 </div>\n          <div> 34 </div>\n          <div> 78 </div>\n          <div>  </div>\n          <div> 4.5 </div>\n          <div> 17 </div>\n        </div>\n\n        <div class='row'>\n          <div> qm9 </div>\n          <div> Small molecules </div>\n          <div> 134k </div>\n          <div> \u2264 9 </div>\n          <div> \u226426 </div>\n          <div> 1 </div>\n          <div> 2 </div>\n          <div> 5 </div>\n        </div>\n\n        <div class='row'>\n          <div> Cora </div>\n          <div> Citation network </div>\n          <div> 1 </div>\n          <div> 23,166 </div>\n          <div> 91,500 </div>\n          <div> 1 </div>\n          <div> 7.8 </div>\n          <div> 379 </div>\n        </div>\n\n        <div class='row'>\n          <div> Wikipedia links, English </div>\n          <div> Knowledge graph </div>\n          <div> 1 </div>\n          <div> 12M </div>\n          <div> 378M </div>\n          <div>  </div>\n          <div> 62.24 </div>\n          <div> 1M </div>\n        </div>\n\n\n      </div>\n      ";
    }
    return Table;
}());
exports.Table = Table;
