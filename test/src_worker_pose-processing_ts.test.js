(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["v3d-web"] = factory();
	else
		root["v3d-web"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/helper/basis.ts":
/*!*****************************!*\
  !*** ./src/helper/basis.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Basis": () => (/* binding */ Basis),
/* harmony export */   "quaternionBetweenBases": () => (/* binding */ quaternionBetweenBases),
/* harmony export */   "getBasis": () => (/* binding */ getBasis),
/* harmony export */   "calcAvgPlane": () => (/* binding */ calcAvgPlane)
/* harmony export */ });
/* harmony import */ var _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babylonjs/core */ "./node_modules/@babylonjs/core/index.js");
/* harmony import */ var _quaternion__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./quaternion */ "./src/helper/quaternion.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/helper/utils.ts");
/*
Copyright (C) 2022  The v3d Authors.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, version 3.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
// Calculate 3D rotations



class Basis {
    constructor(v33, leftHanded = true, eps = 1e-6) {
        this.leftHanded = leftHanded;
        this.eps = eps;
        this._data = Basis.getOriginalCoordVectors();
        if (v33 && v33.every((v) => (0,_utils__WEBPACK_IMPORTED_MODULE_2__.validVector3)(v)))
            this.set(v33);
        this._data.forEach((v) => {
            Object.freeze(v);
        });
    }
    get x() {
        return this._data[0];
    }
    get y() {
        return this._data[1];
    }
    get z() {
        return this._data[2];
    }
    get() {
        return this._data;
    }
    set(v33) {
        this.x.copyFrom(v33[0]);
        this.y.copyFrom(v33[1]);
        this.z.copyFrom(v33[2]);
        this.verifyBasis();
    }
    verifyBasis() {
        const z = this.leftHanded ? this.z : this.z.negate();
        if (!(0,_quaternion__WEBPACK_IMPORTED_MODULE_1__.vectorsSameDirWithinEps)(this.x.cross(this.y), z, this.eps))
            throw Error("Basis is not correct!");
    }
    rotateByQuaternion(q) {
        const newBasisVectors = [_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero(), _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero(), _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero()];
        this._data.map((v, i) => {
            v.rotateByQuaternionToRef(q, newBasisVectors[i]);
        });
        return new Basis(newBasisVectors);
    }
    // Basis validity is not checked!
    negateAxes(axis) {
        const x = this.x.clone();
        const y = this.y.clone();
        const z = this.z.clone();
        switch (axis) {
            case _quaternion__WEBPACK_IMPORTED_MODULE_1__.AXIS.x:
                x.negateInPlace();
                break;
            case _quaternion__WEBPACK_IMPORTED_MODULE_1__.AXIS.y:
                y.negateInPlace();
                break;
            case _quaternion__WEBPACK_IMPORTED_MODULE_1__.AXIS.z:
                z.negateInPlace();
                break;
            case _quaternion__WEBPACK_IMPORTED_MODULE_1__.AXIS.xy:
                x.negateInPlace();
                y.negateInPlace();
                break;
            case _quaternion__WEBPACK_IMPORTED_MODULE_1__.AXIS.yz:
                y.negateInPlace();
                z.negateInPlace();
                break;
            case _quaternion__WEBPACK_IMPORTED_MODULE_1__.AXIS.xz:
                x.negateInPlace();
                z.negateInPlace();
                break;
            case _quaternion__WEBPACK_IMPORTED_MODULE_1__.AXIS.xyz:
                x.negateInPlace();
                y.negateInPlace();
                z.negateInPlace();
                break;
            default:
                throw Error("Unknown axis!");
        }
        return new Basis([x, y, z]);
    }
    transpose(order) {
        // Sanity check
        if (!(0,_utils__WEBPACK_IMPORTED_MODULE_2__.setEqual)(new Set(order), new Set([0, 1, 2]))) {
            console.error("Basis transpose failed: wrong input.");
            return this;
        }
        const data = [this.x.clone(), this.y.clone(), this.z.clone()];
        const newData = order.map(i => data[i]);
        return new Basis(newData);
    }
    static getOriginalCoordVectors() {
        return Basis.ORIGINAL_CARTESIAN_BASIS_VECTORS.map(v => v.clone());
    }
}
Basis.ORIGINAL_CARTESIAN_BASIS_VECTORS = [
    new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(1, 0, 0),
    new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 1, 0),
    new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, 1),
];
function quaternionBetweenBases(basis1, basis2, prevQuaternion) {
    let thisBasis1 = basis1, thisBasis2 = basis2;
    if (prevQuaternion !== undefined) {
        const extraQuaternionR = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Inverse(prevQuaternion);
        thisBasis1 = basis1.rotateByQuaternion(extraQuaternionR);
        thisBasis2 = basis2.rotateByQuaternion(extraQuaternionR);
    }
    const rotationBasis1 = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.RotationQuaternionFromAxis(thisBasis1.x.clone(), thisBasis1.y.clone(), thisBasis1.z.clone());
    const rotationBasis2 = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.RotationQuaternionFromAxis(thisBasis2.x.clone(), thisBasis2.y.clone(), thisBasis2.z.clone());
    const quaternion31 = rotationBasis1.clone().normalize();
    const quaternion31R = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Inverse(quaternion31);
    const quaternion32 = rotationBasis2.clone().normalize();
    return quaternion32.multiply(quaternion31R);
}
/*
 * Left handed for BJS.
 * Each object is defined by 3 points.
 * Assume a is origin, b points to +x, abc forms XY plane.
 */
function getBasis(obj) {
    const [a, b, c] = obj;
    const planeXY = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Plane.FromPoints(a, b, c).normalize();
    const axisX = b.subtract(a).normalize();
    const axisZ = planeXY.normal;
    // Project c onto ab
    const cp = a.add(axisX.scale(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Dot(c.subtract(a), axisX) / _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Dot(axisX, axisX)));
    const axisY = c.subtract(cp).normalize();
    return new Basis([axisX, axisY, axisZ]);
}
// Project points to an average plane
function calcAvgPlane(pts, normal) {
    if (pts.length === 0)
        return [_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero()];
    const avgPt = pts.reduce((prev, curr) => {
        return prev.add(curr);
    }).scale(1 / pts.length);
    const ret = pts.map((v) => {
        return v.subtract(normal.scale(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Dot(normal, v.subtract(avgPt))));
    });
    return ret;
}


/***/ }),

/***/ "./src/helper/filter.ts":
/*!******************************!*\
  !*** ./src/helper/filter.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "VISIBILITY_THRESHOLD": () => (/* binding */ VISIBILITY_THRESHOLD),
/* harmony export */   "gaussianKernel1d": () => (/* binding */ gaussianKernel1d),
/* harmony export */   "OneEuroVectorFilter": () => (/* binding */ OneEuroVectorFilter),
/* harmony export */   "KalmanVectorFilter": () => (/* binding */ KalmanVectorFilter),
/* harmony export */   "GaussianVectorFilter": () => (/* binding */ GaussianVectorFilter),
/* harmony export */   "EuclideanHighPassFilter": () => (/* binding */ EuclideanHighPassFilter)
/* harmony export */ });
/* harmony import */ var _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babylonjs/core */ "./node_modules/@babylonjs/core/index.js");
/* harmony import */ var kalmanjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! kalmanjs */ "./node_modules/kalmanjs/lib/kalman.js");
/* harmony import */ var kalmanjs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(kalmanjs__WEBPACK_IMPORTED_MODULE_1__);
/*
Copyright (C) 2022  The v3d Authors.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, version 3.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */


const VISIBILITY_THRESHOLD = 0.6;
// 1D Gaussian Kernel
const gaussianKernel1d = (function () {
    let sqr2pi = Math.sqrt(2 * Math.PI);
    return function gaussianKernel1d(size, sigma) {
        // ensure size is even and prepare variables
        let width = (size / 2) | 0, kernel = new Array(width * 2 + 1), norm = 1.0 / (sqr2pi * sigma), coefficient = 2 * sigma * sigma, total = 0, x;
        // set values and increment total
        for (x = -width; x <= width; x++) {
            total += kernel[width + x] = norm * Math.exp(-x * x / coefficient);
        }
        // divide by total to make sure the sum of all the values is equal to 1
        for (x = 0; x < kernel.length; x++) {
            kernel[x] /= total;
        }
        return kernel;
    };
}());
/*
 * Converted from https://github.com/jaantollander/OneEuroFilter.
 */
class OneEuroVectorFilter {
    constructor(t_prev, x_prev, dx_prev = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero(), min_cutoff = 1.0, beta = 0.0, d_cutoff = 1.0) {
        this.t_prev = t_prev;
        this.x_prev = x_prev;
        this.dx_prev = dx_prev;
        this.min_cutoff = min_cutoff;
        this.beta = beta;
        this.d_cutoff = d_cutoff;
    }
    static smoothing_factor(t_e, cutoff) {
        const r = 2 * Math.PI * cutoff * t_e;
        return r / (r + 1);
    }
    static exponential_smoothing(a, x, x_prev) {
        return x.scale(a).addInPlace(x_prev.scale((1 - a)));
    }
    next(t, x) {
        const t_e = t - this.t_prev;
        // The filtered derivative of the signal.
        const a_d = OneEuroVectorFilter.smoothing_factor(t_e, this.d_cutoff);
        const dx = x.subtract(this.x_prev).scaleInPlace(1 / t_e);
        const dx_hat = OneEuroVectorFilter.exponential_smoothing(a_d, dx, this.dx_prev);
        // The filtered signal.
        const cutoff = this.min_cutoff + this.beta * dx_hat.length();
        const a = OneEuroVectorFilter.smoothing_factor(t_e, cutoff);
        const x_hat = OneEuroVectorFilter.exponential_smoothing(a, x, this.x_prev);
        // Memorize the previous values.
        this.x_prev = x_hat;
        this.dx_prev = dx_hat;
        this.t_prev = t;
        return x_hat;
    }
}
class KalmanVectorFilter {
    constructor(R = 0.1, Q = 3) {
        this.R = R;
        this.Q = Q;
        this.kalmanFilterX = new (kalmanjs__WEBPACK_IMPORTED_MODULE_1___default())({ Q: Q, R: R });
        this.kalmanFilterY = new (kalmanjs__WEBPACK_IMPORTED_MODULE_1___default())({ Q: Q, R: R });
        this.kalmanFilterZ = new (kalmanjs__WEBPACK_IMPORTED_MODULE_1___default())({ Q: Q, R: R });
    }
    next(t, vec) {
        const newValues = [
            this.kalmanFilterX.filter(vec.x),
            this.kalmanFilterY.filter(vec.y),
            this.kalmanFilterZ.filter(vec.z),
        ];
        return _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.FromArray(newValues);
    }
}
class GaussianVectorFilter {
    constructor(size, sigma) {
        this.size = size;
        this.sigma = sigma;
        this._values = [];
        if (size < 2)
            throw RangeError("Filter size too short");
        this.size = Math.floor(size);
        this.kernel = gaussianKernel1d(size, sigma);
    }
    get values() {
        return this._values;
    }
    push(v) {
        this.values.push(v);
        if (this.values.length === this.size + 1) {
            this.values.shift();
        }
        else if (this.values.length > this.size + 1) {
            console.warn(`Internal queue has length longer than size: ${this.size}`);
            this.values.slice(-this.size);
        }
    }
    reset() {
        this.values.length = 0;
    }
    apply() {
        if (this.values.length !== this.size)
            return _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero();
        const ret = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero();
        const len0 = ret.length();
        for (let i = 0; i < this.size; ++i) {
            ret.addInPlace(this.values[i].scale(this.kernel[i]));
        }
        const len1 = ret.length();
        // Normalize to original length
        ret.scaleInPlace(len0 / len1);
        return ret;
    }
}
class EuclideanHighPassFilter {
    constructor(threshold) {
        this.threshold = threshold;
        this._value = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero();
    }
    get value() {
        return this._value;
    }
    update(v) {
        if (this.value.subtract(v).length() > this.threshold) {
            this._value = v;
        }
    }
    reset() {
        this._value = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero();
    }
}


/***/ }),

/***/ "./src/helper/landmark.ts":
/*!********************************!*\
  !*** ./src/helper/landmark.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FilteredLandmarkVector": () => (/* binding */ FilteredLandmarkVector),
/* harmony export */   "POSE_LANDMARK_LENGTH": () => (/* binding */ POSE_LANDMARK_LENGTH),
/* harmony export */   "FACE_LANDMARK_LENGTH": () => (/* binding */ FACE_LANDMARK_LENGTH),
/* harmony export */   "HAND_LANDMARK_LENGTH": () => (/* binding */ HAND_LANDMARK_LENGTH),
/* harmony export */   "normalizedLandmarkToVector": () => (/* binding */ normalizedLandmarkToVector),
/* harmony export */   "vectorToNormalizedLandmark": () => (/* binding */ vectorToNormalizedLandmark),
/* harmony export */   "HAND_LANDMARKS": () => (/* binding */ HAND_LANDMARKS),
/* harmony export */   "HAND_LANDMARKS_BONE_MAPPING": () => (/* binding */ HAND_LANDMARKS_BONE_MAPPING),
/* harmony export */   "HAND_LANDMARKS_BONE_REVERSE_MAPPING": () => (/* binding */ HAND_LANDMARKS_BONE_REVERSE_MAPPING),
/* harmony export */   "handLandMarkToBoneName": () => (/* binding */ handLandMarkToBoneName),
/* harmony export */   "depthFirstSearch": () => (/* binding */ depthFirstSearch)
/* harmony export */ });
/* harmony import */ var _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babylonjs/core */ "./node_modules/@babylonjs/core/index.js");
/* harmony import */ var _filter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./filter */ "./src/helper/filter.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/helper/utils.ts");
/*
Copyright (C) 2022  The v3d Authors.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, version 3.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */



class FilteredLandmarkVector {
    constructor(params = {
        oneEuroCutoff: 0.01,
        oneEuroBeta: 0,
        type: 'OneEuro'
    }) {
        this.gaussianVectorFilter = null;
        this._t = 0;
        this._pos = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero();
        this.visibility = 0;
        if (params.type === "Kalman")
            this.mainFilter = new _filter__WEBPACK_IMPORTED_MODULE_1__.KalmanVectorFilter(params.R, params.Q);
        else if (params.type === "OneEuro")
            this.mainFilter = new _filter__WEBPACK_IMPORTED_MODULE_1__.OneEuroVectorFilter(this.t, this.pos, _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero(), params.oneEuroCutoff, params.oneEuroBeta);
        else
            throw Error("Wrong filter type!");
        if (params.gaussianSigma)
            this.gaussianVectorFilter = new _filter__WEBPACK_IMPORTED_MODULE_1__.GaussianVectorFilter(5, params.gaussianSigma);
    }
    get t() {
        return this._t;
    }
    set t(value) {
        this._t = value;
    }
    get pos() {
        return this._pos;
    }
    updatePosition(pos, visibility) {
        this.t += 1;
        // Face Mesh has no visibility
        if (visibility === undefined || visibility > _filter__WEBPACK_IMPORTED_MODULE_1__.VISIBILITY_THRESHOLD) {
            pos = this.mainFilter.next(this.t, pos);
            if (this.gaussianVectorFilter) {
                this.gaussianVectorFilter.push(pos);
                pos = this.gaussianVectorFilter.apply();
            }
            this._pos = pos;
            this.visibility = visibility;
        }
    }
}
const POSE_LANDMARK_LENGTH = 33;
const FACE_LANDMARK_LENGTH = 478;
const HAND_LANDMARK_LENGTH = 21;
const normalizedLandmarkToVector = (l, scaling = 1., reverseY = false) => {
    return new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(l.x * scaling, reverseY ? -l.y * scaling : l.y * scaling, l.z * scaling);
};
const vectorToNormalizedLandmark = (l) => {
    return { x: l.x, y: l.y, z: l.z };
};
const HAND_LANDMARKS = {
    WRIST: 0,
    THUMB_CMC: 1,
    THUMB_MCP: 2,
    THUMB_IP: 3,
    THUMB_TIP: 4,
    INDEX_FINGER_MCP: 5,
    INDEX_FINGER_PIP: 6,
    INDEX_FINGER_DIP: 7,
    INDEX_FINGER_TIP: 8,
    MIDDLE_FINGER_MCP: 9,
    MIDDLE_FINGER_PIP: 10,
    MIDDLE_FINGER_DIP: 11,
    MIDDLE_FINGER_TIP: 12,
    RING_FINGER_MCP: 13,
    RING_FINGER_PIP: 14,
    RING_FINGER_DIP: 15,
    RING_FINGER_TIP: 16,
    PINKY_MCP: 17,
    PINKY_PIP: 18,
    PINKY_DIP: 19,
    PINKY_TIP: 20,
};
const HAND_LANDMARKS_BONE_MAPPING = {
    Hand: HAND_LANDMARKS.WRIST,
    ThumbProximal: HAND_LANDMARKS.THUMB_CMC,
    ThumbIntermediate: HAND_LANDMARKS.THUMB_MCP,
    ThumbDistal: HAND_LANDMARKS.THUMB_IP,
    IndexProximal: HAND_LANDMARKS.INDEX_FINGER_MCP,
    IndexIntermediate: HAND_LANDMARKS.INDEX_FINGER_PIP,
    IndexDistal: HAND_LANDMARKS.INDEX_FINGER_DIP,
    MiddleProximal: HAND_LANDMARKS.MIDDLE_FINGER_MCP,
    MiddleIntermediate: HAND_LANDMARKS.MIDDLE_FINGER_PIP,
    MiddleDistal: HAND_LANDMARKS.MIDDLE_FINGER_DIP,
    RingProximal: HAND_LANDMARKS.RING_FINGER_MCP,
    RingIntermediate: HAND_LANDMARKS.RING_FINGER_PIP,
    RingDistal: HAND_LANDMARKS.RING_FINGER_DIP,
    LittleProximal: HAND_LANDMARKS.PINKY_MCP,
    LittleIntermediate: HAND_LANDMARKS.PINKY_PIP,
    LittleDistal: HAND_LANDMARKS.PINKY_DIP,
};
const HAND_LANDMARKS_BONE_REVERSE_MAPPING = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.objectFlip)(HAND_LANDMARKS_BONE_MAPPING);
function handLandMarkToBoneName(landmark, isLeft) {
    if (!(landmark in HAND_LANDMARKS_BONE_REVERSE_MAPPING))
        throw Error("Wrong landmark given!");
    return (isLeft ? 'left' : 'right') + HAND_LANDMARKS_BONE_REVERSE_MAPPING[landmark];
}
/*
 * Depth-first search/walk of a generic tree.
 * Also returns a map for backtracking from leaf.
 */
function depthFirstSearch(rootNode, f) {
    const stack = [];
    const parentMap = new Map();
    stack.push(rootNode);
    while (stack.length !== 0) {
        // remove the first child in the stack
        const currentNode = stack.splice(-1, 1)[0];
        const retVal = f(currentNode);
        if (retVal)
            return [currentNode, parentMap];
        const currentChildren = currentNode.children;
        // add any children in the node at the top of the stack
        if (currentChildren !== null) {
            for (let index = 0; index < currentChildren.length; index++) {
                const child = currentChildren[index];
                stack.push(child);
                if (!(parentMap.has(child))) {
                    parentMap.set(child, currentNode);
                }
            }
        }
    }
    return [null, null];
}


/***/ }),

/***/ "./src/helper/quaternion.ts":
/*!**********************************!*\
  !*** ./src/helper/quaternion.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CloneableQuaternionLite": () => (/* binding */ CloneableQuaternionLite),
/* harmony export */   "CloneableQuaternion": () => (/* binding */ CloneableQuaternion),
/* harmony export */   "cloneableQuaternionToQuaternion": () => (/* binding */ cloneableQuaternionToQuaternion),
/* harmony export */   "FilteredQuaternion": () => (/* binding */ FilteredQuaternion),
/* harmony export */   "AXIS": () => (/* binding */ AXIS),
/* harmony export */   "RadToDeg": () => (/* binding */ RadToDeg),
/* harmony export */   "DegToRad": () => (/* binding */ DegToRad),
/* harmony export */   "checkQuaternion": () => (/* binding */ checkQuaternion),
/* harmony export */   "quaternionBetweenVectors": () => (/* binding */ quaternionBetweenVectors),
/* harmony export */   "degreeBetweenVectors": () => (/* binding */ degreeBetweenVectors),
/* harmony export */   "remapDegreeWithCap": () => (/* binding */ remapDegreeWithCap),
/* harmony export */   "quaternionToDegrees": () => (/* binding */ quaternionToDegrees),
/* harmony export */   "vectorsSameDirWithinEps": () => (/* binding */ vectorsSameDirWithinEps),
/* harmony export */   "testQuaternionEqualsByVector": () => (/* binding */ testQuaternionEqualsByVector),
/* harmony export */   "degreesEqualInQuaternion": () => (/* binding */ degreesEqualInQuaternion),
/* harmony export */   "reverseRotation": () => (/* binding */ reverseRotation),
/* harmony export */   "removeRotationAxisWithCap": () => (/* binding */ removeRotationAxisWithCap),
/* harmony export */   "exchangeRotationAxis": () => (/* binding */ exchangeRotationAxis),
/* harmony export */   "printQuaternion": () => (/* binding */ printQuaternion),
/* harmony export */   "calcSphericalCoord": () => (/* binding */ calcSphericalCoord),
/* harmony export */   "sphericalToQuaternion": () => (/* binding */ sphericalToQuaternion),
/* harmony export */   "scaleRotation": () => (/* binding */ scaleRotation)
/* harmony export */ });
/* harmony import */ var _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babylonjs/core */ "./node_modules/@babylonjs/core/index.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/helper/utils.ts");
/* harmony import */ var _basis__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./basis */ "./src/helper/basis.ts");
/* harmony import */ var _landmark__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./landmark */ "./src/helper/landmark.ts");
/* harmony import */ var _filter__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./filter */ "./src/helper/filter.ts");
/*
Copyright (C) 2022  The v3d Authors.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, version 3.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */





class CloneableQuaternionLite {
    constructor(q) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 1;
        if (q) {
            this.x = q.x;
            this.y = q.y;
            this.z = q.z;
            this.w = q.w;
        }
    }
}
class CloneableQuaternion extends CloneableQuaternionLite {
    constructor(q, basis) {
        super(q);
        this._baseBasis = basis ? basis : new _basis__WEBPACK_IMPORTED_MODULE_2__.Basis(null);
    }
    get baseBasis() {
        return this._baseBasis;
    }
    set(q) {
        this.x = q.x;
        this.y = q.y;
        this.z = q.z;
        this.w = q.w;
    }
    rotateBasis(q) {
        return this._baseBasis.rotateByQuaternion(q);
    }
}
const cloneableQuaternionToQuaternion = (q) => {
    const ret = new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion(q.x, q.y, q.z, q.w);
    return ret;
};
class FilteredQuaternion {
    constructor(params = {
        R: 1,
        Q: 1,
        type: 'Kalman'
    }) {
        this.gaussianVectorFilter = null;
        this._t = 0;
        this._rot = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity();
        if (params.type === "Kalman")
            this.mainFilter = new _filter__WEBPACK_IMPORTED_MODULE_4__.KalmanVectorFilter(params.R, params.Q);
        else
            throw Error("Wrong filter type!");
        if (params.gaussianSigma)
            this.gaussianVectorFilter = new _filter__WEBPACK_IMPORTED_MODULE_4__.GaussianVectorFilter(5, params.gaussianSigma);
    }
    get t() {
        return this._t;
    }
    set t(value) {
        this._t = value;
    }
    get rot() {
        return this._rot;
    }
    updateRotation(rot) {
        this.t += 1;
        let angles = rot.toEulerAngles();
        angles = this.mainFilter.next(this.t, angles);
        if (this.gaussianVectorFilter) {
            this.gaussianVectorFilter.push(angles);
            angles = this.gaussianVectorFilter.apply();
        }
        this._rot = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.FromEulerVector(angles);
    }
}
var AXIS;
(function (AXIS) {
    AXIS[AXIS["x"] = 0] = "x";
    AXIS[AXIS["y"] = 1] = "y";
    AXIS[AXIS["z"] = 2] = "z";
    AXIS[AXIS["xy"] = 3] = "xy";
    AXIS[AXIS["yz"] = 4] = "yz";
    AXIS[AXIS["xz"] = 5] = "xz";
    AXIS[AXIS["xyz"] = 6] = "xyz";
    AXIS[AXIS["none"] = 10] = "none";
})(AXIS || (AXIS = {}));
// Convenience functions
const RadToDeg = (r) => {
    return _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Angle.FromRadians(r).degrees();
};
const DegToRad = (d) => {
    return _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Angle.FromDegrees(d).radians();
};
/**
 * Check a quaternion is valid
 * @param q Input quaternion
 */
function checkQuaternion(q) {
    return Number.isFinite(q.x) && Number.isFinite(q.y) && Number.isFinite(q.z) && Number.isFinite(q.w);
}
// Similar to three.js Quaternion.setFromUnitVectors
const quaternionBetweenVectors = (v1, v2) => {
    const angle = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.GetAngleBetweenVectors(v1, v2, _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Cross(v1, v2));
    const axis = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Cross(v1, v2);
    axis.normalize();
    return _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.RotationAxis(axis, angle);
};
/**
 * Same as above, Euler angle version
 * @param v1 Input rotation in degrees 1
 * @param v2 Input rotation in degrees 2
 * @param remapDegree Whether re-map degrees
 */
const degreeBetweenVectors = (v1, v2, remapDegree = false) => {
    return quaternionToDegrees(quaternionBetweenVectors(v1, v2), remapDegree);
};
/**
 * Re-map degrees to -180 to 180
 * @param deg Input angle in Degrees
 */
const remapDegreeWithCap = (deg) => {
    deg = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.rangeCap)(deg, 0, 360);
    return deg < 180 ? deg : deg - 360;
};
/**
 * Convert quaternions to degrees
 * @param q Input quaternion
 * @param remapDegree whether re-map degrees
 */
const quaternionToDegrees = (q, remapDegree = false) => {
    const angles = q.toEulerAngles();
    const remapFn = remapDegree ? remapDegreeWithCap : (x) => x;
    return new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(remapFn(RadToDeg(angles.x)), remapFn(RadToDeg(angles.y)), remapFn(RadToDeg(angles.z)));
};
/**
 * Check whether two directions are close enough within a small values
 * @param v1 Input direction 1
 * @param v2 Input direction 2
 * @param eps Error threshold
 */
function vectorsSameDirWithinEps(v1, v2, eps = 1e-6) {
    return v1.cross(v2).length() < eps && _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Dot(v1, v2) > 0;
}
/**
 * Test whether two quaternions have equal effects
 * @param q1 Input quaternion 1
 * @param q2 Input quaternion 2
 */
function testQuaternionEqualsByVector(q1, q2) {
    const testVec = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.One();
    const testVec1 = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero();
    const testVec2 = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.One();
    testVec.rotateByQuaternionToRef(q1, testVec1);
    testVec.rotateByQuaternionToRef(q2, testVec2);
    return vectorsSameDirWithinEps(testVec1, testVec2);
}
/**
 * Same as above, Euler angle version
 * @param d1 Input degrees 1
 * @param d2 Input degrees 2
 */
function degreesEqualInQuaternion(d1, d2) {
    const q1 = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.FromEulerAngles(DegToRad(d1.x), DegToRad(d1.y), DegToRad(d1.z));
    const q2 = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.FromEulerAngles(DegToRad(d2.x), DegToRad(d2.y), DegToRad(d2.z));
    return testQuaternionEqualsByVector(q1, q2);
}
/**
 * Reverse rotation Euler angles on given axes
 * @param q Input quaternion
 * @param axis Axes to reverse
 */
const reverseRotation = (q, axis) => {
    if (axis === AXIS.none)
        return q;
    const angles = q.toEulerAngles();
    switch (axis) {
        case AXIS.x:
            angles.x = -angles.x;
            break;
        case AXIS.y:
            angles.y = -angles.y;
            break;
        case AXIS.z:
            angles.z = -angles.z;
            break;
        case AXIS.xy:
            angles.x = -angles.x;
            angles.y = -angles.y;
            break;
        case AXIS.yz:
            angles.y = -angles.y;
            angles.z = -angles.z;
            break;
        case AXIS.xz:
            angles.x = -angles.x;
            angles.z = -angles.z;
            break;
        case AXIS.xyz:
            angles.x = -angles.x;
            angles.y = -angles.y;
            angles.z = -angles.z;
            break;
        default:
            throw Error("Unknown axis!");
    }
    return _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.RotationYawPitchRoll(angles.y, angles.x, angles.z);
};
/**
 * Remove rotation on given axes.
 * Optionally capping rotation (in Euler angles) on two axes.
 * This operation assumes re-mapped degrees.
 * @param q Input quaternion
 * @param axis Axes to remove
 * @param capAxis1 Capping axis 1
 * @param capLow1 Axis 1 lower range
 * @param capHigh1 Axis 1 higher range
 * @param capAxis2 Capping axis 2
 * @param capLow2 Axis 2 lower range
 * @param capHigh2 Axis 2 higher range
 */
const removeRotationAxisWithCap = (q, axis, capAxis1, capLow1, capHigh1, capAxis2, capLow2, capHigh2) => {
    const angles = quaternionToDegrees(q, true);
    switch (axis) {
        case AXIS.none:
            break;
        case AXIS.x:
            angles.x = 0;
            break;
        case AXIS.y:
            angles.y = 0;
            break;
        case AXIS.z:
            angles.z = 0;
            break;
        case AXIS.xy:
            angles.x = 0;
            angles.y = 0;
            break;
        case AXIS.yz:
            angles.y = 0;
            angles.z = 0;
            break;
        case AXIS.xz:
            angles.x = 0;
            angles.z = 0;
            break;
        case AXIS.xyz:
            angles.x = 0;
            angles.y = 0;
            angles.z = 0;
            break;
        default:
            throw Error("Unknown axis!");
    }
    if (capAxis1 !== undefined && capLow1 !== undefined && capHigh1 !== undefined) {
        switch (capAxis1) {
            case AXIS.x:
                angles.x = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.rangeCap)(angles.x, capLow1, capHigh1);
                break;
            case AXIS.y:
                angles.y = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.rangeCap)(angles.y, capLow1, capHigh1);
                break;
            case AXIS.z:
                angles.z = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.rangeCap)(angles.z, capLow1, capHigh1);
                break;
            default:
                throw Error("Unknown cap axis!");
        }
    }
    if (capAxis2 !== undefined && capLow2 !== undefined && capHigh2 !== undefined) {
        switch (capAxis2) {
            case AXIS.x:
                angles.x = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.rangeCap)(angles.x, capLow2, capHigh2);
                break;
            case AXIS.y:
                angles.y = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.rangeCap)(angles.y, capLow2, capHigh2);
                break;
            case AXIS.z:
                angles.z = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.rangeCap)(angles.z, capLow2, capHigh2);
                break;
            default:
                throw Error("Unknown cap axis!");
        }
    }
    return _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.RotationYawPitchRoll(DegToRad(angles.y), DegToRad(angles.x), DegToRad(angles.z));
};
/**
 * Switch rotation axes.
 * @param q Input quaternion
 * @param axis1 Axis 1 to switch
 * @param axis2 Axis 2 to switch
 */
const exchangeRotationAxis = (q, axis1, axis2) => {
    const angles = [];
    q.toEulerAngles().toArray(angles);
    const angle1 = angles[axis1];
    const angle2 = angles[axis2];
    const temp = angle1;
    angles[axis1] = angle2;
    angles[axis2] = temp;
    return _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.FromEulerAngles(angles[0], angles[1], angles[2]);
};
function printQuaternion(q, s) {
    console.log(s, (0,_landmark__WEBPACK_IMPORTED_MODULE_3__.vectorToNormalizedLandmark)(quaternionToDegrees(q, true)));
}
/**
 * Result is in Radian on unit sphere (r = 1).
 * Canonical ISO 80000-2:2019 convention.
 * @param pos Euclidean local position
 * @param basis Local coordinate system basis
 */
function calcSphericalCoord(pos, basis) {
    const qToOriginal = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Inverse(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.RotationQuaternionFromAxis(basis.x.clone(), basis.y.clone(), basis.z.clone())).normalize();
    const posInOriginal = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero();
    pos.rotateByQuaternionToRef(qToOriginal, posInOriginal);
    posInOriginal.normalize();
    // Calculate theta and phi
    const x = posInOriginal.x;
    const y = posInOriginal.y;
    const z = posInOriginal.z;
    const theta = Math.acos(z);
    const phi = Math.atan2(y, x);
    return [theta, phi];
}
/**
 * Assuming rotation starts from (1, 0, 0) in local coordinate system.
 * @param basis Local coordinate system basis
 * @param theta Polar angle
 * @param phi Azimuthal angle
 * @param prevQuaternion Parent quaternion to the local system
 */
function sphericalToQuaternion(basis, theta, phi, prevQuaternion) {
    const xTz = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.RotationAxis(basis.y.clone(), -Math.PI / 2);
    const xTzBasis = basis.rotateByQuaternion(xTz);
    const q1 = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.RotationAxis(xTzBasis.x.clone(), phi);
    const q1Basis = xTzBasis.rotateByQuaternion(q1);
    const q2 = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.RotationAxis(q1Basis.y.clone(), theta);
    const q2Basis = q1Basis.rotateByQuaternion(q2);
    // Force result to face front
    const planeXZ = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Plane.FromPositionAndNormal(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero(), basis.y.clone());
    // const intermBasis = basis.rotateByQuaternion(xTz.multiply(q1).multiplyInPlace(q2));
    const intermBasis = q2Basis;
    const newBasisZ = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Cross(intermBasis.x.clone(), planeXZ.normal);
    const newBasisY = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Cross(newBasisZ, intermBasis.x.clone());
    const newBasis = new _basis__WEBPACK_IMPORTED_MODULE_2__.Basis([intermBasis.x, newBasisY, newBasisZ]);
    return (0,_basis__WEBPACK_IMPORTED_MODULE_2__.quaternionBetweenBases)(basis, newBasis, prevQuaternion);
}
// Scale rotation angles in place
function scaleRotation(quaternion, scale) {
    const angles = quaternion.toEulerAngles();
    angles.scaleInPlace(scale);
    return _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.FromEulerVector(angles);
}


/***/ }),

/***/ "./src/helper/utils.ts":
/*!*****************************!*\
  !*** ./src/helper/utils.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initArray": () => (/* binding */ initArray),
/* harmony export */   "range": () => (/* binding */ range),
/* harmony export */   "linspace": () => (/* binding */ linspace),
/* harmony export */   "objectFlip": () => (/* binding */ objectFlip),
/* harmony export */   "rangeCap": () => (/* binding */ rangeCap),
/* harmony export */   "remapRange": () => (/* binding */ remapRange),
/* harmony export */   "remapRangeWithCap": () => (/* binding */ remapRangeWithCap),
/* harmony export */   "remapRangeNoCap": () => (/* binding */ remapRangeNoCap),
/* harmony export */   "validVector3": () => (/* binding */ validVector3),
/* harmony export */   "setEqual": () => (/* binding */ setEqual),
/* harmony export */   "projectVectorOnPlane": () => (/* binding */ projectVectorOnPlane),
/* harmony export */   "round": () => (/* binding */ round),
/* harmony export */   "fixedLengthQueue": () => (/* binding */ fixedLengthQueue),
/* harmony export */   "findPoint": () => (/* binding */ findPoint),
/* harmony export */   "LR": () => (/* binding */ LR),
/* harmony export */   "CustomLoadingScreen": () => (/* binding */ CustomLoadingScreen),
/* harmony export */   "pointLineDistance": () => (/* binding */ pointLineDistance)
/* harmony export */ });
/* harmony import */ var _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babylonjs/core */ "./node_modules/@babylonjs/core/index.js");
/*
Copyright (C) 2021  The v3d Authors.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, version 3.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

function initArray(length, initializer) {
    let arr = new Array(length);
    for (let i = 0; i < length; i++)
        arr[i] = initializer(i);
    return arr;
}
function range(start, end, step) {
    return Array.from({ length: Math.ceil((end - start) / step) }, (_, i) => start + i * step);
}
function linspace(start, end, div) {
    const step = (end - start) / div;
    return Array.from({ length: div }, (_, i) => start + i * step);
}
function objectFlip(obj) {
    const ret = {};
    Object.keys(obj).forEach((key) => {
        ret[obj[key]] = key;
    });
    return ret;
}
const rangeCap = (v, min, max) => {
    if (min > max) {
        const tmp = max;
        max = min;
        min = tmp;
    }
    return Math.max(Math.min(v, max), min);
};
const remapRange = (v, src_low, src_high, dst_low, dst_high) => {
    return dst_low + (v - src_low) * (dst_high - dst_low) / (src_high - src_low);
};
const remapRangeWithCap = (v, src_low, src_high, dst_low, dst_high) => {
    const v1 = rangeCap(v, src_low, src_high);
    return dst_low + (v1 - src_low) * (dst_high - dst_low) / (src_high - src_low);
};
const remapRangeNoCap = (v, src_low, src_high, dst_low, dst_high) => {
    return dst_low + (v - src_low) * (dst_high - dst_low) / (src_high - src_low);
};
function validVector3(v) {
    return Number.isFinite(v.x) && Number.isFinite(v.y) && Number.isFinite(v.z);
}
// type ReadonlyKeysOfA = ReadonlyKeys<A>;
function setEqual(as, bs) {
    if (as.size !== bs.size)
        return false;
    for (const a of as)
        if (!bs.has(a))
            return false;
    return true;
}
function projectVectorOnPlane(projPlane, vec) {
    return vec.subtract(projPlane.normal.scale(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Dot(vec, projPlane.normal)));
}
function round(value, precision) {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}
/**
 * Simple fixed length FIFO queue.
 */
class fixedLengthQueue {
    constructor(size) {
        this.size = size;
        this._values = [];
    }
    get values() {
        return this._values;
    }
    push(v) {
        this.values.push(v);
        if (this.values.length === this.size + 1) {
            this.values.shift();
        }
        else if (this.values.length > this.size + 1) {
            console.warn(`Internal queue has length longer than size ${this.size}: Got length ${this.values.length}`);
            this._values = this.values.slice(-this.size);
        }
    }
    concat(arr) {
        this._values = this.values.concat(arr);
        if (this.values.length > this.size) {
            this._values = this.values.slice(-this.size);
        }
    }
    pop() {
        return this.values.shift();
    }
    first() {
        if (this._values.length > 0)
            return this.values[0];
        else
            return null;
    }
    last() {
        if (this._values.length > 0)
            return this._values[this._values.length - 1];
        else
            return null;
    }
    reset() {
        this.values.length = 0;
    }
    length() {
        return this.values.length;
    }
}
function findPoint(curve, x, eps = 0.001) {
    const pts = curve.getPoints();
    if (x > pts[0].x)
        return pts[0].y;
    else if (x < pts[pts.length - 1].x)
        return pts[pts.length - 1].y;
    for (let i = 0; i < pts.length; ++i) {
        if (Math.abs(x - pts[i].x) < eps)
            return pts[i].y;
    }
    return 0;
}
const LR = ["left", "right"];
class CustomLoadingScreen {
    constructor(renderingCanvas, loadingDiv) {
        this.renderingCanvas = renderingCanvas;
        this.loadingDiv = loadingDiv;
        //optional, but needed due to interface definitions
        this.loadingUIBackgroundColor = '';
        this.loadingUIText = '';
    }
    displayLoadingUI() {
        if (!this.loadingDiv)
            return;
        if (this.loadingDiv.style.display === 'none') {
            // Do not add a loading screen if there is already one
            this.loadingDiv.style.display = "initial";
        }
        // this._resizeLoadingUI();
        // window.addEventListener("resize", this._resizeLoadingUI);
    }
    hideLoadingUI() {
        if (this.loadingDiv)
            this.loadingDiv.style.display = "none";
    }
}
function pointLineDistance(point, lineEndA, lineEndB) {
    const lineDir = lineEndB.subtract(lineEndA).normalize();
    const pProj = lineEndA.add(lineDir.scale(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Dot(point.subtract(lineEndA), lineDir)
        / _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Dot(lineDir, lineDir)));
    return point.subtract(pProj).length();
}


/***/ }),

/***/ "./src/worker/pose-processing.ts":
/*!***************************************!*\
  !*** ./src/worker/pose-processing.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PoseKeyPoints": () => (/* binding */ PoseKeyPoints),
/* harmony export */   "Poses": () => (/* binding */ Poses),
/* harmony export */   "poseWrapper": () => (/* binding */ poseWrapper),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var comlink__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! comlink */ "./node_modules/comlink/dist/esm/comlink.mjs");
/* harmony import */ var _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @mediapipe/holistic */ "./node_modules/@mediapipe/holistic/holistic.js");
/* harmony import */ var _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babylonjs/core */ "./node_modules/@babylonjs/core/index.js");
/* harmony import */ var _helper_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helper/utils */ "./src/helper/utils.ts");
/* harmony import */ var _helper_landmark__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../helper/landmark */ "./src/helper/landmark.ts");
/* harmony import */ var _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../helper/quaternion */ "./src/helper/quaternion.ts");
/* harmony import */ var _helper_basis__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../helper/basis */ "./src/helper/basis.ts");
/* harmony import */ var _helper_filter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../helper/filter */ "./src/helper/filter.ts");
/*
Copyright (C) 2021  The v3d Authors.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, version 3.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */








class PoseKeyPoints {
    constructor() {
        this.top_face_oval = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.left_face_oval = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.bottom_face_oval = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.right_face_oval = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.left_eye_top = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.left_eye_bottom = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.left_eye_inner = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.left_eye_outer = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.left_eye_inner_secondary = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.left_eye_outer_secondary = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.left_iris_top = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.left_iris_bottom = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.left_iris_left = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.left_iris_right = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.right_eye_top = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.right_eye_bottom = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.right_eye_inner = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.right_eye_outer = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.right_eye_inner_secondary = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.right_eye_outer_secondary = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.right_iris_top = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.right_iris_bottom = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.right_iris_left = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.right_iris_right = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.mouth_top_first = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.mouth_top_second = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.mouth_top_third = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.mouth_bottom_first = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.mouth_bottom_second = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.mouth_bottom_third = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.mouth_left = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
        this.mouth_right = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector();
    }
}
class Poses {
    constructor(boneOptions, boneRotationUpdateFn) {
        this._boneRotationUpdateFn = null;
        // VRMManager
        this.bonesHierarchyTree = null;
        // Results
        this.cloneableInputResults = null;
        // Pose Landmarks
        this.inputPoseLandmarks = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.initArray)(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.POSE_LANDMARK_LENGTH, () => {
            return { x: 0, y: 0, z: 0 };
        });
        this.poseLandmarks = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.initArray)(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.POSE_LANDMARK_LENGTH, () => {
            return new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector({
                R: 0.1,
                Q: 5,
                type: "Kalman",
            });
        });
        this.worldPoseLandmarks = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.initArray)(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.POSE_LANDMARK_LENGTH, () => {
            return new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector({
                // R: 0.1, Q: 0.1, type: 'Kalman',
                R: 0.1,
                Q: 1,
                type: "Kalman",
            }); // 0.01, 0.6, 0.007
        });
        // Cannot use Vector3 directly since postMessage() erases all methods
        this.cloneablePoseLandmarks = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.initArray)(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.POSE_LANDMARK_LENGTH, () => {
            return { x: 0, y: 0, z: 0 };
        });
        // Face Mesh Landmarks
        this.inputFaceLandmarks = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.initArray)(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FACE_LANDMARK_LENGTH, () => {
            return { x: 0, y: 0, z: 0 };
        });
        this.faceLandmarks = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.initArray)(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FACE_LANDMARK_LENGTH, () => {
            return new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector({
                // oneEuroCutoff: 0.01, oneEuroBeta: 15, type: 'OneEuro',
                R: 0.1,
                Q: 1,
                type: "Kalman",
            }); // 0.01, 15, 0.002
        });
        this._faceMeshLandmarkIndexList = [];
        this._faceMeshLandmarkList = [];
        // Left Hand Landmarks
        this.leftWristOffset = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector({
            R: 0.1,
            Q: 2,
            type: "Kalman",
        }); // 0.01, 2, 0.008
        this.inputLeftHandLandmarks = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.initArray)(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARK_LENGTH, () => {
            return { x: 0, y: 0, z: 0 };
        });
        this.leftHandLandmarks = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.initArray)(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARK_LENGTH, () => {
            return new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector({
                R: 1,
                Q: 10,
                type: "Kalman",
            }); // 0.001, 0.6
        });
        this.cloneableLeftHandLandmarks = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.initArray)(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARK_LENGTH, () => {
            return { x: 0, y: 0, z: 0 };
        });
        this.leftHandNormal = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero();
        // Right Hand Landmarks
        this.rightWristOffset = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector({
            R: 0.1,
            Q: 2,
            type: "Kalman",
        }); // 0.01, 2, 0.008
        this.inputRightHandLandmarks = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.initArray)(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARK_LENGTH, () => {
            return { x: 0, y: 0, z: 0 };
        });
        this.rightHandLandmarks = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.initArray)(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARK_LENGTH, () => {
            return new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector({
                R: 1,
                Q: 10,
                type: "Kalman",
            }); // 0.001, 0.6
        });
        this.cloneableRightHandLandmarks = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.initArray)(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARK_LENGTH, () => {
            return { x: 0, y: 0, z: 0 };
        });
        this.rightHandNormal = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero();
        // Feet
        this.leftFootNormal = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero();
        this.rightFootNormal = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero();
        this.leftFootBasisRotation = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity();
        this.rightFootBasisRotation = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity();
        // Key points
        this._keyPoints = new PoseKeyPoints();
        this._blinkBase = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector({
            R: 1,
            Q: 1,
            type: "Kalman",
        });
        this._leftBlinkArr = new _helper_utils__WEBPACK_IMPORTED_MODULE_1__.fixedLengthQueue(10);
        this._rightBlinkArr = new _helper_utils__WEBPACK_IMPORTED_MODULE_1__.fixedLengthQueue(10);
        // Calculated properties
        this._faceNormal = { x: 0, y: 0, z: 0 };
        this._headQuaternion = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.FilteredQuaternion({
            R: 1,
            Q: 50,
            type: "Kalman",
        });
        // TODO: option: lock x rotation
        // A copy for restore bone locations
        this._initBoneRotations = {};
        // Calculated bone rotations
        this._boneRotations = {};
        this.textEncoder = new TextEncoder();
        this._leftHandNormals = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.initArray)(3, () => {
            return { x: 0, y: 0, z: 0 };
        });
        this._rightHandNormals = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.initArray)(3, () => {
            return { x: 0, y: 0, z: 0 };
        });
        this._poseNormals = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.initArray)(3, // Arbitrary length for debugging
        () => {
            return { x: 0, y: 0, z: 0 };
        });
        this.midHipPos = null;
        this.midHipInitOffset = null;
        this.midHipOffset = new _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.FilteredLandmarkVector({
            R: 1,
            Q: 10,
            type: "Kalman",
        });
        this.initBoneRotations(); //provisional
        this._boneOptions = boneOptions;
        if (boneRotationUpdateFn)
            this._boneRotationUpdateFn = boneRotationUpdateFn;
    }
    // Workaround for Promise problem
    updateBoneOptions(value) {
        this._boneOptions = value;
    }
    get faceMeshLandmarkIndexList() {
        return this._faceMeshLandmarkIndexList;
    }
    get faceMeshLandmarkList() {
        return this._faceMeshLandmarkList;
    }
    get keyPoints() {
        return this._keyPoints;
    }
    get faceNormal() {
        return this._faceNormal;
    }
    get leftHandNormals() {
        return this._leftHandNormals;
    }
    get rightHandNormals() {
        return this._rightHandNormals;
    }
    get poseNormals() {
        return this._poseNormals;
    }
    /**
     * One time operation to set bones hierarchy from VRMManager
     * @param tree root node of tree
     */
    setBonesHierarchyTree(tree, forceReplace = false) {
        // Assume bones have unique names
        if (this.bonesHierarchyTree && !forceReplace)
            return;
        this.bonesHierarchyTree = tree;
        // Re-init bone rotations
        this._initBoneRotations = {};
        (0,_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.depthFirstSearch)(this.bonesHierarchyTree, (n) => {
            this._initBoneRotations[n.name] = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity());
            return false;
        });
        this.initBoneRotations();
    }
    /**
     * All MediaPipe inputs have the following conventions:
     *  - Left-right mirrored (selfie mode)
     *  - Face towards -Z (towards camera) by default
     *  TODO: interpolate results to 60 FPS.
     * @param results Result object from MediaPipe Holistic
     */
    process(results) {
        this.cloneableInputResults = results;
        if (!this.cloneableInputResults)
            return;
        if (this._boneOptions.resetInvisible) {
            this.resetBoneRotations();
        }
        this.preProcessResults();
        // Actual processing
        // Post filtered landmarks
        this.toCloneableLandmarks(this.poseLandmarks, this.cloneablePoseLandmarks);
        this.filterFaceLandmarks();
        this.toCloneableLandmarks(this.leftHandLandmarks, this.cloneableLeftHandLandmarks);
        this.toCloneableLandmarks(this.rightHandLandmarks, this.cloneableRightHandLandmarks);
        // Gather key points
        this.getKeyPoints();
        // Bone Orientations Independent
        // Calculate iris orientations
        this.calcIrisNormal();
        // Bone Orientations Dependent
        // Calculate face orientation
        this.calcFaceBones();
        // Calculate expressions
        this.calcExpressions();
        // Calculate full body bones
        this.calcPoseBones();
        // Calculate hand bones
        this.calcHandBones();
        // Post processing
        if (this._boneOptions.irisLockX) {
            this._boneRotations["iris"].set((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.removeRotationAxisWithCap)((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.cloneableQuaternionToQuaternion)(this._boneRotations["iris"]), _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.x));
            this._boneRotations["leftIris"].set((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.removeRotationAxisWithCap)((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.cloneableQuaternionToQuaternion)(this._boneRotations["iris"]), _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.x));
            this._boneRotations["rightIris"].set((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.removeRotationAxisWithCap)((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.cloneableQuaternionToQuaternion)(this._boneRotations["iris"]), _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.x));
        }
        const lockBones = [];
        // Holistic doesn't reset hand landmarks when invisible
        // So we infer invisibility from wrist landmark
        if (this._boneOptions.resetInvisible) {
            if ((this.cloneableInputResults?.poseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.LEFT_WRIST].visibility || 0) < _helper_filter__WEBPACK_IMPORTED_MODULE_5__.VISIBILITY_THRESHOLD) {
                for (const k of Object.keys(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS_BONE_MAPPING)) {
                    const key = `left${k}`;
                    lockBones.push(key);
                }
            }
            if ((this.cloneableInputResults?.poseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.RIGHT_WRIST].visibility || 0) < _helper_filter__WEBPACK_IMPORTED_MODULE_5__.VISIBILITY_THRESHOLD) {
                for (const k of Object.keys(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS_BONE_MAPPING)) {
                    const key = `right${k}`;
                    lockBones.push(key);
                }
            }
        }
        if (this._boneOptions.lockFinger) {
            for (const d of _helper_utils__WEBPACK_IMPORTED_MODULE_1__.LR) {
                for (const k of Object.keys(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS_BONE_MAPPING)) {
                    const key = d + k;
                    lockBones.push(key);
                }
            }
        }
        if (this._boneOptions.lockArm) {
            for (const k of _helper_utils__WEBPACK_IMPORTED_MODULE_1__.LR) {
                lockBones.push(`${k}UpperArm`);
                lockBones.push(`${k}LowerArm`);
            }
        }
        if (this._boneOptions.lockLeg) {
            for (const k of _helper_utils__WEBPACK_IMPORTED_MODULE_1__.LR) {
                lockBones.push(`${k}UpperLeg`);
                lockBones.push(`${k}LowerLeg`);
                lockBones.push(`${k}Foot`);
            }
        }
        this.filterBoneRotations(lockBones);
        // Push to main
        this.pushBoneRotationBuffer();
    }
    resetBoneRotations(sendResult = false) {
        for (const [k, v] of Object.entries(this._initBoneRotations)) {
            this._boneRotations[k].set((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.cloneableQuaternionToQuaternion)(v));
        }
        if (sendResult) {
            this.pushBoneRotationBuffer();
        }
    }
    filterBoneRotations(boneNames) {
        for (const k of boneNames) {
            if (this._boneRotations[k]) {
                this._boneRotations[k].set(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity());
            }
        }
    }
    getKeyPoints() {
        // Get points from face mesh
        this._keyPoints.top_face_oval =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[7][0]];
        this._keyPoints.left_face_oval =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[7][6]];
        this._keyPoints.bottom_face_oval =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[7][18]];
        this._keyPoints.right_face_oval =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[7][30]];
        this._keyPoints.left_eye_inner =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[2][8]];
        this._keyPoints.right_eye_inner =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[3][8]];
        this._keyPoints.left_eye_outer =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[2][0]];
        this._keyPoints.right_eye_outer =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[3][0]];
        this._keyPoints.mouth_left =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[6][10]];
        this._keyPoints.mouth_right =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[6][0]];
        this._keyPoints.mouth_top_first =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[6][24]];
        this._keyPoints.mouth_top_second =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[6][25]];
        this._keyPoints.mouth_top_third =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[6][26]];
        this._keyPoints.mouth_bottom_first =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[6][34]];
        this._keyPoints.mouth_bottom_second =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[6][35]];
        this._keyPoints.mouth_bottom_third =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[6][36]];
        this._keyPoints.left_iris_top =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[4][1]];
        this._keyPoints.left_iris_bottom =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[4][3]];
        this._keyPoints.left_iris_left =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[4][2]];
        this._keyPoints.left_iris_right =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[4][0]];
        this._keyPoints.right_iris_top =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[5][1]];
        this._keyPoints.right_iris_bottom =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[5][3]];
        this._keyPoints.right_iris_left =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[5][2]];
        this._keyPoints.right_iris_right =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[5][0]];
        this._keyPoints.left_eye_top =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[2][12]];
        this._keyPoints.left_eye_bottom =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[2][4]];
        this._keyPoints.left_eye_inner_secondary =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[2][14]];
        this._keyPoints.left_eye_outer_secondary =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[2][10]];
        this._keyPoints.right_eye_top =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[3][12]];
        this._keyPoints.right_eye_bottom =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[3][4]];
        this._keyPoints.right_eye_outer_secondary =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[3][10]];
        this._keyPoints.right_eye_inner_secondary =
            this.faceLandmarks[this.faceMeshLandmarkIndexList[3][14]];
    }
    /*
     * Calculate the face orientation from landmarks.
     * Landmarks from Face Mesh takes precedence.
     */
    calcFaceBones() {
        const axisX = this._keyPoints.left_face_oval.pos
            .subtract(this._keyPoints.right_face_oval.pos)
            .normalize();
        const axisY = this._keyPoints.top_face_oval.pos
            .subtract(this._keyPoints.bottom_face_oval.pos)
            .normalize();
        if (axisX.length() === 0 || axisY.length() === 0)
            return;
        const thisBasis = new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis([
            axisX,
            axisY,
            _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Cross(axisX, axisY),
        ]);
        // Distribute rotation between neck and head
        const headParentQuaternion = this.applyQuaternionChain("head", false);
        const headBasis = this._boneRotations["head"].rotateBasis(headParentQuaternion);
        const quaternion = (0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.reverseRotation)((0,_helper_basis__WEBPACK_IMPORTED_MODULE_4__.quaternionBetweenBases)(thisBasis, headBasis, headParentQuaternion), _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.x);
        this._headQuaternion.updateRotation(quaternion);
        const scaledQuaternion = (0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.scaleRotation)(this._headQuaternion.rot, 0.5);
        this._boneRotations["head"].set(scaledQuaternion);
        this._boneRotations["neck"].set(scaledQuaternion);
    }
    /*
     * Remap positional offsets to rotations.
     * Iris only have positional offsets. Their normals always face front.
     */
    calcIrisNormal() {
        if (!this.cloneableInputResults?.faceLandmarks)
            return;
        const leftIrisCenter = this._keyPoints.left_iris_top.pos
            .add(this._keyPoints.left_iris_bottom.pos)
            .add(this._keyPoints.left_iris_left.pos)
            .add(this._keyPoints.left_iris_right.pos)
            .scale(0.5);
        const rightIrisCenter = this._keyPoints.right_iris_top.pos
            .add(this._keyPoints.right_iris_bottom.pos)
            .add(this._keyPoints.right_iris_left.pos)
            .add(this._keyPoints.right_iris_right.pos)
            .scale(0.5);
        // Calculate eye center
        const leftEyeCenter = this._keyPoints.left_eye_top.pos
            .add(this._keyPoints.left_eye_bottom.pos)
            .add(this._keyPoints.left_eye_inner_secondary.pos)
            .add(this._keyPoints.left_eye_outer_secondary.pos)
            .scale(0.5);
        const rightEyeCenter = this._keyPoints.right_eye_top.pos
            .add(this._keyPoints.right_eye_bottom.pos)
            .add(this._keyPoints.right_eye_outer_secondary.pos)
            .add(this._keyPoints.right_eye_inner_secondary.pos)
            .scale(0.5);
        // Calculate offsets
        const leftEyeWidth = this._keyPoints.left_eye_inner.pos
            .subtract(this._keyPoints.left_eye_outer.pos)
            .length();
        const rightEyeWidth = this._keyPoints.right_eye_inner.pos
            .subtract(this._keyPoints.right_eye_outer.pos)
            .length();
        const leftIrisOffset = leftIrisCenter
            .subtract(leftEyeCenter)
            .scale(Poses.EYE_WIDTH_BASELINE / leftEyeWidth);
        const rightIrisOffset = rightIrisCenter
            .subtract(rightEyeCenter)
            .scale(Poses.EYE_WIDTH_BASELINE / rightEyeWidth);
        // Remap offsets to quaternions
        const leftIrisRotationYPR = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.RotationYawPitchRoll((0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.remapRangeWithCap)(leftIrisOffset.x, -Poses.IRIS_MP_X_RANGE, Poses.IRIS_MP_X_RANGE, -Poses.IRIS_BJS_X_RANGE, Poses.IRIS_BJS_X_RANGE), (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.remapRangeWithCap)(leftIrisOffset.y, -Poses.IRIS_MP_Y_RANGE, Poses.IRIS_MP_Y_RANGE, -Poses.IRIS_BJS_Y_RANGE, Poses.IRIS_BJS_Y_RANGE), 0);
        const rightIrisRotationYPR = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.RotationYawPitchRoll((0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.remapRangeWithCap)(rightIrisOffset.x, -Poses.IRIS_MP_X_RANGE, Poses.IRIS_MP_X_RANGE, -Poses.IRIS_BJS_X_RANGE, Poses.IRIS_BJS_X_RANGE), (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.remapRangeWithCap)(rightIrisOffset.y, -Poses.IRIS_MP_Y_RANGE, Poses.IRIS_MP_Y_RANGE, -Poses.IRIS_BJS_Y_RANGE, Poses.IRIS_BJS_Y_RANGE), 0);
        this._boneRotations["leftIris"].set(leftIrisRotationYPR);
        this._boneRotations["rightIris"].set(rightIrisRotationYPR);
        this._boneRotations["iris"].set(this.lRLinkQuaternion(leftIrisRotationYPR, rightIrisRotationYPR));
    }
    calcExpressions() {
        if (!this.cloneableInputResults?.faceLandmarks)
            return;
        const leftTopToMiddle = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.pointLineDistance)(this._keyPoints.left_eye_top.pos, this._keyPoints.left_eye_inner.pos, this._keyPoints.left_eye_outer.pos);
        const leftTopToBottom = this._keyPoints.left_eye_top.pos
            .subtract(this._keyPoints.left_eye_bottom.pos)
            .length();
        const rightTopToMiddle = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.pointLineDistance)(this._keyPoints.right_eye_top.pos, this._keyPoints.right_eye_inner.pos, this._keyPoints.right_eye_outer.pos);
        const rightTopToBottom = this._keyPoints.right_eye_top.pos
            .subtract(this._keyPoints.right_eye_bottom.pos)
            .length();
        this._blinkBase.updatePosition(new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(Math.log(leftTopToMiddle / leftTopToBottom + 1), Math.log(rightTopToMiddle / rightTopToBottom + 1), 0));
        let leftRangeOffset = 0;
        if (this._leftBlinkArr.length() > 4) {
            leftRangeOffset =
                this._leftBlinkArr.values.reduce((p, c, i) => p + (c - p) / (i + 1), 0) - Poses.BLINK_RATIO_LOW;
        }
        const leftBlink = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.remapRangeNoCap)(this._blinkBase.pos.x, Poses.BLINK_RATIO_LOW + leftRangeOffset, Poses.BLINK_RATIO_HIGH + leftRangeOffset, 0, 1);
        this._leftBlinkArr.push(this._blinkBase.pos.x);
        let rightRangeOffset = 0;
        if (this._rightBlinkArr.length() > 4) {
            rightRangeOffset =
                this._rightBlinkArr.values.reduce((p, c, i) => p + (c - p) / (i + 1), 0) - Poses.BLINK_RATIO_LOW;
        }
        const rightBlink = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.remapRangeNoCap)(this._blinkBase.pos.y, Poses.BLINK_RATIO_LOW + rightRangeOffset, Poses.BLINK_RATIO_HIGH + rightRangeOffset, 0, 1);
        this._rightBlinkArr.push(this._blinkBase.pos.y);
        const blink = this.lRLink(leftBlink, rightBlink);
        this._boneRotations["blink"].set(new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion(leftBlink, rightBlink, blink, 0));
        const mouthWidth = this._keyPoints.mouth_left.pos
            .subtract(this._keyPoints.mouth_right.pos)
            .length();
        const mouthRange1 = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.remapRangeWithCap)((this._keyPoints.mouth_top_first.pos
            .subtract(this._keyPoints.mouth_bottom_first.pos)
            .length() *
            Poses.MOUTH_WIDTH_BASELINE) /
            mouthWidth, Poses.MOUTH_MP_RANGE_LOW, Poses.MOUTH_MP_RANGE_HIGH, 0, 1);
        const mouthRange2 = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.remapRangeWithCap)((this._keyPoints.mouth_top_second.pos
            .subtract(this._keyPoints.mouth_bottom_second.pos)
            .length() *
            Poses.MOUTH_WIDTH_BASELINE) /
            mouthWidth, Poses.MOUTH_MP_RANGE_LOW, Poses.MOUTH_MP_RANGE_HIGH, 0, 1);
        const mouthRange3 = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.remapRangeWithCap)((this._keyPoints.mouth_top_third.pos
            .subtract(this._keyPoints.mouth_bottom_third.pos)
            .length() *
            Poses.MOUTH_WIDTH_BASELINE) /
            mouthWidth, Poses.MOUTH_MP_RANGE_LOW, Poses.MOUTH_MP_RANGE_HIGH, 0, 1);
        this._boneRotations["mouth"].set(new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion((mouthRange1 + mouthRange2 + mouthRange3) / 3, 0, 0, 0));
    }
    calcPoseBones() {
        // Do not calculate pose if no visible face. It can lead to wierd poses.
        if (!this.cloneableInputResults?.poseLandmarks)
            return;
        // Use hips as the starting point. Rotation of hips is always on XZ plane.
        // Upper chest is not used.
        // TODO derive neck and chest from spine and head.
        const leftHip = this.worldPoseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.LEFT_HIP].pos;
        const rightHip = this.worldPoseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.RIGHT_HIP].pos;
        const leftShoulder = this.worldPoseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.LEFT_SHOULDER].pos;
        const rightShoulder = this.worldPoseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.RIGHT_SHOULDER].pos;
        this.poseNormals.length = 0;
        // Hips
        const worldXZPlane = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Plane.FromPositionAndNormal(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero(), new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 1, 0));
        const hipLine = leftHip.subtract(rightHip);
        const hipLineProj = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.projectVectorOnPlane)(worldXZPlane, hipLine);
        const hipRotationAngle = Math.atan2(hipLineProj.z, hipLineProj.x);
        this._boneRotations["hips"].set(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.FromEulerAngles(0, hipRotationAngle, 0));
        // Chest/Shoulder
        const shoulderNormR = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Plane.FromPoints(rightShoulder, leftShoulder, rightHip).normal;
        const shoulderNormL = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Plane.FromPoints(rightShoulder, leftShoulder, leftHip).normal;
        const shoulderNormal = shoulderNormL.add(shoulderNormR).normalize();
        // Spine
        if (shoulderNormal.length() > 0.1) {
            const spineParentQuaternion = this.applyQuaternionChain("spine", false);
            const spineBasis = this._boneRotations["spine"].rotateBasis(spineParentQuaternion);
            const newSpineBasisY = rightShoulder
                .subtract(leftShoulder)
                .normalize();
            const newSpineBasis = new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis([
                shoulderNormal,
                newSpineBasisY,
                _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Cross(shoulderNormal, newSpineBasisY),
            ]);
            this._boneRotations["spine"].set((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.reverseRotation)((0,_helper_basis__WEBPACK_IMPORTED_MODULE_4__.quaternionBetweenBases)(spineBasis, newSpineBasis, spineParentQuaternion), _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.yz));
        }
        this.calcWristBones();
        // Arms
        let theta = 0, phi = 0;
        for (const k of _helper_utils__WEBPACK_IMPORTED_MODULE_1__.LR) {
            const isLeft = k === "left";
            if (!this.shallUpdateArm(isLeft))
                continue;
            const upperArmKey = `${k}UpperArm`;
            const shoulderLandmark = this.worldPoseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS[`${k.toUpperCase()}_SHOULDER`]].pos;
            const elbowLandmark = this.worldPoseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS[`${k.toUpperCase()}_ELBOW`]].pos;
            const wristLandmark = this.worldPoseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS[`${k.toUpperCase()}_WRIST`]].pos;
            const upperArmDir = elbowLandmark
                .subtract(shoulderLandmark)
                .normalize();
            const upperArmParentQuaternion = this.applyQuaternionChain(upperArmKey, false);
            const upperArmBasis = this._boneRotations[upperArmKey].rotateBasis(upperArmParentQuaternion);
            [theta, phi] = (0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.calcSphericalCoord)(upperArmDir, upperArmBasis);
            this._boneRotations[upperArmKey].set((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.reverseRotation)((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.sphericalToQuaternion)(upperArmBasis, theta, phi, upperArmParentQuaternion), _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.yz));
            // Rotate lower arms around X axis together with hands.
            // This is a combination of spherical coordinates rotation and rotation between bases.
            const handNormal = isLeft
                ? this.leftHandNormal
                : this.rightHandNormal;
            const lowerArmKey = `${k}LowerArm`;
            const lowerArmDir = wristLandmark
                .subtract(elbowLandmark)
                .normalize();
            const lowerArmPrevQuaternion = this.applyQuaternionChain(lowerArmKey, false);
            const lowerArmBasis = this._boneRotations[lowerArmKey].rotateBasis(lowerArmPrevQuaternion);
            [theta, phi] = (0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.calcSphericalCoord)(lowerArmDir, lowerArmBasis);
            const handNormalsKey = `${k}HandNormals`;
            const handNormals = this[handNormalsKey];
            handNormals.length = 0;
            const firstQuaternion = (0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.reverseRotation)((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.sphericalToQuaternion)(lowerArmBasis, theta, phi, lowerArmPrevQuaternion), _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.yz);
            const finalQuaternion = this.applyXRotationWithChild(lowerArmKey, lowerArmPrevQuaternion, firstQuaternion, handNormal, lowerArmBasis);
            this._boneRotations[lowerArmKey].set(finalQuaternion);
        }
        // Update rotations on wrists
        this.calcWristBones(false);
        // Legs and feet
        for (const k of _helper_utils__WEBPACK_IMPORTED_MODULE_1__.LR) {
            const isLeft = k === "left";
            if (!this.shallUpdateLegs(isLeft))
                continue;
            const thisLandmarks = isLeft
                ? _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS_LEFT
                : _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS_RIGHT;
            const upperLegKey = `${k}UpperLeg`;
            const lowerLegKey = `${k}LowerLeg`;
            const hipLandmark = this.worldPoseLandmarks[thisLandmarks[`${k.toUpperCase()}_HIP`]].pos;
            const kneeLandmark = this.worldPoseLandmarks[thisLandmarks[`${k.toUpperCase()}_KNEE`]].pos;
            const ankleLandmark = this.worldPoseLandmarks[thisLandmarks[`${k.toUpperCase()}_ANKLE`]].pos;
            const upperLegDir = kneeLandmark.subtract(hipLandmark).normalize();
            const upperLegParentQuaternion = this.applyQuaternionChain(upperLegKey, false);
            const upperLegBasis = this._boneRotations[upperLegKey].rotateBasis(upperLegParentQuaternion);
            [theta, phi] = (0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.calcSphericalCoord)(upperLegDir, upperLegBasis);
            this._boneRotations[upperLegKey].set((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.reverseRotation)((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.sphericalToQuaternion)(upperLegBasis, theta, phi, upperLegParentQuaternion), _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.yz));
            const lowerLegDir = ankleLandmark
                .subtract(kneeLandmark)
                .normalize();
            const lowerLegPrevQuaternion = this.applyQuaternionChain(lowerLegKey, false);
            const lowerLegBasis = this._boneRotations[lowerLegKey].rotateBasis(lowerLegPrevQuaternion);
            [theta, phi] = (0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.calcSphericalCoord)(lowerLegDir, lowerLegBasis);
            const firstQuaternion = (0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.reverseRotation)((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.sphericalToQuaternion)(lowerLegBasis, theta, phi, lowerLegPrevQuaternion), _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.yz);
            this._boneRotations[lowerLegKey].set(firstQuaternion);
        }
        this.calcFeetBones(false);
    }
    /**
     * thisKey: key in _boneRotations
     * prevQuaternion: Parent cumulated rotation quaternion
     * firstQuaternion: Rotation quaternion calculated without applying X rotation
     * normal: A normal pointing to local -y
     * thisBasis: basis on this node after prevQuaternion is applied
     */
    applyXRotationWithChild(thisKey, prevQuaternion, firstQuaternion, normal, thisBasis) {
        const thisRotatedBasis = this._boneRotations[thisKey].rotateBasis(prevQuaternion.multiply((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.reverseRotation)(firstQuaternion, _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.yz)));
        const thisYZPlane = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Plane.FromPositionAndNormal(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero(), thisRotatedBasis.x.clone());
        const projectedNormal = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero();
        (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.projectVectorOnPlane)(thisYZPlane, normal).rotateByQuaternionToRef(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Inverse(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.RotationQuaternionFromAxis(thisRotatedBasis.x.clone(), thisRotatedBasis.y.clone(), thisRotatedBasis.z.clone())), projectedNormal);
        const projectedPrevZ = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero();
        (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.projectVectorOnPlane)(thisYZPlane, thisRotatedBasis.z.negate()).rotateByQuaternionToRef(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Inverse(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.RotationQuaternionFromAxis(thisRotatedBasis.x.clone(), thisRotatedBasis.y.clone(), thisRotatedBasis.z.clone())), projectedPrevZ);
        projectedPrevZ.normalize();
        let xPrev = Math.atan2(projectedPrevZ.y, -projectedPrevZ.z);
        let xAngle = Math.atan2(projectedNormal.y, -projectedNormal.z);
        if (xAngle > 0)
            xAngle -= Math.PI * 2;
        if (xAngle < -Math.PI * 1.25)
            xAngle = xPrev;
        // if (isLeg) {
        //     if (Math.abs(xAngle) > Math.PI * 0.2778 && Math.abs(xAngle) < Math.PI / 2) {
        //         xAngle -= Math.PI * 0.2778;
        //     } else {
        //         xAngle = xPrev;
        //     }
        // }
        const thisXRotatedBasis = thisRotatedBasis.rotateByQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.RotationAxis(thisRotatedBasis.x.clone(), (xAngle - xPrev) * 0.5));
        // The quaternion needs to be calculated in local coordinate system
        const secondQuaternion = (0,_helper_basis__WEBPACK_IMPORTED_MODULE_4__.quaternionBetweenBases)(thisBasis, thisXRotatedBasis, prevQuaternion);
        const finalQuaternion = (0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.reverseRotation)(secondQuaternion, _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.yz);
        return finalQuaternion;
    }
    calcWristBones(firstPass = true) {
        const hands = {
            left: this.leftHandLandmarks,
            right: this.rightHandLandmarks,
        };
        for (const [k, v] of Object.entries(hands)) {
            const isLeft = k === "left";
            const wristVisilibity = this.cloneableInputResults?.poseLandmarks[isLeft
                ? _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.LEFT_WRIST
                : _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.RIGHT_WRIST].visibility || 0;
            if (wristVisilibity <= _helper_filter__WEBPACK_IMPORTED_MODULE_5__.VISIBILITY_THRESHOLD)
                continue;
            const vertices = [
                [
                    v[_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.WRIST],
                    v[_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.PINKY_MCP],
                    v[_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.INDEX_FINGER_MCP],
                ],
                [
                    v[_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.WRIST],
                    v[_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.RING_FINGER_MCP],
                    v[_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.INDEX_FINGER_MCP],
                ],
                [
                    v[_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.WRIST],
                    v[_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.PINKY_MCP],
                    v[_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.MIDDLE_FINGER_MCP],
                ],
            ];
            // Root normal
            const handNormal = isLeft
                ? this.leftHandNormal
                : this.rightHandNormal;
            const rootNormal = vertices
                .reduce((prev, curr) => {
                const _normal = Poses.normalFromVertices(curr, isLeft);
                // handNormals.push(vectorToNormalizedLandmark(_normal));
                return prev.add(_normal);
            }, _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero())
                .normalize();
            handNormal.copyFrom(rootNormal);
            // handNormals.push(vectorToNormalizedLandmark(rootNormal));
            const thisWristRotation = this._boneRotations[(0,_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.handLandMarkToBoneName)(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.WRIST, isLeft)];
            const basis1 = thisWristRotation.baseBasis;
            // Project palm landmarks to average plane
            const projectedLandmarks = (0,_helper_basis__WEBPACK_IMPORTED_MODULE_4__.calcAvgPlane)([
                v[_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.WRIST].pos,
                v[_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.INDEX_FINGER_MCP].pos,
                v[_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.MIDDLE_FINGER_MCP].pos,
                v[_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.RING_FINGER_MCP].pos,
                v[_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.PINKY_MCP].pos,
            ], rootNormal);
            const basis2 = (0,_helper_basis__WEBPACK_IMPORTED_MODULE_4__.getBasis)([
                projectedLandmarks[0],
                projectedLandmarks[1],
                projectedLandmarks[4],
            ]).rotateByQuaternion(this.applyQuaternionChain(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.WRIST, isLeft).conjugate());
            const wristRotationQuaternionRaw = (0,_helper_basis__WEBPACK_IMPORTED_MODULE_4__.quaternionBetweenBases)(basis1, basis2);
            const wristRotationQuaternion = (0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.reverseRotation)(wristRotationQuaternionRaw, _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.yz);
            if (!firstPass)
                thisWristRotation.set(wristRotationQuaternion);
        }
    }
    calcHandBones() {
        // Right hand shall have local x reversed?
        const hands = {
            left: this.leftHandLandmarks,
            right: this.rightHandLandmarks,
        };
        for (const [k, v] of Object.entries(hands)) {
            const isLeft = k === "left";
            for (let i = 1; i < _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARK_LENGTH; ++i) {
                if (i % 4 === 0)
                    continue;
                const thisHandRotation = this._boneRotations[(0,_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.handLandMarkToBoneName)(i, isLeft)];
                const thisLandmark = v[i].pos.clone();
                const nextLandmark = v[i + 1].pos.clone();
                let thisDir = nextLandmark.subtract(thisLandmark).normalize();
                const prevQuaternion = this.applyQuaternionChain(i, isLeft);
                const thisBasis = thisHandRotation.rotateBasis(prevQuaternion);
                // Project landmark to XZ plane for second and third segments
                if (i % 4 === 2 || i % 4 === 3) {
                    const projPlane = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Plane.FromPositionAndNormal(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero(), thisBasis.y.clone());
                    thisDir = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.projectVectorOnPlane)(projPlane, thisDir);
                }
                let [theta, phi] = (0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.calcSphericalCoord)(thisDir, thisBasis);
                // Need to use original Basis, because the quaternion from
                // RotationAxis inherently uses local coordinate system.
                let thisRotationQuaternion;
                const lrCoeff = isLeft ? -1 : 1;
                // Thumb rotations are y main. Others are z main.
                const removeAxis = i % 4 === 1
                    ? i < 4
                        ? _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.none
                        : _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.x
                    : i < 4
                        ? _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.xz
                        : _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.xy;
                const firstCapAxis = i < 4 ? _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.z : _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.y;
                const secondCapAxis = i < 4 ? _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.y : _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.z;
                const secondCap = i < 2 ? 15 : 110;
                thisRotationQuaternion = (0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.removeRotationAxisWithCap)((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.sphericalToQuaternion)(thisBasis, theta, phi, prevQuaternion), removeAxis, firstCapAxis, -15, 15, secondCapAxis, lrCoeff * -15, lrCoeff * secondCap);
                thisRotationQuaternion = (0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.reverseRotation)(thisRotationQuaternion, _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.yz);
                thisHandRotation.set(thisRotationQuaternion);
            }
        }
    }
    calcFeetBones(firstPass = true) {
        for (const k of _helper_utils__WEBPACK_IMPORTED_MODULE_1__.LR) {
            const isLeft = k === "left";
            if (!this.shallUpdateLegs(isLeft))
                continue;
            const landmarkBasis = isLeft
                ? (0,_helper_basis__WEBPACK_IMPORTED_MODULE_4__.getBasis)([
                    this.worldPoseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS_LEFT.LEFT_HEEL]
                        .pos,
                    this.worldPoseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS_LEFT.LEFT_FOOT_INDEX].pos,
                    this.worldPoseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS_LEFT.LEFT_ANKLE]
                        .pos,
                ])
                : (0,_helper_basis__WEBPACK_IMPORTED_MODULE_4__.getBasis)([
                    this.worldPoseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS_RIGHT.RIGHT_HEEL]
                        .pos,
                    this.worldPoseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS_RIGHT.RIGHT_FOOT_INDEX].pos,
                    this.worldPoseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS_RIGHT.RIGHT_ANKLE]
                        .pos,
                ]);
            const footBoneKey = `${k}Foot`;
            const thisBasis = landmarkBasis
                .negateAxes(_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.yz)
                .transpose([1, 2, 0]);
            thisBasis.verifyBasis();
            // Root normal
            const footNormal = isLeft
                ? this.leftFootNormal
                : this.rightFootNormal;
            footNormal.copyFrom(thisBasis.z.negate());
            const thisFootRotation = this._boneRotations[footBoneKey];
            const basis1 = thisFootRotation.baseBasis;
            const basis2 = thisBasis.rotateByQuaternion(this.applyQuaternionChain(footBoneKey, isLeft).conjugate());
            const footRotationQuaternionRaw = (0,_helper_basis__WEBPACK_IMPORTED_MODULE_4__.quaternionBetweenBases)(basis1, basis2);
            const footRotationQuaternion = (0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.reverseRotation)(footRotationQuaternionRaw, _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.yz);
            if (!firstPass)
                thisFootRotation.set(footRotationQuaternion);
        }
    }
    preProcessResults() {
        // Preprocessing results
        // Create pose landmark list
        // @ts-ignore
        const inputWorldPoseLandmarks = 
        //* TODO: Patched.
        //* https://stackoverflow.com/questions/18083389/ignore-typescript-errors-property-does-not-exist-on-value-of-type
        // this.cloneableInputResults?.ea; // Seems to be the new pose_world_landmark
        this.cloneableInputResults?.ea; // Seems to be the new pose_world_landmark
        const inputPoseLandmarks = this.cloneableInputResults?.poseLandmarks; // Seems to be the new pose_world_landmark
        if (inputWorldPoseLandmarks && inputPoseLandmarks) {
            if (inputWorldPoseLandmarks.length !== _helper_landmark__WEBPACK_IMPORTED_MODULE_2__.POSE_LANDMARK_LENGTH)
                console.warn(`Pose Landmark list has a length less than ${_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.POSE_LANDMARK_LENGTH}!`);
            this.inputPoseLandmarks = this.preProcessLandmarks(inputWorldPoseLandmarks, this.worldPoseLandmarks);
            this.preProcessLandmarks(inputPoseLandmarks, this.poseLandmarks);
            // Positional offset
            if ((inputWorldPoseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.LEFT_HIP].visibility ||
                0) > _helper_filter__WEBPACK_IMPORTED_MODULE_5__.VISIBILITY_THRESHOLD &&
                (inputWorldPoseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.RIGHT_HIP].visibility ||
                    0) > _helper_filter__WEBPACK_IMPORTED_MODULE_5__.VISIBILITY_THRESHOLD) {
                const midHipPos = (0,_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.vectorToNormalizedLandmark)(this.poseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.LEFT_HIP].pos
                    .add(this.poseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.RIGHT_HIP].pos)
                    .scaleInPlace(0.5));
                midHipPos.z = 0; // No depth info
                if (!this.midHipInitOffset) {
                    this.midHipInitOffset = midHipPos;
                    Object.freeze(this.midHipInitOffset);
                }
                this.midHipOffset.updatePosition(new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(midHipPos.x - this.midHipInitOffset.x, midHipPos.y - this.midHipInitOffset.y, midHipPos.z - this.midHipInitOffset.z));
                // TODO: delta_x instead of x
                this.midHipPos = (0,_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.vectorToNormalizedLandmark)(this.midHipOffset.pos);
            }
        }
        const inputFaceLandmarks = this.cloneableInputResults?.faceLandmarks; // Seems to be the new pose_world_landmark
        if (inputFaceLandmarks) {
            this.inputFaceLandmarks = this.preProcessLandmarks(inputFaceLandmarks, this.faceLandmarks);
        }
        // TODO: update wrist offset only when debugging
        const inputLeftHandLandmarks = this.cloneableInputResults?.leftHandLandmarks;
        const inputRightHandLandmarks = this.cloneableInputResults?.rightHandLandmarks;
        if (inputLeftHandLandmarks) {
            this.leftWristOffset.updatePosition(this.worldPoseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.LEFT_WRIST].pos.subtract((0,_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.normalizedLandmarkToVector)(inputLeftHandLandmarks[_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.WRIST], Poses.HAND_POSITION_SCALING, true)));
            this.inputLeftHandLandmarks = this.preProcessLandmarks(inputLeftHandLandmarks, this.leftHandLandmarks, this.leftWristOffset.pos, Poses.HAND_POSITION_SCALING);
        }
        if (inputRightHandLandmarks) {
            this.rightWristOffset.updatePosition(this.worldPoseLandmarks[_mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.RIGHT_WRIST].pos.subtract((0,_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.normalizedLandmarkToVector)(inputRightHandLandmarks[_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.WRIST], Poses.HAND_POSITION_SCALING, true)));
            this.inputRightHandLandmarks = this.preProcessLandmarks(inputRightHandLandmarks, this.rightHandLandmarks, this.rightWristOffset.pos, Poses.HAND_POSITION_SCALING);
        }
    }
    preProcessLandmarks(resultsLandmarks, filteredLandmarks, offset = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Zero(), scaling = 1) {
        // Reverse Y-axis. Input results use canvas coordinate system.
        resultsLandmarks.map((v) => {
            v.x = v.x * scaling + offset.x;
            v.y = -v.y * scaling + offset.y;
            v.z = v.z * scaling + offset.z;
        });
        // Noise filtering
        for (let i = 0; i < resultsLandmarks.length; ++i) {
            filteredLandmarks[i].updatePosition((0,_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.normalizedLandmarkToVector)(resultsLandmarks[i]), resultsLandmarks[i].visibility);
        }
        return resultsLandmarks;
    }
    toCloneableLandmarks(landmarks, cloneableLandmarks) {
        cloneableLandmarks.forEach((v, idx) => {
            v.x = landmarks[idx].pos.x;
            v.y = landmarks[idx].pos.y;
            v.z = landmarks[idx].pos.z;
            v.visibility = landmarks[idx].visibility;
        });
    }
    filterFaceLandmarks() {
        // Unpack face mesh landmarks
        this._faceMeshLandmarkIndexList.length = 0;
        this._faceMeshLandmarkList.length = 0;
        for (let i = 0; i < Poses.FACE_MESH_CONNECTIONS.length; ++i) {
            const arr = [];
            const idx = new Set();
            Poses.FACE_MESH_CONNECTIONS[i].forEach((v) => {
                idx.add(v[0]);
                idx.add(v[1]);
            });
            const idxArr = Array.from(idx);
            this._faceMeshLandmarkIndexList.push(idxArr);
            for (let j = 0; j < idxArr.length; j++) {
                arr.push({
                    x: this.faceLandmarks[idxArr[j]].pos.x,
                    y: this.faceLandmarks[idxArr[j]].pos.y,
                    z: this.faceLandmarks[idxArr[j]].pos.x,
                    visibility: this.faceLandmarks[idxArr[j]].visibility,
                });
            }
            this._faceMeshLandmarkList.push(arr);
        }
    }
    lRLinkWeights() {
        const faceCameraAngle = (0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.degreeBetweenVectors)((0,_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.normalizedLandmarkToVector)(this.faceNormal), new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, -1), true);
        const weightLeft = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.remapRangeWithCap)(faceCameraAngle.y, Poses.LR_FACE_DIRECTION_RANGE, -Poses.LR_FACE_DIRECTION_RANGE, 0, 1);
        const weightRight = (0,_helper_utils__WEBPACK_IMPORTED_MODULE_1__.remapRangeWithCap)(faceCameraAngle.y, -Poses.LR_FACE_DIRECTION_RANGE, Poses.LR_FACE_DIRECTION_RANGE, 0, 1);
        return { weightLeft, weightRight };
    }
    lRLink(l, r) {
        const { weightLeft, weightRight } = this.lRLinkWeights();
        return weightLeft * l + weightRight * r;
    }
    lRLinkVector(l, r) {
        const { weightLeft, weightRight } = this.lRLinkWeights();
        return l.scale(weightLeft).addInPlace(r.scale(weightRight));
    }
    lRLinkQuaternion(l, r) {
        const { weightLeft, weightRight } = this.lRLinkWeights();
        return l.scale(weightLeft).addInPlace(r.scale(weightRight));
    }
    initHandBoneRotations(isLeft) {
        // TODO: adjust bases
        // Wrist's basis is used for calculating quaternion between two Cartesian coordinate systems directly
        // All others' are used for rotating planes of a Spherical coordinate system at the node
        this._initBoneRotations[(0,_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.handLandMarkToBoneName)(_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.HAND_LANDMARKS.WRIST, isLeft)] = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), isLeft
            ? (0,_helper_basis__WEBPACK_IMPORTED_MODULE_4__.getBasis)([
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, 0),
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(isLeft ? 1 : -1, 0, 0),
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(isLeft ? 1 : -1, 0, 1),
            ])
            : new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis([
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(-0.9327159079568041, 0.12282522615654383, -0.3390501421086685).normalize(),
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(-0.010002212677077182, 0.0024727643453822945, 0.028411551927747327).normalize(),
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0.14320801411112857, 0.9890497926949048, -0.03566472016590984).normalize(),
            ]));
        // Thumb
        // THUMB_CMC
        // THUMB_MCP
        // THUMB_IP
        for (let i = 1; i < 4; ++i) {
            const tMCP_X = new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(isLeft ? 1 : -1, 0, -1.5).normalize();
            const tMCP_Y = new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, isLeft ? -1 : 1, 0);
            const tMCP_Z = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3.Cross(tMCP_X, tMCP_Y).normalize();
            const basis = new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis([
                tMCP_X,
                // new Vector3(0, 0, isLeft ? -1 : 1),
                tMCP_Y,
                tMCP_Z,
            ]).rotateByQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.FromEulerAngles(0, 0, isLeft ? 0.2 : -0.2));
            this._initBoneRotations[(0,_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.handLandMarkToBoneName)(i, isLeft)] =
                new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), basis);
        }
        // Index
        for (let i = 5; i < 8; ++i) {
            this._initBoneRotations[(0,_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.handLandMarkToBoneName)(i, isLeft)] =
                new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis([
                    new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(isLeft ? 1 : -1, 0, 0),
                    new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, isLeft ? -1 : 1),
                    new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 1, 0),
                ]));
        }
        // Middle
        for (let i = 9; i < 12; ++i) {
            this._initBoneRotations[(0,_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.handLandMarkToBoneName)(i, isLeft)] =
                new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis([
                    new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(isLeft ? 1 : -1, 0, 0),
                    new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, isLeft ? -1 : 1),
                    new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 1, 0),
                ]));
        }
        // Ring
        for (let i = 13; i < 16; ++i) {
            this._initBoneRotations[(0,_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.handLandMarkToBoneName)(i, isLeft)] =
                new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis([
                    new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(isLeft ? 1 : -1, 0, 0),
                    new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, isLeft ? -1 : 1),
                    new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 1, 0),
                ]));
        }
        // Pinky
        for (let i = 17; i < 20; ++i) {
            this._initBoneRotations[(0,_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.handLandMarkToBoneName)(i, isLeft)] =
                new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis([
                    new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(isLeft ? 1 : -1, 0, 0),
                    new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, isLeft ? -1 : 1),
                    new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 1, 0),
                ]));
        }
    }
    initBoneRotations() {
        // Hand bones
        this.initHandBoneRotations(true);
        this.initHandBoneRotations(false);
        // Pose bones
        this._initBoneRotations["head"] = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis(null));
        this._initBoneRotations["neck"] = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis(null));
        this._initBoneRotations["hips"] = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis([
            new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, -1),
            new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(-1, 0, 0),
            new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 1, 0),
        ]));
        this._initBoneRotations["spine"] = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis([
            new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, -1),
            new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(-1, 0, 0),
            new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 1, 0),
        ]));
        const lr = ["left", "right"];
        // Arms
        for (const k of lr) {
            const isLeft = k === "left";
            this._initBoneRotations[`${k}UpperArm`] = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.FromEulerAngles(0, 0, isLeft ? 1.0472 : -1.0472), new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis([
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(isLeft ? 1 : -1, 0, 0),
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, isLeft ? -1 : 1),
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 1, 0),
            ]));
            this._initBoneRotations[`${k}LowerArm`] = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis([
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(isLeft ? 1 : -1, 0, 0),
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, isLeft ? -1 : 1),
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 1, 0),
            ]));
        }
        // Legs
        for (const k of lr) {
            const isLeft = k === "left";
            this._initBoneRotations[`${k}UpperLeg`] = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis([
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, -1, 0),
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(-1, 0, 0),
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, -1),
            ]).rotateByQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.FromEulerAngles(0, 0, isLeft ? -0.05236 : 0.05236)));
            this._initBoneRotations[`${k}LowerLeg`] = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis([
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, -1, 0),
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(-1, 0, 0),
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, -1),
            ]).rotateByQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.FromEulerAngles(0, 0, isLeft ? -0.0873 : 0.0873)));
        }
        // Feet
        for (const k of lr) {
            const isLeft = k === "left";
            const startBasis = new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis([
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, -1, 0),
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(-1, 0, 0),
                new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, -1),
            ]);
            // const rX = Quaternion.RotationAxis(startBasis.x.clone(), isLeft ? 0.2618 : -0.2618);
            // const z1 = Vector3.Zero();
            // startBasis.z.rotateByQuaternionToRef(rX, z1);
            // const rZ = Quaternion.RotationAxis(z1, isLeft ? 0.0873 : -0.0873);
            // const thisFootBasisRotation = isLeft ? this.leftFootBasisRotation : this.rightFootBasisRotation;
            // thisFootBasisRotation.copyFrom(rX.multiply(rZ));
            this._initBoneRotations[`${k}Foot`] = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), startBasis);
        }
        // Expressions
        this._initBoneRotations["mouth"] = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis(null));
        this._initBoneRotations["blink"] = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis(null));
        this._initBoneRotations["leftIris"] = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis(null));
        this._initBoneRotations["rightIris"] = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis(null));
        this._initBoneRotations["iris"] = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion(_babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity(), new _helper_basis__WEBPACK_IMPORTED_MODULE_4__.Basis(null));
        // Freeze init object
        Object.freeze(this._initBoneRotations);
        // Deep copy to actual map
        for (const [k, v] of Object.entries(this._initBoneRotations)) {
            this._boneRotations[k] = new _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.CloneableQuaternion((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.cloneableQuaternionToQuaternion)(v), v.baseBasis);
        }
    }
    static normalFromVertices(vertices, reverse) {
        if (reverse)
            vertices.reverse();
        const vec = [];
        for (let i = 0; i < 2; ++i) {
            vec.push(vertices[i + 1].pos.subtract(vertices[i].pos));
        }
        return vec[0].cross(vec[1]).normalize();
    }
    // Recursively apply previous quaternions to current basis
    applyQuaternionChain(startLandmark, isLeft) {
        const q = _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Quaternion.Identity();
        const rotations = [];
        let [startNode, parentMap] = (0,_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.depthFirstSearch)(this.bonesHierarchyTree, (n) => {
            const targetName = Number.isFinite(startLandmark)
                ? (0,_helper_landmark__WEBPACK_IMPORTED_MODULE_2__.handLandMarkToBoneName)(startLandmark, isLeft)
                : startLandmark;
            return n.name === targetName;
        });
        while (parentMap.has(startNode)) {
            startNode = parentMap.get(startNode);
            const boneQuaternion = this._boneRotations[startNode.name];
            rotations.push((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.reverseRotation)((0,_helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.cloneableQuaternionToQuaternion)(boneQuaternion), _helper_quaternion__WEBPACK_IMPORTED_MODULE_3__.AXIS.yz));
        }
        // Quaternions need to be applied from parent to children
        rotations.reverse().map((tq) => {
            q.multiplyInPlace(tq);
        });
        q.normalize();
        return q;
    }
    shallUpdateArm(isLeft) {
        // Update only when all leg landmarks are visible
        const shoulderVisilibity = this.cloneableInputResults?.poseLandmarks[isLeft
            ? _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.LEFT_SHOULDER
            : _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.RIGHT_SHOULDER].visibility || 0;
        const wristVisilibity = this.cloneableInputResults?.poseLandmarks[isLeft ? _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.LEFT_WRIST : _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS.RIGHT_WRIST].visibility || 0;
        return !(shoulderVisilibity <= _helper_filter__WEBPACK_IMPORTED_MODULE_5__.VISIBILITY_THRESHOLD ||
            wristVisilibity <= _helper_filter__WEBPACK_IMPORTED_MODULE_5__.VISIBILITY_THRESHOLD);
    }
    shallUpdateLegs(isLeft) {
        // Update only when all leg landmarks are visible
        const kneeVisilibity = this.cloneableInputResults?.poseLandmarks[isLeft
            ? _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS_LEFT.LEFT_KNEE
            : _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS_RIGHT.RIGHT_KNEE].visibility || 0;
        const ankleVisilibity = this.cloneableInputResults?.poseLandmarks[isLeft
            ? _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS_LEFT.LEFT_ANKLE
            : _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS_RIGHT.RIGHT_ANKLE].visibility || 0;
        const footVisilibity = this.cloneableInputResults?.poseLandmarks[isLeft
            ? _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS_LEFT.LEFT_FOOT_INDEX
            : _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS_RIGHT.RIGHT_FOOT_INDEX].visibility || 0;
        const heelVisilibity = this.cloneableInputResults?.poseLandmarks[isLeft
            ? _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS_LEFT.LEFT_HEEL
            : _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.POSE_LANDMARKS_RIGHT.RIGHT_HEEL].visibility || 0;
        return !(kneeVisilibity <= _helper_filter__WEBPACK_IMPORTED_MODULE_5__.VISIBILITY_THRESHOLD ||
            ankleVisilibity <= _helper_filter__WEBPACK_IMPORTED_MODULE_5__.VISIBILITY_THRESHOLD ||
            footVisilibity <= _helper_filter__WEBPACK_IMPORTED_MODULE_5__.VISIBILITY_THRESHOLD ||
            heelVisilibity <= _helper_filter__WEBPACK_IMPORTED_MODULE_5__.VISIBILITY_THRESHOLD);
    }
    pushBoneRotationBuffer() {
        if (!this._boneRotationUpdateFn)
            return;
        // Callback
        const jsonStr = JSON.stringify(this._boneRotations);
        const arrayBuffer = this.textEncoder.encode(jsonStr);
        this._boneRotationUpdateFn(comlink__WEBPACK_IMPORTED_MODULE_7__.transfer(arrayBuffer, [arrayBuffer.buffer]));
    }
}
Poses.FACE_MESH_CONNECTIONS = [
    _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.FACEMESH_LEFT_EYEBROW,
    _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.FACEMESH_RIGHT_EYEBROW,
    _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.FACEMESH_LEFT_EYE,
    _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.FACEMESH_RIGHT_EYE,
    _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.FACEMESH_LEFT_IRIS,
    _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.FACEMESH_RIGHT_IRIS,
    _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.FACEMESH_LIPS,
    _mediapipe_holistic__WEBPACK_IMPORTED_MODULE_6__.FACEMESH_FACE_OVAL,
];
Poses.HAND_BASE_ROOT_NORMAL = new _babylonjs_core__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, -1, 0);
Poses.HAND_POSITION_SCALING = 0.8;
/* Remap offsets to quaternions using arbitrary range.
 * IRIS_MP=MediaPipe Iris
 * IRIS_BJS=BabylonJS RotationYawPitchRoll
 */
Poses.IRIS_MP_X_RANGE = 0.027;
Poses.IRIS_MP_Y_RANGE = 0.011;
Poses.IRIS_BJS_X_RANGE = 0.28;
Poses.IRIS_BJS_Y_RANGE = 0.12;
Poses.BLINK_RATIO_LOW = 0.59;
Poses.BLINK_RATIO_HIGH = 0.61;
Poses.MOUTH_MP_RANGE_LOW = 0.001;
Poses.MOUTH_MP_RANGE_HIGH = 0.06;
Poses.EYE_WIDTH_BASELINE = 0.0546;
Poses.MOUTH_WIDTH_BASELINE = 0.095;
Poses.LR_FACE_DIRECTION_RANGE = 27;
const poseWrapper = {
    poses: Poses,
};
comlink__WEBPACK_IMPORTED_MODULE_7__.expose(poseWrapper);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Poses);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// the startup function
/******/ 	__webpack_require__.x = () => {
/******/ 		// Load entry module and return exports
/******/ 		// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 		var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_mediapipe_holistic_holistic_js-node_modules_kalmanjs_lib_kalman_js-node_-164f9b"], () => (__webpack_require__("./src/worker/pose-processing.ts")))
/******/ 		__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 		return __webpack_exports__;
/******/ 	};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks and sibling chunks for the entrypoint
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".test.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/importScripts chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "already loaded"
/******/ 		var installedChunks = {
/******/ 			"src_worker_pose-processing_ts": 1
/******/ 		};
/******/ 		
/******/ 		// importScripts chunk loading
/******/ 		var installChunk = (data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			while(chunkIds.length)
/******/ 				installedChunks[chunkIds.pop()] = 1;
/******/ 			parentChunkLoadingFunction(data);
/******/ 		};
/******/ 		__webpack_require__.f.i = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					importScripts(__webpack_require__.p + __webpack_require__.u(chunkId));
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkv3d_web"] = self["webpackChunkv3d_web"] || [];
/******/ 		var parentChunkLoadingFunction = chunkLoadingGlobal.push.bind(chunkLoadingGlobal);
/******/ 		chunkLoadingGlobal.push = installChunk;
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/startup chunk dependencies */
/******/ 	(() => {
/******/ 		var next = __webpack_require__.x;
/******/ 		__webpack_require__.x = () => {
/******/ 			return __webpack_require__.e("vendors-node_modules_mediapipe_holistic_holistic_js-node_modules_kalmanjs_lib_kalman_js-node_-164f9b").then(next);
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// run startup
/******/ 	var __webpack_exports__ = __webpack_require__.x();
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3dvcmtlcl9wb3NlLXByb2Nlc3NpbmdfdHMudGVzdC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNWQTs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUVILHlCQUF5QjtBQUM0QztBQUNWO0FBQ1o7QUFJeEMsTUFBTSxLQUFLO0lBcUJkLFlBQ0ksR0FBdUIsRUFDTixhQUFhLElBQUksRUFDMUIsTUFBTSxJQUFJO1FBREQsZUFBVSxHQUFWLFVBQVUsQ0FBTztRQUMxQixRQUFHLEdBQUgsR0FBRyxDQUFPO1FBakJMLFVBQUssR0FBYSxLQUFLLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQW1CL0QsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsb0RBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDckIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQixDQUFDLENBQUM7SUFDTixDQUFDO0lBdEJELElBQUksQ0FBQztRQUNELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBRUQsSUFBSSxDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxJQUFJLENBQUM7UUFDRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekIsQ0FBQztJQWNNLEdBQUc7UUFDTixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQUVPLEdBQUcsQ0FBQyxHQUFhO1FBQ3JCLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXhCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRU0sV0FBVztRQUNkLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDckQsSUFBSSxDQUFDLG9FQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQztZQUMzRCxNQUFNLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFTSxrQkFBa0IsQ0FBQyxDQUFhO1FBQ25DLE1BQU0sZUFBZSxHQUFhLENBQUMseURBQVksRUFBRSxFQUFFLHlEQUFZLEVBQUUsRUFBRSx5REFBWSxFQUFFLENBQUMsQ0FBQztRQUNuRixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNwQixDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JELENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxJQUFJLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsaUNBQWlDO0lBQzFCLFVBQVUsQ0FBQyxJQUFVO1FBQ3hCLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDekIsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN6QixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3pCLFFBQVEsSUFBSSxFQUFFO1lBQ1YsS0FBSywrQ0FBTTtnQkFDUCxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ2xCLE1BQU07WUFDVixLQUFLLCtDQUFNO2dCQUNQLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDbEIsTUFBTTtZQUNWLEtBQUssK0NBQU07Z0JBQ1AsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNsQixNQUFNO1lBQ1YsS0FBSyxnREFBTztnQkFDUixDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ2xCLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDbEIsTUFBTTtZQUNWLEtBQUssZ0RBQU87Z0JBQ1IsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNsQixDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ2xCLE1BQU07WUFDVixLQUFLLGdEQUFPO2dCQUNSLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDbEIsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNsQixNQUFNO1lBQ1YsS0FBSyxpREFBUTtnQkFDVCxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ2xCLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDbEIsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNsQixNQUFNO1lBQ1Y7Z0JBQ0ksTUFBTSxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7U0FDcEM7UUFFRCxPQUFPLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFTSxTQUFTLENBQUMsS0FBK0I7UUFDNUMsZUFBZTtRQUNmLElBQUksQ0FBQyxnREFBUSxDQUFTLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDdkQsT0FBTyxDQUFDLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1lBQ3RELE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFFRCxNQUFNLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDOUQsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBYSxDQUFDO1FBRXBELE9BQU8sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVPLE1BQU0sQ0FBQyx1QkFBdUI7UUFDbEMsT0FBTyxLQUFLLENBQUMsZ0NBQWdDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFhLENBQUM7SUFDbEYsQ0FBQzs7QUFoSHVCLHNDQUFnQyxHQUFhO0lBQ2pFLElBQUksb0RBQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNwQixJQUFJLG9EQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDcEIsSUFBSSxvREFBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0NBQ3ZCLENBQUM7QUErR0MsU0FBUyxzQkFBc0IsQ0FDbEMsTUFBYSxFQUNiLE1BQWEsRUFDYixjQUEyQjtJQUUzQixJQUFJLFVBQVUsR0FBRyxNQUFNLEVBQUUsVUFBVSxHQUFHLE1BQU0sQ0FBQztJQUM3QyxJQUFJLGNBQWMsS0FBSyxTQUFTLEVBQUU7UUFDOUIsTUFBTSxnQkFBZ0IsR0FBRywrREFBa0IsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUM1RCxVQUFVLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDekQsVUFBVSxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0tBQzVEO0lBQ0QsTUFBTSxjQUFjLEdBQUcsa0ZBQXFDLENBQ3hELFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQ3BCLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQ3BCLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUMxQixNQUFNLGNBQWMsR0FBRyxrRkFBcUMsQ0FDeEQsVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFDcEIsVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFDcEIsVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBRTFCLE1BQU0sWUFBWSxHQUFHLGNBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUN4RCxNQUFNLGFBQWEsR0FBRywrREFBa0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUN2RCxNQUFNLFlBQVksR0FBRyxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDeEQsT0FBTyxZQUFZLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ2hELENBQUM7QUFFRDs7OztHQUlHO0FBQ0ksU0FBUyxRQUFRLENBQUMsR0FBYTtJQUNsQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDdEIsTUFBTSxPQUFPLEdBQUcsNkRBQWdCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUN0RCxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3hDLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFDN0Isb0JBQW9CO0lBQ3BCLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQ1osS0FBSyxDQUFDLEtBQUssQ0FBQyx3REFBVyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsd0RBQVcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FDN0UsQ0FBQztJQUNGLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDekMsT0FBTyxJQUFJLEtBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUM1QyxDQUFDO0FBRUQscUNBQXFDO0FBQzlCLFNBQVMsWUFBWSxDQUFDLEdBQWMsRUFBRSxNQUFlO0lBQ3hELElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDO1FBQUUsT0FBTyxDQUFDLHlEQUFZLEVBQUUsQ0FBQyxDQUFDO0lBQzlDLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUU7UUFDcEMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRXpCLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtRQUN0QixPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyx3REFBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzRSxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuTUQ7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFFc0M7QUFDTDtBQUU3QixNQUFNLG9CQUFvQixHQUFXLEdBQUcsQ0FBQztBQVdoRCxxQkFBcUI7QUFDZCxNQUFNLGdCQUFnQixHQUFHLENBQUM7SUFDN0IsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRXBDLE9BQU8sU0FBUyxnQkFBZ0IsQ0FBRSxJQUFZLEVBQUUsS0FBYTtRQUN6RCw0Q0FBNEM7UUFDNUMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUN0QixNQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFDakMsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsRUFDN0IsV0FBVyxHQUFHLENBQUMsR0FBRyxLQUFLLEdBQUcsS0FBSyxFQUMvQixLQUFLLEdBQUcsQ0FBQyxFQUNULENBQUMsQ0FBQztRQUVOLGlDQUFpQztRQUNqQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzlCLEtBQUssSUFBSSxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQztTQUN0RTtRQUVELHVFQUF1RTtRQUN2RSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDaEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQztTQUN0QjtRQUVELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUMsQ0FBQztBQUNOLENBQUMsRUFBRSxDQUFDLENBQUM7QUFFTDs7R0FFRztBQUNJLE1BQU0sbUJBQW1CO0lBQzVCLFlBQ1csTUFBYyxFQUNkLE1BQWUsRUFDZCxVQUFVLHlEQUFZLEVBQUUsRUFDekIsYUFBYSxHQUFHLEVBQ2hCLE9BQU8sR0FBRyxFQUNWLFdBQVcsR0FBRztRQUxkLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxXQUFNLEdBQU4sTUFBTSxDQUFTO1FBQ2QsWUFBTyxHQUFQLE9BQU8sQ0FBaUI7UUFDekIsZUFBVSxHQUFWLFVBQVUsQ0FBTTtRQUNoQixTQUFJLEdBQUosSUFBSSxDQUFNO1FBQ1YsYUFBUSxHQUFSLFFBQVEsQ0FBTTtJQUV6QixDQUFDO0lBRU8sTUFBTSxDQUFDLGdCQUFnQixDQUFDLEdBQVcsRUFBRSxNQUFjO1FBQ3ZELE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDckMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQUVPLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFTLEVBQUUsQ0FBVSxFQUFFLE1BQWU7UUFDdkUsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRU0sSUFBSSxDQUFDLENBQVMsRUFBRSxDQUFVO1FBQzdCLE1BQU0sR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBRTVCLHlDQUF5QztRQUN6QyxNQUFNLEdBQUcsR0FBRyxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDekQsTUFBTSxNQUFNLEdBQUcsbUJBQW1CLENBQUMscUJBQXFCLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFaEYsdUJBQXVCO1FBQ3ZCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDN0QsTUFBTSxDQUFDLEdBQUcsbUJBQW1CLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzVELE1BQU0sS0FBSyxHQUFHLG1CQUFtQixDQUFDLHFCQUFxQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTNFLGdDQUFnQztRQUNoQyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNwQixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUVoQixPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0NBQ0o7QUFDTSxNQUFNLGtCQUFrQjtJQUkzQixZQUNXLElBQUksR0FBRyxFQUNQLElBQUksQ0FBQztRQURMLE1BQUMsR0FBRCxDQUFDLENBQU07UUFDUCxNQUFDLEdBQUQsQ0FBQyxDQUFJO1FBRVosSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLGlEQUFZLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxpREFBWSxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUNwRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksaURBQVksQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVNLElBQUksQ0FBQyxDQUFTLEVBQUUsR0FBWTtRQUMvQixNQUFNLFNBQVMsR0FBRztZQUNkLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNoQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ25DO1FBRUQsT0FBTyw4REFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN4QyxDQUFDO0NBQ0o7QUFFTSxNQUFNLG9CQUFvQjtJQU83QixZQUNvQixJQUFZLEVBQ1gsS0FBYTtRQURkLFNBQUksR0FBSixJQUFJLENBQVE7UUFDWCxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBUjFCLFlBQU8sR0FBYyxFQUFFLENBQUM7UUFVNUIsSUFBSSxJQUFJLEdBQUcsQ0FBQztZQUFFLE1BQU0sVUFBVSxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxNQUFNLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFaRCxJQUFJLE1BQU07UUFDTixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDeEIsQ0FBQztJQVlNLElBQUksQ0FBQyxDQUFVO1FBQ2xCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXBCLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUU7WUFDdEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUN2QjthQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUU7WUFDM0MsT0FBTyxDQUFDLElBQUksQ0FBQywrQ0FBK0MsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7WUFDekUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDakM7SUFDTCxDQUFDO0lBRU0sS0FBSztRQUNSLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBRU0sS0FBSztRQUNSLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLElBQUk7WUFBRSxPQUFPLHlEQUFZLEVBQUUsQ0FBQztRQUM1RCxNQUFNLEdBQUcsR0FBRyx5REFBWSxFQUFFLENBQUM7UUFDM0IsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzFCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQ2hDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDeEQ7UUFDRCxNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDMUIsK0JBQStCO1FBQy9CLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO1FBRTlCLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztDQUNKO0FBRU0sTUFBTSx1QkFBdUI7SUFNaEMsWUFDcUIsU0FBaUI7UUFBakIsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQU45QixXQUFNLEdBQVkseURBQVksRUFBRSxDQUFDO0lBT3RDLENBQUM7SUFOSixJQUFJLEtBQUs7UUFDTCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQU1NLE1BQU0sQ0FBQyxDQUFVO1FBQ3BCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNsRCxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztTQUNuQjtJQUNMLENBQUM7SUFFTSxLQUFLO1FBQ1IsSUFBSSxDQUFDLE1BQU0sR0FBRyx5REFBWSxFQUFFLENBQUM7SUFDakMsQ0FBQztDQUNKOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDOUxEOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBRytDO0FBT2hDO0FBQ2lCO0FBRTVCLE1BQU0sc0JBQXNCO0lBb0IvQixZQUNJLFNBQXVCO1FBQ25CLGFBQWEsRUFBRSxJQUFJO1FBQ25CLFdBQVcsRUFBRSxDQUFDO1FBQ2QsSUFBSSxFQUFFLFNBQVM7S0FDbEI7UUF2QlkseUJBQW9CLEdBQW1DLElBQUksQ0FBQztRQUVyRSxPQUFFLEdBQUcsQ0FBQyxDQUFDO1FBU1AsU0FBSSxHQUFHLHlEQUFZLEVBQUUsQ0FBQztRQUt2QixlQUFVLEdBQXVCLENBQUMsQ0FBQztRQVN0QyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssUUFBUTtZQUN4QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksdURBQWtCLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDNUQsSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLFNBQVM7WUFDOUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLHdEQUFtQixDQUNyQyxJQUFJLENBQUMsQ0FBQyxFQUNOLElBQUksQ0FBQyxHQUFHLEVBQ1IseURBQVksRUFBRSxFQUNkLE1BQU0sQ0FBQyxhQUFhLEVBQ3BCLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQzs7WUFFeEIsTUFBTSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUN0QyxJQUFJLE1BQU0sQ0FBQyxhQUFhO1lBQ3BCLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLHlEQUFvQixDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDdEYsQ0FBQztJQW5DRCxJQUFJLENBQUM7UUFDRCxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVELElBQUksQ0FBQyxDQUFDLEtBQWE7UUFDZixJQUFJLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQztJQUNwQixDQUFDO0lBR0QsSUFBSSxHQUFHO1FBQ0gsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUEwQk0sY0FBYyxDQUFDLEdBQVksRUFBRSxVQUFtQjtRQUNuRCxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVaLDhCQUE4QjtRQUM5QixJQUFJLFVBQVUsS0FBSyxTQUFTLElBQUksVUFBVSxHQUFHLHlEQUFvQixFQUFFO1lBQy9ELEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBRXhDLElBQUksSUFBSSxDQUFDLG9CQUFvQixFQUFFO2dCQUMzQixJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNwQyxHQUFHLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEtBQUssRUFBRSxDQUFDO2FBQzNDO1lBRUQsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7WUFFaEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7U0FDaEM7SUFDTCxDQUFDO0NBQ0o7QUFhTSxNQUFNLG9CQUFvQixHQUFHLEVBQUUsQ0FBQztBQUNoQyxNQUFNLG9CQUFvQixHQUFHLEdBQUcsQ0FBQztBQUNqQyxNQUFNLG9CQUFvQixHQUFHLEVBQUUsQ0FBQztBQUVoQyxNQUFNLDBCQUEwQixHQUFHLENBQ3RDLENBQXFCLEVBQ3JCLE9BQU8sR0FBRyxFQUFFLEVBQ1osUUFBUSxHQUFHLEtBQUssRUFBRSxFQUFFO0lBQ3BCLE9BQU8sSUFBSSxvREFBTyxDQUNkLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxFQUNiLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLEVBQ3pDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUM7QUFDdkIsQ0FBQztBQUNNLE1BQU0sMEJBQTBCLEdBQUcsQ0FBQyxDQUFVLEVBQXNCLEVBQUU7SUFDekUsT0FBTyxFQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUM7QUFDcEMsQ0FBQyxDQUFDO0FBRUssTUFBTSxjQUFjLEdBQUc7SUFDMUIsS0FBSyxFQUFFLENBQUM7SUFDUixTQUFTLEVBQUUsQ0FBQztJQUNaLFNBQVMsRUFBRSxDQUFDO0lBQ1osUUFBUSxFQUFFLENBQUM7SUFDWCxTQUFTLEVBQUUsQ0FBQztJQUNaLGdCQUFnQixFQUFFLENBQUM7SUFDbkIsZ0JBQWdCLEVBQUUsQ0FBQztJQUNuQixnQkFBZ0IsRUFBRSxDQUFDO0lBQ25CLGdCQUFnQixFQUFFLENBQUM7SUFDbkIsaUJBQWlCLEVBQUUsQ0FBQztJQUNwQixpQkFBaUIsRUFBRSxFQUFFO0lBQ3JCLGlCQUFpQixFQUFFLEVBQUU7SUFDckIsaUJBQWlCLEVBQUUsRUFBRTtJQUNyQixlQUFlLEVBQUUsRUFBRTtJQUNuQixlQUFlLEVBQUUsRUFBRTtJQUNuQixlQUFlLEVBQUUsRUFBRTtJQUNuQixlQUFlLEVBQUUsRUFBRTtJQUNuQixTQUFTLEVBQUUsRUFBRTtJQUNiLFNBQVMsRUFBRSxFQUFFO0lBQ2IsU0FBUyxFQUFFLEVBQUU7SUFDYixTQUFTLEVBQUUsRUFBRTtDQUNoQixDQUFDO0FBRUssTUFBTSwyQkFBMkIsR0FBRztJQUN2QyxJQUFJLEVBQUUsY0FBYyxDQUFDLEtBQUs7SUFDMUIsYUFBYSxFQUFFLGNBQWMsQ0FBQyxTQUFTO0lBQ3ZDLGlCQUFpQixFQUFFLGNBQWMsQ0FBQyxTQUFTO0lBQzNDLFdBQVcsRUFBRSxjQUFjLENBQUMsUUFBUTtJQUNwQyxhQUFhLEVBQUUsY0FBYyxDQUFDLGdCQUFnQjtJQUM5QyxpQkFBaUIsRUFBRSxjQUFjLENBQUMsZ0JBQWdCO0lBQ2xELFdBQVcsRUFBRSxjQUFjLENBQUMsZ0JBQWdCO0lBQzVDLGNBQWMsRUFBRSxjQUFjLENBQUMsaUJBQWlCO0lBQ2hELGtCQUFrQixFQUFFLGNBQWMsQ0FBQyxpQkFBaUI7SUFDcEQsWUFBWSxFQUFFLGNBQWMsQ0FBQyxpQkFBaUI7SUFDOUMsWUFBWSxFQUFFLGNBQWMsQ0FBQyxlQUFlO0lBQzVDLGdCQUFnQixFQUFFLGNBQWMsQ0FBQyxlQUFlO0lBQ2hELFVBQVUsRUFBRSxjQUFjLENBQUMsZUFBZTtJQUMxQyxjQUFjLEVBQUUsY0FBYyxDQUFDLFNBQVM7SUFDeEMsa0JBQWtCLEVBQUUsY0FBYyxDQUFDLFNBQVM7SUFDNUMsWUFBWSxFQUFFLGNBQWMsQ0FBQyxTQUFTO0NBQ3pDLENBQUM7QUFDSyxNQUFNLG1DQUFtQyxHQUE4QixrREFBVSxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFHL0csU0FBUyxzQkFBc0IsQ0FBQyxRQUFnQixFQUFFLE1BQWU7SUFDcEUsSUFBSSxDQUFDLENBQUMsUUFBUSxJQUFJLG1DQUFtQyxDQUFDO1FBQUUsTUFBTSxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUM3RixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLG1DQUFtQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3ZGLENBQUM7QUFFRDs7O0dBR0c7QUFDSSxTQUFTLGdCQUFnQixDQUM1QixRQUFhLEVBQ2IsQ0FBc0I7SUFFdEIsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ2pCLE1BQU0sU0FBUyxHQUFrQixJQUFJLEdBQUcsRUFBWSxDQUFDO0lBQ3JELEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFckIsT0FBTyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUN2QixzQ0FBc0M7UUFDdEMsTUFBTSxXQUFXLEdBQVEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDOUIsSUFBSSxNQUFNO1lBQUUsT0FBTyxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUU1QyxNQUFNLGVBQWUsR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDO1FBQzdDLHVEQUF1RDtRQUN2RCxJQUFJLGVBQWUsS0FBSyxJQUFJLEVBQUU7WUFDMUIsS0FBSyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLGVBQWUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7Z0JBQ3pELE1BQU0sS0FBSyxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDckMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDbEIsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO29CQUN6QixTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQztpQkFDckM7YUFDSjtTQUNKO0tBQ0o7SUFDRCxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3hCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDck1EOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBRXlFO0FBQzNDO0FBQ3FCO0FBQ0E7QUFLcEM7QUFFWCxNQUFNLHVCQUF1QjtJQU1oQyxZQUNJLENBQXVCO1FBTnBCLE1BQUMsR0FBVyxDQUFDLENBQUM7UUFDZCxNQUFDLEdBQVcsQ0FBQyxDQUFDO1FBQ2QsTUFBQyxHQUFXLENBQUMsQ0FBQztRQUNkLE1BQUMsR0FBVyxDQUFDLENBQUM7UUFLakIsSUFBSSxDQUFDLEVBQUU7WUFDSCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDYixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDYixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDYixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDaEI7SUFDTCxDQUFDO0NBQ0o7QUFFTSxNQUFNLG1CQUFvQixTQUFRLHVCQUF1QjtJQU01RCxZQUNJLENBQXVCLEVBQ3ZCLEtBQWE7UUFFYixLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDVCxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLHlDQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQVZELElBQUksU0FBUztRQUNULE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUMzQixDQUFDO0lBVU0sR0FBRyxDQUFDLENBQWE7UUFDcEIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pCLENBQUM7SUFFTSxXQUFXLENBQUMsQ0FBYTtRQUM1QixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakQsQ0FBQztDQUNKO0FBT00sTUFBTSwrQkFBK0IsR0FBRyxDQUFDLENBQTBCLEVBQWMsRUFBRTtJQUN0RixNQUFNLEdBQUcsR0FBRyxJQUFJLHVEQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9DLE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQyxDQUFDO0FBRUssTUFBTSxrQkFBa0I7SUFpQjNCLFlBQ0ksU0FBdUI7UUFDbkIsQ0FBQyxFQUFFLENBQUM7UUFDSixDQUFDLEVBQUUsQ0FBQztRQUNKLElBQUksRUFBRSxRQUFRO0tBQ2pCO1FBcEJZLHlCQUFvQixHQUFtQyxJQUFJLENBQUM7UUFFckUsT0FBRSxHQUFHLENBQUMsQ0FBQztRQVFQLFNBQUksR0FBRyxnRUFBbUIsRUFBRSxDQUFDO1FBWWpDLElBQUksTUFBTSxDQUFDLElBQUksS0FBSyxRQUFRO1lBQ3hCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSx1REFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzs7WUFFN0QsTUFBTSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUN0QyxJQUFJLE1BQU0sQ0FBQyxhQUFhO1lBQ3BCLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLHlEQUFvQixDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDdEYsQ0FBQztJQXpCRCxJQUFJLENBQUM7UUFDRCxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUNELElBQUksQ0FBQyxDQUFDLEtBQWE7UUFDZixJQUFJLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQztJQUNwQixDQUFDO0lBR0QsSUFBSSxHQUFHO1FBQ0gsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFpQk0sY0FBYyxDQUFDLEdBQWU7UUFDakMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDWixJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDakMsTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFOUMsSUFBSSxJQUFJLENBQUMsb0JBQW9CLEVBQUU7WUFDM0IsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN2QyxNQUFNLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEtBQUssRUFBRSxDQUFDO1NBQzlDO1FBRUQsSUFBSSxDQUFDLElBQUksR0FBRyx1RUFBMEIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNuRCxDQUFDO0NBQ0o7QUFLRCxJQUFZLElBU1g7QUFURCxXQUFZLElBQUk7SUFDWix5QkFBQztJQUNELHlCQUFDO0lBQ0QseUJBQUM7SUFDRCwyQkFBRTtJQUNGLDJCQUFFO0lBQ0YsMkJBQUU7SUFDRiw2QkFBRztJQUNILGdDQUFTO0FBQ2IsQ0FBQyxFQVRXLElBQUksS0FBSixJQUFJLFFBU2Y7QUFFRCx3QkFBd0I7QUFDakIsTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFTLEVBQUUsRUFBRTtJQUNsQyxPQUFPLDhEQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzFDLENBQUM7QUFDTSxNQUFNLFFBQVEsR0FBRyxDQUFDLENBQVMsRUFBRSxFQUFFO0lBQ2xDLE9BQU8sOERBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDMUMsQ0FBQztBQUVEOzs7R0FHRztBQUNJLFNBQVMsZUFBZSxDQUFDLENBQWE7SUFDekMsT0FBTyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4RyxDQUFDO0FBRUQsb0RBQW9EO0FBQzdDLE1BQU0sd0JBQXdCLEdBQUcsQ0FDcEMsRUFBVyxFQUFFLEVBQVcsRUFDZCxFQUFFO0lBQ1osTUFBTSxLQUFLLEdBQUcsMkVBQThCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSwwREFBYSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMzRSxNQUFNLElBQUksR0FBRywwREFBYSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNuQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDakIsT0FBTyxvRUFBdUIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDaEQsQ0FBQyxDQUFDO0FBQ0Y7Ozs7O0dBS0c7QUFDSSxNQUFNLG9CQUFvQixHQUFHLENBQ2hDLEVBQVcsRUFBRSxFQUFXLEVBQUUsV0FBVyxHQUFHLEtBQUssRUFDL0MsRUFBRTtJQUNBLE9BQU8sbUJBQW1CLENBQUMsd0JBQXdCLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQzlFLENBQUMsQ0FBQztBQUNGOzs7R0FHRztBQUNJLE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxHQUFXLEVBQUUsRUFBRTtJQUM5QyxHQUFHLEdBQUcsZ0RBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzVCLE9BQU8sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ3ZDLENBQUM7QUFDRDs7OztHQUlHO0FBQ0ksTUFBTSxtQkFBbUIsR0FBRyxDQUMvQixDQUFhLEVBQ2IsV0FBVyxHQUFHLEtBQUssRUFDckIsRUFBRTtJQUNBLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUNqQyxNQUFNLE9BQU8sR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3BFLE9BQU8sSUFBSSxvREFBTyxDQUNkLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQzNCLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQzNCLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQzlCLENBQUM7QUFDTixDQUFDLENBQUM7QUFFRjs7Ozs7R0FLRztBQUNJLFNBQVMsdUJBQXVCLENBQUMsRUFBVyxFQUFFLEVBQVcsRUFBRSxHQUFHLEdBQUcsSUFBSTtJQUN4RSxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxJQUFJLHdEQUFXLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsRSxDQUFDO0FBRUQ7Ozs7R0FJRztBQUNJLFNBQVMsNEJBQTRCLENBQUMsRUFBYyxFQUFFLEVBQWM7SUFDdkUsTUFBTSxPQUFPLEdBQUcsd0RBQVcsRUFBRSxDQUFDO0lBQzlCLE1BQU0sUUFBUSxHQUFHLHlEQUFZLEVBQUUsQ0FBQztJQUNoQyxNQUFNLFFBQVEsR0FBRyx3REFBVyxFQUFFLENBQUM7SUFDL0IsT0FBTyxDQUFDLHVCQUF1QixDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM5QyxPQUFPLENBQUMsdUJBQXVCLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzlDLE9BQU8sdUJBQXVCLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3ZELENBQUM7QUFFRDs7OztHQUlHO0FBQ0ksU0FBUyx3QkFBd0IsQ0FDcEMsRUFBVyxFQUFFLEVBQVc7SUFFeEIsTUFBTSxFQUFFLEdBQUcsdUVBQTBCLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0RixNQUFNLEVBQUUsR0FBRyx1RUFBMEIsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RGLE9BQU8sNEJBQTRCLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ2hELENBQUM7QUFFRDs7OztHQUlHO0FBQ0ksTUFBTSxlQUFlLEdBQUcsQ0FBQyxDQUFhLEVBQUUsSUFBVSxFQUFFLEVBQUU7SUFDekQsSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFDLElBQUk7UUFBRSxPQUFPLENBQUMsQ0FBQztJQUNqQyxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDakMsUUFBUSxJQUFJLEVBQUU7UUFDVixLQUFLLElBQUksQ0FBQyxDQUFDO1lBQ1AsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDckIsTUFBTTtRQUNWLEtBQUssSUFBSSxDQUFDLENBQUM7WUFDUCxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNyQixNQUFNO1FBQ1YsS0FBSyxJQUFJLENBQUMsQ0FBQztZQUNQLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLE1BQU07UUFDVixLQUFLLElBQUksQ0FBQyxFQUFFO1lBQ1IsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDckIsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDckIsTUFBTTtRQUNWLEtBQUssSUFBSSxDQUFDLEVBQUU7WUFDUixNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNyQixNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNyQixNQUFNO1FBQ1YsS0FBSyxJQUFJLENBQUMsRUFBRTtZQUNSLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLE1BQU07UUFDVixLQUFLLElBQUksQ0FBQyxHQUFHO1lBQ1QsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDckIsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDckIsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDckIsTUFBTTtRQUNWO1lBQ0ksTUFBTSxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7S0FDcEM7SUFDRCxPQUFPLDRFQUErQixDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekUsQ0FBQztBQUNEOzs7Ozs7Ozs7Ozs7R0FZRztBQUNJLE1BQU0seUJBQXlCLEdBQUcsQ0FDckMsQ0FBYSxFQUNiLElBQVUsRUFDVixRQUFlLEVBQ2YsT0FBZ0IsRUFDaEIsUUFBaUIsRUFDakIsUUFBZSxFQUNmLE9BQWdCLEVBQ2hCLFFBQWlCLEVBQ25CLEVBQUU7SUFDQSxNQUFNLE1BQU0sR0FBRyxtQkFBbUIsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDNUMsUUFBUSxJQUFJLEVBQUU7UUFDVixLQUFLLElBQUksQ0FBQyxJQUFJO1lBQ1YsTUFBTTtRQUNWLEtBQUssSUFBSSxDQUFDLENBQUM7WUFDUCxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNiLE1BQU07UUFDVixLQUFLLElBQUksQ0FBQyxDQUFDO1lBQ1AsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDYixNQUFNO1FBQ1YsS0FBSyxJQUFJLENBQUMsQ0FBQztZQUNQLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2IsTUFBTTtRQUNWLEtBQUssSUFBSSxDQUFDLEVBQUU7WUFDUixNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNiLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2IsTUFBTTtRQUNWLEtBQUssSUFBSSxDQUFDLEVBQUU7WUFDUixNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNiLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2IsTUFBTTtRQUNWLEtBQUssSUFBSSxDQUFDLEVBQUU7WUFDUixNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNiLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2IsTUFBTTtRQUNWLEtBQUssSUFBSSxDQUFDLEdBQUc7WUFDVCxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNiLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2IsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDYixNQUFNO1FBQ1Y7WUFDSSxNQUFNLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztLQUNwQztJQUNELElBQUksUUFBUSxLQUFLLFNBQVMsSUFBSSxPQUFPLEtBQUssU0FBUyxJQUFJLFFBQVEsS0FBSyxTQUFTLEVBQUU7UUFDM0UsUUFBUSxRQUFnQixFQUFFO1lBQ3RCLEtBQUssSUFBSSxDQUFDLENBQUM7Z0JBQ1AsTUFBTSxDQUFDLENBQUMsR0FBRyxnREFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUNqRCxNQUFNO1lBQ1YsS0FBSyxJQUFJLENBQUMsQ0FBQztnQkFDUCxNQUFNLENBQUMsQ0FBQyxHQUFHLGdEQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ2pELE1BQU07WUFDVixLQUFLLElBQUksQ0FBQyxDQUFDO2dCQUNQLE1BQU0sQ0FBQyxDQUFDLEdBQUcsZ0RBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDakQsTUFBTTtZQUNWO2dCQUNJLE1BQU0sS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7U0FDeEM7S0FDSjtJQUNELElBQUksUUFBUSxLQUFLLFNBQVMsSUFBSSxPQUFPLEtBQUssU0FBUyxJQUFJLFFBQVEsS0FBSyxTQUFTLEVBQUU7UUFDM0UsUUFBUSxRQUFnQixFQUFFO1lBQ3RCLEtBQUssSUFBSSxDQUFDLENBQUM7Z0JBQ1AsTUFBTSxDQUFDLENBQUMsR0FBRyxnREFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUNqRCxNQUFNO1lBQ1YsS0FBSyxJQUFJLENBQUMsQ0FBQztnQkFDUCxNQUFNLENBQUMsQ0FBQyxHQUFHLGdEQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ2pELE1BQU07WUFDVixLQUFLLElBQUksQ0FBQyxDQUFDO2dCQUNQLE1BQU0sQ0FBQyxDQUFDLEdBQUcsZ0RBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDakQsTUFBTTtZQUNWO2dCQUNJLE1BQU0sS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7U0FDeEM7S0FDSjtJQUNELE9BQU8sNEVBQStCLENBQ2xDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQ2xCLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQ2xCLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBQ0Q7Ozs7O0dBS0c7QUFDSSxNQUFNLG9CQUFvQixHQUFHLENBQ2hDLENBQWEsRUFDYixLQUFXLEVBQ1gsS0FBVyxFQUNiLEVBQUU7SUFDQSxNQUFNLE1BQU0sR0FBYSxFQUFFLENBQUM7SUFDNUIsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsQyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDN0IsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzdCLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQztJQUNwQixNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsTUFBTSxDQUFDO0lBQ3ZCLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDckIsT0FBTyx1RUFBMEIsQ0FDN0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUNULE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFDVCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuQixDQUFDO0FBRU0sU0FBUyxlQUFlLENBQUMsQ0FBYSxFQUFFLENBQVU7SUFDckQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUscUVBQTBCLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3RSxDQUFDO0FBR0Q7Ozs7O0dBS0c7QUFDSSxTQUFTLGtCQUFrQixDQUM5QixHQUFZLEVBQUUsS0FBWTtJQUUxQixNQUFNLFdBQVcsR0FBRywrREFBa0IsQ0FBQyxrRkFBcUMsQ0FDeEUsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3BFLE1BQU0sYUFBYSxHQUFHLHlEQUFZLEVBQUUsQ0FBQztJQUNyQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsV0FBVyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ3hELGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUUxQiwwQkFBMEI7SUFDMUIsTUFBTSxDQUFDLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQztJQUMxQixNQUFNLENBQUMsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDO0lBQzFCLE1BQU0sQ0FBQyxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUM7SUFFMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzQixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUU3QixPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSSxTQUFTLHFCQUFxQixDQUNqQyxLQUFZLEVBQUUsS0FBYSxFQUFFLEdBQVcsRUFDeEMsY0FBMEI7SUFDMUIsTUFBTSxHQUFHLEdBQUcsb0VBQXVCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDbkUsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQy9DLE1BQU0sRUFBRSxHQUFHLG9FQUF1QixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDNUQsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELE1BQU0sRUFBRSxHQUFHLG9FQUF1QixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDN0QsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRS9DLDZCQUE2QjtJQUM3QixNQUFNLE9BQU8sR0FBRyx3RUFBMkIsQ0FBQyx5REFBWSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQzdFLHNGQUFzRjtJQUN0RixNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUM7SUFDNUIsTUFBTSxTQUFTLEdBQUcsMERBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2RSxNQUFNLFNBQVMsR0FBRywwREFBYSxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDbEUsTUFBTSxRQUFRLEdBQUcsSUFBSSx5Q0FBSyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUVsRSxPQUFPLDhEQUFzQixDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDbkUsQ0FBQztBQUVELGlDQUFpQztBQUMxQixTQUFTLGFBQWEsQ0FBQyxVQUFzQixFQUFFLEtBQWE7SUFDL0QsTUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQzFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDM0IsT0FBTyx1RUFBMEIsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM5QyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzFjRDs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUVvRTtBQUVoRSxTQUFTLFNBQVMsQ0FBSSxNQUFjLEVBQUUsV0FBNkI7SUFDdEUsSUFBSSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUksTUFBTSxDQUFDLENBQUM7SUFDL0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUU7UUFDM0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUM7QUFFTSxTQUFTLEtBQUssQ0FBQyxLQUFhLEVBQUUsR0FBVyxFQUFFLElBQVk7SUFDMUQsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUNiLEVBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUMsRUFDekMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FDN0IsQ0FBQztBQUNOLENBQUM7QUFFTSxTQUFTLFFBQVEsQ0FBQyxLQUFhLEVBQUUsR0FBVyxFQUFFLEdBQVc7SUFDNUQsTUFBTSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQ2pDLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FDYixFQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUMsRUFDYixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUM3QixDQUFDO0FBQ04sQ0FBQztBQUVNLFNBQVMsVUFBVSxDQUFDLEdBQVE7SUFDL0IsTUFBTSxHQUFHLEdBQVEsRUFBRSxDQUFDO0lBQ3BCLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBUSxFQUFFLEVBQUU7UUFDbEMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUN4QixDQUFDLENBQUMsQ0FBQztJQUNILE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQztBQUVNLE1BQU0sUUFBUSxHQUFHLENBQ3BCLENBQVMsRUFDVCxHQUFXLEVBQ1gsR0FBVyxFQUNiLEVBQUU7SUFDQSxJQUFJLEdBQUcsR0FBRyxHQUFHLEVBQUU7UUFDWCxNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDaEIsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNWLEdBQUcsR0FBRyxHQUFHLENBQUM7S0FDYjtJQUNELE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUMzQyxDQUFDO0FBQ00sTUFBTSxVQUFVLEdBQUcsQ0FDdEIsQ0FBUyxFQUNULE9BQWUsRUFDZixRQUFnQixFQUNoQixPQUFlLEVBQ2YsUUFBZ0IsRUFDbEIsRUFBRTtJQUNBLE9BQU8sT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxDQUFDO0FBQ2pGLENBQUMsQ0FBQztBQUNLLE1BQU0saUJBQWlCLEdBQUcsQ0FDN0IsQ0FBUyxFQUNULE9BQWUsRUFDZixRQUFnQixFQUNoQixPQUFlLEVBQ2YsUUFBZ0IsRUFDbEIsRUFBRTtJQUNBLE1BQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzFDLE9BQU8sT0FBTyxHQUFHLENBQUMsRUFBRSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxDQUFDO0FBQ2xGLENBQUMsQ0FBQztBQUNLLE1BQU0sZUFBZSxHQUFHLENBQzNCLENBQVMsRUFDVCxPQUFlLEVBQ2YsUUFBZ0IsRUFDaEIsT0FBZSxFQUNmLFFBQWdCLEVBQ2xCLEVBQUU7SUFDQSxPQUFPLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsQ0FBQztBQUNqRixDQUFDLENBQUM7QUFDSyxTQUFTLFlBQVksQ0FBQyxDQUFVO0lBQ25DLE9BQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEYsQ0FBQztBQVlELDBDQUEwQztBQUVuQyxTQUFTLFFBQVEsQ0FBSSxFQUFVLEVBQUUsRUFBVTtJQUM5QyxJQUFJLEVBQUUsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLElBQUk7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUN0QyxLQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUU7UUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFBRSxPQUFPLEtBQUssQ0FBQztJQUNqRCxPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDO0FBRU0sU0FBUyxvQkFBb0IsQ0FBQyxTQUFnQixFQUFFLEdBQVk7SUFDL0QsT0FBTyxHQUFHLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLHdEQUFXLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEYsQ0FBQztBQUVNLFNBQVMsS0FBSyxDQUFDLEtBQWEsRUFBRSxTQUFpQjtJQUNsRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxTQUFTLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDaEQsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUMsR0FBRyxVQUFVLENBQUM7QUFDdkQsQ0FBQztBQUVEOztHQUVHO0FBQ0ksTUFBTSxnQkFBZ0I7SUFNekIsWUFBNEIsSUFBWTtRQUFaLFNBQUksR0FBSixJQUFJLENBQVE7UUFMaEMsWUFBTyxHQUFRLEVBQUUsQ0FBQztJQU0xQixDQUFDO0lBTEQsSUFBSSxNQUFNO1FBQ04sT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3hCLENBQUM7SUFLTSxJQUFJLENBQUMsQ0FBSTtRQUNaLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXBCLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUU7WUFDdEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUN2QjthQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUU7WUFDM0MsT0FBTyxDQUFDLElBQUksQ0FBQyw4Q0FBOEMsSUFBSSxDQUFDLElBQUksZ0JBQWdCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztZQUMxRyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2hEO0lBQ0wsQ0FBQztJQUVNLE1BQU0sQ0FBQyxHQUFRO1FBQ2xCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFdkMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2hDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDaEQ7SUFDTCxDQUFDO0lBRU0sR0FBRztRQUNOLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUMvQixDQUFDO0lBRU0sS0FBSztRQUNSLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQztZQUN2QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7O1lBRXRCLE9BQU8sSUFBSSxDQUFDO0lBQ3BCLENBQUM7SUFFTSxJQUFJO1FBQ1AsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDO1lBQ3ZCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQzs7WUFFN0MsT0FBTyxJQUFJLENBQUM7SUFDcEIsQ0FBQztJQUVNLEtBQUs7UUFDUixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUVNLE1BQU07UUFDVCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQzlCLENBQUM7Q0FDSjtBQUVNLFNBQVMsU0FBUyxDQUFDLEtBQWEsRUFBRSxDQUFTLEVBQUUsR0FBRyxHQUFHLEtBQUs7SUFDM0QsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzlCLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUUsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzdCLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBRSxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtRQUNqQyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHO1lBQUUsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3JEO0lBQ0QsT0FBTyxDQUFDLENBQUM7QUFDYixDQUFDO0FBRU0sTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFFN0IsTUFBTSxtQkFBbUI7SUFLNUIsWUFDcUIsZUFBa0MsRUFDM0MsVUFBMEI7UUFEakIsb0JBQWUsR0FBZixlQUFlLENBQW1CO1FBQzNDLGVBQVUsR0FBVixVQUFVLENBQWdCO1FBTnRDLG1EQUFtRDtRQUM1Qyw2QkFBd0IsR0FBVyxFQUFFLENBQUM7UUFDdEMsa0JBQWEsR0FBVyxFQUFFLENBQUM7SUFLL0IsQ0FBQztJQUVHLGdCQUFnQjtRQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVU7WUFBRSxPQUFPO1FBQzdCLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsT0FBTyxLQUFLLE1BQU0sRUFBRTtZQUMxQyxzREFBc0Q7WUFDdEQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztTQUM3QztRQUVELDJCQUEyQjtRQUMzQiw0REFBNEQ7SUFDaEUsQ0FBQztJQUVNLGFBQWE7UUFDaEIsSUFBSSxJQUFJLENBQUMsVUFBVTtZQUNmLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7SUFDL0MsQ0FBQztDQWdCSjtBQUVNLFNBQVMsaUJBQWlCLENBQzdCLEtBQWMsRUFDZCxRQUFpQixFQUFFLFFBQWlCO0lBRXBDLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDeEQsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FDdEIsT0FBTyxDQUFDLEtBQUssQ0FDVCx3REFBVyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsT0FBTyxDQUFDO1VBQzVDLHdEQUFXLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQyxPQUFPLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDMUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDalBEOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBRWdDO0FBZU47QUFDMEM7QUFZOUM7QUFnQkc7QUFhRTtBQU1MO0FBQytCO0FBSWpELE1BQU0sYUFBYTtJQUExQjtRQUNXLGtCQUFhLEdBQUcsSUFBSSxvRUFBc0IsRUFBRSxDQUFDO1FBQzdDLG1CQUFjLEdBQUcsSUFBSSxvRUFBc0IsRUFBRSxDQUFDO1FBQzlDLHFCQUFnQixHQUFHLElBQUksb0VBQXNCLEVBQUUsQ0FBQztRQUNoRCxvQkFBZSxHQUFHLElBQUksb0VBQXNCLEVBQUUsQ0FBQztRQUMvQyxpQkFBWSxHQUFHLElBQUksb0VBQXNCLEVBQUUsQ0FBQztRQUM1QyxvQkFBZSxHQUFHLElBQUksb0VBQXNCLEVBQUUsQ0FBQztRQUMvQyxtQkFBYyxHQUFHLElBQUksb0VBQXNCLEVBQUUsQ0FBQztRQUM5QyxtQkFBYyxHQUFHLElBQUksb0VBQXNCLEVBQUUsQ0FBQztRQUM5Qyw2QkFBd0IsR0FBRyxJQUFJLG9FQUFzQixFQUFFLENBQUM7UUFDeEQsNkJBQXdCLEdBQUcsSUFBSSxvRUFBc0IsRUFBRSxDQUFDO1FBQ3hELGtCQUFhLEdBQUcsSUFBSSxvRUFBc0IsRUFBRSxDQUFDO1FBQzdDLHFCQUFnQixHQUFHLElBQUksb0VBQXNCLEVBQUUsQ0FBQztRQUNoRCxtQkFBYyxHQUFHLElBQUksb0VBQXNCLEVBQUUsQ0FBQztRQUM5QyxvQkFBZSxHQUFHLElBQUksb0VBQXNCLEVBQUUsQ0FBQztRQUMvQyxrQkFBYSxHQUFHLElBQUksb0VBQXNCLEVBQUUsQ0FBQztRQUM3QyxxQkFBZ0IsR0FBRyxJQUFJLG9FQUFzQixFQUFFLENBQUM7UUFDaEQsb0JBQWUsR0FBRyxJQUFJLG9FQUFzQixFQUFFLENBQUM7UUFDL0Msb0JBQWUsR0FBRyxJQUFJLG9FQUFzQixFQUFFLENBQUM7UUFDL0MsOEJBQXlCLEdBQUcsSUFBSSxvRUFBc0IsRUFBRSxDQUFDO1FBQ3pELDhCQUF5QixHQUFHLElBQUksb0VBQXNCLEVBQUUsQ0FBQztRQUN6RCxtQkFBYyxHQUFHLElBQUksb0VBQXNCLEVBQUUsQ0FBQztRQUM5QyxzQkFBaUIsR0FBRyxJQUFJLG9FQUFzQixFQUFFLENBQUM7UUFDakQsb0JBQWUsR0FBRyxJQUFJLG9FQUFzQixFQUFFLENBQUM7UUFDL0MscUJBQWdCLEdBQUcsSUFBSSxvRUFBc0IsRUFBRSxDQUFDO1FBQ2hELG9CQUFlLEdBQUcsSUFBSSxvRUFBc0IsRUFBRSxDQUFDO1FBQy9DLHFCQUFnQixHQUFHLElBQUksb0VBQXNCLEVBQUUsQ0FBQztRQUNoRCxvQkFBZSxHQUFHLElBQUksb0VBQXNCLEVBQUUsQ0FBQztRQUMvQyx1QkFBa0IsR0FBRyxJQUFJLG9FQUFzQixFQUFFLENBQUM7UUFDbEQsd0JBQW1CLEdBQUcsSUFBSSxvRUFBc0IsRUFBRSxDQUFDO1FBQ25ELHVCQUFrQixHQUFHLElBQUksb0VBQXNCLEVBQUUsQ0FBQztRQUNsRCxlQUFVLEdBQUcsSUFBSSxvRUFBc0IsRUFBRSxDQUFDO1FBQzFDLGdCQUFXLEdBQUcsSUFBSSxvRUFBc0IsRUFBRSxDQUFDO0lBQ3RELENBQUM7Q0FBQTtBQU9NLE1BQU0sS0FBSztJQWtPZCxZQUNJLFdBQXdCLEVBQ3hCLG9CQUN1QjtRQTlMViwwQkFBcUIsR0FFbEMsSUFBSSxDQUFDO1FBRVQsYUFBYTtRQUNMLHVCQUFrQixHQUFvQyxJQUFJLENBQUM7UUFFbkUsVUFBVTtRQUNILDBCQUFxQixHQUErQixJQUFJLENBQUM7UUFFaEUsaUJBQWlCO1FBQ1YsdUJBQWtCLEdBQ3JCLHdEQUFTLENBQXFCLGtFQUFvQixFQUFFLEdBQUcsRUFBRTtZQUNyRCxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztRQUNDLGtCQUFhLEdBQ2pCLHdEQUFTLENBQXlCLGtFQUFvQixFQUFFLEdBQUcsRUFBRTtZQUN6RCxPQUFPLElBQUksb0VBQXNCLENBQUM7Z0JBQzlCLENBQUMsRUFBRSxHQUFHO2dCQUNOLENBQUMsRUFBRSxDQUFDO2dCQUNKLElBQUksRUFBRSxRQUFRO2FBQ2pCLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO1FBQ0MsdUJBQWtCLEdBQ3RCLHdEQUFTLENBQXlCLGtFQUFvQixFQUFFLEdBQUcsRUFBRTtZQUN6RCxPQUFPLElBQUksb0VBQXNCLENBQUM7Z0JBQzlCLGtDQUFrQztnQkFDbEMsQ0FBQyxFQUFFLEdBQUc7Z0JBQ04sQ0FBQyxFQUFFLENBQUM7Z0JBQ0osSUFBSSxFQUFFLFFBQVE7YUFDakIsQ0FBQyxDQUFDLENBQUMsbUJBQW1CO1FBQzNCLENBQUMsQ0FBQyxDQUFDO1FBQ1AscUVBQXFFO1FBQzlELDJCQUFzQixHQUN6Qix3REFBUyxDQUFxQixrRUFBb0IsRUFBRSxHQUFHLEVBQUU7WUFDckQsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7UUFDaEMsQ0FBQyxDQUFDLENBQUM7UUFFUCxzQkFBc0I7UUFDZix1QkFBa0IsR0FDckIsd0RBQVMsQ0FBcUIsa0VBQW9CLEVBQUUsR0FBRyxFQUFFO1lBQ3JELE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQ2hDLENBQUMsQ0FBQyxDQUFDO1FBQ0Msa0JBQWEsR0FDakIsd0RBQVMsQ0FBeUIsa0VBQW9CLEVBQUUsR0FBRyxFQUFFO1lBQ3pELE9BQU8sSUFBSSxvRUFBc0IsQ0FBQztnQkFDOUIseURBQXlEO2dCQUN6RCxDQUFDLEVBQUUsR0FBRztnQkFDTixDQUFDLEVBQUUsQ0FBQztnQkFDSixJQUFJLEVBQUUsUUFBUTthQUNqQixDQUFDLENBQUMsQ0FBQyxrQkFBa0I7UUFDMUIsQ0FBQyxDQUFDLENBQUM7UUFDQywrQkFBMEIsR0FBZSxFQUFFLENBQUM7UUFLNUMsMEJBQXFCLEdBQTZCLEVBQUUsQ0FBQztRQUs3RCxzQkFBc0I7UUFDZCxvQkFBZSxHQUNuQixJQUFJLG9FQUFzQixDQUFDO1lBQ3ZCLENBQUMsRUFBRSxHQUFHO1lBQ04sQ0FBQyxFQUFFLENBQUM7WUFDSixJQUFJLEVBQUUsUUFBUTtTQUNqQixDQUFDLENBQUMsQ0FBQyxpQkFBaUI7UUFDbEIsMkJBQXNCLEdBQ3pCLHdEQUFTLENBQXFCLGtFQUFvQixFQUFFLEdBQUcsRUFBRTtZQUNyRCxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztRQUNDLHNCQUFpQixHQUNyQix3REFBUyxDQUF5QixrRUFBb0IsRUFBRSxHQUFHLEVBQUU7WUFDekQsT0FBTyxJQUFJLG9FQUFzQixDQUFDO2dCQUM5QixDQUFDLEVBQUUsQ0FBQztnQkFDSixDQUFDLEVBQUUsRUFBRTtnQkFDTCxJQUFJLEVBQUUsUUFBUTthQUNqQixDQUFDLENBQUMsQ0FBQyxhQUFhO1FBQ3JCLENBQUMsQ0FBQyxDQUFDO1FBQ0EsK0JBQTBCLEdBQzdCLHdEQUFTLENBQXFCLGtFQUFvQixFQUFFLEdBQUcsRUFBRTtZQUNyRCxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztRQUNDLG1CQUFjLEdBQVkseURBQVksRUFBRSxDQUFDO1FBRWpELHVCQUF1QjtRQUNmLHFCQUFnQixHQUNwQixJQUFJLG9FQUFzQixDQUFDO1lBQ3ZCLENBQUMsRUFBRSxHQUFHO1lBQ04sQ0FBQyxFQUFFLENBQUM7WUFDSixJQUFJLEVBQUUsUUFBUTtTQUNqQixDQUFDLENBQUMsQ0FBQyxpQkFBaUI7UUFDbEIsNEJBQXVCLEdBQzFCLHdEQUFTLENBQXFCLGtFQUFvQixFQUFFLEdBQUcsRUFBRTtZQUNyRCxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztRQUNDLHVCQUFrQixHQUN0Qix3REFBUyxDQUF5QixrRUFBb0IsRUFBRSxHQUFHLEVBQUU7WUFDekQsT0FBTyxJQUFJLG9FQUFzQixDQUFDO2dCQUM5QixDQUFDLEVBQUUsQ0FBQztnQkFDSixDQUFDLEVBQUUsRUFBRTtnQkFDTCxJQUFJLEVBQUUsUUFBUTthQUNqQixDQUFDLENBQUMsQ0FBQyxhQUFhO1FBQ3JCLENBQUMsQ0FBQyxDQUFDO1FBQ0EsZ0NBQTJCLEdBQzlCLHdEQUFTLENBQXFCLGtFQUFvQixFQUFFLEdBQUcsRUFBRTtZQUNyRCxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztRQUNDLG9CQUFlLEdBQVkseURBQVksRUFBRSxDQUFDO1FBRWxELE9BQU87UUFDQyxtQkFBYyxHQUFZLHlEQUFZLEVBQUUsQ0FBQztRQUN6QyxvQkFBZSxHQUFZLHlEQUFZLEVBQUUsQ0FBQztRQUMxQywwQkFBcUIsR0FBZSxnRUFBbUIsRUFBRSxDQUFDO1FBQzFELDJCQUFzQixHQUFlLGdFQUFtQixFQUFFLENBQUM7UUFFbkUsYUFBYTtRQUNMLGVBQVUsR0FBa0IsSUFBSSxhQUFhLEVBQUUsQ0FBQztRQUloRCxlQUFVLEdBQTJCLElBQUksb0VBQXNCLENBQUM7WUFDcEUsQ0FBQyxFQUFFLENBQUM7WUFDSixDQUFDLEVBQUUsQ0FBQztZQUNKLElBQUksRUFBRSxRQUFRO1NBQ2pCLENBQUMsQ0FBQztRQUNLLGtCQUFhLEdBQ2pCLElBQUksMkRBQWdCLENBQVMsRUFBRSxDQUFDLENBQUM7UUFDN0IsbUJBQWMsR0FDbEIsSUFBSSwyREFBZ0IsQ0FBUyxFQUFFLENBQUMsQ0FBQztRQUVyQyx3QkFBd0I7UUFDaEIsZ0JBQVcsR0FBdUIsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1FBSXZELG9CQUFlLEdBQXVCLElBQUksa0VBQWtCLENBQUM7WUFDakUsQ0FBQyxFQUFFLENBQUM7WUFDSixDQUFDLEVBQUUsRUFBRTtZQUNMLElBQUksRUFBRSxRQUFRO1NBQ2pCLENBQUMsQ0FBQztRQUVILGdDQUFnQztRQUVoQyxvQ0FBb0M7UUFDNUIsdUJBQWtCLEdBQTJCLEVBQUUsQ0FBQztRQUN4RCw0QkFBNEI7UUFDcEIsbUJBQWMsR0FBMkIsRUFBRSxDQUFDO1FBQzVDLGdCQUFXLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQztRQUVoQyxxQkFBZ0IsR0FDcEIsd0RBQVMsQ0FBcUIsQ0FBQyxFQUFFLEdBQUcsRUFBRTtZQUNsQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztRQUtDLHNCQUFpQixHQUNyQix3REFBUyxDQUFxQixDQUFDLEVBQUUsR0FBRyxFQUFFO1lBQ2xDLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQ2hDLENBQUMsQ0FBQyxDQUFDO1FBS0MsaUJBQVksR0FDaEIsd0RBQVMsQ0FDTCxDQUFDLEVBQUUsaUNBQWlDO1FBQ3BDLEdBQUcsRUFBRTtZQUNELE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQ2hDLENBQUMsQ0FDSixDQUFDO1FBS0MsY0FBUyxHQUFpQyxJQUFJLENBQUM7UUFDL0MscUJBQWdCLEdBQWlDLElBQUksQ0FBQztRQUN0RCxpQkFBWSxHQUFHLElBQUksb0VBQXNCLENBQUM7WUFDN0MsQ0FBQyxFQUFFLENBQUM7WUFDSixDQUFDLEVBQUUsRUFBRTtZQUNMLElBQUksRUFBRSxRQUFRO1NBQ2pCLENBQUMsQ0FBQztRQU9DLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsYUFBYTtRQUN2QyxJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQztRQUNoQyxJQUFJLG9CQUFvQjtZQUNwQixJQUFJLENBQUMscUJBQXFCLEdBQUcsb0JBQW9CLENBQUM7SUFDMUQsQ0FBQztJQXhNRCxpQ0FBaUM7SUFDMUIsaUJBQWlCLENBQUMsS0FBa0I7UUFDdkMsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7SUFDOUIsQ0FBQztJQXNERCxJQUFJLHlCQUF5QjtRQUN6QixPQUFPLElBQUksQ0FBQywwQkFBMEIsQ0FBQztJQUMzQyxDQUFDO0lBR0QsSUFBSSxvQkFBb0I7UUFDcEIsT0FBTyxJQUFJLENBQUMscUJBQXFCLENBQUM7SUFDdEMsQ0FBQztJQTRERCxJQUFJLFNBQVM7UUFDVCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDM0IsQ0FBQztJQWFELElBQUksVUFBVTtRQUNWLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUM1QixDQUFDO0lBbUJELElBQUksZUFBZTtRQUNmLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDO0lBQ2pDLENBQUM7SUFNRCxJQUFJLGdCQUFnQjtRQUNoQixPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztJQUNsQyxDQUFDO0lBU0QsSUFBSSxXQUFXO1FBQ1gsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQzdCLENBQUM7SUFxQkQ7OztPQUdHO0lBQ0kscUJBQXFCLENBQ3hCLElBQTJCLEVBQzNCLFlBQVksR0FBRyxLQUFLO1FBRXBCLGlDQUFpQztRQUNqQyxJQUFJLElBQUksQ0FBQyxrQkFBa0IsSUFBSSxDQUFDLFlBQVk7WUFBRSxPQUFPO1FBRXJELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7UUFFL0IseUJBQXlCO1FBQ3pCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxFQUFFLENBQUM7UUFDN0Isa0VBQWdCLENBQ1osSUFBSSxDQUFDLGtCQUFrQixFQUN2QixDQUFDLENBQXdCLEVBQUUsRUFBRTtZQUN6QixJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksbUVBQW1CLENBQ3JELGdFQUFtQixFQUFFLENBQ3hCLENBQUM7WUFDRixPQUFPLEtBQUssQ0FBQztRQUNqQixDQUFDLENBQ0osQ0FBQztRQUNGLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxPQUFPLENBQUMsT0FBeUI7UUFDcEMsSUFBSSxDQUFDLHFCQUFxQixHQUFHLE9BQU8sQ0FBQztRQUNyQyxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQjtZQUFFLE9BQU87UUFFeEMsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsRUFBRTtZQUNsQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztTQUM3QjtRQUVELElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBRXpCLG9CQUFvQjtRQUNwQiwwQkFBMEI7UUFDMUIsSUFBSSxDQUFDLG9CQUFvQixDQUNyQixJQUFJLENBQUMsYUFBYSxFQUNsQixJQUFJLENBQUMsc0JBQXNCLENBQzlCLENBQUM7UUFDRixJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMsb0JBQW9CLENBQ3JCLElBQUksQ0FBQyxpQkFBaUIsRUFDdEIsSUFBSSxDQUFDLDBCQUEwQixDQUNsQyxDQUFDO1FBQ0YsSUFBSSxDQUFDLG9CQUFvQixDQUNyQixJQUFJLENBQUMsa0JBQWtCLEVBQ3ZCLElBQUksQ0FBQywyQkFBMkIsQ0FDbkMsQ0FBQztRQUVGLG9CQUFvQjtRQUNwQixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFcEIsZ0NBQWdDO1FBQ2hDLDhCQUE4QjtRQUM5QixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFdEIsOEJBQThCO1FBQzlCLDZCQUE2QjtRQUM3QixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFFckIsd0JBQXdCO1FBQ3hCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUV2Qiw0QkFBNEI7UUFDNUIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBRXJCLHVCQUF1QjtRQUN2QixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFFckIsa0JBQWtCO1FBQ2xCLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUU7WUFDN0IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQzNCLDZFQUF5QixDQUNyQixtRkFBK0IsQ0FDM0IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FDOUIsRUFDRCxzREFBTSxDQUNULENBQ0osQ0FBQztZQUNGLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUMvQiw2RUFBeUIsQ0FDckIsbUZBQStCLENBQzNCLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQzlCLEVBQ0Qsc0RBQU0sQ0FDVCxDQUNKLENBQUM7WUFDRixJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FDaEMsNkVBQXlCLENBQ3JCLG1GQUErQixDQUMzQixJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUM5QixFQUNELHNEQUFNLENBQ1QsQ0FDSixDQUFDO1NBQ0w7UUFFRCxNQUFNLFNBQVMsR0FBYSxFQUFFLENBQUM7UUFDL0IsdURBQXVEO1FBQ3ZELCtDQUErQztRQUMvQyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFO1lBQ2xDLElBQ0ksQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsYUFBYSxDQUN0QywwRUFBeUIsQ0FDNUIsQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDLEdBQUcsZ0VBQW9CLEVBQzNDO2dCQUNFLEtBQUssTUFBTSxDQUFDLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyx5RUFBMkIsQ0FBQyxFQUFFO29CQUN0RCxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDO29CQUN2QixTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUN2QjthQUNKO1lBQ0QsSUFDSSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxhQUFhLENBQ3RDLDJFQUEwQixDQUM3QixDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUMsR0FBRyxnRUFBb0IsRUFDM0M7Z0JBQ0UsS0FBSyxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLHlFQUEyQixDQUFDLEVBQUU7b0JBQ3RELE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUM7b0JBQ3hCLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ3ZCO2FBQ0o7U0FDSjtRQUNELElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUU7WUFDOUIsS0FBSyxNQUFNLENBQUMsSUFBSSw2Q0FBRSxFQUFFO2dCQUNoQixLQUFLLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMseUVBQTJCLENBQUMsRUFBRTtvQkFDdEQsTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDbEIsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDdkI7YUFDSjtTQUNKO1FBQ0QsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRTtZQUMzQixLQUFLLE1BQU0sQ0FBQyxJQUFJLDZDQUFFLEVBQUU7Z0JBQ2hCLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUMvQixTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUNsQztTQUNKO1FBQ0QsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRTtZQUMzQixLQUFLLE1BQU0sQ0FBQyxJQUFJLDZDQUFFLEVBQUU7Z0JBQ2hCLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUMvQixTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDL0IsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDOUI7U0FDSjtRQUNELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUVwQyxlQUFlO1FBQ2YsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7SUFDbEMsQ0FBQztJQUVNLGtCQUFrQixDQUFDLFVBQVUsR0FBRyxLQUFLO1FBQ3hDLEtBQUssTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFO1lBQzFELElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLG1GQUErQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbEU7UUFDRCxJQUFJLFVBQVUsRUFBRTtZQUNaLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1NBQ2pDO0lBQ0wsQ0FBQztJQUVPLG1CQUFtQixDQUFDLFNBQW1CO1FBQzNDLEtBQUssTUFBTSxDQUFDLElBQUksU0FBUyxFQUFFO1lBQ3ZCLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDeEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsZ0VBQW1CLEVBQUUsQ0FBQyxDQUFDO2FBQ3JEO1NBQ0o7SUFDTCxDQUFDO0lBRU8sWUFBWTtRQUNoQiw0QkFBNEI7UUFDNUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhO1lBQ3pCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjO1lBQzFCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0I7WUFDNUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM5RCxJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWU7WUFDM0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUU5RCxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWM7WUFDMUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWU7WUFDM0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWM7WUFDMUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWU7WUFDM0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU3RCxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVU7WUFDdEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM5RCxJ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Q2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEVBQUU7V0FDRjs7Ozs7V0NSQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQ0pBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsR0FBRztXQUNIO1dBQ0E7V0FDQSxDQUFDOzs7OztXQ1BEOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0NmQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsYUFBYTtXQUNiO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7Ozs7V0NwQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1VFSEE7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3YzZC13ZWIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL3YzZC13ZWIvLi9zcmMvaGVscGVyL2Jhc2lzLnRzIiwid2VicGFjazovL3YzZC13ZWIvLi9zcmMvaGVscGVyL2ZpbHRlci50cyIsIndlYnBhY2s6Ly92M2Qtd2ViLy4vc3JjL2hlbHBlci9sYW5kbWFyay50cyIsIndlYnBhY2s6Ly92M2Qtd2ViLy4vc3JjL2hlbHBlci9xdWF0ZXJuaW9uLnRzIiwid2VicGFjazovL3YzZC13ZWIvLi9zcmMvaGVscGVyL3V0aWxzLnRzIiwid2VicGFjazovL3YzZC13ZWIvLi9zcmMvd29ya2VyL3Bvc2UtcHJvY2Vzc2luZy50cyIsIndlYnBhY2s6Ly92M2Qtd2ViL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3YzZC13ZWIvd2VicGFjay9ydW50aW1lL2NodW5rIGxvYWRlZCIsIndlYnBhY2s6Ly92M2Qtd2ViL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3YzZC13ZWIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3YzZC13ZWIvd2VicGFjay9ydW50aW1lL2Vuc3VyZSBjaHVuayIsIndlYnBhY2s6Ly92M2Qtd2ViL3dlYnBhY2svcnVudGltZS9nZXQgamF2YXNjcmlwdCBjaHVuayBmaWxlbmFtZSIsIndlYnBhY2s6Ly92M2Qtd2ViL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vdjNkLXdlYi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3YzZC13ZWIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly92M2Qtd2ViL3dlYnBhY2svcnVudGltZS9wdWJsaWNQYXRoIiwid2VicGFjazovL3YzZC13ZWIvd2VicGFjay9ydW50aW1lL2ltcG9ydFNjcmlwdHMgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly92M2Qtd2ViL3dlYnBhY2svcnVudGltZS9zdGFydHVwIGNodW5rIGRlcGVuZGVuY2llcyIsIndlYnBhY2s6Ly92M2Qtd2ViL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vdjNkLXdlYi93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vdjNkLXdlYi93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1widjNkLXdlYlwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJ2M2Qtd2ViXCJdID0gZmFjdG9yeSgpO1xufSkoc2VsZiwgZnVuY3Rpb24oKSB7XG5yZXR1cm4gIiwiLypcbkNvcHlyaWdodCAoQykgMjAyMiAgVGhlIHYzZCBBdXRob3JzLlxuXG4gICAgVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAgICBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAgICB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCB2ZXJzaW9uIDMuXG5cbiAgICBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAgICBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICAgIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAgICBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuICAgIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICAgIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG4vLyBDYWxjdWxhdGUgM0Qgcm90YXRpb25zXG5pbXBvcnQge051bGxhYmxlLCBQbGFuZSwgUXVhdGVybmlvbiwgVmVjdG9yM30gZnJvbSBcIkBiYWJ5bG9uanMvY29yZVwiO1xuaW1wb3J0IHtBWElTLCB2ZWN0b3JzU2FtZURpcldpdGhpbkVwc30gZnJvbSBcIi4vcXVhdGVybmlvblwiO1xuaW1wb3J0IHtzZXRFcXVhbCwgdmFsaWRWZWN0b3IzfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5leHBvcnQgdHlwZSBWZWN0b3IzMyA9IFtWZWN0b3IzLCBWZWN0b3IzLCBWZWN0b3IzXTtcblxuZXhwb3J0IGNsYXNzIEJhc2lzIHtcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBPUklHSU5BTF9DQVJURVNJQU5fQkFTSVNfVkVDVE9SUzogVmVjdG9yMzMgPSBbXG4gICAgICAgIG5ldyBWZWN0b3IzKDEsIDAsIDApLFxuICAgICAgICBuZXcgVmVjdG9yMygwLCAxLCAwKSxcbiAgICAgICAgbmV3IFZlY3RvcjMoMCwgMCwgMSksXG4gICAgXTtcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2RhdGE6IFZlY3RvcjMzID0gQmFzaXMuZ2V0T3JpZ2luYWxDb29yZFZlY3RvcnMoKTtcblxuICAgIGdldCB4KCk6IFZlY3RvcjMge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVswXTtcbiAgICB9XG5cbiAgICBnZXQgeSgpOiBWZWN0b3IzIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFbMV07XG4gICAgfVxuXG4gICAgZ2V0IHooKTogVmVjdG9yMyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhWzJdO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICB2MzM6IE51bGxhYmxlPFZlY3RvcjMzPixcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBsZWZ0SGFuZGVkID0gdHJ1ZSxcbiAgICAgICAgcHJpdmF0ZSBlcHMgPSAxZS02XG4gICAgKSB7XG4gICAgICAgIGlmICh2MzMgJiYgdjMzLmV2ZXJ5KCh2KSA9PiB2YWxpZFZlY3RvcjModikpKVxuICAgICAgICAgICAgdGhpcy5zZXQodjMzKTtcbiAgICAgICAgdGhpcy5fZGF0YS5mb3JFYWNoKCh2KSA9PiB7XG4gICAgICAgICAgICBPYmplY3QuZnJlZXplKHYpO1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0KHYzMzogVmVjdG9yMzMpIHtcbiAgICAgICAgdGhpcy54LmNvcHlGcm9tKHYzM1swXSk7XG4gICAgICAgIHRoaXMueS5jb3B5RnJvbSh2MzNbMV0pO1xuICAgICAgICB0aGlzLnouY29weUZyb20odjMzWzJdKTtcblxuICAgICAgICB0aGlzLnZlcmlmeUJhc2lzKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHZlcmlmeUJhc2lzKCkge1xuICAgICAgICBjb25zdCB6ID0gdGhpcy5sZWZ0SGFuZGVkID8gdGhpcy56IDogdGhpcy56Lm5lZ2F0ZSgpO1xuICAgICAgICBpZiAoIXZlY3RvcnNTYW1lRGlyV2l0aGluRXBzKHRoaXMueC5jcm9zcyh0aGlzLnkpLCB6LCB0aGlzLmVwcykpXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIkJhc2lzIGlzIG5vdCBjb3JyZWN0IVwiKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcm90YXRlQnlRdWF0ZXJuaW9uKHE6IFF1YXRlcm5pb24pOiBCYXNpcyB7XG4gICAgICAgIGNvbnN0IG5ld0Jhc2lzVmVjdG9yczogVmVjdG9yMzMgPSBbVmVjdG9yMy5aZXJvKCksIFZlY3RvcjMuWmVybygpLCBWZWN0b3IzLlplcm8oKV07XG4gICAgICAgIHRoaXMuX2RhdGEubWFwKCh2LCBpKSA9PiB7XG4gICAgICAgICAgICB2LnJvdGF0ZUJ5UXVhdGVybmlvblRvUmVmKHEsIG5ld0Jhc2lzVmVjdG9yc1tpXSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbmV3IEJhc2lzKG5ld0Jhc2lzVmVjdG9ycyk7XG4gICAgfVxuXG4gICAgLy8gQmFzaXMgdmFsaWRpdHkgaXMgbm90IGNoZWNrZWQhXG4gICAgcHVibGljIG5lZ2F0ZUF4ZXMoYXhpczogQVhJUykge1xuICAgICAgICBjb25zdCB4ID0gdGhpcy54LmNsb25lKCk7XG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLnkuY2xvbmUoKTtcbiAgICAgICAgY29uc3QgeiA9IHRoaXMuei5jbG9uZSgpO1xuICAgICAgICBzd2l0Y2ggKGF4aXMpIHtcbiAgICAgICAgICAgIGNhc2UgQVhJUy54OlxuICAgICAgICAgICAgICAgIHgubmVnYXRlSW5QbGFjZSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBWElTLnk6XG4gICAgICAgICAgICAgICAgeS5uZWdhdGVJblBsYWNlKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFYSVMuejpcbiAgICAgICAgICAgICAgICB6Lm5lZ2F0ZUluUGxhY2UoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQVhJUy54eTpcbiAgICAgICAgICAgICAgICB4Lm5lZ2F0ZUluUGxhY2UoKTtcbiAgICAgICAgICAgICAgICB5Lm5lZ2F0ZUluUGxhY2UoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQVhJUy55ejpcbiAgICAgICAgICAgICAgICB5Lm5lZ2F0ZUluUGxhY2UoKTtcbiAgICAgICAgICAgICAgICB6Lm5lZ2F0ZUluUGxhY2UoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQVhJUy54ejpcbiAgICAgICAgICAgICAgICB4Lm5lZ2F0ZUluUGxhY2UoKTtcbiAgICAgICAgICAgICAgICB6Lm5lZ2F0ZUluUGxhY2UoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQVhJUy54eXo6XG4gICAgICAgICAgICAgICAgeC5uZWdhdGVJblBsYWNlKCk7XG4gICAgICAgICAgICAgICAgeS5uZWdhdGVJblBsYWNlKCk7XG4gICAgICAgICAgICAgICAgei5uZWdhdGVJblBsYWNlKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiVW5rbm93biBheGlzIVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgQmFzaXMoW3gsIHksIHpdKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJhbnNwb3NlKG9yZGVyOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0pIHtcbiAgICAgICAgLy8gU2FuaXR5IGNoZWNrXG4gICAgICAgIGlmICghc2V0RXF1YWw8bnVtYmVyPihuZXcgU2V0KG9yZGVyKSwgbmV3IFNldChbMCwgMSwgMl0pKSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkJhc2lzIHRyYW5zcG9zZSBmYWlsZWQ6IHdyb25nIGlucHV0LlwiKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGF0YSA9IFt0aGlzLnguY2xvbmUoKSwgdGhpcy55LmNsb25lKCksIHRoaXMuei5jbG9uZSgpXTtcbiAgICAgICAgY29uc3QgbmV3RGF0YSA9IG9yZGVyLm1hcChpID0+IGRhdGFbaV0pIGFzIFZlY3RvcjMzO1xuXG4gICAgICAgIHJldHVybiBuZXcgQmFzaXMobmV3RGF0YSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0T3JpZ2luYWxDb29yZFZlY3RvcnMoKTogVmVjdG9yMzMge1xuICAgICAgICByZXR1cm4gQmFzaXMuT1JJR0lOQUxfQ0FSVEVTSUFOX0JBU0lTX1ZFQ1RPUlMubWFwKHYgPT4gdi5jbG9uZSgpKSBhcyBWZWN0b3IzMztcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBxdWF0ZXJuaW9uQmV0d2VlbkJhc2VzKFxuICAgIGJhc2lzMTogQmFzaXMsXG4gICAgYmFzaXMyOiBCYXNpcyxcbiAgICBwcmV2UXVhdGVybmlvbj86IFF1YXRlcm5pb25cbikge1xuICAgIGxldCB0aGlzQmFzaXMxID0gYmFzaXMxLCB0aGlzQmFzaXMyID0gYmFzaXMyO1xuICAgIGlmIChwcmV2UXVhdGVybmlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IGV4dHJhUXVhdGVybmlvblIgPSBRdWF0ZXJuaW9uLkludmVyc2UocHJldlF1YXRlcm5pb24pO1xuICAgICAgICB0aGlzQmFzaXMxID0gYmFzaXMxLnJvdGF0ZUJ5UXVhdGVybmlvbihleHRyYVF1YXRlcm5pb25SKTtcbiAgICAgICAgdGhpc0Jhc2lzMiA9IGJhc2lzMi5yb3RhdGVCeVF1YXRlcm5pb24oZXh0cmFRdWF0ZXJuaW9uUik7XG4gICAgfVxuICAgIGNvbnN0IHJvdGF0aW9uQmFzaXMxID0gUXVhdGVybmlvbi5Sb3RhdGlvblF1YXRlcm5pb25Gcm9tQXhpcyhcbiAgICAgICAgdGhpc0Jhc2lzMS54LmNsb25lKCksXG4gICAgICAgIHRoaXNCYXNpczEueS5jbG9uZSgpLFxuICAgICAgICB0aGlzQmFzaXMxLnouY2xvbmUoKSk7XG4gICAgY29uc3Qgcm90YXRpb25CYXNpczIgPSBRdWF0ZXJuaW9uLlJvdGF0aW9uUXVhdGVybmlvbkZyb21BeGlzKFxuICAgICAgICB0aGlzQmFzaXMyLnguY2xvbmUoKSxcbiAgICAgICAgdGhpc0Jhc2lzMi55LmNsb25lKCksXG4gICAgICAgIHRoaXNCYXNpczIuei5jbG9uZSgpKTtcblxuICAgIGNvbnN0IHF1YXRlcm5pb24zMSA9IHJvdGF0aW9uQmFzaXMxLmNsb25lKCkubm9ybWFsaXplKCk7XG4gICAgY29uc3QgcXVhdGVybmlvbjMxUiA9IFF1YXRlcm5pb24uSW52ZXJzZShxdWF0ZXJuaW9uMzEpO1xuICAgIGNvbnN0IHF1YXRlcm5pb24zMiA9IHJvdGF0aW9uQmFzaXMyLmNsb25lKCkubm9ybWFsaXplKCk7XG4gICAgcmV0dXJuIHF1YXRlcm5pb24zMi5tdWx0aXBseShxdWF0ZXJuaW9uMzFSKTtcbn1cblxuLypcbiAqIExlZnQgaGFuZGVkIGZvciBCSlMuXG4gKiBFYWNoIG9iamVjdCBpcyBkZWZpbmVkIGJ5IDMgcG9pbnRzLlxuICogQXNzdW1lIGEgaXMgb3JpZ2luLCBiIHBvaW50cyB0byAreCwgYWJjIGZvcm1zIFhZIHBsYW5lLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0QmFzaXMob2JqOiBWZWN0b3IzMyk6IEJhc2lzIHtcbiAgICBjb25zdCBbYSwgYiwgY10gPSBvYmo7XG4gICAgY29uc3QgcGxhbmVYWSA9IFBsYW5lLkZyb21Qb2ludHMoYSwgYiwgYykubm9ybWFsaXplKCk7XG4gICAgY29uc3QgYXhpc1ggPSBiLnN1YnRyYWN0KGEpLm5vcm1hbGl6ZSgpO1xuICAgIGNvbnN0IGF4aXNaID0gcGxhbmVYWS5ub3JtYWw7XG4gICAgLy8gUHJvamVjdCBjIG9udG8gYWJcbiAgICBjb25zdCBjcCA9IGEuYWRkKFxuICAgICAgICBheGlzWC5zY2FsZShWZWN0b3IzLkRvdChjLnN1YnRyYWN0KGEpLCBheGlzWCkgLyBWZWN0b3IzLkRvdChheGlzWCwgYXhpc1gpKVxuICAgICk7XG4gICAgY29uc3QgYXhpc1kgPSBjLnN1YnRyYWN0KGNwKS5ub3JtYWxpemUoKTtcbiAgICByZXR1cm4gbmV3IEJhc2lzKFtheGlzWCwgYXhpc1ksIGF4aXNaXSk7XG59XG5cbi8vIFByb2plY3QgcG9pbnRzIHRvIGFuIGF2ZXJhZ2UgcGxhbmVcbmV4cG9ydCBmdW5jdGlvbiBjYWxjQXZnUGxhbmUocHRzOiBWZWN0b3IzW10sIG5vcm1hbDogVmVjdG9yMyk6IFZlY3RvcjNbXSB7XG4gICAgaWYgKHB0cy5sZW5ndGggPT09IDApIHJldHVybiBbVmVjdG9yMy5aZXJvKCldO1xuICAgIGNvbnN0IGF2Z1B0ID0gcHRzLnJlZHVjZSgocHJldiwgY3VycikgPT4ge1xuICAgICAgICByZXR1cm4gcHJldi5hZGQoY3Vycik7XG4gICAgfSkuc2NhbGUoMSAvIHB0cy5sZW5ndGgpO1xuXG4gICAgY29uc3QgcmV0ID0gcHRzLm1hcCgodikgPT4ge1xuICAgICAgICByZXR1cm4gdi5zdWJ0cmFjdChub3JtYWwuc2NhbGUoVmVjdG9yMy5Eb3Qobm9ybWFsLCB2LnN1YnRyYWN0KGF2Z1B0KSkpKVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJldDtcbn1cbiIsIi8qXG5Db3B5cmlnaHQgKEMpIDIwMjIgIFRoZSB2M2QgQXV0aG9ycy5cblxuICAgIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gICAgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gICAgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgdmVyc2lvbiAzLlxuXG4gICAgVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gICAgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAgICBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gICAgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiAgICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAgICBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IHsgVmVjdG9yM30gZnJvbSBcIkBiYWJ5bG9uanMvY29yZVwiO1xuaW1wb3J0IEthbG1hbkZpbHRlciBmcm9tIFwia2FsbWFuanNcIjtcblxuZXhwb3J0IGNvbnN0IFZJU0lCSUxJVFlfVEhSRVNIT0xEOiBudW1iZXIgPSAwLjY7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRmlsdGVyUGFyYW1zIHtcbiAgICBSPzogbnVtYmVyLFxuICAgIFE/OiBudW1iZXIsXG4gICAgb25lRXVyb0N1dG9mZj86IG51bWJlcixcbiAgICBvbmVFdXJvQmV0YT86IG51bWJlcixcbiAgICB0eXBlOiBzdHJpbmcsXG4gICAgZ2F1c3NpYW5TaWdtYT86IG51bWJlcixcbn1cblxuLy8gMUQgR2F1c3NpYW4gS2VybmVsXG5leHBvcnQgY29uc3QgZ2F1c3NpYW5LZXJuZWwxZCA9IChmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHNxcjJwaSA9IE1hdGguc3FydCgyICogTWF0aC5QSSk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gZ2F1c3NpYW5LZXJuZWwxZCAoc2l6ZTogbnVtYmVyLCBzaWdtYTogbnVtYmVyKSB7XG4gICAgICAgIC8vIGVuc3VyZSBzaXplIGlzIGV2ZW4gYW5kIHByZXBhcmUgdmFyaWFibGVzXG4gICAgICAgIGxldCB3aWR0aCA9IChzaXplIC8gMikgfCAwLFxuICAgICAgICAgICAga2VybmVsID0gbmV3IEFycmF5KHdpZHRoICogMiArIDEpLFxuICAgICAgICAgICAgbm9ybSA9IDEuMCAvIChzcXIycGkgKiBzaWdtYSksXG4gICAgICAgICAgICBjb2VmZmljaWVudCA9IDIgKiBzaWdtYSAqIHNpZ21hLFxuICAgICAgICAgICAgdG90YWwgPSAwLFxuICAgICAgICAgICAgeDtcblxuICAgICAgICAvLyBzZXQgdmFsdWVzIGFuZCBpbmNyZW1lbnQgdG90YWxcbiAgICAgICAgZm9yICh4ID0gLXdpZHRoOyB4IDw9IHdpZHRoOyB4KyspIHtcbiAgICAgICAgICAgIHRvdGFsICs9IGtlcm5lbFt3aWR0aCArIHhdID0gbm9ybSAqIE1hdGguZXhwKC14ICogeCAvIGNvZWZmaWNpZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGRpdmlkZSBieSB0b3RhbCB0byBtYWtlIHN1cmUgdGhlIHN1bSBvZiBhbGwgdGhlIHZhbHVlcyBpcyBlcXVhbCB0byAxXG4gICAgICAgIGZvciAoeCA9IDA7IHggPCBrZXJuZWwubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIGtlcm5lbFt4XSAvPSB0b3RhbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBrZXJuZWw7XG4gICAgfTtcbn0oKSk7XG5cbi8qXG4gKiBDb252ZXJ0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vamFhbnRvbGxhbmRlci9PbmVFdXJvRmlsdGVyLlxuICovXG5leHBvcnQgY2xhc3MgT25lRXVyb1ZlY3RvckZpbHRlciB7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyB0X3ByZXY6IG51bWJlcixcbiAgICAgICAgcHVibGljIHhfcHJldjogVmVjdG9yMyxcbiAgICAgICAgcHJpdmF0ZSBkeF9wcmV2ID0gVmVjdG9yMy5aZXJvKCksXG4gICAgICAgIHB1YmxpYyBtaW5fY3V0b2ZmID0gMS4wLFxuICAgICAgICBwdWJsaWMgYmV0YSA9IDAuMCxcbiAgICAgICAgcHVibGljIGRfY3V0b2ZmID0gMS4wXG4gICAgKSB7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgc21vb3RoaW5nX2ZhY3Rvcih0X2U6IG51bWJlciwgY3V0b2ZmOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgciA9IDIgKiBNYXRoLlBJICogY3V0b2ZmICogdF9lO1xuICAgICAgICByZXR1cm4gciAvIChyICsgMSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgZXhwb25lbnRpYWxfc21vb3RoaW5nKGE6IG51bWJlciwgeDogVmVjdG9yMywgeF9wcmV2OiBWZWN0b3IzKSB7XG4gICAgICAgIHJldHVybiB4LnNjYWxlKGEpLmFkZEluUGxhY2UoeF9wcmV2LnNjYWxlKCgxIC0gYSkpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmV4dCh0OiBudW1iZXIsIHg6IFZlY3RvcjMpIHtcbiAgICAgICAgY29uc3QgdF9lID0gdCAtIHRoaXMudF9wcmV2O1xuXG4gICAgICAgIC8vIFRoZSBmaWx0ZXJlZCBkZXJpdmF0aXZlIG9mIHRoZSBzaWduYWwuXG4gICAgICAgIGNvbnN0IGFfZCA9IE9uZUV1cm9WZWN0b3JGaWx0ZXIuc21vb3RoaW5nX2ZhY3Rvcih0X2UsIHRoaXMuZF9jdXRvZmYpO1xuICAgICAgICBjb25zdCBkeCA9IHguc3VidHJhY3QodGhpcy54X3ByZXYpLnNjYWxlSW5QbGFjZSgxIC8gdF9lKTtcbiAgICAgICAgY29uc3QgZHhfaGF0ID0gT25lRXVyb1ZlY3RvckZpbHRlci5leHBvbmVudGlhbF9zbW9vdGhpbmcoYV9kLCBkeCwgdGhpcy5keF9wcmV2KTtcblxuICAgICAgICAvLyBUaGUgZmlsdGVyZWQgc2lnbmFsLlxuICAgICAgICBjb25zdCBjdXRvZmYgPSB0aGlzLm1pbl9jdXRvZmYgKyB0aGlzLmJldGEgKiBkeF9oYXQubGVuZ3RoKCk7XG4gICAgICAgIGNvbnN0IGEgPSBPbmVFdXJvVmVjdG9yRmlsdGVyLnNtb290aGluZ19mYWN0b3IodF9lLCBjdXRvZmYpO1xuICAgICAgICBjb25zdCB4X2hhdCA9IE9uZUV1cm9WZWN0b3JGaWx0ZXIuZXhwb25lbnRpYWxfc21vb3RoaW5nKGEsIHgsIHRoaXMueF9wcmV2KTtcblxuICAgICAgICAvLyBNZW1vcml6ZSB0aGUgcHJldmlvdXMgdmFsdWVzLlxuICAgICAgICB0aGlzLnhfcHJldiA9IHhfaGF0O1xuICAgICAgICB0aGlzLmR4X3ByZXYgPSBkeF9oYXQ7XG4gICAgICAgIHRoaXMudF9wcmV2ID0gdDtcblxuICAgICAgICByZXR1cm4geF9oYXQ7XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIEthbG1hblZlY3RvckZpbHRlciB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBrYWxtYW5GaWx0ZXJYO1xuICAgIHByaXZhdGUgcmVhZG9ubHkga2FsbWFuRmlsdGVyWTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGthbG1hbkZpbHRlclo7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyBSID0gMC4xLFxuICAgICAgICBwdWJsaWMgUSA9IDMsXG4gICAgKSB7XG4gICAgICAgIHRoaXMua2FsbWFuRmlsdGVyWCA9IG5ldyBLYWxtYW5GaWx0ZXIoe1E6IFEsIFI6IFJ9KTtcbiAgICAgICAgdGhpcy5rYWxtYW5GaWx0ZXJZID0gbmV3IEthbG1hbkZpbHRlcih7UTogUSwgUjogUn0pO1xuICAgICAgICB0aGlzLmthbG1hbkZpbHRlclogPSBuZXcgS2FsbWFuRmlsdGVyKHtROiBRLCBSOiBSfSk7XG4gICAgfVxuXG4gICAgcHVibGljIG5leHQodDogbnVtYmVyLCB2ZWM6IFZlY3RvcjMpIHtcbiAgICAgICAgY29uc3QgbmV3VmFsdWVzID0gW1xuICAgICAgICAgICAgdGhpcy5rYWxtYW5GaWx0ZXJYLmZpbHRlcih2ZWMueCksXG4gICAgICAgICAgICB0aGlzLmthbG1hbkZpbHRlclkuZmlsdGVyKHZlYy55KSxcbiAgICAgICAgICAgIHRoaXMua2FsbWFuRmlsdGVyWi5maWx0ZXIodmVjLnopLFxuICAgICAgICBdXG5cbiAgICAgICAgcmV0dXJuIFZlY3RvcjMuRnJvbUFycmF5KG5ld1ZhbHVlcyk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgR2F1c3NpYW5WZWN0b3JGaWx0ZXIge1xuICAgIHByaXZhdGUgX3ZhbHVlczogVmVjdG9yM1tdID0gW107XG4gICAgZ2V0IHZhbHVlcygpOiBWZWN0b3IzW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWVzO1xuICAgIH1cbiAgICBwcml2YXRlIHJlYWRvbmx5IGtlcm5lbDogbnVtYmVyW107XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHVibGljIHJlYWRvbmx5IHNpemU6IG51bWJlcixcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBzaWdtYTogbnVtYmVyXG4gICAgKSB7XG4gICAgICAgIGlmIChzaXplIDwgMikgdGhyb3cgUmFuZ2VFcnJvcihcIkZpbHRlciBzaXplIHRvbyBzaG9ydFwiKTtcbiAgICAgICAgdGhpcy5zaXplID0gTWF0aC5mbG9vcihzaXplKTtcbiAgICAgICAgdGhpcy5rZXJuZWwgPSBnYXVzc2lhbktlcm5lbDFkKHNpemUsIHNpZ21hKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcHVzaCh2OiBWZWN0b3IzKSB7XG4gICAgICAgIHRoaXMudmFsdWVzLnB1c2godik7XG5cbiAgICAgICAgaWYgKHRoaXMudmFsdWVzLmxlbmd0aCA9PT0gdGhpcy5zaXplICsgMSkge1xuICAgICAgICAgICAgdGhpcy52YWx1ZXMuc2hpZnQoKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnZhbHVlcy5sZW5ndGggPiB0aGlzLnNpemUgKyAxKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYEludGVybmFsIHF1ZXVlIGhhcyBsZW5ndGggbG9uZ2VyIHRoYW4gc2l6ZTogJHt0aGlzLnNpemV9YCk7XG4gICAgICAgICAgICB0aGlzLnZhbHVlcy5zbGljZSgtdGhpcy5zaXplKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyByZXNldCgpIHtcbiAgICAgICAgdGhpcy52YWx1ZXMubGVuZ3RoID0gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXBwbHkoKSB7XG4gICAgICAgIGlmICh0aGlzLnZhbHVlcy5sZW5ndGggIT09IHRoaXMuc2l6ZSkgcmV0dXJuIFZlY3RvcjMuWmVybygpO1xuICAgICAgICBjb25zdCByZXQgPSBWZWN0b3IzLlplcm8oKTtcbiAgICAgICAgY29uc3QgbGVuMCA9IHJldC5sZW5ndGgoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNpemU7ICsraSkge1xuICAgICAgICAgICAgcmV0LmFkZEluUGxhY2UodGhpcy52YWx1ZXNbaV0uc2NhbGUodGhpcy5rZXJuZWxbaV0pKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsZW4xID0gcmV0Lmxlbmd0aCgpO1xuICAgICAgICAvLyBOb3JtYWxpemUgdG8gb3JpZ2luYWwgbGVuZ3RoXG4gICAgICAgIHJldC5zY2FsZUluUGxhY2UobGVuMCAvIGxlbjEpO1xuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRXVjbGlkZWFuSGlnaFBhc3NGaWx0ZXIge1xuICAgIHByaXZhdGUgX3ZhbHVlOiBWZWN0b3IzID0gVmVjdG9yMy5aZXJvKCk7XG4gICAgZ2V0IHZhbHVlKCk6IFZlY3RvcjMge1xuICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgdGhyZXNob2xkOiBudW1iZXJcbiAgICApIHt9XG5cbiAgICBwdWJsaWMgdXBkYXRlKHY6IFZlY3RvcjMpIHtcbiAgICAgICAgaWYgKHRoaXMudmFsdWUuc3VidHJhY3QodikubGVuZ3RoKCkgPiB0aGlzLnRocmVzaG9sZCkge1xuICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSB2O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHJlc2V0KCkge1xuICAgICAgICB0aGlzLl92YWx1ZSA9IFZlY3RvcjMuWmVybygpO1xuICAgIH1cbn1cbiIsIi8qXG5Db3B5cmlnaHQgKEMpIDIwMjIgIFRoZSB2M2QgQXV0aG9ycy5cblxuICAgIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gICAgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gICAgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgdmVyc2lvbiAzLlxuXG4gICAgVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gICAgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAgICBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gICAgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiAgICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAgICBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IHtOb3JtYWxpemVkTGFuZG1hcmssIFJlc3VsdHN9IGZyb20gXCJAbWVkaWFwaXBlL2hvbGlzdGljXCI7XG5pbXBvcnQge051bGxhYmxlLCBWZWN0b3IzfSBmcm9tIFwiQGJhYnlsb25qcy9jb3JlXCI7XG5pbXBvcnQge1xuICAgIEZpbHRlclBhcmFtcyxcbiAgICBHYXVzc2lhblZlY3RvckZpbHRlcixcbiAgICBLYWxtYW5WZWN0b3JGaWx0ZXIsXG4gICAgT25lRXVyb1ZlY3RvckZpbHRlcixcbiAgICBWSVNJQklMSVRZX1RIUkVTSE9MRFxufSBmcm9tIFwiLi9maWx0ZXJcIjtcbmltcG9ydCB7b2JqZWN0RmxpcH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuZXhwb3J0IGNsYXNzIEZpbHRlcmVkTGFuZG1hcmtWZWN0b3Ige1xuICAgIHByaXZhdGUgbWFpbkZpbHRlcjogT25lRXVyb1ZlY3RvckZpbHRlciB8IEthbG1hblZlY3RvckZpbHRlcjtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGdhdXNzaWFuVmVjdG9yRmlsdGVyOiBOdWxsYWJsZTxHYXVzc2lhblZlY3RvckZpbHRlcj4gPSBudWxsO1xuXG4gICAgcHJpdmF0ZSBfdCA9IDA7XG4gICAgZ2V0IHQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Q7XG4gICAgfVxuXG4gICAgc2V0IHQodmFsdWU6IG51bWJlcikge1xuICAgICAgICB0aGlzLl90ID0gdmFsdWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfcG9zID0gVmVjdG9yMy5aZXJvKCk7XG4gICAgZ2V0IHBvcygpOiBWZWN0b3IzIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BvcztcbiAgICB9XG5cbiAgICBwdWJsaWMgdmlzaWJpbGl0eTogbnVtYmVyIHwgdW5kZWZpbmVkID0gMDtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwYXJhbXM6IEZpbHRlclBhcmFtcyA9IHtcbiAgICAgICAgICAgIG9uZUV1cm9DdXRvZmY6IDAuMDEsXG4gICAgICAgICAgICBvbmVFdXJvQmV0YTogMCxcbiAgICAgICAgICAgIHR5cGU6ICdPbmVFdXJvJ1xuICAgICAgICB9XG4gICAgKSB7XG4gICAgICAgIGlmIChwYXJhbXMudHlwZSA9PT0gXCJLYWxtYW5cIilcbiAgICAgICAgICAgIHRoaXMubWFpbkZpbHRlciA9IG5ldyBLYWxtYW5WZWN0b3JGaWx0ZXIocGFyYW1zLlIsIHBhcmFtcy5RKTtcbiAgICAgICAgZWxzZSBpZiAocGFyYW1zLnR5cGUgPT09IFwiT25lRXVyb1wiKVxuICAgICAgICAgICAgdGhpcy5tYWluRmlsdGVyID0gbmV3IE9uZUV1cm9WZWN0b3JGaWx0ZXIoXG4gICAgICAgICAgICAgICAgdGhpcy50LFxuICAgICAgICAgICAgICAgIHRoaXMucG9zLFxuICAgICAgICAgICAgICAgIFZlY3RvcjMuWmVybygpLFxuICAgICAgICAgICAgICAgIHBhcmFtcy5vbmVFdXJvQ3V0b2ZmLFxuICAgICAgICAgICAgICAgIHBhcmFtcy5vbmVFdXJvQmV0YSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwiV3JvbmcgZmlsdGVyIHR5cGUhXCIpO1xuICAgICAgICBpZiAocGFyYW1zLmdhdXNzaWFuU2lnbWEpXG4gICAgICAgICAgICB0aGlzLmdhdXNzaWFuVmVjdG9yRmlsdGVyID0gbmV3IEdhdXNzaWFuVmVjdG9yRmlsdGVyKDUsIHBhcmFtcy5nYXVzc2lhblNpZ21hKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdXBkYXRlUG9zaXRpb24ocG9zOiBWZWN0b3IzLCB2aXNpYmlsaXR5PzogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMudCArPSAxO1xuXG4gICAgICAgIC8vIEZhY2UgTWVzaCBoYXMgbm8gdmlzaWJpbGl0eVxuICAgICAgICBpZiAodmlzaWJpbGl0eSA9PT0gdW5kZWZpbmVkIHx8IHZpc2liaWxpdHkgPiBWSVNJQklMSVRZX1RIUkVTSE9MRCkge1xuICAgICAgICAgICAgcG9zID0gdGhpcy5tYWluRmlsdGVyLm5leHQodGhpcy50LCBwb3MpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5nYXVzc2lhblZlY3RvckZpbHRlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2F1c3NpYW5WZWN0b3JGaWx0ZXIucHVzaChwb3MpO1xuICAgICAgICAgICAgICAgIHBvcyA9IHRoaXMuZ2F1c3NpYW5WZWN0b3JGaWx0ZXIuYXBwbHkoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fcG9zID0gcG9zO1xuXG4gICAgICAgICAgICB0aGlzLnZpc2liaWxpdHkgPSB2aXNpYmlsaXR5O1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgdHlwZSBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yTGlzdCA9IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3JbXTtcblxuZXhwb3J0IHR5cGUgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcjMgPSBbXG4gICAgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcixcbiAgICBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yLFxuICAgIEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IsXG5dO1xuXG5leHBvcnQgaW50ZXJmYWNlIENsb25lYWJsZVJlc3VsdHMgZXh0ZW5kcyBPbWl0PFJlc3VsdHMsICdzZWdtZW50YXRpb25NYXNrJyB8ICdpbWFnZSc+IHtcbn1cblxuZXhwb3J0IGNvbnN0IFBPU0VfTEFORE1BUktfTEVOR1RIID0gMzM7XG5leHBvcnQgY29uc3QgRkFDRV9MQU5ETUFSS19MRU5HVEggPSA0Nzg7XG5leHBvcnQgY29uc3QgSEFORF9MQU5ETUFSS19MRU5HVEggPSAyMTtcblxuZXhwb3J0IGNvbnN0IG5vcm1hbGl6ZWRMYW5kbWFya1RvVmVjdG9yID0gKFxuICAgIGw6IE5vcm1hbGl6ZWRMYW5kbWFyayxcbiAgICBzY2FsaW5nID0gMS4sXG4gICAgcmV2ZXJzZVkgPSBmYWxzZSkgPT4ge1xuICAgIHJldHVybiBuZXcgVmVjdG9yMyhcbiAgICAgICAgbC54ICogc2NhbGluZyxcbiAgICAgICAgcmV2ZXJzZVkgPyAtbC55ICogc2NhbGluZyA6IGwueSAqIHNjYWxpbmcsXG4gICAgICAgIGwueiAqIHNjYWxpbmcpO1xufVxuZXhwb3J0IGNvbnN0IHZlY3RvclRvTm9ybWFsaXplZExhbmRtYXJrID0gKGw6IFZlY3RvcjMpOiBOb3JtYWxpemVkTGFuZG1hcmsgPT4ge1xuICAgIHJldHVybiB7eDogbC54LCB5OiBsLnksIHo6IGwuen07XG59O1xuXG5leHBvcnQgY29uc3QgSEFORF9MQU5ETUFSS1MgPSB7XG4gICAgV1JJU1Q6IDAsXG4gICAgVEhVTUJfQ01DOiAxLFxuICAgIFRIVU1CX01DUDogMixcbiAgICBUSFVNQl9JUDogMyxcbiAgICBUSFVNQl9USVA6IDQsXG4gICAgSU5ERVhfRklOR0VSX01DUDogNSxcbiAgICBJTkRFWF9GSU5HRVJfUElQOiA2LFxuICAgIElOREVYX0ZJTkdFUl9ESVA6IDcsXG4gICAgSU5ERVhfRklOR0VSX1RJUDogOCxcbiAgICBNSURETEVfRklOR0VSX01DUDogOSxcbiAgICBNSURETEVfRklOR0VSX1BJUDogMTAsXG4gICAgTUlERExFX0ZJTkdFUl9ESVA6IDExLFxuICAgIE1JRERMRV9GSU5HRVJfVElQOiAxMixcbiAgICBSSU5HX0ZJTkdFUl9NQ1A6IDEzLFxuICAgIFJJTkdfRklOR0VSX1BJUDogMTQsXG4gICAgUklOR19GSU5HRVJfRElQOiAxNSxcbiAgICBSSU5HX0ZJTkdFUl9USVA6IDE2LFxuICAgIFBJTktZX01DUDogMTcsXG4gICAgUElOS1lfUElQOiAxOCxcbiAgICBQSU5LWV9ESVA6IDE5LFxuICAgIFBJTktZX1RJUDogMjAsXG59O1xuXG5leHBvcnQgY29uc3QgSEFORF9MQU5ETUFSS1NfQk9ORV9NQVBQSU5HID0ge1xuICAgIEhhbmQ6IEhBTkRfTEFORE1BUktTLldSSVNULFxuICAgIFRodW1iUHJveGltYWw6IEhBTkRfTEFORE1BUktTLlRIVU1CX0NNQyxcbiAgICBUaHVtYkludGVybWVkaWF0ZTogSEFORF9MQU5ETUFSS1MuVEhVTUJfTUNQLFxuICAgIFRodW1iRGlzdGFsOiBIQU5EX0xBTkRNQVJLUy5USFVNQl9JUCxcbiAgICBJbmRleFByb3hpbWFsOiBIQU5EX0xBTkRNQVJLUy5JTkRFWF9GSU5HRVJfTUNQLFxuICAgIEluZGV4SW50ZXJtZWRpYXRlOiBIQU5EX0xBTkRNQVJLUy5JTkRFWF9GSU5HRVJfUElQLFxuICAgIEluZGV4RGlzdGFsOiBIQU5EX0xBTkRNQVJLUy5JTkRFWF9GSU5HRVJfRElQLFxuICAgIE1pZGRsZVByb3hpbWFsOiBIQU5EX0xBTkRNQVJLUy5NSURETEVfRklOR0VSX01DUCxcbiAgICBNaWRkbGVJbnRlcm1lZGlhdGU6IEhBTkRfTEFORE1BUktTLk1JRERMRV9GSU5HRVJfUElQLFxuICAgIE1pZGRsZURpc3RhbDogSEFORF9MQU5ETUFSS1MuTUlERExFX0ZJTkdFUl9ESVAsXG4gICAgUmluZ1Byb3hpbWFsOiBIQU5EX0xBTkRNQVJLUy5SSU5HX0ZJTkdFUl9NQ1AsXG4gICAgUmluZ0ludGVybWVkaWF0ZTogSEFORF9MQU5ETUFSS1MuUklOR19GSU5HRVJfUElQLFxuICAgIFJpbmdEaXN0YWw6IEhBTkRfTEFORE1BUktTLlJJTkdfRklOR0VSX0RJUCxcbiAgICBMaXR0bGVQcm94aW1hbDogSEFORF9MQU5ETUFSS1MuUElOS1lfTUNQLFxuICAgIExpdHRsZUludGVybWVkaWF0ZTogSEFORF9MQU5ETUFSS1MuUElOS1lfUElQLFxuICAgIExpdHRsZURpc3RhbDogSEFORF9MQU5ETUFSS1MuUElOS1lfRElQLFxufTtcbmV4cG9ydCBjb25zdCBIQU5EX0xBTkRNQVJLU19CT05FX1JFVkVSU0VfTUFQUElORzogeyBba2V5OiBudW1iZXJdOiBzdHJpbmcgfSA9IG9iamVjdEZsaXAoSEFORF9MQU5ETUFSS1NfQk9ORV9NQVBQSU5HKTtcbmV4cG9ydCB0eXBlIEhhbmRCb25lTWFwcGluZ0tleSA9IGtleW9mIHR5cGVvZiBIQU5EX0xBTkRNQVJLU19CT05FX01BUFBJTkc7XG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kTGFuZE1hcmtUb0JvbmVOYW1lKGxhbmRtYXJrOiBudW1iZXIsIGlzTGVmdDogYm9vbGVhbikge1xuICAgIGlmICghKGxhbmRtYXJrIGluIEhBTkRfTEFORE1BUktTX0JPTkVfUkVWRVJTRV9NQVBQSU5HKSkgdGhyb3cgRXJyb3IoXCJXcm9uZyBsYW5kbWFyayBnaXZlbiFcIik7XG4gICAgcmV0dXJuIChpc0xlZnQgPyAnbGVmdCcgOiAncmlnaHQnKSArIEhBTkRfTEFORE1BUktTX0JPTkVfUkVWRVJTRV9NQVBQSU5HW2xhbmRtYXJrXTtcbn1cblxuLypcbiAqIERlcHRoLWZpcnN0IHNlYXJjaC93YWxrIG9mIGEgZ2VuZXJpYyB0cmVlLlxuICogQWxzbyByZXR1cm5zIGEgbWFwIGZvciBiYWNrdHJhY2tpbmcgZnJvbSBsZWFmLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVwdGhGaXJzdFNlYXJjaChcbiAgICByb290Tm9kZTogYW55LFxuICAgIGY6IChuOiBhbnkpID0+IGJvb2xlYW5cbik6IFthbnksIGFueV0ge1xuICAgIGNvbnN0IHN0YWNrID0gW107XG4gICAgY29uc3QgcGFyZW50TWFwOiBNYXA8YW55LCBhbnk+ID0gbmV3IE1hcDxhbnksIGFueT4oKTtcbiAgICBzdGFjay5wdXNoKHJvb3ROb2RlKTtcblxuICAgIHdoaWxlIChzdGFjay5sZW5ndGggIT09IDApIHtcbiAgICAgICAgLy8gcmVtb3ZlIHRoZSBmaXJzdCBjaGlsZCBpbiB0aGUgc3RhY2tcbiAgICAgICAgY29uc3QgY3VycmVudE5vZGU6IGFueSA9IHN0YWNrLnNwbGljZSgtMSwgMSlbMF07XG4gICAgICAgIGNvbnN0IHJldFZhbCA9IGYoY3VycmVudE5vZGUpO1xuICAgICAgICBpZiAocmV0VmFsKSByZXR1cm4gW2N1cnJlbnROb2RlLCBwYXJlbnRNYXBdO1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRDaGlsZHJlbiA9IGN1cnJlbnROb2RlLmNoaWxkcmVuO1xuICAgICAgICAvLyBhZGQgYW55IGNoaWxkcmVuIGluIHRoZSBub2RlIGF0IHRoZSB0b3Agb2YgdGhlIHN0YWNrXG4gICAgICAgIGlmIChjdXJyZW50Q2hpbGRyZW4gIT09IG51bGwpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBjdXJyZW50Q2hpbGRyZW4ubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2hpbGQgPSBjdXJyZW50Q2hpbGRyZW5baW5kZXhdO1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgICAgIGlmICghKHBhcmVudE1hcC5oYXMoY2hpbGQpKSkge1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnRNYXAuc2V0KGNoaWxkLCBjdXJyZW50Tm9kZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbbnVsbCwgbnVsbF07XG59XG4iLCIvKlxuQ29weXJpZ2h0IChDKSAyMDIyICBUaGUgdjNkIEF1dGhvcnMuXG5cbiAgICBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICAgIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICAgIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIHZlcnNpb24gMy5cblxuICAgIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICAgIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gICAgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICAgIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4gICAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gICAgYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbmltcG9ydCB7TnVsbGFibGUsIFF1YXRlcm5pb24sIEFuZ2xlLCBWZWN0b3IzLCBQbGFuZX0gZnJvbSBcIkBiYWJ5bG9uanMvY29yZVwiO1xuaW1wb3J0IHtyYW5nZUNhcH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7QmFzaXMsIHF1YXRlcm5pb25CZXR3ZWVuQmFzZXN9IGZyb20gXCIuL2Jhc2lzXCI7XG5pbXBvcnQge3ZlY3RvclRvTm9ybWFsaXplZExhbmRtYXJrfSBmcm9tIFwiLi9sYW5kbWFya1wiO1xuaW1wb3J0IHtcbiAgICBGaWx0ZXJQYXJhbXMsXG4gICAgR2F1c3NpYW5WZWN0b3JGaWx0ZXIsXG4gICAgS2FsbWFuVmVjdG9yRmlsdGVyLFxufSBmcm9tIFwiLi9maWx0ZXJcIjtcblxuZXhwb3J0IGNsYXNzIENsb25lYWJsZVF1YXRlcm5pb25MaXRlIHtcbiAgICBwdWJsaWMgeDogbnVtYmVyID0gMDtcbiAgICBwdWJsaWMgeTogbnVtYmVyID0gMDtcbiAgICBwdWJsaWMgejogbnVtYmVyID0gMDtcbiAgICBwdWJsaWMgdzogbnVtYmVyID0gMTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBxOiBOdWxsYWJsZTxRdWF0ZXJuaW9uPixcbiAgICApIHtcbiAgICAgICAgaWYgKHEpIHtcbiAgICAgICAgICAgIHRoaXMueCA9IHEueDtcbiAgICAgICAgICAgIHRoaXMueSA9IHEueTtcbiAgICAgICAgICAgIHRoaXMueiA9IHEuejtcbiAgICAgICAgICAgIHRoaXMudyA9IHEudztcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIENsb25lYWJsZVF1YXRlcm5pb24gZXh0ZW5kcyBDbG9uZWFibGVRdWF0ZXJuaW9uTGl0ZSB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBfYmFzZUJhc2lzOiBCYXNpcztcbiAgICBnZXQgYmFzZUJhc2lzKCk6IEJhc2lzIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Jhc2VCYXNpcztcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcTogTnVsbGFibGU8UXVhdGVybmlvbj4sXG4gICAgICAgIGJhc2lzPzogQmFzaXNcbiAgICApIHtcbiAgICAgICAgc3VwZXIocSk7XG4gICAgICAgIHRoaXMuX2Jhc2VCYXNpcyA9IGJhc2lzID8gYmFzaXMgOiBuZXcgQmFzaXMobnVsbCk7XG4gICAgfVxuXG4gICAgcHVibGljIHNldChxOiBRdWF0ZXJuaW9uKSB7XG4gICAgICAgIHRoaXMueCA9IHEueDtcbiAgICAgICAgdGhpcy55ID0gcS55O1xuICAgICAgICB0aGlzLnogPSBxLno7XG4gICAgICAgIHRoaXMudyA9IHEudztcbiAgICB9XG5cbiAgICBwdWJsaWMgcm90YXRlQmFzaXMocTogUXVhdGVybmlvbik6IEJhc2lzIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Jhc2VCYXNpcy5yb3RhdGVCeVF1YXRlcm5pb24ocSk7XG4gICAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIENsb25lYWJsZVF1YXRlcm5pb25NYXAge1xuICAgIFtrZXk6IHN0cmluZ106IENsb25lYWJsZVF1YXRlcm5pb25cbn1cblxuZXhwb3J0IHR5cGUgQ2xvbmVhYmxlUXVhdGVybmlvbkxpc3QgPSBDbG9uZWFibGVRdWF0ZXJuaW9uW107XG5leHBvcnQgY29uc3QgY2xvbmVhYmxlUXVhdGVybmlvblRvUXVhdGVybmlvbiA9IChxOiBDbG9uZWFibGVRdWF0ZXJuaW9uTGl0ZSk6IFF1YXRlcm5pb24gPT4ge1xuICAgIGNvbnN0IHJldCA9IG5ldyBRdWF0ZXJuaW9uKHEueCwgcS55LCBxLnosIHEudyk7XG4gICAgcmV0dXJuIHJldDtcbn07XG5cbmV4cG9ydCBjbGFzcyBGaWx0ZXJlZFF1YXRlcm5pb24ge1xuICAgIHByaXZhdGUgbWFpbkZpbHRlcjogS2FsbWFuVmVjdG9yRmlsdGVyO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgZ2F1c3NpYW5WZWN0b3JGaWx0ZXI6IE51bGxhYmxlPEdhdXNzaWFuVmVjdG9yRmlsdGVyPiA9IG51bGw7XG5cbiAgICBwcml2YXRlIF90ID0gMDtcbiAgICBnZXQgdCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fdDtcbiAgICB9XG4gICAgc2V0IHQodmFsdWU6IG51bWJlcikge1xuICAgICAgICB0aGlzLl90ID0gdmFsdWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfcm90ID0gUXVhdGVybmlvbi5JZGVudGl0eSgpO1xuICAgIGdldCByb3QoKTogUXVhdGVybmlvbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yb3Q7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHBhcmFtczogRmlsdGVyUGFyYW1zID0ge1xuICAgICAgICAgICAgUjogMSxcbiAgICAgICAgICAgIFE6IDEsXG4gICAgICAgICAgICB0eXBlOiAnS2FsbWFuJ1xuICAgICAgICB9XG4gICAgKSB7XG4gICAgICAgIGlmIChwYXJhbXMudHlwZSA9PT0gXCJLYWxtYW5cIilcbiAgICAgICAgICAgIHRoaXMubWFpbkZpbHRlciA9IG5ldyBLYWxtYW5WZWN0b3JGaWx0ZXIocGFyYW1zLlIsIHBhcmFtcy5RKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJXcm9uZyBmaWx0ZXIgdHlwZSFcIik7XG4gICAgICAgIGlmIChwYXJhbXMuZ2F1c3NpYW5TaWdtYSlcbiAgICAgICAgICAgIHRoaXMuZ2F1c3NpYW5WZWN0b3JGaWx0ZXIgPSBuZXcgR2F1c3NpYW5WZWN0b3JGaWx0ZXIoNSwgcGFyYW1zLmdhdXNzaWFuU2lnbWEpO1xuICAgIH1cblxuICAgIHB1YmxpYyB1cGRhdGVSb3RhdGlvbihyb3Q6IFF1YXRlcm5pb24pIHtcbiAgICAgICAgdGhpcy50ICs9IDE7XG4gICAgICAgIGxldCBhbmdsZXMgPSByb3QudG9FdWxlckFuZ2xlcygpO1xuICAgICAgICBhbmdsZXMgPSB0aGlzLm1haW5GaWx0ZXIubmV4dCh0aGlzLnQsIGFuZ2xlcyk7XG5cbiAgICAgICAgaWYgKHRoaXMuZ2F1c3NpYW5WZWN0b3JGaWx0ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZ2F1c3NpYW5WZWN0b3JGaWx0ZXIucHVzaChhbmdsZXMpO1xuICAgICAgICAgICAgYW5nbGVzID0gdGhpcy5nYXVzc2lhblZlY3RvckZpbHRlci5hcHBseSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fcm90ID0gUXVhdGVybmlvbi5Gcm9tRXVsZXJWZWN0b3IoYW5nbGVzKTtcbiAgICB9XG59XG5cbmV4cG9ydCB0eXBlIEZpbHRlcmVkUXVhdGVybmlvbkxpc3QgPSBGaWx0ZXJlZFF1YXRlcm5pb25bXTtcblxuXG5leHBvcnQgZW51bSBBWElTIHtcbiAgICB4LFxuICAgIHksXG4gICAgeixcbiAgICB4eSxcbiAgICB5eixcbiAgICB4eixcbiAgICB4eXosXG4gICAgbm9uZSA9IDEwXG59XG5cbi8vIENvbnZlbmllbmNlIGZ1bmN0aW9uc1xuZXhwb3J0IGNvbnN0IFJhZFRvRGVnID0gKHI6IG51bWJlcikgPT4ge1xuICAgIHJldHVybiBBbmdsZS5Gcm9tUmFkaWFucyhyKS5kZWdyZWVzKCk7XG59XG5leHBvcnQgY29uc3QgRGVnVG9SYWQgPSAoZDogbnVtYmVyKSA9PiB7XG4gICAgcmV0dXJuIEFuZ2xlLkZyb21EZWdyZWVzKGQpLnJhZGlhbnMoKTtcbn1cblxuLyoqXG4gKiBDaGVjayBhIHF1YXRlcm5pb24gaXMgdmFsaWRcbiAqIEBwYXJhbSBxIElucHV0IHF1YXRlcm5pb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrUXVhdGVybmlvbihxOiBRdWF0ZXJuaW9uKSB7XG4gICAgcmV0dXJuIE51bWJlci5pc0Zpbml0ZShxLngpICYmIE51bWJlci5pc0Zpbml0ZShxLnkpICYmIE51bWJlci5pc0Zpbml0ZShxLnopICYmIE51bWJlci5pc0Zpbml0ZShxLncpO1xufVxuXG4vLyBTaW1pbGFyIHRvIHRocmVlLmpzIFF1YXRlcm5pb24uc2V0RnJvbVVuaXRWZWN0b3JzXG5leHBvcnQgY29uc3QgcXVhdGVybmlvbkJldHdlZW5WZWN0b3JzID0gKFxuICAgIHYxOiBWZWN0b3IzLCB2MjogVmVjdG9yMyxcbik6IFF1YXRlcm5pb24gPT4ge1xuICAgIGNvbnN0IGFuZ2xlID0gVmVjdG9yMy5HZXRBbmdsZUJldHdlZW5WZWN0b3JzKHYxLCB2MiwgVmVjdG9yMy5Dcm9zcyh2MSwgdjIpKVxuICAgIGNvbnN0IGF4aXMgPSBWZWN0b3IzLkNyb3NzKHYxLCB2Mik7XG4gICAgYXhpcy5ub3JtYWxpemUoKTtcbiAgICByZXR1cm4gUXVhdGVybmlvbi5Sb3RhdGlvbkF4aXMoYXhpcywgYW5nbGUpO1xufTtcbi8qKlxuICogU2FtZSBhcyBhYm92ZSwgRXVsZXIgYW5nbGUgdmVyc2lvblxuICogQHBhcmFtIHYxIElucHV0IHJvdGF0aW9uIGluIGRlZ3JlZXMgMVxuICogQHBhcmFtIHYyIElucHV0IHJvdGF0aW9uIGluIGRlZ3JlZXMgMlxuICogQHBhcmFtIHJlbWFwRGVncmVlIFdoZXRoZXIgcmUtbWFwIGRlZ3JlZXNcbiAqL1xuZXhwb3J0IGNvbnN0IGRlZ3JlZUJldHdlZW5WZWN0b3JzID0gKFxuICAgIHYxOiBWZWN0b3IzLCB2MjogVmVjdG9yMywgcmVtYXBEZWdyZWUgPSBmYWxzZVxuKSA9PiB7XG4gICAgcmV0dXJuIHF1YXRlcm5pb25Ub0RlZ3JlZXMocXVhdGVybmlvbkJldHdlZW5WZWN0b3JzKHYxLCB2MiksIHJlbWFwRGVncmVlKTtcbn07XG4vKipcbiAqIFJlLW1hcCBkZWdyZWVzIHRvIC0xODAgdG8gMTgwXG4gKiBAcGFyYW0gZGVnIElucHV0IGFuZ2xlIGluIERlZ3JlZXNcbiAqL1xuZXhwb3J0IGNvbnN0IHJlbWFwRGVncmVlV2l0aENhcCA9IChkZWc6IG51bWJlcikgPT4ge1xuICAgIGRlZyA9IHJhbmdlQ2FwKGRlZywgMCwgMzYwKTtcbiAgICByZXR1cm4gZGVnIDwgMTgwID8gZGVnIDogZGVnIC0gMzYwO1xufVxuLyoqXG4gKiBDb252ZXJ0IHF1YXRlcm5pb25zIHRvIGRlZ3JlZXNcbiAqIEBwYXJhbSBxIElucHV0IHF1YXRlcm5pb25cbiAqIEBwYXJhbSByZW1hcERlZ3JlZSB3aGV0aGVyIHJlLW1hcCBkZWdyZWVzXG4gKi9cbmV4cG9ydCBjb25zdCBxdWF0ZXJuaW9uVG9EZWdyZWVzID0gKFxuICAgIHE6IFF1YXRlcm5pb24sXG4gICAgcmVtYXBEZWdyZWUgPSBmYWxzZSxcbikgPT4ge1xuICAgIGNvbnN0IGFuZ2xlcyA9IHEudG9FdWxlckFuZ2xlcygpO1xuICAgIGNvbnN0IHJlbWFwRm4gPSByZW1hcERlZ3JlZSA/IHJlbWFwRGVncmVlV2l0aENhcCA6ICh4OiBudW1iZXIpID0+IHg7XG4gICAgcmV0dXJuIG5ldyBWZWN0b3IzKFxuICAgICAgICByZW1hcEZuKFJhZFRvRGVnKGFuZ2xlcy54KSksXG4gICAgICAgIHJlbWFwRm4oUmFkVG9EZWcoYW5nbGVzLnkpKSxcbiAgICAgICAgcmVtYXBGbihSYWRUb0RlZyhhbmdsZXMueikpLFxuICAgICk7XG59O1xuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgdHdvIGRpcmVjdGlvbnMgYXJlIGNsb3NlIGVub3VnaCB3aXRoaW4gYSBzbWFsbCB2YWx1ZXNcbiAqIEBwYXJhbSB2MSBJbnB1dCBkaXJlY3Rpb24gMVxuICogQHBhcmFtIHYyIElucHV0IGRpcmVjdGlvbiAyXG4gKiBAcGFyYW0gZXBzIEVycm9yIHRocmVzaG9sZFxuICovXG5leHBvcnQgZnVuY3Rpb24gdmVjdG9yc1NhbWVEaXJXaXRoaW5FcHModjE6IFZlY3RvcjMsIHYyOiBWZWN0b3IzLCBlcHMgPSAxZS02KSB7XG4gICAgcmV0dXJuIHYxLmNyb3NzKHYyKS5sZW5ndGgoKSA8IGVwcyAmJiBWZWN0b3IzLkRvdCh2MSwgdjIpID4gMDtcbn1cblxuLyoqXG4gKiBUZXN0IHdoZXRoZXIgdHdvIHF1YXRlcm5pb25zIGhhdmUgZXF1YWwgZWZmZWN0c1xuICogQHBhcmFtIHExIElucHV0IHF1YXRlcm5pb24gMVxuICogQHBhcmFtIHEyIElucHV0IHF1YXRlcm5pb24gMlxuICovXG5leHBvcnQgZnVuY3Rpb24gdGVzdFF1YXRlcm5pb25FcXVhbHNCeVZlY3RvcihxMTogUXVhdGVybmlvbiwgcTI6IFF1YXRlcm5pb24pIHtcbiAgICBjb25zdCB0ZXN0VmVjID0gVmVjdG9yMy5PbmUoKTtcbiAgICBjb25zdCB0ZXN0VmVjMSA9IFZlY3RvcjMuWmVybygpO1xuICAgIGNvbnN0IHRlc3RWZWMyID0gVmVjdG9yMy5PbmUoKTtcbiAgICB0ZXN0VmVjLnJvdGF0ZUJ5UXVhdGVybmlvblRvUmVmKHExLCB0ZXN0VmVjMSk7XG4gICAgdGVzdFZlYy5yb3RhdGVCeVF1YXRlcm5pb25Ub1JlZihxMiwgdGVzdFZlYzIpO1xuICAgIHJldHVybiB2ZWN0b3JzU2FtZURpcldpdGhpbkVwcyh0ZXN0VmVjMSwgdGVzdFZlYzIpO1xufVxuXG4vKipcbiAqIFNhbWUgYXMgYWJvdmUsIEV1bGVyIGFuZ2xlIHZlcnNpb25cbiAqIEBwYXJhbSBkMSBJbnB1dCBkZWdyZWVzIDFcbiAqIEBwYXJhbSBkMiBJbnB1dCBkZWdyZWVzIDJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZ3JlZXNFcXVhbEluUXVhdGVybmlvbihcbiAgICBkMTogVmVjdG9yMywgZDI6IFZlY3RvcjNcbikge1xuICAgIGNvbnN0IHExID0gUXVhdGVybmlvbi5Gcm9tRXVsZXJBbmdsZXMoRGVnVG9SYWQoZDEueCksIERlZ1RvUmFkKGQxLnkpLCBEZWdUb1JhZChkMS56KSk7XG4gICAgY29uc3QgcTIgPSBRdWF0ZXJuaW9uLkZyb21FdWxlckFuZ2xlcyhEZWdUb1JhZChkMi54KSwgRGVnVG9SYWQoZDIueSksIERlZ1RvUmFkKGQyLnopKTtcbiAgICByZXR1cm4gdGVzdFF1YXRlcm5pb25FcXVhbHNCeVZlY3RvcihxMSwgcTIpO1xufVxuXG4vKipcbiAqIFJldmVyc2Ugcm90YXRpb24gRXVsZXIgYW5nbGVzIG9uIGdpdmVuIGF4ZXNcbiAqIEBwYXJhbSBxIElucHV0IHF1YXRlcm5pb25cbiAqIEBwYXJhbSBheGlzIEF4ZXMgdG8gcmV2ZXJzZVxuICovXG5leHBvcnQgY29uc3QgcmV2ZXJzZVJvdGF0aW9uID0gKHE6IFF1YXRlcm5pb24sIGF4aXM6IEFYSVMpID0+IHtcbiAgICBpZiAoYXhpcyA9PT0gQVhJUy5ub25lKSByZXR1cm4gcTtcbiAgICBjb25zdCBhbmdsZXMgPSBxLnRvRXVsZXJBbmdsZXMoKTtcbiAgICBzd2l0Y2ggKGF4aXMpIHtcbiAgICAgICAgY2FzZSBBWElTLng6XG4gICAgICAgICAgICBhbmdsZXMueCA9IC1hbmdsZXMueDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEFYSVMueTpcbiAgICAgICAgICAgIGFuZ2xlcy55ID0gLWFuZ2xlcy55O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQVhJUy56OlxuICAgICAgICAgICAgYW5nbGVzLnogPSAtYW5nbGVzLno7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBBWElTLnh5OlxuICAgICAgICAgICAgYW5nbGVzLnggPSAtYW5nbGVzLng7XG4gICAgICAgICAgICBhbmdsZXMueSA9IC1hbmdsZXMueTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEFYSVMueXo6XG4gICAgICAgICAgICBhbmdsZXMueSA9IC1hbmdsZXMueTtcbiAgICAgICAgICAgIGFuZ2xlcy56ID0gLWFuZ2xlcy56O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQVhJUy54ejpcbiAgICAgICAgICAgIGFuZ2xlcy54ID0gLWFuZ2xlcy54O1xuICAgICAgICAgICAgYW5nbGVzLnogPSAtYW5nbGVzLno7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBBWElTLnh5ejpcbiAgICAgICAgICAgIGFuZ2xlcy54ID0gLWFuZ2xlcy54O1xuICAgICAgICAgICAgYW5nbGVzLnkgPSAtYW5nbGVzLnk7XG4gICAgICAgICAgICBhbmdsZXMueiA9IC1hbmdsZXMuejtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJVbmtub3duIGF4aXMhXCIpO1xuICAgIH1cbiAgICByZXR1cm4gUXVhdGVybmlvbi5Sb3RhdGlvbllhd1BpdGNoUm9sbChhbmdsZXMueSwgYW5nbGVzLngsIGFuZ2xlcy56KTtcbn1cbi8qKlxuICogUmVtb3ZlIHJvdGF0aW9uIG9uIGdpdmVuIGF4ZXMuXG4gKiBPcHRpb25hbGx5IGNhcHBpbmcgcm90YXRpb24gKGluIEV1bGVyIGFuZ2xlcykgb24gdHdvIGF4ZXMuXG4gKiBUaGlzIG9wZXJhdGlvbiBhc3N1bWVzIHJlLW1hcHBlZCBkZWdyZWVzLlxuICogQHBhcmFtIHEgSW5wdXQgcXVhdGVybmlvblxuICogQHBhcmFtIGF4aXMgQXhlcyB0byByZW1vdmVcbiAqIEBwYXJhbSBjYXBBeGlzMSBDYXBwaW5nIGF4aXMgMVxuICogQHBhcmFtIGNhcExvdzEgQXhpcyAxIGxvd2VyIHJhbmdlXG4gKiBAcGFyYW0gY2FwSGlnaDEgQXhpcyAxIGhpZ2hlciByYW5nZVxuICogQHBhcmFtIGNhcEF4aXMyIENhcHBpbmcgYXhpcyAyXG4gKiBAcGFyYW0gY2FwTG93MiBBeGlzIDIgbG93ZXIgcmFuZ2VcbiAqIEBwYXJhbSBjYXBIaWdoMiBBeGlzIDIgaGlnaGVyIHJhbmdlXG4gKi9cbmV4cG9ydCBjb25zdCByZW1vdmVSb3RhdGlvbkF4aXNXaXRoQ2FwID0gKFxuICAgIHE6IFF1YXRlcm5pb24sXG4gICAgYXhpczogQVhJUyxcbiAgICBjYXBBeGlzMT86IEFYSVMsXG4gICAgY2FwTG93MT86IG51bWJlcixcbiAgICBjYXBIaWdoMT86IG51bWJlcixcbiAgICBjYXBBeGlzMj86IEFYSVMsXG4gICAgY2FwTG93Mj86IG51bWJlcixcbiAgICBjYXBIaWdoMj86IG51bWJlcixcbikgPT4ge1xuICAgIGNvbnN0IGFuZ2xlcyA9IHF1YXRlcm5pb25Ub0RlZ3JlZXMocSwgdHJ1ZSk7XG4gICAgc3dpdGNoIChheGlzKSB7XG4gICAgICAgIGNhc2UgQVhJUy5ub25lOlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQVhJUy54OlxuICAgICAgICAgICAgYW5nbGVzLnggPSAwO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQVhJUy55OlxuICAgICAgICAgICAgYW5nbGVzLnkgPSAwO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQVhJUy56OlxuICAgICAgICAgICAgYW5nbGVzLnogPSAwO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQVhJUy54eTpcbiAgICAgICAgICAgIGFuZ2xlcy54ID0gMDtcbiAgICAgICAgICAgIGFuZ2xlcy55ID0gMDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEFYSVMueXo6XG4gICAgICAgICAgICBhbmdsZXMueSA9IDA7XG4gICAgICAgICAgICBhbmdsZXMueiA9IDA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBBWElTLnh6OlxuICAgICAgICAgICAgYW5nbGVzLnggPSAwO1xuICAgICAgICAgICAgYW5nbGVzLnogPSAwO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQVhJUy54eXo6XG4gICAgICAgICAgICBhbmdsZXMueCA9IDA7XG4gICAgICAgICAgICBhbmdsZXMueSA9IDA7XG4gICAgICAgICAgICBhbmdsZXMueiA9IDA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwiVW5rbm93biBheGlzIVwiKTtcbiAgICB9XG4gICAgaWYgKGNhcEF4aXMxICE9PSB1bmRlZmluZWQgJiYgY2FwTG93MSAhPT0gdW5kZWZpbmVkICYmIGNhcEhpZ2gxICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgc3dpdGNoIChjYXBBeGlzMSBhcyBBWElTKSB7XG4gICAgICAgICAgICBjYXNlIEFYSVMueDpcbiAgICAgICAgICAgICAgICBhbmdsZXMueCA9IHJhbmdlQ2FwKGFuZ2xlcy54LCBjYXBMb3cxLCBjYXBIaWdoMSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFYSVMueTpcbiAgICAgICAgICAgICAgICBhbmdsZXMueSA9IHJhbmdlQ2FwKGFuZ2xlcy55LCBjYXBMb3cxLCBjYXBIaWdoMSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFYSVMuejpcbiAgICAgICAgICAgICAgICBhbmdsZXMueiA9IHJhbmdlQ2FwKGFuZ2xlcy56LCBjYXBMb3cxLCBjYXBIaWdoMSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiVW5rbm93biBjYXAgYXhpcyFcIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGNhcEF4aXMyICE9PSB1bmRlZmluZWQgJiYgY2FwTG93MiAhPT0gdW5kZWZpbmVkICYmIGNhcEhpZ2gyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgc3dpdGNoIChjYXBBeGlzMiBhcyBBWElTKSB7XG4gICAgICAgICAgICBjYXNlIEFYSVMueDpcbiAgICAgICAgICAgICAgICBhbmdsZXMueCA9IHJhbmdlQ2FwKGFuZ2xlcy54LCBjYXBMb3cyLCBjYXBIaWdoMik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFYSVMueTpcbiAgICAgICAgICAgICAgICBhbmdsZXMueSA9IHJhbmdlQ2FwKGFuZ2xlcy55LCBjYXBMb3cyLCBjYXBIaWdoMik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFYSVMuejpcbiAgICAgICAgICAgICAgICBhbmdsZXMueiA9IHJhbmdlQ2FwKGFuZ2xlcy56LCBjYXBMb3cyLCBjYXBIaWdoMik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiVW5rbm93biBjYXAgYXhpcyFcIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFF1YXRlcm5pb24uUm90YXRpb25ZYXdQaXRjaFJvbGwoXG4gICAgICAgIERlZ1RvUmFkKGFuZ2xlcy55KSxcbiAgICAgICAgRGVnVG9SYWQoYW5nbGVzLngpLFxuICAgICAgICBEZWdUb1JhZChhbmdsZXMueikpO1xufVxuLyoqXG4gKiBTd2l0Y2ggcm90YXRpb24gYXhlcy5cbiAqIEBwYXJhbSBxIElucHV0IHF1YXRlcm5pb25cbiAqIEBwYXJhbSBheGlzMSBBeGlzIDEgdG8gc3dpdGNoXG4gKiBAcGFyYW0gYXhpczIgQXhpcyAyIHRvIHN3aXRjaFxuICovXG5leHBvcnQgY29uc3QgZXhjaGFuZ2VSb3RhdGlvbkF4aXMgPSAoXG4gICAgcTogUXVhdGVybmlvbixcbiAgICBheGlzMTogQVhJUyxcbiAgICBheGlzMjogQVhJUyxcbikgPT4ge1xuICAgIGNvbnN0IGFuZ2xlczogbnVtYmVyW10gPSBbXTtcbiAgICBxLnRvRXVsZXJBbmdsZXMoKS50b0FycmF5KGFuZ2xlcyk7XG4gICAgY29uc3QgYW5nbGUxID0gYW5nbGVzW2F4aXMxXTtcbiAgICBjb25zdCBhbmdsZTIgPSBhbmdsZXNbYXhpczJdO1xuICAgIGNvbnN0IHRlbXAgPSBhbmdsZTE7XG4gICAgYW5nbGVzW2F4aXMxXSA9IGFuZ2xlMjtcbiAgICBhbmdsZXNbYXhpczJdID0gdGVtcDtcbiAgICByZXR1cm4gUXVhdGVybmlvbi5Gcm9tRXVsZXJBbmdsZXMoXG4gICAgICAgIGFuZ2xlc1swXSxcbiAgICAgICAgYW5nbGVzWzFdLFxuICAgICAgICBhbmdsZXNbMl0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJpbnRRdWF0ZXJuaW9uKHE6IFF1YXRlcm5pb24sIHM/OiBzdHJpbmcpIHtcbiAgICBjb25zb2xlLmxvZyhzLCB2ZWN0b3JUb05vcm1hbGl6ZWRMYW5kbWFyayhxdWF0ZXJuaW9uVG9EZWdyZWVzKHEsIHRydWUpKSk7XG59XG5cblxuLyoqXG4gKiBSZXN1bHQgaXMgaW4gUmFkaWFuIG9uIHVuaXQgc3BoZXJlIChyID0gMSkuXG4gKiBDYW5vbmljYWwgSVNPIDgwMDAwLTI6MjAxOSBjb252ZW50aW9uLlxuICogQHBhcmFtIHBvcyBFdWNsaWRlYW4gbG9jYWwgcG9zaXRpb25cbiAqIEBwYXJhbSBiYXNpcyBMb2NhbCBjb29yZGluYXRlIHN5c3RlbSBiYXNpc1xuICovXG5leHBvcnQgZnVuY3Rpb24gY2FsY1NwaGVyaWNhbENvb3JkKFxuICAgIHBvczogVmVjdG9yMywgYmFzaXM6IEJhc2lzLFxuKSB7XG4gICAgY29uc3QgcVRvT3JpZ2luYWwgPSBRdWF0ZXJuaW9uLkludmVyc2UoUXVhdGVybmlvbi5Sb3RhdGlvblF1YXRlcm5pb25Gcm9tQXhpcyhcbiAgICAgICAgYmFzaXMueC5jbG9uZSgpLCBiYXNpcy55LmNsb25lKCksIGJhc2lzLnouY2xvbmUoKSkpLm5vcm1hbGl6ZSgpO1xuICAgIGNvbnN0IHBvc0luT3JpZ2luYWwgPSBWZWN0b3IzLlplcm8oKTtcbiAgICBwb3Mucm90YXRlQnlRdWF0ZXJuaW9uVG9SZWYocVRvT3JpZ2luYWwsIHBvc0luT3JpZ2luYWwpO1xuICAgIHBvc0luT3JpZ2luYWwubm9ybWFsaXplKCk7XG5cbiAgICAvLyBDYWxjdWxhdGUgdGhldGEgYW5kIHBoaVxuICAgIGNvbnN0IHggPSBwb3NJbk9yaWdpbmFsLng7XG4gICAgY29uc3QgeSA9IHBvc0luT3JpZ2luYWwueTtcbiAgICBjb25zdCB6ID0gcG9zSW5PcmlnaW5hbC56O1xuXG4gICAgY29uc3QgdGhldGEgPSBNYXRoLmFjb3Moeik7XG4gICAgY29uc3QgcGhpID0gTWF0aC5hdGFuMih5LCB4KTtcblxuICAgIHJldHVybiBbdGhldGEsIHBoaV07XG59XG5cbi8qKlxuICogQXNzdW1pbmcgcm90YXRpb24gc3RhcnRzIGZyb20gKDEsIDAsIDApIGluIGxvY2FsIGNvb3JkaW5hdGUgc3lzdGVtLlxuICogQHBhcmFtIGJhc2lzIExvY2FsIGNvb3JkaW5hdGUgc3lzdGVtIGJhc2lzXG4gKiBAcGFyYW0gdGhldGEgUG9sYXIgYW5nbGVcbiAqIEBwYXJhbSBwaGkgQXppbXV0aGFsIGFuZ2xlXG4gKiBAcGFyYW0gcHJldlF1YXRlcm5pb24gUGFyZW50IHF1YXRlcm5pb24gdG8gdGhlIGxvY2FsIHN5c3RlbVxuICovXG5leHBvcnQgZnVuY3Rpb24gc3BoZXJpY2FsVG9RdWF0ZXJuaW9uKFxuICAgIGJhc2lzOiBCYXNpcywgdGhldGE6IG51bWJlciwgcGhpOiBudW1iZXIsXG4gICAgcHJldlF1YXRlcm5pb246IFF1YXRlcm5pb24pIHtcbiAgICBjb25zdCB4VHogPSBRdWF0ZXJuaW9uLlJvdGF0aW9uQXhpcyhiYXNpcy55LmNsb25lKCksIC1NYXRoLlBJIC8gMik7XG4gICAgY29uc3QgeFR6QmFzaXMgPSBiYXNpcy5yb3RhdGVCeVF1YXRlcm5pb24oeFR6KTtcbiAgICBjb25zdCBxMSA9IFF1YXRlcm5pb24uUm90YXRpb25BeGlzKHhUekJhc2lzLnguY2xvbmUoKSwgcGhpKTtcbiAgICBjb25zdCBxMUJhc2lzID0geFR6QmFzaXMucm90YXRlQnlRdWF0ZXJuaW9uKHExKTtcbiAgICBjb25zdCBxMiA9IFF1YXRlcm5pb24uUm90YXRpb25BeGlzKHExQmFzaXMueS5jbG9uZSgpLCB0aGV0YSk7XG4gICAgY29uc3QgcTJCYXNpcyA9IHExQmFzaXMucm90YXRlQnlRdWF0ZXJuaW9uKHEyKTtcblxuICAgIC8vIEZvcmNlIHJlc3VsdCB0byBmYWNlIGZyb250XG4gICAgY29uc3QgcGxhbmVYWiA9IFBsYW5lLkZyb21Qb3NpdGlvbkFuZE5vcm1hbChWZWN0b3IzLlplcm8oKSwgYmFzaXMueS5jbG9uZSgpKTtcbiAgICAvLyBjb25zdCBpbnRlcm1CYXNpcyA9IGJhc2lzLnJvdGF0ZUJ5UXVhdGVybmlvbih4VHoubXVsdGlwbHkocTEpLm11bHRpcGx5SW5QbGFjZShxMikpO1xuICAgIGNvbnN0IGludGVybUJhc2lzID0gcTJCYXNpcztcbiAgICBjb25zdCBuZXdCYXNpc1ogPSBWZWN0b3IzLkNyb3NzKGludGVybUJhc2lzLnguY2xvbmUoKSwgcGxhbmVYWi5ub3JtYWwpO1xuICAgIGNvbnN0IG5ld0Jhc2lzWSA9IFZlY3RvcjMuQ3Jvc3MobmV3QmFzaXNaLCBpbnRlcm1CYXNpcy54LmNsb25lKCkpO1xuICAgIGNvbnN0IG5ld0Jhc2lzID0gbmV3IEJhc2lzKFtpbnRlcm1CYXNpcy54LCBuZXdCYXNpc1ksIG5ld0Jhc2lzWl0pO1xuXG4gICAgcmV0dXJuIHF1YXRlcm5pb25CZXR3ZWVuQmFzZXMoYmFzaXMsIG5ld0Jhc2lzLCBwcmV2UXVhdGVybmlvbik7XG59XG5cbi8vIFNjYWxlIHJvdGF0aW9uIGFuZ2xlcyBpbiBwbGFjZVxuZXhwb3J0IGZ1bmN0aW9uIHNjYWxlUm90YXRpb24ocXVhdGVybmlvbjogUXVhdGVybmlvbiwgc2NhbGU6IG51bWJlcikge1xuICAgIGNvbnN0IGFuZ2xlcyA9IHF1YXRlcm5pb24udG9FdWxlckFuZ2xlcygpO1xuICAgIGFuZ2xlcy5zY2FsZUluUGxhY2Uoc2NhbGUpO1xuICAgIHJldHVybiBRdWF0ZXJuaW9uLkZyb21FdWxlclZlY3RvcihhbmdsZXMpO1xufVxuIiwiLypcbkNvcHlyaWdodCAoQykgMjAyMSAgVGhlIHYzZCBBdXRob3JzLlxuXG4gICAgVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAgICBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAgICB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCB2ZXJzaW9uIDMuXG5cbiAgICBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAgICBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICAgIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAgICBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuICAgIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICAgIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG5pbXBvcnQge1BsYW5lLCBWZWN0b3IzLCBDdXJ2ZTMsIElMb2FkaW5nU2NyZWVufSBmcm9tIFwiQGJhYnlsb25qcy9jb3JlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0QXJyYXk8VD4obGVuZ3RoOiBudW1iZXIsIGluaXRpYWxpemVyOiAoaTogbnVtYmVyKSA9PiBUKSB7XG4gICAgbGV0IGFyciA9IG5ldyBBcnJheTxUPihsZW5ndGgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspXG4gICAgICAgIGFycltpXSA9IGluaXRpYWxpemVyKGkpO1xuICAgIHJldHVybiBhcnI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByYW5nZShzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlciwgc3RlcDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20oXG4gICAgICAgIHtsZW5ndGg6IE1hdGguY2VpbCgoZW5kIC0gc3RhcnQpIC8gc3RlcCl9LFxuICAgICAgICAoXywgaSkgPT4gc3RhcnQgKyBpICogc3RlcFxuICAgICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsaW5zcGFjZShzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlciwgZGl2OiBudW1iZXIpIHtcbiAgICBjb25zdCBzdGVwID0gKGVuZCAtIHN0YXJ0KSAvIGRpdjtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShcbiAgICAgICAge2xlbmd0aDogZGl2fSxcbiAgICAgICAgKF8sIGkpID0+IHN0YXJ0ICsgaSAqIHN0ZXBcbiAgICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb2JqZWN0RmxpcChvYmo6IGFueSkge1xuICAgIGNvbnN0IHJldDogYW55ID0ge307XG4gICAgT2JqZWN0LmtleXMob2JqKS5mb3JFYWNoKChrZXk6IGFueSkgPT4ge1xuICAgICAgICByZXRbb2JqW2tleV1dID0ga2V5O1xuICAgIH0pO1xuICAgIHJldHVybiByZXQ7XG59XG5cbmV4cG9ydCBjb25zdCByYW5nZUNhcCA9IChcbiAgICB2OiBudW1iZXIsXG4gICAgbWluOiBudW1iZXIsXG4gICAgbWF4OiBudW1iZXJcbikgPT4ge1xuICAgIGlmIChtaW4gPiBtYXgpIHtcbiAgICAgICAgY29uc3QgdG1wID0gbWF4O1xuICAgICAgICBtYXggPSBtaW47XG4gICAgICAgIG1pbiA9IHRtcDtcbiAgICB9XG4gICAgcmV0dXJuIE1hdGgubWF4KE1hdGgubWluKHYsIG1heCksIG1pbik7XG59XG5leHBvcnQgY29uc3QgcmVtYXBSYW5nZSA9IChcbiAgICB2OiBudW1iZXIsXG4gICAgc3JjX2xvdzogbnVtYmVyLFxuICAgIHNyY19oaWdoOiBudW1iZXIsXG4gICAgZHN0X2xvdzogbnVtYmVyLFxuICAgIGRzdF9oaWdoOiBudW1iZXJcbikgPT4ge1xuICAgIHJldHVybiBkc3RfbG93ICsgKHYgLSBzcmNfbG93KSAqIChkc3RfaGlnaCAtIGRzdF9sb3cpIC8gKHNyY19oaWdoIC0gc3JjX2xvdyk7XG59O1xuZXhwb3J0IGNvbnN0IHJlbWFwUmFuZ2VXaXRoQ2FwID0gKFxuICAgIHY6IG51bWJlcixcbiAgICBzcmNfbG93OiBudW1iZXIsXG4gICAgc3JjX2hpZ2g6IG51bWJlcixcbiAgICBkc3RfbG93OiBudW1iZXIsXG4gICAgZHN0X2hpZ2g6IG51bWJlclxuKSA9PiB7XG4gICAgY29uc3QgdjEgPSByYW5nZUNhcCh2LCBzcmNfbG93LCBzcmNfaGlnaCk7XG4gICAgcmV0dXJuIGRzdF9sb3cgKyAodjEgLSBzcmNfbG93KSAqIChkc3RfaGlnaCAtIGRzdF9sb3cpIC8gKHNyY19oaWdoIC0gc3JjX2xvdyk7XG59O1xuZXhwb3J0IGNvbnN0IHJlbWFwUmFuZ2VOb0NhcCA9IChcbiAgICB2OiBudW1iZXIsXG4gICAgc3JjX2xvdzogbnVtYmVyLFxuICAgIHNyY19oaWdoOiBudW1iZXIsXG4gICAgZHN0X2xvdzogbnVtYmVyLFxuICAgIGRzdF9oaWdoOiBudW1iZXJcbikgPT4ge1xuICAgIHJldHVybiBkc3RfbG93ICsgKHYgLSBzcmNfbG93KSAqIChkc3RfaGlnaCAtIGRzdF9sb3cpIC8gKHNyY19oaWdoIC0gc3JjX2xvdyk7XG59O1xuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkVmVjdG9yMyh2OiBWZWN0b3IzKSB7XG4gICAgcmV0dXJuIE51bWJlci5pc0Zpbml0ZSh2LngpICYmIE51bWJlci5pc0Zpbml0ZSh2LnkpICYmIE51bWJlci5pc0Zpbml0ZSh2LnopO1xufVxuXG5leHBvcnQgdHlwZSBLZXlzTWF0Y2hpbmc8VCwgVj4gPSB7IFtLIGluIGtleW9mIFRdLT86IFRbS10gZXh0ZW5kcyBWID8gSyA6IG5ldmVyIH1ba2V5b2YgVF07XG5cbi8vIHR5cGUgTWV0aG9kS2V5c09mQSA9IEtleXNNYXRjaGluZzxBLCBGdW5jdGlvbj47XG5cbmV4cG9ydCB0eXBlIElmRXF1YWxzPFgsIFksIEEgPSBYLCBCID0gbmV2ZXI+ID1cbiAgICAoPFQ+KCkgPT4gVCBleHRlbmRzIFggPyAxIDogMikgZXh0ZW5kcyAoPFQ+KCkgPT4gVCBleHRlbmRzIFkgPyAxIDogMikgPyBBIDogQjtcbmV4cG9ydCB0eXBlIFJlYWRvbmx5S2V5czxUPiA9IHtcbiAgICBbUCBpbiBrZXlvZiBUXS0/OiBJZkVxdWFsczx7IFtRIGluIFBdOiBUW1BdIH0sIHsgLXJlYWRvbmx5IFtRIGluIFBdOiBUW1BdIH0sIG5ldmVyLCBQPlxufVtrZXlvZiBUXTtcblxuLy8gdHlwZSBSZWFkb25seUtleXNPZkEgPSBSZWFkb25seUtleXM8QT47XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRFcXVhbDxUPihhczogU2V0PFQ+LCBiczogU2V0PFQ+KSB7XG4gICAgaWYgKGFzLnNpemUgIT09IGJzLnNpemUpIHJldHVybiBmYWxzZTtcbiAgICBmb3IgKGNvbnN0IGEgb2YgYXMpIGlmICghYnMuaGFzKGEpKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9qZWN0VmVjdG9yT25QbGFuZShwcm9qUGxhbmU6IFBsYW5lLCB2ZWM6IFZlY3RvcjMpIHtcbiAgICByZXR1cm4gdmVjLnN1YnRyYWN0KHByb2pQbGFuZS5ub3JtYWwuc2NhbGUoVmVjdG9yMy5Eb3QodmVjLCBwcm9qUGxhbmUubm9ybWFsKSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcm91bmQodmFsdWU6IG51bWJlciwgcHJlY2lzaW9uOiBudW1iZXIpIHtcbiAgICBjb25zdCBtdWx0aXBsaWVyID0gTWF0aC5wb3coMTAsIHByZWNpc2lvbiB8fCAwKTtcbiAgICByZXR1cm4gTWF0aC5yb3VuZCh2YWx1ZSAqIG11bHRpcGxpZXIpIC8gbXVsdGlwbGllcjtcbn1cblxuLyoqXG4gKiBTaW1wbGUgZml4ZWQgbGVuZ3RoIEZJRk8gcXVldWUuXG4gKi9cbmV4cG9ydCBjbGFzcyBmaXhlZExlbmd0aFF1ZXVlPFQ+IHtcbiAgICBwcml2YXRlIF92YWx1ZXM6IFRbXSA9IFtdO1xuICAgIGdldCB2YWx1ZXMoKTogVFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlcztcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgc2l6ZTogbnVtYmVyKSB7XG4gICAgfVxuXG4gICAgcHVibGljIHB1c2godjogVCkge1xuICAgICAgICB0aGlzLnZhbHVlcy5wdXNoKHYpO1xuXG4gICAgICAgIGlmICh0aGlzLnZhbHVlcy5sZW5ndGggPT09IHRoaXMuc2l6ZSArIDEpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWVzLnNoaWZ0KCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy52YWx1ZXMubGVuZ3RoID4gdGhpcy5zaXplICsgMSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBJbnRlcm5hbCBxdWV1ZSBoYXMgbGVuZ3RoIGxvbmdlciB0aGFuIHNpemUgJHt0aGlzLnNpemV9OiBHb3QgbGVuZ3RoICR7dGhpcy52YWx1ZXMubGVuZ3RofWApO1xuICAgICAgICAgICAgdGhpcy5fdmFsdWVzID0gdGhpcy52YWx1ZXMuc2xpY2UoLXRoaXMuc2l6ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgY29uY2F0KGFycjogVFtdKSB7XG4gICAgICAgIHRoaXMuX3ZhbHVlcyA9IHRoaXMudmFsdWVzLmNvbmNhdChhcnIpO1xuXG4gICAgICAgIGlmICh0aGlzLnZhbHVlcy5sZW5ndGggPiB0aGlzLnNpemUpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlcyA9IHRoaXMudmFsdWVzLnNsaWNlKC10aGlzLnNpemUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHBvcCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVzLnNoaWZ0KCk7XG4gICAgfVxuXG4gICAgcHVibGljIGZpcnN0KCkge1xuICAgICAgICBpZiAodGhpcy5fdmFsdWVzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZXNbMF07XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHB1YmxpYyBsYXN0KCkge1xuICAgICAgICBpZiAodGhpcy5fdmFsdWVzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWVzW3RoaXMuX3ZhbHVlcy5sZW5ndGggLSAxXTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcHVibGljIHJlc2V0KCkge1xuICAgICAgICB0aGlzLnZhbHVlcy5sZW5ndGggPSAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBsZW5ndGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlcy5sZW5ndGg7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFBvaW50KGN1cnZlOiBDdXJ2ZTMsIHg6IG51bWJlciwgZXBzID0gMC4wMDEpIHtcbiAgICBjb25zdCBwdHMgPSBjdXJ2ZS5nZXRQb2ludHMoKTtcbiAgICBpZiAoeCA+IHB0c1swXS54KSByZXR1cm4gcHRzWzBdLnk7XG4gICAgZWxzZSBpZiAoeCA8IHB0c1twdHMubGVuZ3RoIC0gMV0ueCkgcmV0dXJuIHB0c1twdHMubGVuZ3RoIC0gMV0ueTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHB0cy5sZW5ndGg7ICsraSkge1xuICAgICAgICBpZiAoTWF0aC5hYnMoeCAtIHB0c1tpXS54KSA8IGVwcykgcmV0dXJuIHB0c1tpXS55O1xuICAgIH1cbiAgICByZXR1cm4gMDtcbn1cblxuZXhwb3J0IGNvbnN0IExSID0gW1wibGVmdFwiLCBcInJpZ2h0XCJdO1xuXG5leHBvcnQgY2xhc3MgQ3VzdG9tTG9hZGluZ1NjcmVlbiBpbXBsZW1lbnRzIElMb2FkaW5nU2NyZWVuIHtcbiAgICAvL29wdGlvbmFsLCBidXQgbmVlZGVkIGR1ZSB0byBpbnRlcmZhY2UgZGVmaW5pdGlvbnNcbiAgICBwdWJsaWMgbG9hZGluZ1VJQmFja2dyb3VuZENvbG9yOiBzdHJpbmcgPSAnJztcbiAgICBwdWJsaWMgbG9hZGluZ1VJVGV4dDogc3RyaW5nID0gJyc7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSByZW5kZXJpbmdDYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LFxuICAgICAgICBwcml2YXRlIGxvYWRpbmdEaXY6IEhUTUxEaXZFbGVtZW50XG4gICAgKSB7fVxuXG4gICAgcHVibGljIGRpc3BsYXlMb2FkaW5nVUkoKSB7XG4gICAgICAgIGlmICghdGhpcy5sb2FkaW5nRGl2KSByZXR1cm47XG4gICAgICAgIGlmICh0aGlzLmxvYWRpbmdEaXYuc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnKSB7XG4gICAgICAgICAgICAvLyBEbyBub3QgYWRkIGEgbG9hZGluZyBzY3JlZW4gaWYgdGhlcmUgaXMgYWxyZWFkeSBvbmVcbiAgICAgICAgICAgIHRoaXMubG9hZGluZ0Rpdi5zdHlsZS5kaXNwbGF5ID0gXCJpbml0aWFsXCI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0aGlzLl9yZXNpemVMb2FkaW5nVUkoKTtcbiAgICAgICAgLy8gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdGhpcy5fcmVzaXplTG9hZGluZ1VJKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaGlkZUxvYWRpbmdVSSgpIHtcbiAgICAgICAgaWYgKHRoaXMubG9hZGluZ0RpdilcbiAgICAgICAgICAgIHRoaXMubG9hZGluZ0Rpdi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfVxuXG4gICAgLy8gcHJpdmF0ZSBfcmVzaXplTG9hZGluZ1VJID0gKCkgPT4ge1xuICAgIC8vICAgICBjb25zdCBjYW52YXNSZWN0ID0gdGhpcy5yZW5kZXJpbmdDYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgLy8gICAgIGNvbnN0IGNhbnZhc1Bvc2l0aW9uaW5nID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5yZW5kZXJpbmdDYW52YXMpLnBvc2l0aW9uO1xuICAgIC8vXG4gICAgLy8gICAgIGlmICghdGhpcy5fbG9hZGluZ0Rpdikge1xuICAgIC8vICAgICAgICAgcmV0dXJuO1xuICAgIC8vICAgICB9XG4gICAgLy9cbiAgICAvLyAgICAgdGhpcy5fbG9hZGluZ0Rpdi5zdHlsZS5wb3NpdGlvbiA9IChjYW52YXNQb3NpdGlvbmluZyA9PT0gXCJmaXhlZFwiKSA/IFwiZml4ZWRcIiA6IFwiYWJzb2x1dGVcIjtcbiAgICAvLyAgICAgdGhpcy5fbG9hZGluZ0Rpdi5zdHlsZS5sZWZ0ID0gY2FudmFzUmVjdC5sZWZ0ICsgXCJweFwiO1xuICAgIC8vICAgICB0aGlzLl9sb2FkaW5nRGl2LnN0eWxlLnRvcCA9IGNhbnZhc1JlY3QudG9wICsgXCJweFwiO1xuICAgIC8vICAgICB0aGlzLl9sb2FkaW5nRGl2LnN0eWxlLndpZHRoID0gY2FudmFzUmVjdC53aWR0aCArIFwicHhcIjtcbiAgICAvLyAgICAgdGhpcy5fbG9hZGluZ0Rpdi5zdHlsZS5oZWlnaHQgPSBjYW52YXNSZWN0LmhlaWdodCArIFwicHhcIjtcbiAgICAvLyB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwb2ludExpbmVEaXN0YW5jZShcbiAgICBwb2ludDogVmVjdG9yMyxcbiAgICBsaW5lRW5kQTogVmVjdG9yMywgbGluZUVuZEI6IFZlY3RvcjNcbikge1xuICAgIGNvbnN0IGxpbmVEaXIgPSBsaW5lRW5kQi5zdWJ0cmFjdChsaW5lRW5kQSkubm9ybWFsaXplKCk7XG4gICAgY29uc3QgcFByb2ogPSBsaW5lRW5kQS5hZGQoXG4gICAgICAgIGxpbmVEaXIuc2NhbGUoXG4gICAgICAgICAgICBWZWN0b3IzLkRvdChwb2ludC5zdWJ0cmFjdChsaW5lRW5kQSksIGxpbmVEaXIpXG4gICAgICAgICAgICAvIFZlY3RvcjMuRG90KGxpbmVEaXIsIGxpbmVEaXIpKSk7XG4gICAgcmV0dXJuIHBvaW50LnN1YnRyYWN0KHBQcm9qKS5sZW5ndGgoKTtcbn1cbiIsIi8qXG5Db3B5cmlnaHQgKEMpIDIwMjEgIFRoZSB2M2QgQXV0aG9ycy5cblxuICAgIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gICAgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gICAgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgdmVyc2lvbiAzLlxuXG4gICAgVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gICAgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAgICBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gICAgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiAgICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAgICBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0ICogYXMgQ29tbGluayBmcm9tIFwiY29tbGlua1wiO1xuaW1wb3J0IHtcbiAgICBGQUNFTUVTSF9GQUNFX09WQUwsXG4gICAgRkFDRU1FU0hfTEVGVF9FWUUsXG4gICAgRkFDRU1FU0hfTEVGVF9FWUVCUk9XLFxuICAgIEZBQ0VNRVNIX0xFRlRfSVJJUyxcbiAgICBGQUNFTUVTSF9MSVBTLFxuICAgIEZBQ0VNRVNIX1JJR0hUX0VZRSxcbiAgICBGQUNFTUVTSF9SSUdIVF9FWUVCUk9XLFxuICAgIEZBQ0VNRVNIX1JJR0hUX0lSSVMsXG4gICAgTm9ybWFsaXplZExhbmRtYXJrLFxuICAgIE5vcm1hbGl6ZWRMYW5kbWFya0xpc3QsXG4gICAgUE9TRV9MQU5ETUFSS1MsXG4gICAgUE9TRV9MQU5ETUFSS1NfTEVGVCxcbiAgICBQT1NFX0xBTkRNQVJLU19SSUdIVCxcbn0gZnJvbSBcIkBtZWRpYXBpcGUvaG9saXN0aWNcIjtcbmltcG9ydCB7IE51bGxhYmxlLCBQbGFuZSwgUXVhdGVybmlvbiwgVmVjdG9yMyB9IGZyb20gXCJAYmFieWxvbmpzL2NvcmVcIjtcbmltcG9ydCB7XG4gICAgZml4ZWRMZW5ndGhRdWV1ZSxcbiAgICBpbml0QXJyYXksXG4gICAgS2V5c01hdGNoaW5nLFxuICAgIExSLFxuICAgIHBvaW50TGluZURpc3RhbmNlLFxuICAgIHByb2plY3RWZWN0b3JPblBsYW5lLFxuICAgIFJlYWRvbmx5S2V5cyxcbiAgICByZW1hcFJhbmdlLFxuICAgIHJlbWFwUmFuZ2VOb0NhcCxcbiAgICByZW1hcFJhbmdlV2l0aENhcCxcbn0gZnJvbSBcIi4uL2hlbHBlci91dGlsc1wiO1xuaW1wb3J0IHsgVHJhbnNmb3JtTm9kZVRyZWVOb2RlIH0gZnJvbSBcInYzZC1jb3JlLXJlYWxiaXRzL2Rpc3Qvc3JjL2ltcG9ydGVyL2JhYnlsb24tdnJtLWxvYWRlci9zcmNcIjtcbmltcG9ydCB7XG4gICAgQ2xvbmVhYmxlUmVzdWx0cyxcbiAgICBkZXB0aEZpcnN0U2VhcmNoLFxuICAgIEZBQ0VfTEFORE1BUktfTEVOR1RILFxuICAgIEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IsXG4gICAgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcjMsXG4gICAgRmlsdGVyZWRMYW5kbWFya1ZlY3Rvckxpc3QsXG4gICAgSEFORF9MQU5ETUFSS19MRU5HVEgsXG4gICAgSEFORF9MQU5ETUFSS1MsXG4gICAgSEFORF9MQU5ETUFSS1NfQk9ORV9NQVBQSU5HLFxuICAgIGhhbmRMYW5kTWFya1RvQm9uZU5hbWUsXG4gICAgbm9ybWFsaXplZExhbmRtYXJrVG9WZWN0b3IsXG4gICAgUE9TRV9MQU5ETUFSS19MRU5HVEgsXG4gICAgdmVjdG9yVG9Ob3JtYWxpemVkTGFuZG1hcmssXG59IGZyb20gXCIuLi9oZWxwZXIvbGFuZG1hcmtcIjtcbmltcG9ydCB7XG4gICAgQVhJUyxcbiAgICBjYWxjU3BoZXJpY2FsQ29vcmQsXG4gICAgQ2xvbmVhYmxlUXVhdGVybmlvbixcbiAgICBDbG9uZWFibGVRdWF0ZXJuaW9uTWFwLFxuICAgIGNsb25lYWJsZVF1YXRlcm5pb25Ub1F1YXRlcm5pb24sXG4gICAgZGVncmVlQmV0d2VlblZlY3RvcnMsXG4gICAgRmlsdGVyZWRRdWF0ZXJuaW9uLFxuICAgIHJlbW92ZVJvdGF0aW9uQXhpc1dpdGhDYXAsXG4gICAgcmV2ZXJzZVJvdGF0aW9uLFxuICAgIHNjYWxlUm90YXRpb24sXG4gICAgc3BoZXJpY2FsVG9RdWF0ZXJuaW9uLFxufSBmcm9tIFwiLi4vaGVscGVyL3F1YXRlcm5pb25cIjtcbmltcG9ydCB7XG4gICAgQmFzaXMsXG4gICAgY2FsY0F2Z1BsYW5lLFxuICAgIGdldEJhc2lzLFxuICAgIHF1YXRlcm5pb25CZXR3ZWVuQmFzZXMsXG59IGZyb20gXCIuLi9oZWxwZXIvYmFzaXNcIjtcbmltcG9ydCB7IFZJU0lCSUxJVFlfVEhSRVNIT0xEIH0gZnJvbSBcIi4uL2hlbHBlci9maWx0ZXJcIjtcbmltcG9ydCB7IEJvbmVPcHRpb25zIH0gZnJvbSBcIi4uL3YzZC13ZWJcIjtcbmltcG9ydCB7IEh1bWFub2lkQm9uZSB9IGZyb20gXCJ2M2QtY29yZS1yZWFsYml0cy9kaXN0L3NyYy9pbXBvcnRlci9iYWJ5bG9uLXZybS1sb2FkZXIvc3JjL2h1bWFub2lkLWJvbmVcIjtcblxuZXhwb3J0IGNsYXNzIFBvc2VLZXlQb2ludHMge1xuICAgIHB1YmxpYyB0b3BfZmFjZV9vdmFsID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IoKTtcbiAgICBwdWJsaWMgbGVmdF9mYWNlX292YWwgPSBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcigpO1xuICAgIHB1YmxpYyBib3R0b21fZmFjZV9vdmFsID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IoKTtcbiAgICBwdWJsaWMgcmlnaHRfZmFjZV9vdmFsID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IoKTtcbiAgICBwdWJsaWMgbGVmdF9leWVfdG9wID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IoKTtcbiAgICBwdWJsaWMgbGVmdF9leWVfYm90dG9tID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IoKTtcbiAgICBwdWJsaWMgbGVmdF9leWVfaW5uZXIgPSBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcigpO1xuICAgIHB1YmxpYyBsZWZ0X2V5ZV9vdXRlciA9IG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKCk7XG4gICAgcHVibGljIGxlZnRfZXllX2lubmVyX3NlY29uZGFyeSA9IG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKCk7XG4gICAgcHVibGljIGxlZnRfZXllX291dGVyX3NlY29uZGFyeSA9IG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKCk7XG4gICAgcHVibGljIGxlZnRfaXJpc190b3AgPSBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcigpO1xuICAgIHB1YmxpYyBsZWZ0X2lyaXNfYm90dG9tID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IoKTtcbiAgICBwdWJsaWMgbGVmdF9pcmlzX2xlZnQgPSBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcigpO1xuICAgIHB1YmxpYyBsZWZ0X2lyaXNfcmlnaHQgPSBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcigpO1xuICAgIHB1YmxpYyByaWdodF9leWVfdG9wID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IoKTtcbiAgICBwdWJsaWMgcmlnaHRfZXllX2JvdHRvbSA9IG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKCk7XG4gICAgcHVibGljIHJpZ2h0X2V5ZV9pbm5lciA9IG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKCk7XG4gICAgcHVibGljIHJpZ2h0X2V5ZV9vdXRlciA9IG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKCk7XG4gICAgcHVibGljIHJpZ2h0X2V5ZV9pbm5lcl9zZWNvbmRhcnkgPSBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcigpO1xuICAgIHB1YmxpYyByaWdodF9leWVfb3V0ZXJfc2Vjb25kYXJ5ID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IoKTtcbiAgICBwdWJsaWMgcmlnaHRfaXJpc190b3AgPSBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcigpO1xuICAgIHB1YmxpYyByaWdodF9pcmlzX2JvdHRvbSA9IG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKCk7XG4gICAgcHVibGljIHJpZ2h0X2lyaXNfbGVmdCA9IG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKCk7XG4gICAgcHVibGljIHJpZ2h0X2lyaXNfcmlnaHQgPSBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcigpO1xuICAgIHB1YmxpYyBtb3V0aF90b3BfZmlyc3QgPSBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcigpO1xuICAgIHB1YmxpYyBtb3V0aF90b3Bfc2Vjb25kID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IoKTtcbiAgICBwdWJsaWMgbW91dGhfdG9wX3RoaXJkID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IoKTtcbiAgICBwdWJsaWMgbW91dGhfYm90dG9tX2ZpcnN0ID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IoKTtcbiAgICBwdWJsaWMgbW91dGhfYm90dG9tX3NlY29uZCA9IG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKCk7XG4gICAgcHVibGljIG1vdXRoX2JvdHRvbV90aGlyZCA9IG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKCk7XG4gICAgcHVibGljIG1vdXRoX2xlZnQgPSBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3RvcigpO1xuICAgIHB1YmxpYyBtb3V0aF9yaWdodCA9IG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKCk7XG59XG5cbmV4cG9ydCB0eXBlIFBvc2VzS2V5ID0ga2V5b2YgT21pdDxcbiAgICBQb3NlcyxcbiAgICBLZXlzTWF0Y2hpbmc8UG9zZXMsIEZ1bmN0aW9uPiB8IFJlYWRvbmx5S2V5czxQb3Nlcz5cbj47XG5cbmV4cG9ydCBjbGFzcyBQb3NlcyB7XG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBGQUNFX01FU0hfQ09OTkVDVElPTlMgPSBbXG4gICAgICAgIEZBQ0VNRVNIX0xFRlRfRVlFQlJPVyxcbiAgICAgICAgRkFDRU1FU0hfUklHSFRfRVlFQlJPVyxcbiAgICAgICAgRkFDRU1FU0hfTEVGVF9FWUUsXG4gICAgICAgIEZBQ0VNRVNIX1JJR0hUX0VZRSxcbiAgICAgICAgRkFDRU1FU0hfTEVGVF9JUklTLFxuICAgICAgICBGQUNFTUVTSF9SSUdIVF9JUklTLFxuICAgICAgICBGQUNFTUVTSF9MSVBTLFxuICAgICAgICBGQUNFTUVTSF9GQUNFX09WQUwsXG4gICAgXTtcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEhBTkRfQkFTRV9ST09UX05PUk1BTCA9IG5ldyBWZWN0b3IzKDAsIC0xLCAwKTtcblxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEhBTkRfUE9TSVRJT05fU0NBTElORyA9IDAuODtcblxuICAgIC8qIFJlbWFwIG9mZnNldHMgdG8gcXVhdGVybmlvbnMgdXNpbmcgYXJiaXRyYXJ5IHJhbmdlLlxuICAgICAqIElSSVNfTVA9TWVkaWFQaXBlIElyaXNcbiAgICAgKiBJUklTX0JKUz1CYWJ5bG9uSlMgUm90YXRpb25ZYXdQaXRjaFJvbGxcbiAgICAgKi9cbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBJUklTX01QX1hfUkFOR0UgPSAwLjAyNztcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBJUklTX01QX1lfUkFOR0UgPSAwLjAxMTtcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBJUklTX0JKU19YX1JBTkdFID0gMC4yODtcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBJUklTX0JKU19ZX1JBTkdFID0gMC4xMjtcblxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEJMSU5LX1JBVElPX0xPVyA9IDAuNTk7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgQkxJTktfUkFUSU9fSElHSCA9IDAuNjE7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgTU9VVEhfTVBfUkFOR0VfTE9XID0gMC4wMDE7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgTU9VVEhfTVBfUkFOR0VfSElHSCA9IDAuMDY7XG5cbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBFWUVfV0lEVEhfQkFTRUxJTkUgPSAwLjA1NDY7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgTU9VVEhfV0lEVEhfQkFTRUxJTkUgPSAwLjA5NTtcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBMUl9GQUNFX0RJUkVDVElPTl9SQU5HRSA9IDI3O1xuXG4gICAgLy8gR2VuZXJhbFxuICAgIHByaXZhdGUgX2JvbmVPcHRpb25zOiBCb25lT3B0aW9ucztcbiAgICAvLyBXb3JrYXJvdW5kIGZvciBQcm9taXNlIHByb2JsZW1cbiAgICBwdWJsaWMgdXBkYXRlQm9uZU9wdGlvbnModmFsdWU6IEJvbmVPcHRpb25zKSB7XG4gICAgICAgIHRoaXMuX2JvbmVPcHRpb25zID0gdmFsdWU7XG4gICAgfVxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2JvbmVSb3RhdGlvblVwZGF0ZUZuOiBOdWxsYWJsZTxcbiAgICAgICAgKChkYXRhOiBVaW50OEFycmF5KSA9PiB2b2lkKSAmIENvbWxpbmsuUHJveHlNYXJrZWRcbiAgICA+ID0gbnVsbDtcblxuICAgIC8vIFZSTU1hbmFnZXJcbiAgICBwcml2YXRlIGJvbmVzSGllcmFyY2h5VHJlZTogTnVsbGFibGU8VHJhbnNmb3JtTm9kZVRyZWVOb2RlPiA9IG51bGw7XG5cbiAgICAvLyBSZXN1bHRzXG4gICAgcHVibGljIGNsb25lYWJsZUlucHV0UmVzdWx0czogTnVsbGFibGU8Q2xvbmVhYmxlUmVzdWx0cz4gPSBudWxsO1xuXG4gICAgLy8gUG9zZSBMYW5kbWFya3NcbiAgICBwdWJsaWMgaW5wdXRQb3NlTGFuZG1hcmtzOiBOb3JtYWxpemVkTGFuZG1hcmtMaXN0ID1cbiAgICAgICAgaW5pdEFycmF5PE5vcm1hbGl6ZWRMYW5kbWFyaz4oUE9TRV9MQU5ETUFSS19MRU5HVEgsICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7IHg6IDAsIHk6IDAsIHo6IDAgfTtcbiAgICAgICAgfSk7XG4gICAgcHJpdmF0ZSBwb3NlTGFuZG1hcmtzOiBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yTGlzdCA9XG4gICAgICAgIGluaXRBcnJheTxGaWx0ZXJlZExhbmRtYXJrVmVjdG9yPihQT1NFX0xBTkRNQVJLX0xFTkdUSCwgKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKHtcbiAgICAgICAgICAgICAgICBSOiAwLjEsXG4gICAgICAgICAgICAgICAgUTogNSxcbiAgICAgICAgICAgICAgICB0eXBlOiBcIkthbG1hblwiLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIHByaXZhdGUgd29ybGRQb3NlTGFuZG1hcmtzOiBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yTGlzdCA9XG4gICAgICAgIGluaXRBcnJheTxGaWx0ZXJlZExhbmRtYXJrVmVjdG9yPihQT1NFX0xBTkRNQVJLX0xFTkdUSCwgKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKHtcbiAgICAgICAgICAgICAgICAvLyBSOiAwLjEsIFE6IDAuMSwgdHlwZTogJ0thbG1hbicsXG4gICAgICAgICAgICAgICAgUjogMC4xLFxuICAgICAgICAgICAgICAgIFE6IDEsXG4gICAgICAgICAgICAgICAgdHlwZTogXCJLYWxtYW5cIixcbiAgICAgICAgICAgIH0pOyAvLyAwLjAxLCAwLjYsIDAuMDA3XG4gICAgICAgIH0pO1xuICAgIC8vIENhbm5vdCB1c2UgVmVjdG9yMyBkaXJlY3RseSBzaW5jZSBwb3N0TWVzc2FnZSgpIGVyYXNlcyBhbGwgbWV0aG9kc1xuICAgIHB1YmxpYyBjbG9uZWFibGVQb3NlTGFuZG1hcmtzOiBOb3JtYWxpemVkTGFuZG1hcmtMaXN0ID1cbiAgICAgICAgaW5pdEFycmF5PE5vcm1hbGl6ZWRMYW5kbWFyaz4oUE9TRV9MQU5ETUFSS19MRU5HVEgsICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7IHg6IDAsIHk6IDAsIHo6IDAgfTtcbiAgICAgICAgfSk7XG5cbiAgICAvLyBGYWNlIE1lc2ggTGFuZG1hcmtzXG4gICAgcHVibGljIGlucHV0RmFjZUxhbmRtYXJrczogTm9ybWFsaXplZExhbmRtYXJrTGlzdCA9XG4gICAgICAgIGluaXRBcnJheTxOb3JtYWxpemVkTGFuZG1hcms+KEZBQ0VfTEFORE1BUktfTEVOR1RILCAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4geyB4OiAwLCB5OiAwLCB6OiAwIH07XG4gICAgICAgIH0pO1xuICAgIHByaXZhdGUgZmFjZUxhbmRtYXJrczogRmlsdGVyZWRMYW5kbWFya1ZlY3Rvckxpc3QgPVxuICAgICAgICBpbml0QXJyYXk8RmlsdGVyZWRMYW5kbWFya1ZlY3Rvcj4oRkFDRV9MQU5ETUFSS19MRU5HVEgsICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3Rvcih7XG4gICAgICAgICAgICAgICAgLy8gb25lRXVyb0N1dG9mZjogMC4wMSwgb25lRXVyb0JldGE6IDE1LCB0eXBlOiAnT25lRXVybycsXG4gICAgICAgICAgICAgICAgUjogMC4xLFxuICAgICAgICAgICAgICAgIFE6IDEsXG4gICAgICAgICAgICAgICAgdHlwZTogXCJLYWxtYW5cIixcbiAgICAgICAgICAgIH0pOyAvLyAwLjAxLCAxNSwgMC4wMDJcbiAgICAgICAgfSk7XG4gICAgcHJpdmF0ZSBfZmFjZU1lc2hMYW5kbWFya0luZGV4TGlzdDogbnVtYmVyW11bXSA9IFtdO1xuICAgIGdldCBmYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0KCk6IG51bWJlcltdW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5fZmFjZU1lc2hMYW5kbWFya0luZGV4TGlzdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9mYWNlTWVzaExhbmRtYXJrTGlzdDogTm9ybWFsaXplZExhbmRtYXJrTGlzdFtdID0gW107XG4gICAgZ2V0IGZhY2VNZXNoTGFuZG1hcmtMaXN0KCk6IE5vcm1hbGl6ZWRMYW5kbWFya0xpc3RbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mYWNlTWVzaExhbmRtYXJrTGlzdDtcbiAgICB9XG5cbiAgICAvLyBMZWZ0IEhhbmQgTGFuZG1hcmtzXG4gICAgcHJpdmF0ZSBsZWZ0V3Jpc3RPZmZzZXQ6IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IgPVxuICAgICAgICBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3Rvcih7XG4gICAgICAgICAgICBSOiAwLjEsXG4gICAgICAgICAgICBROiAyLFxuICAgICAgICAgICAgdHlwZTogXCJLYWxtYW5cIixcbiAgICAgICAgfSk7IC8vIDAuMDEsIDIsIDAuMDA4XG4gICAgcHVibGljIGlucHV0TGVmdEhhbmRMYW5kbWFya3M6IE5vcm1hbGl6ZWRMYW5kbWFya0xpc3QgPVxuICAgICAgICBpbml0QXJyYXk8Tm9ybWFsaXplZExhbmRtYXJrPihIQU5EX0xBTkRNQVJLX0xFTkdUSCwgKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHsgeDogMCwgeTogMCwgejogMCB9O1xuICAgICAgICB9KTtcbiAgICBwcml2YXRlIGxlZnRIYW5kTGFuZG1hcmtzOiBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yTGlzdCA9XG4gICAgICAgIGluaXRBcnJheTxGaWx0ZXJlZExhbmRtYXJrVmVjdG9yPihIQU5EX0xBTkRNQVJLX0xFTkdUSCwgKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKHtcbiAgICAgICAgICAgICAgICBSOiAxLFxuICAgICAgICAgICAgICAgIFE6IDEwLFxuICAgICAgICAgICAgICAgIHR5cGU6IFwiS2FsbWFuXCIsXG4gICAgICAgICAgICB9KTsgLy8gMC4wMDEsIDAuNlxuICAgICAgICB9KTtcbiAgICBwdWJsaWMgY2xvbmVhYmxlTGVmdEhhbmRMYW5kbWFya3M6IE5vcm1hbGl6ZWRMYW5kbWFya0xpc3QgPVxuICAgICAgICBpbml0QXJyYXk8Tm9ybWFsaXplZExhbmRtYXJrPihIQU5EX0xBTkRNQVJLX0xFTkdUSCwgKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHsgeDogMCwgeTogMCwgejogMCB9O1xuICAgICAgICB9KTtcbiAgICBwcml2YXRlIGxlZnRIYW5kTm9ybWFsOiBWZWN0b3IzID0gVmVjdG9yMy5aZXJvKCk7XG5cbiAgICAvLyBSaWdodCBIYW5kIExhbmRtYXJrc1xuICAgIHByaXZhdGUgcmlnaHRXcmlzdE9mZnNldDogRmlsdGVyZWRMYW5kbWFya1ZlY3RvciA9XG4gICAgICAgIG5ldyBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yKHtcbiAgICAgICAgICAgIFI6IDAuMSxcbiAgICAgICAgICAgIFE6IDIsXG4gICAgICAgICAgICB0eXBlOiBcIkthbG1hblwiLFxuICAgICAgICB9KTsgLy8gMC4wMSwgMiwgMC4wMDhcbiAgICBwdWJsaWMgaW5wdXRSaWdodEhhbmRMYW5kbWFya3M6IE5vcm1hbGl6ZWRMYW5kbWFya0xpc3QgPVxuICAgICAgICBpbml0QXJyYXk8Tm9ybWFsaXplZExhbmRtYXJrPihIQU5EX0xBTkRNQVJLX0xFTkdUSCwgKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHsgeDogMCwgeTogMCwgejogMCB9O1xuICAgICAgICB9KTtcbiAgICBwcml2YXRlIHJpZ2h0SGFuZExhbmRtYXJrczogRmlsdGVyZWRMYW5kbWFya1ZlY3Rvckxpc3QgPVxuICAgICAgICBpbml0QXJyYXk8RmlsdGVyZWRMYW5kbWFya1ZlY3Rvcj4oSEFORF9MQU5ETUFSS19MRU5HVEgsICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRmlsdGVyZWRMYW5kbWFya1ZlY3Rvcih7XG4gICAgICAgICAgICAgICAgUjogMSxcbiAgICAgICAgICAgICAgICBROiAxMCxcbiAgICAgICAgICAgICAgICB0eXBlOiBcIkthbG1hblwiLFxuICAgICAgICAgICAgfSk7IC8vIDAuMDAxLCAwLjZcbiAgICAgICAgfSk7XG4gICAgcHVibGljIGNsb25lYWJsZVJpZ2h0SGFuZExhbmRtYXJrczogTm9ybWFsaXplZExhbmRtYXJrTGlzdCA9XG4gICAgICAgIGluaXRBcnJheTxOb3JtYWxpemVkTGFuZG1hcms+KEhBTkRfTEFORE1BUktfTEVOR1RILCAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4geyB4OiAwLCB5OiAwLCB6OiAwIH07XG4gICAgICAgIH0pO1xuICAgIHByaXZhdGUgcmlnaHRIYW5kTm9ybWFsOiBWZWN0b3IzID0gVmVjdG9yMy5aZXJvKCk7XG5cbiAgICAvLyBGZWV0XG4gICAgcHJpdmF0ZSBsZWZ0Rm9vdE5vcm1hbDogVmVjdG9yMyA9IFZlY3RvcjMuWmVybygpO1xuICAgIHByaXZhdGUgcmlnaHRGb290Tm9ybWFsOiBWZWN0b3IzID0gVmVjdG9yMy5aZXJvKCk7XG4gICAgcHJpdmF0ZSBsZWZ0Rm9vdEJhc2lzUm90YXRpb246IFF1YXRlcm5pb24gPSBRdWF0ZXJuaW9uLklkZW50aXR5KCk7XG4gICAgcHJpdmF0ZSByaWdodEZvb3RCYXNpc1JvdGF0aW9uOiBRdWF0ZXJuaW9uID0gUXVhdGVybmlvbi5JZGVudGl0eSgpO1xuXG4gICAgLy8gS2V5IHBvaW50c1xuICAgIHByaXZhdGUgX2tleVBvaW50czogUG9zZUtleVBvaW50cyA9IG5ldyBQb3NlS2V5UG9pbnRzKCk7XG4gICAgZ2V0IGtleVBvaW50cygpOiBQb3NlS2V5UG9pbnRzIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2tleVBvaW50cztcbiAgICB9XG4gICAgcHJpdmF0ZSBfYmxpbmtCYXNlOiBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3Ioe1xuICAgICAgICBSOiAxLFxuICAgICAgICBROiAxLFxuICAgICAgICB0eXBlOiBcIkthbG1hblwiLFxuICAgIH0pO1xuICAgIHByaXZhdGUgX2xlZnRCbGlua0FycjogZml4ZWRMZW5ndGhRdWV1ZTxudW1iZXI+ID1cbiAgICAgICAgbmV3IGZpeGVkTGVuZ3RoUXVldWU8bnVtYmVyPigxMCk7XG4gICAgcHJpdmF0ZSBfcmlnaHRCbGlua0FycjogZml4ZWRMZW5ndGhRdWV1ZTxudW1iZXI+ID1cbiAgICAgICAgbmV3IGZpeGVkTGVuZ3RoUXVldWU8bnVtYmVyPigxMCk7XG5cbiAgICAvLyBDYWxjdWxhdGVkIHByb3BlcnRpZXNcbiAgICBwcml2YXRlIF9mYWNlTm9ybWFsOiBOb3JtYWxpemVkTGFuZG1hcmsgPSB7IHg6IDAsIHk6IDAsIHo6IDAgfTtcbiAgICBnZXQgZmFjZU5vcm1hbCgpOiBOb3JtYWxpemVkTGFuZG1hcmsge1xuICAgICAgICByZXR1cm4gdGhpcy5fZmFjZU5vcm1hbDtcbiAgICB9XG4gICAgcHJpdmF0ZSBfaGVhZFF1YXRlcm5pb246IEZpbHRlcmVkUXVhdGVybmlvbiA9IG5ldyBGaWx0ZXJlZFF1YXRlcm5pb24oe1xuICAgICAgICBSOiAxLFxuICAgICAgICBROiA1MCxcbiAgICAgICAgdHlwZTogXCJLYWxtYW5cIixcbiAgICB9KTtcblxuICAgIC8vIFRPRE86IG9wdGlvbjogbG9jayB4IHJvdGF0aW9uXG5cbiAgICAvLyBBIGNvcHkgZm9yIHJlc3RvcmUgYm9uZSBsb2NhdGlvbnNcbiAgICBwcml2YXRlIF9pbml0Qm9uZVJvdGF0aW9uczogQ2xvbmVhYmxlUXVhdGVybmlvbk1hcCA9IHt9O1xuICAgIC8vIENhbGN1bGF0ZWQgYm9uZSByb3RhdGlvbnNcbiAgICBwcml2YXRlIF9ib25lUm90YXRpb25zOiBDbG9uZWFibGVRdWF0ZXJuaW9uTWFwID0ge307XG4gICAgcHJpdmF0ZSB0ZXh0RW5jb2RlciA9IG5ldyBUZXh0RW5jb2RlcigpO1xuXG4gICAgcHJpdmF0ZSBfbGVmdEhhbmROb3JtYWxzOiBOb3JtYWxpemVkTGFuZG1hcmtMaXN0ID1cbiAgICAgICAgaW5pdEFycmF5PE5vcm1hbGl6ZWRMYW5kbWFyaz4oMywgKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHsgeDogMCwgeTogMCwgejogMCB9O1xuICAgICAgICB9KTtcbiAgICBnZXQgbGVmdEhhbmROb3JtYWxzKCk6IE5vcm1hbGl6ZWRMYW5kbWFya0xpc3Qge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGVmdEhhbmROb3JtYWxzO1xuICAgIH1cblxuICAgIHByaXZhdGUgX3JpZ2h0SGFuZE5vcm1hbHM6IE5vcm1hbGl6ZWRMYW5kbWFya0xpc3QgPVxuICAgICAgICBpbml0QXJyYXk8Tm9ybWFsaXplZExhbmRtYXJrPigzLCAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4geyB4OiAwLCB5OiAwLCB6OiAwIH07XG4gICAgICAgIH0pO1xuICAgIGdldCByaWdodEhhbmROb3JtYWxzKCk6IE5vcm1hbGl6ZWRMYW5kbWFya0xpc3Qge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmlnaHRIYW5kTm9ybWFscztcbiAgICB9XG5cbiAgICBwcml2YXRlIF9wb3NlTm9ybWFsczogTm9ybWFsaXplZExhbmRtYXJrTGlzdCA9XG4gICAgICAgIGluaXRBcnJheTxOb3JtYWxpemVkTGFuZG1hcms+KFxuICAgICAgICAgICAgMywgLy8gQXJiaXRyYXJ5IGxlbmd0aCBmb3IgZGVidWdnaW5nXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgeDogMCwgeTogMCwgejogMCB9O1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIGdldCBwb3NlTm9ybWFscygpOiBOb3JtYWxpemVkTGFuZG1hcmtMaXN0IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bvc2VOb3JtYWxzO1xuICAgIH1cblxuICAgIHB1YmxpYyBtaWRIaXBQb3M6IE51bGxhYmxlPE5vcm1hbGl6ZWRMYW5kbWFyaz4gPSBudWxsO1xuICAgIHB1YmxpYyBtaWRIaXBJbml0T2Zmc2V0OiBOdWxsYWJsZTxOb3JtYWxpemVkTGFuZG1hcms+ID0gbnVsbDtcbiAgICBwdWJsaWMgbWlkSGlwT2Zmc2V0ID0gbmV3IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3Ioe1xuICAgICAgICBSOiAxLFxuICAgICAgICBROiAxMCxcbiAgICAgICAgdHlwZTogXCJLYWxtYW5cIixcbiAgICB9KTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBib25lT3B0aW9uczogQm9uZU9wdGlvbnMsXG4gICAgICAgIGJvbmVSb3RhdGlvblVwZGF0ZUZuPzogKChkYXRhOiBVaW50OEFycmF5KSA9PiB2b2lkKSAmXG4gICAgICAgICAgICBDb21saW5rLlByb3h5TWFya2VkXG4gICAgKSB7XG4gICAgICAgIHRoaXMuaW5pdEJvbmVSb3RhdGlvbnMoKTsgLy9wcm92aXNpb25hbFxuICAgICAgICB0aGlzLl9ib25lT3B0aW9ucyA9IGJvbmVPcHRpb25zO1xuICAgICAgICBpZiAoYm9uZVJvdGF0aW9uVXBkYXRlRm4pXG4gICAgICAgICAgICB0aGlzLl9ib25lUm90YXRpb25VcGRhdGVGbiA9IGJvbmVSb3RhdGlvblVwZGF0ZUZuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE9uZSB0aW1lIG9wZXJhdGlvbiB0byBzZXQgYm9uZXMgaGllcmFyY2h5IGZyb20gVlJNTWFuYWdlclxuICAgICAqIEBwYXJhbSB0cmVlIHJvb3Qgbm9kZSBvZiB0cmVlXG4gICAgICovXG4gICAgcHVibGljIHNldEJvbmVzSGllcmFyY2h5VHJlZShcbiAgICAgICAgdHJlZTogVHJhbnNmb3JtTm9kZVRyZWVOb2RlLFxuICAgICAgICBmb3JjZVJlcGxhY2UgPSBmYWxzZVxuICAgICkge1xuICAgICAgICAvLyBBc3N1bWUgYm9uZXMgaGF2ZSB1bmlxdWUgbmFtZXNcbiAgICAgICAgaWYgKHRoaXMuYm9uZXNIaWVyYXJjaHlUcmVlICYmICFmb3JjZVJlcGxhY2UpIHJldHVybjtcblxuICAgICAgICB0aGlzLmJvbmVzSGllcmFyY2h5VHJlZSA9IHRyZWU7XG5cbiAgICAgICAgLy8gUmUtaW5pdCBib25lIHJvdGF0aW9uc1xuICAgICAgICB0aGlzLl9pbml0Qm9uZVJvdGF0aW9ucyA9IHt9O1xuICAgICAgICBkZXB0aEZpcnN0U2VhcmNoKFxuICAgICAgICAgICAgdGhpcy5ib25lc0hpZXJhcmNoeVRyZWUsXG4gICAgICAgICAgICAobjogVHJhbnNmb3JtTm9kZVRyZWVOb2RlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5faW5pdEJvbmVSb3RhdGlvbnNbbi5uYW1lXSA9IG5ldyBDbG9uZWFibGVRdWF0ZXJuaW9uKFxuICAgICAgICAgICAgICAgICAgICBRdWF0ZXJuaW9uLklkZW50aXR5KClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5pbml0Qm9uZVJvdGF0aW9ucygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFsbCBNZWRpYVBpcGUgaW5wdXRzIGhhdmUgdGhlIGZvbGxvd2luZyBjb252ZW50aW9uczpcbiAgICAgKiAgLSBMZWZ0LXJpZ2h0IG1pcnJvcmVkIChzZWxmaWUgbW9kZSlcbiAgICAgKiAgLSBGYWNlIHRvd2FyZHMgLVogKHRvd2FyZHMgY2FtZXJhKSBieSBkZWZhdWx0XG4gICAgICogIFRPRE86IGludGVycG9sYXRlIHJlc3VsdHMgdG8gNjAgRlBTLlxuICAgICAqIEBwYXJhbSByZXN1bHRzIFJlc3VsdCBvYmplY3QgZnJvbSBNZWRpYVBpcGUgSG9saXN0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgcHJvY2VzcyhyZXN1bHRzOiBDbG9uZWFibGVSZXN1bHRzKSB7XG4gICAgICAgIHRoaXMuY2xvbmVhYmxlSW5wdXRSZXN1bHRzID0gcmVzdWx0cztcbiAgICAgICAgaWYgKCF0aGlzLmNsb25lYWJsZUlucHV0UmVzdWx0cykgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0aGlzLl9ib25lT3B0aW9ucy5yZXNldEludmlzaWJsZSkge1xuICAgICAgICAgICAgdGhpcy5yZXNldEJvbmVSb3RhdGlvbnMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucHJlUHJvY2Vzc1Jlc3VsdHMoKTtcblxuICAgICAgICAvLyBBY3R1YWwgcHJvY2Vzc2luZ1xuICAgICAgICAvLyBQb3N0IGZpbHRlcmVkIGxhbmRtYXJrc1xuICAgICAgICB0aGlzLnRvQ2xvbmVhYmxlTGFuZG1hcmtzKFxuICAgICAgICAgICAgdGhpcy5wb3NlTGFuZG1hcmtzLFxuICAgICAgICAgICAgdGhpcy5jbG9uZWFibGVQb3NlTGFuZG1hcmtzXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuZmlsdGVyRmFjZUxhbmRtYXJrcygpO1xuICAgICAgICB0aGlzLnRvQ2xvbmVhYmxlTGFuZG1hcmtzKFxuICAgICAgICAgICAgdGhpcy5sZWZ0SGFuZExhbmRtYXJrcyxcbiAgICAgICAgICAgIHRoaXMuY2xvbmVhYmxlTGVmdEhhbmRMYW5kbWFya3NcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy50b0Nsb25lYWJsZUxhbmRtYXJrcyhcbiAgICAgICAgICAgIHRoaXMucmlnaHRIYW5kTGFuZG1hcmtzLFxuICAgICAgICAgICAgdGhpcy5jbG9uZWFibGVSaWdodEhhbmRMYW5kbWFya3NcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBHYXRoZXIga2V5IHBvaW50c1xuICAgICAgICB0aGlzLmdldEtleVBvaW50cygpO1xuXG4gICAgICAgIC8vIEJvbmUgT3JpZW50YXRpb25zIEluZGVwZW5kZW50XG4gICAgICAgIC8vIENhbGN1bGF0ZSBpcmlzIG9yaWVudGF0aW9uc1xuICAgICAgICB0aGlzLmNhbGNJcmlzTm9ybWFsKCk7XG5cbiAgICAgICAgLy8gQm9uZSBPcmllbnRhdGlvbnMgRGVwZW5kZW50XG4gICAgICAgIC8vIENhbGN1bGF0ZSBmYWNlIG9yaWVudGF0aW9uXG4gICAgICAgIHRoaXMuY2FsY0ZhY2VCb25lcygpO1xuXG4gICAgICAgIC8vIENhbGN1bGF0ZSBleHByZXNzaW9uc1xuICAgICAgICB0aGlzLmNhbGNFeHByZXNzaW9ucygpO1xuXG4gICAgICAgIC8vIENhbGN1bGF0ZSBmdWxsIGJvZHkgYm9uZXNcbiAgICAgICAgdGhpcy5jYWxjUG9zZUJvbmVzKCk7XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIGhhbmQgYm9uZXNcbiAgICAgICAgdGhpcy5jYWxjSGFuZEJvbmVzKCk7XG5cbiAgICAgICAgLy8gUG9zdCBwcm9jZXNzaW5nXG4gICAgICAgIGlmICh0aGlzLl9ib25lT3B0aW9ucy5pcmlzTG9ja1gpIHtcbiAgICAgICAgICAgIHRoaXMuX2JvbmVSb3RhdGlvbnNbXCJpcmlzXCJdLnNldChcbiAgICAgICAgICAgICAgICByZW1vdmVSb3RhdGlvbkF4aXNXaXRoQ2FwKFxuICAgICAgICAgICAgICAgICAgICBjbG9uZWFibGVRdWF0ZXJuaW9uVG9RdWF0ZXJuaW9uKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fYm9uZVJvdGF0aW9uc1tcImlyaXNcIl1cbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgQVhJUy54XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuX2JvbmVSb3RhdGlvbnNbXCJsZWZ0SXJpc1wiXS5zZXQoXG4gICAgICAgICAgICAgICAgcmVtb3ZlUm90YXRpb25BeGlzV2l0aENhcChcbiAgICAgICAgICAgICAgICAgICAgY2xvbmVhYmxlUXVhdGVybmlvblRvUXVhdGVybmlvbihcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2JvbmVSb3RhdGlvbnNbXCJpcmlzXCJdXG4gICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgIEFYSVMueFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLl9ib25lUm90YXRpb25zW1wicmlnaHRJcmlzXCJdLnNldChcbiAgICAgICAgICAgICAgICByZW1vdmVSb3RhdGlvbkF4aXNXaXRoQ2FwKFxuICAgICAgICAgICAgICAgICAgICBjbG9uZWFibGVRdWF0ZXJuaW9uVG9RdWF0ZXJuaW9uKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fYm9uZVJvdGF0aW9uc1tcImlyaXNcIl1cbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgQVhJUy54XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGxvY2tCb25lczogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgLy8gSG9saXN0aWMgZG9lc24ndCByZXNldCBoYW5kIGxhbmRtYXJrcyB3aGVuIGludmlzaWJsZVxuICAgICAgICAvLyBTbyB3ZSBpbmZlciBpbnZpc2liaWxpdHkgZnJvbSB3cmlzdCBsYW5kbWFya1xuICAgICAgICBpZiAodGhpcy5fYm9uZU9wdGlvbnMucmVzZXRJbnZpc2libGUpIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAodGhpcy5jbG9uZWFibGVJbnB1dFJlc3VsdHM/LnBvc2VMYW5kbWFya3NbXG4gICAgICAgICAgICAgICAgICAgIFBPU0VfTEFORE1BUktTLkxFRlRfV1JJU1RcbiAgICAgICAgICAgICAgICBdLnZpc2liaWxpdHkgfHwgMCkgPCBWSVNJQklMSVRZX1RIUkVTSE9MRFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBrIG9mIE9iamVjdC5rZXlzKEhBTkRfTEFORE1BUktTX0JPTkVfTUFQUElORykpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gYGxlZnQke2t9YDtcbiAgICAgICAgICAgICAgICAgICAgbG9ja0JvbmVzLnB1c2goa2V5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgKHRoaXMuY2xvbmVhYmxlSW5wdXRSZXN1bHRzPy5wb3NlTGFuZG1hcmtzW1xuICAgICAgICAgICAgICAgICAgICBQT1NFX0xBTkRNQVJLUy5SSUdIVF9XUklTVFxuICAgICAgICAgICAgICAgIF0udmlzaWJpbGl0eSB8fCAwKSA8IFZJU0lCSUxJVFlfVEhSRVNIT0xEXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGsgb2YgT2JqZWN0LmtleXMoSEFORF9MQU5ETUFSS1NfQk9ORV9NQVBQSU5HKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBgcmlnaHQke2t9YDtcbiAgICAgICAgICAgICAgICAgICAgbG9ja0JvbmVzLnB1c2goa2V5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2JvbmVPcHRpb25zLmxvY2tGaW5nZXIpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZCBvZiBMUikge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgayBvZiBPYmplY3Qua2V5cyhIQU5EX0xBTkRNQVJLU19CT05FX01BUFBJTkcpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGQgKyBrO1xuICAgICAgICAgICAgICAgICAgICBsb2NrQm9uZXMucHVzaChrZXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fYm9uZU9wdGlvbnMubG9ja0FybSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBrIG9mIExSKSB7XG4gICAgICAgICAgICAgICAgbG9ja0JvbmVzLnB1c2goYCR7a31VcHBlckFybWApO1xuICAgICAgICAgICAgICAgIGxvY2tCb25lcy5wdXNoKGAke2t9TG93ZXJBcm1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fYm9uZU9wdGlvbnMubG9ja0xlZykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBrIG9mIExSKSB7XG4gICAgICAgICAgICAgICAgbG9ja0JvbmVzLnB1c2goYCR7a31VcHBlckxlZ2ApO1xuICAgICAgICAgICAgICAgIGxvY2tCb25lcy5wdXNoKGAke2t9TG93ZXJMZWdgKTtcbiAgICAgICAgICAgICAgICBsb2NrQm9uZXMucHVzaChgJHtrfUZvb3RgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZpbHRlckJvbmVSb3RhdGlvbnMobG9ja0JvbmVzKTtcblxuICAgICAgICAvLyBQdXNoIHRvIG1haW5cbiAgICAgICAgdGhpcy5wdXNoQm9uZVJvdGF0aW9uQnVmZmVyKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHJlc2V0Qm9uZVJvdGF0aW9ucyhzZW5kUmVzdWx0ID0gZmFsc2UpIHtcbiAgICAgICAgZm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXModGhpcy5faW5pdEJvbmVSb3RhdGlvbnMpKSB7XG4gICAgICAgICAgICB0aGlzLl9ib25lUm90YXRpb25zW2tdLnNldChjbG9uZWFibGVRdWF0ZXJuaW9uVG9RdWF0ZXJuaW9uKHYpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VuZFJlc3VsdCkge1xuICAgICAgICAgICAgdGhpcy5wdXNoQm9uZVJvdGF0aW9uQnVmZmVyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGZpbHRlckJvbmVSb3RhdGlvbnMoYm9uZU5hbWVzOiBzdHJpbmdbXSkge1xuICAgICAgICBmb3IgKGNvbnN0IGsgb2YgYm9uZU5hbWVzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fYm9uZVJvdGF0aW9uc1trXSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2JvbmVSb3RhdGlvbnNba10uc2V0KFF1YXRlcm5pb24uSWRlbnRpdHkoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEtleVBvaW50cygpIHtcbiAgICAgICAgLy8gR2V0IHBvaW50cyBmcm9tIGZhY2UgbWVzaFxuICAgICAgICB0aGlzLl9rZXlQb2ludHMudG9wX2ZhY2Vfb3ZhbCA9XG4gICAgICAgICAgICB0aGlzLmZhY2VMYW5kbWFya3NbdGhpcy5mYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0WzddWzBdXTtcbiAgICAgICAgdGhpcy5fa2V5UG9pbnRzLmxlZnRfZmFjZV9vdmFsID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbN11bNl1dO1xuICAgICAgICB0aGlzLl9rZXlQb2ludHMuYm90dG9tX2ZhY2Vfb3ZhbCA9XG4gICAgICAgICAgICB0aGlzLmZhY2VMYW5kbWFya3NbdGhpcy5mYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0WzddWzE4XV07XG4gICAgICAgIHRoaXMuX2tleVBvaW50cy5yaWdodF9mYWNlX292YWwgPVxuICAgICAgICAgICAgdGhpcy5mYWNlTGFuZG1hcmtzW3RoaXMuZmFjZU1lc2hMYW5kbWFya0luZGV4TGlzdFs3XVszMF1dO1xuXG4gICAgICAgIHRoaXMuX2tleVBvaW50cy5sZWZ0X2V5ZV9pbm5lciA9XG4gICAgICAgICAgICB0aGlzLmZhY2VMYW5kbWFya3NbdGhpcy5mYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0WzJdWzhdXTtcbiAgICAgICAgdGhpcy5fa2V5UG9pbnRzLnJpZ2h0X2V5ZV9pbm5lciA9XG4gICAgICAgICAgICB0aGlzLmZhY2VMYW5kbWFya3NbdGhpcy5mYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0WzNdWzhdXTtcbiAgICAgICAgdGhpcy5fa2V5UG9pbnRzLmxlZnRfZXllX291dGVyID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbMl1bMF1dO1xuICAgICAgICB0aGlzLl9rZXlQb2ludHMucmlnaHRfZXllX291dGVyID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbM11bMF1dO1xuXG4gICAgICAgIHRoaXMuX2tleVBvaW50cy5tb3V0aF9sZWZ0ID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbNl1bMTBdXTtcbiAgICAgICAgdGhpcy5fa2V5UG9pbnRzLm1vdXRoX3JpZ2h0ID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbNl1bMF1dO1xuICAgICAgICB0aGlzLl9rZXlQb2ludHMubW91dGhfdG9wX2ZpcnN0ID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbNl1bMjRdXTtcbiAgICAgICAgdGhpcy5fa2V5UG9pbnRzLm1vdXRoX3RvcF9zZWNvbmQgPVxuICAgICAgICAgICAgdGhpcy5mYWNlTGFuZG1hcmtzW3RoaXMuZmFjZU1lc2hMYW5kbWFya0luZGV4TGlzdFs2XVsyNV1dO1xuICAgICAgICB0aGlzLl9rZXlQb2ludHMubW91dGhfdG9wX3RoaXJkID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbNl1bMjZdXTtcbiAgICAgICAgdGhpcy5fa2V5UG9pbnRzLm1vdXRoX2JvdHRvbV9maXJzdCA9XG4gICAgICAgICAgICB0aGlzLmZhY2VMYW5kbWFya3NbdGhpcy5mYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0WzZdWzM0XV07XG4gICAgICAgIHRoaXMuX2tleVBvaW50cy5tb3V0aF9ib3R0b21fc2Vjb25kID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbNl1bMzVdXTtcbiAgICAgICAgdGhpcy5fa2V5UG9pbnRzLm1vdXRoX2JvdHRvbV90aGlyZCA9XG4gICAgICAgICAgICB0aGlzLmZhY2VMYW5kbWFya3NbdGhpcy5mYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0WzZdWzM2XV07XG5cbiAgICAgICAgdGhpcy5fa2V5UG9pbnRzLmxlZnRfaXJpc190b3AgPVxuICAgICAgICAgICAgdGhpcy5mYWNlTGFuZG1hcmtzW3RoaXMuZmFjZU1lc2hMYW5kbWFya0luZGV4TGlzdFs0XVsxXV07XG4gICAgICAgIHRoaXMuX2tleVBvaW50cy5sZWZ0X2lyaXNfYm90dG9tID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbNF1bM11dO1xuICAgICAgICB0aGlzLl9rZXlQb2ludHMubGVmdF9pcmlzX2xlZnQgPVxuICAgICAgICAgICAgdGhpcy5mYWNlTGFuZG1hcmtzW3RoaXMuZmFjZU1lc2hMYW5kbWFya0luZGV4TGlzdFs0XVsyXV07XG4gICAgICAgIHRoaXMuX2tleVBvaW50cy5sZWZ0X2lyaXNfcmlnaHQgPVxuICAgICAgICAgICAgdGhpcy5mYWNlTGFuZG1hcmtzW3RoaXMuZmFjZU1lc2hMYW5kbWFya0luZGV4TGlzdFs0XVswXV07XG4gICAgICAgIHRoaXMuX2tleVBvaW50cy5yaWdodF9pcmlzX3RvcCA9XG4gICAgICAgICAgICB0aGlzLmZhY2VMYW5kbWFya3NbdGhpcy5mYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0WzVdWzFdXTtcbiAgICAgICAgdGhpcy5fa2V5UG9pbnRzLnJpZ2h0X2lyaXNfYm90dG9tID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbNV1bM11dO1xuICAgICAgICB0aGlzLl9rZXlQb2ludHMucmlnaHRfaXJpc19sZWZ0ID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbNV1bMl1dO1xuICAgICAgICB0aGlzLl9rZXlQb2ludHMucmlnaHRfaXJpc19yaWdodCA9XG4gICAgICAgICAgICB0aGlzLmZhY2VMYW5kbWFya3NbdGhpcy5mYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0WzVdWzBdXTtcblxuICAgICAgICB0aGlzLl9rZXlQb2ludHMubGVmdF9leWVfdG9wID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbMl1bMTJdXTtcbiAgICAgICAgdGhpcy5fa2V5UG9pbnRzLmxlZnRfZXllX2JvdHRvbSA9XG4gICAgICAgICAgICB0aGlzLmZhY2VMYW5kbWFya3NbdGhpcy5mYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0WzJdWzRdXTtcbiAgICAgICAgdGhpcy5fa2V5UG9pbnRzLmxlZnRfZXllX2lubmVyX3NlY29uZGFyeSA9XG4gICAgICAgICAgICB0aGlzLmZhY2VMYW5kbWFya3NbdGhpcy5mYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0WzJdWzE0XV07XG4gICAgICAgIHRoaXMuX2tleVBvaW50cy5sZWZ0X2V5ZV9vdXRlcl9zZWNvbmRhcnkgPVxuICAgICAgICAgICAgdGhpcy5mYWNlTGFuZG1hcmtzW3RoaXMuZmFjZU1lc2hMYW5kbWFya0luZGV4TGlzdFsyXVsxMF1dO1xuICAgICAgICB0aGlzLl9rZXlQb2ludHMucmlnaHRfZXllX3RvcCA9XG4gICAgICAgICAgICB0aGlzLmZhY2VMYW5kbWFya3NbdGhpcy5mYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0WzNdWzEyXV07XG4gICAgICAgIHRoaXMuX2tleVBvaW50cy5yaWdodF9leWVfYm90dG9tID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbM11bNF1dO1xuICAgICAgICB0aGlzLl9rZXlQb2ludHMucmlnaHRfZXllX291dGVyX3NlY29uZGFyeSA9XG4gICAgICAgICAgICB0aGlzLmZhY2VMYW5kbWFya3NbdGhpcy5mYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0WzNdWzEwXV07XG4gICAgICAgIHRoaXMuX2tleVBvaW50cy5yaWdodF9leWVfaW5uZXJfc2Vjb25kYXJ5ID1cbiAgICAgICAgICAgIHRoaXMuZmFjZUxhbmRtYXJrc1t0aGlzLmZhY2VNZXNoTGFuZG1hcmtJbmRleExpc3RbM11bMTRdXTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIENhbGN1bGF0ZSB0aGUgZmFjZSBvcmllbnRhdGlvbiBmcm9tIGxhbmRtYXJrcy5cbiAgICAgKiBMYW5kbWFya3MgZnJvbSBGYWNlIE1lc2ggdGFrZXMgcHJlY2VkZW5jZS5cbiAgICAgKi9cbiAgICBwcml2YXRlIGNhbGNGYWNlQm9uZXMoKSB7XG4gICAgICAgIGNvbnN0IGF4aXNYID0gdGhpcy5fa2V5UG9pbnRzLmxlZnRfZmFjZV9vdmFsLnBvc1xuICAgICAgICAgICAgLnN1YnRyYWN0KHRoaXMuX2tleVBvaW50cy5yaWdodF9mYWNlX292YWwucG9zKVxuICAgICAgICAgICAgLm5vcm1hbGl6ZSgpO1xuICAgICAgICBjb25zdCBheGlzWSA9IHRoaXMuX2tleVBvaW50cy50b3BfZmFjZV9vdmFsLnBvc1xuICAgICAgICAgICAgLnN1YnRyYWN0KHRoaXMuX2tleVBvaW50cy5ib3R0b21fZmFjZV9vdmFsLnBvcylcbiAgICAgICAgICAgIC5ub3JtYWxpemUoKTtcbiAgICAgICAgaWYgKGF4aXNYLmxlbmd0aCgpID09PSAwIHx8IGF4aXNZLmxlbmd0aCgpID09PSAwKSByZXR1cm47XG4gICAgICAgIGNvbnN0IHRoaXNCYXNpcyA9IG5ldyBCYXNpcyhbXG4gICAgICAgICAgICBheGlzWCxcbiAgICAgICAgICAgIGF4aXNZLFxuICAgICAgICAgICAgVmVjdG9yMy5Dcm9zcyhheGlzWCwgYXhpc1kpLFxuICAgICAgICBdKTtcblxuICAgICAgICAvLyBEaXN0cmlidXRlIHJvdGF0aW9uIGJldHdlZW4gbmVjayBhbmQgaGVhZFxuICAgICAgICBjb25zdCBoZWFkUGFyZW50UXVhdGVybmlvbiA9IHRoaXMuYXBwbHlRdWF0ZXJuaW9uQ2hhaW4oXCJoZWFkXCIsIGZhbHNlKTtcbiAgICAgICAgY29uc3QgaGVhZEJhc2lzID1cbiAgICAgICAgICAgIHRoaXMuX2JvbmVSb3RhdGlvbnNbXCJoZWFkXCJdLnJvdGF0ZUJhc2lzKGhlYWRQYXJlbnRRdWF0ZXJuaW9uKTtcbiAgICAgICAgY29uc3QgcXVhdGVybmlvbiA9IHJldmVyc2VSb3RhdGlvbihcbiAgICAgICAgICAgIHF1YXRlcm5pb25CZXR3ZWVuQmFzZXModGhpc0Jhc2lzLCBoZWFkQmFzaXMsIGhlYWRQYXJlbnRRdWF0ZXJuaW9uKSxcbiAgICAgICAgICAgIEFYSVMueFxuICAgICAgICApO1xuICAgICAgICB0aGlzLl9oZWFkUXVhdGVybmlvbi51cGRhdGVSb3RhdGlvbihxdWF0ZXJuaW9uKTtcbiAgICAgICAgY29uc3Qgc2NhbGVkUXVhdGVybmlvbiA9IHNjYWxlUm90YXRpb24odGhpcy5faGVhZFF1YXRlcm5pb24ucm90LCAwLjUpO1xuICAgICAgICB0aGlzLl9ib25lUm90YXRpb25zW1wiaGVhZFwiXS5zZXQoc2NhbGVkUXVhdGVybmlvbik7XG4gICAgICAgIHRoaXMuX2JvbmVSb3RhdGlvbnNbXCJuZWNrXCJdLnNldChzY2FsZWRRdWF0ZXJuaW9uKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJlbWFwIHBvc2l0aW9uYWwgb2Zmc2V0cyB0byByb3RhdGlvbnMuXG4gICAgICogSXJpcyBvbmx5IGhhdmUgcG9zaXRpb25hbCBvZmZzZXRzLiBUaGVpciBub3JtYWxzIGFsd2F5cyBmYWNlIGZyb250LlxuICAgICAqL1xuICAgIHByaXZhdGUgY2FsY0lyaXNOb3JtYWwoKSB7XG4gICAgICAgIGlmICghdGhpcy5jbG9uZWFibGVJbnB1dFJlc3VsdHM/LmZhY2VMYW5kbWFya3MpIHJldHVybjtcblxuICAgICAgICBjb25zdCBsZWZ0SXJpc0NlbnRlciA9IHRoaXMuX2tleVBvaW50cy5sZWZ0X2lyaXNfdG9wLnBvc1xuICAgICAgICAgICAgLmFkZCh0aGlzLl9rZXlQb2ludHMubGVmdF9pcmlzX2JvdHRvbS5wb3MpXG4gICAgICAgICAgICAuYWRkKHRoaXMuX2tleVBvaW50cy5sZWZ0X2lyaXNfbGVmdC5wb3MpXG4gICAgICAgICAgICAuYWRkKHRoaXMuX2tleVBvaW50cy5sZWZ0X2lyaXNfcmlnaHQucG9zKVxuICAgICAgICAgICAgLnNjYWxlKDAuNSk7XG4gICAgICAgIGNvbnN0IHJpZ2h0SXJpc0NlbnRlciA9IHRoaXMuX2tleVBvaW50cy5yaWdodF9pcmlzX3RvcC5wb3NcbiAgICAgICAgICAgIC5hZGQodGhpcy5fa2V5UG9pbnRzLnJpZ2h0X2lyaXNfYm90dG9tLnBvcylcbiAgICAgICAgICAgIC5hZGQodGhpcy5fa2V5UG9pbnRzLnJpZ2h0X2lyaXNfbGVmdC5wb3MpXG4gICAgICAgICAgICAuYWRkKHRoaXMuX2tleVBvaW50cy5yaWdodF9pcmlzX3JpZ2h0LnBvcylcbiAgICAgICAgICAgIC5zY2FsZSgwLjUpO1xuXG4gICAgICAgIC8vIENhbGN1bGF0ZSBleWUgY2VudGVyXG4gICAgICAgIGNvbnN0IGxlZnRFeWVDZW50ZXIgPSB0aGlzLl9rZXlQb2ludHMubGVmdF9leWVfdG9wLnBvc1xuICAgICAgICAgICAgLmFkZCh0aGlzLl9rZXlQb2ludHMubGVmdF9leWVfYm90dG9tLnBvcylcbiAgICAgICAgICAgIC5hZGQodGhpcy5fa2V5UG9pbnRzLmxlZnRfZXllX2lubmVyX3NlY29uZGFyeS5wb3MpXG4gICAgICAgICAgICAuYWRkKHRoaXMuX2tleVBvaW50cy5sZWZ0X2V5ZV9vdXRlcl9zZWNvbmRhcnkucG9zKVxuICAgICAgICAgICAgLnNjYWxlKDAuNSk7XG4gICAgICAgIGNvbnN0IHJpZ2h0RXllQ2VudGVyID0gdGhpcy5fa2V5UG9pbnRzLnJpZ2h0X2V5ZV90b3AucG9zXG4gICAgICAgICAgICAuYWRkKHRoaXMuX2tleVBvaW50cy5yaWdodF9leWVfYm90dG9tLnBvcylcbiAgICAgICAgICAgIC5hZGQodGhpcy5fa2V5UG9pbnRzLnJpZ2h0X2V5ZV9vdXRlcl9zZWNvbmRhcnkucG9zKVxuICAgICAgICAgICAgLmFkZCh0aGlzLl9rZXlQb2ludHMucmlnaHRfZXllX2lubmVyX3NlY29uZGFyeS5wb3MpXG4gICAgICAgICAgICAuc2NhbGUoMC41KTtcblxuICAgICAgICAvLyBDYWxjdWxhdGUgb2Zmc2V0c1xuICAgICAgICBjb25zdCBsZWZ0RXllV2lkdGggPSB0aGlzLl9rZXlQb2ludHMubGVmdF9leWVfaW5uZXIucG9zXG4gICAgICAgICAgICAuc3VidHJhY3QodGhpcy5fa2V5UG9pbnRzLmxlZnRfZXllX291dGVyLnBvcylcbiAgICAgICAgICAgIC5sZW5ndGgoKTtcbiAgICAgICAgY29uc3QgcmlnaHRFeWVXaWR0aCA9IHRoaXMuX2tleVBvaW50cy5yaWdodF9leWVfaW5uZXIucG9zXG4gICAgICAgICAgICAuc3VidHJhY3QodGhpcy5fa2V5UG9pbnRzLnJpZ2h0X2V5ZV9vdXRlci5wb3MpXG4gICAgICAgICAgICAubGVuZ3RoKCk7XG5cbiAgICAgICAgY29uc3QgbGVmdElyaXNPZmZzZXQgPSBsZWZ0SXJpc0NlbnRlclxuICAgICAgICAgICAgLnN1YnRyYWN0KGxlZnRFeWVDZW50ZXIpXG4gICAgICAgICAgICAuc2NhbGUoUG9zZXMuRVlFX1dJRFRIX0JBU0VMSU5FIC8gbGVmdEV5ZVdpZHRoKTtcbiAgICAgICAgY29uc3QgcmlnaHRJcmlzT2Zmc2V0ID0gcmlnaHRJcmlzQ2VudGVyXG4gICAgICAgICAgICAuc3VidHJhY3QocmlnaHRFeWVDZW50ZXIpXG4gICAgICAgICAgICAuc2NhbGUoUG9zZXMuRVlFX1dJRFRIX0JBU0VMSU5FIC8gcmlnaHRFeWVXaWR0aCk7XG5cbiAgICAgICAgLy8gUmVtYXAgb2Zmc2V0cyB0byBxdWF0ZXJuaW9uc1xuICAgICAgICBjb25zdCBsZWZ0SXJpc1JvdGF0aW9uWVBSID0gUXVhdGVybmlvbi5Sb3RhdGlvbllhd1BpdGNoUm9sbChcbiAgICAgICAgICAgIHJlbWFwUmFuZ2VXaXRoQ2FwKFxuICAgICAgICAgICAgICAgIGxlZnRJcmlzT2Zmc2V0LngsXG4gICAgICAgICAgICAgICAgLVBvc2VzLklSSVNfTVBfWF9SQU5HRSxcbiAgICAgICAgICAgICAgICBQb3Nlcy5JUklTX01QX1hfUkFOR0UsXG4gICAgICAgICAgICAgICAgLVBvc2VzLklSSVNfQkpTX1hfUkFOR0UsXG4gICAgICAgICAgICAgICAgUG9zZXMuSVJJU19CSlNfWF9SQU5HRVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIHJlbWFwUmFuZ2VXaXRoQ2FwKFxuICAgICAgICAgICAgICAgIGxlZnRJcmlzT2Zmc2V0LnksXG4gICAgICAgICAgICAgICAgLVBvc2VzLklSSVNfTVBfWV9SQU5HRSxcbiAgICAgICAgICAgICAgICBQb3Nlcy5JUklTX01QX1lfUkFOR0UsXG4gICAgICAgICAgICAgICAgLVBvc2VzLklSSVNfQkpTX1lfUkFOR0UsXG4gICAgICAgICAgICAgICAgUG9zZXMuSVJJU19CSlNfWV9SQU5HRVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIDBcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgcmlnaHRJcmlzUm90YXRpb25ZUFIgPSBRdWF0ZXJuaW9uLlJvdGF0aW9uWWF3UGl0Y2hSb2xsKFxuICAgICAgICAgICAgcmVtYXBSYW5nZVdpdGhDYXAoXG4gICAgICAgICAgICAgICAgcmlnaHRJcmlzT2Zmc2V0LngsXG4gICAgICAgICAgICAgICAgLVBvc2VzLklSSVNfTVBfWF9SQU5HRSxcbiAgICAgICAgICAgICAgICBQb3Nlcy5JUklTX01QX1hfUkFOR0UsXG4gICAgICAgICAgICAgICAgLVBvc2VzLklSSVNfQkpTX1hfUkFOR0UsXG4gICAgICAgICAgICAgICAgUG9zZXMuSVJJU19CSlNfWF9SQU5HRVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIHJlbWFwUmFuZ2VXaXRoQ2FwKFxuICAgICAgICAgICAgICAgIHJpZ2h0SXJpc09mZnNldC55LFxuICAgICAgICAgICAgICAgIC1Qb3Nlcy5JUklTX01QX1lfUkFOR0UsXG4gICAgICAgICAgICAgICAgUG9zZXMuSVJJU19NUF9ZX1JBTkdFLFxuICAgICAgICAgICAgICAgIC1Qb3Nlcy5JUklTX0JKU19ZX1JBTkdFLFxuICAgICAgICAgICAgICAgIFBvc2VzLklSSVNfQkpTX1lfUkFOR0VcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICAwXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5fYm9uZVJvdGF0aW9uc1tcImxlZnRJcmlzXCJdLnNldChsZWZ0SXJpc1JvdGF0aW9uWVBSKTtcbiAgICAgICAgdGhpcy5fYm9uZVJvdGF0aW9uc1tcInJpZ2h0SXJpc1wiXS5zZXQocmlnaHRJcmlzUm90YXRpb25ZUFIpO1xuICAgICAgICB0aGlzLl9ib25lUm90YXRpb25zW1wiaXJpc1wiXS5zZXQoXG4gICAgICAgICAgICB0aGlzLmxSTGlua1F1YXRlcm5pb24obGVmdElyaXNSb3RhdGlvbllQUiwgcmlnaHRJcmlzUm90YXRpb25ZUFIpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjYWxjRXhwcmVzc2lvbnMoKSB7XG4gICAgICAgIGlmICghdGhpcy5jbG9uZWFibGVJbnB1dFJlc3VsdHM/LmZhY2VMYW5kbWFya3MpIHJldHVybjtcblxuICAgICAgICBjb25zdCBsZWZ0VG9wVG9NaWRkbGUgPSBwb2ludExpbmVEaXN0YW5jZShcbiAgICAgICAgICAgIHRoaXMuX2tleVBvaW50cy5sZWZ0X2V5ZV90b3AucG9zLFxuICAgICAgICAgICAgdGhpcy5fa2V5UG9pbnRzLmxlZnRfZXllX2lubmVyLnBvcyxcbiAgICAgICAgICAgIHRoaXMuX2tleVBvaW50cy5sZWZ0X2V5ZV9vdXRlci5wb3NcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgbGVmdFRvcFRvQm90dG9tID0gdGhpcy5fa2V5UG9pbnRzLmxlZnRfZXllX3RvcC5wb3NcbiAgICAgICAgICAgIC5zdWJ0cmFjdCh0aGlzLl9rZXlQb2ludHMubGVmdF9leWVfYm90dG9tLnBvcylcbiAgICAgICAgICAgIC5sZW5ndGgoKTtcbiAgICAgICAgY29uc3QgcmlnaHRUb3BUb01pZGRsZSA9IHBvaW50TGluZURpc3RhbmNlKFxuICAgICAgICAgICAgdGhpcy5fa2V5UG9pbnRzLnJpZ2h0X2V5ZV90b3AucG9zLFxuICAgICAgICAgICAgdGhpcy5fa2V5UG9pbnRzLnJpZ2h0X2V5ZV9pbm5lci5wb3MsXG4gICAgICAgICAgICB0aGlzLl9rZXlQb2ludHMucmlnaHRfZXllX291dGVyLnBvc1xuICAgICAgICApO1xuICAgICAgICBjb25zdCByaWdodFRvcFRvQm90dG9tID0gdGhpcy5fa2V5UG9pbnRzLnJpZ2h0X2V5ZV90b3AucG9zXG4gICAgICAgICAgICAuc3VidHJhY3QodGhpcy5fa2V5UG9pbnRzLnJpZ2h0X2V5ZV9ib3R0b20ucG9zKVxuICAgICAgICAgICAgLmxlbmd0aCgpO1xuXG4gICAgICAgIHRoaXMuX2JsaW5rQmFzZS51cGRhdGVQb3NpdGlvbihcbiAgICAgICAgICAgIG5ldyBWZWN0b3IzKFxuICAgICAgICAgICAgICAgIE1hdGgubG9nKGxlZnRUb3BUb01pZGRsZSAvIGxlZnRUb3BUb0JvdHRvbSArIDEpLFxuICAgICAgICAgICAgICAgIE1hdGgubG9nKHJpZ2h0VG9wVG9NaWRkbGUgLyByaWdodFRvcFRvQm90dG9tICsgMSksXG4gICAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuICAgICAgICBsZXQgbGVmdFJhbmdlT2Zmc2V0ID0gMDtcbiAgICAgICAgaWYgKHRoaXMuX2xlZnRCbGlua0Fyci5sZW5ndGgoKSA+IDQpIHtcbiAgICAgICAgICAgIGxlZnRSYW5nZU9mZnNldCA9XG4gICAgICAgICAgICAgICAgdGhpcy5fbGVmdEJsaW5rQXJyLnZhbHVlcy5yZWR1Y2UoXG4gICAgICAgICAgICAgICAgICAgIChwLCBjLCBpKSA9PiBwICsgKGMgLSBwKSAvIChpICsgMSksXG4gICAgICAgICAgICAgICAgICAgIDBcbiAgICAgICAgICAgICAgICApIC0gUG9zZXMuQkxJTktfUkFUSU9fTE9XO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxlZnRCbGluayA9IHJlbWFwUmFuZ2VOb0NhcChcbiAgICAgICAgICAgIHRoaXMuX2JsaW5rQmFzZS5wb3MueCxcbiAgICAgICAgICAgIFBvc2VzLkJMSU5LX1JBVElPX0xPVyArIGxlZnRSYW5nZU9mZnNldCxcbiAgICAgICAgICAgIFBvc2VzLkJMSU5LX1JBVElPX0hJR0ggKyBsZWZ0UmFuZ2VPZmZzZXQsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMVxuICAgICAgICApO1xuICAgICAgICB0aGlzLl9sZWZ0QmxpbmtBcnIucHVzaCh0aGlzLl9ibGlua0Jhc2UucG9zLngpO1xuXG4gICAgICAgIGxldCByaWdodFJhbmdlT2Zmc2V0ID0gMDtcbiAgICAgICAgaWYgKHRoaXMuX3JpZ2h0QmxpbmtBcnIubGVuZ3RoKCkgPiA0KSB7XG4gICAgICAgICAgICByaWdodFJhbmdlT2Zmc2V0ID1cbiAgICAgICAgICAgICAgICB0aGlzLl9yaWdodEJsaW5rQXJyLnZhbHVlcy5yZWR1Y2UoXG4gICAgICAgICAgICAgICAgICAgIChwLCBjLCBpKSA9PiBwICsgKGMgLSBwKSAvIChpICsgMSksXG4gICAgICAgICAgICAgICAgICAgIDBcbiAgICAgICAgICAgICAgICApIC0gUG9zZXMuQkxJTktfUkFUSU9fTE9XO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJpZ2h0QmxpbmsgPSByZW1hcFJhbmdlTm9DYXAoXG4gICAgICAgICAgICB0aGlzLl9ibGlua0Jhc2UucG9zLnksXG4gICAgICAgICAgICBQb3Nlcy5CTElOS19SQVRJT19MT1cgKyByaWdodFJhbmdlT2Zmc2V0LFxuICAgICAgICAgICAgUG9zZXMuQkxJTktfUkFUSU9fSElHSCArIHJpZ2h0UmFuZ2VPZmZzZXQsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMVxuICAgICAgICApO1xuICAgICAgICB0aGlzLl9yaWdodEJsaW5rQXJyLnB1c2godGhpcy5fYmxpbmtCYXNlLnBvcy55KTtcblxuICAgICAgICBjb25zdCBibGluayA9IHRoaXMubFJMaW5rKGxlZnRCbGluaywgcmlnaHRCbGluayk7XG5cbiAgICAgICAgdGhpcy5fYm9uZVJvdGF0aW9uc1tcImJsaW5rXCJdLnNldChcbiAgICAgICAgICAgIG5ldyBRdWF0ZXJuaW9uKGxlZnRCbGluaywgcmlnaHRCbGluaywgYmxpbmssIDApXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgbW91dGhXaWR0aCA9IHRoaXMuX2tleVBvaW50cy5tb3V0aF9sZWZ0LnBvc1xuICAgICAgICAgICAgLnN1YnRyYWN0KHRoaXMuX2tleVBvaW50cy5tb3V0aF9yaWdodC5wb3MpXG4gICAgICAgICAgICAubGVuZ3RoKCk7XG4gICAgICAgIGNvbnN0IG1vdXRoUmFuZ2UxID0gcmVtYXBSYW5nZVdpdGhDYXAoXG4gICAgICAgICAgICAodGhpcy5fa2V5UG9pbnRzLm1vdXRoX3RvcF9maXJzdC5wb3NcbiAgICAgICAgICAgICAgICAuc3VidHJhY3QodGhpcy5fa2V5UG9pbnRzLm1vdXRoX2JvdHRvbV9maXJzdC5wb3MpXG4gICAgICAgICAgICAgICAgLmxlbmd0aCgpICpcbiAgICAgICAgICAgICAgICBQb3Nlcy5NT1VUSF9XSURUSF9CQVNFTElORSkgL1xuICAgICAgICAgICAgICAgIG1vdXRoV2lkdGgsXG4gICAgICAgICAgICBQb3Nlcy5NT1VUSF9NUF9SQU5HRV9MT1csXG4gICAgICAgICAgICBQb3Nlcy5NT1VUSF9NUF9SQU5HRV9ISUdILFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDFcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgbW91dGhSYW5nZTIgPSByZW1hcFJhbmdlV2l0aENhcChcbiAgICAgICAgICAgICh0aGlzLl9rZXlQb2ludHMubW91dGhfdG9wX3NlY29uZC5wb3NcbiAgICAgICAgICAgICAgICAuc3VidHJhY3QodGhpcy5fa2V5UG9pbnRzLm1vdXRoX2JvdHRvbV9zZWNvbmQucG9zKVxuICAgICAgICAgICAgICAgIC5sZW5ndGgoKSAqXG4gICAgICAgICAgICAgICAgUG9zZXMuTU9VVEhfV0lEVEhfQkFTRUxJTkUpIC9cbiAgICAgICAgICAgICAgICBtb3V0aFdpZHRoLFxuICAgICAgICAgICAgUG9zZXMuTU9VVEhfTVBfUkFOR0VfTE9XLFxuICAgICAgICAgICAgUG9zZXMuTU9VVEhfTVBfUkFOR0VfSElHSCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAxXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IG1vdXRoUmFuZ2UzID0gcmVtYXBSYW5nZVdpdGhDYXAoXG4gICAgICAgICAgICAodGhpcy5fa2V5UG9pbnRzLm1vdXRoX3RvcF90aGlyZC5wb3NcbiAgICAgICAgICAgICAgICAuc3VidHJhY3QodGhpcy5fa2V5UG9pbnRzLm1vdXRoX2JvdHRvbV90aGlyZC5wb3MpXG4gICAgICAgICAgICAgICAgLmxlbmd0aCgpICpcbiAgICAgICAgICAgICAgICBQb3Nlcy5NT1VUSF9XSURUSF9CQVNFTElORSkgL1xuICAgICAgICAgICAgICAgIG1vdXRoV2lkdGgsXG4gICAgICAgICAgICBQb3Nlcy5NT1VUSF9NUF9SQU5HRV9MT1csXG4gICAgICAgICAgICBQb3Nlcy5NT1VUSF9NUF9SQU5HRV9ISUdILFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDFcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5fYm9uZVJvdGF0aW9uc1tcIm1vdXRoXCJdLnNldChcbiAgICAgICAgICAgIG5ldyBRdWF0ZXJuaW9uKFxuICAgICAgICAgICAgICAgIChtb3V0aFJhbmdlMSArIG1vdXRoUmFuZ2UyICsgbW91dGhSYW5nZTMpIC8gMyxcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2FsY1Bvc2VCb25lcygpIHtcbiAgICAgICAgLy8gRG8gbm90IGNhbGN1bGF0ZSBwb3NlIGlmIG5vIHZpc2libGUgZmFjZS4gSXQgY2FuIGxlYWQgdG8gd2llcmQgcG9zZXMuXG4gICAgICAgIGlmICghdGhpcy5jbG9uZWFibGVJbnB1dFJlc3VsdHM/LnBvc2VMYW5kbWFya3MpIHJldHVybjtcbiAgICAgICAgLy8gVXNlIGhpcHMgYXMgdGhlIHN0YXJ0aW5nIHBvaW50LiBSb3RhdGlvbiBvZiBoaXBzIGlzIGFsd2F5cyBvbiBYWiBwbGFuZS5cbiAgICAgICAgLy8gVXBwZXIgY2hlc3QgaXMgbm90IHVzZWQuXG4gICAgICAgIC8vIFRPRE8gZGVyaXZlIG5lY2sgYW5kIGNoZXN0IGZyb20gc3BpbmUgYW5kIGhlYWQuXG5cbiAgICAgICAgY29uc3QgbGVmdEhpcCA9IHRoaXMud29ybGRQb3NlTGFuZG1hcmtzW1BPU0VfTEFORE1BUktTLkxFRlRfSElQXS5wb3M7XG4gICAgICAgIGNvbnN0IHJpZ2h0SGlwID0gdGhpcy53b3JsZFBvc2VMYW5kbWFya3NbUE9TRV9MQU5ETUFSS1MuUklHSFRfSElQXS5wb3M7XG4gICAgICAgIGNvbnN0IGxlZnRTaG91bGRlciA9XG4gICAgICAgICAgICB0aGlzLndvcmxkUG9zZUxhbmRtYXJrc1tQT1NFX0xBTkRNQVJLUy5MRUZUX1NIT1VMREVSXS5wb3M7XG4gICAgICAgIGNvbnN0IHJpZ2h0U2hvdWxkZXIgPVxuICAgICAgICAgICAgdGhpcy53b3JsZFBvc2VMYW5kbWFya3NbUE9TRV9MQU5ETUFSS1MuUklHSFRfU0hPVUxERVJdLnBvcztcblxuICAgICAgICB0aGlzLnBvc2VOb3JtYWxzLmxlbmd0aCA9IDA7XG5cbiAgICAgICAgLy8gSGlwc1xuICAgICAgICBjb25zdCB3b3JsZFhaUGxhbmUgPSBQbGFuZS5Gcm9tUG9zaXRpb25BbmROb3JtYWwoXG4gICAgICAgICAgICBWZWN0b3IzLlplcm8oKSxcbiAgICAgICAgICAgIG5ldyBWZWN0b3IzKDAsIDEsIDApXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGhpcExpbmUgPSBsZWZ0SGlwLnN1YnRyYWN0KHJpZ2h0SGlwKTtcbiAgICAgICAgY29uc3QgaGlwTGluZVByb2ogPSBwcm9qZWN0VmVjdG9yT25QbGFuZSh3b3JsZFhaUGxhbmUsIGhpcExpbmUpO1xuICAgICAgICBjb25zdCBoaXBSb3RhdGlvbkFuZ2xlID0gTWF0aC5hdGFuMihoaXBMaW5lUHJvai56LCBoaXBMaW5lUHJvai54KTtcbiAgICAgICAgdGhpcy5fYm9uZVJvdGF0aW9uc1tcImhpcHNcIl0uc2V0KFxuICAgICAgICAgICAgUXVhdGVybmlvbi5Gcm9tRXVsZXJBbmdsZXMoMCwgaGlwUm90YXRpb25BbmdsZSwgMClcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBDaGVzdC9TaG91bGRlclxuICAgICAgICBjb25zdCBzaG91bGRlck5vcm1SID0gUGxhbmUuRnJvbVBvaW50cyhcbiAgICAgICAgICAgIHJpZ2h0U2hvdWxkZXIsXG4gICAgICAgICAgICBsZWZ0U2hvdWxkZXIsXG4gICAgICAgICAgICByaWdodEhpcFxuICAgICAgICApLm5vcm1hbDtcbiAgICAgICAgY29uc3Qgc2hvdWxkZXJOb3JtTCA9IFBsYW5lLkZyb21Qb2ludHMoXG4gICAgICAgICAgICByaWdodFNob3VsZGVyLFxuICAgICAgICAgICAgbGVmdFNob3VsZGVyLFxuICAgICAgICAgICAgbGVmdEhpcFxuICAgICAgICApLm5vcm1hbDtcbiAgICAgICAgY29uc3Qgc2hvdWxkZXJOb3JtYWwgPSBzaG91bGRlck5vcm1MLmFkZChzaG91bGRlck5vcm1SKS5ub3JtYWxpemUoKTtcblxuICAgICAgICAvLyBTcGluZVxuICAgICAgICBpZiAoc2hvdWxkZXJOb3JtYWwubGVuZ3RoKCkgPiAwLjEpIHtcbiAgICAgICAgICAgIGNvbnN0IHNwaW5lUGFyZW50UXVhdGVybmlvbiA9IHRoaXMuYXBwbHlRdWF0ZXJuaW9uQ2hhaW4oXG4gICAgICAgICAgICAgICAgXCJzcGluZVwiLFxuICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY29uc3Qgc3BpbmVCYXNpcyA9IHRoaXMuX2JvbmVSb3RhdGlvbnNbXCJzcGluZVwiXS5yb3RhdGVCYXNpcyhcbiAgICAgICAgICAgICAgICBzcGluZVBhcmVudFF1YXRlcm5pb25cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBuZXdTcGluZUJhc2lzWSA9IHJpZ2h0U2hvdWxkZXJcbiAgICAgICAgICAgICAgICAuc3VidHJhY3QobGVmdFNob3VsZGVyKVxuICAgICAgICAgICAgICAgIC5ub3JtYWxpemUoKTtcbiAgICAgICAgICAgIGNvbnN0IG5ld1NwaW5lQmFzaXMgPSBuZXcgQmFzaXMoW1xuICAgICAgICAgICAgICAgIHNob3VsZGVyTm9ybWFsLFxuICAgICAgICAgICAgICAgIG5ld1NwaW5lQmFzaXNZLFxuICAgICAgICAgICAgICAgIFZlY3RvcjMuQ3Jvc3Moc2hvdWxkZXJOb3JtYWwsIG5ld1NwaW5lQmFzaXNZKSxcbiAgICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgICB0aGlzLl9ib25lUm90YXRpb25zW1wic3BpbmVcIl0uc2V0KFxuICAgICAgICAgICAgICAgIHJldmVyc2VSb3RhdGlvbihcbiAgICAgICAgICAgICAgICAgICAgcXVhdGVybmlvbkJldHdlZW5CYXNlcyhcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwaW5lQmFzaXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdTcGluZUJhc2lzLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3BpbmVQYXJlbnRRdWF0ZXJuaW9uXG4gICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgIEFYSVMueXpcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jYWxjV3Jpc3RCb25lcygpO1xuXG4gICAgICAgIC8vIEFybXNcbiAgICAgICAgbGV0IHRoZXRhID0gMCxcbiAgICAgICAgICAgIHBoaSA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgayBvZiBMUikge1xuICAgICAgICAgICAgY29uc3QgaXNMZWZ0ID0gayA9PT0gXCJsZWZ0XCI7XG4gICAgICAgICAgICBpZiAoIXRoaXMuc2hhbGxVcGRhdGVBcm0oaXNMZWZ0KSkgY29udGludWU7XG5cbiAgICAgICAgICAgIGNvbnN0IHVwcGVyQXJtS2V5ID0gYCR7a31VcHBlckFybWA7XG4gICAgICAgICAgICBjb25zdCBzaG91bGRlckxhbmRtYXJrID1cbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkUG9zZUxhbmRtYXJrc1tcbiAgICAgICAgICAgICAgICAgICAgUE9TRV9MQU5ETUFSS1NbXG4gICAgICAgICAgICAgICAgICAgICAgICBgJHtrLnRvVXBwZXJDYXNlKCl9X1NIT1VMREVSYCBhcyBrZXlvZiB0eXBlb2YgUE9TRV9MQU5ETUFSS1NcbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIF0ucG9zO1xuICAgICAgICAgICAgY29uc3QgZWxib3dMYW5kbWFyayA9XG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZFBvc2VMYW5kbWFya3NbXG4gICAgICAgICAgICAgICAgICAgIFBPU0VfTEFORE1BUktTW1xuICAgICAgICAgICAgICAgICAgICAgICAgYCR7ay50b1VwcGVyQ2FzZSgpfV9FTEJPV2AgYXMga2V5b2YgdHlwZW9mIFBPU0VfTEFORE1BUktTXG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICBdLnBvcztcbiAgICAgICAgICAgIGNvbnN0IHdyaXN0TGFuZG1hcmsgPVxuICAgICAgICAgICAgICAgIHRoaXMud29ybGRQb3NlTGFuZG1hcmtzW1xuICAgICAgICAgICAgICAgICAgICBQT1NFX0xBTkRNQVJLU1tcbiAgICAgICAgICAgICAgICAgICAgICAgIGAke2sudG9VcHBlckNhc2UoKX1fV1JJU1RgIGFzIGtleW9mIHR5cGVvZiBQT1NFX0xBTkRNQVJLU1xuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgXS5wb3M7XG5cbiAgICAgICAgICAgIGNvbnN0IHVwcGVyQXJtRGlyID0gZWxib3dMYW5kbWFya1xuICAgICAgICAgICAgICAgIC5zdWJ0cmFjdChzaG91bGRlckxhbmRtYXJrKVxuICAgICAgICAgICAgICAgIC5ub3JtYWxpemUoKTtcbiAgICAgICAgICAgIGNvbnN0IHVwcGVyQXJtUGFyZW50UXVhdGVybmlvbiA9IHRoaXMuYXBwbHlRdWF0ZXJuaW9uQ2hhaW4oXG4gICAgICAgICAgICAgICAgdXBwZXJBcm1LZXksXG4gICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCB1cHBlckFybUJhc2lzID0gdGhpcy5fYm9uZVJvdGF0aW9uc1t1cHBlckFybUtleV0ucm90YXRlQmFzaXMoXG4gICAgICAgICAgICAgICAgdXBwZXJBcm1QYXJlbnRRdWF0ZXJuaW9uXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBbdGhldGEsIHBoaV0gPSBjYWxjU3BoZXJpY2FsQ29vcmQodXBwZXJBcm1EaXIsIHVwcGVyQXJtQmFzaXMpO1xuICAgICAgICAgICAgdGhpcy5fYm9uZVJvdGF0aW9uc1t1cHBlckFybUtleV0uc2V0KFxuICAgICAgICAgICAgICAgIHJldmVyc2VSb3RhdGlvbihcbiAgICAgICAgICAgICAgICAgICAgc3BoZXJpY2FsVG9RdWF0ZXJuaW9uKFxuICAgICAgICAgICAgICAgICAgICAgICAgdXBwZXJBcm1CYXNpcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGhpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXBwZXJBcm1QYXJlbnRRdWF0ZXJuaW9uXG4gICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgIEFYSVMueXpcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvLyBSb3RhdGUgbG93ZXIgYXJtcyBhcm91bmQgWCBheGlzIHRvZ2V0aGVyIHdpdGggaGFuZHMuXG4gICAgICAgICAgICAvLyBUaGlzIGlzIGEgY29tYmluYXRpb24gb2Ygc3BoZXJpY2FsIGNvb3JkaW5hdGVzIHJvdGF0aW9uIGFuZCByb3RhdGlvbiBiZXR3ZWVuIGJhc2VzLlxuICAgICAgICAgICAgY29uc3QgaGFuZE5vcm1hbCA9IGlzTGVmdFxuICAgICAgICAgICAgICAgID8gdGhpcy5sZWZ0SGFuZE5vcm1hbFxuICAgICAgICAgICAgICAgIDogdGhpcy5yaWdodEhhbmROb3JtYWw7XG4gICAgICAgICAgICBjb25zdCBsb3dlckFybUtleSA9IGAke2t9TG93ZXJBcm1gO1xuICAgICAgICAgICAgY29uc3QgbG93ZXJBcm1EaXIgPSB3cmlzdExhbmRtYXJrXG4gICAgICAgICAgICAgICAgLnN1YnRyYWN0KGVsYm93TGFuZG1hcmspXG4gICAgICAgICAgICAgICAgLm5vcm1hbGl6ZSgpO1xuICAgICAgICAgICAgY29uc3QgbG93ZXJBcm1QcmV2UXVhdGVybmlvbiA9IHRoaXMuYXBwbHlRdWF0ZXJuaW9uQ2hhaW4oXG4gICAgICAgICAgICAgICAgbG93ZXJBcm1LZXksXG4gICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBsb3dlckFybUJhc2lzID0gdGhpcy5fYm9uZVJvdGF0aW9uc1tsb3dlckFybUtleV0ucm90YXRlQmFzaXMoXG4gICAgICAgICAgICAgICAgbG93ZXJBcm1QcmV2UXVhdGVybmlvblxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIFt0aGV0YSwgcGhpXSA9IGNhbGNTcGhlcmljYWxDb29yZChsb3dlckFybURpciwgbG93ZXJBcm1CYXNpcyk7XG5cbiAgICAgICAgICAgIGNvbnN0IGhhbmROb3JtYWxzS2V5ID0gYCR7a31IYW5kTm9ybWFsc2A7XG4gICAgICAgICAgICBjb25zdCBoYW5kTm9ybWFscyA9IHRoaXNbXG4gICAgICAgICAgICAgICAgaGFuZE5vcm1hbHNLZXkgYXMgUG9zZXNLZXlcbiAgICAgICAgICAgIF0gYXMgTm9ybWFsaXplZExhbmRtYXJrTGlzdDtcbiAgICAgICAgICAgIGhhbmROb3JtYWxzLmxlbmd0aCA9IDA7XG5cbiAgICAgICAgICAgIGNvbnN0IGZpcnN0UXVhdGVybmlvbiA9IHJldmVyc2VSb3RhdGlvbihcbiAgICAgICAgICAgICAgICBzcGhlcmljYWxUb1F1YXRlcm5pb24oXG4gICAgICAgICAgICAgICAgICAgIGxvd2VyQXJtQmFzaXMsXG4gICAgICAgICAgICAgICAgICAgIHRoZXRhLFxuICAgICAgICAgICAgICAgICAgICBwaGksXG4gICAgICAgICAgICAgICAgICAgIGxvd2VyQXJtUHJldlF1YXRlcm5pb25cbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIEFYSVMueXpcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBmaW5hbFF1YXRlcm5pb24gPSB0aGlzLmFwcGx5WFJvdGF0aW9uV2l0aENoaWxkKFxuICAgICAgICAgICAgICAgIGxvd2VyQXJtS2V5LFxuICAgICAgICAgICAgICAgIGxvd2VyQXJtUHJldlF1YXRlcm5pb24sXG4gICAgICAgICAgICAgICAgZmlyc3RRdWF0ZXJuaW9uLFxuICAgICAgICAgICAgICAgIGhhbmROb3JtYWwsXG4gICAgICAgICAgICAgICAgbG93ZXJBcm1CYXNpc1xuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgdGhpcy5fYm9uZVJvdGF0aW9uc1tsb3dlckFybUtleV0uc2V0KGZpbmFsUXVhdGVybmlvbik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVXBkYXRlIHJvdGF0aW9ucyBvbiB3cmlzdHNcbiAgICAgICAgdGhpcy5jYWxjV3Jpc3RCb25lcyhmYWxzZSk7XG5cbiAgICAgICAgLy8gTGVncyBhbmQgZmVldFxuICAgICAgICBmb3IgKGNvbnN0IGsgb2YgTFIpIHtcbiAgICAgICAgICAgIGNvbnN0IGlzTGVmdCA9IGsgPT09IFwibGVmdFwiO1xuICAgICAgICAgICAgaWYgKCF0aGlzLnNoYWxsVXBkYXRlTGVncyhpc0xlZnQpKSBjb250aW51ZTtcblxuICAgICAgICAgICAgY29uc3QgdGhpc0xhbmRtYXJrcyA9IGlzTGVmdFxuICAgICAgICAgICAgICAgID8gUE9TRV9MQU5ETUFSS1NfTEVGVFxuICAgICAgICAgICAgICAgIDogUE9TRV9MQU5ETUFSS1NfUklHSFQ7XG4gICAgICAgICAgICBjb25zdCB1cHBlckxlZ0tleSA9IGAke2t9VXBwZXJMZWdgO1xuICAgICAgICAgICAgY29uc3QgbG93ZXJMZWdLZXkgPSBgJHtrfUxvd2VyTGVnYDtcbiAgICAgICAgICAgIGNvbnN0IGhpcExhbmRtYXJrID1cbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkUG9zZUxhbmRtYXJrc1tcbiAgICAgICAgICAgICAgICAgICAgdGhpc0xhbmRtYXJrc1tcbiAgICAgICAgICAgICAgICAgICAgICAgIGAke2sudG9VcHBlckNhc2UoKX1fSElQYCBhcyBrZXlvZiB0eXBlb2YgdGhpc0xhbmRtYXJrc1xuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgXS5wb3M7XG4gICAgICAgICAgICBjb25zdCBrbmVlTGFuZG1hcmsgPVxuICAgICAgICAgICAgICAgIHRoaXMud29ybGRQb3NlTGFuZG1hcmtzW1xuICAgICAgICAgICAgICAgICAgICB0aGlzTGFuZG1hcmtzW1xuICAgICAgICAgICAgICAgICAgICAgICAgYCR7ay50b1VwcGVyQ2FzZSgpfV9LTkVFYCBhcyBrZXlvZiB0eXBlb2YgdGhpc0xhbmRtYXJrc1xuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgXS5wb3M7XG4gICAgICAgICAgICBjb25zdCBhbmtsZUxhbmRtYXJrID1cbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkUG9zZUxhbmRtYXJrc1tcbiAgICAgICAgICAgICAgICAgICAgdGhpc0xhbmRtYXJrc1tcbiAgICAgICAgICAgICAgICAgICAgICAgIGAke2sudG9VcHBlckNhc2UoKX1fQU5LTEVgIGFzIGtleW9mIHR5cGVvZiB0aGlzTGFuZG1hcmtzXG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICBdLnBvcztcblxuICAgICAgICAgICAgY29uc3QgdXBwZXJMZWdEaXIgPSBrbmVlTGFuZG1hcmsuc3VidHJhY3QoaGlwTGFuZG1hcmspLm5vcm1hbGl6ZSgpO1xuICAgICAgICAgICAgY29uc3QgdXBwZXJMZWdQYXJlbnRRdWF0ZXJuaW9uID0gdGhpcy5hcHBseVF1YXRlcm5pb25DaGFpbihcbiAgICAgICAgICAgICAgICB1cHBlckxlZ0tleSxcbiAgICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IHVwcGVyTGVnQmFzaXMgPSB0aGlzLl9ib25lUm90YXRpb25zW3VwcGVyTGVnS2V5XS5yb3RhdGVCYXNpcyhcbiAgICAgICAgICAgICAgICB1cHBlckxlZ1BhcmVudFF1YXRlcm5pb25cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBbdGhldGEsIHBoaV0gPSBjYWxjU3BoZXJpY2FsQ29vcmQodXBwZXJMZWdEaXIsIHVwcGVyTGVnQmFzaXMpO1xuICAgICAgICAgICAgdGhpcy5fYm9uZVJvdGF0aW9uc1t1cHBlckxlZ0tleV0uc2V0KFxuICAgICAgICAgICAgICAgIHJldmVyc2VSb3RhdGlvbihcbiAgICAgICAgICAgICAgICAgICAgc3BoZXJpY2FsVG9RdWF0ZXJuaW9uKFxuICAgICAgICAgICAgICAgICAgICAgICAgdXBwZXJMZWdCYXNpcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGhpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXBwZXJMZWdQYXJlbnRRdWF0ZXJuaW9uXG4gICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgIEFYSVMueXpcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb25zdCBsb3dlckxlZ0RpciA9IGFua2xlTGFuZG1hcmtcbiAgICAgICAgICAgICAgICAuc3VidHJhY3Qoa25lZUxhbmRtYXJrKVxuICAgICAgICAgICAgICAgIC5ub3JtYWxpemUoKTtcbiAgICAgICAgICAgIGNvbnN0IGxvd2VyTGVnUHJldlF1YXRlcm5pb24gPSB0aGlzLmFwcGx5UXVhdGVybmlvbkNoYWluKFxuICAgICAgICAgICAgICAgIGxvd2VyTGVnS2V5LFxuICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY29uc3QgbG93ZXJMZWdCYXNpcyA9IHRoaXMuX2JvbmVSb3RhdGlvbnNbbG93ZXJMZWdLZXldLnJvdGF0ZUJhc2lzKFxuICAgICAgICAgICAgICAgIGxvd2VyTGVnUHJldlF1YXRlcm5pb25cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBbdGhldGEsIHBoaV0gPSBjYWxjU3BoZXJpY2FsQ29vcmQobG93ZXJMZWdEaXIsIGxvd2VyTGVnQmFzaXMpO1xuICAgICAgICAgICAgY29uc3QgZmlyc3RRdWF0ZXJuaW9uID0gcmV2ZXJzZVJvdGF0aW9uKFxuICAgICAgICAgICAgICAgIHNwaGVyaWNhbFRvUXVhdGVybmlvbihcbiAgICAgICAgICAgICAgICAgICAgbG93ZXJMZWdCYXNpcyxcbiAgICAgICAgICAgICAgICAgICAgdGhldGEsXG4gICAgICAgICAgICAgICAgICAgIHBoaSxcbiAgICAgICAgICAgICAgICAgICAgbG93ZXJMZWdQcmV2UXVhdGVybmlvblxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgQVhJUy55elxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuX2JvbmVSb3RhdGlvbnNbbG93ZXJMZWdLZXldLnNldChmaXJzdFF1YXRlcm5pb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jYWxjRmVldEJvbmVzKGZhbHNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0aGlzS2V5OiBrZXkgaW4gX2JvbmVSb3RhdGlvbnNcbiAgICAgKiBwcmV2UXVhdGVybmlvbjogUGFyZW50IGN1bXVsYXRlZCByb3RhdGlvbiBxdWF0ZXJuaW9uXG4gICAgICogZmlyc3RRdWF0ZXJuaW9uOiBSb3RhdGlvbiBxdWF0ZXJuaW9uIGNhbGN1bGF0ZWQgd2l0aG91dCBhcHBseWluZyBYIHJvdGF0aW9uXG4gICAgICogbm9ybWFsOiBBIG5vcm1hbCBwb2ludGluZyB0byBsb2NhbCAteVxuICAgICAqIHRoaXNCYXNpczogYmFzaXMgb24gdGhpcyBub2RlIGFmdGVyIHByZXZRdWF0ZXJuaW9uIGlzIGFwcGxpZWRcbiAgICAgKi9cbiAgICBwcml2YXRlIGFwcGx5WFJvdGF0aW9uV2l0aENoaWxkKFxuICAgICAgICB0aGlzS2V5OiBzdHJpbmcsXG4gICAgICAgIHByZXZRdWF0ZXJuaW9uOiBRdWF0ZXJuaW9uLFxuICAgICAgICBmaXJzdFF1YXRlcm5pb246IFF1YXRlcm5pb24sXG4gICAgICAgIG5vcm1hbDogVmVjdG9yMyxcbiAgICAgICAgdGhpc0Jhc2lzOiBCYXNpc1xuICAgICkge1xuICAgICAgICBjb25zdCB0aGlzUm90YXRlZEJhc2lzID0gdGhpcy5fYm9uZVJvdGF0aW9uc1t0aGlzS2V5XS5yb3RhdGVCYXNpcyhcbiAgICAgICAgICAgIHByZXZRdWF0ZXJuaW9uLm11bHRpcGx5KHJldmVyc2VSb3RhdGlvbihmaXJzdFF1YXRlcm5pb24sIEFYSVMueXopKVxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IHRoaXNZWlBsYW5lID0gUGxhbmUuRnJvbVBvc2l0aW9uQW5kTm9ybWFsKFxuICAgICAgICAgICAgVmVjdG9yMy5aZXJvKCksXG4gICAgICAgICAgICB0aGlzUm90YXRlZEJhc2lzLnguY2xvbmUoKVxuICAgICAgICApO1xuICAgICAgICBjb25zdCBwcm9qZWN0ZWROb3JtYWwgPSBWZWN0b3IzLlplcm8oKTtcbiAgICAgICAgcHJvamVjdFZlY3Rvck9uUGxhbmUodGhpc1laUGxhbmUsIG5vcm1hbCkucm90YXRlQnlRdWF0ZXJuaW9uVG9SZWYoXG4gICAgICAgICAgICBRdWF0ZXJuaW9uLkludmVyc2UoXG4gICAgICAgICAgICAgICAgUXVhdGVybmlvbi5Sb3RhdGlvblF1YXRlcm5pb25Gcm9tQXhpcyhcbiAgICAgICAgICAgICAgICAgICAgdGhpc1JvdGF0ZWRCYXNpcy54LmNsb25lKCksXG4gICAgICAgICAgICAgICAgICAgIHRoaXNSb3RhdGVkQmFzaXMueS5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICB0aGlzUm90YXRlZEJhc2lzLnouY2xvbmUoKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBwcm9qZWN0ZWROb3JtYWxcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgcHJvamVjdGVkUHJldlogPSBWZWN0b3IzLlplcm8oKTtcbiAgICAgICAgcHJvamVjdFZlY3Rvck9uUGxhbmUoXG4gICAgICAgICAgICB0aGlzWVpQbGFuZSxcbiAgICAgICAgICAgIHRoaXNSb3RhdGVkQmFzaXMuei5uZWdhdGUoKVxuICAgICAgICApLnJvdGF0ZUJ5UXVhdGVybmlvblRvUmVmKFxuICAgICAgICAgICAgUXVhdGVybmlvbi5JbnZlcnNlKFxuICAgICAgICAgICAgICAgIFF1YXRlcm5pb24uUm90YXRpb25RdWF0ZXJuaW9uRnJvbUF4aXMoXG4gICAgICAgICAgICAgICAgICAgIHRoaXNSb3RhdGVkQmFzaXMueC5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICB0aGlzUm90YXRlZEJhc2lzLnkuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgdGhpc1JvdGF0ZWRCYXNpcy56LmNsb25lKClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgcHJvamVjdGVkUHJldlpcbiAgICAgICAgKTtcbiAgICAgICAgcHJvamVjdGVkUHJldloubm9ybWFsaXplKCk7XG4gICAgICAgIGxldCB4UHJldiA9IE1hdGguYXRhbjIocHJvamVjdGVkUHJldloueSwgLXByb2plY3RlZFByZXZaLnopO1xuICAgICAgICBsZXQgeEFuZ2xlID0gTWF0aC5hdGFuMihwcm9qZWN0ZWROb3JtYWwueSwgLXByb2plY3RlZE5vcm1hbC56KTtcbiAgICAgICAgaWYgKHhBbmdsZSA+IDApIHhBbmdsZSAtPSBNYXRoLlBJICogMjtcbiAgICAgICAgaWYgKHhBbmdsZSA8IC1NYXRoLlBJICogMS4yNSkgeEFuZ2xlID0geFByZXY7XG4gICAgICAgIC8vIGlmIChpc0xlZykge1xuICAgICAgICAvLyAgICAgaWYgKE1hdGguYWJzKHhBbmdsZSkgPiBNYXRoLlBJICogMC4yNzc4ICYmIE1hdGguYWJzKHhBbmdsZSkgPCBNYXRoLlBJIC8gMikge1xuICAgICAgICAvLyAgICAgICAgIHhBbmdsZSAtPSBNYXRoLlBJICogMC4yNzc4O1xuICAgICAgICAvLyAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gICAgICAgICB4QW5nbGUgPSB4UHJldjtcbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfVxuXG4gICAgICAgIGNvbnN0IHRoaXNYUm90YXRlZEJhc2lzID0gdGhpc1JvdGF0ZWRCYXNpcy5yb3RhdGVCeVF1YXRlcm5pb24oXG4gICAgICAgICAgICBRdWF0ZXJuaW9uLlJvdGF0aW9uQXhpcyhcbiAgICAgICAgICAgICAgICB0aGlzUm90YXRlZEJhc2lzLnguY2xvbmUoKSxcbiAgICAgICAgICAgICAgICAoeEFuZ2xlIC0geFByZXYpICogMC41XG4gICAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgICAgIC8vIFRoZSBxdWF0ZXJuaW9uIG5lZWRzIHRvIGJlIGNhbGN1bGF0ZWQgaW4gbG9jYWwgY29vcmRpbmF0ZSBzeXN0ZW1cbiAgICAgICAgY29uc3Qgc2Vjb25kUXVhdGVybmlvbiA9IHF1YXRlcm5pb25CZXR3ZWVuQmFzZXMoXG4gICAgICAgICAgICB0aGlzQmFzaXMsXG4gICAgICAgICAgICB0aGlzWFJvdGF0ZWRCYXNpcyxcbiAgICAgICAgICAgIHByZXZRdWF0ZXJuaW9uXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgZmluYWxRdWF0ZXJuaW9uID0gcmV2ZXJzZVJvdGF0aW9uKHNlY29uZFF1YXRlcm5pb24sIEFYSVMueXopO1xuICAgICAgICByZXR1cm4gZmluYWxRdWF0ZXJuaW9uO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2FsY1dyaXN0Qm9uZXMoZmlyc3RQYXNzID0gdHJ1ZSkge1xuICAgICAgICBjb25zdCBoYW5kcyA9IHtcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMubGVmdEhhbmRMYW5kbWFya3MsXG4gICAgICAgICAgICByaWdodDogdGhpcy5yaWdodEhhbmRMYW5kbWFya3MsXG4gICAgICAgIH07XG5cbiAgICAgICAgZm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMoaGFuZHMpKSB7XG4gICAgICAgICAgICBjb25zdCBpc0xlZnQgPSBrID09PSBcImxlZnRcIjtcbiAgICAgICAgICAgIGNvbnN0IHdyaXN0VmlzaWxpYml0eSA9XG4gICAgICAgICAgICAgICAgdGhpcy5jbG9uZWFibGVJbnB1dFJlc3VsdHM/LnBvc2VMYW5kbWFya3NbXG4gICAgICAgICAgICAgICAgICAgIGlzTGVmdFxuICAgICAgICAgICAgICAgICAgICAgICAgPyBQT1NFX0xBTkRNQVJLUy5MRUZUX1dSSVNUXG4gICAgICAgICAgICAgICAgICAgICAgICA6IFBPU0VfTEFORE1BUktTLlJJR0hUX1dSSVNUXG4gICAgICAgICAgICAgICAgXS52aXNpYmlsaXR5IHx8IDA7XG4gICAgICAgICAgICBpZiAod3Jpc3RWaXNpbGliaXR5IDw9IFZJU0lCSUxJVFlfVEhSRVNIT0xEKSBjb250aW51ZTtcblxuICAgICAgICAgICAgY29uc3QgdmVydGljZXM6IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3IzW10gPSBbXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICB2W0hBTkRfTEFORE1BUktTLldSSVNUXSxcbiAgICAgICAgICAgICAgICAgICAgdltIQU5EX0xBTkRNQVJLUy5QSU5LWV9NQ1BdLFxuICAgICAgICAgICAgICAgICAgICB2W0hBTkRfTEFORE1BUktTLklOREVYX0ZJTkdFUl9NQ1BdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICB2W0hBTkRfTEFORE1BUktTLldSSVNUXSxcbiAgICAgICAgICAgICAgICAgICAgdltIQU5EX0xBTkRNQVJLUy5SSU5HX0ZJTkdFUl9NQ1BdLFxuICAgICAgICAgICAgICAgICAgICB2W0hBTkRfTEFORE1BUktTLklOREVYX0ZJTkdFUl9NQ1BdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICB2W0hBTkRfTEFORE1BUktTLldSSVNUXSxcbiAgICAgICAgICAgICAgICAgICAgdltIQU5EX0xBTkRNQVJLUy5QSU5LWV9NQ1BdLFxuICAgICAgICAgICAgICAgICAgICB2W0hBTkRfTEFORE1BUktTLk1JRERMRV9GSU5HRVJfTUNQXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgLy8gUm9vdCBub3JtYWxcbiAgICAgICAgICAgIGNvbnN0IGhhbmROb3JtYWwgPSBpc0xlZnRcbiAgICAgICAgICAgICAgICA/IHRoaXMubGVmdEhhbmROb3JtYWxcbiAgICAgICAgICAgICAgICA6IHRoaXMucmlnaHRIYW5kTm9ybWFsO1xuICAgICAgICAgICAgY29uc3Qgcm9vdE5vcm1hbCA9IHZlcnRpY2VzXG4gICAgICAgICAgICAgICAgLnJlZHVjZSgocHJldiwgY3VycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBfbm9ybWFsID0gUG9zZXMubm9ybWFsRnJvbVZlcnRpY2VzKGN1cnIsIGlzTGVmdCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGhhbmROb3JtYWxzLnB1c2godmVjdG9yVG9Ob3JtYWxpemVkTGFuZG1hcmsoX25vcm1hbCkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJldi5hZGQoX25vcm1hbCk7XG4gICAgICAgICAgICAgICAgfSwgVmVjdG9yMy5aZXJvKCkpXG4gICAgICAgICAgICAgICAgLm5vcm1hbGl6ZSgpO1xuICAgICAgICAgICAgaGFuZE5vcm1hbC5jb3B5RnJvbShyb290Tm9ybWFsKTtcbiAgICAgICAgICAgIC8vIGhhbmROb3JtYWxzLnB1c2godmVjdG9yVG9Ob3JtYWxpemVkTGFuZG1hcmsocm9vdE5vcm1hbCkpO1xuXG4gICAgICAgICAgICBjb25zdCB0aGlzV3Jpc3RSb3RhdGlvbiA9XG4gICAgICAgICAgICAgICAgdGhpcy5fYm9uZVJvdGF0aW9uc1tcbiAgICAgICAgICAgICAgICAgICAgaGFuZExhbmRNYXJrVG9Cb25lTmFtZShIQU5EX0xBTkRNQVJLUy5XUklTVCwgaXNMZWZ0KVxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICBjb25zdCBiYXNpczE6IEJhc2lzID0gdGhpc1dyaXN0Um90YXRpb24uYmFzZUJhc2lzO1xuXG4gICAgICAgICAgICAvLyBQcm9qZWN0IHBhbG0gbGFuZG1hcmtzIHRvIGF2ZXJhZ2UgcGxhbmVcbiAgICAgICAgICAgIGNvbnN0IHByb2plY3RlZExhbmRtYXJrcyA9IGNhbGNBdmdQbGFuZShcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgIHZbSEFORF9MQU5ETUFSS1MuV1JJU1RdLnBvcyxcbiAgICAgICAgICAgICAgICAgICAgdltIQU5EX0xBTkRNQVJLUy5JTkRFWF9GSU5HRVJfTUNQXS5wb3MsXG4gICAgICAgICAgICAgICAgICAgIHZbSEFORF9MQU5ETUFSS1MuTUlERExFX0ZJTkdFUl9NQ1BdLnBvcyxcbiAgICAgICAgICAgICAgICAgICAgdltIQU5EX0xBTkRNQVJLUy5SSU5HX0ZJTkdFUl9NQ1BdLnBvcyxcbiAgICAgICAgICAgICAgICAgICAgdltIQU5EX0xBTkRNQVJLUy5QSU5LWV9NQ1BdLnBvcyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIHJvb3ROb3JtYWxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBiYXNpczIgPSBnZXRCYXNpcyhbXG4gICAgICAgICAgICAgICAgcHJvamVjdGVkTGFuZG1hcmtzWzBdLFxuICAgICAgICAgICAgICAgIHByb2plY3RlZExhbmRtYXJrc1sxXSxcbiAgICAgICAgICAgICAgICBwcm9qZWN0ZWRMYW5kbWFya3NbNF0sXG4gICAgICAgICAgICBdKS5yb3RhdGVCeVF1YXRlcm5pb24oXG4gICAgICAgICAgICAgICAgdGhpcy5hcHBseVF1YXRlcm5pb25DaGFpbihcbiAgICAgICAgICAgICAgICAgICAgSEFORF9MQU5ETUFSS1MuV1JJU1QsXG4gICAgICAgICAgICAgICAgICAgIGlzTGVmdFxuICAgICAgICAgICAgICAgICkuY29uanVnYXRlKClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCB3cmlzdFJvdGF0aW9uUXVhdGVybmlvblJhdyA9IHF1YXRlcm5pb25CZXR3ZWVuQmFzZXMoXG4gICAgICAgICAgICAgICAgYmFzaXMxLFxuICAgICAgICAgICAgICAgIGJhc2lzMlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3Qgd3Jpc3RSb3RhdGlvblF1YXRlcm5pb24gPSByZXZlcnNlUm90YXRpb24oXG4gICAgICAgICAgICAgICAgd3Jpc3RSb3RhdGlvblF1YXRlcm5pb25SYXcsXG4gICAgICAgICAgICAgICAgQVhJUy55elxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmICghZmlyc3RQYXNzKSB0aGlzV3Jpc3RSb3RhdGlvbi5zZXQod3Jpc3RSb3RhdGlvblF1YXRlcm5pb24pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjYWxjSGFuZEJvbmVzKCkge1xuICAgICAgICAvLyBSaWdodCBoYW5kIHNoYWxsIGhhdmUgbG9jYWwgeCByZXZlcnNlZD9cbiAgICAgICAgY29uc3QgaGFuZHMgPSB7XG4gICAgICAgICAgICBsZWZ0OiB0aGlzLmxlZnRIYW5kTGFuZG1hcmtzLFxuICAgICAgICAgICAgcmlnaHQ6IHRoaXMucmlnaHRIYW5kTGFuZG1hcmtzLFxuICAgICAgICB9O1xuXG4gICAgICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIE9iamVjdC5lbnRyaWVzKGhhbmRzKSkge1xuICAgICAgICAgICAgY29uc3QgaXNMZWZ0ID0gayA9PT0gXCJsZWZ0XCI7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgSEFORF9MQU5ETUFSS19MRU5HVEg7ICsraSkge1xuICAgICAgICAgICAgICAgIGlmIChpICUgNCA9PT0gMCkgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB0aGlzSGFuZFJvdGF0aW9uID1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYm9uZVJvdGF0aW9uc1toYW5kTGFuZE1hcmtUb0JvbmVOYW1lKGksIGlzTGVmdCldO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRoaXNMYW5kbWFyayA9IHZbaV0ucG9zLmNsb25lKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dExhbmRtYXJrID0gdltpICsgMV0ucG9zLmNsb25lKCk7XG4gICAgICAgICAgICAgICAgbGV0IHRoaXNEaXIgPSBuZXh0TGFuZG1hcmsuc3VidHJhY3QodGhpc0xhbmRtYXJrKS5ub3JtYWxpemUoKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHByZXZRdWF0ZXJuaW9uID0gdGhpcy5hcHBseVF1YXRlcm5pb25DaGFpbihpLCBpc0xlZnQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRoaXNCYXNpcyA9IHRoaXNIYW5kUm90YXRpb24ucm90YXRlQmFzaXMocHJldlF1YXRlcm5pb24pO1xuXG4gICAgICAgICAgICAgICAgLy8gUHJvamVjdCBsYW5kbWFyayB0byBYWiBwbGFuZSBmb3Igc2Vjb25kIGFuZCB0aGlyZCBzZWdtZW50c1xuICAgICAgICAgICAgICAgIGlmIChpICUgNCA9PT0gMiB8fCBpICUgNCA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcm9qUGxhbmUgPSBQbGFuZS5Gcm9tUG9zaXRpb25BbmROb3JtYWwoXG4gICAgICAgICAgICAgICAgICAgICAgICBWZWN0b3IzLlplcm8oKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNCYXNpcy55LmNsb25lKClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpc0RpciA9IHByb2plY3RWZWN0b3JPblBsYW5lKHByb2pQbGFuZSwgdGhpc0Rpcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBbdGhldGEsIHBoaV0gPSBjYWxjU3BoZXJpY2FsQ29vcmQodGhpc0RpciwgdGhpc0Jhc2lzKTtcblxuICAgICAgICAgICAgICAgIC8vIE5lZWQgdG8gdXNlIG9yaWdpbmFsIEJhc2lzLCBiZWNhdXNlIHRoZSBxdWF0ZXJuaW9uIGZyb21cbiAgICAgICAgICAgICAgICAvLyBSb3RhdGlvbkF4aXMgaW5oZXJlbnRseSB1c2VzIGxvY2FsIGNvb3JkaW5hdGUgc3lzdGVtLlxuICAgICAgICAgICAgICAgIGxldCB0aGlzUm90YXRpb25RdWF0ZXJuaW9uO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxyQ29lZmYgPSBpc0xlZnQgPyAtMSA6IDE7XG4gICAgICAgICAgICAgICAgLy8gVGh1bWIgcm90YXRpb25zIGFyZSB5IG1haW4uIE90aGVycyBhcmUgeiBtYWluLlxuICAgICAgICAgICAgICAgIGNvbnN0IHJlbW92ZUF4aXMgPVxuICAgICAgICAgICAgICAgICAgICBpICUgNCA9PT0gMVxuICAgICAgICAgICAgICAgICAgICAgICAgPyBpIDwgNFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gQVhJUy5ub25lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBBWElTLnhcbiAgICAgICAgICAgICAgICAgICAgICAgIDogaSA8IDRcbiAgICAgICAgICAgICAgICAgICAgICAgID8gQVhJUy54elxuICAgICAgICAgICAgICAgICAgICAgICAgOiBBWElTLnh5O1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpcnN0Q2FwQXhpcyA9IGkgPCA0ID8gQVhJUy56IDogQVhJUy55O1xuICAgICAgICAgICAgICAgIGNvbnN0IHNlY29uZENhcEF4aXMgPSBpIDwgNCA/IEFYSVMueSA6IEFYSVMuejtcbiAgICAgICAgICAgICAgICBjb25zdCBzZWNvbmRDYXAgPSBpIDwgMiA/IDE1IDogMTEwO1xuICAgICAgICAgICAgICAgIHRoaXNSb3RhdGlvblF1YXRlcm5pb24gPSByZW1vdmVSb3RhdGlvbkF4aXNXaXRoQ2FwKFxuICAgICAgICAgICAgICAgICAgICBzcGhlcmljYWxUb1F1YXRlcm5pb24oXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzQmFzaXMsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGV0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBoaSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZRdWF0ZXJuaW9uXG4gICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZUF4aXMsXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0Q2FwQXhpcyxcbiAgICAgICAgICAgICAgICAgICAgLTE1LFxuICAgICAgICAgICAgICAgICAgICAxNSxcbiAgICAgICAgICAgICAgICAgICAgc2Vjb25kQ2FwQXhpcyxcbiAgICAgICAgICAgICAgICAgICAgbHJDb2VmZiAqIC0xNSxcbiAgICAgICAgICAgICAgICAgICAgbHJDb2VmZiAqIHNlY29uZENhcFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgdGhpc1JvdGF0aW9uUXVhdGVybmlvbiA9IHJldmVyc2VSb3RhdGlvbihcbiAgICAgICAgICAgICAgICAgICAgdGhpc1JvdGF0aW9uUXVhdGVybmlvbixcbiAgICAgICAgICAgICAgICAgICAgQVhJUy55elxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgdGhpc0hhbmRSb3RhdGlvbi5zZXQodGhpc1JvdGF0aW9uUXVhdGVybmlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNhbGNGZWV0Qm9uZXMoZmlyc3RQYXNzID0gdHJ1ZSkge1xuICAgICAgICBmb3IgKGNvbnN0IGsgb2YgTFIpIHtcbiAgICAgICAgICAgIGNvbnN0IGlzTGVmdCA9IGsgPT09IFwibGVmdFwiO1xuICAgICAgICAgICAgaWYgKCF0aGlzLnNoYWxsVXBkYXRlTGVncyhpc0xlZnQpKSBjb250aW51ZTtcblxuICAgICAgICAgICAgY29uc3QgbGFuZG1hcmtCYXNpcyA9IGlzTGVmdFxuICAgICAgICAgICAgICAgID8gZ2V0QmFzaXMoW1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXMud29ybGRQb3NlTGFuZG1hcmtzW1BPU0VfTEFORE1BUktTX0xFRlQuTEVGVF9IRUVMXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAucG9zLFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMud29ybGRQb3NlTGFuZG1hcmtzW1xuICAgICAgICAgICAgICAgICAgICAgICAgICBQT1NFX0xBTkRNQVJLU19MRUZULkxFRlRfRk9PVF9JTkRFWFxuICAgICAgICAgICAgICAgICAgICAgIF0ucG9zLFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMud29ybGRQb3NlTGFuZG1hcmtzW1BPU0VfTEFORE1BUktTX0xFRlQuTEVGVF9BTktMRV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgLnBvcyxcbiAgICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICAgOiBnZXRCYXNpcyhbXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JsZFBvc2VMYW5kbWFya3NbUE9TRV9MQU5ETUFSS1NfUklHSFQuUklHSFRfSEVFTF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgLnBvcyxcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLndvcmxkUG9zZUxhbmRtYXJrc1tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgUE9TRV9MQU5ETUFSS1NfUklHSFQuUklHSFRfRk9PVF9JTkRFWFxuICAgICAgICAgICAgICAgICAgICAgIF0ucG9zLFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMud29ybGRQb3NlTGFuZG1hcmtzW1BPU0VfTEFORE1BUktTX1JJR0hULlJJR0hUX0FOS0xFXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAucG9zLFxuICAgICAgICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGZvb3RCb25lS2V5ID0gYCR7a31Gb290YDtcbiAgICAgICAgICAgIGNvbnN0IHRoaXNCYXNpcyA9IGxhbmRtYXJrQmFzaXNcbiAgICAgICAgICAgICAgICAubmVnYXRlQXhlcyhBWElTLnl6KVxuICAgICAgICAgICAgICAgIC50cmFuc3Bvc2UoWzEsIDIsIDBdKTtcbiAgICAgICAgICAgIHRoaXNCYXNpcy52ZXJpZnlCYXNpcygpO1xuXG4gICAgICAgICAgICAvLyBSb290IG5vcm1hbFxuICAgICAgICAgICAgY29uc3QgZm9vdE5vcm1hbCA9IGlzTGVmdFxuICAgICAgICAgICAgICAgID8gdGhpcy5sZWZ0Rm9vdE5vcm1hbFxuICAgICAgICAgICAgICAgIDogdGhpcy5yaWdodEZvb3ROb3JtYWw7XG4gICAgICAgICAgICBmb290Tm9ybWFsLmNvcHlGcm9tKHRoaXNCYXNpcy56Lm5lZ2F0ZSgpKTtcblxuICAgICAgICAgICAgY29uc3QgdGhpc0Zvb3RSb3RhdGlvbiA9IHRoaXMuX2JvbmVSb3RhdGlvbnNbZm9vdEJvbmVLZXldO1xuICAgICAgICAgICAgY29uc3QgYmFzaXMxOiBCYXNpcyA9IHRoaXNGb290Um90YXRpb24uYmFzZUJhc2lzO1xuICAgICAgICAgICAgY29uc3QgYmFzaXMyID0gdGhpc0Jhc2lzLnJvdGF0ZUJ5UXVhdGVybmlvbihcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGx5UXVhdGVybmlvbkNoYWluKGZvb3RCb25lS2V5LCBpc0xlZnQpLmNvbmp1Z2F0ZSgpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY29uc3QgZm9vdFJvdGF0aW9uUXVhdGVybmlvblJhdyA9IHF1YXRlcm5pb25CZXR3ZWVuQmFzZXMoXG4gICAgICAgICAgICAgICAgYmFzaXMxLFxuICAgICAgICAgICAgICAgIGJhc2lzMlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3QgZm9vdFJvdGF0aW9uUXVhdGVybmlvbiA9IHJldmVyc2VSb3RhdGlvbihcbiAgICAgICAgICAgICAgICBmb290Um90YXRpb25RdWF0ZXJuaW9uUmF3LFxuICAgICAgICAgICAgICAgIEFYSVMueXpcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoIWZpcnN0UGFzcykgdGhpc0Zvb3RSb3RhdGlvbi5zZXQoZm9vdFJvdGF0aW9uUXVhdGVybmlvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHByZVByb2Nlc3NSZXN1bHRzKCkge1xuICAgICAgICAvLyBQcmVwcm9jZXNzaW5nIHJlc3VsdHNcbiAgICAgICAgLy8gQ3JlYXRlIHBvc2UgbGFuZG1hcmsgbGlzdFxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGNvbnN0IGlucHV0V29ybGRQb3NlTGFuZG1hcmtzOiBOb3JtYWxpemVkTGFuZG1hcmtMaXN0IHwgdW5kZWZpbmVkID1cbiAgICAgICAgICAgIC8vKiBUT0RPOiBQYXRjaGVkLlxuICAgICAgICAgICAgLy8qIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE4MDgzMzg5L2lnbm9yZS10eXBlc2NyaXB0LWVycm9ycy1wcm9wZXJ0eS1kb2VzLW5vdC1leGlzdC1vbi12YWx1ZS1vZi10eXBlXG4gICAgICAgICAgICAvLyB0aGlzLmNsb25lYWJsZUlucHV0UmVzdWx0cz8uZWE7IC8vIFNlZW1zIHRvIGJlIHRoZSBuZXcgcG9zZV93b3JsZF9sYW5kbWFya1xuICAgICAgICAgICAgKHRoaXMuY2xvbmVhYmxlSW5wdXRSZXN1bHRzIGFzIGFueSk/LmVhOyAvLyBTZWVtcyB0byBiZSB0aGUgbmV3IHBvc2Vfd29ybGRfbGFuZG1hcmtcbiAgICAgICAgY29uc3QgaW5wdXRQb3NlTGFuZG1hcmtzOiBOb3JtYWxpemVkTGFuZG1hcmtMaXN0IHwgdW5kZWZpbmVkID1cbiAgICAgICAgICAgIHRoaXMuY2xvbmVhYmxlSW5wdXRSZXN1bHRzPy5wb3NlTGFuZG1hcmtzOyAvLyBTZWVtcyB0byBiZSB0aGUgbmV3IHBvc2Vfd29ybGRfbGFuZG1hcmtcbiAgICAgICAgaWYgKGlucHV0V29ybGRQb3NlTGFuZG1hcmtzICYmIGlucHV0UG9zZUxhbmRtYXJrcykge1xuICAgICAgICAgICAgaWYgKGlucHV0V29ybGRQb3NlTGFuZG1hcmtzLmxlbmd0aCAhPT0gUE9TRV9MQU5ETUFSS19MRU5HVEgpXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgICAgICAgICBgUG9zZSBMYW5kbWFyayBsaXN0IGhhcyBhIGxlbmd0aCBsZXNzIHRoYW4gJHtQT1NFX0xBTkRNQVJLX0xFTkdUSH0hYFxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHRoaXMuaW5wdXRQb3NlTGFuZG1hcmtzID0gdGhpcy5wcmVQcm9jZXNzTGFuZG1hcmtzKFxuICAgICAgICAgICAgICAgIGlucHV0V29ybGRQb3NlTGFuZG1hcmtzLFxuICAgICAgICAgICAgICAgIHRoaXMud29ybGRQb3NlTGFuZG1hcmtzXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5wcmVQcm9jZXNzTGFuZG1hcmtzKGlucHV0UG9zZUxhbmRtYXJrcywgdGhpcy5wb3NlTGFuZG1hcmtzKTtcblxuICAgICAgICAgICAgLy8gUG9zaXRpb25hbCBvZmZzZXRcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAoaW5wdXRXb3JsZFBvc2VMYW5kbWFya3NbUE9TRV9MQU5ETUFSS1MuTEVGVF9ISVBdLnZpc2liaWxpdHkgfHxcbiAgICAgICAgICAgICAgICAgICAgMCkgPiBWSVNJQklMSVRZX1RIUkVTSE9MRCAmJlxuICAgICAgICAgICAgICAgIChpbnB1dFdvcmxkUG9zZUxhbmRtYXJrc1tQT1NFX0xBTkRNQVJLUy5SSUdIVF9ISVBdLnZpc2liaWxpdHkgfHxcbiAgICAgICAgICAgICAgICAgICAgMCkgPiBWSVNJQklMSVRZX1RIUkVTSE9MRFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWlkSGlwUG9zID0gdmVjdG9yVG9Ob3JtYWxpemVkTGFuZG1hcmsoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9zZUxhbmRtYXJrc1tQT1NFX0xBTkRNQVJLUy5MRUZUX0hJUF0ucG9zXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkKHRoaXMucG9zZUxhbmRtYXJrc1tQT1NFX0xBTkRNQVJLUy5SSUdIVF9ISVBdLnBvcylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zY2FsZUluUGxhY2UoMC41KVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgbWlkSGlwUG9zLnogPSAwOyAvLyBObyBkZXB0aCBpbmZvXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLm1pZEhpcEluaXRPZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5taWRIaXBJbml0T2Zmc2V0ID0gbWlkSGlwUG9zO1xuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZnJlZXplKHRoaXMubWlkSGlwSW5pdE9mZnNldCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMubWlkSGlwT2Zmc2V0LnVwZGF0ZVBvc2l0aW9uKFxuICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMyhcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pZEhpcFBvcy54IC0gdGhpcy5taWRIaXBJbml0T2Zmc2V0LngsXG4gICAgICAgICAgICAgICAgICAgICAgICBtaWRIaXBQb3MueSAtIHRoaXMubWlkSGlwSW5pdE9mZnNldC55LFxuICAgICAgICAgICAgICAgICAgICAgICAgbWlkSGlwUG9zLnogLSB0aGlzLm1pZEhpcEluaXRPZmZzZXQuelxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBkZWx0YV94IGluc3RlYWQgb2YgeFxuICAgICAgICAgICAgICAgIHRoaXMubWlkSGlwUG9zID0gdmVjdG9yVG9Ob3JtYWxpemVkTGFuZG1hcmsoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWlkSGlwT2Zmc2V0LnBvc1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpbnB1dEZhY2VMYW5kbWFya3MgPSB0aGlzLmNsb25lYWJsZUlucHV0UmVzdWx0cz8uZmFjZUxhbmRtYXJrczsgLy8gU2VlbXMgdG8gYmUgdGhlIG5ldyBwb3NlX3dvcmxkX2xhbmRtYXJrXG4gICAgICAgIGlmIChpbnB1dEZhY2VMYW5kbWFya3MpIHtcbiAgICAgICAgICAgIHRoaXMuaW5wdXRGYWNlTGFuZG1hcmtzID0gdGhpcy5wcmVQcm9jZXNzTGFuZG1hcmtzKFxuICAgICAgICAgICAgICAgIGlucHV0RmFjZUxhbmRtYXJrcyxcbiAgICAgICAgICAgICAgICB0aGlzLmZhY2VMYW5kbWFya3NcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUT0RPOiB1cGRhdGUgd3Jpc3Qgb2Zmc2V0IG9ubHkgd2hlbiBkZWJ1Z2dpbmdcbiAgICAgICAgY29uc3QgaW5wdXRMZWZ0SGFuZExhbmRtYXJrcyA9XG4gICAgICAgICAgICB0aGlzLmNsb25lYWJsZUlucHV0UmVzdWx0cz8ubGVmdEhhbmRMYW5kbWFya3M7XG4gICAgICAgIGNvbnN0IGlucHV0UmlnaHRIYW5kTGFuZG1hcmtzID1cbiAgICAgICAgICAgIHRoaXMuY2xvbmVhYmxlSW5wdXRSZXN1bHRzPy5yaWdodEhhbmRMYW5kbWFya3M7XG4gICAgICAgIGlmIChpbnB1dExlZnRIYW5kTGFuZG1hcmtzKSB7XG4gICAgICAgICAgICB0aGlzLmxlZnRXcmlzdE9mZnNldC51cGRhdGVQb3NpdGlvbihcbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkUG9zZUxhbmRtYXJrc1tQT1NFX0xBTkRNQVJLUy5MRUZUX1dSSVNUXS5wb3Muc3VidHJhY3QoXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRMYW5kbWFya1RvVmVjdG9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRMZWZ0SGFuZExhbmRtYXJrc1tIQU5EX0xBTkRNQVJLUy5XUklTVF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBQb3Nlcy5IQU5EX1BPU0lUSU9OX1NDQUxJTkcsXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnVlXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5pbnB1dExlZnRIYW5kTGFuZG1hcmtzID0gdGhpcy5wcmVQcm9jZXNzTGFuZG1hcmtzKFxuICAgICAgICAgICAgICAgIGlucHV0TGVmdEhhbmRMYW5kbWFya3MsXG4gICAgICAgICAgICAgICAgdGhpcy5sZWZ0SGFuZExhbmRtYXJrcyxcbiAgICAgICAgICAgICAgICB0aGlzLmxlZnRXcmlzdE9mZnNldC5wb3MsXG4gICAgICAgICAgICAgICAgUG9zZXMuSEFORF9QT1NJVElPTl9TQ0FMSU5HXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnB1dFJpZ2h0SGFuZExhbmRtYXJrcykge1xuICAgICAgICAgICAgdGhpcy5yaWdodFdyaXN0T2Zmc2V0LnVwZGF0ZVBvc2l0aW9uKFxuICAgICAgICAgICAgICAgIHRoaXMud29ybGRQb3NlTGFuZG1hcmtzW1xuICAgICAgICAgICAgICAgICAgICBQT1NFX0xBTkRNQVJLUy5SSUdIVF9XUklTVFxuICAgICAgICAgICAgICAgIF0ucG9zLnN1YnRyYWN0KFxuICAgICAgICAgICAgICAgICAgICBub3JtYWxpemVkTGFuZG1hcmtUb1ZlY3RvcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0UmlnaHRIYW5kTGFuZG1hcmtzW0hBTkRfTEFORE1BUktTLldSSVNUXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFBvc2VzLkhBTkRfUE9TSVRJT05fU0NBTElORyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRydWVcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLmlucHV0UmlnaHRIYW5kTGFuZG1hcmtzID0gdGhpcy5wcmVQcm9jZXNzTGFuZG1hcmtzKFxuICAgICAgICAgICAgICAgIGlucHV0UmlnaHRIYW5kTGFuZG1hcmtzLFxuICAgICAgICAgICAgICAgIHRoaXMucmlnaHRIYW5kTGFuZG1hcmtzLFxuICAgICAgICAgICAgICAgIHRoaXMucmlnaHRXcmlzdE9mZnNldC5wb3MsXG4gICAgICAgICAgICAgICAgUG9zZXMuSEFORF9QT1NJVElPTl9TQ0FMSU5HXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwcmVQcm9jZXNzTGFuZG1hcmtzKFxuICAgICAgICByZXN1bHRzTGFuZG1hcmtzOiBOb3JtYWxpemVkTGFuZG1hcmtbXSxcbiAgICAgICAgZmlsdGVyZWRMYW5kbWFya3M6IEZpbHRlcmVkTGFuZG1hcmtWZWN0b3JMaXN0LFxuICAgICAgICBvZmZzZXQgPSBWZWN0b3IzLlplcm8oKSxcbiAgICAgICAgc2NhbGluZyA9IDFcbiAgICApIHtcbiAgICAgICAgLy8gUmV2ZXJzZSBZLWF4aXMuIElucHV0IHJlc3VsdHMgdXNlIGNhbnZhcyBjb29yZGluYXRlIHN5c3RlbS5cbiAgICAgICAgcmVzdWx0c0xhbmRtYXJrcy5tYXAoKHYpID0+IHtcbiAgICAgICAgICAgIHYueCA9IHYueCAqIHNjYWxpbmcgKyBvZmZzZXQueDtcbiAgICAgICAgICAgIHYueSA9IC12LnkgKiBzY2FsaW5nICsgb2Zmc2V0Lnk7XG4gICAgICAgICAgICB2LnogPSB2LnogKiBzY2FsaW5nICsgb2Zmc2V0Lno7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBOb2lzZSBmaWx0ZXJpbmdcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXN1bHRzTGFuZG1hcmtzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBmaWx0ZXJlZExhbmRtYXJrc1tpXS51cGRhdGVQb3NpdGlvbihcbiAgICAgICAgICAgICAgICBub3JtYWxpemVkTGFuZG1hcmtUb1ZlY3RvcihyZXN1bHRzTGFuZG1hcmtzW2ldKSxcbiAgICAgICAgICAgICAgICByZXN1bHRzTGFuZG1hcmtzW2ldLnZpc2liaWxpdHlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHNMYW5kbWFya3M7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0b0Nsb25lYWJsZUxhbmRtYXJrcyhcbiAgICAgICAgbGFuZG1hcmtzOiBGaWx0ZXJlZExhbmRtYXJrVmVjdG9yTGlzdCxcbiAgICAgICAgY2xvbmVhYmxlTGFuZG1hcmtzOiBOb3JtYWxpemVkTGFuZG1hcmtMaXN0XG4gICAgKSB7XG4gICAgICAgIGNsb25lYWJsZUxhbmRtYXJrcy5mb3JFYWNoKCh2LCBpZHgpID0+IHtcbiAgICAgICAgICAgIHYueCA9IGxhbmRtYXJrc1tpZHhdLnBvcy54O1xuICAgICAgICAgICAgdi55ID0gbGFuZG1hcmtzW2lkeF0ucG9zLnk7XG4gICAgICAgICAgICB2LnogPSBsYW5kbWFya3NbaWR4XS5wb3MuejtcbiAgICAgICAgICAgIHYudmlzaWJpbGl0eSA9IGxhbmRtYXJrc1tpZHhdLnZpc2liaWxpdHk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZmlsdGVyRmFjZUxhbmRtYXJrcygpIHtcbiAgICAgICAgLy8gVW5wYWNrIGZhY2UgbWVzaCBsYW5kbWFya3NcbiAgICAgICAgdGhpcy5fZmFjZU1lc2hMYW5kbWFya0luZGV4TGlzdC5sZW5ndGggPSAwO1xuICAgICAgICB0aGlzLl9mYWNlTWVzaExhbmRtYXJrTGlzdC5sZW5ndGggPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IFBvc2VzLkZBQ0VfTUVTSF9DT05ORUNUSU9OUy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgY29uc3QgYXJyID0gW107XG4gICAgICAgICAgICBjb25zdCBpZHggPSBuZXcgU2V0PG51bWJlcj4oKTtcbiAgICAgICAgICAgIFBvc2VzLkZBQ0VfTUVTSF9DT05ORUNUSU9OU1tpXS5mb3JFYWNoKCh2KSA9PiB7XG4gICAgICAgICAgICAgICAgaWR4LmFkZCh2WzBdKTtcbiAgICAgICAgICAgICAgICBpZHguYWRkKHZbMV0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBpZHhBcnIgPSBBcnJheS5mcm9tKGlkeCk7XG4gICAgICAgICAgICB0aGlzLl9mYWNlTWVzaExhbmRtYXJrSW5kZXhMaXN0LnB1c2goaWR4QXJyKTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgaWR4QXJyLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgYXJyLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICB4OiB0aGlzLmZhY2VMYW5kbWFya3NbaWR4QXJyW2pdXS5wb3MueCxcbiAgICAgICAgICAgICAgICAgICAgeTogdGhpcy5mYWNlTGFuZG1hcmtzW2lkeEFycltqXV0ucG9zLnksXG4gICAgICAgICAgICAgICAgICAgIHo6IHRoaXMuZmFjZUxhbmRtYXJrc1tpZHhBcnJbal1dLnBvcy54LFxuICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiB0aGlzLmZhY2VMYW5kbWFya3NbaWR4QXJyW2pdXS52aXNpYmlsaXR5LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fZmFjZU1lc2hMYW5kbWFya0xpc3QucHVzaChhcnIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsUkxpbmtXZWlnaHRzKCkge1xuICAgICAgICBjb25zdCBmYWNlQ2FtZXJhQW5nbGUgPSBkZWdyZWVCZXR3ZWVuVmVjdG9ycyhcbiAgICAgICAgICAgIG5vcm1hbGl6ZWRMYW5kbWFya1RvVmVjdG9yKHRoaXMuZmFjZU5vcm1hbCksXG4gICAgICAgICAgICBuZXcgVmVjdG9yMygwLCAwLCAtMSksXG4gICAgICAgICAgICB0cnVlXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IHdlaWdodExlZnQgPSByZW1hcFJhbmdlV2l0aENhcChcbiAgICAgICAgICAgIGZhY2VDYW1lcmFBbmdsZS55LFxuICAgICAgICAgICAgUG9zZXMuTFJfRkFDRV9ESVJFQ1RJT05fUkFOR0UsXG4gICAgICAgICAgICAtUG9zZXMuTFJfRkFDRV9ESVJFQ1RJT05fUkFOR0UsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMVxuICAgICAgICApO1xuICAgICAgICBjb25zdCB3ZWlnaHRSaWdodCA9IHJlbWFwUmFuZ2VXaXRoQ2FwKFxuICAgICAgICAgICAgZmFjZUNhbWVyYUFuZ2xlLnksXG4gICAgICAgICAgICAtUG9zZXMuTFJfRkFDRV9ESVJFQ1RJT05fUkFOR0UsXG4gICAgICAgICAgICBQb3Nlcy5MUl9GQUNFX0RJUkVDVElPTl9SQU5HRSxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAxXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiB7IHdlaWdodExlZnQsIHdlaWdodFJpZ2h0IH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsUkxpbmsobDogbnVtYmVyLCByOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgeyB3ZWlnaHRMZWZ0LCB3ZWlnaHRSaWdodCB9ID0gdGhpcy5sUkxpbmtXZWlnaHRzKCk7XG4gICAgICAgIHJldHVybiB3ZWlnaHRMZWZ0ICogbCArIHdlaWdodFJpZ2h0ICogcjtcbiAgICB9XG5cbiAgICBwcml2YXRlIGxSTGlua1ZlY3RvcihsOiBWZWN0b3IzLCByOiBWZWN0b3IzKSB7XG4gICAgICAgIGNvbnN0IHsgd2VpZ2h0TGVmdCwgd2VpZ2h0UmlnaHQgfSA9IHRoaXMubFJMaW5rV2VpZ2h0cygpO1xuICAgICAgICByZXR1cm4gbC5zY2FsZSh3ZWlnaHRMZWZ0KS5hZGRJblBsYWNlKHIuc2NhbGUod2VpZ2h0UmlnaHQpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGxSTGlua1F1YXRlcm5pb24obDogUXVhdGVybmlvbiwgcjogUXVhdGVybmlvbikge1xuICAgICAgICBjb25zdCB7IHdlaWdodExlZnQsIHdlaWdodFJpZ2h0IH0gPSB0aGlzLmxSTGlua1dlaWdodHMoKTtcbiAgICAgICAgcmV0dXJuIGwuc2NhbGUod2VpZ2h0TGVmdCkuYWRkSW5QbGFjZShyLnNjYWxlKHdlaWdodFJpZ2h0KSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbml0SGFuZEJvbmVSb3RhdGlvbnMoaXNMZWZ0OiBib29sZWFuKSB7XG4gICAgICAgIC8vIFRPRE86IGFkanVzdCBiYXNlc1xuICAgICAgICAvLyBXcmlzdCdzIGJhc2lzIGlzIHVzZWQgZm9yIGNhbGN1bGF0aW5nIHF1YXRlcm5pb24gYmV0d2VlbiB0d28gQ2FydGVzaWFuIGNvb3JkaW5hdGUgc3lzdGVtcyBkaXJlY3RseVxuICAgICAgICAvLyBBbGwgb3RoZXJzJyBhcmUgdXNlZCBmb3Igcm90YXRpbmcgcGxhbmVzIG9mIGEgU3BoZXJpY2FsIGNvb3JkaW5hdGUgc3lzdGVtIGF0IHRoZSBub2RlXG4gICAgICAgIHRoaXMuX2luaXRCb25lUm90YXRpb25zW1xuICAgICAgICAgICAgaGFuZExhbmRNYXJrVG9Cb25lTmFtZShIQU5EX0xBTkRNQVJLUy5XUklTVCwgaXNMZWZ0KVxuICAgICAgICBdID0gbmV3IENsb25lYWJsZVF1YXRlcm5pb24oXG4gICAgICAgICAgICBRdWF0ZXJuaW9uLklkZW50aXR5KCksXG4gICAgICAgICAgICBpc0xlZnRcbiAgICAgICAgICAgICAgICA/IGdldEJhc2lzKFtcbiAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMygwLCAwLCAwKSxcbiAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMyhpc0xlZnQgPyAxIDogLTEsIDAsIDApLFxuICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IzKGlzTGVmdCA/IDEgOiAtMSwgMCwgMSksXG4gICAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICAgIDogbmV3IEJhc2lzKFtcbiAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLTAuOTMyNzE1OTA3OTU2ODA0MSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgMC4xMjI4MjUyMjYxNTY1NDM4MyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLTAuMzM5MDUwMTQyMTA4NjY4NVxuICAgICAgICAgICAgICAgICAgICAgICkubm9ybWFsaXplKCksXG4gICAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC0wLjAxMDAwMjIxMjY3NzA3NzE4MixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgMC4wMDI0NzI3NjQzNDUzODIyOTQ1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAwLjAyODQxMTU1MTkyNzc0NzMyN1xuICAgICAgICAgICAgICAgICAgICAgICkubm9ybWFsaXplKCksXG4gICAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDAuMTQzMjA4MDE0MTExMTI4NTcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDAuOTg5MDQ5NzkyNjk0OTA0OCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLTAuMDM1NjY0NzIwMTY1OTA5ODRcbiAgICAgICAgICAgICAgICAgICAgICApLm5vcm1hbGl6ZSgpLFxuICAgICAgICAgICAgICAgICAgXSlcbiAgICAgICAgKTtcbiAgICAgICAgLy8gVGh1bWJcbiAgICAgICAgLy8gVEhVTUJfQ01DXG4gICAgICAgIC8vIFRIVU1CX01DUFxuICAgICAgICAvLyBUSFVNQl9JUFxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IDQ7ICsraSkge1xuICAgICAgICAgICAgY29uc3QgdE1DUF9YID0gbmV3IFZlY3RvcjMoaXNMZWZ0ID8gMSA6IC0xLCAwLCAtMS41KS5ub3JtYWxpemUoKTtcbiAgICAgICAgICAgIGNvbnN0IHRNQ1BfWSA9IG5ldyBWZWN0b3IzKDAsIGlzTGVmdCA/IC0xIDogMSwgMCk7XG4gICAgICAgICAgICBjb25zdCB0TUNQX1ogPSBWZWN0b3IzLkNyb3NzKHRNQ1BfWCwgdE1DUF9ZKS5ub3JtYWxpemUoKTtcbiAgICAgICAgICAgIGNvbnN0IGJhc2lzID0gbmV3IEJhc2lzKFtcbiAgICAgICAgICAgICAgICB0TUNQX1gsXG4gICAgICAgICAgICAgICAgLy8gbmV3IFZlY3RvcjMoMCwgMCwgaXNMZWZ0ID8gLTEgOiAxKSxcbiAgICAgICAgICAgICAgICB0TUNQX1ksXG4gICAgICAgICAgICAgICAgdE1DUF9aLFxuICAgICAgICAgICAgXSkucm90YXRlQnlRdWF0ZXJuaW9uKFxuICAgICAgICAgICAgICAgIFF1YXRlcm5pb24uRnJvbUV1bGVyQW5nbGVzKDAsIDAsIGlzTGVmdCA/IDAuMiA6IC0wLjIpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5faW5pdEJvbmVSb3RhdGlvbnNbaGFuZExhbmRNYXJrVG9Cb25lTmFtZShpLCBpc0xlZnQpXSA9XG4gICAgICAgICAgICAgICAgbmV3IENsb25lYWJsZVF1YXRlcm5pb24oUXVhdGVybmlvbi5JZGVudGl0eSgpLCBiYXNpcyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSW5kZXhcbiAgICAgICAgZm9yIChsZXQgaSA9IDU7IGkgPCA4OyArK2kpIHtcbiAgICAgICAgICAgIHRoaXMuX2luaXRCb25lUm90YXRpb25zW2hhbmRMYW5kTWFya1RvQm9uZU5hbWUoaSwgaXNMZWZ0KV0gPVxuICAgICAgICAgICAgICAgIG5ldyBDbG9uZWFibGVRdWF0ZXJuaW9uKFxuICAgICAgICAgICAgICAgICAgICBRdWF0ZXJuaW9uLklkZW50aXR5KCksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBCYXNpcyhbXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMyhpc0xlZnQgPyAxIDogLTEsIDAsIDApLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoMCwgMCwgaXNMZWZ0ID8gLTEgOiAxKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IzKDAsIDEsIDApLFxuICAgICAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTWlkZGxlXG4gICAgICAgIGZvciAobGV0IGkgPSA5OyBpIDwgMTI7ICsraSkge1xuICAgICAgICAgICAgdGhpcy5faW5pdEJvbmVSb3RhdGlvbnNbaGFuZExhbmRNYXJrVG9Cb25lTmFtZShpLCBpc0xlZnQpXSA9XG4gICAgICAgICAgICAgICAgbmV3IENsb25lYWJsZVF1YXRlcm5pb24oXG4gICAgICAgICAgICAgICAgICAgIFF1YXRlcm5pb24uSWRlbnRpdHkoKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IEJhc2lzKFtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IzKGlzTGVmdCA/IDEgOiAtMSwgMCwgMCksXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMygwLCAwLCBpc0xlZnQgPyAtMSA6IDEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoMCwgMSwgMCksXG4gICAgICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBSaW5nXG4gICAgICAgIGZvciAobGV0IGkgPSAxMzsgaSA8IDE2OyArK2kpIHtcbiAgICAgICAgICAgIHRoaXMuX2luaXRCb25lUm90YXRpb25zW2hhbmRMYW5kTWFya1RvQm9uZU5hbWUoaSwgaXNMZWZ0KV0gPVxuICAgICAgICAgICAgICAgIG5ldyBDbG9uZWFibGVRdWF0ZXJuaW9uKFxuICAgICAgICAgICAgICAgICAgICBRdWF0ZXJuaW9uLklkZW50aXR5KCksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBCYXNpcyhbXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMyhpc0xlZnQgPyAxIDogLTEsIDAsIDApLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoMCwgMCwgaXNMZWZ0ID8gLTEgOiAxKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IzKDAsIDEsIDApLFxuICAgICAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUGlua3lcbiAgICAgICAgZm9yIChsZXQgaSA9IDE3OyBpIDwgMjA7ICsraSkge1xuICAgICAgICAgICAgdGhpcy5faW5pdEJvbmVSb3RhdGlvbnNbaGFuZExhbmRNYXJrVG9Cb25lTmFtZShpLCBpc0xlZnQpXSA9XG4gICAgICAgICAgICAgICAgbmV3IENsb25lYWJsZVF1YXRlcm5pb24oXG4gICAgICAgICAgICAgICAgICAgIFF1YXRlcm5pb24uSWRlbnRpdHkoKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IEJhc2lzKFtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IzKGlzTGVmdCA/IDEgOiAtMSwgMCwgMCksXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMygwLCAwLCBpc0xlZnQgPyAtMSA6IDEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoMCwgMSwgMCksXG4gICAgICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaW5pdEJvbmVSb3RhdGlvbnMoKSB7XG4gICAgICAgIC8vIEhhbmQgYm9uZXNcbiAgICAgICAgdGhpcy5pbml0SGFuZEJvbmVSb3RhdGlvbnModHJ1ZSk7XG4gICAgICAgIHRoaXMuaW5pdEhhbmRCb25lUm90YXRpb25zKGZhbHNlKTtcblxuICAgICAgICAvLyBQb3NlIGJvbmVzXG4gICAgICAgIHRoaXMuX2luaXRCb25lUm90YXRpb25zW1wiaGVhZFwiXSA9IG5ldyBDbG9uZWFibGVRdWF0ZXJuaW9uKFxuICAgICAgICAgICAgUXVhdGVybmlvbi5JZGVudGl0eSgpLFxuICAgICAgICAgICAgbmV3IEJhc2lzKG51bGwpXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuX2luaXRCb25lUm90YXRpb25zW1wibmVja1wiXSA9IG5ldyBDbG9uZWFibGVRdWF0ZXJuaW9uKFxuICAgICAgICAgICAgUXVhdGVybmlvbi5JZGVudGl0eSgpLFxuICAgICAgICAgICAgbmV3IEJhc2lzKG51bGwpXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuX2luaXRCb25lUm90YXRpb25zW1wiaGlwc1wiXSA9IG5ldyBDbG9uZWFibGVRdWF0ZXJuaW9uKFxuICAgICAgICAgICAgUXVhdGVybmlvbi5JZGVudGl0eSgpLFxuICAgICAgICAgICAgbmV3IEJhc2lzKFtcbiAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMygwLCAwLCAtMSksXG4gICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoLTEsIDAsIDApLFxuICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IzKDAsIDEsIDApLFxuICAgICAgICAgICAgXSlcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5faW5pdEJvbmVSb3RhdGlvbnNbXCJzcGluZVwiXSA9IG5ldyBDbG9uZWFibGVRdWF0ZXJuaW9uKFxuICAgICAgICAgICAgUXVhdGVybmlvbi5JZGVudGl0eSgpLFxuICAgICAgICAgICAgbmV3IEJhc2lzKFtcbiAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMygwLCAwLCAtMSksXG4gICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoLTEsIDAsIDApLFxuICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IzKDAsIDEsIDApLFxuICAgICAgICAgICAgXSlcbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCBsciA9IFtcImxlZnRcIiwgXCJyaWdodFwiXTtcbiAgICAgICAgLy8gQXJtc1xuICAgICAgICBmb3IgKGNvbnN0IGsgb2YgbHIpIHtcbiAgICAgICAgICAgIGNvbnN0IGlzTGVmdCA9IGsgPT09IFwibGVmdFwiO1xuICAgICAgICAgICAgdGhpcy5faW5pdEJvbmVSb3RhdGlvbnNbYCR7a31VcHBlckFybWBdID0gbmV3IENsb25lYWJsZVF1YXRlcm5pb24oXG4gICAgICAgICAgICAgICAgUXVhdGVybmlvbi5Gcm9tRXVsZXJBbmdsZXMoMCwgMCwgaXNMZWZ0ID8gMS4wNDcyIDogLTEuMDQ3MiksXG4gICAgICAgICAgICAgICAgbmV3IEJhc2lzKFtcbiAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoaXNMZWZ0ID8gMSA6IC0xLCAwLCAwKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoMCwgMCwgaXNMZWZ0ID8gLTEgOiAxKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoMCwgMSwgMCksXG4gICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLl9pbml0Qm9uZVJvdGF0aW9uc1tgJHtrfUxvd2VyQXJtYF0gPSBuZXcgQ2xvbmVhYmxlUXVhdGVybmlvbihcbiAgICAgICAgICAgICAgICBRdWF0ZXJuaW9uLklkZW50aXR5KCksXG4gICAgICAgICAgICAgICAgbmV3IEJhc2lzKFtcbiAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoaXNMZWZ0ID8gMSA6IC0xLCAwLCAwKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoMCwgMCwgaXNMZWZ0ID8gLTEgOiAxKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoMCwgMSwgMCksXG4gICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTGVnc1xuICAgICAgICBmb3IgKGNvbnN0IGsgb2YgbHIpIHtcbiAgICAgICAgICAgIGNvbnN0IGlzTGVmdCA9IGsgPT09IFwibGVmdFwiO1xuICAgICAgICAgICAgdGhpcy5faW5pdEJvbmVSb3RhdGlvbnNbYCR7a31VcHBlckxlZ2BdID0gbmV3IENsb25lYWJsZVF1YXRlcm5pb24oXG4gICAgICAgICAgICAgICAgUXVhdGVybmlvbi5JZGVudGl0eSgpLFxuICAgICAgICAgICAgICAgIG5ldyBCYXNpcyhbXG4gICAgICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IzKDAsIC0xLCAwKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoLTEsIDAsIDApLFxuICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMygwLCAwLCAtMSksXG4gICAgICAgICAgICAgICAgXSkucm90YXRlQnlRdWF0ZXJuaW9uKFxuICAgICAgICAgICAgICAgICAgICBRdWF0ZXJuaW9uLkZyb21FdWxlckFuZ2xlcyhcbiAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNMZWZ0ID8gLTAuMDUyMzYgOiAwLjA1MjM2XG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5faW5pdEJvbmVSb3RhdGlvbnNbYCR7a31Mb3dlckxlZ2BdID0gbmV3IENsb25lYWJsZVF1YXRlcm5pb24oXG4gICAgICAgICAgICAgICAgUXVhdGVybmlvbi5JZGVudGl0eSgpLFxuICAgICAgICAgICAgICAgIG5ldyBCYXNpcyhbXG4gICAgICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IzKDAsIC0xLCAwKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoLTEsIDAsIDApLFxuICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMygwLCAwLCAtMSksXG4gICAgICAgICAgICAgICAgXSkucm90YXRlQnlRdWF0ZXJuaW9uKFxuICAgICAgICAgICAgICAgICAgICBRdWF0ZXJuaW9uLkZyb21FdWxlckFuZ2xlcygwLCAwLCBpc0xlZnQgPyAtMC4wODczIDogMC4wODczKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRmVldFxuICAgICAgICBmb3IgKGNvbnN0IGsgb2YgbHIpIHtcbiAgICAgICAgICAgIGNvbnN0IGlzTGVmdCA9IGsgPT09IFwibGVmdFwiO1xuICAgICAgICAgICAgY29uc3Qgc3RhcnRCYXNpcyA9IG5ldyBCYXNpcyhbXG4gICAgICAgICAgICAgICAgbmV3IFZlY3RvcjMoMCwgLTEsIDApLFxuICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IzKC0xLCAwLCAwKSxcbiAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMygwLCAwLCAtMSksXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIC8vIGNvbnN0IHJYID0gUXVhdGVybmlvbi5Sb3RhdGlvbkF4aXMoc3RhcnRCYXNpcy54LmNsb25lKCksIGlzTGVmdCA/IDAuMjYxOCA6IC0wLjI2MTgpO1xuICAgICAgICAgICAgLy8gY29uc3QgejEgPSBWZWN0b3IzLlplcm8oKTtcbiAgICAgICAgICAgIC8vIHN0YXJ0QmFzaXMuei5yb3RhdGVCeVF1YXRlcm5pb25Ub1JlZihyWCwgejEpO1xuICAgICAgICAgICAgLy8gY29uc3QgclogPSBRdWF0ZXJuaW9uLlJvdGF0aW9uQXhpcyh6MSwgaXNMZWZ0ID8gMC4wODczIDogLTAuMDg3Myk7XG4gICAgICAgICAgICAvLyBjb25zdCB0aGlzRm9vdEJhc2lzUm90YXRpb24gPSBpc0xlZnQgPyB0aGlzLmxlZnRGb290QmFzaXNSb3RhdGlvbiA6IHRoaXMucmlnaHRGb290QmFzaXNSb3RhdGlvbjtcbiAgICAgICAgICAgIC8vIHRoaXNGb290QmFzaXNSb3RhdGlvbi5jb3B5RnJvbShyWC5tdWx0aXBseShyWikpO1xuXG4gICAgICAgICAgICB0aGlzLl9pbml0Qm9uZVJvdGF0aW9uc1tgJHtrfUZvb3RgXSA9IG5ldyBDbG9uZWFibGVRdWF0ZXJuaW9uKFxuICAgICAgICAgICAgICAgIFF1YXRlcm5pb24uSWRlbnRpdHkoKSxcbiAgICAgICAgICAgICAgICBzdGFydEJhc2lzXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRXhwcmVzc2lvbnNcbiAgICAgICAgdGhpcy5faW5pdEJvbmVSb3RhdGlvbnNbXCJtb3V0aFwiXSA9IG5ldyBDbG9uZWFibGVRdWF0ZXJuaW9uKFxuICAgICAgICAgICAgUXVhdGVybmlvbi5JZGVudGl0eSgpLFxuICAgICAgICAgICAgbmV3IEJhc2lzKG51bGwpXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuX2luaXRCb25lUm90YXRpb25zW1wiYmxpbmtcIl0gPSBuZXcgQ2xvbmVhYmxlUXVhdGVybmlvbihcbiAgICAgICAgICAgIFF1YXRlcm5pb24uSWRlbnRpdHkoKSxcbiAgICAgICAgICAgIG5ldyBCYXNpcyhudWxsKVxuICAgICAgICApO1xuICAgICAgICB0aGlzLl9pbml0Qm9uZVJvdGF0aW9uc1tcImxlZnRJcmlzXCJdID0gbmV3IENsb25lYWJsZVF1YXRlcm5pb24oXG4gICAgICAgICAgICBRdWF0ZXJuaW9uLklkZW50aXR5KCksXG4gICAgICAgICAgICBuZXcgQmFzaXMobnVsbClcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5faW5pdEJvbmVSb3RhdGlvbnNbXCJyaWdodElyaXNcIl0gPSBuZXcgQ2xvbmVhYmxlUXVhdGVybmlvbihcbiAgICAgICAgICAgIFF1YXRlcm5pb24uSWRlbnRpdHkoKSxcbiAgICAgICAgICAgIG5ldyBCYXNpcyhudWxsKVxuICAgICAgICApO1xuICAgICAgICB0aGlzLl9pbml0Qm9uZVJvdGF0aW9uc1tcImlyaXNcIl0gPSBuZXcgQ2xvbmVhYmxlUXVhdGVybmlvbihcbiAgICAgICAgICAgIFF1YXRlcm5pb24uSWRlbnRpdHkoKSxcbiAgICAgICAgICAgIG5ldyBCYXNpcyhudWxsKVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIEZyZWV6ZSBpbml0IG9iamVjdFxuICAgICAgICBPYmplY3QuZnJlZXplKHRoaXMuX2luaXRCb25lUm90YXRpb25zKTtcblxuICAgICAgICAvLyBEZWVwIGNvcHkgdG8gYWN0dWFsIG1hcFxuICAgICAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyh0aGlzLl9pbml0Qm9uZVJvdGF0aW9ucykpIHtcbiAgICAgICAgICAgIHRoaXMuX2JvbmVSb3RhdGlvbnNba10gPSBuZXcgQ2xvbmVhYmxlUXVhdGVybmlvbihcbiAgICAgICAgICAgICAgICBjbG9uZWFibGVRdWF0ZXJuaW9uVG9RdWF0ZXJuaW9uKHYpLFxuICAgICAgICAgICAgICAgIHYuYmFzZUJhc2lzXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgbm9ybWFsRnJvbVZlcnRpY2VzKFxuICAgICAgICB2ZXJ0aWNlczogRmlsdGVyZWRMYW5kbWFya1ZlY3RvcjMsXG4gICAgICAgIHJldmVyc2U6IGJvb2xlYW5cbiAgICApOiBWZWN0b3IzIHtcbiAgICAgICAgaWYgKHJldmVyc2UpIHZlcnRpY2VzLnJldmVyc2UoKTtcbiAgICAgICAgY29uc3QgdmVjID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjsgKytpKSB7XG4gICAgICAgICAgICB2ZWMucHVzaCh2ZXJ0aWNlc1tpICsgMV0ucG9zLnN1YnRyYWN0KHZlcnRpY2VzW2ldLnBvcykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2ZWNbMF0uY3Jvc3ModmVjWzFdKS5ub3JtYWxpemUoKTtcbiAgICB9XG5cbiAgICAvLyBSZWN1cnNpdmVseSBhcHBseSBwcmV2aW91cyBxdWF0ZXJuaW9ucyB0byBjdXJyZW50IGJhc2lzXG4gICAgcHJpdmF0ZSBhcHBseVF1YXRlcm5pb25DaGFpbihcbiAgICAgICAgc3RhcnRMYW5kbWFyazogbnVtYmVyIHwgc3RyaW5nLFxuICAgICAgICBpc0xlZnQ6IGJvb2xlYW5cbiAgICApOiBRdWF0ZXJuaW9uIHtcbiAgICAgICAgY29uc3QgcSA9IFF1YXRlcm5pb24uSWRlbnRpdHkoKTtcbiAgICAgICAgY29uc3Qgcm90YXRpb25zOiBRdWF0ZXJuaW9uW10gPSBbXTtcbiAgICAgICAgbGV0IFtzdGFydE5vZGUsIHBhcmVudE1hcF06IFtcbiAgICAgICAgICAgIFRyYW5zZm9ybU5vZGVUcmVlTm9kZSxcbiAgICAgICAgICAgIE1hcDxUcmFuc2Zvcm1Ob2RlVHJlZU5vZGUsIFRyYW5zZm9ybU5vZGVUcmVlTm9kZT5cbiAgICAgICAgXSA9IGRlcHRoRmlyc3RTZWFyY2goXG4gICAgICAgICAgICB0aGlzLmJvbmVzSGllcmFyY2h5VHJlZSxcbiAgICAgICAgICAgIChuOiBUcmFuc2Zvcm1Ob2RlVHJlZU5vZGUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXROYW1lID0gTnVtYmVyLmlzRmluaXRlKHN0YXJ0TGFuZG1hcmspXG4gICAgICAgICAgICAgICAgICAgID8gaGFuZExhbmRNYXJrVG9Cb25lTmFtZShzdGFydExhbmRtYXJrIGFzIG51bWJlciwgaXNMZWZ0KVxuICAgICAgICAgICAgICAgICAgICA6IHN0YXJ0TGFuZG1hcms7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG4ubmFtZSA9PT0gdGFyZ2V0TmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgd2hpbGUgKHBhcmVudE1hcC5oYXMoc3RhcnROb2RlKSkge1xuICAgICAgICAgICAgc3RhcnROb2RlID0gcGFyZW50TWFwLmdldChzdGFydE5vZGUpITtcbiAgICAgICAgICAgIGNvbnN0IGJvbmVRdWF0ZXJuaW9uID0gdGhpcy5fYm9uZVJvdGF0aW9uc1tzdGFydE5vZGUubmFtZV07XG4gICAgICAgICAgICByb3RhdGlvbnMucHVzaChcbiAgICAgICAgICAgICAgICByZXZlcnNlUm90YXRpb24oXG4gICAgICAgICAgICAgICAgICAgIGNsb25lYWJsZVF1YXRlcm5pb25Ub1F1YXRlcm5pb24oYm9uZVF1YXRlcm5pb24pLFxuICAgICAgICAgICAgICAgICAgICBBWElTLnl6XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBRdWF0ZXJuaW9ucyBuZWVkIHRvIGJlIGFwcGxpZWQgZnJvbSBwYXJlbnQgdG8gY2hpbGRyZW5cbiAgICAgICAgcm90YXRpb25zLnJldmVyc2UoKS5tYXAoKHRxOiBRdWF0ZXJuaW9uKSA9PiB7XG4gICAgICAgICAgICBxLm11bHRpcGx5SW5QbGFjZSh0cSk7XG4gICAgICAgIH0pO1xuICAgICAgICBxLm5vcm1hbGl6ZSgpO1xuXG4gICAgICAgIHJldHVybiBxO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2hhbGxVcGRhdGVBcm0oaXNMZWZ0OiBib29sZWFuKSB7XG4gICAgICAgIC8vIFVwZGF0ZSBvbmx5IHdoZW4gYWxsIGxlZyBsYW5kbWFya3MgYXJlIHZpc2libGVcbiAgICAgICAgY29uc3Qgc2hvdWxkZXJWaXNpbGliaXR5ID1cbiAgICAgICAgICAgIHRoaXMuY2xvbmVhYmxlSW5wdXRSZXN1bHRzPy5wb3NlTGFuZG1hcmtzW1xuICAgICAgICAgICAgICAgIGlzTGVmdFxuICAgICAgICAgICAgICAgICAgICA/IFBPU0VfTEFORE1BUktTLkxFRlRfU0hPVUxERVJcbiAgICAgICAgICAgICAgICAgICAgOiBQT1NFX0xBTkRNQVJLUy5SSUdIVF9TSE9VTERFUlxuICAgICAgICAgICAgXS52aXNpYmlsaXR5IHx8IDA7XG4gICAgICAgIGNvbnN0IHdyaXN0VmlzaWxpYml0eSA9XG4gICAgICAgICAgICB0aGlzLmNsb25lYWJsZUlucHV0UmVzdWx0cz8ucG9zZUxhbmRtYXJrc1tcbiAgICAgICAgICAgICAgICBpc0xlZnQgPyBQT1NFX0xBTkRNQVJLUy5MRUZUX1dSSVNUIDogUE9TRV9MQU5ETUFSS1MuUklHSFRfV1JJU1RcbiAgICAgICAgICAgIF0udmlzaWJpbGl0eSB8fCAwO1xuICAgICAgICByZXR1cm4gIShcbiAgICAgICAgICAgIHNob3VsZGVyVmlzaWxpYml0eSA8PSBWSVNJQklMSVRZX1RIUkVTSE9MRCB8fFxuICAgICAgICAgICAgd3Jpc3RWaXNpbGliaXR5IDw9IFZJU0lCSUxJVFlfVEhSRVNIT0xEXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzaGFsbFVwZGF0ZUxlZ3MoaXNMZWZ0OiBib29sZWFuKSB7XG4gICAgICAgIC8vIFVwZGF0ZSBvbmx5IHdoZW4gYWxsIGxlZyBsYW5kbWFya3MgYXJlIHZpc2libGVcbiAgICAgICAgY29uc3Qga25lZVZpc2lsaWJpdHkgPVxuICAgICAgICAgICAgdGhpcy5jbG9uZWFibGVJbnB1dFJlc3VsdHM/LnBvc2VMYW5kbWFya3NbXG4gICAgICAgICAgICAgICAgaXNMZWZ0XG4gICAgICAgICAgICAgICAgICAgID8gUE9TRV9MQU5ETUFSS1NfTEVGVC5MRUZUX0tORUVcbiAgICAgICAgICAgICAgICAgICAgOiBQT1NFX0xBTkRNQVJLU19SSUdIVC5SSUdIVF9LTkVFXG4gICAgICAgICAgICBdLnZpc2liaWxpdHkgfHwgMDtcbiAgICAgICAgY29uc3QgYW5rbGVWaXNpbGliaXR5ID1cbiAgICAgICAgICAgIHRoaXMuY2xvbmVhYmxlSW5wdXRSZXN1bHRzPy5wb3NlTGFuZG1hcmtzW1xuICAgICAgICAgICAgICAgIGlzTGVmdFxuICAgICAgICAgICAgICAgICAgICA/IFBPU0VfTEFORE1BUktTX0xFRlQuTEVGVF9BTktMRVxuICAgICAgICAgICAgICAgICAgICA6IFBPU0VfTEFORE1BUktTX1JJR0hULlJJR0hUX0FOS0xFXG4gICAgICAgICAgICBdLnZpc2liaWxpdHkgfHwgMDtcbiAgICAgICAgY29uc3QgZm9vdFZpc2lsaWJpdHkgPVxuICAgICAgICAgICAgdGhpcy5jbG9uZWFibGVJbnB1dFJlc3VsdHM/LnBvc2VMYW5kbWFya3NbXG4gICAgICAgICAgICAgICAgaXNMZWZ0XG4gICAgICAgICAgICAgICAgICAgID8gUE9TRV9MQU5ETUFSS1NfTEVGVC5MRUZUX0ZPT1RfSU5ERVhcbiAgICAgICAgICAgICAgICAgICAgOiBQT1NFX0xBTkRNQVJLU19SSUdIVC5SSUdIVF9GT09UX0lOREVYXG4gICAgICAgICAgICBdLnZpc2liaWxpdHkgfHwgMDtcbiAgICAgICAgY29uc3QgaGVlbFZpc2lsaWJpdHkgPVxuICAgICAgICAgICAgdGhpcy5jbG9uZWFibGVJbnB1dFJlc3VsdHM/LnBvc2VMYW5kbWFya3NbXG4gICAgICAgICAgICAgICAgaXNMZWZ0XG4gICAgICAgICAgICAgICAgICAgID8gUE9TRV9MQU5ETUFSS1NfTEVGVC5MRUZUX0hFRUxcbiAgICAgICAgICAgICAgICAgICAgOiBQT1NFX0xBTkRNQVJLU19SSUdIVC5SSUdIVF9IRUVMXG4gICAgICAgICAgICBdLnZpc2liaWxpdHkgfHwgMDtcbiAgICAgICAgcmV0dXJuICEoXG4gICAgICAgICAgICBrbmVlVmlzaWxpYml0eSA8PSBWSVNJQklMSVRZX1RIUkVTSE9MRCB8fFxuICAgICAgICAgICAgYW5rbGVWaXNpbGliaXR5IDw9IFZJU0lCSUxJVFlfVEhSRVNIT0xEIHx8XG4gICAgICAgICAgICBmb290VmlzaWxpYml0eSA8PSBWSVNJQklMSVRZX1RIUkVTSE9MRCB8fFxuICAgICAgICAgICAgaGVlbFZpc2lsaWJpdHkgPD0gVklTSUJJTElUWV9USFJFU0hPTERcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHB1c2hCb25lUm90YXRpb25CdWZmZXIoKSB7XG4gICAgICAgIGlmICghdGhpcy5fYm9uZVJvdGF0aW9uVXBkYXRlRm4pIHJldHVybjtcblxuICAgICAgICAvLyBDYWxsYmFja1xuICAgICAgICBjb25zdCBqc29uU3RyID0gSlNPTi5zdHJpbmdpZnkodGhpcy5fYm9uZVJvdGF0aW9ucyk7XG4gICAgICAgIGNvbnN0IGFycmF5QnVmZmVyID0gdGhpcy50ZXh0RW5jb2Rlci5lbmNvZGUoanNvblN0cik7XG4gICAgICAgIHRoaXMuX2JvbmVSb3RhdGlvblVwZGF0ZUZuKFxuICAgICAgICAgICAgQ29tbGluay50cmFuc2ZlcihhcnJheUJ1ZmZlciwgW2FycmF5QnVmZmVyLmJ1ZmZlcl0pXG4gICAgICAgICk7XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgcG9zZVdyYXBwZXIgPSB7XG4gICAgcG9zZXM6IFBvc2VzLFxufTtcblxuQ29tbGluay5leHBvc2UocG9zZVdyYXBwZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBQb3NlcztcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuLy8gdGhlIHN0YXJ0dXAgZnVuY3Rpb25cbl9fd2VicGFja19yZXF1aXJlX18ueCA9ICgpID0+IHtcblx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG5cdC8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxuXHR2YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvcnMtbm9kZV9tb2R1bGVzX21lZGlhcGlwZV9ob2xpc3RpY19ob2xpc3RpY19qcy1ub2RlX21vZHVsZXNfa2FsbWFuanNfbGliX2thbG1hbl9qcy1ub2RlXy0xNjRmOWJcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvd29ya2VyL3Bvc2UtcHJvY2Vzc2luZy50c1wiKSkpXG5cdF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG5cdHJldHVybiBfX3dlYnBhY2tfZXhwb3J0c19fO1xufTtcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmYgPSB7fTtcbi8vIFRoaXMgZmlsZSBjb250YWlucyBvbmx5IHRoZSBlbnRyeSBjaHVuay5cbi8vIFRoZSBjaHVuayBsb2FkaW5nIGZ1bmN0aW9uIGZvciBhZGRpdGlvbmFsIGNodW5rc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5lID0gKGNodW5rSWQpID0+IHtcblx0cmV0dXJuIFByb21pc2UuYWxsKE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uZikucmVkdWNlKChwcm9taXNlcywga2V5KSA9PiB7XG5cdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5mW2tleV0oY2h1bmtJZCwgcHJvbWlzZXMpO1xuXHRcdHJldHVybiBwcm9taXNlcztcblx0fSwgW10pKTtcbn07IiwiLy8gVGhpcyBmdW5jdGlvbiBhbGxvdyB0byByZWZlcmVuY2UgYXN5bmMgY2h1bmtzIGFuZCBzaWJsaW5nIGNodW5rcyBmb3IgdGhlIGVudHJ5cG9pbnRcbl9fd2VicGFja19yZXF1aXJlX18udSA9IChjaHVua0lkKSA9PiB7XG5cdC8vIHJldHVybiB1cmwgZm9yIGZpbGVuYW1lcyBiYXNlZCBvbiB0ZW1wbGF0ZVxuXHRyZXR1cm4gXCJcIiArIGNodW5rSWQgKyBcIi50ZXN0LmpzXCI7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsInZhciBzY3JpcHRVcmw7XG5pZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5nLmltcG9ydFNjcmlwdHMpIHNjcmlwdFVybCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5sb2NhdGlvbiArIFwiXCI7XG52YXIgZG9jdW1lbnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcuZG9jdW1lbnQ7XG5pZiAoIXNjcmlwdFVybCAmJiBkb2N1bWVudCkge1xuXHRpZiAoZG9jdW1lbnQuY3VycmVudFNjcmlwdClcblx0XHRzY3JpcHRVcmwgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnNyY1xuXHRpZiAoIXNjcmlwdFVybCkge1xuXHRcdHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0aWYoc2NyaXB0cy5sZW5ndGgpIHNjcmlwdFVybCA9IHNjcmlwdHNbc2NyaXB0cy5sZW5ndGggLSAxXS5zcmNcblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGNodW5rc1xuLy8gXCIxXCIgbWVhbnMgXCJhbHJlYWR5IGxvYWRlZFwiXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcInNyY193b3JrZXJfcG9zZS1wcm9jZXNzaW5nX3RzXCI6IDFcbn07XG5cbi8vIGltcG9ydFNjcmlwdHMgY2h1bmsgbG9hZGluZ1xudmFyIGluc3RhbGxDaHVuayA9IChkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdGZvcih2YXIgbW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHR9XG5cdH1cblx0aWYocnVudGltZSkgcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0d2hpbGUoY2h1bmtJZHMubGVuZ3RoKVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkcy5wb3AoKV0gPSAxO1xuXHRwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcbn07XG5fX3dlYnBhY2tfcmVxdWlyZV9fLmYuaSA9IChjaHVua0lkLCBwcm9taXNlcykgPT4ge1xuXHQvLyBcIjFcIiBpcyB0aGUgc2lnbmFsIGZvciBcImFscmVhZHkgbG9hZGVkXCJcblx0aWYoIWluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdGlmKHRydWUpIHsgLy8gYWxsIGNodW5rcyBoYXZlIEpTXG5cdFx0XHRpbXBvcnRTY3JpcHRzKF9fd2VicGFja19yZXF1aXJlX18ucCArIF9fd2VicGFja19yZXF1aXJlX18udShjaHVua0lkKSk7XG5cdFx0fVxuXHR9XG59O1xuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua3YzZF93ZWJcIl0gPSBzZWxmW1wid2VicGFja0NodW5rdjNkX3dlYlwiXSB8fCBbXTtcbnZhciBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiA9IGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gaW5zdGFsbENodW5rO1xuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0IiwidmFyIG5leHQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLng7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnggPSAoKSA9PiB7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLmUoXCJ2ZW5kb3JzLW5vZGVfbW9kdWxlc19tZWRpYXBpcGVfaG9saXN0aWNfaG9saXN0aWNfanMtbm9kZV9tb2R1bGVzX2thbG1hbmpzX2xpYl9rYWxtYW5fanMtbm9kZV8tMTY0ZjliXCIpLnRoZW4obmV4dCk7XG59OyIsIiIsIi8vIHJ1biBzdGFydHVwXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18ueCgpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9